# controller.py
from django.core.mail import send_mail
from django.db import transaction
from django.db.models import Max

from django.views.decorators.csrf import csrf_exempt
from rest_framework.viewsets import ViewSet
from django.conf import settings
from utils.response import responseData

from django.http import HttpResponse
from datetime import datetime
from django.views.decorators.http import require_http_methods
from email_validator import validate_email, EmailNotValidError

from core.models import User, Question, Category, Answer, Tag

import csv, json
from elasticsearch_dsl import Search

from django.template.loader import render_to_string
from django.db.models import Count, F
import bcrypt

from utils.getStartDate import get_start_date
from utils.processCSVFile import process_csv_file
#Export
class ExportController(ViewSet):
    @require_http_methods(['GET'])
    def exportUser(request):
        fields = [f.name for f in User._meta.fields]
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f"attachment; filename={User.__name__}.csv"
        writer = csv.writer(response)

        writer.writerow(fields)

        for row in User.objects.values(*fields):
            writer.writerow([row[field] for field in fields])
            

        return response

    @require_http_methods(['GET'])
    def exportQuestionWithEvaluation(request):
        time_period = request.GET.get('date')
        fields = [f.name for f in Question._meta.fields if (f.name not in ['category', 'user'])]
        header = fields + ['category_name', 'question_asker', 'tags', 'question_evaluator_user_names',\
                            'question_evaluation_types', 'user_like', 'user_rate', 'star_numbers', 'total_star_numbers']

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f"attachment; filename=QuestionWithEvaluation.csv"
        
        writer = csv.DictWriter(response, fieldnames=header)
        writer.writeheader()

        start_date = get_start_date(time_period)

        if start_date is not None:
            questions = Question.objects.filter(created_at__gte=start_date)
        else:
            questions = Question.objects.all()

        for question in questions:
            row = {field: getattr(question, field) for field in fields}

            row['category_name'] = question.category.name if question.category else ''
            row['rating'] = row['rating']
            row['like_count'] = row['like_count']

            try:
                row['question_asker'] = question.user.display_name
            except User.DoesNotExist:
                row['question_asker'] = ''

            tag_ids = question.questiontag_set.all().values_list('tag', flat=True)
            row['tags'] = ', '.join(Tag.objects.filter(id__in=tag_ids).values_list('name', flat=True))

            user_id_like = question.questionlike_set.all().values_list('user_id', flat=True)
            row['user_like'] = ', '.join(User.objects.filter(id__in=user_id_like).values_list('display_name', flat=True))

            user_id_rating = question.questionlike_set.all().values_list('user_id', flat=True)
            row['user_rate'] = ', '.join(User.objects.filter(id__in=user_id_rating).values_list('display_name', flat=True))

            star_numbers = question.questionrating_set.all().values_list('star_number', flat=True)
            row['star_numbers'] = ', '.join(map(str, star_numbers))
            row['total_star_numbers'] = sum(star_numbers)

            evaluation_types = question.questionevaluation_set.all().values_list('evaluation_type', flat=True)
            row['question_evaluation_types'] = ', '.join(evaluation_types)

            evaluator_user_names = question.questionevaluation_set.all().values_list('user__display_name', flat=True)
            row['question_evaluator_user_names'] = ', '.join(evaluator_user_names)

            writer.writerow(row)

        return response

    @require_http_methods(['GET'])
    def exportAnswerWithEvaluation(request):
        time_period = request.GET.get('date')
        answer_fields = [f.name for f in Answer._meta.fields if (f.name not in ['question', 'user_id'])]
        header = answer_fields + ['question_content', 'answerer_name', 'evaluation_types', 'evaluator_user_names']

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f"attachment; filename=AnswerWithEvaluation.csv"

        writer = csv.DictWriter(response, fieldnames=header)
        writer.writeheader()

        start_date = get_start_date(time_period)

        if start_date is not None:
            answers = Answer.objects.filter(created_at__gte=start_date)
        else:
            answers = Answer.objects.all()

        for answer in answers:
            row = {field: getattr(answer, field) for field in answer_fields}

            row['question_content'] = answer.question.content

            row['answerer_name'] = User.objects.get(id=answer.user_id).display_name

            evaluation_types = answer.answerevaluation_set.all().values_list('evaluation_type', flat=True)
            row['evaluation_types'] = ', '.join(evaluation_types)

            evaluator_user_names = answer.answerevaluation_set.all().values_list('user__display_name', flat=True)
            row['evaluator_user_names'] = ', '.join(evaluator_user_names)

            writer.writerow(row)

        return response

# Mail
class MailController(ViewSet):
    @csrf_exempt
    @require_http_methods(['POST'])
    def sendNotificationEmail(request):
        try:
            data = json.loads(request.body)
            content = data.get('content')

        except json.JSONDecodeError:
            return responseData(data=None, status=404, message="Invalid JSON format")
        
        admin_emails = list(User.objects.filter(role='admin', get_notification=True).values_list('email', flat=True))

        email_body = render_to_string('email_template.html', {
            'content': content,
        })
        
        default_subject = 'Notification'
        default_message = 'A user has posted a question'
        try:
            send_mail(default_subject, 
                      default_message, 
                      settings.EMAIL_HOST_USER, 
                      admin_emails, 
                      fail_silently=False, 
                      html_message=email_body)
            
            return responseData(message='Success', status=200, data={})
        except Exception as e:
            return responseData(message='Error', status=500, data={})

#Import
class ImportController(ViewSet):  
    @csrf_exempt 
    @require_http_methods(['POST'])
    def importQuestion(request):
        csv_file = request.FILES.get("files")
        required_headers = {'line_number', 'content', 'category_id', 'user_id'}
        data, error = process_csv_file(csv_file, required_headers)
        
        if error:
            return responseData(data=data, status=500, message=error)

        current_date = datetime.now().strftime('%Y-%m-%d')
        status = 'WAITING'
        questions = []
        last_id = Question.objects.all().aggregate(Max('id')).get('id__max') or 0

        failed_ids = []
        
        for row in data:  
            content = row.get('content')
            category_id = row.get('category_id')
            user_id = row.get('user_id')
            line_number = row.get('line_number')
            
            if not content or len(content) > 500:
                failed_ids.append({'line_number': line_number, 'reason': 'Invalid content'})
                continue
                
            try:
                category_id = int(category_id)
            except (TypeError, ValueError):
                failed_ids.append({'line_number': line_number, 'reason': 'Invalid category_id'})
                continue

            if not Category.objects.filter(id=category_id).exists():
                failed_ids.append({'line_number': line_number, 'reason': f'No category with id {category_id}'})
                continue

            try:
                user_id = int(user_id)
            except (TypeError, ValueError):
                failed_ids.append({'line_number': line_number, 'reason': 'Invalid user_id'})
                continue

            if not User.objects.filter(id=user_id).exists():
                failed_ids.append({'line_number': line_number, 'reason': f'No user with id {user_id}'})
                continue

            last_id += 1

            questions.append(Question(
                id = last_id,
                content=content, 
                category_id=category_id,
                user_id=user_id, 
                created_at=current_date, 
                status=status
            ))
        
        try:
            with transaction.atomic():
                Question.objects.bulk_create(questions)
            
            return responseData(data=failed_ids, message='Success creating questions. Failed question:', status=200)
        
        except Exception as e:
            return responseData(data=failed_ids, message=str(e), status=500)
        
    @csrf_exempt
    @require_http_methods(['POST'])
    def importUser(request):
        csv_file = request.FILES["files"]
        
        required_headers = {'line_number', 'email', 'password', 'name', 'display_name', 'role', 'gender'}
        data, error = process_csv_file(csv_file, required_headers)
        
        if error:
            return responseData(data=data, status=500, message=error)

        users = []
        failed_ids = []
        last_id = User.objects.all().aggregate(Max('id')).get('id__max') or 0

        
        for row in data:  
            email = row.get('email')
            password = row.get('password')
            name = row.get('name')
            display_name = row.get('display_name')
            role = row.get('role').upper() if row.get('role') else 'USER'
            line_number = row.get('line_number')
            gender = row.get('gender').upper() if row.get('gender') else 'MALE'
            
            if not email:
                failed_ids.append({'line_number': line_number, 'reason': 'Invalid email'})
                continue

            try:
                v = validate_email(email) 
                email = v["email"]
            
            except EmailNotValidError as e:
                failed_ids.append({'line_number': line_number, 'reason': str(e)})
                continue

            if User.objects.filter(email=email).exists():
                failed_ids.append({'line_number': line_number, 'reason': 'Email already exists'})
                continue

            last_id += 1

            salt = b"$2a$10$SYxZJIAtGW0.wS06D.hPJe"
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)


            users.append(User(
                id=last_id,
                email=email, 
                password=hashed_password,
                name=name, 
                display_name=display_name, 
                role=role, 
                gender=gender,
                status='ACTIVED',
                get_notification=True,
                answer_count=0, 
                question_count=0, 
                point=0, 
                ranker='SILVER',
                is_anonymous=False, 
                is_authenticated=False, 
                last_login=None,
                is_superuser=False, 
            ))
        
        try:
            with transaction.atomic():
                User.objects.bulk_create(users)
            
            return responseData(data=failed_ids, message='Success creating users. Failed users:', status=200)
        
        except Exception as e:
            return responseData(data=failed_ids, message=str(e), status=500)
        
    @csrf_exempt
    @require_http_methods(['POST'])
    def importAnswer(request):
        csv_file = request.FILES.get("files")
        required_headers = {'line_number', 'content', 'user_id', 'question_id'}
        data, error = process_csv_file(csv_file, required_headers)
        
        if error:
            return responseData(data=data, status=500, message=error)

        current_date = datetime.now().strftime('%Y-%m-%d')
        status = 'WAITING'
        answers = []
        last_id = Answer.objects.all().aggregate(Max('id')).get('id__max') or 0

        failed_ids = []
        
        for row in data:  
            content = row.get('content')
            question_id = row.get('question_id')
            user_id = row.get('user_id')
            line_number = row.get('id')
            
            if not content or len(content) > 500:
                failed_ids.append({'line_number': line_number, 'reason': 'Invalid content'})
                continue

            try:
                user_id = int(user_id)
            except (TypeError, ValueError):
                failed_ids.append({'line_number': line_number, 'reason': 'Invalid user_id'})
                continue

            if not User.objects.filter(id=user_id).exists():
                failed_ids.append({'line_number': line_number, 'reason': f'No user with id {user_id}'})
                continue

            if not Question.objects.filter(id=question_id).exists():
                failed_ids.append({'line_number': line_number, 'reason': f'No question with id {question_id}'})
                continue

            last_id += 1

            answers.append(Answer(
                id = last_id,
                content=content, 
                question_id=question_id,
                user_id=user_id, 
                created_at=current_date, 
                status=status
            ))
        
        try:
            with transaction.atomic():
                Question.objects.bulk_create(answers)
            
            return responseData(data=failed_ids, message='Success creating answers. Failed answers:', status=200)
        
        except Exception as e:
            return responseData(data=failed_ids, message=str(e), status=500)
    
class APIQAController(ViewSet):
    @staticmethod
    def getAllQuestionWithID(self):
        questions = Question.objects.all().values('id', 'content')
        questions_dict = {item['id']: item['content'] for item in questions}
        return questions_dict

    @staticmethod
    def getTop3AnswersFromID(self, questionId):
        try:
            answer_instances = (Answer.objects.filter(question_id=questionId)
                                .annotate(good_count=Count('answerevaluation__id', filter=F('answerevaluation__evaluation_type') == 'GOOD'))
                                .order_by('-good_count')
                                .values('answer_content', 'good_count')[:3])
            
            return [instance['answer_content'] for instance in answer_instances]

        except Answer.DoesNotExist:
            return None

    @staticmethod
    def get_highest_similarity_score(self, new_question_content):
        search = Search(index="questions")
        search = search.query("match", content=new_question_content)
        response = search.execute()

        if response.hits:
            most_similar_question = response.hits[0]
            return most_similar_question.meta.id
        return None
    
    @csrf_exempt
    @require_http_methods(['POST'])
    def getAnswerBasedFromQuestion(request):
        try:
            data = json.loads(request.body)
            question_content = data.get('question_content')
        except json.JSONDecodeError:
            return responseData(data=None, status=404, message="Invalid JSON format")
        
        if not data:
            return responseData(data=None, status=404, message="Can't find question")
        
        best_question_id = APIQAController.get_highest_similarity_score(question_content)
        if(best_question_id):
            answer = APIQAController.getAnswersFromID(best_question_id)
            if (answer):
                return responseData(message='Success', status=200, data=answer)
            else: return responseData(message='Failed finding answer', status=404)
        else: return responseData(message='Question does not exist in the system database', status=404)


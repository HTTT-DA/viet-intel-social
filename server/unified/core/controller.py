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

from core.models import User, Question, Category, Answer, QuestionTag, Tag, AnswerEvaluation, QuestionLike, QuestionRating, UserPoint
from dateutil.relativedelta import relativedelta
from django.core.exceptions import ObjectDoesNotExist

from django.utils import timezone
import csv, codecs, json
from elasticsearch_dsl.query import MultiMatch
from elasticsearch_dsl import Search

from django.template.loader import render_to_string
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
def get_start_date(time_period):
    now = timezone.now()

    if time_period == "last-7-days":
        return now - relativedelta(days=7)
    
    elif time_period == "this-month":
        return now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    elif time_period == "this-quarter":
        quarter_month = (now.month - 1) // 3 * 3 + 1
        return now.replace(month=quarter_month, day=1, hour=0, minute=0, second=0, microsecond=0)
    elif time_period == "this-year":
        return now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    
    return None

#Export
class ExportController(ViewSet):
    @csrf_exempt
    @require_http_methods(['GET'])
    def exportUser(self):
        fields = [f.name for f in User._meta.fields]
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f"attachment; filename={User.__name__}.csv"
        writer = csv.writer(response)

        writer.writerow(fields)

        for row in User.objects.values(*fields):
            writer.writerow([row[field] for field in fields])
            

        return response
    
    @csrf_exempt
    @require_http_methods(['GET'])
    def exportUserWithPoints(self):
        fields = [f.name for f in UserPoint._meta.fields]
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f"attachment; filename={UserPoint.__name__}.csv"
        writer = csv.writer(response)

        writer.writerow(fields)

        for row in UserPoint.objects.values(*fields):
            writer.writerow([row[field] for field in fields])
            

        return response

    @csrf_exempt
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

    @csrf_exempt
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
    @require_http_methods(['POST'])
    @csrf_exempt
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

def process_csv_file(csv_file, required_headers):
    if not csv_file or not csv_file.name.endswith('.csv'):
        return None, 'Failed, not a CSV file'

    try:
        reader = csv.DictReader(codecs.iterdecode(csv_file, 'utf-8'), delimiter=',')
        data = list(reader)
    except Exception as e:
        return None, 'Failed, error reading CSV'
    
    if not data: 
        return None, 'Failed, data is empty'

    if not required_headers.issubset(set(reader.fieldnames)):
        return None, 'Failed, headers are incorrect'
    
    return data, None

#Import
class ImportController(ViewSet):   
    @require_http_methods(['POST'])
    def importQuestion(request):
        csv_file = request.FILES.get("files")
        required_headers = {'id', 'content', 'category_id', 'user_id'}
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
            question_id = row.get('id')
            
            if not content or len(content) > 500:
                failed_ids.append({'id': question_id, 'reason': 'Invalid content'})
                continue
                
            try:
                category_id = int(category_id)
            except (TypeError, ValueError):
                failed_ids.append({'id': question_id, 'reason': 'Invalid category_id'})
                continue

            if not Category.objects.filter(id=category_id).exists():
                failed_ids.append({'id': question_id, 'reason': f'No category with id {category_id}'})
                continue

            try:
                user_id = int(user_id)
            except (TypeError, ValueError):
                failed_ids.append({'id': question_id, 'reason': 'Invalid user_id'})
                continue

            if not User.objects.filter(id=user_id).exists():
                failed_ids.append({'id': question_id, 'reason': f'No user with id {user_id}'})
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
        
    @require_http_methods(['POST'])
    def importUser(request):
        csv_file = request.FILES["files"]
        
        required_headers = {'id', 'email', 'password', 'name', 'display_name', 'role', 'gender'}
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
            user_id = row.get('id')
            gender = row.get('gender').upper() if row.get('gender') else 'MALE'
            
            if not email:
                failed_ids.append({'id': user_id, 'reason': 'Invalid email'})
                continue

            try:
                v = validate_email(email) 
                email = v["email"]
            
            except EmailNotValidError as e:
                failed_ids.append({'id': user_id, 'reason': str(e)})
                continue

            last_id += 1


            users.append(User(
                id=last_id,
                email=email, 
                password=password,
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
        

    @require_http_methods(['POST'])
    def importAnswer(request):
        csv_file = request.FILES.get("files")
        required_headers = {'id', 'content', 'reference', 'image', 'user_id', 'question_id'}
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
            answer_id = row.get('id')
            reference = row.get('reference')
            image = row.get('image')
            
            if not content or len(content) > 500:
                failed_ids.append({'id': answer_id, 'reason': 'Invalid content'})
                continue
                
            try:
                answer_id = int(answer_id)
            except (TypeError, ValueError):
                failed_ids.append({'id': answer_id, 'reason': 'Invalid answer_id'})
                continue

            if not Question.objects.filter(id=answer_id).exists():
                failed_ids.append({'id': answer_id, 'reason': f'No category with id {answer_id}'})
                continue

            try:
                user_id = int(user_id)
            except (TypeError, ValueError):
                failed_ids.append({'id': question_id, 'reason': 'Invalid user_id'})
                continue

            if not User.objects.filter(id=user_id).exists():
                failed_ids.append({'id': question_id, 'reason': f'No user with id {user_id}'})
                continue

            last_id += 1

            answers.append(Question(
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
    def getAllQuestionWithID():
        questions = Question.objects.all().values('id', 'content')
        questions_dict = {item['id']: item['content'] for item in questions}
        return questions_dict

    @staticmethod
    def getAnswerFromID(questionId):
        try:
            answer_instance = Answer.objects.get(question_id=questionId)
            return answer_instance.answer_content
        except Answer.DoesNotExist:
            return None

    @staticmethod
    def get_highest_similarity_score(new_question_content):
        search = Search(index="questions")
        search = search.query("match", content=new_question_content)
        response = search.execute()

        if response.hits:
            most_similar_question = response.hits[0]
            return most_similar_question.meta.id, most_similar_question.meta.score
        return None, None
    
    @require_http_methods(['GET'])
    def getAnswerBasedFromQuestion(request):
        question_content = request.GET.get('question_content')
        best_question_id, point = APIQAController.get_highest_similarity_score(question_content)
        print(best_question_id)
        print(point)
        if(best_question_id):
            answer = APIQAController.getAnswerFromID(best_question_id)
            if (answer):
                return responseData(message='Success', status=200, data=answer)
            else: return responseData(message='Failed finding answer', status=404)
        else: return responseData(message='Question does not exist in the system database', status=404)


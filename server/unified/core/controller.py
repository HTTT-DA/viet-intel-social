# controller.py
from django.core.mail import send_mail
from django.db import transaction

from django.views.decorators.csrf import csrf_exempt
from rest_framework.viewsets import ViewSet
from django.conf import settings
from utils.response import responseData

from django.http import HttpResponse
from datetime import datetime
from django.views.decorators.http import require_http_methods
from email_validator import validate_email, EmailNotValidError
import json

from core.models import User, Question, Category, Answer, QuestionTag, Tag, AnswerEvaluation, QuestionLike, QuestionRating
from dateutil.relativedelta import relativedelta
from django.core.exceptions import ObjectDoesNotExist

from django.utils import timezone



import csv, codecs

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

class ExportController(ViewSet):
    @csrf_exempt
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
    @csrf_exempt
    def sendNotificationEmail(self):
        admin_emails = list(User.objects.filter(role='admin', get_notification=True).values_list('email', flat=True))
        default_subject = 'Notification'
        default_message = 'A user has posted a question'
        try:
            send_mail(default_subject, default_message, settings.EMAIL_HOST_USER, admin_emails, fail_silently=False)
            return responseData(message='Success', status=200, data={'admin_emails': admin_emails})
        except Exception as e:
            print(e)
            return responseData(message='Error', status=500, data={'admin_emails': admin_emails})

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

            questions.append(Question(
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
        

    def importUser(request):
        csv_file = request.FILES.get("files")
        required_headers = {'id', 'email', 'password', 'name', 'display_name', 'role', 'gender'}
        data, error = process_csv_file(csv_file, required_headers)
        
        if error:
            return responseData(data=data, status=500, message=error)

        users = []
        failed_ids = []
        
        for row in data:  
            email = row.get('email')
            password = row.get('password')
            name = row.get('name')
            display_name = row.get('display_name')
            role = row.get('role').upper() if not None else 'USER'
            user_id = row.get('id')
            gender = row.get('gender').upper() if not None else 'MALE'
            
            if not email:
                failed_ids.append({'id': user_id, 'reason': 'Invalid email'})
                continue

            try:
                v = validate_email(email) 
                email = v["email"]
            
            except EmailNotValidError as e:
                failed_ids.append({'id': user_id, 'reason': str(e)})
                continue

            users.append(User(
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
            
#Notiifcation

class NotificationController(ViewSet):
    @require_http_methods(['GET'])
    def getNotificationById(request, userId=2):
        try:
            user = User.objects.get(id=userId)
            notification_type = user.get_notification_type()
            return responseData(message='Success', status=200, data=notification_type)
        

        except ObjectDoesNotExist:
            return responseData(message='User does not exist', status=404)
        
        except Exception as e:
            return responseData(message=str(e), status=500, data={})
        
    @csrf_exempt
    @require_http_methods(['POST'])
    def updateNotification(request):
        try:
            data = json.loads(request.body)
            print(data)
            user_id = data.get('user_id', None)
            notification_type = data.get('notification_type', None)
            
            if user_id and notification_type is not None:
                user = User.objects.get(id=user_id)
                user.get_notification = notification_type
                user.save()
            else:
                return responseData(message='Body is invalid', status=400, data={})
            return responseData(message='Success', status=200)

        except ObjectDoesNotExist:
            return responseData(message='User does not exist', status=404)
    
        except Exception as e:
            return responseData(message=str(e), status=500, data={})
    
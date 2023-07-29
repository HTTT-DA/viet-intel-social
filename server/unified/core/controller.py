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

from core.models import User, Question, Category
# from ...answer.core.models import Answer
# from ...user.core.models import Use
# from ...quesion.core.models import Question

import csv, codecs

# Export
def export(model):
    fields = [f.name for f in model._meta.fields]
    timestamp = datetime.now().isoformat()

    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = f"attachment; filename={model.__name__}_{timestamp}.csv"
    writer = csv.writer(response)

    writer.writerow(fields)

    for row in model.objects.values(*fields):
        writer.writerow([row[field] for field in fields])

    return response


class ExportController(ViewSet):
    @csrf_exempt
    def exportUser(self):
        return export(User)

    @csrf_exempt
    def exportQuestion(self):
        return export(Question)

    @csrf_exempt
    def exportAnswer(self):
        pass
        #return export(Answer)


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
            
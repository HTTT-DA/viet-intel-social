# controller.py
from django.core.mail import send_mail
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt
from services.user.models import User
from django.conf import settings
from utils.response import responseData

class MailController():
    @csrf_exempt
    def sendNotificationEmail(request):
        admin_emails = list(User.objects.filter(role='admin', is_NotifyWhenUserPostQuestion=True).values_list('email', flat=True))

        default_subject = 'Notification'
        default_message = 'A user has posted a question'
    
        try:
            send_mail(default_subject, default_message, settings.EMAIL_HOST_USER, admin_emails, fail_silently=False)
            return responseData(message='Success', status=200, data={'admin_emails': admin_emails})
        except Exception as e:
            print(e)
            return responseData(message='Error', status=500, data={'admin_emails': admin_emails})

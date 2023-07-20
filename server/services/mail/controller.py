# controller.py
from django.core.mail import send_mail
from django.http import JsonResponse
from rest_framework.viewsets import ViewSet
from django.views.decorators.csrf import csrf_exempt
from services.user.models import User
from django.conf import settings

class MailController():
    @csrf_exempt
    def sendNotificationEmail(request):
        admin_emails = list(User.objects.filter(role='admin', is_NotifyWhenUserPostQuestion=True).values_list('email', flat=True))

        default_subject = 'Notification'
        default_message = 'A user has posted a question'
    
        try:
            send_mail(default_subject, default_message, settings.EMAIL_HOST_USER, admin_emails, fail_silently=False)
            return JsonResponse({'status': 'success', 'message': 'Email send successfully.'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})

# controller.py
from django.core.mail import send_mail

from django.views.decorators.csrf import csrf_exempt
from rest_framework.viewsets import ViewSet
from django.conf import settings
from utils.response import responseData

from django.http import HttpResponse
from datetime import datetime

import csv


# Export
def export(name, model):
    fields = [f.name for f in model._meta.fields]
    timestamp = datetime.now().isoformat()

    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = f"attachment; filename={name}_{timestamp}.csv"
    writer = csv.writer(response)

    writer.writerow(fields)

    for row in model.objects.values(*fields):
        writer.writerow([row[field] for field in fields])

    return response


# class ExportController(ViewSet):
#     @csrf_exempt
#     def exportUser(self):
#         return export('user', User)
#
#     @csrf_exempt
#     def exportQuestion(self):
#         return export('question', Question)
#
#     @csrf_exempt
#     def exportAnswer(self):
#         return export('answer', Answer)


# Mail
# class MailController(ViewSet):
#     @csrf_exempt
#     def sendNotificationEmail(self):
#         admin_emails = list(User.objects.filter(role='admin', get_notification=True).values_list('email', flat=True))
#
#         default_subject = 'Notification'
#         default_message = 'A user has posted a question'
#
#         try:
#             send_mail(default_subject, default_message, settings.EMAIL_HOST_USER, admin_emails, fail_silently=False)
#             return responseData(message='Success', status=200, data={'admin_emails': admin_emails})
#         except Exception as e:
#             print(e)
#             return responseData(message='Error', status=500, data={'admin_emails': admin_emails})

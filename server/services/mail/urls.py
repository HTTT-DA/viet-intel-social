from django.urls import path
from services.mail.controller import MailController

urlpatterns = [
    path('send-notification-email/', MailController.sendNotificationEmail),
]


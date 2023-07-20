from django.urls import path
from services.mail.controller import MailController

urlpatterns = [
    path('send/', MailController.sendNotificationEmail),
]


from django.urls import path
from services.utils.controller import MailController, ExportController

urlpatterns = [
    path('send-notification-email/', MailController.sendNotificationEmail),
    
    path('export-user/', ExportController.exportUser),
    path('export-question/', ExportController.exportQuestion),
    path('export-answer/', ExportController.exportAnswer),
]


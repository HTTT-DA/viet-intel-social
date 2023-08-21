from django.urls import path
from core.controller import MailController, ExportController, ImportController, APIQAController

urlpatterns = [
    path('send-notification-email/', MailController.sendNotificationEmail),
    
    path('export-user/', ExportController.exportUser),
    path('export-question/', ExportController.exportQuestionWithEvaluation),
    path('export-answer/', ExportController.exportAnswerWithEvaluation),
    path('export-userpoint/', ExportController.exportUserWithPoints),
    
    path('import-question/', ImportController.importQuestion),
    path('import-user/', ImportController.importUser),

    path('get-answer/', APIQAController.getAnswerBasedFromQuestion),
]


from django.urls import path
from core.controller import MailController, ExportController, ImportController, APIQAController

urlpatterns = [
    path('send-notification-email/', MailController.sendNotificationEmail),
    path('send-notification-new-token/', MailController.sendNotificationNewToken),
    path('send-notification-expired-token/', MailController.sendNotificationExpiredToken),
    
    path('export-user/', ExportController.exportUser),
    path('export-question/', ExportController.exportQuestionWithEvaluation),
    path('export-answer/', ExportController.exportAnswerWithEvaluation),
    path('export-fail-lines/', ExportController.exportFailedLines),
    
    path('import-question/', ImportController.importQuestion),
    path('import-user/', ImportController.importUser),
    path('import-answer/', ImportController.importAnswer),

    path('get-answer/', APIQAController.getAnswerBasedFromQuestion),
]


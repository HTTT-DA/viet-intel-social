from django.urls import path
from services.answer.controller import AnswerController

urlpatterns = [
    path('get-answers-by-id/<int:questionId>/', AnswerController.getAnswersOfQuestion),
    path('<int:answerId>/create-or-update-evaluation/<int:userId>', AnswerController.createOrUpdateEvaluation),
    path('<int:answerId>/delete-evaluation/<int:userId>', AnswerController.deleteEvaluation),
    path('create-answer', AnswerController.createAnswer),
]
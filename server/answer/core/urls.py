from django.urls import path
from core.controller import AnswerController

urlpatterns = [
    path('/get-by-question-id', AnswerController.getAnswersOfQuestion),
    path('', AnswerController.createAnswer),

    path('/<int:answerId>/evaluation/<int:userId>/create-update', AnswerController.createOrUpdateEvaluation),
    path('/<int:answerId>/evaluation/<int:userId>/delete', AnswerController.deleteEvaluation),
]

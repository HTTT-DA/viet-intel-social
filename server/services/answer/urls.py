from django.urls import path
from services.answer.controller import AnswerController

urlpatterns = [
    path('get-answers-by-id/<int:questionId>/', AnswerController.getAnswersOfQuestion),
]
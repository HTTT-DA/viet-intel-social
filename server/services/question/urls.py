from django.urls import path

from services.question.controller import QuestionController

urlpatterns = [
    path('get-all-accepted-question', QuestionController.getAllQuestionOrderByNewestTime),
    path('like', QuestionController.likeQuestion)
]
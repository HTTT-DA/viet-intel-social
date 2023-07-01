from django.urls import path

from services.question.controller import QuestionController

urlpatterns = [
    path('get-all-accepted-question', QuestionController.getAllQuestionOrderByNewestTime),
    path('like', QuestionController.likeQuestion),
    path('get-list-category', QuestionController.getListCategory),
    path('get-list-tag', QuestionController.getListTag),
    path('create-tag', QuestionController.createTag),
    path('create-question', QuestionController.createQuestion),
]
from django.urls import path

from services.question.controller import QuestionController

urlpatterns = [
    path('get-questions', QuestionController.getAllQuestionOrderByNewestTime),
    path('get-questions-by-category', QuestionController.getAllQuestionByCategory),
    path('get-questions-by-time', QuestionController.getQuestionOrderByTime),
    path('get-questions-by-like', QuestionController.getQuestionOrderByLike),
    path('get-questions-by-rating', QuestionController.getQuestionOrderByRating),
    path('like', QuestionController.likeQuestion),
    path('get-list-category', QuestionController.getListCategory),
    path('get-list-tag', QuestionController.getListTag),
    path('create-tag', QuestionController.createTag),
    path('create-question', QuestionController.createQuestion),
]
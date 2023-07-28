from django.urls import path

from core.controller import QuestionController

urlpatterns = [
    # Read
    path('/questions', QuestionController.getAllQuestionOrderByNewestTime),
    path('/questions/find-by-category-id', QuestionController.getAllQuestionByCategory),
    path('/questions/order-by-time', QuestionController.getQuestionOrderByTime),
    path('/questions/order-by-like', QuestionController.getQuestionOrderByLike),
    path('/questions/order-by-rating', QuestionController.getQuestionOrderByRating),

    # Create - Update - Delete
    path('/questions/like', QuestionController.likeQuestion),
    path('/questions/create', QuestionController.createQuestion),
    path('/questions/evaluate', QuestionController.evaluateQuestion),
    path('/questions/rating', QuestionController.ratingQuestion),

    # Tag
    path('/tags', QuestionController.getListTag),
    path('/tags', QuestionController.createTag),
]
from django.urls import path

from core.controller import QuestionController

urlpatterns = [
    # Read
    path('questions', QuestionController.getAllQuestionOrderByNewestTime),
    path('questions/find-by-category-id', QuestionController.getAllQuestionByCategory),
    path('questions/order-by-time', QuestionController.getQuestionOrderByTime),
    path('questions/order-by-like', QuestionController.getQuestionOrderByLike),
    path('questions/order-by-rating', QuestionController.getQuestionOrderByRating),
    path('questions/get-detail-admin/<int:questionId>', QuestionController.getDetailQuestionForAdmin),
    path('questions/get-all-admin', QuestionController.getAllQuestionsForAdmin),
    path('questions/get-content/<int:questionId>', QuestionController.getContentForAnswer),
    path('questions/count', QuestionController.countAllQuestions),
    path('questions/authenticated/get-all', QuestionController.getAllQuestionAuthenticated),

    # Create - Update - Delete
    path('questions/like', QuestionController.likeQuestion),
    path('questions/create', QuestionController.createQuestion),
    path('questions/evaluate', QuestionController.evaluateQuestion),
    path('questions/rating', QuestionController.ratingQuestion),
    path('questions/decline/<int:questionId>', QuestionController.declinePendingQuestion),
    path('questions/accept/<int:questionId>', QuestionController.acceptPendingQuestion),

    # Tag
    path('tags', QuestionController.getListTag),
    path('tags', QuestionController.createTag),
]
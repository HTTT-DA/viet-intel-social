from django.urls import path

from services.question.controller import QuestionController, CategoryController

urlpatterns = [
    path('get-questions', QuestionController.getAllQuestionOrderByNewestTime),
    path('get-questions-by-category', QuestionController.getAllQuestionByCategory),
    path('get-questions-by-time', QuestionController.getQuestionOrderByTime),
    path('get-questions-by-like', QuestionController.getQuestionOrderByLike),
    path('get-questions-by-rating', QuestionController.getQuestionOrderByRating),
    path('like', QuestionController.likeQuestion),
    path('create-question', QuestionController.createQuestion),
    path('evaluate', QuestionController.evaluateQuestion),
    path('rating', QuestionController.ratingQuestion),
    # Tag
    path('get-list-tag', QuestionController.getListTag),
    path('create-tag', QuestionController.createTag),
    # Category
    path('get-all-categories', CategoryController.getAllCategories),
    path('get-available-categories', CategoryController.getAvailableCategories),
    path('add-category', CategoryController.addCategory),
    path('delete-category/<int:categoryId>/', CategoryController.deleteCategory)
]
from django.urls import path
from core.controller import CategoryController

urlpatterns = [
    path('/all', CategoryController.getAllCategories),
    path('/available', CategoryController.getAvailableCategories),
    path('/<int:categoryId>', CategoryController.getCategoryById),
    path('', CategoryController.addCategory),
    path('/<int:categoryId>', CategoryController.deleteCategory),
    path('/search', CategoryController.findCategories)
]
from django.urls import path
from services.category.controller import CategoryController

urlpatterns = [
    path('get-all-categories', CategoryController.getAllCategories),
    path('get-available-categories', CategoryController.getAvailableCategories),
    path('add-category', CategoryController.addCategory),
    path('delete-category', CategoryController.deleteCategory)
]
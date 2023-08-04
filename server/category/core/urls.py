from django.urls import path
from core.controller import CategoryController

urlpatterns = [
    path('all', CategoryController.getAllCategories),
    path('available', CategoryController.getAvailableCategories),
    path('<int:categoryId>', CategoryController.getCategoryById),
    path('create', CategoryController.addCategory),
    path('delete/<int:categoryId>', CategoryController.deleteCategory),
    path('search', CategoryController.findCategories),
    path('count', CategoryController.countCategories),
    path('check/<str:categoryName>', CategoryController.findCategoryByName)
]
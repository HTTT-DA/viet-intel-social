from django.urls import path
from core.controller import CategoryController

urlpatterns = [
    path('available', CategoryController.getAvailableCategories),
    path('all', CategoryController.getAllCategories),
    path('<int:categoryId>', CategoryController.getCategoryById),
    path('get-category/<int:categoryId>', CategoryController.getCategoryByIdForAdmin),
    path('create', CategoryController.addCategory),
    path('delete/<int:categoryId>', CategoryController.deleteCategory),
    path('search', CategoryController.findCategories),
    path('count', CategoryController.countCategories),
    path('check/<str:categoryName>', CategoryController.findCategoryByName)
]
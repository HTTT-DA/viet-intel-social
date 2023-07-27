from django.db import IntegrityError
from django.views.decorators.http import require_http_methods
from rest_framework.viewsets import ViewSet

from services.category.models import Category
from services.question.serializer import CategorySerializer
from utils.response import responseData


class CategoryController(ViewSet):
    @staticmethod
    @require_http_methods(['GET'])
    def getAllCategories(request):
        try:
            queryset = Category.objects.all()
            serializer = CategorySerializer(queryset, many=True)
            return responseData(data=serializer.data)
        except IntegrityError as e:
            print(e)
            return responseData(None, status=4, message="Error when get all categories from Category-Services")

    @staticmethod
    @require_http_methods(['GET'])
    def getAvailableCategories(request):
        try:
            queryset = Category.objects.filter(is_deleted=False)
            return responseData(data=CategorySerializer(queryset, many=True).data)
        except IntegrityError as e:
            print(e)
            return responseData(None, status=4,
                                message="Error when get available categories from Category-Services")

    @staticmethod
    @require_http_methods(['POST'])
    def addCategory(request):
        # Add category
        try:
            nameCategory = category.strip()
            queryset = Category.objects.filter(name=nameCategory)
            # Check if category is existed or not
            if queryset.exists():
                return responseData(None, status=5,
                                    message="Category is existed when add category from Category-Services")

            Category.objects.create(name=nameCategory)
        except IntegrityError as e:
            print(e)
            return responseData(None, status=4,
                                message="Error when add category into DB in Category-Services")

        return responseData(None, message="Add category successfully from Category-Services")

    @staticmethod
    @require_http_methods(['POST'])
    def deleteCategory(request, categoryId):
        try:
            Category.objects.filter(id=categoryId).update(is_deleted=True)
        except IntegrityError as e:
            print(e)
            return responseData(
                None,
                status=4,
                message="Error when delete category in Category-Services"
            )

        return responseData(None, message="Delete category successfully from Category-Services")

    @staticmethod
    @require_http_methods(['GET'])
    def findCategories(request):
        category = request.data.get('categoryName')
        
        try:
            queryset = Category.objects.all()
            serializer = CategorySerializer(queryset, many=True)
            return responseData(data=serializer.data)
        except IntegrityError as e:
            print(e)
            return responseData(None, status=4, message="Error when get all categories from Category-Services")

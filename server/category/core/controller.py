import json

from django.db import IntegrityError
from django.views.decorators.http import require_http_methods
from rest_framework.viewsets import ViewSet

from core.models import Category
from core.serializer import CategorySerializer, CategoryIdNameSerializer
from utils.response import responseData


class CategoryController(ViewSet):
    @staticmethod
    @require_http_methods(['GET'])
    def getAllCategories(request):
        try:
            queryset = Category.objects.all()
            return responseData(data=CategorySerializer(queryset, many=True).data)
        except IntegrityError as e:
            print(e)
            return responseData(None, status=500, message="Error when get all categories")

    @staticmethod
    @require_http_methods(['GET'])
    def getAvailableCategories(request):
        try:
            queryset = Category.objects.filter(is_deleted=False)
            return responseData(data=CategorySerializer(queryset, many=True).data)
        except IntegrityError as e:
            print(e)
            return responseData(None, status=500, message="Error when get available categories")

    @staticmethod
    @require_http_methods(['GET'])
    def getCategoryById(request, categoryId):
        try:
            queryset = Category.objects.filter(id=categoryId)
            return responseData(data=CategoryIdNameSerializer(queryset, many=True).data)
        except IntegrityError as e:
            print(e)
            return responseData(None, status=500, message="Error when get category by id")

    @staticmethod
    @require_http_methods(['POST'])
    def addCategory(request):
        try:
            try:
                data = json.loads(request.body)
                nameCategory = data.get('name')
            except json.JSONDecodeError:
                return responseData(status=404, message="Invalid JSON format", data=None)

            if Category.objects.filter(name=nameCategory).exists():
                return responseData(None, status=400, message="Category already exists")

            Category.objects.create(name=nameCategory)
            return responseData(None, message="Add core successfully from Category-Services")
        except IntegrityError as e:
            print(e)
            return responseData(None, status=500,message="Error when add core into DB in Category-Services")

    @staticmethod
    @require_http_methods(['DELETE'])
    def deleteCategory(request, categoryId):
        try:
            Category.objects.filter(id=categoryId).update(is_deleted=True)
            return responseData(None, message="Delete core successfully from Category-Services")
        except IntegrityError as e:
            print(e)
            return responseData(None, status=500, message="Error when delete core from DB in Category-Services")

    @staticmethod
    @require_http_methods(['GET'])
    def findCategories(request):
        try:
            category_name = request.GET.get('categoryName')
            if not category_name:
                return responseData(None, status=400, message="Category name is required")

            queryset = Category.objects.filter(name__icontains=category_name)
            serializer = CategorySerializer(queryset, many=True)
            return responseData(data=serializer.data)
        except IntegrityError as e:
            print(e)
            return responseData(None, status=500, message="Error when find categories")

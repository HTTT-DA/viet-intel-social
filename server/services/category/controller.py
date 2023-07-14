# Models
from services.category.models import Category
# Serializers
from services.category.serializer import CategorySerializer
# Rest Framework
from rest_framework.viewsets import ViewSet
# Utilities
from django.db import IntegrityError
from django.views.decorators.http import require_http_methods
import re
import json
# Helpers
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
            return responseData(None, status=4, message="Error when get available categories from Category-Services")

    @staticmethod
    @require_http_methods(['POST'])
    def addCategory(request):
        validateMailRegex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        data = json.loads(request.body)
        userEmail = data.get("email", None)
        category = data.get("category", None)

        # Validate input
        if userEmail is None or category is None \
                or not isinstance(userEmail, str) or not isinstance(category, str) \
                or len(category) == 0 or not re.fullmatch(validateMailRegex, userEmail):
            return responseData(None, status=5, message="Invalid input when add category from Category-Services")

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
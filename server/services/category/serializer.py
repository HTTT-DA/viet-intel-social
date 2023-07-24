from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from services.category.models import Category


class CategorySerializer(ModelSerializer):
    isDeleted = serializers.BooleanField(source='is_deleted')

    class Meta:
        model = Category
        fields = "__all__"
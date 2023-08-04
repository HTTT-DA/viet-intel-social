from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from core.models import Category


class CategorySerializer(ModelSerializer):
    isDeleted = serializers.BooleanField(source='is_deleted')

    class Meta:
        model = Category
        fields = ['id', 'name', 'isDeleted']


class CategoryIdNameSerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')
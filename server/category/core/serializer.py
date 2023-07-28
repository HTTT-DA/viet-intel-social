from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from core.models import Category


class CategorySerializer(ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"


class CategoryIdNameSerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')
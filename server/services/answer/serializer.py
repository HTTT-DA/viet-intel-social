from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from services.answer.models import Answer


class AnswerSerializer(ModelSerializer):
    name = serializers.CharField(source='user.name')
    avatar = serializers.CharField(source='user.avatar')
    userID = serializers.CharField(source='user.id')

    class Meta:
        model = Answer
        fields = ('id', 'content', 'created_at', 'name', 'avatar', 'userID', 'reference', 'image')

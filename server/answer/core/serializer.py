from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from core.models import Answer


class AnswerSerializer(ModelSerializer):
    user = serializers.JSONField()
    evaluations = serializers.ListField()

    class Meta:
        model = Answer
        fields = ('id', 'question_id', 'content', 'reference', 'image', 'status', 'created_at', 'user', 'evaluations')
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from core.models import Question, Tag, QuestionRating


class QuestionRatingSerializer(ModelSerializer):
    class Meta:
        model = QuestionRating
        fields = "__all__"


class QuestionSerializer(ModelSerializer):
    tags = serializers.ListField()
    ratings = serializers.ListField()
    owner = serializers.JSONField()
    category = serializers.JSONField()

    class Meta:
        model = Question
        fields = ('id', 'content', 'created_at', 'tags', 'ratings', 'owner', 'like_count', 'rating', 'category')


class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ('name', 'id')


class QuestionLikeSerializer(ModelSerializer):
    class Meta:
        model = Question
        fields = ('user', 'question')

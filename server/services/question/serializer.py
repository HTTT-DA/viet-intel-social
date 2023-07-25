from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from services.category.serializer import CategorySerializer
from services.question.models import Question, Tag, QuestionRating
from services.user.serializer import UserSerializer, UserIdSerializer


class QuestionRatingSerializer(ModelSerializer):
    class Meta:
        model = QuestionRating
        fields = "__all__"


class QuestionSerializer(ModelSerializer):
    user = serializers.SerializerMethodField('getUserInfo')
    tags = serializers.SerializerMethodField('getTags')
    category = serializers.SerializerMethodField('getCategory')
    ratings = serializers.ListField()

    class Meta:
        model = Question
        fields = '__all__'

    @staticmethod
    def getTags(obj):
        tags = obj.tags.all()
        return TagSerializer(tags, many=True).data

    @staticmethod
    def getUserInfo(obj):
        user = obj.user
        return UserSerializer(user).data

    @staticmethod
    def getCategory(obj):
        category = obj.category
        return CategorySerializer(category).data

    @staticmethod
    def getLike(obj):
        likes = obj.likes.all()
        return UserIdSerializer(likes, many=True).data


class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ('name', 'id')


class QuestionLikeSerializer(ModelSerializer):
    class Meta:
        model = Question
        fields = ('user', 'question')

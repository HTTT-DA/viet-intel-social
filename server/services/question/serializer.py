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


class QuestionAdminSerializer(ModelSerializer):
    user = serializers.SerializerMethodField('getUserInfo')
    category = serializers.SerializerMethodField('getCategoryInfo')

    class Meta:
        model = Question
        fields = ('id', 'content', 'status', 'created_at', 'user', 'category')

    def to_representation(self, instance):
        detail_mode = self.context.get('detail_mode', True)
        if not detail_mode:
            # Nếu không ở chế độ chi tiết, loại bỏ các trường không cần thiết
            ret = super().to_representation(instance)
            ret.pop('content', None)
            ret.pop('created_at', None)
            return ret
        return super().to_representation(instance)

    @staticmethod
    def getUserInfo(obj):
        userData = {
            'userId': obj.user.id if obj.user else -1,
            'userEmail': obj.user.email if obj.user else ''
        }
        return userData

    @staticmethod
    def getCategoryInfo(obj):
        categoryData = {
            'categoryId': obj.category.id if obj.category else -1,
            'categoryName': obj.category.name if obj.category else ''
        }
        return categoryData

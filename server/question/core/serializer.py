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


class QuestionAdminSerializer(ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'content', 'status', 'created_at', 'user_id', 'category_id')

    def to_representation(self, instance):
        detail_mode = self.context.get('detail_mode', True)
        if not detail_mode:
            # Nếu không ở chế độ chi tiết, loại bỏ các trường không cần thiết
            ret = super().to_representation(instance)
            ret.pop('content', None)
            return ret
        return super().to_representation(instance)
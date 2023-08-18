from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from core.models import Answer


class AnswerSerializer(ModelSerializer):
    user = serializers.JSONField()
    evaluations = serializers.ListField()

    class Meta:
        model = Answer
        fields = ('id', 'question_id', 'content', 'reference', 'image', 'status', 'created_at', 'user', 'evaluations')


class AnswerAdminSerializer(ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'

    def to_representation(self, instance):
        detail_mode = self.context.get('detail_mode', True)
        if not detail_mode:
            # Nếu không ở chế độ chi tiết, loại bỏ các trường không cần thiết
            ret = super().to_representation(instance)
            ret.pop('content', None)
            ret.pop('reference', None)
            ret.pop('image', None)
            return ret
        return super().to_representation(instance)
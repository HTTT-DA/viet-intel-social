from rest_framework.serializers import ModelSerializer

from services.user.models import User, UserPoint
from rest_framework import serializers


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'avatar', 'display_name', 'city',
                  'gender', 'answer_count', 'question_count', 'point', 'role')


class UserIdSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id',)


class UserPointIdSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'avatar', 'name', 'display_name')


class OtherUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'avatar', 'display_name', 'email', 'gender',
                  'city', 'role', 'question_count', 'answer_count', 'point')


class UserPointSerializer(ModelSerializer):
    user = serializers.SerializerMethodField('getUserInfo')

    @staticmethod
    def getUserInfo(obj):
        user = obj.user
        return UserPointIdSerializer(user).data

    class Meta:
        model = UserPoint
        fields = ('point', 'user')

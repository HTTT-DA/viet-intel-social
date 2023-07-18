from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        refresh_token = super(MyTokenObtainPairSerializer, cls).get_token(user)
        access_token = refresh_token.access_token
        access_token['id'] = user.id
        access_token['name'] = user.name
        access_token['email'] = user.email
        access_token['avatar'] = user.avatar
        access_token['display_name'] = user.display_name
        access_token['city'] = user.city
        access_token['gender'] = user.gender
        access_token['answer_count'] = user.answer_count
        access_token['question_count'] = user.question_count
        access_token['point'] = user.point
        access_token['role'] = user.role
        return access_token, refresh_token
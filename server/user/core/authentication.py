from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token_for_user(cls, user):
        refresh_token = super().get_token(user)
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
        access_token['ranker'] = user.ranker

        return access_token, refresh_token

    @classmethod
    def get_token_for_admin(cls, user):
        refresh_token = super().get_token(user)
        access_token = refresh_token.access_token
        access_token['id'] = user.id
        access_token['email'] = user.email
        access_token['display_name'] = user.display_name
        access_token['role'] = user.role

        return access_token, refresh_token

    @classmethod
    def get_new_access_token(cls, user):
        access_token = super().get_token(user).access_token

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
        access_token['ranker'] = user.ranker

        return access_token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class CustomUserModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()

        try:
            user = UserModel.objects.get(email=username)
        except UserModel.DoesNotExist:
            return None

        if user.check_password(password):
            return user

        return None

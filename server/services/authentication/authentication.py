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
        access_token['role'] = user.role

        return access_token, refresh_token

    def get_token_for_admin(cls, user):
        refresh_token = super(MyTokenObtainPairSerializer, cls).get_token(user)
        access_token = refresh_token.access_token
        access_token['id'] = user.id
        access_token['email'] = user.email
        access_token['display_name'] = user.display_name
        access_token['role'] = user.role

        return access_token, refresh_token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

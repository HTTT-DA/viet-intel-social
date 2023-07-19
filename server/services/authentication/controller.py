import json

from django.core.validators import EmailValidator
from django.views.decorators.http import require_http_methods
from rest_framework.viewsets import ViewSet

from services.user.models import User
from services.user.serializer import UserSerializer
from services.authentication.authentication import MyTokenObtainPairSerializer
from utils.response import responseData

import traceback


class AuthController(ViewSet):
    @staticmethod
    @require_http_methods(['POST'])
    def signIn(request):
        try:
            data = json.loads(request.body)

            email = data.get('email').strip()
            if not EmailValidator(email):
                return responseData(message='Email is invalid', status=400, data={})

            password = data.get('password').strip()

            if not email or not password:
                return responseData(message='Email and password are required', status=401, data={})

            data = User.objects.filter(email=email, password=password).first()
            if data is None:
                return responseData(message='Email or password is incorrect', status=404, data={})

            access_token, refresh_token = MyTokenObtainPairSerializer().get_token_for_user(data)
            print('access: ', access_token)
            print('refresh: ', refresh_token)

            return responseData(message='Success', status=200, data=UserSerializer(data).data)
        except Exception as e:
            print(traceback.format_exc())
            print(e)
            return responseData(message='Error', status=500, data={})

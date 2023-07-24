import json

import jwt
from decouple import config
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

            email = data.get('email')
            if not EmailValidator(email):
                return responseData(message='Email is invalid', status=400, data={})

            password = data.get('password').strip()

            if not email or not password:
                return responseData(message='Email and password are required', status=401, data={})

            data = User.objects.filter(email=email, password=password).first()
            if data is None:
                return responseData(message='Email or password is incorrect', status=404, data={})

            access_token, refresh_token = MyTokenObtainPairSerializer().get_token_for_user(data)

            return responseData(message='Success', status=200, data={
                'access_token': str(access_token),
                'refresh_token': str(refresh_token)
            })
        except Exception as e:
            print(e)
            return responseData(message='Error', status=500, data={})

    @staticmethod
    @require_http_methods(['POST'])
    def signUp(request):
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            fullName = data.get('full name')
            displayName = data.get('display name')

            if not email or not password:
                return responseData(message='Email and password are required', status=400, data={})

            if not EmailValidator(email):
                return responseData(message='Email is invalid', status=400, data={})

            user = User.objects.filter(email=email).first()

            if user is not None:
                return responseData(message='User already exists', status=401, data={})

            User.objects.create(
                email=email,
                password=password,
                name=fullName,
                display_name=displayName,
                role='USER',
                avatar='',
                city='',
                status='ACTIVED',
                get_notification=True,
                answer_count=0,
                question_count=0,
                point=0,
                ranker='SILVER',
                is_anonymous=False,
                is_authenticated=False,
                last_login=None,
                is_superuser=False,
                gender='MALE'
            )

            userResponse = User.objects.filter(email=email).first()

            return responseData(message='Success', status=200, data=UserSerializer(userResponse).data)
        except Exception as e:
            print(e)
            return responseData(message='Error', status=500, data={})

    @staticmethod
    @require_http_methods(['PUT'])
    def changePassword(request, userId):
        try:
            data = json.loads(request.body)
            oldPassword = data.get('old_password').strip()
            newPassword = data.get('new_password').strip()

            if not userId or not oldPassword or not newPassword:
                return responseData(message='User id, old password and new password are required', status=400, data={})

            user = User.objects.filter(id=userId, password=oldPassword).first()
            if user is None:
                return responseData(message='User not found', status=404, data={})

            User.objects.filter(id=userId).update(password=newPassword)
            return responseData(message='Success', status=200, data={})
        except Exception as e:
            print(e)
            return responseData(message='Error', status=500, data={})

    @staticmethod
    @require_http_methods(['POST'])
    def getNewAccessToken(request):
        try:
            data = json.loads(request.body)
            refresh_token = data.get('refresh_token').strip()
            if not refresh_token:
                return responseData(message='Refresh token is required', status=400, data={})

            decoded = jwt.decode(refresh_token, config('JWT_SECRET_KEY'), algorithms=[config('JWT_ALGORITHM')])

            user = User.objects.filter(id=decoded['user_id']).first()

            access_token = MyTokenObtainPairSerializer().get_new_access_token(user)

            return responseData(message='Success', status=200, data={
                'access_token': str(access_token),
            })
        except Exception as e:
            print(e)
            return responseData(message='Error', status=500, data={})

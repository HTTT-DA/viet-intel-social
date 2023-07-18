import json
from datetime import datetime

from django.core.validators import EmailValidator
from django.views.decorators.http import require_http_methods
from rest_framework.viewsets import ViewSet
from rest_framework_simplejwt.views import TokenObtainPairView

from services.user.models import User, UserPoint
from services.user.serializer import UserSerializer, UserPointSerializer, OtherUserSerializer, \
    MyTokenObtainPairSerializer
from utils.response import responseData


class UserController(ViewSet):
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

            access_token, refresh_token = MyTokenObtainPairSerializer.get_token(data)
            print('access: ', access_token)
            print('ref: ', refresh_token)

            return responseData(message='Success', status=200, data=UserSerializer(data).data)
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
                point=0
            )

            userResponse = User.objects.filter(email=email).first()

            return responseData(message='Success', status=200, data=UserSerializer(userResponse).data)
        except Exception as e:
            print(e)
            return responseData(message='Error', status=500, data={})

    @staticmethod
    @require_http_methods(['GET'])
    def getLeaderboardOfMonth(request):
        try:
            data = UserPoint.objects.filter(year=datetime.now().year, month=datetime.now().month).order_by('-point')[
                   :10]
            return responseData(message='Success', status=200, data=UserPointSerializer(data, many=True).data)
        except Exception as e:
            print(e)
            return responseData(message='Error', status=500, data={})

    @staticmethod
    @require_http_methods(['PUT'])
    def updateUser(request, userId):
        try:
            data = json.loads(request.body)
            User.objects.filter(id=userId).update(**data)
            user = User.objects.get(id=userId)
            return responseData(message='Success', status=200, data=UserSerializer(user).data)
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
    @require_http_methods(['GET'])
    def getUserProfileById(request, userId):
        try:
            user = User.objects.get(id=userId)
            return responseData(message='Success', status=200, data=OtherUserSerializer(user).data)
        except Exception as e:
            print(e)
            return responseData(message='Error', status=500, data={})


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
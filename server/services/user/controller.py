import json
from datetime import datetime

from django.views.decorators.http import require_http_methods
from rest_framework.viewsets import ViewSet
from services.user.models import User, UserPoint
from services.user.serializer import UserSerializer, UserPointSerializer, OtherUserSerializer
from utils.response import responseData


class UserController(ViewSet):
    @staticmethod
    @require_http_methods(['POST'])
    def signIn(request):
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            if not email or not password:
                return responseData(message='Email and password are required', status=401, data={})

            data = User.objects.filter(email=email, password=password).first()
            if data is None:
                return responseData(message='Email or password is incorrect', status=404, data={})

            user = UserSerializer(data).data
            return responseData(message='Success', status=200, data=user)
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
            data = UserPoint.objects.filter(year=datetime.now().year, month=datetime.now().month).order_by('-point')[:10]
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
            oldPassword = data.get('old_password')
            newPassword = data.get('new_password')

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
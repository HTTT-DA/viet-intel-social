import json
from datetime import datetime

from django.views.decorators.http import require_http_methods
from rest_framework.viewsets import ViewSet

from services.authentication.authentication import MyTokenObtainPairSerializer
from services.user.models import User, UserPoint
from services.user.serializer import UserPointSerializer, OtherUserSerializer
from utils.response import responseData


class UserController(ViewSet):
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

            access_token, refresh_token = MyTokenObtainPairSerializer().get_token_for_user(user)
            return responseData(message='Success', status=200, data={
                'access_token': str(access_token),
                'refresh_token': str(refresh_token)
            })
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
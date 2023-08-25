import json
from datetime import datetime

import jwt
from decouple import config
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.viewsets import ViewSet

from core.authentication import MyTokenObtainPairSerializer
from core.models import User, UserPoint
from core.serializer import UserPointSerializer, OtherUserSerializer, QuestionOwnerSerializer, UserAdminSerializer
from utils.response import responseData


class UserController(ViewSet):
    @staticmethod
    @require_http_methods(['GET'])
    def getLeaderboardOfMonth(request):
        try:
            data = UserPoint.objects \
                       .filter(year=datetime.now().year, month=datetime.now().month) \
                       .order_by('-point')[:10]
            return responseData(message='Success', status=200, data=UserPointSerializer(data, many=True).data)
        except Exception as e:
            print(e)
            return responseData(message='Error', status=500, data={})

    @staticmethod
    @require_http_methods(['POST'])
    def updateUser(request):
        try:
            try:
                token = request.headers['Authorization'].split(' ')[1]
                user_id = jwt.decode(token, config('JWT_SECRET_KEY'), algorithms=[config('JWT_ALGORITHM')])['user_id']
            except (KeyError, jwt.ExpiredSignatureError, jwt.DecodeError):
                return responseData(message='Invalid token', status=400, data={})

            try:
                data = json.loads(request.body)
            except json.decoder.JSONDecodeError:
                return responseData(message='Body is invalid', status=400, data={})

            User.objects.filter(id=user_id).update(**data)
            user = User.objects.get(id=user_id)
            access_token = MyTokenObtainPairSerializer().get_new_access_token(user)
            return responseData(message='Success', status=200, data={'access_token': str(access_token)})
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

    @staticmethod
    @require_http_methods(['POST'])
    def updateAvatar(request):
        try:
            try:
                token = request.headers['Authorization'].split(' ')[1]
                user_id = jwt.decode(token, config('JWT_SECRET_KEY'), algorithms=[config('JWT_ALGORITHM')])['user_id']
            except (KeyError, jwt.ExpiredSignatureError, jwt.DecodeError):
                return responseData(message='Invalid token', status=400, data={})

            try:
                data = json.loads(request.body)
                User.objects.filter(id=user_id).update(avatar=data['avatar'])
            except json.decoder.JSONDecodeError:
                return responseData(message='Body is invalid', status=400, data={})

            access_token = MyTokenObtainPairSerializer().get_new_access_token(User.objects.get(id=user_id))
            return responseData(message='Success', status=200, data={'access_token': str(access_token)})
        except Exception as e:
            print(e)
            return responseData(message='Error', status=500, data={})

    @staticmethod
    @require_http_methods(['GET'])
    def getInfoForQuestion(request, userId):
        try:
            user = User.objects.get(id=userId)
            return responseData(message='Success', status=200, data=QuestionOwnerSerializer(user).data)
        except Exception as e:
            print(e)
            return responseData(message='Error', status=500, data={})

    @staticmethod
    @require_http_methods(['POST'])
    def signIn(request):
        try:
            try:
                data = json.loads(request.body)
                email = data.get('email')
                password = data.get('password').strip()
            except json.decoder.JSONDecodeError:
                return responseData(message='Body is invalid', status=400, data={})

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return responseData(message='User does not exist', status=404, data={})

            if user.password != password:
                return responseData(message='Password is incorrect', status=400, data={})

            access_token, refresh_token = MyTokenObtainPairSerializer().get_token_for_user(user)

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
            try:
                data = json.loads(request.body)
                email = data.get('email')
                password = data.get('password')
            except json.decoder.JSONDecodeError:
                return responseData(message='Body is invalid', status=400, data={})

            try:
                User.objects.filter(email=email).first()
            except User.DoesNotExist:
                return responseData(message='User does not exist', status=404, data={})

            User.objects \
                .create(email=email, password=password, name=data.get('full name'),
                        display_name=data.get('display name'), role='USER',
                        avatar='', city='', status='ACTIVED', get_notification=True,
                        answer_count=0, question_count=0, point=0, ranker='SILVER',
                        is_anonymous=False, is_authenticated=False, last_login=None,
                        is_superuser=False, gender='MALE')

            userResponse = User.objects.filter(email=email).first()
            access_token, refresh_token = MyTokenObtainPairSerializer().get_token_for_user(userResponse)
            return responseData(message='Success', status=200, data={
                'access_token': str(access_token),
                'refresh_token': str(refresh_token)
            })
        except Exception as e:
            print(e)
            return responseData(message='Error', status=500, data={})

    @staticmethod
    @require_http_methods(['POST'])
    def changePassword(request):
        try:
            try:
                data = json.loads(request.body)
                old_password = data.get('old_password', '').strip()
                new_password = data.get('new_password', '').strip()
            except json.JSONDecodeError:
                return responseData(message='Invalid JSON', status=400, data={})

            if not old_password or not new_password:
                return responseData(message='Old password and new password are required', status=400, data={})

            try:
                token = request.headers['Authorization'].split(' ')[1]
                user_id = jwt.decode(token, config('JWT_SECRET_KEY'), algorithms=[config('JWT_ALGORITHM')])['user_id']
            except (KeyError, jwt.ExpiredSignatureError, jwt.DecodeError):
                return responseData(message='Invalid token', status=400, data={})

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return responseData(message='User does not exist', status=404, data={})

            if not user.password == old_password:
                return responseData(message='Old password is incorrect', status=400, data={})

            User.objects.filter(id=user_id).update(password=new_password)

            return responseData(message='Success', status=200, data={})
        except Exception as e:
            print(e)
            return responseData(message='Error', status=500, data={})

    @staticmethod
    @require_http_methods(['POST'])
    def getNewAccessToken(request):
        try:
            try:
                data = json.loads(request.body)
                refresh_token = data['refresh_token']
            except KeyError:
                return responseData(message='Refresh token is required', status=400, data={})

            try:
                decoded = jwt.decode(refresh_token, config('JWT_SECRET_KEY'), algorithms=[config('JWT_ALGORITHM')])
                user = User.objects.filter(id=decoded['user_id']).first()
            except (jwt.ExpiredSignatureError, jwt.DecodeError):
                return responseData(message='Refresh token is invalid', status=400, data={})

            access_token = MyTokenObtainPairSerializer().get_new_access_token(user)
            return responseData(message='Success', status=200, data={'access_token': str(access_token)})
        except Exception as e:
            print(e)
            return responseData(message='Error', status=500, data={})

    @staticmethod
    @require_http_methods(['GET'])
    def getUserByIdForAdmin(request, userId):
        try:
            user = User.objects.get(id=userId)
            return responseData(data=UserAdminSerializer(user).data, message='Success', status=200)
        except ObjectDoesNotExist:
            return responseData(None, status=404, message='User not found in DB in User-Service')
        except Exception as e:
            print(e)
            return responseData(None, status=500, message="Error when get user by ID for Admin in User-Service")

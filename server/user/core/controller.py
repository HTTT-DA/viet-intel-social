import json
from datetime import datetime, timedelta

import jwt

import pytz
from decouple import config
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from rest_framework.viewsets import ViewSet

from core.authentication import MyTokenObtainPairSerializer
from core.models import User, UserPoint, UserAPIAccess, AccessToken
from core.serializer import UserPointSerializer, OtherUserSerializer, QuestionOwnerSerializer, UserAdminSerializer, \
    UserAPIAccessSerializer
from utils.response import responseData

SECRET_KEY = "c4e7d7ad8f874fb9e21f4567a82b68e01cdaa52601c768b3f4a0424eae36af448695a4e3e18fb1626e9cb6e0d640a16b3af482e82cda35f3fcd79887eb94d3d2"
JWT_ALGORITHM = "HS256"


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
                .create(email=email, password=password, name=data.get('full-name'),
                        display_name=data.get('display-name'), role='USER',
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

    @staticmethod
    @require_http_methods(['POST'])
    def adminLogin(request):
        try:
            try:
                data = json.loads(request.body)
                email = data.get('email')
                password = data.get('password').strip()
            except json.decoder.JSONDecodeError:
                return responseData(message='Data is invalid', status=401, data={})
            try:
                user = User.objects.get(email=email, role='ADMIN')
            except User.DoesNotExist:
                return responseData(message='User does not exist', status=401, data={})

            if user.password != password:
                return responseData(message='Password is incorrect', status=401, data={})

            access_token, refresh_token = MyTokenObtainPairSerializer().get_token_for_admin(user)

            data = {
                'id': user.id,
                'display_name': user.display_name,
                'email': user.email,
                'access_token': str(access_token),
                'refresh_token': str(refresh_token)
            }

            return responseData(message='Success', status=200, data=data)
        except Exception as e:
            print(e)
            return responseData(message='Error', status=500, data=None)

    @staticmethod
    @require_http_methods(['POST'])
    def addRequestAccess(request):
        try:
            try:
                data = json.loads(request.body)
                email = data.get('email')
                reason = data.get('reason')
            except json.JSONDecodeError:
                return responseData(data=None, status=404, message="Invalid JSON format")

            if UserAPIAccess.objects.filter(user_email=email).exists():
                return responseData(data=None, status=400, message="User email already exists")

            UserAPIAccess.objects.create(user_email=email, reason=reason, status='PENDING')

            return responseData(data=None, status=200, message="Add UserAPIAccess successfully from User-Services")
        except Exception as e:
            print(e)
            return responseData(data=None, status=500, message="Error when add UserAPIAccess into DB in User-Services")

    @staticmethod
    @require_http_methods(['GET'])
    def getRequestAccessAPI(request):
        try:
            userRequests = UserAPIAccess.objects.all().order_by('-requested_at', '-status')
            return responseData(data=UserAPIAccessSerializer(userRequests, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=None, status=500, message="Error when get UserAPIAccess in User-Services")

    @staticmethod
    @require_http_methods(['DELETE'])
    def declinePendingRequest(request, requestId):
        try:
            request = UserAPIAccess.objects.filter(id=requestId, status="PENDING").delete()
            return responseData(message="Delete request successfully from User-Services")
        except Exception as e:
            print(e)
            return responseData(data=None, status=200, message="Error when delete request from DB in User-Services")

    @staticmethod
    @require_http_methods(['PATCH'])
    def acceptPendingRequest(request, requestId):
        try:
            request = UserAPIAccess.objects.filter(id=requestId)
            if request.exists():
                request.update(status="ACCEPTED", approved_at=timezone.localtime())
            return responseData(data=None, status=200, message="Accept request successfully from Question-Services")
        except Exception as e:
            print(e)
            return responseData(None, status=500, message="Error when accept request from DB in Question-Services")

    @staticmethod
    @require_http_methods(['GET'])
    def getNotificationById(request, userId):
        try:
            user = User.objects.get(id=userId)
            notification_type = user.get_notification_type()
            return responseData(message='Success', status=200, data=notification_type)

        except ObjectDoesNotExist:
            return responseData(message=f'User ID does not exist: {userId}', status=404)

        except Exception as e:
            return responseData(message=str(e), status=500, data={})

    @staticmethod
    @require_http_methods(['POST'])
    def updateNotification(request):
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id', None)
            notification_type = data.get('notification_type', None)

            if user_id and notification_type is not None:
                user = User.objects.get(id=user_id)
                user.get_notification = notification_type
                user.save()
            else:
                return responseData(message='Body is invalid', status=400, data={})
            return responseData(message='Success', status=200)

        except ObjectDoesNotExist:
            return responseData(message=f'User ID does not exist', status=404)

        except Exception as e:
            return responseData(message=str(e), status=500, data={})

    @staticmethod
    @require_http_methods(['POST'])
    def createAccessToken(request):
        try:
            data = json.loads(request.body)
            userId = data.get('user_id')
            userEmail = data.get('user_email')

            if AccessToken.objects.filter(user_email=userEmail).exists():
                return responseData(message=f"User {userEmail} is already has access token ! ", status=500, data={})

            vn_timezone = pytz.timezone('Asia/Ho_Chi_Minh')
            expirationTime = datetime.now(vn_timezone) + timedelta(minutes=1)

            accessTokenPayload = {
                'user_id': userId,
                'user_email': userEmail,
                'exp': expirationTime
            }

            accessToken = jwt.encode(accessTokenPayload, SECRET_KEY, algorithm=JWT_ALGORITHM)

            access_token_obj = AccessToken(
                user_email=userEmail,
                access_token=accessToken,
                expiration_time=expirationTime
            )
            access_token_obj.save()
            return responseData(message='Success', status=200, data={'access_token': accessToken})

        except Exception as e:
            return responseData(message=str(e), status=500, data={})

    @staticmethod
    @require_http_methods(['GET'])
    def validateAccessToken(request):
        try:
            if 'Authorization' in request.headers:
                auth_header = request.headers['Authorization']
                parts = auth_header.split(' ')
                if len(parts) == 2 and parts[0] == 'Bearer':
                    accessToken = parts[1]
                    try:
                        vn_timezone = pytz.timezone('Asia/Ho_Chi_Minh')
                        payload = jwt.decode(accessToken, SECRET_KEY, algorithms=JWT_ALGORITHM)
                        expiration_datetime = datetime.fromtimestamp(payload["exp"], tz=vn_timezone)

                        if expiration_datetime > datetime.now(vn_timezone):
                            return responseData(message='Valid', status=200, data=None)

                    except jwt.ExpiredSignatureError:
                        # try:
                        #     data = json.loads(request.body)
                        #     accessToken = data.get('access_token')
                        #     if AccessToken.objects.filter(access_token=accessToken).exists():
                        #         token = AccessToken.objects.get(access_token=accessToken).delete()
                        # except Exception as e:
                        #     return responseData(message=str(e), status=500, data={})
                        return responseData(message='Expired', status=500, data=None)
                    except jwt.InvalidTokenError:
                        return responseData(message='Invalid', status=500, data=None)
                else:
                    return responseData(None, status=500,
                                        message="Not Authenticated ! Please check your Authorization Access Token")
            else:
                return responseData(None, status=500, message="Not Authenticated ! You must add your Access Token when "
                                                              "call API")
        except Exception as e:
            return responseData(message=str(e), status=500, data={})

import json

from rest_framework.viewsets import ViewSet

from services.user.models import User
from services.user.serializer import UserSerializer
from utils.response import responseData


class UserController(ViewSet):
    @staticmethod
    def signIn(request):
        if request.method != 'POST':
            return responseData(message='Method not allowed', status=400, data={})

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

    @staticmethod
    def signUp(request):
        if request.method != 'POST':
            return responseData(message='Method not allowed', status=400, data={})

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

        userResponse = User.objects.create(
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
        return responseData(message='Success', status=200, data=UserSerializer(userResponse).data)


import json

from rest_framework.viewsets import ViewSet

from services.user.models import User
from services.user.serializer import UserSerializer
from utils.response import responseData


class UserController(ViewSet):
    @staticmethod
    def signIn(request):
        if request.method != 'POST':
            return responseData(message='Method not allowed', statusCode=400, data={})

        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return responseData(message='Email and password are required', statusCode=400, data={})

        data = User.objects.filter(email=email, password=password).first()
        user = UserSerializer(data).data

        if user is None:
            return responseData(message='User not found', statusCode=404, data={})
        return responseData(message='Success', statusCode=200, data=user)

    @staticmethod
    def signUp(request):
        if request.method != 'POST':
            return responseData(message='Method not allowed', statusCode=400, data={})

        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        fullName = data.get('full name')
        displayName = data.get('display name')

        if not email or not password:
            return responseData(message='Email and password are required', statusCode=400, data={})

        user = User.objects.filter(email=email).first()

        if user is not None:
            return responseData(message='User already exists', statusCode=400, data={})

        User.objects.create(email=email, password=password, name=fullName, display_name=displayName)
        return responseData(message='Success', statusCode=200, data={})

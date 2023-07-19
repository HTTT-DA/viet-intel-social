# Models
from services.user.models import User
from .authentication import createAccessToken, createRefreshToken, decodeAccessToken, decodeRefreshToken
# Serializers
from .serializer import AdminSerializer
# Rest Framework
from rest_framework.viewsets import ViewSet
from rest_framework.authentication import get_authorization_header
from rest_framework import exceptions
# Utilities
from django.db import IntegrityError
from django.views.decorators.http import require_http_methods
import re
import json
# Helpers
from utils.response import responseData


class AdminController(ViewSet):
    @staticmethod
    @require_http_methods(['POST'])
    def login(request):
        validateMailRegex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        data = json.loads(request.body)
        email = data.get("email", None)
        password = data.get("password", None)

        # Validate input
        if email is None or password is None \
                or not isinstance(email, str) or not isinstance(password, str) \
                or not re.fullmatch(validateMailRegex, email):
            return responseData(None, status=5, message="Invalid input when login from Admin-Services")

        # Validate username and password
        user = User.objects.filter(email=email, password=password).first()
        if not user:
            return responseData(None, status=5, message="Invalid credentials")

        access_token = createAccessToken(user.id, user.email, user.role)
        refresh_token = createRefreshToken(user.id, user.email, user.role)

        response = responseData(data={'token': access_token})
        response.set_cookie(key='refreshToken', value=refresh_token, httponly=True)

        return response

    @staticmethod
    @require_http_methods(['GET'])
    def getAdmin(request):
        auth = get_authorization_header(request).split()

        if auth and len(auth) == 2:
            token = auth[1].decode('utf-8')
            id = decodeAccessToken(token)

            user = User.objects.filter(pk=id).first()
            serializer = AdminSerializer(user)

            return responseData(data=serializer.data)

        raise exceptions.AuthenticationFailed('unauthenticated')


from django.urls import path

from services.authentication.controller import AuthController

urlpatterns = [
    path('login', AuthController.signIn)
]
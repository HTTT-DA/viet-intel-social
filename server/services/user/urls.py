from django.urls import path

from services.user.controller import UserController

urlpatterns = [
    path('sign-in', UserController.signIn),
    path('sign-up', UserController.signUp),
]
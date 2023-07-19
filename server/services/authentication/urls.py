from django.urls import path

from services.authentication.controller import AuthController

urlpatterns = [
    path('sign-in', AuthController.signIn),
    path('change-password/<int:userId>/', AuthController.changePassword),
    path('sign-up', AuthController.signUp),
    path('get-new-access-token', AuthController.getNewAccessToken),
]
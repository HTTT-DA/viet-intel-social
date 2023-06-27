from django.urls import path

from services.user.controller import UserController

urlpatterns = [
    path('sign-in', UserController.signIn),
    path('sign-up', UserController.signUp),
    path('leaderboard', UserController.getLeaderboardOfMonth),
    path('update/<int:userId>/', UserController.updateUser),
    path('change-password/<int:userId>/', UserController.changePassword),
]
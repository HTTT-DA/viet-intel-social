from django.urls import path

from services.user.controller import UserController

urlpatterns = [
    path('leaderboard', UserController.getLeaderboardOfMonth),
    path('update/<int:userId>/', UserController.updateUser),
    path('profile/<int:userId>/', UserController.getUserProfileById),
]
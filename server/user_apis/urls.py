from django.urls import path
from .http.controllers.user_controller import *

urlpatterns = [
    path('get-all-user-info', UserView.as_view({'get': 'getAllUserInfo'})),
]
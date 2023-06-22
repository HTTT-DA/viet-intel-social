from django.urls import path
from .http.controllers.user import *

urlpatterns = [
    path('get-all-user-info', UserView.as_view({'get': 'getAllUserInfo'})),
]
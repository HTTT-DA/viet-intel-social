from django.urls import path
from .vietintelsocial_http.views.user_view import *

urlpatterns = [
    path('get-all-user-info', UserView.as_view({'get': 'getAllUserInfo'})),
]
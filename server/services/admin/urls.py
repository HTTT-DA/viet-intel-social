from django.urls import path
from services.admin.controller import AdminController


urlpatterns = [
    path('login', AdminController.login),
    path('get-admin', AdminController.getAdmin)
]
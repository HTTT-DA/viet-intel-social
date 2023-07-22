from django.urls import path
from services.export.controller import ExportController

urlpatterns = [
    path('user/', ExportController.exportUser),
    path('question/', ExportController.exportQuestion),
    path('answer/', ExportController.exportAnswer),
]


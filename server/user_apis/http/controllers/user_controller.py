# Models
from ..models.user_model import *
# Serializers
from ..serializers.user_serializer import *
# Helpers
from ...core.helpers.response import *
# Rest Framework
from rest_framework.viewsets import ViewSet


class UserView(ViewSet):
    # APIs
    def getAllUserInfo(self, request):
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        data = {
            "userInfos": serializer.data
        }
        return response_data(data)

from rest_framework.serializers import ModelSerializer

from services.user.models import User


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'avatar', 'display_name', 'city',
                  'gender', 'answer_count', 'question_count', 'point')

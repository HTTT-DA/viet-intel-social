# REST Framework
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
# Services
from services.user.models import User


class AdminSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
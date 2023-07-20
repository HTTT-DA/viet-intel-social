from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        pass

    def create_superuser(self, email, password=None, **extra_fields):
        pass


class User(AbstractBaseUser, PermissionsMixin):
    class Meta:
        db_table = 'user'

    id = models.IntegerField(primary_key=True)
    role = models.CharField(max_length=50)
    email = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=200)
    avatar = models.CharField(max_length=200)
    name = models.CharField(max_length=50)
    display_name = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    gender = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    get_notification = models.CharField(max_length=50)
    answer_count = models.IntegerField(default=0)
    question_count = models.IntegerField(default=0)
    point = models.IntegerField(default=0)
    is_anonymous = models.BooleanField(default=False)
    is_authenticated = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True)
    is_superuser = models.BooleanField(default=False)
    is_NotifyWhenUserPostQuestion = models.BooleanField(default=False)

    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class UserPoint(models.Model):
    year = models.IntegerField(primary_key=True)
    month = models.IntegerField()
    point = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('year', 'month', 'user'),)
        db_table = 'UserPoint'

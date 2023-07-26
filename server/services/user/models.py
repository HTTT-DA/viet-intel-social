from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self.db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


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
    ranker = models.CharField(max_length=50)
    is_anonymous = models.BooleanField(default=False)
    is_authenticated = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=True)

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

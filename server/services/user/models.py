from django.db import models


class User(models.Model):
    class Meta:
        db_table = 'user'

    id = models.PositiveIntegerField(primary_key=True)
    role = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    password = models.CharField(max_length=200)
    avatar = models.CharField(max_length=200)
    name = models.CharField(max_length=50)
    display_name = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    gender = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    get_notification = models.CharField(max_length=50)
    answer_count = models.PositiveIntegerField(default=0)
    question_count = models.PositiveIntegerField(default=0)
    point = models.PositiveIntegerField(default=0)

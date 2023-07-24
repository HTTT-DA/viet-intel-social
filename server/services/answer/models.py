from django.db import models


class Answer(models.Model):
    class Meta:
        db_table = 'Answer'

    id = models.IntegerField(primary_key=True)
    content = models.CharField(max_length=400)
    created_at = models.DateField()
    user = models.ForeignKey('user.User', on_delete=models.CASCADE, related_name='user')
    question = models.ForeignKey('question.Question', on_delete=models.CASCADE, related_name='question')
    status = models.CharField(max_length=50)
    reference = models.CharField(max_length=100)
    image = models.CharField(max_length=100)

from django.db import models


class Answer(models.Model):
    class Meta:
        db_table = 'Answer'

    id = models.IntegerField(primary_key=True)
    content = models.CharField(max_length=400)
    created_at = models.DateField()
    user_id = models.IntegerField()
    question_id = models.IntegerField()
    status = models.CharField(max_length=50)
    reference = models.CharField(max_length=100)
    image = models.CharField(max_length=100)


class AnswerEvaluation(models.Model):
    class Meta:
        db_table = 'AnswerEvaluation'

    answer_id = models.IntegerField()
    user_id = models.IntegerField()
    evaluation_type = models.CharField(max_length=50)
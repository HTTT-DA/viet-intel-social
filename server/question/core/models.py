from django.db import models


class Question(models.Model):
    class Meta:
        db_table = 'Question'

    id = models.IntegerField(primary_key=True)
    content = models.CharField(max_length=400)
    status = models.CharField(max_length=50)
    created_at = models.DateField()
    rating = models.IntegerField()
    like_count = models.IntegerField()
    user_id = models.IntegerField()
    category_id = models.IntegerField()


class Tag(models.Model):
    class Meta:
        db_table = 'Tag'

    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)


class QuestionTag(models.Model):
    class Meta:
        db_table = 'QuestionTag'

    question_id = models.IntegerField()
    tag_id = models.IntegerField()


class QuestionLike(models.Model):
    class Meta:
        db_table = 'QuestionLike'

    question_id = models.IntegerField()
    user_id = models.IntegerField()


class QuestionEvaluation(models.Model):
    class Meta:
        db_table = 'QuestionEvaluation'

    question_id = models.IntegerField()
    user_id = models.IntegerField()
    evaluation_type = models.CharField(max_length=50)


class QuestionRating(models.Model):
    class Meta:
        db_table = 'QuestionRating'

    question_id = models.IntegerField()
    user_id = models.IntegerField()
    star_number = models.IntegerField()

    def __str__(self):
        return str(self.star_number)

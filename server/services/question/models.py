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
    user = models.ForeignKey('user.User', on_delete=models.CASCADE, related_name='user_id')
    category = models.ForeignKey('category.Category', on_delete=models.CASCADE, related_name='category_id')
    tags = models.ManyToManyField('Tag', through='QuestionTag', related_name='tag_id')
    likes = models.ManyToManyField('user.User', through='QuestionLike', related_name='like_id')
    ratings = models.ManyToManyField('user.User', through='QuestionRating', related_name='rating_id')


class Tag(models.Model):
    class Meta:
        db_table = 'Tag'

    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    questions = models.ManyToManyField('Question', through='QuestionTag')


class QuestionTag(models.Model):
    class Meta:
        db_table = 'QuestionTag'

    question = models.ForeignKey('Question', on_delete=models.CASCADE)
    tag = models.ForeignKey('Tag', on_delete=models.CASCADE)


class QuestionLike(models.Model):
    class Meta:
        db_table = 'QuestionLike'

    question = models.ForeignKey('Question', on_delete=models.CASCADE)
    user = models.ForeignKey('user.User', on_delete=models.CASCADE)


class QuestionEvaluation(models.Model):
    class Meta:
        db_table = 'QuestionEvaluation'

    question = models.ForeignKey('Question', on_delete=models.CASCADE)
    user = models.ForeignKey('user.User', on_delete=models.CASCADE)
    evaluation_type = models.CharField(max_length=50)


class QuestionRating(models.Model):
    class Meta:
        db_table = 'QuestionRating'

    question = models.ForeignKey('Question', on_delete=models.CASCADE)
    user = models.ForeignKey('user.User', on_delete=models.CASCADE)
    star_number = models.IntegerField()

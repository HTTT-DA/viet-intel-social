from django.db import models

class User(models.Model):
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

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    def get_notification_type(self):
        return self.get_notification


class UserPoint(models.Model):
    year = models.IntegerField(primary_key=True)
    month = models.IntegerField()
    point = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('year', 'month', 'user'),)
        db_table = 'UserPoint'

class Category(models.Model):
    class Meta:
        db_table = 'Category'

    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    is_deleted = models.BooleanField(default=True)

class Tag(models.Model):
    class Meta:
        db_table = 'Tag'

    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)

class Question(models.Model):
    class Meta:
        db_table = 'Question'

    id = models.IntegerField(primary_key=True)
    content = models.CharField(max_length=400)
    status = models.CharField(max_length=50)
    created_at = models.DateField()
    rating = models.IntegerField()
    like_count = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag, through='QuestionTag')


class QuestionTag(models.Model):
    class Meta:
        db_table = 'QuestionTag'
        unique_together = (('question', 'tag'),)

    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)



class QuestionLike(models.Model):
    class Meta:
        db_table = 'QuestionLike'

    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class QuestionEvaluation(models.Model):
    class Meta:
        db_table = 'QuestionEvaluation'

    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    evaluation_type = models.CharField(max_length=50)


class QuestionRating(models.Model):
    class Meta:
        db_table = 'QuestionRating'

    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    star_number = models.IntegerField()

    def __str__(self):
        return str(self.star_number)
    
class Answer(models.Model):
    class Meta:
        db_table = 'Answer'

    id = models.IntegerField(primary_key=True)
    answer_content = models.CharField(max_length=400, db_column='content')
    created_at = models.DateField()
    user_id = models.IntegerField()
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    status = models.CharField(max_length=50)
    reference = models.CharField(max_length=100)
    image = models.CharField(max_length=100)


class AnswerEvaluation(models.Model):
    class Meta:
        db_table = 'AnswerEvaluation'
        unique_together = ('answer', 'user_id',)

    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    evaluation_type = models.CharField(max_length=50)


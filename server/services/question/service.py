from datetime import datetime

from services.question.models import Question, QuestionRating, QuestionLike, QuestionTag, QuestionEvaluation
from utils.covertDate import convertDate


class QuestionService:
    @staticmethod
    def getAllQuestionOrderByNewestTime(search, offset):
        if search != '':
            questions = Question.objects\
                            .filter(content__icontains=search) \
                            .order_by('-created_at')[int(offset) * 10:int(offset) * 10 + 10]
        else:
            questions = Question.objects.all()\
                            .order_by('-created_at')[int(offset) * 10:int(offset) * 10 + 10]

        for question in questions:
            question.created_at = convertDate(question.created_at)
            question.ratings = QuestionRating.objects\
                .filter(question_id=question.id) \
                .values('user_id', 'star_number')

        return questions

    @staticmethod
    def getAllQuestionByCategory(category_id, offset):
        questions = Question.objects\
                        .filter(category_id=category_id) \
                        .order_by('-created_at')[int(offset) * 10:int(offset) * 10 + 10]

        for question in questions:
            question.created_at = convertDate(question.created_at)
            question.ratings = QuestionRating.objects\
                .filter(question_id=question.id) \
                .values('user_id', 'star_number')

        return questions

    @staticmethod
    def getQuestionOrderByTime(time, offset):
        questions = []
        if time == 'DEST':
            questions = Question.objects.all().order_by('-created_at')[int(offset) * 10:int(offset) * 10 + 10]
        elif time == 'ASC':
            questions = Question.objects.all().order_by('created_at')[int(offset) * 10:int(offset) * 10 + 10]

        for question in questions:
            question.created_at = convertDate(question.created_at)
            question.ratings = QuestionRating.objects.filter(question_id=question.id) \
                .values('user_id', 'star_number')

        return questions

    @staticmethod
    def getQuestionOrderByLike(like, offset):
        questions = []
        if like == 'DEST':
            questions = Question.objects.all().order_by('-like_count')[int(offset) * 10:int(offset) * 10 + 10]
        elif like == 'ASC':
            questions = Question.objects.all().order_by('like_count')[int(offset) * 10:int(offset) * 10 + 10]

        for question in questions:
            question.created_at = convertDate(question.created_at)
            question.ratings = QuestionRating.objects.filter(question_id=question.id) \
                .values('user_id', 'star_number')

        return questions

    @staticmethod
    def getQuestionOrderByRating(rating, offset):
        questions = []
        if rating == 'DEST':
            questions = Question.objects.all().order_by('-rating')[int(offset) * 10:int(offset) * 10 + 10]
        elif rating == 'ASC':
            questions = Question.objects.all().order_by('rating')[int(offset) * 10:int(offset) * 10 + 10]

        for question in questions:
            question.created_at = convertDate(question.created_at)
            question.ratings = QuestionRating.objects.filter(question_id=question.id) \
                .values('user_id', 'star_number')

        return questions

    @staticmethod
    def likeQuestion(question_id, user_id):
        questionLike = QuestionLike.objects.filter(question_id=question_id, user_id=user_id)
        if questionLike.exists():
            questionLike.delete()
        else:
            QuestionLike.objects.create(question_id=question_id, user_id=user_id)

    @staticmethod
    def createQuestion(data):
        current_date = datetime.now().strftime('%Y-%m-%d')
        Question.objects.create(
            content=data['content'],
            category_id=data['category_id'],
            user_id=data['user_id'],
            created_at=current_date,
            status='WAITING'
        )
        question = Question.objects.filter(user_id=data['user_id'], category_id=data['category_id']).last()
        for tag in data['tags']:
            QuestionTag.objects.create(question_id=question.id, tag_id=tag)
        return question

    @staticmethod
    def evaluateQuestion(data):
        if QuestionEvaluation.objects \
                .filter(question_id=data['question_id'], user_id=data['user_id']).exists():
            QuestionEvaluation.objects \
                .filter(question_id=data['question_id'], user_id=data['user_id']) \
                .update(evaluation_type=data['evaluation_type'])
        else:
            QuestionEvaluation.objects.create(
                question_id=data['question_id'],
                user_id=data['user_id'],
                evaluation_type=data['evaluation_type']
            )

    @staticmethod
    def ratingQuestion(data):
        if QuestionRating.objects.filter(question_id=data['question_id'], user_id=data['user_id']).exists():
            QuestionRating.objects\
                .filter(question_id=data['question_id'], user_id=data['user_id'])\
                .update(star_number=data['rating'])
        else:
            QuestionRating.objects.create(
                question_id=data['question_id'],
                user_id=data['user_id'],
                star_number=data['rating']
            )
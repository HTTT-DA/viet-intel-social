from datetime import datetime

import requests

from core.models import Question, QuestionRating, QuestionLike, QuestionTag, QuestionEvaluation, Tag
from utils.convertDate import convertDate


def fetchMoreDataForQuestion(questions):
    for question in questions:
        question.created_at = convertDate(question.created_at)

        question.ratings = QuestionRating.objects \
            .filter(question_id=question.id) \
            .values('user_id', 'star_number')

        question.likes = QuestionLike.objects \
            .filter(question_id=question.id) \
            .values('user_id')

        array = []
        for like in question.likes:
            array.append(like['user_id'])
        question.likes = array

        question.tags = QuestionTag.objects \
            .filter(question_id=question.id) \
            .values('tag_id')

        for tag in question.tags:
            tag['tag_name'] = Tag.objects.get(id=tag['tag_id']).name

        ownerResponse = requests.get(f'http://127.0.0.1:8000/api/users/{question.user_id}/owner-info')
        owner = ownerResponse.json()['data']
        question.owner = owner

        categoryResponse = requests.get(f'http://127.0.0.1:8003/api/categories/{question.category_id}')
        category = categoryResponse.json()['data']
        question.category = category

    return questions


class QuestionService:
    @staticmethod
    def getAllQuestionOrderByNewestTime(search, offset):
        questions = Question.objects \
                        .filter(content__icontains=search, status='ACCEPTED') \
                        .order_by('-created_at')[int(offset) * 10:int(offset) * 10 + 10]

        questions = fetchMoreDataForQuestion(questions)
        return questions

    @staticmethod
    def getAllQuestionByCategory(category_id, offset):
        questions = Question.objects \
                        .filter(category_id=category_id, status='ACCEPTED') \
                        .order_by('-created_at')[int(offset) * 10:int(offset) * 10 + 10]

        questions = fetchMoreDataForQuestion(questions)
        return questions

    @staticmethod
    def getQuestionOrderByTime(time, offset):
        questions = []
        if time == 'DEST':
            questions = Question.objects.all().order_by('-created_at')[int(offset) * 10:int(offset) * 10 + 10]
        elif time == 'ASC':
            questions = Question.objects.all().order_by('created_at')[int(offset) * 10:int(offset) * 10 + 10]

        questions = fetchMoreDataForQuestion(questions)
        return questions

    @staticmethod
    def getQuestionOrderByLike(like, offset):
        questions = []
        if like == 'DEST':
            questions = Question.objects.all().order_by('-like_count')[int(offset) * 10:int(offset) * 10 + 10]
        elif like == 'ASC':
            questions = Question.objects.all().order_by('like_count')[int(offset) * 10:int(offset) * 10 + 10]

        questions = fetchMoreDataForQuestion(questions)
        return questions

    @staticmethod
    def getQuestionOrderByRating(rating, offset):
        questions = []
        if rating == 'DEST':
            questions = Question.objects.all().order_by('-rating')[int(offset) * 10:int(offset) * 10 + 10]
        elif rating == 'ASC':
            questions = Question.objects.all().order_by('rating')[int(offset) * 10:int(offset) * 10 + 10]

        questions = fetchMoreDataForQuestion(questions)
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
            status='WAITING',
            like_count=0,
            rating=0
        )
        question = Question.objects.filter(user_id=data['user_id'], category_id=data['category_id']).last()
        for tag_id in data['tags']:
            QuestionTag.objects.create(question_id=question.id, tag_id=tag_id)
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
            QuestionRating.objects \
                .filter(question_id=data['question_id'], user_id=data['user_id']) \
                .update(star_number=data['rating'])
        else:
            QuestionRating.objects.create(
                question_id=data['question_id'],
                user_id=data['user_id'],
                star_number=data['rating']
            )

    # For Admin
    @staticmethod
    def getAllQuestionOrderByNewest(pageNumber):
        totalRecords = Question.objects.count()

        page_size = 6
        offset = (pageNumber - 1) * page_size
        limit = offset + page_size if offset + page_size <= totalRecords else totalRecords

        questions = Question.objects.all().order_by('-created_at', '-status')[offset:limit]

        return questions

    @staticmethod
    def getDetailQuestionById(questionId):
        question = Question.objects.get(id=questionId)
        return question

    @staticmethod
    def getAllQuestion():
        question = Question.objects.all()
        return question

    @staticmethod
    def getPendingQuestion():
        question = Question.objects.filter(status="WAITING")
        return question

    @staticmethod
    def countQuestions():
        return Question.objects.count()

    @staticmethod
    def deleteQuestionForever(questionId):
        Question.objects.filter(id=questionId, status="WAITING").delete()

    @staticmethod
    def updateQuestionStatus(questionId):
        Question.objects.filter(id=questionId, status="WAITING").update(status="ACCEPTED")
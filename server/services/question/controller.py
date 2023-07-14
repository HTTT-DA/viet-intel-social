import json
from datetime import datetime

from django.views.decorators.http import require_http_methods
from rest_framework.viewsets import ViewSet

from services.question.models import Question, QuestionLike, Tag, QuestionTag
from services.category.models import Category
from services.question.serializer import QuestionSerializer, CategorySerializer, TagSerializer
from utils.response import responseData


class QuestionController(ViewSet):
    @staticmethod
    @require_http_methods(['GET'])
    def getAllQuestionOrderByNewestTime(request):
        try:
            search = request.GET.get('search')
            if search != '':
                questions = Question.objects.filter(content__icontains=search).order_by('-created_at')[:10]
            else:
                questions = Question.objects.all().order_by('-created_at')[:10]
            for question in questions:
                question.created_at = question.created_at.strftime("%d %B, %Y")
            return responseData(data=QuestionSerializer(questions, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[])

    @staticmethod
    @require_http_methods(['GET'])
    def getAllQuestionByCategory(request):
        try:
            category_id = request.GET.get('categoryID')
            questions = Question.objects.filter(category_id=category_id).order_by('-created_at')[:10]
            for question in questions:
                question.created_at = question.created_at.strftime("%d %B, %Y")
            return responseData(data=QuestionSerializer(questions, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[])

    @staticmethod
    @require_http_methods(['GET'])
    def getQuestionOrderByTime(request):
        try:
            time = request.GET.get('time')
            questions = []
            if time == 'DEST':
                questions = Question.objects.all().order_by('-created_at')[:10]
            elif time == 'ASC':
                questions = Question.objects.all().order_by('created_at')[:10]

            for question in questions:
                question.created_at = question.created_at.strftime("%d %B, %Y")
            return responseData(data=QuestionSerializer(questions, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[])

    @staticmethod
    @require_http_methods(['GET'])
    def getQuestionOrderByLike(request):
        try:
            like = request.GET.get('like')
            questions = []
            if like == 'DEST':
                questions = Question.objects.all().order_by('-like_count')[:10]
            elif like == 'ASC':
                questions = Question.objects.all().order_by('like_count')[:10]

            for question in questions:
                question.created_at = question.created_at.strftime("%d %B, %Y")
            return responseData(data=QuestionSerializer(questions, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[])

    @staticmethod
    @require_http_methods(['GET'])
    def getQuestionOrderByRating(request):
        try:
            rating = request.GET.get('rating')
            questions = []
            if rating == 'DEST':
                questions = Question.objects.all().order_by('-rating')[:10]
            elif rating == 'ASC':
                questions = Question.objects.all().order_by('rating')[:10]

            for question in questions:
                question.created_at = question.created_at.strftime("%d %B, %Y")
            return responseData(data=QuestionSerializer(questions, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[])

    @staticmethod
    @require_http_methods(['POST'])
    def likeQuestion(request):
        try:
            data = json.loads(request.body)
            question_id = data['question_id']
            user_id = data['user_id']

            questionLike = QuestionLike.objects.filter(question_id=question_id, user_id=user_id)
            if questionLike.exists():
                questionLike.delete()
                return responseData(data=False)
            else:
                QuestionLike.objects.create(question_id=question_id, user_id=user_id)
                return responseData(data=True)
        except Exception as e:
            print(e)
            return responseData(data=False)

    @staticmethod
    @require_http_methods(['GET'])
    def getListCategory(request):
        try:
            category = Category.objects.all()
            return responseData(data=CategorySerializer(category, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[])

    @staticmethod
    @require_http_methods(['GET'])
    def getListTag(request):
        try:
            tag = Tag.objects.all()
            return responseData(data=TagSerializer(tag, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[])

    @staticmethod
    @require_http_methods(['POST'])
    def createTag(request):
        try:
            data = json.loads(request.body)
            name = data['name']
            Tag.objects.create(name=name)
            TagResponse = Tag.objects.filter(name=name)
            return responseData(data=TagSerializer(TagResponse, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=False)

    @staticmethod
    @require_http_methods(['POST'])
    def createQuestion(request):
        try:
            data = json.loads(request.body)
            content = data['content']
            category_id = data['category_id']
            user_id = data['user_id']
            tags = data['tags']
            current_date = datetime.now().strftime('%Y-%m-%d')

            Question.objects.create(content=content, category_id=category_id,
                                    user_id=user_id, created_at=current_date, status='WAITING')
            question = Question.objects.filter(user_id=user_id, category_id=category_id).last()

            for tag in tags:
                QuestionTag.objects.create(question_id=question.id, tag_id=tag)

            return responseData(data=True, message='Create question successfully', status=200)
        except Exception as e:
            print(e)
            return responseData(data=False, message='Create question failed', status=500)

import json

from django.views.decorators.http import require_http_methods
from rest_framework.viewsets import ViewSet

from services.category.models import Category
from services.question.models import Tag
from services.question.serializer import QuestionSerializer, CategorySerializer, TagSerializer
from services.question.service import QuestionService
from utils.response import responseData


class QuestionController(ViewSet):
    @staticmethod
    @require_http_methods(['GET'])
    def getAllQuestionOrderByNewestTime(request):
        try:
            search = request.GET.get('search') if request.GET.get('search') else ''
            offset = request.GET.get('offset') if int(request.GET.get('offset')) else '0'
            data = QuestionService.getAllQuestionOrderByNewestTime(search, offset)
            return responseData(data=QuestionSerializer(data, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[], message='Error', status=500)

    @staticmethod
    @require_http_methods(['GET'])
    def getAllQuestionByCategory(request):
        try:
            category_id = request.GET.get('categoryID')
            offset = request.GET.get('offset') if request.GET.get('offset') else '0'
            data = QuestionService.getAllQuestionByCategory(category_id, offset)
            return responseData(data=QuestionSerializer(data, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[], message='Error', status=500)

    @staticmethod
    @require_http_methods(['GET'])
    def getQuestionOrderByTime(request):
        try:
            time = request.GET.get('time') if request.GET.get('time') else 'DEST'
            offset = request.GET.get('offset') if request.GET.get('offset') else '0'
            data = QuestionService.getQuestionOrderByTime(time, offset)
            return responseData(data=QuestionSerializer(data, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[])

    @staticmethod
    @require_http_methods(['GET'])
    def getQuestionOrderByLike(request):
        try:
            like = request.GET.get('like') if request.GET.get('like') else 'DEST'
            offset = request.GET.get('offset') if request.GET.get('offset') else '0'
            data = QuestionService.getQuestionOrderByLike(like, offset)
            return responseData(data=QuestionSerializer(data, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[])

    @staticmethod
    @require_http_methods(['GET'])
    def getQuestionOrderByRating(request):
        try:
            rating = request.GET.get('rating') if request.GET.get('rating') else 'DEST'
            offset = request.GET.get('offset') if request.GET.get('offset') else '0'
            data = QuestionService.getQuestionOrderByRating(rating, offset)
            return responseData(data=QuestionSerializer(data, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[])

    @staticmethod
    @require_http_methods(['POST'])
    def likeQuestion(request):
        try:
            data = json.loads(request.body)
            QuestionService.likeQuestion(data['question_id'], data['user_id'])
            return responseData(data=True)
        except Exception as e:
            print(e)
            return responseData(data=False)

    @staticmethod
    @require_http_methods(['GET'])
    def getListQuestions(request):
        try:
            question = Question.objects.all()
            serializer = QuestionSerializer(question, many=True)
            print(serializer.data)
            return responseData(data=[])
        except Exception as e:
            print(e)
            return responseData(data=[])


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
            Tag.objects.create(name=data['name'])
            TagResponse = Tag.objects.filter(name=data['name'])
            return responseData(data=TagSerializer(TagResponse, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=False)

    @staticmethod
    @require_http_methods(['POST'])
    def createQuestion(request):
        try:
            data = json.loads(request.body)
            QuestionService.createQuestion(data)
            return responseData(data=True, message='Create question successfully', status=200)
        except Exception as e:
            print(e)
            return responseData(data=False, message='Create question failed', status=500)

    @staticmethod
    @require_http_methods(['POST'])
    def evaluateQuestion(request):
        try:
            data = json.loads(request.body)
            QuestionService.evaluateQuestion(data)
            return responseData(data=True, message='Evaluate question successfully', status=200)
        except Exception as e:
            print(e)
            return responseData(data=False)

    @staticmethod
    @require_http_methods(['POST'])
    def ratingQuestion(request):
        try:
            data = json.loads(request.body)
            QuestionService.ratingQuestion(data)
            return responseData(data=True, message='Rate question successfully', status=200)
        except Exception as e:
            print(e)
            return responseData(data=False, message='Rate question failed', status=500)

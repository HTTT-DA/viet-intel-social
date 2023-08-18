import json

from django.views.decorators.http import require_http_methods
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.viewsets import ViewSet
from django.db import IntegrityError

from core.models import Tag
from core.serializer import QuestionSerializer, TagSerializer, QuestionAdminSerializer, QuestionAnswerSerializer
from core.service import QuestionService
from utils.response import responseData


class QuestionController(ViewSet):
    @staticmethod
    @require_http_methods(['GET'])
    def getAllQuestionOrderByNewestTime(request):
        try:
            search = request.GET.get('search')
            offset = request.GET.get('offset')

            if search is None:
                search = ''
            if offset is None:
                offset = '0'

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
            offset = request.GET.get('offset')

            if offset is None:
                offset = '0'
            if category_id is None:
                return responseData(data=[], message='Invalid category_id', status=404)

            data = QuestionService.getAllQuestionByCategory(category_id, offset)
            return responseData(data=QuestionSerializer(data, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[], message='Error', status=500)

    @staticmethod
    @require_http_methods(['GET'])
    def getQuestionOrderByTime(request):
        try:
            time = request.GET.get('time')
            offset = request.GET.get('offset')

            if time not in ['ASC', 'DEST']:
                time = 'DEST'
            if offset is None:
                offset = '0'

            data = QuestionService.getQuestionOrderByTime(time, offset)
            return responseData(data=QuestionSerializer(data, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[])

    @staticmethod
    @require_http_methods(['GET'])
    def getQuestionOrderByLike(request):
        try:
            like = request.GET.get('like')
            offset = request.GET.get('offset')

            if like not in ['ASC', 'DEST']:
                like = 'DEST'
            if offset is None:
                offset = '0'

            data = QuestionService.getQuestionOrderByLike(like, offset)
            return responseData(data=QuestionSerializer(data, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[])

    @staticmethod
    @require_http_methods(['GET'])
    def getQuestionOrderByRating(request):
        try:
            rating = request.GET.get('rating')
            offset = request.GET.get('offset')

            if rating not in ['ASC', 'DEST']:
                rating = 'DEST'
            if offset is None:
                offset = '0'

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
            return responseData(data=False, message='Like question failed', status=500)

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
            return responseData(data=False, message='Evaluate question failed', status=500)

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
    @require_http_methods(['GET'])
    def countAllQuestions(request):
        try:
            totalRecords = QuestionService.countQuestions()
            return responseData(data=totalRecords)
        except Exception as e:
            print(e)
            return responseData(None, status=4, message="Error when get count questions A in Questions Service")

    @staticmethod
    @require_http_methods(['GET'])
    def getAllQuestionsForAdmin(request):
        try:
            # status = request.GET.get('status')  # Lấy giá trị của query parameter 'status'
            # userEmail = request.GET.get('userEmail')  # Lấy giá trị của query parameter 'user_email'
            pageNumber = int(request.GET.get('page', 1))
            questions = QuestionService.getAllQuestionOrderByNewest(pageNumber)
            serializer = QuestionAdminSerializer(questions, many=True, context={'detail_mode': False})
            return responseData(data=serializer.data)
        except Exception as e:
            print(e)
            return responseData(None, status=4, message="Error when get all questions A in Questions Service")

    @staticmethod
    @require_http_methods(['GET'])
    def getDetailQuestionForAdmin(request, questionId):
        try:
            question = QuestionService.getDetailQuestionById(questionId)
            serializer = QuestionAdminSerializer(question, context={'detail_mode': True})
            return responseData(data=serializer.data)
        except ObjectDoesNotExist:
            return responseData(None, status=404, message='Question not found in DB in Question-Service')
        except Exception as e:
            print(e)
            return responseData(None, status=4, message="Error when get detail question A in Questions Service")

    @staticmethod
    @require_http_methods(['GET'])
    def getContentForAnswer(request, questionId):
        try:
            question = QuestionService.getDetailQuestionById(questionId)
            serializer = QuestionAnswerSerializer(question)
            return responseData(data=serializer.data)
        except ObjectDoesNotExist:
            return responseData(None, status=404, message='Question not found in DB in Question-Service')
        except Exception as e:
            print(e)
            return responseData(None, status=4, message="Error when get content for answer in Questions Service")

    @staticmethod
    @require_http_methods(['DELETE'])
    def declinePendingQuestion(request, questionId):
        try:
            question = QuestionService.deleteQuestionForever(questionId)
            return responseData(data=question, message="Delete question successfully from Question-Services")
        except IntegrityError as e:
            print(e)
            return responseData(None, status=500, message="Error when delete question from DB in Question-Services")

    @staticmethod
    @require_http_methods(['PATCH'])
    def acceptPendingQuestion(request, questionId):
        try:
            question = QuestionService.updateQuestionStatus(questionId)
            return responseData(data=question, message="Update status of question successfully from Question-Services")
        except IntegrityError as e:
            print(e)
            return responseData(None, status=500, message="Error when update status of question from DB in "
                                                          "Question-Services")
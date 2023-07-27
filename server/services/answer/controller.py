import json

from django.views.decorators.http import require_http_methods
from rest_framework.viewsets import ViewSet

from services.answer.models import AnswerEvaluation
from services.answer.serializer import AnswerSerializer
from services.answer.service import AnswerService
from utils.response import responseData


class AnswerController(ViewSet):
    @staticmethod
    @require_http_methods(['GET'])
    def getAnswersOfQuestion(request, questionId):
        try:
            answers = AnswerService.getAnswersOfQuestion(questionId)
            return responseData(data=AnswerSerializer(answers, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[], status=500, message='Server error')

    @staticmethod
    @require_http_methods(['POST'])
    def createAnswer(request):
        try:
            data = json.loads(request.body)
            answer = AnswerService.createAnswer(data)
            return responseData(data=AnswerSerializer(answer).data, message='Create answer success')
        except Exception as e:
            print(e)
            return responseData(data=[], status=500, message='Server error')

    @staticmethod
    @require_http_methods(['PUT'])
    def createOrUpdateEvaluation(request, answerId, userId):
        try:
            data = json.loads(request.body)
            message = AnswerService.createOrUpdateEvaluation(answerId, userId, data['evaluation_type'])
            return responseData(data=[], message=message)
        except Exception as e:
            print(e)
            return responseData(data=[], status=500, message='Server error')

    @staticmethod
    @require_http_methods(['DELETE'])
    def deleteEvaluation(request, answerId, userId):
        try:
            AnswerEvaluation.objects.filter(answer_id=answerId, user_id=userId).delete()
            return responseData(data=[], message='Delete success')
        except Exception as e:
            print(e)
            return responseData(data=[], status=500, message='Server error')

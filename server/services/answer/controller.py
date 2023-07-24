from django.views.decorators.http import require_http_methods
from rest_framework.viewsets import ViewSet

from services.answer.models import Answer
from services.answer.serializer import AnswerSerializer
from utils.response import responseData


class AnswerController(ViewSet):

    @staticmethod
    @require_http_methods(['GET'])
    def getAnswersOfQuestion(request, questionId):
        try:
            answers = Answer.objects.filter(question_id=questionId)
            return responseData(data=AnswerSerializer(answers, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[], status=500, message='Server error')
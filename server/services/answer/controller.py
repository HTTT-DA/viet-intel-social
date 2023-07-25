import json
from datetime import datetime, date

from django.views.decorators.http import require_http_methods
from rest_framework.viewsets import ViewSet

from services.answer.models import Answer, AnswerEvaluation
from services.answer.serializer import AnswerSerializer
from utils.covertDate import convertDate
from utils.response import responseData


class AnswerController(ViewSet):
    @staticmethod
    @require_http_methods(['GET'])
    def getAnswersOfQuestion(request, questionId):
        try:
            answers = Answer.objects.filter(question_id=questionId,status='ACCEPTED').order_by('-created_at')
            for answer in answers:
                answer.created_at = convertDate(answer.created_at)
                answer.evaluations = AnswerEvaluation.objects\
                    .filter(answer_id=answer.id ) \
                    .values('user_id', 'evaluation_type')

            return responseData(data=AnswerSerializer(answers, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[], status=500, message='Server error')

    @staticmethod
    @require_http_methods(['POST'])
    def createAnswer(request):
        try:
            data = json.loads(request.body)
            answer = Answer.objects.create(
                user_id=data['user_id'],
                question_id=data['question_id'],
                content=data['content'],
                reference=data['reference'],
                image=data['image'],
                status='WAITING',
                created_at=date.today()
            )
            answer.created_at = convertDate(answer.created_at)
            answer.evaluations = AnswerEvaluation.objects.filter(answer_id=answer.id) \
                .values('user_id', 'evaluation_type')
            return responseData(data=AnswerSerializer(answer).data, message='Create answer success')
        except Exception as e:
            print(e)
            return responseData(data=[], status=500, message='Server error')

    @staticmethod
    @require_http_methods(['PUT'])
    def createOrUpdateEvaluation(request, answerId, userId):
        try:
            data = json.loads(request.body)
            evaluationType = data['evaluation_type']
            if AnswerEvaluation.objects.filter(answer_id=answerId, user_id=userId).exists():
                AnswerEvaluation.objects.filter(answer_id=answerId, user_id=userId) \
                    .update(evaluation_type=evaluationType)
                return responseData(data=[], message='Update success')
            else:
                AnswerEvaluation.objects.create(answer_id=answerId, user_id=userId, evaluation_type=evaluationType)
                return responseData(data=[], message='Create success')
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

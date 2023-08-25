import json
import re

from django.views.decorators.http import require_http_methods
from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.viewsets import ViewSet
from django.db import transaction

from core.models import AnswerEvaluation
from core.serializer import AnswerSerializer, AnswerAdminSerializer
from core.service import AnswerService
from utils.response import responseData


class AnswerController(ViewSet):
    @staticmethod
    @require_http_methods(['GET'])
    def getAnswersOfQuestion(request):
        try:
            questionID = request.GET.get('questionID')
            answers = AnswerService.getAnswersOfQuestion(questionID)
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
            return responseData(data=AnswerSerializer(answer).data, message='Create Answer success')
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

    @staticmethod
    @require_http_methods(['GET'])
    def countAllAnswersByQuestion(request, questionId):
        try:
            totalRecords = AnswerService.countAnswersOfQuestion(questionId)
            return responseData(data=totalRecords)
        except Exception as e:
            print(e)
            return responseData(None, status=4, message="Error when get count answers A in Answer Service")

    @staticmethod
    @require_http_methods(['GET'])
    def getAnswersOfQuestionForAdmin(request, questionId):
        try:
            # status = request.GET.get('status')  # Lấy giá trị của query parameter 'status'
            # userEmail = request.GET.get('userEmail')  # Lấy giá trị của query parameter 'user_email'
            pageNumber = int(request.GET.get('page', 1))
            answers = AnswerService.getAnswersOfQuestionOrderByNewest(questionId, pageNumber)
            serializer = AnswerAdminSerializer(answers, many=True, context={'detail_mode': False})
            return responseData(data=serializer.data)
        except Exception as e:
            print(e)
            return responseData(None, status=4, message="Error when get answers for question A in Answer Service")

    @staticmethod
    @require_http_methods(['GET'])
    def getDetailAnswerForAdmin(request, answerId):
        try:
            answer = AnswerService.getDetailAnswerById(answerId)
            serializer = AnswerAdminSerializer(answer, context={'detail_mode': True})
            return responseData(data=serializer.data)
        except ObjectDoesNotExist:
            return responseData(None, status=404, message='Answer not found in DB in Answer-Service')
        except Exception as e:
            print(e)
            return responseData(None, status=4, message="Error when get detail answer in Answer Service")

    @staticmethod
    @require_http_methods(['DELETE'])
    def declinePendingAnswer(request, answerId):
        try:
            answer = AnswerService.deleteAnswerForever(answerId)
            return responseData(data=answer, message="Delete answer successfully from Answer-Services")
        except IntegrityError as e:
            print(e)
            return responseData(None, status=500, message="Error when delete answer from DB in Answer-Services")

    @staticmethod
    @require_http_methods(['PATCH'])
    def acceptPendingAnswer(request, answerId):
        try:
            answer = AnswerService.updateAnswerStatus(answerId)
            return responseData(data=answer, message="Update status of answer successfully from Answer-Services")
        except IntegrityError as e:
            print(e)
            return responseData(None, status=500, message="Error when update status of answer from DB in "
                                                          "Answer-Services")

    @staticmethod
    @require_http_methods(['PATCH'])
    @transaction.atomic
    def automaticCensorAnswers(request):
        try:
            bannedWordList = ['arse', 'arsehead', 'arsehole', 'ass', 'asshole', 'bastard', 'bitch', 'bloody',
                              'bollocks', 'brotherfucker',
                              'bugger', 'bullshit', 'child-fucker', 'Christ on a bike', 'Christ on a cracker', 'cock',
                              'cocksucker',
                              'crap', 'cunt', 'damn', 'damn it', 'dick', 'dickhead', 'dyke', 'fatherfucker', 'frigger',
                              'fuck', 'goddamn',
                              'godsdamn', 'hell', 'holy shit', 'horseshit', 'in shit', 'Jesus Christ', 'Jesus fuck',
                              'Jesus H. Christ', 'Jesus Harold Christ',
                              'Jesus, Mary and Joseph', 'Jesus wept', 'kike', 'motherfucker', 'nigga', 'nigra',
                              'pigfucker', 'piss', 'prick', 'pussy', 'shit', 'shit ass',
                              'shite', 'sisterfucker', 'slut', 'son of a whore', 'son of a bitch', 'spastic',
                              'sweet Jesus', 'turd', 'twat', 'wanker'
                              ]
            questions = AnswerService.getPendingAnswer()
            listAnswers = AnswerAdminSerializer(questions, many=True).data

            for answer in listAnswers:
                text_lower = answer['content'].lower()
                for word in bannedWordList:
                    word_lower = word.lower()
                    pattern = re.escape(word_lower)
                    match = re.search(pattern, text_lower)

                    if match:
                        AnswerService.deleteAnswerForever(answer['id'])

                AnswerService.updateAnswerStatus(answer['id'])

            return responseData(data=None, message="Automatic censor answers successfully from Question-Services")

        except Exception as e:
            return responseData(message=str(e), status=500, data={})

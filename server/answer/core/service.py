from datetime import date
import requests

from core.models import Answer, AnswerEvaluation
from utils.convertDate import convertDate


class AnswerService:
    @staticmethod
    def getAnswersOfQuestion(questionId):
        answers = Answer.objects.filter(question_id=questionId, status='ACCEPTED').order_by('-created_at')
        for answer in answers:
            answer.created_at = convertDate(answer.created_at)
            answer.evaluations = AnswerEvaluation.objects \
                .filter(answer_id=answer.id) \
                .values('user_id', 'evaluation_type')

            userResponse = requests.get(f'http://127.0.0.1:8000/api/users/{answer.user_id}/owner-info')
            user = userResponse.json()['data']
            answer.user = user
        return answers

    @staticmethod
    def createAnswer(data):
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
        answer.evaluations = AnswerEvaluation.objects\
            .filter(answer_id=answer.id) \
            .values('user_id', 'evaluation_type')

        userResponse = requests.get(f'http://127.0.0.1:8000/api/users/{answer.user_id}/owner-info')
        user = userResponse.json()['data']
        answer.user = user

        return answer

    @staticmethod
    def createOrUpdateEvaluation(answerId, userId, evaluationType):
        if AnswerEvaluation.objects.filter(answer_id=answerId, user_id=userId).exists():
            AnswerEvaluation.objects.filter(answer_id=answerId, user_id=userId) \
                .update(evaluation_type=evaluationType)
            return 'Update success'
        else:
            AnswerEvaluation.objects.create(answer_id=answerId, user_id=userId, evaluation_type=evaluationType)
            return 'Create success'

    @staticmethod
    def getAnswersOfQuestionOrderByNewest(questionId, pageNumber):
        totalRecords = Answer.objects.filter(question_id=questionId).count()

        page_size = 6
        offset = (pageNumber - 1) * page_size
        limit = offset + page_size if offset + page_size <= totalRecords else totalRecords

        answers = Answer.objects.filter(question_id=questionId).order_by('-created_at', '-status')[offset:limit]

        return answers

    @staticmethod
    def getDetailAnswerById(answerId):
        answer = Answer.objects.get(id=answerId)
        return answer

    @staticmethod
    def countAnswersOfQuestion(questionId):
        return Answer.objects.filter(question_id=questionId).count()

    @staticmethod
    def deleteAnswerForever(answerId):
        Answer.objects.filter(id=answerId, status="WAITING").delete()

    @staticmethod
    def updateAnswerStatus(answerId):
        Answer.objects.filter(id=answerId, status="WAITING").update(status="ACCEPTED")
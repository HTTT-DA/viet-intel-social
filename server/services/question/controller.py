import json
from django.views.decorators.http import require_http_methods
from rest_framework.viewsets import ViewSet

from services.question.models import Question, QuestionLike
from services.question.serializer import QuestionSerializer
from utils.response import responseData


class QuestionController(ViewSet):
    @staticmethod
    @require_http_methods(['GET'])
    def getAllQuestionOrderByNewestTime(request):
        try:
            questions = Question.objects.all().order_by('-created_at')[:10]
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
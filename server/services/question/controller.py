import json
from datetime import datetime

from django.views.decorators.http import require_http_methods
from rest_framework.viewsets import ViewSet

from services.category.models import Category
from services.question.models import Question, QuestionLike, Tag, QuestionTag, QuestionEvaluation, QuestionRating
from services.question.serializer import QuestionSerializer, CategorySerializer, TagSerializer, QuestionAdminSerializer
from utils.covertDate import convertDate
from utils.response import responseData


class QuestionController(ViewSet):
    @staticmethod
    @require_http_methods(['GET'])
    def getAllQuestionOrderByNewestTime(request):
        try:
            search = request.GET.get('search')
            offset = request.GET.get('offset') if int(request.GET.get('offset')) else '0'
            if search != '':
                questions = Question.objects.filter(content__icontains=search) \
                                .order_by('-created_at')[int(offset) * 10:int(offset) * 10 + 10]
            else:
                questions = Question.objects.all().order_by('-created_at')[int(offset) * 10:int(offset) * 10 + 10]
            for question in questions:
                question.created_at = convertDate(question.created_at)
                question.ratings = QuestionRating.objects.filter(question_id=question.id) \
                    .values('user_id', 'star_number')
            return responseData(data=QuestionSerializer(questions, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[], message='Error', status=500)

    @staticmethod
    @require_http_methods(['GET'])
    def getAllQuestionByCategory(request):
        try:
            category_id = request.GET.get('categoryID')
            offset = request.GET.get('offset') if request.GET.get('offset') else '0'
            questions = Question.objects.filter(category_id=category_id) \
                            .order_by('-created_at')[int(offset) * 10:int(offset) * 10 + 10]
            for question in questions:
                question.created_at = convertDate(question.created_at)
                question.ratings = QuestionRating.objects.filter(question_id=question.id) \
                    .values('user_id', 'star_number')
            return responseData(data=QuestionSerializer(questions, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[], message='Error', status=500)

    @staticmethod
    @require_http_methods(['GET'])
    def getQuestionOrderByTime(request):
        try:
            time = request.GET.get('time')
            offset = request.GET.get('offset') if request.GET.get('offset') else '0'
            questions = []
            if time == 'DEST':
                questions = Question.objects.all().order_by('-created_at')[int(offset) * 10:int(offset) * 10 + 10]
            elif time == 'ASC':
                questions = Question.objects.all().order_by('created_at')[int(offset) * 10:int(offset) * 10 + 10]

            for question in questions:
                question.created_at = convertDate(question.created_at)
                question.ratings = QuestionRating.objects.filter(question_id=question.id) \
                    .values('user_id', 'star_number')
            return responseData(data=QuestionSerializer(questions, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[])

    @staticmethod
    @require_http_methods(['GET'])
    def getQuestionOrderByLike(request):
        try:
            like = request.GET.get('like')
            offset = request.GET.get('offset') if request.GET.get('offset') else '0'
            questions = []
            if like == 'DEST':
                questions = Question.objects.all().order_by('-like_count')[int(offset) * 10:int(offset) * 10 + 10]
            elif like == 'ASC':
                questions = Question.objects.all().order_by('like_count')[int(offset) * 10:int(offset) * 10 + 10]

            for question in questions:
                question.created_at = convertDate(question.created_at)
                question.ratings = QuestionRating.objects.filter(question_id=question.id) \
                    .values('user_id', 'star_number')
            return responseData(data=QuestionSerializer(questions, many=True).data)
        except Exception as e:
            print(e)
            return responseData(data=[])

    @staticmethod
    @require_http_methods(['GET'])
    def getQuestionOrderByRating(request):
        try:
            rating = request.GET.get('rating')
            offset = request.GET.get('offset') if request.GET.get('offset') else '0'
            questions = []
            if rating == 'DEST':
                questions = Question.objects.all().order_by('-rating')[int(offset) * 10:int(offset) * 10 + 10]
            elif rating == 'ASC':
                questions = Question.objects.all().order_by('rating')[int(offset) * 10:int(offset) * 10 + 10]

            for question in questions:
                question.created_at = convertDate(question.created_at)
                question.ratings = QuestionRating.objects.filter(question_id=question.id) \
                    .values('user_id', 'star_number')
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

    @staticmethod
    @require_http_methods(['POST'])
    def evaluateQuestion(request):
        try:
            data = json.loads(request.body)
            question_id = data['question_id']
            evaluation_type = data['evaluation_type']
            user_id = data['user_id']

            if QuestionEvaluation.objects.filter(question_id=question_id, user_id=user_id).exists():
                QuestionEvaluation.objects \
                    .filter(question_id=question_id, user_id=user_id) \
                    .update(evaluation_type=evaluation_type)
            else:
                QuestionEvaluation.objects \
                    .create(question_id=question_id, user_id=user_id, evaluation_type=evaluation_type)

            return responseData(data=True, message='Evaluate question successfully', status=200)
        except Exception as e:
            print(e)
            return responseData(data=False)

    @staticmethod
    @require_http_methods(['POST'])
    def ratingQuestion(request):
        try:
            data = json.loads(request.body)
            question_id = data['question_id']
            rating = data['rating']
            user_id = data['user_id']

            if QuestionRating.objects.filter(question_id=question_id, user_id=user_id).exists():
                QuestionRating.objects.filter(question_id=question_id, user_id=user_id).update(star_number=rating)
            else:
                QuestionRating.objects.create(question_id=question_id, user_id=user_id, star_number=rating)

            return responseData(data=True, message='Rate question successfully', status=200)
        except Exception as e:
            print(e)
            return responseData(data=False, message='Rate question failed', status=500)

    @staticmethod
    @require_http_methods(['GET'])
    def getAllQuestionsForAdmin(request):
        status = request.GET.get('status')  # Lấy giá trị của query parameter 'status'
        userEmail = request.GET.get('userEmail')  # Lấy giá trị của query parameter 'user_email'
        print(status)
        print(userEmail)
        try:
            questions = Question.objects.all()

            if status:
                questions = questions.filter(status=status)
            if userEmail:
                questions = questions.filter(user__email=userEmail)

            serializer = QuestionAdminSerializer(questions, many=True, context={'detail_mode': False})
            return responseData(data=serializer.data)
        except Exception as e:
            print(e)
            return responseData(None, status=4, message="Error when get all questions A in Questions Service")

    @staticmethod
    @require_http_methods(['GET'])
    def getDetailQuestionForAdmin(request, questionId):
        try:
            question = Question.objects.filter(id=questionId)
            serializer = QuestionAdminSerializer(question, many=True, context={'detail_mode': True})
            return responseData(data=serializer.data)
        except Exception as e:
            print(e)
            return responseData(None, status=4, message="Error when get detail question A in Questions Service")

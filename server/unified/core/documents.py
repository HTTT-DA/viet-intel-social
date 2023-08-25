from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from .models import Question

@registry.register_document
class QuestionDocument(Document):
    class Index:
        name = 'questions'

    content = fields.TextField(attr='content')

    class Django:
        model = Question
        # fields = ['id', 'content']

# controller.py
from django.views.decorators.csrf import csrf_exempt
from rest_framework.viewsets import ViewSet

from services.answer.models import Answer
from services.user.models import User
from services.question.models import Question

from django.http import HttpResponse
from datetime import datetime

import csv


def export(name, model):
    fields = [f.name for f in model._meta.fields]
    timestamp = datetime.now().isoformat()

    response = HttpResponse(content_type="text/csv")
    response[
        "Content-Disposition"
    ] = f"attachment; filename={name}_{timestamp}.csv"
    writer = csv.writer(response)

    writer.writerow(fields)

    for row in model.objects.values(*fields):
        writer.writerow([row[field] for field in fields])

    return response


class ExportController(ViewSet):
    @csrf_exempt
    def exportUser(self):
        return export('user', User)

    @csrf_exempt
    def exportQuestion(self):
        return export('question', Question)

    @csrf_exempt
    def exportAnswer(self):
        return export('answer', Answer)

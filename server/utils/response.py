from django.http import JsonResponse


def responseData(data="", statusCode=1, message="Success"):
    result = {
        'status': statusCode,
        'message': message,
        'data': data
    }
    return JsonResponse(result)
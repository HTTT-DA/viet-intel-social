from django.http import JsonResponse


def responseData(data="", status=200, message="Success"):
    result = {
        'status': status,
        'message': message,
        'data': data
    }
    return JsonResponse(result)
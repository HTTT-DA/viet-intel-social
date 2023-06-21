from rest_framework.response import Response


def response_data(data="", statusCode=1, message="Success"):
    result = {
        'statusCode': statusCode,
        'message': message,
        'data': data
    }
    return Response(result)

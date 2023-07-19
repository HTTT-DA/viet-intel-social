import jwt, datetime
from decouple import config
from rest_framework import exceptions


def createAccessToken(id, email, role):
    return jwt.encode({
        'user_id': id,
        'email': email,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=5),
        'iat': datetime.datetime.utcnow()
    }, 'access_secret', algorithm=config('JWT_ALGORITHM'))


def createRefreshToken(id, email, role):
    return jwt.encode({
        'user_id': id,
        'email': email,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow()
    }, 'refresh_secret', algorithm=config('JWT_ALGORITHM'))


def decodeAccessToken(token):
    try:
        payload = jwt.decode(token, 'access_secret', algorithm=config('JWT_ALGORITHM'))
        return payload['user_id']
    except:
        raise exceptions.AuthenticationFailed('unauthenticated')


def decodeRefreshToken(token):
    try:
        payload = jwt.decode(token, 'refresh_secret', algorithm=config('JWT_ALGORITHM'))
        return payload['user_id']
    except:
        raise exceptions.AuthenticationFailed('unauthenticated')

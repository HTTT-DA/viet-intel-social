from datetime import datetime, timedelta
import jwt
import pytz

SECRET_KEY = "c4e7d7ad8f874fb9e21f4567a82b68e01cdaa52601c768b3f4a0424eae36af448695a4e3e18fb1626e9cb6e0d640a16b3af482e82cda35f3fcd79887eb94d3d2"
JWT_ALGORITHM = "HS256"

vn_timezone = pytz.timezone('Asia/Ho_Chi_Minh')

expirationTime = datetime.now(vn_timezone) + timedelta(minutes=1)

accessTokenPayload = {
    'user_id': 1,
    'user_email': "test@gmail.com",
    'exp': expirationTime
}

accessToken = jwt.encode(accessTokenPayload, SECRET_KEY, algorithm=JWT_ALGORITHM)
print(accessToken)

payload = jwt.decode(accessToken, SECRET_KEY, algorithms=JWT_ALGORITHM)
payload2 = jwt.decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX2VtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJleHAiOjE2OTI4NDUyMzZ9.Dr2shheT8A2MP4LOtH4dFdVYVlHnELKsi8LNZrZ098k",
                      SECRET_KEY, algorithms=JWT_ALGORITHM)
print(payload)

expiration_datetime = datetime.fromtimestamp(
    payload["exp"], tz=vn_timezone)
expiration_datetime_2 = datetime.fromtimestamp(
    payload2["exp"], tz=vn_timezone)

print("Expiration time: ", expiration_datetime)
print("Expiration time 2: ", expiration_datetime_2)

if expiration_datetime < datetime.now(vn_timezone):
    print("Access Token 1 has expired.")
else:
    print("Access Token 1 is still valid.")
    
if expiration_datetime_2 < datetime.now(vn_timezone):
    print("Access Token 2 has expired.")
else:
    print("Access Token 2 is still valid.")

print(datetime.now(vn_timezone))

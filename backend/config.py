from datetime import timedelta

SQLALCHEMY_DATABASE_URI = "sqlite:///test.db"
SQLALCHEMY_TRACK_MODIFICATIONS=False

SECRET_KEY="super sekret"

JWT_TOKEN_LOCATION = ["headers", "cookies"]
JWT_COOKIE_SECURE = False
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
JWT_COOKIE_CSRF_PROTECT = False

CORS_ORIGIN="http://localhost:3000"

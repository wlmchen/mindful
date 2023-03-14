import json
from datetime import datetime, timedelta, timezone

from flask import Blueprint, jsonify, request
from flask_expects_json import expects_json
from flask_jwt_extended import (create_access_token, current_user, get_jwt,
                                get_jwt_identity, jwt_required,
                                set_access_cookies, unset_jwt_cookies)
from sqlalchemy import exc

from .. import db, jwt
from ..models import User

bp = Blueprint('auth', __name__, url_prefix="/auth")


@bp.route('/register', methods=["POST"])
@expects_json({
    'type': 'object',
    'properties': {
        'username': {'type': 'string'},
        'password': {'type': 'string'}
    },
    'required': ['username', 'password']
})
def register():
    username = request.json['username']
    password = request.json['password']

    user = User(username=username, password=password)
    try:
        db.session.add(user)
        db.session.commit()

    except exc.IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Username In Use"}), 400
    
    access_token = create_access_token(identity=user)

    response = jsonify(message="Registration Successful", access_token=access_token, user={
        'id': user.id,
        'username': user.username
    })
    set_access_cookies(response, access_token)
    return response


@bp.route("/login", methods=["POST"])
@expects_json({
    'type': 'object',
    'properties': {
        'username': {'type': 'string'},
        'password': {'type': 'string'}
    },
    'required': ['username', 'password']
})
def login():
    username = request.json['username']
    password = request.json['password']

    user = User.query.filter_by(username=username).first()

    if not user or not user.verify_password(password):
        return jsonify({"message": "Incorrect Username/Password"}), 400

    access_token = create_access_token(identity=user)

    response = jsonify(message="Login Successful", access_token=access_token, user={
        'id': user.id,
        'username': user.username
    })
    set_access_cookies(response, access_token)
    return response


@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()


@bp.route("/whoami", methods=["GET"])
@jwt_required()
def whoami():
    return jsonify(
        id=current_user.id,
        username=current_user.username,
    )


@bp.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "logout successful"})
    unset_jwt_cookies(response)
    return response


@bp.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        identity = User.query.filter_by(id=get_jwt_identity()).first()

        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=identity)
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response

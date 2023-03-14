from re import sub
from turtle import pd
from flask import Blueprint, jsonify, request
from flask_expects_json import expects_json
from flask_jwt_extended import (create_access_token, current_user, get_jwt,
                                get_jwt_identity, jwt_required,
                                set_access_cookies, unset_jwt_cookies)
from ..models import Submission, User
from .. import emotion, db
import json
from sqlalchemy import desc

import pandas as pd
import plotly
import plotly.express as px

bp = Blueprint('emotions', __name__, url_prefix="/emotions")

@bp.route("/recent", methods=["GET"])
@jwt_required()
def recent():
    # submissions = db.session.execute(db.select(User.submissions).filter_by(id=current_user.id).order_by(Submission.time_created).limit(2)).all()
    # submissions = db.session.execute(db.select(User.submissions)).all()
    # submissions = db.session.query(User.submissions).filter_by(id=current_user.id).order_by(Submission.time_created).limit(2).all()
    # submissions = db.session.query(User.submissions).filter_by(id=current_user.id).order_by(Submission.time_created).all()
    submissions = db.session.query(Submission).filter_by(user_id=current_user.id).order_by(desc(Submission.time_created)).limit(2).all()
    if len(submissions) == 0:
        return jsonify({"message": "No Emotional Data"})
    recent = json.loads(submissions[0].emotions)
    if len(submissions) == 1:
        return jsonify(recent[0:5] + [["mode", "first"]])
    penultimate = dict(json.loads(submissions[1].emotions))

    res = []

    top = recent[0:5]
    for emotion, val in top:
        diff = (val - penultimate[emotion])
        res.append((emotion, diff))

    return jsonify(res + [["mode", "change"]])
 
@bp.route("/plot", methods=["GET"])
@jwt_required()
def plot():
    submissions = db.session.query(Submission).filter_by(user_id=current_user.id).order_by(desc(Submission.time_created)).all()
    if len(submissions) == 0:
        return jsonify({"message": "No Emotional Data"})
    emotions = [e[0] for e in json.loads(submissions[0].emotions)[0:5]]
    res = []
    for sub in submissions:
        data = {}
        e = dict(json.loads(sub.emotions))
        for emotion in emotions:
            res.append({
                "emotion": emotion,
                "value": e[emotion],
                "timestamp": sub.time_created
            })
        res.append(data)

    df = pd.DataFrame(res)
    fig = px.line(df, x="timestamp", y="value", color="emotion", labels=dict(timestamp="Time", value="Emotional Composition", emotion="Emotion"))
    
    graphJSON = plotly.io.to_json(fig, pretty=True)
    return graphJSON
from flask import Blueprint, jsonify, request
from flask_expects_json import expects_json
from flask_jwt_extended import (create_access_token, current_user, get_jwt,
                                get_jwt_identity, jwt_required,
                                set_access_cookies, unset_jwt_cookies)
from ..models import Submission, Task, User
from sqlalchemy import func

from .. import emotion, db
import json

bp = Blueprint('journal', __name__, url_prefix="/journal")

with open("backend/ekman_mapping.json", "r") as f:
    emotion_mapping = json.load(f)

TASK_TOTAL = 15
CATEGORY_NUM = 5


def get_emotions(text):
    labels = emotion(text)[0]
    tup = [(e['label'], e['score']) for e in labels]
    return sorted(tup, key=lambda d: d[1], reverse=True)


@bp.route("/add", methods=["POST"])
@expects_json({
    'type': 'object',
    'properties': {
        'content': {'type': 'string'}
    },
    'required': ['content']
})
@jwt_required()
def add():
    content = request.json['content']
    labels = get_emotions(content)
    entry = Submission(
        user_id=current_user.id,
        content=content,
        emotions=json.dumps(labels)
    )
    db.session.add(entry)
    db.session.commit()

    # assn tasks
    ignore_emotions = ["neutral"]
    ignore_categories = ["surprise"]
    categories = {}
    for emotion, _ in labels:
        if emotion in ignore_emotions:
            continue
        category = [key for key, value in emotion_mapping.items()
                    if emotion in value][0]
        if category not in ignore_categories:
            if category not in categories:
                categories[category] = 1
            else:
                categories[category] += 1

    total_count = sum(categories.values())
    # replace emotion count with task count
    for emotion, count in categories.items():
        categories[emotion] = int(TASK_TOTAL * count/total_count)
    print(categories)
    tasks = []
    for category, count in categories.items():
        tasks += [item for t in
                  db.session.query(Task.id).filter_by(category=category).order_by(
                      func.random()).limit(count).all()
                  for item in t
                  ]

    print(tasks)
    user = db.session.query(User).filter_by(id=current_user.id).first()
    user.tasks_assigned = json.dumps(tasks)
    user.tasks_completed = json.dumps([])

    db.session.commit()

    return jsonify(labels)

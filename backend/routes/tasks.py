from re import sub
from turtle import pd
from flask import Blueprint, jsonify, request
from flask_expects_json import expects_json
from flask_jwt_extended import (create_access_token, current_user, get_jwt,
                                get_jwt_identity, jwt_required,
                                set_access_cookies, unset_jwt_cookies)
from ..models import Submission, User, Task
from .. import emotion, db
import json
from sqlalchemy import desc

import pandas as pd
import plotly
import plotly.express as px

import csv


bp = Blueprint('tasks', __name__, url_prefix="/tasks")

@bp.cli.command("import")
def imp():
    with open("backend/tasks.csv", "r") as f:
        csv_reader = csv.DictReader(f)
        for row in csv_reader:
            task = Task(**{
                "category": row["category"],
                "content": row["content"]
            })
            db.session.add(task)
        db.session.commit()

@bp.route("/get", methods=["GET"])
@jwt_required()
def get():
    user = db.session.query(User).filter_by(id=current_user.id).first()
    tasks_assigned = json.loads(user.tasks_assigned)
    tasks_completed = json.loads(user.tasks_completed)
    res = []
    for task_id in tasks_assigned:
        completed = task_id in tasks_completed
        content = db.session.query(Task.content).filter_by(id=task_id).scalar()
        res.append({
            "id": task_id,
            "content": content,
            "completed": completed
        })
    return jsonify(res)

@bp.route("/complete", methods=["POST"])
@expects_json({
    'type': 'object',
    'properties': {
        'id': {'type': 'number'}
    },
    'required': ['id']
})
@jwt_required()
def complete():
    user = db.session.query(User).filter_by(id=current_user.id).first()
    completed = json.loads(user.tasks_completed)
    if request.json['id'] not in completed:
        completed.append(request.json['id'])
    user.tasks_completed = json.dumps(completed)
    db.session.commit()
    return jsonify(message="success")
from . import db
from sqlalchemy import func

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String)
    submissions = db.relationship('Submission', backref="user")
    tasks_assigned = db.Column(db.String, default="[]")
    tasks_completed = db.Column(db.String, default="[]")

    def verify_password(self, password):
        return self.password == password # TODO: hashing


class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    time_created = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    content = db.Column(db.String, nullable=False)
    emotions = db.Column(db.String)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String, nullable=False)
    content = db.Column(db.String, nullable=False)
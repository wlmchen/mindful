from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from transformers import RobertaTokenizerFast, TFRobertaForSequenceClassification, pipeline


app = Flask(__name__)
app.config.from_pyfile('config.py')

db = SQLAlchemy(app)

jwt = JWTManager(app)



tokenizer = RobertaTokenizerFast.from_pretrained("arpanghoshal/EmoRoBERTa")
model = TFRobertaForSequenceClassification.from_pretrained("arpanghoshal/EmoRoBERTa")

emotion = pipeline(model='arpanghoshal/EmoRoBERTa', tokenizer=tokenizer, return_all_scores = True)

# CORS
@app.after_request
def after_request(response):
    if request.method == "OPTIONS":
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Headers', 'x-csrf-token')
        response.headers.add('Access-Control-Allow-Methods',
                            'GET, POST, OPTIONS, PUT, PATCH, DELETE')
        response.headers.add('Access-Control-Allow-Origin', app.config["CORS_ORIGIN"])

    else:
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            response.headers.add('Access-Control-Allow-Origin', app.config["CORS_ORIGIN"])
    return response

from .routes import auth, journal, emotions, tasks
app.register_blueprint(auth.bp)
app.register_blueprint(journal.bp)
app.register_blueprint(emotions.bp)
app.register_blueprint(tasks.bp)

if __name__ == "__main__":
    app.run()
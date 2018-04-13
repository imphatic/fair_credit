from src import app
from flask import Blueprint, render_template
from src.models import Person
from src.utils import create_response, serialize_list

mod = Blueprint('main', __name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/')
def name():
    try:
        persons = Person.query.all()
        persons_list = serialize_list(persons)
        return create_response(data={'persons': persons_list})
    except Exception as ex:
        return create_response(data={}, status=400, message=str(ex))

from src import app
from flask import Blueprint
from src.models import Person
from src.utils import create_response, serialize_list

mod = Blueprint('main', __name__)


# function that is called when you visit /
@app.route('/')
def index():
    return '<h1>Hello Word!</h1>'


# function that is called when you visit /persons
@app.route('/persons')
def name():
    try:
        persons = Person.query.all()
        persons_list = serialize_list(persons)
        return create_response(data={'persons': persons_list})
    except Exception as ex:
        return create_response(data={}, status=400, message=str(ex))

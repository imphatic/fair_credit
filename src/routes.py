from src import app
from flask import Blueprint, render_template, request, abort
from flask import jsonify
from src.api.fair_credit import FairCredit
from src.decorators import json_api_response

mod = Blueprint('main', __name__)

fair_credit_api = FairCredit(.35)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/credit_lines', methods=['GET'])
@json_api_response()
def get_credit_lines():
    credit_lines = FairCredit.get_credit_lines()
    return credit_lines


@app.route('/api/credit_line', methods=['POST'])
@json_api_response()
def new_credit_line():
    data = request.json['data']
    credit_line = FairCredit.new_credit_line(data['name'], data['credit_limit'])

    return credit_line


@app.route('/api/transaction/<int:transaction_id>', methods=['GET'])
@json_api_response()
def get_transaction(transaction_id):
    transaction = FairCredit.get_transaction(transaction_id)

    if transaction is None:
        abort(404)

    return transaction


@app.route('/api/transaction', methods=['POST'])
@json_api_response()
def new_transaction():
    data = request.json['data']
    date_time = data['date_time'] if 'date_time' in data else None

    fair_credit_api.credit_line_id = data['credit_line_id']
    transaction = fair_credit_api.new_transaction(data['type'], data['amount'], date_time)

    return transaction


@app.route('/api/transaction/<int:transaction_id>', methods=['PUT'])
@json_api_response()
def edit_transaction(transaction_id):
    data = dict(request.json['data'])
    transaction = fair_credit_api.edit_transaction(transaction_id, data)
    return transaction


@app.route('/api/transaction/<int:transaction_id>', methods=['DELETE'])
@json_api_response()
def delete_transaction(transaction_id):
    transaction = fair_credit_api.delete_transaction(transaction_id)
    return transaction


@app.route('/api/ledger/<int:credit_line_id>/balance', methods=['GET'])
@json_api_response()
def get_balance(credit_line_id):
    fair_credit_api.credit_line_id = credit_line_id
    return fair_credit_api.get_balance()


@app.route('/api/ledger/<int:credit_line_id>/interest', methods=['GET'])
@json_api_response()
def get_interest(credit_line_id):
    fair_credit_api.credit_line_id = credit_line_id
    return fair_credit_api.get_interest()


@app.route('/api/ledger/<int:credit_line_id>/<date_start>/<date_end>', methods=['GET'])
@json_api_response()
def get_ledger(credit_line_id, date_start, date_end):
    fair_credit_api.credit_line_id = credit_line_id
    return {
        'transactions': FairCredit.get_ledger(credit_line_id, date_start, date_end),
        'interest': fair_credit_api.get_interest(),
        'balance': fair_credit_api.get_balance()
    }

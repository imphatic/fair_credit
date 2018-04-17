from src import app
from flask import Blueprint, render_template, request, abort
from flask import jsonify
from src.api.fair_credit import FairCredit
from src.decorators import json_api_response

mod = Blueprint('main', __name__)


@app.route('/')
def index():
    return render_template('index.html')


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
    transaction = FairCredit.new_transaction(data['type'], data['amount'], date_time)

    return transaction


@app.route('/api/transaction/<int:transaction_id>', methods=['PUT'])
@json_api_response()
def edit_transaction(transaction_id):
    data = dict(request.json['data'])
    transaction = FairCredit.edit_transaction(transaction_id, data)
    return transaction


@app.route('/api/transaction/<int:transaction_id>', methods=['DELETE'])
@json_api_response()
def delete_transaction(transaction_id):
    transaction = FairCredit.delete_transaction(transaction_id)
    return transaction


@app.route('/api/ledger/balance', methods=['GET'])
@json_api_response()
def get_balance():
    return FairCredit.get_balance()


@app.route('/api/ledger/interest', methods=['GET'])
@json_api_response()
def get_interest():
    return FairCredit.get_interest()


@app.route('/api/ledger/<date_start>/<date_end>', methods=['GET'])
@json_api_response()
def get_ledger(date_start, date_end):
    return {
        'transactions': FairCredit.get_ledger(date_start, date_end),
        'interest': FairCredit.get_interest(),
        'balance': FairCredit.get_balance()
    }

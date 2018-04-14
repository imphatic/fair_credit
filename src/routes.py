from src import app, db
from flask import Blueprint, render_template, request, abort
from src.models import Transactions
from src.utils import serialize_list
from flask import jsonify
from src.api.fair_credit import FairCredit

mod = Blueprint('main', __name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/transaction/<int:transaction_id>', methods=['GET'])
def get_transaction(transaction_id):
    #todo: move this into fair_credit.py
    transaction = Transactions.query.get(transaction_id)

    if transaction is None:
        abort(404)

    return jsonify(transaction.to_dict())


@app.route('/api/transaction', methods=['POST'])
def new_transaction():
    if not request.json or 'data' not in request.json: #todo: make this sort of thing into a decorator!
        abort(400)

    data = request.json['data']
    date_time = data['date_time'] if 'date_time' in data else None
    transaction = FairCredit.new_transaction(data['type'], data['amount'], date_time)

    return jsonify({"data": transaction})


@app.route('/api/ledger/<date_start>/<date_end>', methods=['GET'])
def get_ledger(date_start, date_end):

    ledger = FairCredit.get_ledger(date_start, date_end)

    return jsonify({"data": ledger})





#Next todo: implement interest accrude API and principal balance API responses.

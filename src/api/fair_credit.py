from src import app, db
from src.models import Transactions
import datetime
import time

import sys # print('hey!', file=sys.stderr)

class FairCredit:

    def __init__(self):
        pass

    @staticmethod
    def new_transaction(transaction_type, amount, date_time=None):
        transaction_type = int(transaction_type)
        amount = float(amount)

        balance = FairCredit.get_balance()

        if transaction_type == 1:
            balance -= amount
        elif transaction_type == 2:
            balance += amount

        date_time = datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S') if date_time is None else date_time

        transaction = Transactions(transaction_type, amount, balance, date_time)
        db.session.add(transaction)
        db.session.commit()

        return {}

    @staticmethod
    def get_balance():
        # get the most recent transaction
        transaction = Transactions.query.order_by(Transactions.date_time.desc()).first()

        if transaction is None:
            balance = 0
        else:
            balance = transaction.balance

        return float(balance)

    @staticmethod
    def get_interest():
        return float(69.69)

    @staticmethod
    def get_ledger(date_start, date_end):

        date_start += ' 00:00:00'
        date_end += ' 11:59:59'

        ledger = Transactions.query.filter(Transactions.date_time >= date_start, Transactions.date_time <= date_end)\
            .order_by(Transactions.date_time.desc()).all()

        return [{'id': row.id, 'type': row.type, 'amount': row.amount, 'balance': row.balance, 'date_time': row.date_time} for row in ledger]



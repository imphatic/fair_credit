from src import app, db
from sqlalchemy import exc
from src.models import Transactions
from datetime import datetime
from time import time


class FairCredit:

    def __init__(self, apr):
        self.apr = apr
        pass

    @staticmethod
    def get_transaction(transaction_id):
        """
        Get an existing transaction
        :param transaction_id: transaction id to retrieve
        :return: dict keyed with database columns
        """

        transaction = Transactions.query.get(transaction_id)
        return transaction.to_dict() if transaction is not None else None

    def new_transaction(self, transaction_type, amount, date_time=None):
        """
        Create a new transaction.
        :param transaction_type: 1 = debit, 2 = credit, 3 = interest payment
        :param amount: amount of the transaction
        :param date_time: date the transaction occurred
        :return: empty dict or errors
        """

        transaction_type = int(transaction_type)
        amount = float(amount)

        balance = self.get_balance()

        if transaction_type == 1:
            balance -= amount
        elif transaction_type == 2:
            balance += amount
        elif transaction_type == 3:
            balance = self.balance_after_interest_payment(amount)

        date_time = datetime.fromtimestamp(time()).strftime('%Y-%m-%d %H:%M:%S') if date_time is None else date_time

        transaction = Transactions(transaction_type, amount, balance, date_time)
        db.session.add(transaction)

        try:
            db.session.commit()
            return {}

        except exc.SQLAlchemyError:
            return {'errors': 'Database error.'}


    def edit_transaction(self, transaction_id, updates):
        """
        Edit a transaction
        :param transaction_id: id of the transaction to edit
        :param updates: dictionary keyed with database columns with changes as values
        :return: empty dict or errors
        """

        try:
            transaction = Transactions.query.get(transaction_id)

            if 'type' in updates:
                transaction.type = int(updates['type'])

            if 'amount' in updates:
                transaction.amount = float(updates['amount'])

            if 'balance' in updates:
                transaction.balance = float(updates['balance'])

            if 'date_time' in updates:
                transaction.date_time = updates['date_time']

            db.session.commit()
            return {}

        except exc.SQLAlchemyError:
            return {'errors': 'Database error.'}

    def delete_transaction(transaction_id):
        """
        Remove a transaction
        :param transaction_id: id of the transaction to delete
        :return: empty dict or errors
        """

        try:
            transaction = Transactions.query.get(transaction_id)
            db.session.delete(transaction)
            db.session.commit()
            return {}

        except exc.SQLAlchemyError:
            return {'errors': 'Database error.'}

    def balance_after_interest_payment(self, amount):
        """
        returns the balance after an interest payment is made
        if the interest payment made is less than the interest owed then the difference is added to the balance
        :param amount: amount of interest paid
        :return: balance
        """

        interest_owed = self.get_interest()
        balance = self.get_balance()

        balance += interest_owed - amount

        return balance

    def get_balance(self):
        """
        get the current balance
        :return: balance
        """

        # get the most recent transaction
        transaction = Transactions.query.order_by(Transactions.date_time.desc()).first()

        if transaction is None:
            balance = 0
        else:
            balance = transaction.balance

        return float(balance)

    def get_interest(self):
        """
        Get the current interest owed
        :return: interest
        """

        # Find the last interest payment (if it exists)
        last_interest_payment = Transactions.query.filter(Transactions.type == 3).order_by(Transactions.date_time.desc()).first()

        if last_interest_payment is None:
            # get all transactions
            transactions = Transactions.query.order_by(Transactions.date_time).all()
        else:
            # get all transactions past the latest interest payment
            transactions = Transactions.query.filter(Transactions.date_time >= last_interest_payment.date_time).order_by(Transactions.date_time).all()

        interest = 0.0
        apr_per_day = self.apr/365
        now = datetime.today()

        if len(transactions):
            if len(transactions) == 1:
                # for one transaction we just get the difference between that transaction and today
                transaction = next(iter(transactions))
                delta = now - transaction.date_time
                interest = (delta.days * apr_per_day) * transaction.balance
            else:
                for i, transaction in enumerate(transactions):
                    next_transaction = transactions[i + 1] if i + 1 < len(transactions) else None
                    day1 = transaction.date_time
                    day2 = next_transaction.date_time if next_transaction else now

                    delta = day1 - day2
                    interest += (delta.days * apr_per_day) * transaction.balance

        return float(interest)

    @staticmethod
    def get_ledger(date_start, date_end):
        """
        Get transactions
        :param date_start: beginning date range to include in transaction list
        :param date_end: ending date range to include in transactions list
        :return: dict of transactions
        """

        date_start += ' 00:00:00'
        date_end += ' 11:59:59'

        ledger = Transactions.query.filter(Transactions.date_time >= date_start, Transactions.date_time <= date_end)\
            .order_by(Transactions.date_time.desc()).all()

        return [row.to_dict() for row in ledger]

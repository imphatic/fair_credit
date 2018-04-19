from src import app, db
from sqlalchemy import exc
from src.models import Transactions, CreditLines
from datetime import datetime
from time import time
from src.api.exceptions import CreditLimitExceededError


class FairCredit:

    def __init__(self, apr, credit_line_id=None):
        self.apr = apr
        self.credit_line_id = credit_line_id
        self.credit_limit = None
        pass

    @staticmethod
    def get_credit_lines():
        """
        Get all credit lines
        :return: dict of credit lines
        """
        credit_lines = CreditLines.query.order_by(CreditLines.name).all()
        return [row.to_dict() for row in credit_lines]

    @staticmethod
    def new_credit_line(name, credit_limit):
        """
        Create a new line of credit
        :param name: used only as a label
        :param credit_limit: the max amount that can be drawn
        :return:
        """
        credit_line = CreditLines(name, credit_limit)
        db.session.add(credit_line)

        try:
            db.session.commit()
            return {'id': credit_line.id}

        except exc.SQLAlchemyError:
            raise

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

        try:
            if transaction_type == 1:
                balance -= amount
                if abs(balance) > self.get_credit_limit():
                    raise CreditLimitExceededError(amount, self.get_credit_limit())
            elif transaction_type == 2:
                balance += amount
            elif transaction_type == 3:
                balance = self.balance_after_interest_payment(amount)

            date_time = datetime.fromtimestamp(time()).strftime('%Y-%m-%d %H:%M:%S') if date_time is None else date_time

            transaction = Transactions(self.credit_line_id, transaction_type, amount, balance, date_time)
            db.session.add(transaction)

            db.session.commit()
            return {}

        except exc.SQLAlchemyError:
            raise
        except CreditLimitExceededError:
            raise

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
            raise

    @staticmethod
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
            raise

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
        transaction = Transactions.query\
            .filter(Transactions.credit_line_id == self.credit_line_id)\
            .order_by(Transactions.date_time.desc()).first()

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
        last_interest_payment = Transactions.query\
            .filter(Transactions.credit_line_id == self.credit_line_id, Transactions.type == 3)\
            .order_by(Transactions.date_time.desc()).first()

        if last_interest_payment is None:
            # get all transactions
            transactions = Transactions.query\
                .filter(Transactions.credit_line_id == self.credit_line_id)\
                .order_by(Transactions.date_time).all()
        else:
            # get all transactions past the latest interest payment
            transactions = Transactions.query\
                .filter(Transactions.credit_line_id == self.credit_line_id, Transactions.date_time >= last_interest_payment.date_time)\
                .order_by(Transactions.date_time).all()

        interest = 0.0
        apr_per_day = self.apr/365
        now = datetime.today()

        if len(transactions):
            for i, transaction in enumerate(transactions):
                next_transaction = transactions[i + 1] if i + 1 < len(transactions) else None
                day1 = transaction.date_time
                day2 = next_transaction.date_time if next_transaction else now

                delta = day1 - day2
                interest += (delta.days * apr_per_day) * transaction.balance

        return float(interest)

    def get_credit_limit(self):
        """
        get the credit limit of the current instance
        :return: the credit limit
        """
        if not self.credit_limit:
            credit_line = CreditLines.query.get(self.credit_line_id)
            self.credit_limit = credit_line.credit_limit

        return self.credit_limit

    @staticmethod
    def get_ledger(credit_line_id, date_start, date_end):
        """
        Get transactions
        :param credit_line_id: of the ledger you wish to retrieve
        :param date_start: beginning date range to include in transaction list
        :param date_end: ending date range to include in transactions list
        :return: dict of transactions
        """

        date_start += ' 00:00:00'
        date_end += ' 11:59:59'

        ledger = Transactions.query.filter(Transactions.credit_line_id == credit_line_id,
                                           Transactions.date_time >= date_start,
                                           Transactions.date_time <= date_end)\
                                           .order_by(Transactions.date_time.desc()).all()

        return [row.to_dict() for row in ledger]

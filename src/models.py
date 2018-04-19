from src import db
from src.utils import Mixin


class Transactions(Mixin, db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, unique=True, primary_key=True)
    credit_line_id = db.Column(db.Integer, nullable=False)
    type = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    balance = db.Column(db.Float, nullable=False)
    date_time = db.Column(db.DateTime, nullable=True)

    def __init__(self, credit_line_id, type,  amount, balance, date_time=None):
        self.credit_line_id = credit_line_id
        self.type = type
        self.amount = amount
        self.balance = balance
        self.date_time = date_time


class CreditLines(Mixin, db.Model):
    __tablename__ = "credit_lines"

    id = db.Column(db.Integer, unique=True, primary_key=True)
    name = db.Column(db.String, nullable=False)
    credit_limit = db.Column(db.Float, nullable=False)

    def __init__(self, name, credit_limit):
        self.name = name
        self.credit_limit = credit_limit

from src import db
from src.utils import Mixin


class Transactions(Mixin, db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, unique=True, primary_key=True)
    type = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    balance = db.Column(db.Float, nullable=False)
    date_time = db.Column(db.DateTime, nullable=True)

    def __init__(self, type, amount, balance, date_time=None):
        self.type = type
        self.amount = amount
        self.balance = balance
        self.date_time = date_time

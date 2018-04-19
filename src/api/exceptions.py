class Error(Exception):
    pass


class CreditLimitExceededError(Error):

    def __init__(self, amount, credit_limit):
        msg = str(amount) + ' was not applied because it would exceed the credit limit of ' + str(credit_limit)
        self.message = msg

    def __str__(self):
        return self.message

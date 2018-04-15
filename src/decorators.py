import functools
from flask import jsonify, abort


class json_api_response(object):

    def __init__(self, *args, **kwargs):
        """Decorator arguments"""
        pass

    def __call__(self, function):
        @functools.wraps(function)
        def wrapper(*args, **kwargs):
            result = function(*args, **kwargs)
            return jsonify({'data': result})
        return wrapper

import functools


class decorator_class(object):
    """General decorator class"""

    def __init__(self, *args, **kwargs):
        """Decorator arguments"""
        pass

    def __call__(self, function):
        @functools.wraps(function)
        def wrapper(*args, **kwargs):
            # Write decorator function logic here
            # Before function call
            # ...
            result = function(*args, **kwargs)
            # After function call
            # ...
            return result
        return wrapper

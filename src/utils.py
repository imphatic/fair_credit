from flask import jsonify


class Mixin():

    def to_dict(self):
        d_out = dict((key, val) for key, val in self.__dict__.items())
        d_out.pop('_sa_instance_state', None)
        return d_out


def serialize_list(items):
    if not items or items is None:
        return []
    return [x.to_dict() for x in items]

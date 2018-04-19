from subprocess import call
call(["docker-compose", "exec", "-T", "app", "python", "src/tests/test_api.py"])

import os

os.environ["DATABASE_URL"] = "sqlite://"
os.environ["DEBUG"] = "false"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-that-is-at-least-32-bytes"

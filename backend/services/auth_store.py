import hashlib
import json
import os
import time

import jwt

USERS = os.path.join(os.path.dirname(__file__), "..", "users_data.json")
SECRET = os.getenv("JWT_SECRET", "deepshield-dev-secret")


def _load():
    if os.path.exists(USERS):
        with open(USERS, "r") as f:
            return json.load(f)
    return {"users": []}


def _save(data):
    with open(USERS, "w") as f:
        json.dump(data, f, indent=2)


def _hash(password):
    return hashlib.sha256(password.encode()).hexdigest()


def register_user(email, password, name):
    data = _load()
    if any(u["email"].lower() == email.lower() for u in data["users"]):
        return {"error": "User already exists"}
    data["users"].append({"email": email, "name": name, "password_hash": _hash(password), "created_at": time.time()})
    _save(data)
    return {"email": email, "name": name}


def login_user(email, password):
    hashed = _hash(password)
    for user in _load()["users"]:
        if user["email"].lower() == email.lower() and user["password_hash"] == hashed:
            token = jwt.encode({"sub": user["email"], "name": user["name"], "exp": int(time.time()) + 86400}, SECRET, algorithm="HS256")
            return {"access_token": token, "token_type": "bearer"}
    return {"error": "Invalid credentials"}


def get_user_from_token(token):
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        return {"email": payload.get("sub"), "name": payload.get("name")}
    except Exception:
        return None

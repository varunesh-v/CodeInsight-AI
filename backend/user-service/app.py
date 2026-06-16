import os
import secrets
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from db import get_connection
from dotenv import load_dotenv
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)

app = Flask(__name__)
bcrypt = Bcrypt(app)
load_dotenv()

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

jwt = JWTManager(app)

@app.route("/")
def home():
    return {
        "service": "User Service",
        "status": "running"
    }

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and Password required"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id FROM users WHERE email=%s",
        (email,)
    )
    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        conn.close()
        return jsonify({"error": "Email already exists"}), 409

    cursor.execute(
        "INSERT INTO users (email, password) VALUES (%s, %s)",
        (email, hashed_password)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "User registered successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE email=%s",
        (email,)
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid password"}), 401

    access_token = create_access_token(identity=user["email"])
    return jsonify({"token": access_token}), 200

@app.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    return jsonify({
        "email": current_user,
        "message": "Protected route working"
    })

@app.route("/forgot-password", methods=["POST", "OPTIONS"])
def forgot_password():
    if request.method == "OPTIONS":
        return jsonify({"status": "CORS preflight ok"}), 200

    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()

    if not user:
        cursor.close()
        conn.close()
        return jsonify({"message": "If that email exists, a password reset link has been sent."}), 200

    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.now() + timedelta(minutes=15)

    cursor.execute(
        "UPDATE users SET reset_token=%s, reset_expires_at=%s WHERE email=%s",
        (reset_token, expires_at, email)
    )
    conn.commit()
    cursor.close()
    conn.close()

    print("\n---------------- RESET EMAIL SIMULATION ----------------")
    print(f"To: {email}")
    print(f"Link: http://localhost:5173/reset-password?token={reset_token}")
    print("--------------------------------------------------------\n")

    return jsonify({"message": "If that email exists, a password reset link has been sent."}), 200

@app.route("/reset-password-confirm", methods=["POST", "OPTIONS"])
def reset_password_confirm():
    if request.method == "OPTIONS":
        return jsonify({"status": "CORS preflight ok"}), 200

    data = request.get_json()
    token = data.get("token")
    new_password = data.get("password")

    if not token or not new_password:
        return jsonify({"error": "Token and password are required"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id, reset_expires_at FROM users WHERE reset_token=%s", (token,))
    user = cursor.fetchone()

    if not user:
        cursor.close()
        conn.close()
        return jsonify({"error": "Invalid or expired reset token"}), 400

    if datetime.now() > user["reset_expires_at"]:
        cursor.close()
        conn.close()
        return jsonify({"error": "Reset token has expired"}), 400

    hashed_password = bcrypt.generate_password_hash(new_password).decode("utf-8")
    cursor.execute(
        "UPDATE users SET password=%s, reset_token=NULL, reset_expires_at=NULL WHERE id=%s",
        (hashed_password, user["id"])
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Password updated successfully"}), 200

if __name__ == "__main__":
    app.run(
    host="0.0.0.0",
    port=5000,
    debug=True
)
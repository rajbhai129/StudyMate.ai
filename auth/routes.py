# auth/routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import User
from bson import ObjectId

# Ek "Blueprint" banate hain jise baad mein app.py se jodenge
auth_bp = Blueprint('auth', __name__)

mongo_db = None
bcrypt = None
jwt = None

# app.py se database connection (db) yahan laane ke liye
def init_auth_routes(db_connection, bcrypt_instance, jwt_instance):
    global mongo_db, bcrypt, jwt
    mongo_db = db_connection
    bcrypt = bcrypt_instance
    jwt = jwt_instance

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json or {}
    # Debug: confirm API hit and payload
    print("👉 REGISTER API HIT")
    print("DATA:", data)

    # Debug: show which DB and collections are visible
    try:
        print("👉 DB NAME:", getattr(mongo_db, "name", None))
        print("👉 COLLECTIONS:", mongo_db.list_collection_names())
    except Exception as e:
        print("👉 DB INFO ERROR:", e)

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    # Validation
    if not name or not email or not password:
        return jsonify({"error": "Missing name, email, or password"}), 400
    
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    # 1. MongoDB mein check karein ki email pehle se hai ya nahi
    if mongo_db.users.find_one({"email": email}):
        return jsonify({"error": "User already exists with this email"}), 409

    # 2. Password ko hash (Hash) karein taki secure rahe
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # 3. MongoDB mein naya user save karein
    new_user = User(name, email, hashed_password)
    
    # 4. MongoDB mein insert karein (with debug)
    try:
        result = mongo_db.users.insert_one(new_user.to_dict())
        print("👉 INSERTED ID:", result.inserted_id)
    except Exception as e:
        print("👉 INSERT ERROR:", e)
        return jsonify({"error": "Database insert failed", "details": str(e)}), 500

    return jsonify({
        "message": "Registration successful! 🎉 Please login.",
        "user_id": str(result.inserted_id)
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    # 1. MongoDB mein user email se khojein
    user_data = mongo_db.users.find_one({"email": email})
    
    if not user_data:
        return jsonify({"error": "Invalid email or password"}), 401

    # Debug: check stored fields
    print("👉 USER DATA KEYS:", user_data.keys())
    print("👉 USER DATA:", {k: v for k, v in user_data.items() if k != "password_hash"})

    # 2. Agar user milta hai aur password sahi hai
    password_field = user_data.get("password_hash") or user_data.get("password")
    
    if not password_field:
        print("👉 PASSWORD FIELD NOT FOUND")
        return jsonify({"error": "Invalid email or password"}), 401
    
    if not bcrypt.check_password_hash(password_field, password):
        print("👉 PASSWORD MISMATCH")
        return jsonify({"error": "Invalid email or password"}), 401

    # 3. JWT token banayein
    access_token = create_access_token(
        identity=str(user_data["_id"]),
        additional_claims={"name": user_data["name"], "email": user_data["email"]}
    )

    return jsonify({
        "message": "Login successful! Welcome back 🚀",
        "token": access_token,
        "user": {
            "id": str(user_data["_id"]),
            "name": user_data["name"],
            "email": user_data["email"]
        }
    }), 200

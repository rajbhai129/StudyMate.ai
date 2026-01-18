# models.py
from datetime import datetime

class User:
    """StudyMate.ai User Schema/Model"""
    def __init__(self, name, email, password_hash, created_at=None):
        self.name = name
        self.email = email
        self.password_hash = password_hash
        if created_at is None:
            self.created_at = datetime.utcnow()

    # Function to convert data to dictionary format
    def to_dict(self):
        return {
            "name": self.name,
            "email": self.email,
            "password_hash": self.password_hash,
            "created_at": self.created_at.isoformat()
        }

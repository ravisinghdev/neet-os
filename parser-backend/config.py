# config.py
import os
from dotenv import load_dotenv

load_dotenv()

# 🛠️ Supabase Database Connection
SUPABASE_DB = {
    "host": os.getenv("POSTGRES_HOST"),
    "port": int(os.getenv("SUPABASE_PORT", 5432)),
    "database": os.getenv("SUPABASE_DB", "postgres"),
    "user": os.getenv("SUPABASE_USER", "postgres"),
    "password": os.getenv("SUPABASE_PASSWORD"),
}

# 🔐 Groq API Key
GROQ_API_KEY = os.getenv("GROQ_API_KEY") or os.getenv("GROQCLOUD_API_KEY")

# 🧠 AI/DB Settings
USE_AI = os.getenv("USE_AI", "true").lower() == "true"
AUTO_INSERT = os.getenv("AUTO_INSERT", "true").lower() == "true"

# 🧾 Question Defaults
DEFAULT_SUBJECT = os.getenv("DEFAULT_SUBJECT", "Biology")
DEFAULT_CHAPTER = os.getenv("DEFAULT_CHAPTER", "Unknown")
DEFAULT_DPP = os.getenv("DEFAULT_DPP", "false").lower() == "true"

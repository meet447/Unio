from supabase import create_client
from dotenv import load_dotenv
import os
import sys

load_dotenv()

# Required environment variables
REQUIRED_ENV_VARS = ["SUPABASE_URL", "SUPABASE_KEY"]

def validate_env():
    """Validate that all required environment variables are set."""
    missing = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
    if missing:
        print(f"ERROR: Missing required environment variables: {', '.join(missing)}", file=sys.stderr)
        print("Please set these in your .env file or environment.", file=sys.stderr)
        sys.exit(1)

validate_env()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Singleton pattern for Supabase clients (saves 15-30MB RAM)
_supabase_client = None
_supabase_admin_client = None

def get_supabase():
    """Get or create the main Supabase client (singleton)."""
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _supabase_client

def get_supabase_admin():
    """Get or create the admin Supabase client (singleton)."""
    global _supabase_admin_client
    if _supabase_admin_client is None:
        key = SUPABASE_SERVICE_ROLE_KEY if SUPABASE_SERVICE_ROLE_KEY else SUPABASE_KEY
        _supabase_admin_client = create_client(SUPABASE_URL, key)
    return _supabase_admin_client

# Maintain backward compatibility - create instances on first access
supabase = get_supabase()
supabase_admin = get_supabase_admin()

# CORS configuration - comma-separated list of allowed origins
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS if origin.strip()]

# Rate limiting (requests per minute)
RATE_LIMIT = int(os.getenv("RATE_LIMIT", "60"))

from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

url = os.getenv("SUPABASE_URL")
api_key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, api_key)



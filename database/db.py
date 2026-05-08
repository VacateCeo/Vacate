from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

def insert_article(article):
    try:
        result = supabase.table("news").upsert({
    "title": article.get("title", ""),
    "division": article.get("division", ""),
    "url": article.get("url", ""),
    "description": article.get("description", ""),
    "source": "NCAA API"
}, on_conflict="url").execute()
        return result
    except Exception as e:
        print(f"Error inserting: {e}")
        return None

def get_all_news():
    try:
        result = supabase.table("news").select("id, title, division").execute()
        return result.data
    except Exception as e:
        print(f"Error fetching news: {e}")
        return []

def get_all_players():
    try:
        result = supabase.table("players").select("*").eq("approved", True).execute()
        return result.data
    except Exception as e:
        print(f"Error fetching players: {e}")
        return []
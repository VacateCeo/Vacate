from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

def insert_article(article):
    try:
        result = supabase.table("players").insert({
            "title": article.get("title", ""),
            "division": article.get("division", ""),
            "url": article.get("url", ""),
            "description": article.get("description", ""),
            "source": "NCAA API"
        }).execute()
        return result
    except Exception as e:
        print(f"Error inserting: {e}")
        return None

def get_all_articles():
    try:
        result = supabase.table("players").select("id, title, division").execute()
        return result.data
    except Exception as e:
        print(f"Error fetching: {e}")
        return []
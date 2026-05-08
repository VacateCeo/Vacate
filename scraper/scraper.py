
import requests
import pandas as pd
import json
import time
import os
import sys
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.db import insert_article, get_all_articles

NCAA_API_BASE = "https://ncaa-api.henrygd.me"

def get_ncaa_transfer_news(division="d2"):
    url = f"{NCAA_API_BASE}/news/basketball-men/{division}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        articles = data.get("items", [])
        results = []
        for article in articles:
            results.append({
                "title": article.get("title", ""),
                "date": article.get("pubDate", ""),
                "url": article.get("link", ""),
                "description": article.get("description", "")[:200],
                "division": division.upper()
            })
        return results
    except requests.exceptions.RequestException as e:
        print(f"Error fetching NCAA news: {e}")
        return []

def run_tracker():
    print(f"\n{'='*50}")
    print(f"Running portal check at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*50}")

    # Pull NCAA D2 and D3 news
    print("\n[1] Fetching NCAA D2 transfer news...")
    d2_news = get_ncaa_transfer_news("d2")
    time.sleep(0.5)

    print(f"    Fetching NCAA D3 transfer news...")
    d3_news = get_ncaa_transfer_news("d3")
    time.sleep(0.5)

    all_news = d2_news + d3_news
    print(f"    Found {len(all_news)} news articles")

    if all_news:
        print("\n--- Latest Articles ---")
        for article in all_news[:5]:
            print(f"  [{article['division']}] {article['title']}")

    # Save to database
    print("\n[2] Saving to database...")
    saved = 0
    for article in all_news:
        result = insert_article(article)
        if result:
            saved += 1
    print(f"    Saved {saved} articles to Supabase")

    # Check total rows
    total = get_all_articles()
    print(f"    Total rows in database: {len(total)}")

    # Export to CSV
    if all_news:
        df_news = pd.DataFrame(all_news)
        df_news.to_csv("ncaa_transfer_news.csv", index=False)
        print(f"\n[3] Saved {len(all_news)} articles to ncaa_transfer_news.csv")

    print("\nDone.")

if __name__ == "__main__":
    run_tracker()
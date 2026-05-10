import os
import sys
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

load_dotenv()

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from supabase import create_client

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
NOTIFY_TO = "brandanan2008@gmail.com"
NOTIFY_FROM = os.getenv("SENDGRID_FROM_EMAIL", "")


def get_recent_players(hours=24):
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    client = create_client(url, key)
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=hours)).isoformat()
    result = client.table("players").select("*").gte("date_added", cutoff).execute()
    return result.data or []


def send_player_notification(players):
    try:
        import sendgrid
        from sendgrid.helpers.mail import Mail
    except ImportError:
        print("    sendgrid not installed — run: pip install sendgrid")
        return

    if not SENDGRID_API_KEY:
        print("    SENDGRID_API_KEY not set in .env — skipping notification")
        return
    if not NOTIFY_FROM:
        print("    SENDGRID_FROM_EMAIL not set in .env — skipping notification")
        return

    count = len(players)
    subject = f"Vacate: {count} new player submission{'s' if count != 1 else ''}"

    rows = "".join(
        f"<tr style='border-bottom:1px solid #eee'>"
        f"<td style='padding:8px 12px'>{p.get('title', '')}</td>"
        f"<td style='padding:8px 12px'>{p.get('division', '')}</td>"
        f"<td style='padding:8px 12px;color:#555;font-size:13px'>{p.get('description', '')}</td>"
        f"</tr>"
        for p in players
    )

    html = f"""
    <div style="font-family:sans-serif;max-width:700px;margin:0 auto">
      <h2 style="color:#15803d">Vacate &mdash; New Player Submission{"s" if count != 1 else ""}</h2>
      <p>{count} new player profile{"s were" if count != 1 else " was"} submitted in the last 24 hours and {"are" if count != 1 else "is"} pending review:</p>
      <table border="0" cellpadding="0" cellspacing="0" width="100%"
             style="border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">
        <thead>
          <tr style="background:#15803d;color:white">
            <th style="padding:10px 12px;text-align:left">Name / Position / School</th>
            <th style="padding:10px 12px;text-align:left">Division</th>
            <th style="padding:10px 12px;text-align:left">Details</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      <p style="color:#888;font-size:12px;margin-top:16px">
        Approve or reject players in your
        <a href="https://supabase.com/dashboard" style="color:#15803d">Supabase dashboard</a>.
      </p>
    </div>
    """

    message = Mail(
        from_email=NOTIFY_FROM,
        to_emails=NOTIFY_TO,
        subject=subject,
        html_content=html,
    )
    try:
        sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"    Email sent to {NOTIFY_TO} (status: {response.status_code})")
    except Exception as e:
        print(f"    Error sending email: {e}")


def notify_new_players():
    players = get_recent_players(hours=24)
    if not players:
        print("\n[Notify] No new player submissions in the last 24 hours")
        return
    print(f"\n[Notify] {len(players)} new submission(s) — sending email to {NOTIFY_TO}")
    send_player_notification(players)

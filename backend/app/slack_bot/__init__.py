"""
Slack Bolt Agent for listening to channel messages.
"""

import re
from slack_bolt import App
from app.core.logging import logging
from app.core.config import settings

app = App(token=settings.SLACK_BOT_TOKEN, signing_secret=settings.SLACK_SIGNING_SECRET)


@app.event("message")
def handle_message_events(event):
    logging.debug(f"Received message event: {event}")
    try:
        if event.get("channel") != settings.SLACK_MUSIC_CHANNEL_ID:
            return

        user = event.get("user", "Unknown")
        text = event.get("text", "")
        ts = event.get("ts", "")

        SPOTIFY_URL_PATTERN = r"https://open\.spotify\.com/track/[\w?=]+"
        spotify_match = re.search(SPOTIFY_URL_PATTERN, text)
        if spotify_match:
            spotify_url = spotify_match.group(0)
            logging.info(
                f"Spotify track found - User: {user}, "
                f"Link: {spotify_url}, Timestamp: {ts}"
            )

    except Exception as e:
        logging.error(f"Error handling message event: {str(e)}", exc_info=True)

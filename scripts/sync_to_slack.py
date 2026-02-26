import os
import re
from pathlib import Path
from dotenv import load_dotenv
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

# Load environment variables from .env file
load_dotenv()

SLACK_BOT_TOKEN = os.getenv("SLACK_BOT_TOKEN")
SLACK_CHANNEL_ID = os.getenv("SLACK_CHANNEL_ID")
WIKI_PATH = Path("C:/Users/Administrator/.gemini/antigravity/brain/6daad7a9-8376-4fe2-b4b7-8809d28b64cd/LAUNCH_CALENDAR_FEB_28.md")
STATE_FILE = Path(".slack_calendar_id")

def extract_tasks_from_wiki(wiki_text):
    """Simple parser to extract the task list from the markdown calendar."""
    start_heading = "## 📅 Day 1"
    if start_heading not in wiki_text:
        return wiki_text # Return whole text if standard formatting missing
    
    sections = "## 📅 Day 1" + wiki_text.split(start_heading)[1]
    return sections.strip()

def build_slack_blocks(tasks_text):
    """Build Slack Block Kit UI for a beautiful, readable dashboard."""
    blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "🚀 TiltedPrompts 7-Day Launch Calendar",
                "emoji": True
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Target Launch: Feb 28, 2026*\nThis is the live sync of the implementation calendar. Update the local file to refresh this dashboard."
            }
        },
        {"type": "divider"}
    ]
    
    # Split by Days (e.g., ## 📅 Day 1)
    days = re.split(r'(## 📅 Day \d+.*)', tasks_text)
    
    if len(days) < 2:
         blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": tasks_text
            }
        })
    else:
        for i in range(1, len(days), 2):
            day_title = days[i].strip()
            day_content = days[i+1].strip()
            
            # Convert markdown checkboxes to emojis for better Slack styling
            day_content = day_content.replace("- [ ]", "⬜")
            day_content = day_content.replace("- [x]", "✅")
            day_content = day_content.replace("- [/]", "🔄")
            
            blocks.append({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*{day_title}*\n{day_content}"
                }
            })
            blocks.append({"type": "divider"})
        
    blocks.append({
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": "Last synced directly from codebase by your AI Agent."
            }
        ]
    })
    
    return blocks

def sync_to_slack():
    if not SLACK_BOT_TOKEN or not SLACK_CHANNEL_ID:
        print("Error: Keep SLACK_BOT_TOKEN and SLACK_CHANNEL_ID in your .env file.")
        return

    client = WebClient(token=SLACK_BOT_TOKEN)
    
    with open(WIKI_PATH, 'r', encoding='utf-8') as f:
        wiki_text = f.read()
        
    tasks_text = extract_tasks_from_wiki(wiki_text)
    blocks = build_slack_blocks(tasks_text)
    
    # Check if we already posted the dashboard
    message_ts = None
    if STATE_FILE.exists():
        with open(STATE_FILE, 'r') as f:
            message_ts = f.read().strip()
            
    try:
        if message_ts:
            # Update the existing pinned dashboard
            response = client.chat_update(
                channel=SLACK_CHANNEL_ID,
                ts=message_ts,
                blocks=blocks,
                text="Updated TiltedPrompts Task List"
            )
            print("Successfully updated the live Slack Dashboard!")
        else:
            # Post a new dashboard and pin it
            response = client.chat_postMessage(
                channel=SLACK_CHANNEL_ID,
                blocks=blocks,
                text="TiltedPrompts Task List"
            )
            message_ts = response["ts"]
            
            # Save the message ID so we update it next time instead of creating new ones
            with open(STATE_FILE, 'w') as f:
                f.write(message_ts)
                
            # Pin the message to the channel
            client.pins_add(channel=SLACK_CHANNEL_ID, timestamp=message_ts)
            print("Successfully created and pinned the Slack Dashboard!")
            
    except SlackApiError as e:
        print(f"Error syncing to Slack: {e.response['error']}")

if __name__ == "__main__":
    sync_to_slack()

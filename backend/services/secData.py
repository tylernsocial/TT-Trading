import os

import httpx
from dotenv import load_dotenv


load_dotenv()

# Get agent
SEC_USER_AGENT = os.getenv("SEC_USER_AGENT")

if not SEC_USER_AGENT:
    raise RuntimeError("SEC_USER_AGENT is not configured.")


# SEC asks automated clients to identify themselves through User-Agent.
SEC_HEADERS = {
    "User-Agent": SEC_USER_AGENT,
    "Accept-Encoding": "gzip, deflate",
}
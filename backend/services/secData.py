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

SEC_TICKERS_URL = "https://www.sec.gov/files/company_tickers.json"

# "AAPL"
#    ↓
# download SEC ticker mapping
#    ↓
# find ticker == AAPL
#    ↓
# CIK = 320193
#    ↓
# pad to 10 digits
#    ↓
# 0000320193
async def get_cik_for_symbol(symbol: str):
    """Look up a company's SEC CIK and return its normalized ticker details."""
    # The SEC identifies companies by CIK rather than ticker symbol.
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SEC_TICKERS_URL,
            headers=SEC_HEADERS,
        )

        response.raise_for_status()

    data = response.json()

    # Normalize the ticker so "aapl" and "AAPL" behave the same.
    cleaned_symbol = symbol.strip().upper()

    for company in data.values():
        if company.get("ticker", "").upper() == cleaned_symbol:
            cik = company.get("cik_str")

            # SEC API URLs require CIKs to be exactly 10 digits.
            padded_cik = str(cik).zfill(10)

            return {
                "symbol": cleaned_symbol,
                "company_name": company.get("title"),
                "cik": padded_cik,
            }

    return None
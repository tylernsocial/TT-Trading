import os
from datetime import date

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


async def get_company_facts(symbol: str):
    """Fetch the raw SEC Company Facts response for a ticker symbol."""
    # Company Facts is keyed by CIK, so the ticker must be mapped first.
    company = await get_cik_for_symbol(symbol)
    if company is None:
        return None

    cik = company["cik"]

    # The SEC endpoint requires the CIK in its zero-padded 10-digit form.
    company_facts_url = (
        f"https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json"
    )

    async with httpx.AsyncClient() as client:
        response = await client.get(company_facts_url, headers=SEC_HEADERS)
        response.raise_for_status()

    # Company Facts returns the company's raw, filed XBRL facts and metadata.
    return response.json()


def get_latest_annual_fact(
    company_facts: dict,
    concept: str,
    unit: str = "USD",
):
    """Return the latest annual 10-K fact for a US-GAAP concept and unit."""
    # Company Facts groups observations first by taxonomy/concept, then by unit.
    us_gaap_facts = company_facts.get("facts", {}).get("us-gaap", {})
    concept_facts = us_gaap_facts.get(concept)
    if not isinstance(concept_facts, dict):
        return None

    units = concept_facts.get("units", {})
    facts_for_unit = units.get(unit) if isinstance(units, dict) else None
    if not isinstance(facts_for_unit, list):
        return None

    # A concept can appear in several filing types; 10-K limits this helper to
    # annual reports rather than quarterly or other SEC filings.
    annual_facts = [
        fact
        for fact in facts_for_unit
        if (
            isinstance(fact, dict)
            and fact.get("form") == "10-K"
            and fact.get("val") is not None
        )
    ]
    if not annual_facts:
        return None

    # FY identifies facts for the full fiscal year. Prefer those when the SEC
    # supplies fp, while still allowing older/missing fp metadata on a 10-K.
    full_year_facts = [fact for fact in annual_facts if fact.get("fp") == "FY"]
    candidates = full_year_facts or annual_facts

    def parse_sec_date(value):
        if not isinstance(value, str):
            return date.min
        try:
            return date.fromisoformat(value)
        except ValueError:
            return date.min

    def fiscal_year(fact):
        try:
            return int(fact.get("fy"))
        except (TypeError, ValueError):
            return None

    def latest_fact_key(fact):
        period_end = parse_sec_date(fact.get("end"))
        reported_fiscal_year = fiscal_year(fact)

        # Some records omit fy, so the period-end year is a useful fallback.
        effective_year = (
            reported_fiscal_year
            if reported_fiscal_year is not None
            else period_end.year
        )

        # SEC arrays can include comparisons and facts repeated in later
        # filings, so their final element is not necessarily the latest annual
        # period. Rank by fiscal year, period end, then filing date to resolve
        # duplicate observations for the same annual period.
        return (
            effective_year,
            period_end,
            parse_sec_date(fact.get("filed")),
        )

    latest_fact = max(candidates, key=latest_fact_key)

    return {
        "value": latest_fact.get("val"),
        "unit": unit,
        "fiscal_year": fiscal_year(latest_fact),
        "period_end": latest_fact.get("end"),
        "filed": latest_fact.get("filed"),
        "form": latest_fact.get("form"),
    }

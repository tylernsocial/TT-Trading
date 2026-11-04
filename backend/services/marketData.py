# loads the key, calls Twelve Data asynchronously, validates the response, and selects useful fields.
import os
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv


# Twelve Data endpoint and timeout used for stock symbol searches.
TWELVE_DATA_SEARCH_URL = "https://api.twelvedata.com/symbol_search"
REQUEST_TIMEOUT_SECONDS = 10.0

# Load the backend API key from the local .env file when available.
load_dotenv(Path(__file__).resolve().parents[1] / ".env")


class MarketDataServiceError(Exception):
    """Raised when Twelve Data cannot complete a request."""


class MarketDataConfigurationError(MarketDataServiceError):
    """Raised when the market data service is not configured."""


class MarketDataResponseError(MarketDataServiceError):
    """Raised when Twelve Data returns an unexpected response."""


async def search_symbols(query: str) -> list[dict[str, Any]]:
    # The API key is required before making any external request.
    api_key = os.getenv("TWELVE_DATA_API_KEY")
    if not api_key or not api_key.strip():
        raise MarketDataConfigurationError(
            "TWELVE_DATA_API_KEY is not configured on the backend"
        )

    # Request matching symbols from Twelve Data.
    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT_SECONDS) as client:
            response = await client.get(
                TWELVE_DATA_SEARCH_URL,
                params={"symbol": query, "apikey": api_key},
            )
            response.raise_for_status()
    except httpx.HTTPError as exc:
        raise MarketDataServiceError("Twelve Data request failed") from exc

    # Parse and validate the response before reading search results.
    try:
        payload = response.json()
    except ValueError as exc:
        raise MarketDataResponseError("Twelve Data returned invalid JSON") from exc

    if not isinstance(payload, dict):
        raise MarketDataResponseError("Twelve Data returned an unexpected response")

    if payload.get("status") == "error":
        message = payload.get("message")
        detail = message if isinstance(message, str) else "Twelve Data returned an error"
        raise MarketDataServiceError(detail)

    data = payload.get("data")
    if not isinstance(data, list):
        raise MarketDataResponseError("Twelve Data response did not include search results")

    # Return only the fields needed by the backend consumers.
    return [
        {
            "symbol": item.get("symbol"),
            "name": item.get("instrument_name"),
            "exchange": item.get("exchange"),
            "instrument_type": item.get("instrument_type"),
            "country": item.get("country"),
            "currency": item.get("currency"),
        }
        for item in data
        if isinstance(item, dict)
    ]

async def get_stock_quote(symbol: str):
    # Fetch the latest quote from Twelve Data and return the fields used by the UI.
    url = "https://api.twelvedata.com/quote"
    api_key = os.getenv("TWELVE_DATA_API_KEY")
    # Send the symbol and backend-only API key as query parameters.
    params = {
        "symbol": symbol,
        "apikey": api_key,
    }

    # Make the external request and surface HTTP errors to the caller.
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        response.raise_for_status()

    # Keep the response mapping stable even if Twelve Data adds extra fields.
    data = response.json()

    # Normalize Twelve Data's quote fields to the API shape used by the frontend.
    return {
        "symbol": data.get("symbol"),
        "name": data.get("name"),
        "exchange": data.get("exchange"),
        "currency": data.get("currency"),
        "price": data.get("close"),
        "open": data.get("open"),
        "high": data.get("high"),
        "low": data.get("low"),
        "previous_close": data.get("previous_close"),
        "change": data.get("change"),
        "percent_change": data.get("percent_change"),
        "volume": data.get("volume"),
        "is_market_open": data.get("is_market_open"),
    }
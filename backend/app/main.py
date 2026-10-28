from typing import Annotated

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from services.marketData import (
    MarketDataConfigurationError,
    MarketDataServiceError,
    search_symbols,
)

app = FastAPI(title="TT-Trading API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # basically saying, fastapi allow my react development server to access u
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health") # defines api route
def health_check():
    return {
        "status": "ok",
        "message": "TT-Trading API is running"
    }


# Search Twelve Data for stocks matching a symbol or company name.
@app.get("/api/stocks/search")
async def search_stocks(
    query: Annotated[
        str, Query(min_length=1, description="Stock symbol or company name")
    ],
):
    cleaned_query = query.strip()
    if not cleaned_query:
        raise HTTPException(status_code=400, detail="Query must not be empty")

    try:
        results = await search_symbols(cleaned_query)
    except MarketDataConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except MarketDataServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return {"query": cleaned_query, "results": results}

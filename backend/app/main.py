from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
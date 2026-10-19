from fastapi import FastAPI


app = FastAPI(title="TT-Trading API")

@app.get("/api/health") # defines api route
def health_check():
    return {
        "status": "ok",
        "message": "TT-Trading API is running"
    }
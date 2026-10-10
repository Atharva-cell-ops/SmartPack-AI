import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from tinyfish import TinyFish

load_dotenv()

app = FastAPI(
    title="SmartPack AI HackIIITD Backend",
    description="Dedicated backend service for HackIIITD TinyFish packaging web research",
    version="1.0.0"
)

# Configurable CORS origins
configured_origins = os.getenv("FRONTEND_ORIGIN", os.getenv("ALLOWED_ORIGINS", "")).strip()
if configured_origins and configured_origins != "*":
    origins = [o.strip() for o in configured_origins.split(",") if o.strip()]
else:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500, description="Packaging research query string")

@app.get("/")
@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "SmartPack AI TinyFish Backend",
        "version": "1.0.0",
        "research_provider": "TinyFish"
    }

@app.post("/api/tinyfish/search")
def search_packaging_research(request: SearchRequest):
    api_key = os.getenv("TINYFISH_API_KEY", "").strip()
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="TinyFish research service is not configured. Missing TINYFISH_API_KEY on the backend."
        )

    query = request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Search query cannot be empty or whitespace only.")
    if len(query) > 500:
        raise HTTPException(status_code=400, detail="Query must contain at most 500 characters.")

    try:
        client = TinyFish(api_key=api_key)
        response = client.search.query(query, location="IN", language="en")
        raw_results = getattr(response, "results", []) or []
        results = [
            {
                "title": getattr(item, "title", "") or "Untitled result",
                "url": getattr(item, "url", "") or "",
                "snippet": getattr(item, "snippet", "") or "",
                "site_name": getattr(item, "site_name", "") or ""
            }
            for item in raw_results
        ]
        return {
            "query": query,
            "results": results,
            "count": len(results),
            "disclaimer": "External research sources provided for informational reference only. Physical testing and statutory regulatory clearances are required."
        }
    except Exception as exc:
        logging.error(f"TinyFish search failed: {type(exc).__name__}")
        sanitized_err = str(exc)
        if api_key and api_key in sanitized_err:
            sanitized_err = sanitized_err.replace(api_key, "[REDACTED]")
        raise HTTPException(status_code=502, detail=f"TinyFish search failed: {sanitized_err}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from tinyfish import TinyFish

load_dotenv()

app = FastAPI(title="SmartPack AI HackIIITD Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str

@app.get("/")
def health_check():
    return {"status": "ok", "service": "SmartPack AI TinyFish Backend"}

@app.post("/api/tinyfish/search")
def search_packaging_research(request: SearchRequest):
    if not os.getenv("TINYFISH_API_KEY"):
        raise HTTPException(status_code=500, detail="TinyFish API key is not configured in .env.")

    query = request.query.strip()
    if not query or len(query) > 500:
        raise HTTPException(status_code=400, detail="Query must contain 1 to 500 characters.")

    try:
        client = TinyFish()
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
        return {"query": query, "results": results}
    except Exception as exc:
        import traceback; traceback.print_exc()
        raise HTTPException(status_code=502, detail=f"TinyFish search failed: {str(exc)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

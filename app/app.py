from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from routes import api, response
from config import CORS_ORIGINS, RATE_LIMIT

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Unio API",
    description="Unified LLM Proxy Service",
    version="1.0.0"
)

# Add rate limiter to app state
app.state.limiter = limiter

# Rate limit error handler
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={
            "error": {
                "message": "Rate limit exceeded. Please slow down.",
                "type": "rate_limit_exceeded",
                "code": "rate_limit_exceeded"
            }
        }
    )

# CORS middleware with configurable origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Fallback-Model"],
)

app.include_router(
    api.router,
    prefix="/v1/api",
)

app.include_router(
    response.router,
    prefix="/v1/api",
)

@app.get('/')
async def root():
    return {"message": "Welcome to the Unio API!", "version": "1.0.0", "status": "ok"}
    
@app.get("/health")
async def health():
    return {"status": "ok"}

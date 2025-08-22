from fastapi import Header, APIRouter
from fastapi.responses import StreamingResponse, JSONResponse
from models.chat import ChatRequest
from services.provider import get_provider
from auth.check_key import fetch_userid
from exceptions import InvalidAPIKeyError, RateLimitExceededError, ProviderAPIError

router = APIRouter()

@router.post("/chat/completions")
def chat_completions(req: ChatRequest, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        return JSONResponse(
            status_code=401,
            content={
                "error": {
                    "message": "Invalid API Key",
                    "type": "invalid_request_error",
                    "param": None,
                    "code": "invalid_api_key"
                }
            }
        )
        
    api_key = authorization.split(" ")[1]
    try:
        user_id = fetch_userid(api_key)
    except InvalidAPIKeyError as e:
        return JSONResponse(
            status_code=401,
            content={
                "error": {
                    "message": str(e),
                    "type": "invalid_request_error",
                    "param": None,
                    "code": "invalid_api_key"
                }
            }
        )
    
    try:
        client = get_provider(model=req.model, user_id=user_id)
    except ValueError as e:
        return JSONResponse(
            status_code=400,
            content={
                "error": {
                    "message": str(e),
                    "type": "invalid_request_error",
                    "param": "model",
                    "code": "model_not_found"
                }
            }
        )

    if req.stream:
        try:
            return StreamingResponse(
                client.stream_chat_completions(req=req),
                media_type="text/event-stream"
            )
        except RateLimitExceededError as e:
            return JSONResponse(
                status_code=429,
                content={
                    "error": {
                        "message": str(e),
                        "type": "rate_limit_exceeded",
                        "param": None,
                        "code": "rate_limit_exceeded"
                    }
                }
            )
        except ProviderAPIError as e:
            return JSONResponse(
                status_code=e.status_code,
                content={
                    "error": {
                        "message": str(e),
                        "type": "api_error",
                        "param": None,
                        "code": "provider_error"
                    }
                }
            )
        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={
                    "error": {
                        "message": f"An unexpected error occurred: {e}",
                        "type": "internal_error",
                        "param": None,
                        "code": "server_error"
                    }
                }
            )

    else:
        try:
            response = client.chat_completions(req=req)
            return response
        except RateLimitExceededError as e:
            return JSONResponse(
                status_code=429,
                content={
                    "error": {
                        "message": str(e),
                        "type": "rate_limit_exceeded",
                        "param": None,
                        "code": "rate_limit_exceeded"
                    }
                }
            )
        except ProviderAPIError as e:
            return JSONResponse(
                status_code=e.status_code,
                content={
                    "error": {
                        "message": str(e),
                        "type": "api_error",
                        "param": None,
                        "code": "provider_error"
                    }
                }
            )
        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={
                    "error": {
                        "message": f"An unexpected error occurred: {e}",
                        "type": "internal_error",
                        "param": None,
                        "code": "server_error"
                    }
                }
            )

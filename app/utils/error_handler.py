"""
Centralized error handling utilities for the Unio API.
Provides consistent error responses and logging across all routes.
"""
from fastapi.responses import JSONResponse
from exceptions import InvalidAPIKeyError, RateLimitExceededError, ProviderAPIError, ModelNotFoundError
from auth.log import log_request
import asyncio
import time
import logging

logger = logging.getLogger(__name__)


def sanitize_error_message(error: Exception) -> str:
    """
    Sanitize error messages to avoid exposing internal details.
    Returns a user-safe error message.
    """
    # Known safe error types - use their messages
    if isinstance(error, (InvalidAPIKeyError, RateLimitExceededError, ModelNotFoundError)):
        return str(error)
    
    # Provider errors - sanitize but keep general info
    if isinstance(error, ProviderAPIError):
        msg = str(error)
        # Remove potential sensitive info like API keys, URLs
        if "api_key" in msg.lower() or "key=" in msg.lower():
            return "Provider API error occurred"
        return msg
    
    # Unknown errors - generic message
    return "An internal error occurred. Please try again."


def get_error_response(error: Exception) -> tuple:
    """
    Get standardized error response content and status code.
    
    Returns:
        Tuple of (error_content dict, status_code int)
    """
    if isinstance(error, InvalidAPIKeyError):
        return {
            "error": {
                "message": str(error),
                "type": "invalid_request_error",
                "code": "invalid_api_key"
            }
        }, 401
    
    if isinstance(error, RateLimitExceededError):
        return {
            "error": {
                "message": str(error),
                "type": "rate_limit_exceeded",
                "code": "rate_limit_exceeded"
            }
        }, 429
    
    if isinstance(error, ModelNotFoundError):
        return {
            "error": {
                "message": str(error),
                "type": "invalid_request_error",
                "code": "model_not_found"
            }
        }, 400
    
    if isinstance(error, ProviderAPIError):
        return {
            "error": {
                "message": sanitize_error_message(error),
                "type": "api_error",
                "code": "provider_error"
            }
        }, error.status_code
    
    # Unknown errors
    logger.error(f"Unexpected error: {error}", exc_info=True)
    return {
        "error": {
            "message": "An internal error occurred",
            "type": "internal_error",
            "code": "server_error"
        }
    }, 500


def create_error_response(error: Exception) -> JSONResponse:
    """Create a JSONResponse for an error."""
    content, status_code = get_error_response(error)
    return JSONResponse(status_code=status_code, content=content)


async def log_request_async(
    user_id: str,
    api_key: str,
    provider: str,
    model: str,
    status: int,
    request_payload: dict,
    response_payload: dict,
    start_time: float,
    prompt_tokens: int = 0,
    completion_tokens: int = 0,
    total_tokens: int = 0,
    key_name: str = "",
    is_fallback: bool = False,
    key_rotation_log: list = None,
    latency_ms: float = 0.0,
    tokens_per_second: float = 0.0
):
    """
    Fire-and-forget async logging wrapper.
    Logs request details to database without blocking.
    """
    end_time = time.time()
    response_time_ms = int((end_time - start_time) * 1000)
    
    try:
        await log_request(
            user_id=user_id,
            api_key=api_key,
            provider=provider,
            model=model,
            status=status,
            request_payload=request_payload,
            response_payload=response_payload,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=total_tokens,
            estimated_cost=0.0,
            response_time_ms=response_time_ms,
            key_name=key_name,
            is_fallback=is_fallback,
            key_rotation_log=key_rotation_log or [],
            latency_ms=latency_ms,
            tokens_per_second=tokens_per_second
        )
    except Exception as e:
        logger.error(f"Failed to log request: {e}")




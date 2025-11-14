from config import supabase
from exceptions import InvalidAPIKeyError
from typing import Optional
import logging

# Configure logging
logger = logging.getLogger(__name__)

def fetch_userid(api_key):
    try:
        response = (
            supabase.table("user_api_tokens")
            .select("user_id")
            .eq("token_hash", api_key)  # plain key, no hashing
            .eq("is_active", True)
        )
        
        result = response.execute()
        if not result.data:
            raise InvalidAPIKeyError("Invalid API Key")
        return result.data[0]['user_id']
    except Exception as e:
        raise InvalidAPIKeyError("Invalid API Key") from e

def fetch_api_keys(user_id, provider_id):
    
    response = (
        supabase.table("api_keys")
        .select("*")
        .eq("user_id", user_id)
        .eq("provider_id", provider_id)
    )
    
    result = response.execute()
    data = result.data
    return data

def increment_usage_count(api_key_id):
    try:
        supabase.rpc('increment_api_key_usage', {'key_id': api_key_id}).execute()
    except Exception as e:
        logger.error(f"Error incrementing usage count: {e}")

def increment_rate_limit_count(api_key_id):
    try:
        supabase.rpc('increment_api_key_rate_limit', {'key_id': api_key_id}).execute()
    except Exception as e:
        logger.error(f"Error incrementing rate limit count: {e}")

def log_request(
    user_id: str,
    request_method: str,
    request_route: str,
    provider: Optional[str] = None,
    model: Optional[str] = None,
    status_code: Optional[int] = None,
    response_time_ms: Optional[int] = None,
    prompt_tokens: Optional[int] = None,
    completion_tokens: Optional[int] = None,
    total_tokens: Optional[int] = None,
    cost: Optional[float] = None,
    log_id: Optional[str] = None
):
    try:
        if log_id:
            # Update existing log
            update_data = {
                "status_code": status_code,
                "response_time_ms": response_time_ms,
                "prompt_tokens": prompt_tokens,
                "completion_tokens": completion_tokens,
                "total_tokens": total_tokens,
                "cost": cost
            }
            # Remove None values to avoid overwriting existing data with None
            update_data = {k: v for k, v in update_data.items() if v is not None}
            supabase.table("request_logs").update(update_data).eq("id", log_id).execute()
        else:
            # Insert new log
            insert_data = {
                "user_id": user_id,
                "request_method": request_method,
                "request_route": request_route,
                "provider": provider,
                "model": model
            }
            response = supabase.table("request_logs").insert(insert_data).execute()
            return response.data[0]['id']
    except Exception as e:
        logger.error(f"Error logging request: {e}")
    return None

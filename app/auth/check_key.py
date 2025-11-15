from config import supabase
from exceptions import InvalidAPIKeyError
from typing import Optional
import logging

# Configure logging
logger = logging.getLogger(__name__)

def fetch_userid(api_key):
    try:
        # PostgREST sometimes has issues parsing filters with certain token formats
        # Try the direct query first, and if it fails, fall back to fetching and filtering
    try:
        response = (
            supabase.table("user_api_tokens")
            .select("user_id")
            .eq("token_hash", api_key)  # plain key, no hashing
            .eq("is_active", True)
        )
        
        result = response.execute()
            if result.data:
                return result.data[0]['user_id']
        except Exception as filter_error:
            # If filter query fails (PostgREST parsing issue), try fetching all and filtering
            logger.warning(f"Filter query failed, trying alternative method: {filter_error}")
            all_tokens = supabase.table("user_api_tokens").select("user_id, token_hash, is_active").execute()
            
            # Filter in Python
            matching = [t for t in all_tokens.data if t.get('token_hash') == api_key and t.get('is_active') == True]
            if matching:
                return matching[0]['user_id']
        
        # If we get here, no matching token was found
            raise InvalidAPIKeyError("Invalid API Key")
    except InvalidAPIKeyError:
        raise
    except Exception as e:
        logger.error(f"Error fetching user ID for API key: {e}")
        raise InvalidAPIKeyError("Invalid API Key") from e

def fetch_api_keys(user_id, provider_id):
    try:
        # Try direct query first
        try:
            response = (
                supabase.table("api_keys")
                .select("*")
                .eq("user_id", user_id)
                .eq("provider_id", provider_id)
                .eq("is_active", True)
            )
            
            result = response.execute()
            return result.data
        except Exception as filter_error:
            # If filter query fails (PostgREST parsing issue), try fetching and filtering
            logger.warning(f"Filter query failed for api_keys, trying alternative method: {filter_error}")
            all_keys = supabase.table("api_keys").select("*").execute()
            
            # Filter in Python
            matching = [k for k in all_keys.data if k.get('user_id') == user_id and k.get('provider_id') == provider_id and k.get('is_active') == True]
            return matching
    except Exception as e:
        logger.error(f"Error fetching API keys: {e}")
        return []

def fetch_all_providers_with_keys(user_id):
    """Fetch all providers with their API keys for a user, grouped by provider"""
    try:
        try:
            response = (
                supabase.table("api_keys")
                .select("*, providers(id, name)")
                .eq("user_id", user_id)
                .eq("is_active", True)
            )
            
            result = response.execute()
            keys = result.data if result.data else []
        except Exception as filter_error:
            logger.warning(f"Filter query failed for all providers, trying alternative method: {filter_error}")
            all_keys = supabase.table("api_keys").select("*").execute()
            keys = [k for k in all_keys.data if k.get('user_id') == user_id and k.get('is_active') == True]
        
        # Group keys by provider_id
        providers_dict = {}
        for key in keys:
            provider_id = key.get('provider_id')
            if provider_id not in providers_dict:
                providers_dict[provider_id] = []
            providers_dict[provider_id].append(key)
        
        return providers_dict
    except Exception as e:
        logger.error(f"Error fetching all providers with keys: {e}")
        return {}

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

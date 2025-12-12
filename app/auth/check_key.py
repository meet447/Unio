from config import supabase_admin as supabase
from exceptions import InvalidAPIKeyError
from typing import Optional
import logging

# Configure logging
logger = logging.getLogger(__name__)


def fetch_userid(api_key: str) -> str:
    """
    Fetch user_id for a given API key.
    
    Args:
        api_key: The API token to validate
        
    Returns:
        The user_id associated with the API key
        
    Raises:
        InvalidAPIKeyError: If the API key is invalid or not found
    """
    try:
        # Try direct query first
        response = (
            supabase.table("user_api_tokens")
            .select("user_id")
            .eq("token_hash", api_key)
            .eq("is_active", True)
            .execute()
        )
        
        if response.data:
            return response.data[0]['user_id']
        
        # If no result, raise error immediately
        logger.warning(f"Invalid API Key attempt: {api_key[:8]}...")
        raise InvalidAPIKeyError("Invalid API Key")
        
    except InvalidAPIKeyError:
        raise
    except Exception as e:
        logger.error(f"Error fetching user ID for API key: {e}")
        raise InvalidAPIKeyError("Invalid API Key") from e


def fetch_api_keys(user_id: str, provider_id: str) -> list:
    """
    Fetch all active API keys for a user and provider.
    
    Args:
        user_id: The user's ID
        provider_id: The provider's ID
        
    Returns:
        List of API key records
    """
    try:
        response = (
            supabase.table("api_keys")
            .select("*, providers(base_url)")
            .eq("user_id", user_id)
            .eq("provider_id", provider_id)
            .eq("is_active", True)
            .execute()
        )
        # Flatten structure: move base_url to top level if it exists in linked provider
        data = response.data or []
        for item in data:
            if item.get('providers'):
                item['base_url'] = item['providers'].get('base_url')
        
        return data
        
    except Exception as e:
        logger.error(f"Error fetching API keys: {e}")
        return []


def fetch_all_providers_with_keys(user_id: str) -> dict:
    """
    Fetch all providers with their API keys for a user, grouped by provider.
    
    Args:
        user_id: The user's ID
        
    Returns:
        Dictionary mapping provider_id to list of API key records
    """
    try:
        response = (
            supabase.table("api_keys")
            .select("*, providers(id, name, base_url)")
            .eq("user_id", user_id)
            .eq("is_active", True)
            .execute()
        )
        keys = response.data or []
        
        # Group keys by provider_id
        providers_dict = {}
        for key in keys:
            provider_id = key.get('provider_id')
            if provider_id not in providers_dict:
                providers_dict[provider_id] = []
            
            # Flatten base_url
            if key.get('providers'):
                key['base_url'] = key['providers'].get('base_url')
                
            providers_dict[provider_id].append(key)
        
        return providers_dict
        
    except Exception as e:
        logger.error(f"Error fetching all providers with keys: {e}")
        return {}


def increment_usage_count(api_key_id: str) -> None:
    """Increment the usage count for an API key."""
    try:
        supabase.rpc('increment_api_key_usage', {'key_id': api_key_id}).execute()
    except Exception as e:
        logger.error(f"Error incrementing usage count: {e}")


def increment_rate_limit_count(api_key_id: str) -> None:
    """Increment the rate limit count for an API key."""
    try:
        supabase.rpc('increment_api_key_rate_limit', {'key_id': api_key_id}).execute()
    except Exception as e:
        logger.error(f"Error incrementing rate limit count: {e}")


def get_provider_by_name(name: str, user_id: str) -> Optional[dict]:
    """
    Get provider details by name.
    Checks for user-specific provider first, then global.
    
    Args:
        name: Provider name
        user_id: User ID for scoping
        
    Returns:
        Provider record or None
    """
    try:
        normalized_name = name.lower().replace(" ", "")
        # Check for user-specific provider
        response = (
            supabase.table("providers")
            .select("*")
            .eq("name", normalized_name)
            .eq("user_id", user_id)
            .execute()
        )
        if response.data:
            return response.data[0]
            
        # Check for global provider (case-insensitive for legacy?)
        # For now, strict match on name
        response = (
            supabase.table("providers")
            .select("*")
            .eq("name", normalized_name)
            .is_("user_id", "null")
            .execute()
        )
        if response.data:
            return response.data[0]
            
        return None
    except Exception as e:
        logger.error(f"Error fetching provider by name: {e}")
        return None

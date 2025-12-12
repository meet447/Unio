from providers.base_client import BaseLLMClient
from auth.check_key import fetch_api_keys, fetch_all_providers_with_keys, get_provider_by_name
import os
import logging

logger = logging.getLogger(__name__)

def extract_provider_name(model: str) -> str:
    """
    Extract provider name from model string.
    Supports: provider:model, provider/model, or provider (implied).
    """
    if ":" in model:
        return model.split(":")[0].lower().replace(" ", "")
    if "/" in model:
        return model.split("/")[0].lower().replace(" ", "")
    return model.lower().replace(" ", "")


def get_provider(model: str, user_id: str, provider_id: str = None):
    """
    Get provider client for a given model and user.
    """
    provider_name = None
    provider_record = None

    # 1. Determine Provider ID and Name
    if provider_id:
        # Explicit ID provided
        pass
    else:
        # Extract name from model
        provider_name = extract_provider_name(model)
        
        # Dynamic lookup in DB
        provider_record = get_provider_by_name(provider_name, user_id)
        if provider_record:
            provider_id = provider_record['id']
            # Update name to match DB record for consistency
            provider_name = provider_record.get('name', provider_name)
        else:
            raise ValueError(f"Unsupported provider: {provider_name}. Please ensure the provider is configured in the database.")

    # 2. Fetch API Keys (and potential Base URL)
    if not provider_id:
         raise ValueError(f"Could not resolve provider ID for {provider_name}")

    keys = fetch_api_keys(user_id, provider_id=provider_id)
    if not keys:
        raise ValueError(f"No API keys found for provider: {provider_name or provider_id}")
    
    # 3. Determine Client Strategy - Always use Generic Client
    base_url = keys[0].get('base_url') or "https://api.openai.com/v1"
    
    logger.debug(f"Using Generic Client for {provider_name} with URL: {base_url}")
    return BaseLLMClient(api_keys=keys, base_url=base_url)


def get_all_providers(user_id: str) -> dict:
    """
    Get all available providers with their clients for a user.
    """
    providers_dict = fetch_all_providers_with_keys(user_id)
    provider_clients = {}
    
    for provider_id, keys in providers_dict.items():
        base_url = None
        if keys:
             base_url = keys[0].get('base_url') # We flattened it in fetch_all
        
        if not base_url:
             # Try to guess or default
             base_url = "https://api.openai.com/v1"
            
        try:
            provider_clients[provider_id] = BaseLLMClient(api_keys=keys, base_url=base_url)
        except Exception as e:
            logger.warning(f"Failed to create client for provider {provider_id}: {e}")
    
    return provider_clients
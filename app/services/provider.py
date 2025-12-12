from providers.base_client import BaseLLMClient
from auth.check_key import fetch_api_keys, fetch_all_providers_with_keys, get_provider_by_name
import os
import logging

logger = logging.getLogger(__name__)

# Legacy static mapping for backwards compatibility
DEFAULT_PROVIDER_IDS = {
    'google': '5c696eb8-43ce-4d2b-8f4a-46a29a577104',
    'openrouter': '19dcbee7-3d66-4620-82de-918026af3257',
    'groq': 'b98b8844-81ac-4baa-9ca9-e349e369c600',
    'anthropic': 'ecce63a9-7c47-4167-9eb0-61cbe62f7711',
    'together': 'e25a4be0-508b-4fc1-a2f5-4fb483cd4fcc',
    'openai': '50d4262d-b46d-49d6-a411-dcb00df53c26'
}

def get_provider_ids() -> dict:
    """Get provider ID mapping from env or defaults."""
    provider_ids = {}
    for name, default_id in DEFAULT_PROVIDER_IDS.items():
        env_key = f"PROVIDER_ID_{name.upper()}"
        provider_ids[name] = os.getenv(env_key, default_id)
    return provider_ids

PROVIDER_IDS = get_provider_ids()
PROVIDER_ID_TO_NAME = {v: k for k, v in PROVIDER_IDS.items()}


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
        if provider_id in PROVIDER_ID_TO_NAME:
            provider_name = PROVIDER_ID_TO_NAME[provider_id]
        else:
            pass 
    else:
        # Extract name from model
        provider_name = extract_provider_name(model)
        
        # Check static/legacy mapping first
        # Dynamic lookup in DB (prioritize if found)
        provider_record = get_provider_by_name(provider_name, user_id)
        if provider_record:
            provider_id = provider_record['id']
        elif provider_name in PROVIDER_IDS:
            provider_id = PROVIDER_IDS[provider_name]
        else:
            raise ValueError(f"Unsupported provider: {provider_name}")

    # 2. Fetch API Keys (and potential Base URL)
    if not provider_id:
         raise ValueError(f"Could not resolve provider ID for {provider_name}")

    keys = fetch_api_keys(user_id, provider_id=provider_id)
    if not keys:
        raise ValueError(f"No API keys found for provider: {provider_name}")
    
    # 3. Determine Client Strategy - Always use Generic Client
    base_url = keys[0].get('base_url') or "https://api.openai.com/v1"
    
    # If it's a known provider with a standard base URL but user didn't provide one, 
    # we might want to default it. But user said "using the base url ... from db directly".
    # So we trust what's in the DB or default to OpenAI.
    # Actually, if the user deleted specific clients, they must rely on base_url being in DB
    # or the provider being OpenAI-compatible at the default URL.
    
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

# Exports for backward compatibility
models = PROVIDER_IDS
provider_id_to_name = PROVIDER_ID_TO_NAME
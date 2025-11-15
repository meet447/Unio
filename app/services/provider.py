from providers.openrouter.client import OpenrouterClient
from providers.google.client import GoogleClient
from providers.groq.client import GroqClient
from providers.anthropic.client import AnthropicClient
from providers.together.client import TogetherClient
from providers.openai.client import OpenaiClient

from auth.check_key import fetch_api_keys, fetch_all_providers_with_keys
import logging

# Configure logging
logger = logging.getLogger(__name__)

models = {
    'google':'5c696eb8-43ce-4d2b-8f4a-46a29a577104',
    'openrouter':'19dcbee7-3d66-4620-82de-918026af3257',
    'groq': 'b98b8844-81ac-4baa-9ca9-e349e369c600',
    'anthropic': 'ecce63a9-7c47-4167-9eb0-61cbe62f7711',
    'together':'e25a4be0-508b-4fc1-a2f5-4fb483cd4fcc',
    'openai':'50d4262d-b46d-49d6-a411-dcb00df53c26'
}

# Reverse mapping: provider_id -> provider name
provider_id_to_name = {v: k for k, v in models.items()}

def get_provider(model, user_id, provider_id=None):
    """
    Get provider client for a given model and user.
    
    Args:
        model: Model name (can be in format provider:model or provider/model)
        user_id: User ID
        provider_id: Optional provider_id to use instead of extracting from model
    
    Returns:
        Provider client instance
    """
    logger.debug(f"Getting provider for model: {model}")
    
    # If provider_id is provided, use it directly
    if provider_id:
        provider = provider_id_to_name.get(provider_id)
        if not provider:
            raise ValueError(f"Unknown provider_id: {provider_id}")
    else:
        # Handle both : and / separators for provider:model format
        if ":" in model:
            provider = model.split(":")[0]
        elif "/" in model:
            provider = model.split("/")[0]
        else:
            provider = model
        
        # Check if provider exists in our models mapping
        if provider not in models:
            logger.error(f"Unsupported provider '{provider}' from model '{model}'. Supported providers: {list(models.keys())}")
            raise ValueError(f"Unsupported provider: {provider}. Supported providers: {', '.join(models.keys())}")
        
        provider_id = models[provider]
    
    logger.debug(f"Using provider: {provider}, provider_id: {provider_id}")
    keys = fetch_api_keys(user_id, provider_id=provider_id)
    
    api_key_list = []
    for key in keys:
        api_key_list.append(key)
    
    if not api_key_list:
        raise ValueError(f"No API keys found for provider: {provider}")
        
    if provider == "google":
        return GoogleClient(api_keys=api_key_list)
        
    elif provider == "openrouter":
        return OpenrouterClient(api_keys=api_key_list)
    
    elif provider == "groq":
        return GroqClient(api_keys=api_key_list)
        
    elif provider == "anthropic":
        return AnthropicClient(api_keys=api_key_list)
    
    elif provider == "together":
        return TogetherClient(api_keys=api_key_list)
        
    elif provider == "openai":
        return OpenaiClient(api_keys=api_key_list)
    
    else:
        raise ValueError(f"Unsupported provider: {provider}")

def get_all_providers(user_id):
    """
    Get all available providers with their keys for a user.
    
    Returns:
        Dictionary mapping provider_id to provider client instance
    """
    providers_dict = fetch_all_providers_with_keys(user_id)
    provider_clients = {}
    
    for provider_id, keys in providers_dict.items():
        provider_name = provider_id_to_name.get(provider_id)
        if not provider_name or not keys:
            continue
        
        try:
            if provider_name == "google":
                provider_clients[provider_id] = GoogleClient(api_keys=keys)
            elif provider_name == "openrouter":
                provider_clients[provider_id] = OpenrouterClient(api_keys=keys)
            elif provider_name == "groq":
                provider_clients[provider_id] = GroqClient(api_keys=keys)
            elif provider_name == "anthropic":
                provider_clients[provider_id] = AnthropicClient(api_keys=keys)
            elif provider_name == "together":
                provider_clients[provider_id] = TogetherClient(api_keys=keys)
            elif provider_name == "openai":
                provider_clients[provider_id] = OpenaiClient(api_keys=keys)
        except Exception as e:
            logger.warning(f"Failed to create client for provider {provider_name}: {e}")
            continue
    
    return provider_clients

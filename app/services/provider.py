from providers.openrouter.client import OpenrouterClient
from providers.google.client import GoogleClient
from providers.groq.client import GroqClient
from providers.anthropic.client import AnthropicClient
from providers.together.client import TogetherClient
from providers.openai.client import OpenaiClient

from auth.check_key import fetch_api_keys
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

def get_provider(model, user_id):
    logger.debug(f"Getting provider for model: {model}")
    
    # Handle both : and / separators for provider:model format
    if ":" in model:
        provider = model.split(":")[0]
    elif "/" in model:
        provider = model.split("/")[0]
    else:
        provider = model
    
    logger.debug(f"Extracted provider: {provider}")
    
    # Check if provider exists in our models mapping
    if provider not in models:
        logger.error(f"Unsupported provider '{provider}' from model '{model}'. Supported providers: {list(models.keys())}")
        raise ValueError(f"Unsupported provider: {provider}. Supported providers: {', '.join(models.keys())}")
        
    provider_id = models[provider]
    logger.debug(f"Using provider_id: {provider_id}")
    keys = fetch_api_keys(user_id, provider_id=provider_id)
    
    api_key_list = []
    for key in keys:
        api_key_list.append(key)
        
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

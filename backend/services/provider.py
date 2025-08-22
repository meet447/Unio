from providers.openrouter.client import OpenrouterClient
from providers.google.client import GoogleClient
from auth.check_key import fetch_api_keys

models = {
    'google':'5c696eb8-43ce-4d2b-8f4a-46a29a577104',
    'openrouter':'19dcbee7-3d66-4620-82de-918026af3257'
}

def get_provider(model, user_id):
    provider = model.split(":")[0]    
    provider_id = models[provider]
    keys = fetch_api_keys(user_id, provider_id=provider_id)
    
    api_key_list = []
    for key in keys:
        api_key_list.append(key)
        
    if provider == "google":
        return GoogleClient(api_keys=api_key_list)
        
    elif provider == "openrouter":
        return OpenrouterClient(api_keys=api_key_list)
        
    else:
        raise ValueError(f"Unsupported provider: {provider}")

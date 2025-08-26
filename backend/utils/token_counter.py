import tiktoken
from typing import List, Dict, Any
from models.chat import Message, TextContent

def get_encoding_for_model(model: str):
    """Get the appropriate tiktoken encoding for a model"""
    try:
        # Remove provider prefix if present
        clean_model = model.split(":", 1)[-1] if ":" in model else model
        
        # Map common models to their encodings
        model_encodings = {
            "gpt-4": "cl100k_base",
            "gpt-4-turbo": "cl100k_base", 
            "gpt-4o": "o200k_base",
            "gpt-4o-mini": "o200k_base",
            "gpt-3.5-turbo": "cl100k_base",
            "text-embedding-ada-002": "cl100k_base",
            "text-davinci-003": "p50k_base",
            "claude-3": "cl100k_base",  # Approximate for Claude
            "gemini": "cl100k_base",    # Approximate for Gemini
        }
        
        # Find the best match
        encoding_name = "cl100k_base"  # Default
        for model_name, enc in model_encodings.items():
            if model_name in clean_model.lower():
                encoding_name = enc
                break
                
        return tiktoken.get_encoding(encoding_name)
    except:
        # Fallback to default encoding
        return tiktoken.get_encoding("cl100k_base")

def count_tokens_in_messages(messages: List[Message], model: str) -> int:
    """Count tokens in a list of messages"""
    encoding = get_encoding_for_model(model)
    
    num_tokens = 0
    for message in messages:
        # Every message follows <|start|>{role/name}\n{content}<|end|>\n
        num_tokens += 3
        
        # Add tokens for role
        if hasattr(message, 'role') and message.role:
            num_tokens += len(encoding.encode(message.role))
        
        # Add tokens for content
        if hasattr(message, 'content') and message.content:
            if isinstance(message.content, str):
                num_tokens += len(encoding.encode(message.content))
            elif isinstance(message.content, list):
                for content_item in message.content:
                    if isinstance(content_item, str):
                        num_tokens += len(encoding.encode(content_item))
                    elif hasattr(content_item, 'type'):
                        if content_item.type == 'text' and isinstance(content_item, TextContent):
                            num_tokens += len(encoding.encode(content_item.text))
                        elif content_item.type == 'image_url':
                            # Approximate token count for images (varies by size)
                            num_tokens += 85  # Base cost for image processing
    
    num_tokens += 3  # every reply is primed with <|start|>assistant<|message|>
    return num_tokens

def count_tokens_in_text(text: str, model: str) -> int:
    """Count tokens in a text string"""
    encoding = get_encoding_for_model(model)
    return len(encoding.encode(text))

def estimate_completion_tokens(content: str, model: str) -> int:
    """Estimate completion tokens from response content"""
    return count_tokens_in_text(content, model)
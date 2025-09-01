import time
import uuid
from typing import AsyncGenerator
from openai import AsyncOpenAI, APIError, RateLimitError
from ..base_client import BaseLLMClient
from models.chat import ChatRequest, ChatCompletionChunk, ChoiceChunk, Delta, Usage
from utils.token_counter import count_tokens_in_messages, estimate_completion_tokens
from auth.check_key import increment_usage_count
from exceptions import RateLimitExceededError, ProviderAPIError

class GoogleClient(BaseLLMClient):
    def __init__(self, api_keys):
        super().__init__(api_keys, base_url="https://generativelanguage.googleapis.com/v1beta/openai/")
    
    
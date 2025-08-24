from ..base_client import BaseLLMClient

class GoogleClient(BaseLLMClient):
    def __init__(self, api_keys):
        super().__init__(api_keys, base_url="https://generativelanguage.googleapis.com/v1beta/openai/")
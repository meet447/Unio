from ..base_client import BaseLLMClient

class AnthropicClient(BaseLLMClient):
    def __init__(self, api_keys):
        super().__init__(api_keys, base_url="https://api.anthropic.com/v1")
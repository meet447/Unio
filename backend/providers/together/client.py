from ..base_client import BaseLLMClient

class TogetherClient(BaseLLMClient):
    def __init__(self, api_keys):
        super().__init__(api_keys=api_keys, base_url="https://api.together.xyz/v1")
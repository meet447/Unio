class InvalidAPIKeyError(Exception):
    def __init__(self, message="Invalid API Key"):
        self.message = message
        super().__init__(self.message)

class RateLimitExceededError(Exception):
    def __init__(self, message="Rate limit exceeded"):
        self.message = message
        super().__init__(self.message)

class ProviderAPIError(Exception):
    def __init__(self, message="Provider API error", status_code=500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

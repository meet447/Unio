class InvalidAPIKeyError(Exception):
    def __init__(self, message="Invalid API Key"):
        self.message = message
        self.status_code = 401
        self.error_type = "invalid_request_error"
        self.error_code = "invalid_api_key"
        super().__init__(self.message)

class RateLimitExceededError(Exception):
    def __init__(self, message="Rate limit exceeded"):
        self.message = message
        self.status_code = 429
        self.error_type = "rate_limit_exceeded"
        self.error_code = "rate_limit_exceeded"
        super().__init__(self.message)

class ProviderAPIError(Exception):
    def __init__(self, message="Provider API error", status_code=500):
        self.message = message
        self.status_code = status_code
        self.error_type = "api_error"
        self.error_code = "provider_error"
        super().__init__(self.message)

class ModelNotFoundError(Exception):
    def __init__(self, message="Model not found"):
        self.message = message
        self.status_code = 400
        self.error_type = "invalid_request_error"
        self.error_code = "model_not_found"
        super().__init__(self.message)

class InternalServerError(Exception):
    def __init__(self, message="Internal server error"):
        self.message = message
        self.status_code = 500
        self.error_type = "internal_error"
        self.error_code = "server_error"
        super().__init__(self.message)

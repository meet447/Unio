import asyncio

# Mock exceptions - UPDATED
class RateLimitExceededError(Exception):
    def __init__(self, message, status_code=429, rotation_log=None):
        self.message = message
        self.status_code = status_code
        self.rotation_log = rotation_log or []

# Mock BaseLLMClient
class MockBaseLLMClient:
    async def stream_chat_completions(self):
        rotation_log = []
        # Simulate trying a key and failing
        rotation_log.append({"key": "key_1", "status": "failed", "error": "429"})
        
        # Simulate raising exception after failure - WITH LOG
        raise RateLimitExceededError("All keys rate limited", rotation_log=rotation_log)
        
        yield "should not reach here"

# Mock API logic
async def run_test():
    client = MockBaseLLMClient()
    metadata = {}
    
    try:
        async for chunk in client.stream_chat_completions():
            if isinstance(chunk, dict) and chunk.get("type") == "internal_metadata":
                metadata = chunk
                
    except RateLimitExceededError as e:
        print(f"Caught error: {e.message}")
        
        # FIXED: Get log from exception
        log = getattr(e, "rotation_log", [])
        print(f"Rotation Log in API: {log}")
        
        if not log:
            print("FAILURE: Rotation log is empty!")
        else:
            print("SUCCESS: Rotation log found.")

if __name__ == "__main__":
    asyncio.run(run_test())

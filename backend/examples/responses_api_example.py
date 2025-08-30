#!/usr/bin/env python3
"""
Example usage of the OpenAI Responses API endpoint.

This demonstrates how to use the new responses API with various features
including basic text generation, tool calling, and fallback mechanisms.
"""

import json
import requests

# API Configuration
BASE_URL = "http://localhost:8000/v1/api"
API_KEY = "rk_c5f43e7ec775b73228f1c42b07a8fe152bbbbec93a69713d0b7964c165a53d44"  # Replace with your actual API key

class UnioResponsesClient:
    """Simple client for the Unio Responses API"""
    
    def __init__(self, api_key: str, base_url: str = BASE_URL):
        self.api_key = api_key
        self.base_url = base_url
    
    def create_response(self, model: str, input_text: str, **kwargs):
        """Create a response using the responses API"""
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        # Add fallback model if provided
        if "fallback_model" in kwargs:
            headers["X-Fallback-Model"] = kwargs.pop("fallback_model")
        
        payload = {
            "model": model,
            "input": input_text,
            **kwargs
        }
        
        response = requests.post(
            f"{self.base_url}/responses",
            json=payload,
            headers=headers
        )
        
        return response

def example_basic_usage():
    """Example: Basic text generation"""
    print("Example 1: Basic Response Generation")
    print("-" * 40)
    
    client = UnioResponsesClient(API_KEY)
    
    response = client.create_response(
        model="groq:openai/gpt-oss-20b",
        input_text="Tell me a fun fact about the moon in one sentence.",
        temperature=0.7
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"Generated Response: {data['output_text']}")
        print(f"Model Used: {data['model']}")
        print(f"Tokens Used: {data['usage']['total_tokens']}")
    else:
        print(f"Error: {response.text}")
    
    print()

def example_conversation_context():
    """Example: Using conversation context"""
    print("Example 2: Conversation Context")
    print("-" * 40)
    
    client = UnioResponsesClient(API_KEY)
    
    conversation = [
        {"role": "user", "content": "What's the capital of France?"},
        {"role": "assistant", "content": "The capital of France is Paris."},
        {"role": "user", "content": "What's its population?"}
    ]
    
    response = client.create_response(
        model="openai/gpt-oss-20b",
        input_text=conversation,
        temperature=0.7
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"Response: {data['output_text']}")
    else:
        print(f"Error: {response.text}")
    
    print()

def example_tool_calling():
    """Example: Tool calling functionality"""
    print("Example 3: Tool Calling")
    print("-" * 40)
    
    client = UnioResponsesClient(API_KEY)
    
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get current weather for a location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "City and state, e.g. San Francisco, CA"
                        }
                    },
                    "required": ["location"]
                }
            }
        }
    ]
    
    response = client.create_response(
        model="groq:openai/gpt-oss-20b",
        input_text="What's the weather like in San Francisco?",
        tools=tools,
        tool_choice="auto",
        temperature=0.7
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"Response: {data['output_text']}")
        if data.get('tool_calls'):
            print("Tool calls made:")
            for tool_call in data['tool_calls']:
                print(f"  - {tool_call['function']['name']}: {tool_call['function']['arguments']}")
    else:
        print(f"Error: {response.text}")
    
    print()

def example_fallback_mechanism():
    """Example: Fallback mechanism"""
    print("Example 4: Fallback Mechanism")
    print("-" * 40)
    
    client = UnioResponsesClient(API_KEY)
    
    response = client.create_response(
        model="openai/gpt-oss-20b",
        input_text="Write a haiku about technology.",
        fallback_model="anthropic/claude-3-haiku-20240307",
        temperature=0.8
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"Generated Haiku:")
        print(data['output_text'])
        print(f"Key Used: {data['key_name']}")
        if "fallback:" in data['key_name']:
            print("🔄 Fallback model was used!")
    else:
        print(f"Error: {response.text}")
    
    print()

def example_different_providers():
    """Example: Testing different providers"""
    print("Example 5: Different AI Providers")
    print("-" * 40)
    
    client = UnioResponsesClient(API_KEY)
    
    providers = [
        "openrouter:openai/gpt-oss-20b",
        "anthropic:claude-3-haiku-20240307",
        "google:gemini-2.5-flash",
        "groq:llama-3.1-8b-instant"
    ]
    
    prompt = "Explain quantum computing in one sentence."
    
    for provider in providers:
        print(f"Testing {provider}:")
        response = client.create_response(
            model=provider,
            input_text=prompt,
            temperature=0.7
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"  Response: {data['output_text'][:100]}...")
        else:
            print(f"  Error: {response.json().get('error', {}).get('message', 'Unknown error')}")
        print()

def main():
    """Run all examples"""
    print("Unio Responses API Examples")
    print("=" * 50)
    
    if API_KEY == "your_api_key_here":
        print("❌ Please set your API key in the script")
        print("You can get an API key from your Unio dashboard")
        return
    
    try:
        example_basic_usage()
        example_conversation_context()
        example_tool_calling()
        example_fallback_mechanism()
        example_different_providers()
        
        print("✅ All examples completed!")
        print("\nNext steps:")
        print("- Try modifying the examples with your own prompts")
        print("- Test the fallback mechanism with rate-limited keys")
        print("- Experiment with different temperature values")
        print("- Add your own custom tools for function calling")
        
    except Exception as e:
        print(f"❌ Examples failed with error: {e}")

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""
Test script for the OpenAI Responses API endpoint.
Tests basic functionality, tool calling, and fallback mechanisms.
"""

import asyncio
import json
import os
import requests
from typing import Dict, Any

# Test configuration
BASE_URL = "http://localhost:8000/v1/api"
API_KEY = "your_api_key_here"  # Replace with actual API key

def make_request(endpoint: str, payload: Dict[str, Any], headers: Dict[str, str] = None) -> requests.Response:
    """Make a request to the API"""
    url = f"{BASE_URL}/{endpoint}"
    default_headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    
    if headers:
        default_headers.update(headers)
    
    return requests.post(url, json=payload, headers=default_headers)

def test_basic_response():
    """Test basic response generation"""
    print("Testing basic response generation...")
    
    payload = {
        "model": "openai/gpt-4o-mini",
        "input": "Tell me a fun fact about the moon in one sentence.",
        "temperature": 0.7
    }
    
    response = make_request("responses", payload)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Response ID: {data.get('id')}")
        print(f"Model: {data.get('model')}")
        print(f"Output Text: {data.get('output_text')}")
        print(f"Key Name: {data.get('key_name')}")
        if data.get('usage'):
            usage = data['usage']
            print(f"Usage - Prompt: {usage.get('prompt_tokens')}, Completion: {usage.get('completion_tokens')}, Total: {usage.get('total_tokens')}")
        print("✅ Basic response test passed")
    else:
        print(f"❌ Basic response test failed: {response.text}")
    
    print("-" * 50)

def test_conversation_input():
    """Test response generation with conversation messages"""
    print("Testing response generation with conversation messages...")
    
    payload = {
        "model": "openai/gpt-4o-mini",
        "input": [
            {"role": "user", "content": "What's the capital of France?"},
            {"role": "assistant", "content": "The capital of France is Paris."},
            {"role": "user", "content": "What's the population?"}
        ],
        "temperature": 0.7
    }
    
    response = make_request("responses", payload)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Response ID: {data.get('id')}")
        print(f"Output Text: {data.get('output_text')}")
        print("✅ Conversation input test passed")
    else:
        print(f"❌ Conversation input test failed: {response.text}")
    
    print("-" * 50)

def test_tool_calling():
    """Test response generation with tool calling"""
    print("Testing response generation with tool calling...")
    
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get the current weather for a location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g. San Francisco, CA"
                        }
                    },
                    "required": ["location"]
                }
            }
        }
    ]
    
    payload = {
        "model": "openai/gpt-4o-mini",
        "input": "What's the weather like in San Francisco?",
        "temperature": 0.7,
        "tools": tools,
        "tool_choice": "auto"
    }
    
    response = make_request("responses", payload)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Response ID: {data.get('id')}")
        print(f"Output Text: {data.get('output_text')}")
        if data.get('tool_calls'):
            print(f"Tool Calls: {json.dumps(data.get('tool_calls'), indent=2)}")
        print("✅ Tool calling test passed")
    else:
        print(f"❌ Tool calling test failed: {response.text}")
    
    print("-" * 50)

def test_fallback_mechanism():
    """Test fallback mechanism"""
    print("Testing fallback mechanism...")
    
    payload = {
        "model": "openai/gpt-4o-mini",
        "input": "Tell me a joke.",
        "temperature": 0.7
    }
    
    headers = {
        "X-Fallback-Model": "anthropic/claude-3-haiku-20240307"
    }
    
    response = make_request("responses", payload, headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Response ID: {data.get('id')}")
        print(f"Output Text: {data.get('output_text')}")
        print(f"Key Name: {data.get('key_name')}")
        print("✅ Fallback mechanism test passed")
    else:
        print(f"❌ Fallback mechanism test failed: {response.text}")
    
    print("-" * 50)

def test_different_providers():
    """Test with different AI providers"""
    print("Testing different AI providers...")
    
    providers = [
        "openai/gpt-4o-mini",
        "anthropic/claude-3-haiku-20240307",
        "google/gemini-1.5-flash",
        "groq/llama-3.1-8b-instant"
    ]
    
    for provider in providers:
        print(f"Testing {provider}...")
        payload = {
            "model": provider,
            "input": "Say hello in a creative way.",
            "temperature": 0.7
        }
        
        response = make_request("responses", payload)
        print(f"  Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"  Output: {data.get('output_text')[:100]}...")
            print(f"  ✅ {provider} test passed")
        else:
            print(f"  ❌ {provider} test failed: {response.text}")
        print()
    
    print("-" * 50)

def test_error_handling():
    """Test error handling"""
    print("Testing error handling...")
    
    # Test with invalid model
    payload = {
        "model": "invalid/model",
        "input": "This should fail.",
        "temperature": 0.7
    }
    
    response = make_request("responses", payload)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 400:
        data = response.json()
        print(f"Error: {data.get('error', {}).get('message')}")
        print("✅ Error handling test passed")
    else:
        print(f"❌ Error handling test failed: {response.text}")
    
    print("-" * 50)

def main():
    """Run all tests"""
    print("Starting OpenAI Responses API Tests")
    print("=" * 50)
    
    # Check if API key is set
    if API_KEY == "your_api_key_here":
        print("❌ Please set your API key in the script")
        return
    
    try:
        test_basic_response()
        test_conversation_input()
        test_tool_calling()
        test_fallback_mechanism()
        test_different_providers()
        test_error_handling()
        
        print("✅ All tests completed!")
        
    except Exception as e:
        print(f"❌ Test suite failed with error: {e}")

if __name__ == "__main__":
    main()
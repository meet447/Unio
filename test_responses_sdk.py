"""
Test script to verify OpenAI SDK works with Unio Responses API

Usage:
    Set UNIO_API_KEY environment variable:
    export UNIO_API_KEY=your_api_key_here
    
    Set UNIO_BASE_URL (optional, defaults to localhost):
    export UNIO_BASE_URL=http://127.0.0.1:8000/v1/api
    
    Then run:
    python test_responses_sdk.py
"""
import os
from openai import OpenAI

# Get configuration from environment variables
api_key = os.getenv("UNIO_API_KEY")
base_url = os.getenv("UNIO_BASE_URL", "http://127.0.0.1:8000/v1/api")

if not api_key:
    raise ValueError("UNIO_API_KEY environment variable is required")

# Initialize the OpenAI client with Unio's responses API
client = OpenAI(
    base_url=base_url,
    api_key=api_key
)

print("=" * 60)
print("Testing OpenAI SDK with Unio Responses API")
print("=" * 60)
print()

# Test 1: Basic response with string input
print("Test 1: Basic response with string input")
print("-" * 60)
try:
    response = client.responses.create(
        input="Say hello in one word",
        model="openai:gpt-4o-mini"
    )
    print(f"✅ Success!")
    print(f"Response ID: {response.id}")
    print(f"Output Text: {response.output_text}")
    print(f"Model: {response.model}")
    if hasattr(response, 'usage') and response.usage:
        print(f"Usage - Prompt: {response.usage.prompt_tokens}, "
              f"Completion: {response.usage.completion_tokens}, "
              f"Total: {response.usage.total_tokens}")
    print()
except Exception as e:
    print(f"❌ Error: {e}")
    print(f"Error type: {type(e).__name__}")
    print()

# Test 2: Response with conversation array input
print("Test 2: Response with conversation array input")
print("-" * 60)
try:
    response = client.responses.create(
        input=[
            {"role": "user", "content": "What is 2+2?"},
            {"role": "assistant", "content": "2+2 equals 4."},
            {"role": "user", "content": "What about 3+3?"}
        ],
        model="openai:gpt-4o-mini",
        temperature=0.7
    )
    print(f"✅ Success!")
    print(f"Response ID: {response.id}")
    print(f"Output Text: {response.output_text}")
    print()

except Exception as e:
    print(f"❌ Error: {e}")
    print(f"Error type: {type(e).__name__}")
    print()

# Test 3: Response with different provider
print("Test 3: Response with different provider (Anthropic)")
print("-" * 60)
try:
    response = client.responses.create(
        input="Explain quantum computing in one sentence",
        model="anthropic:claude-3-5-sonnet-20241022"
    )
    print(f"✅ Success!")
    print(f"Response ID: {response.id}")
    print(f"Output Text: {response.output_text[:100]}...")  # First 100 chars
    print(f"Model: {response.model}")
    print()

except Exception as e:
    print(f"❌ Error: {e}")
    print(f"Error type: {type(e).__name__}")
    print()

# Test 4: Response with temperature parameter
print("Test 4: Response with temperature parameter")
print("-" * 60)
try:
    response = client.responses.create(
        input="Write a creative one-sentence story about a robot",
        model="openai:gpt-4o-mini",
        temperature=0.9
    )
    print(f"✅ Success!")
    print(f"Output Text: {response.output_text}")
    print()

except Exception as e:
    print(f"❌ Error: {e}")
    print(f"Error type: {type(e).__name__}")
    print()

print("=" * 60)
print("Testing complete!")
print("=" * 60)


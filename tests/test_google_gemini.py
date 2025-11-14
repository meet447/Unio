"""
Test script to verify OpenAI SDK works with Unio Responses API using Google Gemini

Usage:
    Set UNIO_API_KEY environment variable:
    export UNIO_API_KEY=your_api_key_here
    
    Set UNIO_BASE_URL (optional, defaults to localhost):
    export UNIO_BASE_URL=http://127.0.0.1:8000/v1/api
    
    Then run:
    python test_google_gemini.py
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

print("=" * 70)
print("Testing OpenAI SDK with Unio Responses API - Google Gemini 2.0 Flash")
print("=" * 70)
print()

# Test 1: Basic response with Google Gemini
print("Test 1: Basic response with google:gemini-2.0-flash")
print("-" * 70)
try:
    response = client.responses.create(
        input="Say hello in one word",
        model="google:gemini-2.0-flash"
    )
    print(f"✅ SUCCESS!")
    print(f"Response ID: {response.id}")
    # Try to get output text - it might be in different formats
    output_text = getattr(response, 'output_text', None)
    if not output_text and hasattr(response, 'output') and response.output:
        # Try to extract from nested structure (Pydantic models)
        if len(response.output) > 0 and hasattr(response.output[0], 'content'):
            content = response.output[0].content
            if isinstance(content, list) and len(content) > 0:
                if hasattr(content[0], 'text'):
                    output_text = content[0].text
                elif isinstance(content[0], dict):
                    output_text = content[0].get('text', '')
    print(f"Output Text: {output_text or 'N/A (check response.output structure)'}")
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

# Test 2: Conversation with Gemini
print("Test 2: Conversation with google:gemini-2.0-flash")
print("-" * 70)
try:
    response = client.responses.create(
        input=[
            {"role": "user", "content": "What is 2+2?"},
            {"role": "assistant", "content": "2+2 equals 4."},
            {"role": "user", "content": "What about 3+3?"}
        ],
        model="google:gemini-2.0-flash",
        temperature=0.7
    )
    print(f"✅ SUCCESS!")
    print(f"Response ID: {response.id}")
    # Try to get output text
    output_text = getattr(response, 'output_text', None)
    if not output_text and hasattr(response, 'output') and response.output:
        if len(response.output) > 0 and hasattr(response.output[0], 'content'):
            content = response.output[0].content
            if isinstance(content, list) and len(content) > 0:
                if hasattr(content[0], 'text'):
                    output_text = content[0].text
                elif isinstance(content[0], dict):
                    output_text = content[0].get('text', '')
    print(f"Output Text: {output_text or 'N/A'}")
    print()
except Exception as e:
    print(f"❌ Error: {e}")
    print(f"Error type: {type(e).__name__}")
    print()

# Test 3: Longer prompt
print("Test 3: Longer prompt with google:gemini-2.0-flash")
print("-" * 70)
try:
    response = client.responses.create(
        input="Explain quantum computing in one sentence",
        model="google:gemini-2.0-flash",
        temperature=0.5
    )
    print(f"✅ SUCCESS!")
    # Try to get output text
    output_text = getattr(response, 'output_text', None)
    if not output_text and hasattr(response, 'output') and response.output:
        if len(response.output) > 0 and hasattr(response.output[0], 'content'):
            content = response.output[0].content
            if isinstance(content, list) and len(content) > 0:
                if hasattr(content[0], 'text'):
                    output_text = content[0].text
                elif isinstance(content[0], dict):
                    output_text = content[0].get('text', '')
    print(f"Output Text: {output_text or 'N/A'}")
    print()
except Exception as e:
    print(f"❌ Error: {e}")
    print(f"Error type: {type(e).__name__}")
    print()

print("=" * 70)
print("Testing complete!")
print("=" * 70)


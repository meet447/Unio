"""
Streaming completion test for Unio Chat Completions API

Usage:
    Set UNIO_API_KEY environment variable:
    export UNIO_API_KEY=your_api_key_here
    
    Set UNIO_BASE_URL (optional, defaults to localhost):
    export UNIO_BASE_URL=http://127.0.0.1:8000/v1/api
"""
import os
from openai import OpenAI

def test_completion_stream():
    # Get configuration from environment variables
    api_key = os.getenv("UNIO_API_KEY")
    base_url = os.getenv("UNIO_BASE_URL", "http://127.0.0.1:8000/v1/api")

    if not api_key:
        raise ValueError("UNIO_API_KEY environment variable is required")

    unio = OpenAI(
        base_url=base_url,
        api_key=api_key
    )
    response = unio.chat.completions.create(
        messages=[{"role": "user", "content": "hello world"}],
        model='groq:openai/gpt-oss-20b',
        stream=True
    )

    full_response_content = []
    for chunk in response:
        if chunk.choices[0].delta.content:
            full_response_content.append(chunk.choices[0].delta.content)
    
    return "".join(full_response_content)
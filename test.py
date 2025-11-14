"""
Example test script for Unio API.

Usage:
    Set UNIO_API_KEY environment variable:
    export UNIO_API_KEY=your_api_key_here
    
    Then run:
    python test.py
"""
import os
from openai import OpenAI

# Get API key from environment variable
api_key = os.getenv("UNIO_API_KEY")
if not api_key:
    raise ValueError("UNIO_API_KEY environment variable is required")

client = OpenAI(
    base_url='https://unio.onrender.com/v1/api',
    api_key=api_key
)

response = client.chat.completions.create(
    model="google:gemini-2.5-flash",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ]
)

print(response.choices[0].message.content)

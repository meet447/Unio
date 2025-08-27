#!/usr/bin/env python3
"""
Test fallback functionality
"""

import requests
import json

# Test with fallback header
def test_fallback_model():
    url = "http://localhost:8000/v1/api/chat/completions"
    
    headers = {
        "Authorization": "Bearer your_api_key_here",
        "X-Fallback-Model": "groq:llama-3.1-8b-instant",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "google:gemini-2.0-flash-exp",  # Primary model
        "messages": [{"role": "user", "content": "Hello!"}],
        "temperature": 0.7,
        "stream": False
    }
    
    print("Testing fallback functionality...")
    print(f"Primary model: {data['model']}")
    print(f"Fallback model: {headers['X-Fallback-Model']}")
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_fallback_model()
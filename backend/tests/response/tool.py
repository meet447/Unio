#!/usr/bin/env python3
"""
Tool Calling Example for Unio Response API

This example demonstrates how to use function calling with the Unio Response API
to search for books in Project Gutenberg. The Response API provides a different
interface compared to Chat Completions API, focusing on response generation.

The example shows:
1. Defining a tool/function that can be called by the LLM
2. Making a request with tool definitions using the Response API
3. Processing tool calls from the response
4. Executing the requested function
5. Getting a complete response with tool results
"""

from openai import OpenAI
import requests
import json

# -----------------------------
# 1️⃣ Initialize client
# -----------------------------
MODEL = "groq:openai/gpt-oss-120b"

client = OpenAI(
    base_url="http://127.0.0.1:8000/v1/api",
    api_key="rk_c5f43e7ec775b73228f1c42b07a8fe152bbbbec93a69713d0b7964c165a53d44"
)

# -----------------------------
# 2️⃣ Define the tool function
# -----------------------------
def search_gutenberg_books(search_terms):
    """Search for books in Project Gutenberg using given terms"""
    if not search_terms:
        return []
    
    search_query = " ".join(search_terms)
    print(f"🔍 Searching Project Gutenberg for: '{search_query}'")
    
    try:
        url = "https://gutendex.com/books"
        response = requests.get(url, params={"search": search_query}, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        books = data.get("results", [])
        
        simplified_results = []
        for book in books[:5]:  # Limit to first 5 results
            authors = [author.get("name", "Unknown") for author in book.get("authors", [])]
            simplified_results.append({
                "id": book.get("id"),
                "title": book.get("title", "Unknown Title"),
                "authors": authors,
                "download_count": book.get("download_count", 0)
            })
        
        print(f"✅ Found {len(simplified_results)} books")
        return simplified_results
        
    except Exception as e:
        print(f"❌ Error searching books: {e}")
        return []

# -----------------------------
# 3️⃣ Tool metadata for OpenAI
# -----------------------------
tools = [
    {
        "type": "function",
        "function": {
            "name": "search_gutenberg_books",
            "description": "Search for books in Project Gutenberg using given terms",
            "parameters": {
                "type": "object",
                "properties": {
                    "search_terms": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of search terms"
                    }
                },
                "required": ["search_terms"]
            }
        }
    }
]

TOOL_MAPPING = {"search_gutenberg_books": search_gutenberg_books}

# -----------------------------
# 4️⃣ Input message (make it more explicit)
# -----------------------------
# Let's make the request more explicit about using tools
input_messages = [
    {
        "role": "system",
        "content": "You are a helpful librarian assistant. When users ask about books, you MUST use the search_gutenberg_books function to find relevant books from Project Gutenberg. Always call the function when asked about books."
    },
    {
        "role": "user", 
        "content": "Search for books by James Joyce on Project Gutenberg using the search_gutenberg_books function."
    }
]

print("📚 Starting Tool Calling Example with Response API")
print(f"🤖 Model: {MODEL}")
print(f"🛠️  Available tools: {[tool['function']['name'] for tool in tools]}")
print(f"💬 Input type: Message array (system + user)")
print()

# -----------------------------
# 5️⃣ Make initial request (try streaming first)
# -----------------------------
print("🔄 Making streaming request with tool definitions...")

try:
    response = client.responses.create(
        model=MODEL,
        input=input_messages,  # Use message array instead of string
        tools=tools,
        tool_choice="auto",
        stream=True
    )
    
    print("🌊 Streaming response:")
    
    # Collect the streaming response
    full_content = ""
    tool_calls_found = []
    
    for chunk in response:
        # Print the chunk type for debugging
        chunk_type = getattr(chunk, 'type', 'unknown')
        print(f"📦 Received chunk: {chunk_type}")
        
        # Handle different event types
        if hasattr(chunk, 'type'):
            if chunk.type == 'response.output_text.delta':
                if hasattr(chunk, 'delta'):
                    full_content += chunk.delta
                    print(chunk)
                    print(f"📝 Delta: {chunk.delta}")
            elif chunk.type == 'response.completed':
                print(f"✅ Response completed")
                if hasattr(chunk, 'response'):
                    print(f"📋 Final response usage: {getattr(chunk.response, 'usage', None)}")
                break
    
    print(f"\n📜 Complete content: {full_content}")
    
except Exception as e:
    print(f"❌ Streaming failed: {e}")
    
    # Fallback to non-streaming
    print("\n🔄 Trying non-streaming request...")
    
    response = client.responses.create(
        model=MODEL,
        input=input_messages,  # Use message array
        tools=tools,
        tool_choice="auto",
        stream=False
    )
    
    print(f"📝 Response ID: {response.id}")
    
    # Check if we have output messages
    if response.output and len(response.output) > 0:
        message = response.output[0]
        
        # Check for text content and tool calls
        text_content = None
        tool_calls = []
        
        for content_item in message.content:
            if content_item.type == "output_text":
                text_content = content_item.text
                print(f"📝 Assistant response: {text_content}")
        
        # Check if there are any tool calls (they might be in a different structure)
        print("\n🔍 Checking for tool calls...")
        
        # The tool calls might be embedded in the message structure differently
        # Let's check the full message structure
        print(f"📋 Message structure: {json.dumps(message.model_dump(), indent=2)}")
        
        # Check if the response itself contains tool call information
        print(f"\n📋 Full response structure:")
        response_dict = response.model_dump()
        # Remove large nested objects for cleaner output
        clean_response = {k: v for k, v in response_dict.items() if k not in ['output']}
        print(json.dumps(clean_response, indent=2))
        
    else:
        print("❌ No output received from the model")

print("\n⚠️  Note: Response API tool calling format may differ from Chat Completions API")
print("📖 This example demonstrates the basic Response API structure.")
print("🔧 Tool calling integration may need additional implementation.")

print("\n" + "="*60)
print("RESPONSE API CHARACTERISTICS:")
print("1. 🎯 Focuses on single response generation rather than conversation")
print("2. 📤 Returns structured response objects with output array")
print("3. 🛠️  Tool calling may require different handling than Chat API")
print("4. 🔄 May need separate requests for tool execution and final response")
print("="*60)
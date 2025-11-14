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
import os

MODEL = "groq:llama3-70b-8192"

# Get configuration from environment variables
api_key = os.getenv("UNIO_API_KEY")
base_url = os.getenv("UNIO_BASE_URL", "http://127.0.0.1:8000/v1/api")

if not api_key:
    raise ValueError("UNIO_API_KEY environment variable is required. Set it with: export UNIO_API_KEY=your_api_key_here")

client = OpenAI(
    base_url=base_url,
    api_key=api_key
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
    # Test non-streaming version
    print("🔄 Making non-streaming request with tool definitions...")
    
    response = client.responses.create(
        model=MODEL,
        input=input_messages,
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
        
        print(f"📋 Message content items: {len(message.content)}")
        
        for i, content_item in enumerate(message.content):
            print(f"  Content {i}: type={getattr(content_item, 'type', type(content_item))}")
            
            if hasattr(content_item, 'type'):
                if content_item.type == "text":
                    text_content = content_item.text
                    print(f"📝 Assistant response: {text_content}")
                elif content_item.type == "tool_calls":
                    # For Pydantic objects, access the tool_calls directly
                    tool_calls = content_item.tool_calls
                    print(f"🛠️  Tool calls found: {len(tool_calls)}")
                    for j, tc in enumerate(tool_calls):
                        print(f"    Tool {j+1}: {tc}")
                        
        # Execute tool calls if found
        if tool_calls:
            print("\n🔧 Executing tool calls...")
            for tc in tool_calls:
                if hasattr(tc, 'function'):
                    function_name = tc.function.name
                    arguments = json.loads(tc.function.arguments)
                else:
                    function_name = tc['function']['name']
                    arguments = json.loads(tc['function']['arguments'])
                
                if function_name in TOOL_MAPPING:
                    print(f"🛠️  Calling {function_name} with {arguments}")
                    result = TOOL_MAPPING[function_name](**arguments)
                    print(f"✅ Non-streaming result: {len(result)} books found")
                    for book in result[:2]:  # Show first 2
                        print(f"    - {book['title']} by {', '.join(book['authors'])}")
        
    else:
        print("❌ No output received from the model")
    
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
        
        print(f"📋 Message content items: {len(message.content)}")
        
        for i, content_item in enumerate(message.content):
            print(f"  Content {i}: type={getattr(content_item, 'type', type(content_item))}")
            
            if hasattr(content_item, 'type'):
                if content_item.type == "text":
                    text_content = content_item.text
                    print(f"📝 Assistant response: {text_content}")
                elif content_item.type == "tool_calls":
                    # For Pydantic objects, access the tool_calls directly
                    tool_calls = content_item.tool_calls
                    print(f"🛠️  Tool calls found: {len(tool_calls)}")
                    for j, tc in enumerate(tool_calls):
                        print(f"    Tool {j+1}: {tc}")
            elif isinstance(content_item, dict) and content_item.get('type') == 'tool_calls':
                tool_calls = content_item.get('tool_calls', [])
                print(f"🛠️  Tool calls found: {len(tool_calls)}")
                for j, tc in enumerate(tool_calls):
                    print(f"    Tool {j+1}: {tc}")
        
        if not text_content and not tool_calls:
            print("❌ No text content or tool calls found")
            print(f"📋 Raw message structure: {message.model_dump()}")
        
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
#!/usr/bin/env python3
"""
Tool Calling Example for Unio API

This example demonstrates how to use function calling with the Unio API
to search for books in Project Gutenberg. The example shows:
1. Defining a tool/function that can be called by the LLM
2. Making a request with tool definitions
3. Processing tool calls from the LLM response
4. Executing the requested function
5. Sending the function result back to get a final response
"""

from openai import OpenAI
import requests
import json

# -----------------------------
# 1️⃣ Initialize client
# -----------------------------
MODEL = "groq:openai/gpt-oss-20b"

client = OpenAI(
    base_url="http://127.0.0.1:8000/v1/api",
    api_key="rk_c5f43e7ec775b73228f1c42b07a8fe152bbbbec93a69713d0b7964c165a53d44"
)

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

# Tool metadata
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

# Messages
messages = [
    {
        "role": "system", 
        "content": "You are a helpful librarian assistant. When asked about books, use the search_gutenberg_books tool to find relevant books from Project Gutenberg. Always provide detailed information about the books you find."
    },
    {
        "role": "user", 
        "content": "I'm looking for books by James Joyce available on Project Gutenberg. Can you search for them and tell me about what you find?"
    }
]

print("📚 Starting Tool Calling Example")
print(f"🤖 Model: {MODEL}")
print(f"🛠️  Available tools: {[tool['function']['name'] for tool in tools]}")
print()

# Request completion
print("🔄 Making initial request with tool definitions...")
response = client.chat.completions.create(model=MODEL, messages=messages, tools=tools)

message = response.choices[0].message
print(f"📝 Assistant response: {message.content}")

# Add assistant message to conversation
if message.content:
    messages.append({"role": "assistant", "content": message.content})

# Check if the model made tool calls
if message.tool_calls:
    print(f"🔧 Model made {len(message.tool_calls)} tool call(s)")
    
    # Process each tool call
    for tool_call in message.tool_calls:
        print(f"\n🛠️  Executing tool: {tool_call.function.name}")
        print(f"📋 Arguments: {tool_call.function.arguments}")
        
        # Get the function to call
        function_name = tool_call.function.name
        function_to_call = TOOL_MAPPING.get(function_name)
        
        if function_to_call:
            try:
                # Parse the function arguments
                function_args = json.loads(tool_call.function.arguments)
                search_terms = function_args.get("search_terms", ["James Joyce"])
                
                # Call the function
                function_result = function_to_call(search_terms)
                print(f"✅ Tool result: Found {len(function_result)} books")
                
                # Add tool call message to conversation
                messages.append({
                    "role": "assistant", 
                    "content": None,
                    "tool_calls": [{
                        "id": tool_call.id,
                        "type": "function",
                        "function": {
                            "name": function_name,
                            "arguments": tool_call.function.arguments
                        }
                    }]
                })
                
                # Add tool result message to conversation
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(function_result)
                })
                
            except Exception as e:
                print(f"❌ Error executing tool: {e}")
                # Add error result
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": f"Error: {str(e)}"
                })
        else:
            print(f"❌ Unknown function: {function_name}")
    
    # Get final response from the model with tool results
    print("\n🔄 Getting final response with tool results...")
    final_response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        tools=tools
    )
    
    print("\n🎯 Final Response:")
    print("=" * 50)
    print(final_response.choices[0].message.content)
    print("=" * 50)
    
else:
    print("ℹ️  No tool calls were made by the model")
    print(f"📄 Direct response: {message.content}")

print("\n✨ Tool calling example completed successfully!")
print("\n" + "="*60)
print("WHAT HAPPENED:")
print("1. 🤖 LLM received tool definitions and user request")
print("2. 🔧 LLM decided to call the 'search_gutenberg_books' tool")
print("3. 🔍 Our code executed the function with the LLM's arguments")
print("4. 📊 Function returned book data from Project Gutenberg API")
print("5. 🎯 LLM received the data and formatted a helpful response")
print("="*60)
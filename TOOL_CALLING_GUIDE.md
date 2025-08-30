# Tool Calling and Function Calling Support in Unio

## Overview

Unio now supports OpenAI-compatible tool calling and function calling! You can use the same code that works with OpenAI or OpenRouter to define and execute tools/functions through any supported provider.

## Features

- ✅ Full OpenAI-compatible tool calling API
- ✅ Support for streaming and non-streaming responses 
- ✅ Proper token counting for tools and tool calls
- ✅ Works with all providers that support function calling
- ✅ Automatic message flow handling

## Supported Providers

| Provider | Function Calling Support |
|----------|-------------------------|
| OpenAI   | ✅ Yes                 |
| Anthropic| ✅ Yes                 |
| Google   | ✅ Yes                 |
| OpenRouter| ✅ Yes                |
| Together | ❌ No                  |
| Groq     | ❌ No                  |

## Usage Examples

### Basic Tool Calling

```python
from openai import OpenAI

# Use Unio as a drop-in replacement
client = OpenAI(
    base_url="https://unio.onrender.com/v1/api",
    api_key="your-unio-token"
)

# Define tools
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a city",
            "parameters": {
                "type": "object", 
                "properties": {
                    "city": {"type": "string"},
                    "unit": {"type": "string", "enum": ["C", "F"]}
                },
                "required": ["city"]
            }
        }
    }
]

# Make request with tools
response = client.chat.completions.create(
    model="openai:gpt-4o",  # Any provider that supports function calling
    messages=[
        {"role": "user", "content": "What's the weather in Paris in Celsius?"}
    ],
    tools=tools,
    tool_choice="auto"  # Let the model decide when to use tools
)

# Check if model wants to call a tool
if response.choices[0].message.tool_calls:
    for tool_call in response.choices[0].message.tool_calls:
        function_name = tool_call.function.name
        arguments = json.loads(tool_call.function.arguments)
        
        # Execute your function
        if function_name == "get_weather":
            result = get_weather(**arguments)
            
            # Send result back to model
            followup = client.chat.completions.create(
                model="openai:gpt-4o",
                messages=[
                    {"role": "user", "content": "What's the weather in Paris in Celsius?"},
                    response.choices[0].message.model_dump(),  # Assistant message with tool call
                    {
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": result
                    }
                ],
                tools=tools
            )
            
            print(followup.choices[0].message.content)
```

### Streaming Tool Calls

```python
# Streaming also works with tool calls
stream = client.chat.completions.create(
    model="anthropic:claude-3-5-sonnet-20241022",
    messages=[{"role": "user", "content": "Calculate 15 + 27"}],
    tools=[{
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "Perform basic calculations",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {"type": "string"}
                }
            }
        }
    }],
    stream=True
)

# Collect tool calls from stream
tool_calls = []
for chunk in stream:
    if chunk.choices[0].delta.tool_calls:
        # Handle tool call deltas (Unio handles the accumulation)
        pass
```

### Multiple Function Support

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get weather information",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string"}
                }
            }
        }
    },
    {
        "type": "function", 
        "function": {
            "name": "search_web",
            "description": "Search the web for information",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"}
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "send_email",
            "description": "Send an email",
            "parameters": {
                "type": "object",
                "properties": {
                    "to": {"type": "string"},
                    "subject": {"type": "string"},
                    "body": {"type": "string"}
                }
            }
        }
    }
]

response = client.chat.completions.create(
    model="google:gemini-2.0-flash-exp",
    messages=[{
        "role": "user", 
        "content": "Check the weather in Tokyo, search for the best restaurants there, and email the results to john@example.com"
    }],
    tools=tools
)
```

### Tool Choice Control

```python
# Force the model to use a specific tool
response = client.chat.completions.create(
    model="openai:gpt-4o",
    messages=[{"role": "user", "content": "What's 2+2?"}],
    tools=tools,
    tool_choice={
        "type": "function",
        "function": {"name": "calculate"}
    }
)

# Prevent the model from using any tools
response = client.chat.completions.create(
    model="openai:gpt-4o", 
    messages=[{"role": "user", "content": "What's the weather?"}],
    tools=tools,
    tool_choice="none"
)

# Let the model decide (default)
response = client.chat.completions.create(
    model="openai:gpt-4o",
    messages=[{"role": "user", "content": "Help me with this task"}],
    tools=tools,
    tool_choice="auto"  # or omit this parameter
)
```

## API Reference

### Request Parameters

- `tools` (optional): Array of tool definitions
- `tool_choice` (optional): Controls tool usage
  - `"auto"` (default): Let model decide
  - `"none"`: Don't use tools
  - `{"type": "function", "function": {"name": "function_name"}}`: Force specific tool

### Response Format

When a model wants to call a tool, the response includes:

```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": null,
      "tool_calls": [{
        "id": "call_123",
        "type": "function", 
        "function": {
          "name": "function_name",
          "arguments": "{\"param\": \"value\"}"
        }
      }]
    }
  }]
}
```

### Tool Response Format

When sending tool results back:

```json
{
  "role": "tool",
  "tool_call_id": "call_123", 
  "content": "Tool execution result"
}
```

## Token Usage

Tool definitions and tool calls are included in token counting:

- Tool definitions add to prompt tokens
- Tool call responses add to completion tokens
- Tool messages add to prompt tokens for subsequent requests

## Error Handling

If a provider doesn't support function calling, Unio will:

1. Pass through the request without tools
2. Return a regular text response
3. Include a warning in the response metadata

## Best Practices

1. **Define clear function descriptions** - Help the model understand when to use each tool
2. **Use specific parameter schemas** - Validate inputs with proper JSON schema
3. **Handle tool errors gracefully** - Always validate tool call arguments
4. **Implement timeout handling** - Tools should have reasonable execution limits
5. **Use fallback models** - If primary model doesn't support tools, fallback to one that does

## Migration from OpenAI/OpenRouter

Your existing tool calling code should work without changes! Just update the `base_url`:

```python
# Before (OpenAI)
client = OpenAI(api_key="sk-...")

# Before (OpenRouter)  
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="sk-or-..."
)

# After (Unio)
client = OpenAI(
    base_url="https://unio.onrender.com/v1/api", 
    api_key="your-unio-token"
)
```

That's it! Your tool calling code will work across all supported providers through Unio's unified API.
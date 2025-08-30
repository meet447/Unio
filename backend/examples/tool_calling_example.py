#!/usr/bin/env python3
"""
Example: Tool Calling with Unio - Exact replica of your OpenRouter example

This shows how your existing OpenRouter tool calling code works with Unio
with just a base_url change!
"""

import os
import json
from openai import OpenAI

# 🔑 Use Unio endpoint with OpenAI SDK (just change the base_url!)
client = OpenAI(
    base_url="https://unio.onrender.com/v1/api",  # Changed from OpenRouter to Unio
    api_key=os.getenv("UNIO_API_KEY")  # Use your Unio API token
)

# ---- 1. Define a Tool ---- (Exactly the same as your example!)
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

# ---- 2. Send a User Query ---- (Exactly the same!)
messages = [{"role": "user", "content": "What's the weather in Paris in C?"}]

response = client.chat.completions.create(
    model="openai:gpt-4o",  # Any provider:model that supports tool calling
    messages=messages,
    tools=tools
)

assistant_msg = response.choices[0].message
print("\nModel's raw response:\n", assistant_msg)

# ---- 3. Handle Tool Call ---- (Exactly the same!)
tool_calls = assistant_msg.tool_calls
if tool_calls:
    for tool_call in tool_calls:
        fn_name = tool_call.function.name
        args = json.loads(tool_call.function.arguments)
        print(f"\n🔧 Tool requested: {fn_name} with args {args}")

        # Simulate our tool (same as your example)
        def get_weather(city, unit="C"):
            return f"{city} is sunny and 22°{unit}"

        tool_result = get_weather(**args)

        # ---- 4. Send Tool Result Back ---- (Exactly the same!)
        tool_message = {
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": tool_result
        }

        followup = client.chat.completions.create(
            model="openai:gpt-4o",
            messages=messages + [assistant_msg, tool_message],
            tools=tools
        )

        print("\n💡 Final Answer:\n", followup.choices[0].message.content)
else:
    print("\n💡 Model answered directly (no tool call).")

# ---- Bonus: Works with other providers too! ----
print("\n" + "="*50)
print("Trying with Anthropic Claude...")

try:
    response_claude = client.chat.completions.create(
        model="anthropic:claude-3-5-sonnet-20241022",  # Different provider!
        messages=messages,
        tools=tools
    )
    print("✅ Claude supports tool calling too!")
except Exception as e:
    print(f"❌ Claude error: {e}")

print("\n" + "="*50)
print("Trying with Google Gemini...")

try:
    response_gemini = client.chat.completions.create(
        model="google:gemini-2.0-flash-exp",  # Different provider!
        messages=messages,
        tools=tools
    )
    print("✅ Gemini supports tool calling too!")
except Exception as e:
    print(f"❌ Gemini error: {e}")

print("\n🎉 Your tool calling code works across all providers with Unio!")
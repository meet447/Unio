import os
import json
from datetime import datetime
from openai import OpenAI

client = OpenAI(
    api_key="rk_c5f43e7ec775b73228f1c42b07a8fe152bbbbec93a69713d0b7964c165a53d44",
    base_url="http://127.0.0.1:8000/v1/api"
)


# ---- 1. Define Multiple Tools ----
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather for a given city",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "City name"},
                    "unit": {"type": "string", "enum": ["C", "F"], "description": "Temperature unit"}
                },
                "required": ["city"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_time",
            "description": "Get the current time in a given city",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "City name"}
                },
                "required": ["city"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_flights",
            "description": "Search for flights between two cities",
            "parameters": {
                "type": "object",
                "properties": {
                    "origin": {"type": "string"},
                    "destination": {"type": "string"},
                    "date": {"type": "string", "description": "Date in YYYY-MM-DD format"}
                },
                "required": ["origin", "destination", "date"]
            }
        }
    }
]

# ---- 2. Fake Implementations of Tools ----
def get_weather(city, unit="C"):
    return f"{city} is sunny with 22°{unit}"

def get_time(city):
    now = datetime.now().strftime("%H:%M:%S")
    return f"The time in {city} is currently {now}"

def search_flights(origin, destination, date):
    return [
        {"flight": "AI101", "origin": origin, "destination": destination, "date": date, "price": "$350"},
        {"flight": "BA202", "origin": origin, "destination": destination, "date": date, "price": "$420"}
    ]

tool_map = {
    "get_weather": get_weather,
    "get_time": get_time,
    "search_flights": search_flights
}

# ---- 3. User Request ----
messages = [
    {"role": "user", "content": "I'm in New York planning to visit London tomorrow. What's the weather there, what's the local time now, and can you find me some flights?"}
]

# ---- 4. Send Initial Request to Model ----
response = client.chat.completions.create(
    model="openrouter:x-ai/grok-code-fast-1",
    messages=messages,
    tools=tools
)

assistant_msg = response.choices[0].message
print("\n🤖 Initial model response:")
print(json.dumps(assistant_msg.model_dump(), indent=2))

# ---- 5. Handle Tool Calls Iteratively ----
tool_calls = assistant_msg.tool_calls or []
if tool_calls:
    tool_messages = []

    for call in tool_calls:
        fn_name = call.function.name
        args = json.loads(call.function.arguments)
        print(f"\n🔧 Model requested: {fn_name} with args {args}")

        # Execute the tool
        result = tool_map[fn_name](**args)

        # Convert result to a message the model understands
        tool_messages.append({
            "role": "tool",
            "tool_call_id": call.id,
            "content": json.dumps(result) if not isinstance(result, str) else result
        })

    # ---- 6. Send Results Back to Model ----
    followup = client.chat.completions.create(
        model="openrouter:x-ai/grok-code-fast-1",
        messages=messages + [assistant_msg] + tool_messages,
        tools=tools
    )

    print("\n💡 Final Answer:")
    print(followup.choices[0].message.content)
else:
    print("\n💡 Model answered directly (no tools used).")
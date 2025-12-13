from openai import OpenAI, OpenAIError

client = OpenAI(
    base_url = "http://127.0.0.1:8000/v1",
    api_key = "rk_9cd32cd5efa8612c5115f71c86753b429a9b39e64e57d85f9975c89e66480278"
)

try:
    response = client.chat.completions.create(
        model="openrouter:cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Who are you!"}
        ],
        stream=True,
        extra_headers={
            "X-Fallback-Model": "groq:openai/gpt-oss-120b"
        }
    )
    
    for chunk in response:
        if chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="", flush=True)
except OpenAIError as e:
    print(f"An error occurred: {e}")
from openai import OpenAI

client = OpenAI(
    base_url = "https://api.unio.chipling.xyz/v1",
    api_key = "rk_9cd32cd5efa8612c5115f71c86753b429a9b39e64e57d85f9975c89e66480278"
)

response = client.chat.completions.create(
    model="groq:openai/gpt-oss-120b",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ],
    stream=True
)

for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)

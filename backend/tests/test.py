from openai import APIError, OpenAI

client = OpenAI(
    api_key="rk_c5f43e7ec775b73228f1c42b07a8fe152bbbbec93a69713d0b7964c165a53d44",
    base_url="http://127.0.0.1:8000/v1/api"
)

try:
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": "hey who are you what all can you do?"}],
        model="google:gemini-2.5-flash",
        stream=True,
    )

    for chunk in chat_completion:
        if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="", flush=True)

        elif hasattr(chunk, "usage") and chunk.usage:
            print(f"Tokens: {chunk.usage}")

except APIError as e:
    print(f"API Error: {e}")
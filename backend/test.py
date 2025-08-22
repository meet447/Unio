from openai import APIError, OpenAI, RateLimitError

client = OpenAI(api_key="rk_f112c370d4b0f82940d9a4274e9b0b78e547a904af65e933577b825a7b8f3ebd", base_url="http://localhost:8000")

try:
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": "hey who are you what all can you do?"}],
        model="openrouter:deepseek/deepseek-r1:free",
        stream=True
    )
    for chunk in chat_completion:
        print(chunk.choices[0].delta.content, end="")
        
except APIError as e:
    print(f"Rate limit exceeded ✅: {e}`")

except Exception as e:
    print(f"An error occurred: {e}")

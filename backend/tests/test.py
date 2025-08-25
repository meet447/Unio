from openai import APIError, OpenAI

client = OpenAI(api_key="rk_f112c370d4b0f82940d9a4274e9b0b78e547a904af65e933577b825a7b8f3ebd", base_url="http://localhost:8000/v1/api")

try:
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": "hey who are you what all can you do?"}],
        model="google:gemini-2.5-flash",
        stream=True,
        reasoning_effort='high'
    )
    for chunk in chat_completion:
        print(chunk.choices[0].delta.content)  
    
except APIError as e:
    print(f"Error: {e}`")

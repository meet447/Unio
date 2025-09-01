from openai import OpenAI

unio = OpenAI(
    base_url = "http://127.0.0.1:8000/v1/api",
    api_key = "rk_c5f43e7ec775b73228f1c42b07a8fe152bbbbec93a69713d0b7964c165a53d44"
)
response = unio.chat.completions.create(
    messages=[{"role": "user", "content": "hello world"}],
    model='groq:openai/gpt-oss-20b'
)

print(response.choices[0].message.content)
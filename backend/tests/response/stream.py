from openai import OpenAI

unio = OpenAI(
    base_url = "http://127.0.0.1:8000/v1/api",
    api_key = "rk_c5f43e7ec775b73228f1c42b07a8fe152bbbbec93a69713d0b7964c165a53d44"
)
stream = unio.responses.create(
    input=[{"role": "user", "content": "hello world"}],
    model='groq:openai/gpt-oss-20b',
    stream=True
)

for event in stream:
    event_type = event.type
    if event_type == "response.output_text.delta":
        print(event.delta, end="", flush=True)
    
from openai import OpenAI

client = OpenAI(base_url='https://unio.onrender.com/v1/api', api_key='rk_93ed59b2dcacf73eb6137014f50fcd78ec3935802a8c0039a559224cd8657312')

response = client.chat.completions.create(
    model="google:gemini-2.5-flash",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ]
)

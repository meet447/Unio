import openai
from openai import OpenAI

unio = OpenAI(
    base_url="https://unio.onrender.com/v1/api",
    api_key="rk_f112c370d4b0f82940d9a4274e9b0b78e547a904af65e933577b825a7b8f3ebd"
)

response = unio.responses.create(
    model="gpt-5",
    input="Write a one-sentence bedtime story about a unicorn."
)

print(response.output_text)
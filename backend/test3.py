from openai import OpenAI

client = OpenAI(api_key="rk_f112c370d4b0f82940d9a4274e9b0b78e547a904af65e933577b825a7b8f3ebd", base_url="http://localhost:8000/v1/api")

image = "data:image/png;base64,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"


response = client.chat.completions.create(
    model="openrouter:google/gemini-2.0-flash-lite-001",
    messages=[
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": "What is in this image?",
            },
            {
              "type": "image_url",
              "image_url": {
                "url":  f"{image}"
              },
            },
          ],
        }
      ],
)

print(response.choices[0].message)
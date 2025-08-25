from openai import OpenAI

client = OpenAI(api_key='AIzaSyBK43VRHXieQ3Uq8AFtqEtL99JzQPSmJTw', base_url='https://generativelanguage.googleapis.com/v1beta/openai/')

prompt = """
Write a bash script that takes a matrix represented as a string with 
format '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
"""

response = client.responses.create(
    model="gpt-5",
    reasoning={"effort": "medium"},
    input=[
        {
            "role": "user", 
            "content": prompt
        }
    ]
)

print(response.output_text)
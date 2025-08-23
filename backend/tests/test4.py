from openai import OpenAI
import time

unio =OpenAI(
    base_url="https://unio.onrender.com/v1/api",
    api_key="rk_f112c370d4b0f82940d9a4274e9b0b78e547a904af65e933577b825a7b8f3ebd"
)

messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "whats the best language in the world according to you in programming"}
]

def run_model(name, model_id, messages):
    print(f"\n================= {name} ({model_id}) =================")

    start_time = time.time()
    response_text = ""
    tokens = 0

    response = unio.chat.completions.create(
        model=model_id,
        messages=messages,
        stream=True
    )

    for chunk in response:
        delta = chunk.choices[0].delta.content or ""
        response_text += delta
        print(delta, end="")
        
        # If streaming returns token usage in meta
        if hasattr(chunk, "usage") and chunk.usage:
            tokens = chunk.usage.get("completion_tokens", 0)

    elapsed = time.time() - start_time
    tokens = tokens or len(response_text.split())  # fallback rough estimate
    speed = tokens / elapsed if elapsed > 0 else 0

    print("\n-------------------------------------------------------")
    print(f"Time taken: {elapsed:.2f} sec")
    print(f"Output tokens: {tokens}")
    print(f"Speed: {speed:.2f} tokens/sec")
    print("=======================================================\n")

# Run all providers
run_model("Google", "google:gemini-2.5-flash", messages)
run_model("Google", "google:gemini-2.5-pro", messages)
run_model("Google", "google:gemini-2.5-flash-lite", messages)
run_model("OpenRouter", "openrouter:deepseek/deepseek-r1:free", messages)
run_model("OpenRouter", "openrouter:moonshotai/kimi-k2:free", messages)
run_model("OpenRouter", "openrouter:google/gemma-3n-e2b-it:free", messages)
run_model("Groq", "groq:openai/gpt-oss-20b", messages)
run_model("Groq", "groq:openai/gpt-oss-120b", messages)
run_model("Groq", "groq:meta-llama/llama-4-maverick-17b-128e-instruct", messages)
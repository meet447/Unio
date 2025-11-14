# Unio Responses API Guide

The Unio Responses API provides an OpenAI-compatible interface for generating responses across multiple AI providers. This endpoint supports all the features available in the chat completions API, including tool calling, fallback mechanisms, and comprehensive error handling.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Request Format](#request-format)
- [Response Format](#response-format)
- [Features](#features)
- [Examples](#examples)
- [Supported Providers](#supported-providers)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Overview

The Responses API endpoint (`/v1/api/responses`) allows you to generate responses using any of the supported AI providers with a simple, unified interface. It's designed to be compatible with OpenAI's responses API format while providing additional features like automatic fallback and multi-provider support.

### Key Features

- **Multi-Provider Support**: Works with OpenAI, Anthropic, Google, Groq, Together, and OpenRouter
- **Automatic Fallback**: Seamlessly switch to backup models if primary fails
- **Tool Calling**: Full support for function calling and tool execution
- **Conversation Context**: Support both simple strings and conversation histories
- **Usage Tracking**: Comprehensive token usage and cost tracking
- **Error Handling**: Robust error handling with detailed error messages

## Authentication

All requests require a valid API key in the Authorization header:

```http
Authorization: Bearer your_api_key_here
```

## Request Format

### Basic Request

```json
{
  "model": "openai/gpt-4o-mini",
  "input": "Tell me a fun fact about the moon.",
  "temperature": 0.7
}
```

### Full Request Schema

```json
{
  "model": "string",                    // Required: Provider/model identifier
  "input": "string | Message[]",        // Required: Input text or conversation
  "temperature": 0.7,                   // Optional: Sampling temperature (0-2)
  "reasoning_effort": "medium",         // Optional: For reasoning models
  "fallback_model": "string",           // Optional: Backup model
  "tools": [Tool],                      // Optional: Available tools/functions
  "tool_choice": "auto | none | {...}"  // Optional: Tool usage preference
}
```

### Input Types

#### Simple String Input
```json
{
  "model": "openai/gpt-4o-mini",
  "input": "What is the capital of France?"
}
```

#### Conversation Input
```json
{
  "model": "openai/gpt-4o-mini",
  "input": [
    {"role": "user", "content": "What's the capital of France?"},
    {"role": "assistant", "content": "The capital of France is Paris."},
    {"role": "user", "content": "What's its population?"}
  ]
}
```

## Response Format

### Successful Response

```json
{
  "id": "resp_abc123",
  "object": "response",
  "created": 1699000000,
  "model": "openai/gpt-4o-mini",
  "output_text": "Here's a fun fact about the moon: The Moon is slowly moving away from Earth at a rate of about 3.8 centimeters per year.",
  "key_name": "openai_key_1",
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 32,
    "total_tokens": 47
  },
  "system_fingerprint": "fp_1699000000",
  "tool_calls": null
}
```

### Response with Tool Calls

```json
{
  "id": "resp_def456",
  "object": "response",
  "created": 1699000000,
  "model": "openai/gpt-4o-mini",
  "output_text": "I'll check the weather in San Francisco for you.",
  "key_name": "openai_key_1",
  "usage": {
    "prompt_tokens": 85,
    "completion_tokens": 20,
    "total_tokens": 105
  },
  "tool_calls": [
    {
      "id": "call_abc123",
      "type": "function",
      "function": {
        "name": "get_weather",
        "arguments": "{\"location\": \"San Francisco, CA\"}"
      }
    }
  ]
}
```

## Features

### 1. Multi-Provider Support

The API supports all major AI providers through a unified interface:

```javascript
// OpenAI
const openaiResponse = await client.responses.create({
  model: "openai/gpt-4o-mini",
  input: "Hello world"
});

// Anthropic
const claudeResponse = await client.responses.create({
  model: "anthropic/claude-3-haiku-20240307",
  input: "Hello world"
});

// Google
const geminiResponse = await client.responses.create({
  model: "google/gemini-1.5-flash",
  input: "Hello world"
});
```

### 2. Automatic Fallback

Use the `X-Fallback-Model` header or `fallback_model` parameter to specify a backup model:

```http
POST /v1/api/responses
X-Fallback-Model: anthropic/claude-3-haiku-20240307
```

```json
{
  "model": "openai/gpt-4o-mini",
  "input": "Generate a creative story",
  "fallback_model": "anthropic/claude-3-haiku-20240307"
}
```

### 3. Tool Calling

Define tools and let the AI decide when to use them:

```json
{
  "model": "openai/gpt-4o-mini",
  "input": "What's the weather in San Francisco?",
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get current weather for a location",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City and state, e.g. San Francisco, CA"
            }
          },
          "required": ["location"]
        }
      }
    }
  ],
  "tool_choice": "auto"
}
```

### 4. Reasoning Models

For models that support reasoning (like OpenAI's o1 series):

```json
{
  "model": "openai/o1-mini",
  "input": "Solve this complex math problem step by step",
  "reasoning_effort": "high"
}
```

## Examples

### Python Example

```python
import requests

def create_response(model, input_text, **kwargs):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    payload = {
        "model": model,
        "input": input_text,
        **kwargs
    }
    
    response = requests.post(
        "http://localhost:8000/v1/api/responses",
        json=payload,
        headers=headers
    )
    
    return response.json()

# Basic usage
result = create_response(
    model="openai/gpt-4o-mini",
    input_text="Tell me a joke",
    temperature=0.8
)

print(result["output_text"])
```

### JavaScript/Node.js Example

```javascript
class UnioClient {
    constructor(apiKey, baseURL = "http://localhost:8000/v1/api") {
        this.apiKey = apiKey;
        this.baseURL = baseURL;
    }
    
    async createResponse(params) {
        const response = await fetch(`${this.baseURL}/responses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify(params)
        });
        
        return await response.json();
    }
}

// Usage
const client = new UnioClient(process.env.UNIO_API_KEY);

const response = await client.createResponse({
    model: "openai/gpt-4o-mini",
    input: "Tell me a fun fact about the moon in one sentence."
});

console.log(response.output_text);
```

### cURL Example

```bash
curl -X POST http://localhost:8000/v1/api/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key_here" \
  -d '{
    "model": "openai/gpt-4o-mini",
    "input": "Tell me a fun fact about the moon.",
    "temperature": 0.7
  }'
```

## Supported Providers

| Provider | Model Format | Example |
|----------|-------------|---------|
| OpenAI | `openai/model-name` | `openai/gpt-4o-mini` |
| Anthropic | `anthropic/model-name` | `anthropic/claude-3-haiku-20240307` |
| Google | `google/model-name` | `google/gemini-1.5-flash` |
| Groq | `groq/model-name` | `groq/llama-3.1-8b-instant` |
| Together | `together/model-name` | `together/llama-2-70b-chat` |
| OpenRouter | `openrouter/model-name` | `openrouter/anthropic/claude-3-opus` |

## Error Handling

### Error Response Format

```json
{
  "error": {
    "message": "Invalid API Key",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

### Common Error Codes

- `invalid_api_key`: Invalid or missing API key
- `model_not_found`: Specified model is not available
- `rate_limit_exceeded`: API rate limit exceeded
- `provider_error`: Error from the AI provider
- `server_error`: Internal server error

### Error Handling Best Practices

1. **Always check response status codes**
2. **Implement retry logic for rate limits**
3. **Use fallback models for critical applications**
4. **Log errors for debugging**

```javascript
async function createResponseWithRetry(params, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await client.createResponse(params);
            return response;
        } catch (error) {
            if (error.code === 'rate_limit_exceeded' && i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
                continue;
            }
            throw error;
        }
    }
}
```

## Best Practices

### 1. Model Selection

- Use `gpt-4o-mini` for fast, cost-effective responses
- Use `claude-3-haiku` for balanced performance
- Use `gemini-1.5-flash` for multimodal capabilities
- Use `groq/llama-3.1-8b-instant` for ultra-fast responses

### 2. Fallback Strategy

```json
{
  "model": "openai/gpt-4o-mini",
  "fallback_model": "anthropic/claude-3-haiku-20240307",
  "input": "Your prompt here"
}
```

### 3. Tool Calling

- Define clear, specific tool descriptions
- Use appropriate parameter types and validation
- Handle tool call responses appropriately

### 4. Temperature Settings

- `0.0-0.3`: Factual, deterministic responses
- `0.4-0.7`: Balanced creativity and consistency
- `0.8-1.0`: More creative and varied responses

### 5. Token Optimization

- Monitor usage with the `usage` field in responses
- Use shorter prompts when possible
- Consider model-specific token limits

### 6. Production Considerations

- Implement proper error handling and retries
- Use environment variables for API keys
- Monitor usage and costs
- Set up logging and monitoring
- Use fallback models for critical paths

## Rate Limits and Quotas

Rate limits are managed per API key and provider. The system automatically handles:

- **Key rotation**: Multiple keys for the same provider
- **Rate limit detection**: Automatic switching to backup keys
- **Fallback activation**: Switch to fallback models when needed

## Monitoring and Analytics

All requests are automatically logged with:

- Request and response payloads
- Token usage and costs
- Response times
- Provider and model used
- Error details

Access your analytics through the Unio dashboard to monitor usage patterns and optimize your AI workflows.

---

For more information, visit the [Unio Documentation](https://docs.unio.ai) or check out the [GitHub repository](https://github.com/your-org/unio).
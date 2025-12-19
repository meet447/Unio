# Unio

*One API for ALL LLMs*

Unify your AI providers with intelligent key management, automatic failover, semantic caching, and comprehensive analytics. Bring your own keys, we handle the complexity.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)](https://fastapi.tiangolo.com/)

---

## What is Unio?

Unio is a unified AI gateway that simplifies working with multiple LLM providers through a single, OpenAI-compatible API. Instead of managing separate integrations for OpenAI, Anthropic, Google, Groq, and others, Unio provides one interface with intelligent key rotation, automatic failover, semantic caching, and detailed analytics.

**Key Benefits:**

- **Bring Your Own Keys** - Use your existing API keys across all providers
- **Smart Semantic Caching** - Reduce costs and latency with vector-based response caching
- **Knowledge Vaults (RAG)** - Upload documents and augment responses with your own data
- **Automatic Key Rotation** - Intelligent load balancing and failover
- **Advanced Analytics** - Track usage, costs, and performance across providers with cache insights
- **OpenAI SDK Compatible** - Drop-in replacement for existing OpenAI integrations
- **Smart Fallback System** - Automatic provider switching on failures
- **Key Verification** - Validate credentials instantly upon addition
- **Dynamic Model Catalog** - Real-time discovery of available models from your providers

---

## Projects that use Unio

- [axiom](https://axiom.chipling.xyz/) - an opensource ai search engine like perplexity ai

## Quick Start

### Using the Hosted Version

1. **Sign up** at [unio.chipling.xyz](https://unio.chipling.xyz)
2. **Add your API keys** for your preferred providers
3. **Get your Unio API token**
4. **Start making requests!**

```bash
curl -X POST https://api.unio.chipling.xyz/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_UNIO_TOKEN" \
  -d '{
    "model": "openai:gpt-4o",
    "messages": [
      {"role": "user", "content": "Hello, world!"}
    ]
  }'
```

### Self-Hosting

#### Prerequisites

- Python 3.8+ (for local development) OR Docker (for containerized deployment)
- Node.js 16+ (for frontend)
- Supabase account (for database)

#### Backend Setup

**Option 1: Using Docker (Recommended)**

```bash
# Clone the repository
git clone https://github.com/maoucodes/Unio.git
cd unio

# Configure environment
cd app
cp .env.example .env
# Edit .env with your Supabase credentials

# Build and run with Docker
cd ..
docker-compose up -d

# Or build and run manually
docker build -t unio-backend .
docker run -d -p 8000:8000 --env-file app/.env unio-backend
```

See [docs/DOCKER.md](docs/DOCKER.md) for detailed Docker deployment instructions.

**Option 2: Local Development**

```bash
# Clone the repository
git clone https://github.com/maoucodes/Unio.git
cd unio

# Set up backend
cd app
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Run the server
uvicorn app:app --reload
```

#### Frontend Setup

```bash
# Set up frontend
cd frontend
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Run the development server
npm run dev
```

Visit `http://localhost:5173` to access the dashboard.

---

## Documentation

### Supported Providers

| Provider | Models | Streaming | Function Calling |
|----------|---------|-----------|------------------|
| OpenAI | GPT-4, GPT-4o, GPT-3.5, etc. | Yes | Yes |
| Anthropic | Claude 3.5, Claude 3, etc. | Yes | Yes |
| Google | Gemini Pro, Gemini Flash | Yes | Yes |
| Groq | Llama 3, Mixtral, Gemma, etc. | Yes | No |
| Together | Llama 3, Qwen, etc. | Yes | No |
| OpenRouter | 100+ models | Yes | Yes |

### API Usage

#### Python SDK (OpenAI Compatible)

```python
from openai import OpenAI

# Use Unio as a drop-in replacement
client = OpenAI(
    api_key="your-unio-token",
    base_url="https://api.unio.chipling.xyz/v1"
)

response = client.chat.completions.create(
    model="anthropic:claude-3-5-sonnet-20241022",
    messages=[
        {"role": "user", "content": "Hello from Unio!"}
    ]
)

print(response.choices[0].message.content)
```

#### JavaScript/TypeScript

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'your-unio-token',
  baseURL: 'https://api.unio.chipling.xyz/v1'
});

const response = await client.chat.completions.create({
  model: 'openai:gpt-4o',
  messages: [
    { role: 'user', content: 'Hello from Unio!' }
  ]
});

console.log(response.choices[0].message.content);
```

#### Streaming Responses

```python
stream = client.chat.completions.create(
    model="groq:llama-3.1-70b-versatile",
    messages=[{"role": "user", "content": "Tell me a story"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

#### Smart Semantic Caching

Enable caching to reduce costs and latency for similar queries:

```python
response = client.chat.completions.create(
    model="openai:gpt-4o",
    messages=[{"role": "user", "content": "What is machine learning?"}],
    extra_body={
        "cache_enabled": True,
        "cache_threshold": 0.95  # Similarity threshold (0-1)
    }
)
```

The cache uses vector similarity to match semantically similar prompts, even if worded differently.

#### Knowledge Vaults (RAG)

Augment responses with your own documents:

```python
# First, create a vault and upload documents via the dashboard
# Then reference it in your requests:

response = client.chat.completions.create(
    model="openai:gpt-4o",
    messages=[{"role": "user", "content": "What does our policy say about refunds?"}],
    extra_body={
        "vault_id": "your-vault-uuid"
    }
)
```

#### Fallback Models

Use the `X-Fallback-Model` header for automatic failover:

```python
response = client.chat.completions.create(
    model="openai:gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}],
    extra_headers={
        "X-Fallback-Model": "anthropic:claude-3-5-sonnet-20241022"
    }
)
```

---

## Features

### Smart Semantic Caching (v1.3.0)

- **Vector-based similarity matching** using pgvector
- **Intent understanding** - Matches semantically similar prompts, not just exact duplicates
- **Customizable thresholds** - Control matching sensitivity per request
- **Streaming support** - Cache hits stream back transparently
- **Dashboard visibility** - Cache hit/miss badges and performance metrics in logs

### Knowledge Vaults & RAG (v1.1.0)

- **Document ingestion** - Upload PDFs, text files, and more
- **Vector embeddings** - Automatic chunking and embedding
- **Context augmentation** - Retrieved chunks enhance LLM responses
- **Vault management** - Organize documents by project or use case
- **RAG analytics** - Track retrieved chunks and context usage

### API Key Management

- Secure storage with AES-256 encryption
- Per-provider key organization
- Usage tracking and analytics
- Key health monitoring
- Instant verification on addition

### Intelligent Routing

- Automatic key rotation within providers
- Smart fallback between providers
- Load balancing for high availability
- Rate limit handling

### Analytics Dashboard

- Real-time usage metrics
- Cost tracking across providers
- Performance analytics (TTFT, tokens/sec)
- Request/response logging with cache insights
- Error rate monitoring
- RAG metadata (retrieved chunks, context preview)

### Security & Reliability

- OpenAI SDK compatibility
- Comprehensive error handling
- Structured logging
- Token usage tracking
- Request/response validation

---

## Architecture

Unio follows a modern microservices architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │   FastAPI Backend│    │   Supabase DB   │
│                 │────│                 │────│                 │
│   • Dashboard   │    │   • API Gateway │    │   • Users       │
│   • Analytics   │    │   • Auth        │    │   • API Keys    │
│   • Key Mgmt    │    │   • Providers   │    │   • Logs        │
│   • Vaults      │    │   • Cache       │    │   • Vaults      │
│   • Docs        │    │   • RAG Engine  │    │   • Cache       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   AI Providers  │
                    │                 │
                    │ • OpenAI        │
                    │ • Anthropic     │
                    │ • Google        │
                    │ • Groq          │
                    │ • Together      │
                    │ • OpenRouter    │
                    └─────────────────┘
```

### Tech Stack

**Backend:**

- FastAPI (Python)
- Supabase (PostgreSQL + pgvector)
- Pydantic for validation
- Uvicorn ASGI server

**Frontend:**

- React 18 with TypeScript
- Vite build tool
- Tailwind CSS + shadcn/ui
- React Query for state management
- React Router for navigation

**Infrastructure:**

- Supabase for authentication & database
- Server-Sent Events for streaming
- RESTful API design
- Vector search (pgvector) for semantic caching

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

### Development Setup

1. **Fork the repository**
2. **Clone your fork**

   ```bash
   git clone https://github.com/your-username/unio.git
   cd unio
   ```

3. **Set up the development environment**

   ```bash
   # Backend
   cd app
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your Supabase credentials
   
   # Frontend
   cd ../frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

5. **Make your changes and test**
6. **Submit a pull request**

### Running Tests

```bash
# Backend tests
cd app
python -m pytest tests/

# Frontend tests (when available)
cd frontend
npm test
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Community & Support

- **Email**: <meet.sonawane2015@gmail.com>
- **GitHub Issues**: [Report bugs or request features](https://github.com/maoucodes/Unio/issues)
- **Documentation**: [Full API Documentation](https://unio.chipling.xyz/docs)

---

## Roadmap

- [x] **Semantic Caching** - Intelligent vector-based response caching ✅ (v1.3.0)
- [x] **Knowledge Vaults (RAG)** - Document-based context augmentation ✅ (v1.1.0)
- [ ] **Custom Models** - Support for self-hosted models
- [ ] **Rate Limiting** - Per-user and per-key limits
- [ ] **Webhook Support** - Real-time notifications
- [ ] **Team Management** - Collaborative key management
- [ ] **Cost Optimization** - Automatic cost-based routing
- [ ] **More Providers** - Additional LLM providers

---

<div align="center">
  <p><strong>Made with love by the Unio team</strong></p>
  <p>Star us on GitHub if you find Unio useful!</p>
</div>

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Copy, 
  Code, 
  Play,
  ExternalLink,
  CheckCircle,
  BookOpen,
  Zap,
  Shield,
  Globe,
  AlertTriangle,
  Settings,
  Layers,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Documentation = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const baseUrl = "https://unio.onrender.com/v1/api";

  const providers = [
    { 
      name: "Google", 
      model: "google:gemini-2.0-flash-exp", 
      description: "Google's latest Gemini model",
      streaming: true,
      functionCalling: true,
      multimodal: true
    },
    { 
      name: "Anthropic", 
      model: "anthropic:claude-3-5-sonnet-20241022", 
      description: "Anthropic's Claude 3.5 Sonnet",
      streaming: true,
      functionCalling: true,
      multimodal: true
    },
    { 
      name: "OpenRouter", 
      model: "openrouter:meta-llama/llama-3.2-3b-instruct", 
      description: "Meta's Llama via OpenRouter",
      streaming: true,
      functionCalling: true,
      multimodal: false
    },
    { 
      name: "Together", 
      model: "together:meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", 
      description: "Llama via Together AI",
      streaming: true,
      functionCalling: false,
      multimodal: false
    },
    { 
      name: "OpenAI", 
      model: "openai:gpt-4o", 
      description: "OpenAI's GPT-4 Omni",
      streaming: true,
      functionCalling: true,
      multimodal: true
    },
    { 
      name: "Groq", 
      model: "groq:llama-3.1-70b-versatile", 
      description: "Llama on Groq's fast inference",
      streaming: true,
      functionCalling: false,
      multimodal: false
    }
  ];

  const pythonInstallCode = `pip install openai`;

  const jsInstallCode = `npm install openai
# or
yarn add openai`;

  const pythonBasicCode = `from openai import OpenAI

# Initialize the client with Unio base URL
client = OpenAI(
    api_key="your-unio-api-key",  # Get this from your Unio dashboard
    base_url="${baseUrl}"
)

# Example: Chat completion with Google Gemini
try:
    response = client.chat.completions.create(
        model="google:gemini-2.0-flash-exp",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Explain quantum computing in simple terms"}
        ],
        max_tokens=1000,
        temperature=0.7
    )
    
    print(response.choices[0].message.content)
    print(f"Tokens used: {response.usage.total_tokens}")
    
except Exception as e:
    print(f"Error: {e}")`;

  const pythonStreamingCode = `# Streaming example with token counting
try:
    stream = client.chat.completions.create(
        model="anthropic:claude-3-5-sonnet-20241022",
        messages=[
            {"role": "user", "content": "Write a short story about AI"}
        ],
        stream=True
    )
    
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="")
            
except Exception as e:
    print(f"Error: {e}")`;

  const pythonFallbackCode = `# Using fallback models for reliability
try:
    response = client.chat.completions.create(
        model="openai:gpt-4o",  # Primary model
        messages=[
            {"role": "user", "content": "Hello, world!"}
        ],
        extra_headers={
            "X-Fallback-Model": "anthropic:claude-3-5-sonnet-20241022"  # Fallback model
        }
    )
    
    print(response.choices[0].message.content)
    
except Exception as e:
    print(f"Error: {e}")`;

  const pythonMultimodalCode = `# Multimodal example with image input
try:
    response = client.chat.completions.create(
        model="openai:gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this image?"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://example.com/image.jpg"
                        }
                    }
                ]
            }
        ]
    )
    
    print(response.choices[0].message.content)
    
except Exception as e:
    print(f"Error: {e}")`;

  const jsBasicCode = `import OpenAI from 'openai';

// Initialize the client with Unio base URL
const client = new OpenAI({
  apiKey: 'your-unio-api-key', // Get this from your Unio dashboard
  baseURL: '${baseUrl}',
});

// Example: Chat completion with Anthropic Claude
async function chatCompletion() {
  try {
    const response = await client.chat.completions.create({
      model: 'anthropic:claude-3-5-sonnet-20241022',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Explain machine learning in simple terms' }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    console.log(response.choices[0].message.content);
    console.log(\`Tokens used: \${response.usage.total_tokens}\`);
  } catch (error) {
    console.error('Error:', error);
  }
}

chatCompletion();`;

  const jsStreamingCode = `// Streaming example
async function streamingChat() {
  try {
    const stream = await client.chat.completions.create({
      model: 'openrouter:meta-llama/llama-3.2-3b-instruct',
      messages: [
        { role: 'user', content: 'Write a haiku about programming' }
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        process.stdout.write(content);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

streamingChat();`;

  const jsFallbackCode = `// Using fallback models for reliability
async function reliableChat() {
  try {
    const response = await client.chat.completions.create({
      model: 'groq:llama-3.1-70b-versatile', // Primary model
      messages: [
        { role: 'user', content: 'Hello, world!' }
      ]
    }, {
      headers: {
        'X-Fallback-Model': 'together:meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'
      }
    });

    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

reliableChat();`;

  const curlBasicCode = `curl -X POST "${baseUrl}/chat/completions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-unio-api-key" \\
  -d '{
    "model": "google:gemini-2.0-flash-exp",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user", 
        "content": "Hello, how are you?"
      }
    ],
    "max_tokens": 1000,
    "temperature": 0.7
  }'`;

  const curlStreamingCode = `curl -X POST "${baseUrl}/chat/completions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-unio-api-key" \\
  -d '{
    "model": "anthropic:claude-3-5-sonnet-20241022",
    "messages": [
      {
        "role": "user",
        "content": "Tell me a joke"
      }
    ],
    "stream": true
  }' --no-buffer`;

  const curlFallbackCode = `curl -X POST "${baseUrl}/chat/completions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-unio-api-key" \\
  -H "X-Fallback-Model: anthropic:claude-3-5-sonnet-20241022" \\
  -d '{
    "model": "openai:gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "Hello, world!"
      }
    ]
  }'`;

  const responseExample = `{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1677858242,
  "model": "google:gemini-2.0-flash-exp",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! I'm doing well, thank you for asking..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 25,
    "total_tokens": 40
  },
  "key_name": "Google Production Key"
}`;

  const streamingResponseExample = `data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1677858242,"model":"anthropic:claude-3-5-sonnet-20241022","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}],"key_name":"Anthropic Production Key"}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1677858242,"model":"anthropic:claude-3-5-sonnet-20241022","choices":[{"index":0,"delta":{"content":"!"},"finish_reason":null}],"key_name":"Anthropic Production Key"}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1677858242,"model":"anthropic:claude-3-5-sonnet-20241022","choices":[{"index":0,"delta":{"content":""},"finish_reason":"stop"}],"usage":{"prompt_tokens":10,"completion_tokens":15,"total_tokens":25},"key_name":"Anthropic Production Key"}

data: [DONE]`;

  const errorResponseExample = `{
  "error": {
    "message": "Rate limit exceeded",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}`;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Developer Documentation
          </div>
          <h1 className="text-4xl sm:text-5xl font-medium text-black dark:text-white mb-4">
            Unio API Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-light max-w-3xl mx-auto">
            Complete developer guide for the Unio API. Unified access to multiple AI providers 
            with intelligent routing, automatic failover, and comprehensive analytics.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-black dark:text-white text-base">OpenAI Compatible</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                Drop-in replacement for OpenAI API. Use existing SDKs.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-black dark:text-white text-base">Multiple Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                Access 6+ providers through one unified interface.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-2">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-black dark:text-white text-base">Smart Fallbacks</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                Automatic failover between providers for reliability.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-2">
                <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-black dark:text-white text-base">Real-time Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                Track usage, costs, and performance across providers.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start */}
        <div className="mb-16">
          <h2 className="text-3xl font-medium text-black dark:text-white mb-8">Quick Start</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-medium text-sm">1</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-black dark:text-white mb-2">Get Your API Key</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Sign up and get your Unio API key from the dashboard. This key works with all supported providers.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Get API Key
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-medium text-sm">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-black dark:text-white mb-2">Install SDK</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Install the official OpenAI SDK for your language. No special SDK needed!
                </p>
                
                <Tabs defaultValue="python" className="w-full">
                  <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  </TabsList>
                  <TabsContent value="python" className="mt-4">
                    <div className="relative bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => copyToClipboard(pythonInstallCode, 'python-install')}
                      >
                        {copiedCode === 'python-install' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <pre className="text-gray-300">{pythonInstallCode}</pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="javascript" className="mt-4">
                    <div className="relative bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => copyToClipboard(jsInstallCode, 'js-install')}
                      >
                        {copiedCode === 'js-install' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <pre className="text-gray-300">{jsInstallCode}</pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-medium text-sm">3</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-black dark:text-white mb-2">Make Your First Request</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Use the OpenAI SDK with Unio's base URL and start accessing multiple AI providers!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* API Reference */}
        <div className="mb-16">
          <h2 className="text-3xl font-medium text-black dark:text-white mb-8">API Reference</h2>
          
          <div className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Base Configuration
                </CardTitle>
                <CardDescription>
                  Core API configuration and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-black dark:text-white mb-2">Base URL</h4>
                  <code className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded font-mono">
                    {baseUrl}
                  </code>
                </div>
                
                <div>
                  <h4 className="font-medium text-black dark:text-white mb-2">Authentication</h4>
                  <code className="text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded font-mono">
                    Authorization: Bearer your-unio-api-key
                  </code>
                </div>
                
                <div>
                  <h4 className="font-medium text-black dark:text-white mb-2">Content Type</h4>
                  <code className="text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded font-mono">
                    Content-Type: application/json
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Endpoint: POST /chat/completions
                </CardTitle>
                <CardDescription>
                  Main endpoint for chat completions with streaming support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-black dark:text-white mb-2">Request Parameters</h4>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-2 text-black dark:text-white">Parameter</th>
                            <th className="text-left py-2 text-black dark:text-white">Type</th>
                            <th className="text-left py-2 text-black dark:text-white">Required</th>
                            <th className="text-left py-2 text-black dark:text-white">Description</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600 dark:text-gray-400">
                          <tr className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-2 font-mono text-blue-600 dark:text-blue-400">model</td>
                            <td className="py-2">string</td>
                            <td className="py-2">✓</td>
                            <td className="py-2">Provider-prefixed model (e.g., "openai:gpt-4o")</td>
                          </tr>
                          <tr className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-2 font-mono text-blue-600 dark:text-blue-400">messages</td>
                            <td className="py-2">array</td>
                            <td className="py-2">✓</td>
                            <td className="py-2">Array of message objects</td>
                          </tr>
                          <tr className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-2 font-mono text-blue-600 dark:text-blue-400">temperature</td>
                            <td className="py-2">number</td>
                            <td className="py-2">-</td>
                            <td className="py-2">Sampling temperature (0-1, default: 0.7)</td>
                          </tr>
                          <tr className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-2 font-mono text-blue-600 dark:text-blue-400">stream</td>
                            <td className="py-2">boolean</td>
                            <td className="py-2">-</td>
                            <td className="py-2">Enable streaming responses (default: false)</td>
                          </tr>
                          <tr className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-2 font-mono text-blue-600 dark:text-blue-400">max_tokens</td>
                            <td className="py-2">number</td>
                            <td className="py-2">-</td>
                            <td className="py-2">Maximum tokens to generate</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-blue-600 dark:text-blue-400">reasoning_effort</td>
                            <td className="py-2">string</td>
                            <td className="py-2">-</td>
                            <td className="py-2">Reasoning effort level (low/medium/high)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-black dark:text-white mb-2">Headers</h4>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-2 text-black dark:text-white">Header</th>
                            <th className="text-left py-2 text-black dark:text-white">Required</th>
                            <th className="text-left py-2 text-black dark:text-white">Description</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600 dark:text-gray-400">
                          <tr className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-2 font-mono text-blue-600 dark:text-blue-400">Authorization</td>
                            <td className="py-2">✓</td>
                            <td className="py-2">Bearer token with your Unio API key</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-blue-600 dark:text-blue-400">X-Fallback-Model</td>
                            <td className="py-2">-</td>
                            <td className="py-2">Fallback model for automatic failover</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Supported Models */}
        <div className="mb-16">
          <h2 className="text-3xl font-medium text-black dark:text-white mb-8">Supported Models</h2>
          <div className="grid lg:grid-cols-2 gap-4">
            {providers.map((provider, index) => (
              <Card key={index} className="border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-black dark:text-white">{provider.name}</CardTitle>
                    <div className="flex gap-2">
                      {provider.streaming && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded">Streaming</span>
                      )}
                      {provider.functionCalling && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">Functions</span>
                      )}
                      {provider.multimodal && (
                        <span className="text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-1 rounded">Vision</span>
                      )}
                    </div>
                  </div>
                  <code className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                    {provider.model}
                  </code>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {provider.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Code Examples */}
        <div className="mb-16">
          <h2 className="text-3xl font-medium text-black dark:text-white mb-8">Code Examples</h2>
          
          <Tabs defaultValue="python" className="w-full">
            <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="curl">cURL</TabsTrigger>
            </TabsList>
            
            {/* Python Examples */}
            <TabsContent value="python" className="space-y-6">
              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Basic Chat Completion
                  </CardTitle>
                  <CardDescription>
                    Simple example using Google's Gemini model with token tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
                      onClick={() => copyToClipboard(pythonBasicCode, 'python-basic')}
                    >
                      {copiedCode === 'python-basic' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <pre className="text-gray-300 whitespace-pre-wrap">{pythonBasicCode}</pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Streaming Response
                  </CardTitle>
                  <CardDescription>
                    Stream responses in real-time using Anthropic's Claude
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
                      onClick={() => copyToClipboard(pythonStreamingCode, 'python-streaming')}
                    >
                      {copiedCode === 'python-streaming' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <pre className="text-gray-300 whitespace-pre-wrap">{pythonStreamingCode}</pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Automatic Fallbacks
                  </CardTitle>
                  <CardDescription>
                    Use fallback models for improved reliability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
                      onClick={() => copyToClipboard(pythonFallbackCode, 'python-fallback')}
                    >
                      {copiedCode === 'python-fallback' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <pre className="text-gray-300 whitespace-pre-wrap">{pythonFallbackCode}</pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    Multimodal (Vision)
                  </CardTitle>
                  <CardDescription>
                    Send images along with text to vision-capable models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
                      onClick={() => copyToClipboard(pythonMultimodalCode, 'python-multimodal')}
                    >
                      {copiedCode === 'python-multimodal' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <pre className="text-gray-300 whitespace-pre-wrap">{pythonMultimodalCode}</pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* JavaScript Examples */}
            <TabsContent value="javascript" className="space-y-6">
              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Basic Chat Completion
                  </CardTitle>
                  <CardDescription>
                    Simple example using Anthropic's Claude model with token tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
                      onClick={() => copyToClipboard(jsBasicCode, 'js-basic')}
                    >
                      {copiedCode === 'js-basic' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <pre className="text-gray-300 whitespace-pre-wrap">{jsBasicCode}</pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Streaming Response
                  </CardTitle>
                  <CardDescription>
                    Stream responses in real-time using OpenRouter's Llama model
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
                      onClick={() => copyToClipboard(jsStreamingCode, 'js-streaming')}
                    >
                      {copiedCode === 'js-streaming' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <pre className="text-gray-300 whitespace-pre-wrap">{jsStreamingCode}</pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Automatic Fallbacks
                  </CardTitle>
                  <CardDescription>
                    Use fallback models for improved reliability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
                      onClick={() => copyToClipboard(jsFallbackCode, 'js-fallback')}
                    >
                      {copiedCode === 'js-fallback' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <pre className="text-gray-300 whitespace-pre-wrap">{jsFallbackCode}</pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* cURL Examples */}
            <TabsContent value="curl" className="space-y-6">
              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Basic HTTP Request
                  </CardTitle>
                  <CardDescription>
                    Direct HTTP API call using cURL
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
                      onClick={() => copyToClipboard(curlBasicCode, 'curl-basic')}
                    >
                      {copiedCode === 'curl-basic' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <pre className="text-gray-300 whitespace-pre-wrap">{curlBasicCode}</pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Streaming Request
                  </CardTitle>
                  <CardDescription>
                    Enable streaming with Server-Sent Events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
                      onClick={() => copyToClipboard(curlStreamingCode, 'curl-streaming')}
                    >
                      {copiedCode === 'curl-streaming' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <pre className="text-gray-300 whitespace-pre-wrap">{curlStreamingCode}</pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Fallback Model Header
                  </CardTitle>
                  <CardDescription>
                    Use X-Fallback-Model header for automatic failover
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
                      onClick={() => copyToClipboard(curlFallbackCode, 'curl-fallback')}
                    >
                      {copiedCode === 'curl-fallback' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <pre className="text-gray-300 whitespace-pre-wrap">{curlFallbackCode}</pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Response Formats */}
        <div className="mb-16">
          <h2 className="text-3xl font-medium text-black dark:text-white mb-8">Response Formats</h2>
          
          <div className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Standard Response
                </CardTitle>
                <CardDescription>
                  Non-streaming chat completion response format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
                    onClick={() => copyToClipboard(responseExample, 'response-example')}
                  >
                    {copiedCode === 'response-example' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <pre className="text-gray-300 whitespace-pre-wrap">{responseExample}</pre>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Streaming Response
                </CardTitle>
                <CardDescription>
                  Server-Sent Events format for real-time streaming
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
                    onClick={() => copyToClipboard(streamingResponseExample, 'streaming-response')}
                  >
                    {copiedCode === 'streaming-response' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <pre className="text-gray-300 whitespace-pre-wrap">{streamingResponseExample}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Error Handling */}
        <div className="mb-16">
          <h2 className="text-3xl font-medium text-black dark:text-white mb-8">Error Handling</h2>
          
          <div className="space-y-6">
            <Alert className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <AlertDescription className="text-orange-800 dark:text-orange-300">
                All error responses follow a consistent format with structured error objects containing message, type, and code fields.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white text-lg">HTTP Status Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-mono rounded">200</span>
                      <span className="text-gray-600 dark:text-gray-400">Success - Request completed</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-mono rounded">400</span>
                      <span className="text-gray-600 dark:text-gray-400">Bad Request - Invalid parameters</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-mono rounded">401</span>
                      <span className="text-gray-600 dark:text-gray-400">Unauthorized - Invalid API key</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm font-mono rounded">429</span>
                      <span className="text-gray-600 dark:text-gray-400">Rate Limited - Too many requests</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-mono rounded">500</span>
                      <span className="text-gray-600 dark:text-gray-400">Server Error - Internal error</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white text-lg">Error Response Format</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
                      onClick={() => copyToClipboard(errorResponseExample, 'error-response')}
                    >
                      {copiedCode === 'error-response' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <pre className="text-gray-300">{errorResponseExample}</pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Common Error Types</CardTitle>
                <CardDescription>
                  Understanding different error scenarios and how to handle them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-medium text-black dark:text-white">invalid_request_error</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Invalid parameters in request (missing model, malformed messages, etc.)
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-medium text-black dark:text-white">authentication_error</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Invalid or missing API key in Authorization header
                    </p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-medium text-black dark:text-white">rate_limit_error</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Request rate limits exceeded, automatic fallback may be triggered
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-medium text-black dark:text-white">provider_error</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Upstream provider API errors, fallback models may be used
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-medium text-black dark:text-white">server_error</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Internal server errors, retry with exponential backoff recommended
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-medium text-black dark:text-white mb-8">Advanced Features</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Automatic Fallbacks
                </CardTitle>
                <CardDescription>
                  Improve reliability with intelligent model fallbacks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">X-Fallback-Model</code> header 
                  to specify a backup model that will be used automatically if the primary model fails.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Two-layer resilience:</strong> First attempts key rotation within the same provider, 
                    then switches to fallback model if all primary keys are exhausted.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Token Usage Tracking
                </CardTitle>
                <CardDescription>
                  Monitor token consumption and costs across providers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All responses include detailed token usage information with prompt, completion, and total token counts.
                </p>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    <strong>Real-time analytics:</strong> Track usage patterns, costs, and performance 
                    metrics in your dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Multimodal Support
                </CardTitle>
                <CardDescription>
                  Send images, text, and other content types
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Vision-capable models (OpenAI GPT-4V, Google Gemini, Anthropic Claude) support image inputs 
                  alongside text for multimodal conversations.
                </p>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="text-sm text-purple-800 dark:text-purple-300">
                    <strong>Structured content:</strong> Use content arrays with type-specific objects 
                    for rich multimedia interactions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Key Management
                </CardTitle>
                <CardDescription>
                  Intelligent routing and load balancing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unio automatically manages your API keys with intelligent routing, load balancing, 
                  and health monitoring across all providers.
                </p>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <p className="text-sm text-orange-800 dark:text-orange-300">
                    <strong>Zero downtime:</strong> Automatic key rotation and health checks 
                    ensure maximum uptime for your applications.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Model Format Guide */}
        <div className="mb-16">
          <h2 className="text-3xl font-medium text-black dark:text-white mb-8">Model Format Guide</h2>
          
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">Provider-Prefixed Model Names</CardTitle>
              <CardDescription>
                All models use the format: provider:model-name
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-black dark:text-white">Popular Models</h4>
                  <div className="space-y-2">
                    <code className="block text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded">
                      openai:gpt-4o
                    </code>
                    <code className="block text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded">
                      anthropic:claude-3-5-sonnet-20241022
                    </code>
                    <code className="block text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded">
                      google:gemini-2.0-flash-exp
                    </code>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-black dark:text-white">Open Source Models</h4>
                  <div className="space-y-2">
                    <code className="block text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded">
                      groq:llama-3.1-70b-versatile
                    </code>
                    <code className="block text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded">
                      together:meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo
                    </code>
                    <code className="block text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded">
                      openrouter:meta-llama/llama-3.2-3b-instruct
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support */}
        <div className="text-center p-8 border border-gray-200 dark:border-gray-800 rounded-2xl">
          <h2 className="text-2xl font-medium text-black dark:text-white mb-4">Need Help?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Our comprehensive documentation covers most use cases, but if you need additional help, 
            our support team is here to assist you with integration and troubleshooting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-gray-300 dark:border-gray-700" asChild>
              <Link to="/help">
                <BookOpen className="w-4 h-4 mr-2" />
                Help Center
              </Link>
            </Button>
            <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200" asChild>
              <Link to="/dashboard">
                <ExternalLink className="w-4 h-4 mr-2" />
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
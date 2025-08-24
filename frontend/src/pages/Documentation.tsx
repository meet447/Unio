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
  Globe
} from "lucide-react";
import { toast } from "sonner";

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
    { name: "Google", model: "google:gemini-2.0-flash-exp", description: "Google's latest Gemini model" },
    { name: "Anthropic", model: "anthropic:claude-3-5-sonnet-20241022", description: "Anthropic's Claude 3.5 Sonnet" },
    { name: "OpenRouter", model: "openrouter:meta-llama/llama-3.2-3b-instruct", description: "Meta's Llama via OpenRouter" },
    { name: "Together", model: "together:meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", description: "Llama via Together AI" },
    { name: "OpenAI", model: "openai:gpt-4o", description: "OpenAI's GPT-4 Omni" },
    { name: "Groq", model: "groq:llama-3.1-70b-versatile", description: "Llama on Groq's fast inference" }
  ];

  const pythonInstallCode = `pip install openai`;

  const jsInstallCode = `npm install openai
# or
yarn add openai`;

  const pythonExampleCode = `from openai import OpenAI

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
    
except Exception as e:
    print(f"Error: {e}")`;

  const pythonStreamingCode = `# Streaming example
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

  const jsExampleCode = `import OpenAI from 'openai';

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

  const curlExample = `curl -X POST "${baseUrl}/chat/completions" \\
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

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            API Documentation
          </div>
          <h1 className="text-4xl sm:text-5xl font-medium text-black dark:text-white mb-4">
            Unio API Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-light max-w-3xl mx-auto">
            Unified access to multiple AI providers through a single OpenAI-compatible API. 
            Use your existing code with any supported model provider.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-black dark:text-white">OpenAI Compatible</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Drop-in replacement for OpenAI API. Use your existing code with any provider.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-black dark:text-white">Multiple Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access Google, Anthropic, OpenRouter, Together, and more through one API.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-2">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-black dark:text-white">Secure & Reliable</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Enterprise-grade security with automatic failover and rate limiting.
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

        {/* Supported Models */}
        <div className="mb-16">
          <h2 className="text-3xl font-medium text-black dark:text-white mb-8">Supported Models</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((provider, index) => (
              <Card key={index} className="border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-black dark:text-white">{provider.name}</CardTitle>
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
                    Simple example using Google's Gemini model
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
                      onClick={() => copyToClipboard(pythonExampleCode, 'python-basic')}
                    >
                      {copiedCode === 'python-basic' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <pre className="text-gray-300 whitespace-pre-wrap">{pythonExampleCode}</pre>
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
                    Simple example using Anthropic's Claude model
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 dark:bg-gray-950 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
                      onClick={() => copyToClipboard(jsExampleCode, 'js-basic')}
                    >
                      {copiedCode === 'js-basic' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <pre className="text-gray-300 whitespace-pre-wrap">{jsExampleCode}</pre>
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
            </TabsContent>

            {/* cURL Examples */}
            <TabsContent value="curl">
              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    HTTP Request
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
                      onClick={() => copyToClipboard(curlExample, 'curl-basic')}
                    >
                      {copiedCode === 'curl-basic' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <pre className="text-gray-300 whitespace-pre-wrap">{curlExample}</pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* API Reference */}
        <div className="mb-16">
          <h2 className="text-3xl font-medium text-black dark:text-white mb-8">API Reference</h2>
          
          <div className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Base URL</CardTitle>
                <CardDescription>
                  All API requests should be made to this base URL
                </CardDescription>
              </CardHeader>
              <CardContent>
                <code className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded font-mono">
                  {baseUrl}
                </code>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Authentication</CardTitle>
                <CardDescription>
                  Include your API key in the Authorization header
                </CardDescription>
              </CardHeader>
              <CardContent>
                <code className="text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded font-mono">
                  Authorization: Bearer your-unio-api-key
                </code>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Model Format</CardTitle>
                <CardDescription>
                  Specify models using the provider:model-name format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <code className="block text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded font-mono">
                    google:gemini-2.0-flash-exp
                  </code>
                  <code className="block text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded font-mono">
                    anthropic:claude-3-5-sonnet-20241022
                  </code>
                  <code className="block text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded font-mono">
                    openrouter:meta-llama/llama-3.2-3b-instruct
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support */}
        <div className="text-center p-8 border border-gray-200 dark:border-gray-800 rounded-2xl">
          <h2 className="text-2xl font-medium text-black dark:text-white mb-4">Need Help?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Our documentation covers the most common use cases, but if you need additional help, 
            our support team is here to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-gray-300 dark:border-gray-700" asChild>
              <Link to="/help">
                <BookOpen className="w-4 h-4 mr-2" />
                View Help Center
              </Link>
            </Button>
            <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200" asChild>
              <Link to="/help">
                <ExternalLink className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
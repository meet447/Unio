import { useState } from "react";
import { Check, Clipboard, BookOpen, Key, Cuboid, Database, Activity, Zap, Tag } from "lucide-react";
import { Button } from "@/components/kibo-ui/button";
import Footer from "@/components/layout/Footer";
import Navigation from "@/components/layout/Navigation";

const sections = [
    { id: "intro", title: "Introduction", icon: <BookOpen className="w-5 h-5 text-blue-400" /> },
    { id: "auth", title: "API Keys & Providers", icon: <Key className="w-5 h-5 text-yellow-400" /> },
    { id: "models", title: "Models", icon: <Cuboid className="w-5 h-5 text-purple-400" /> },
    { id: "chat", title: "Chat Completions", icon: <Activity className="w-5 h-5 text-pink-400" /> },
    { id: "fallback", title: "Fallback Models", icon: <Zap className="w-5 h-5 text-orange-400" /> },
    { id: "vaults", title: "Knowledge Vaults", icon: <Database className="w-5 h-5 text-green-400" /> },
    { id: "logs", title: "Logs & Analytics", icon: <Activity className="w-5 h-5 text-red-400" /> },
    { id: "changelog", title: "Changelog", icon: <Tag className="w-5 h-5 text-blue-400" />, isExternal: true },
];

const CodeBlock = ({ code }: { code: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-4 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed text-[#d7d7d7]">
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#151515] hover:bg-[#202020]"
                onClick={handleCopy}
            >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4 text-gray-400" />}
            </Button>
            {code}
        </div>
    );
};

export default function Docs() {
    const [activeSection, setActiveSection] = useState("intro");

    return (
        <div className="min-h-screen bg-black">
            <Navigation />
            <div className="flex flex-col lg:flex-row pt-16 text-white min-h-screen">
                {/* Sidebar for Docs */}
                <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-[#1b1b1b] bg-[#0a0a0a]/30 p-4 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
                    <div className="mb-6 px-2">
                        <h1 className="text-xl font-bold tracking-tight mb-1">Documentation</h1>
                        <p className="text-sm text-[#6f6f6f] mb-4">Guides & API Reference</p>
                        <a href="/dashboard" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            ← Back to Dashboard
                        </a>
                    </div>
                    <nav className="space-y-1">
                        {sections.map(section => {
                            if ((section as any).isExternal) {
                                return (
                                    <a
                                        key={section.id}
                                        href={`/${section.id}`}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-[#9d9d9d] hover:bg-[#0f0f0f] hover:text-white"
                                    >
                                        {section.icon}
                                        {section.title}
                                    </a>
                                );
                            }
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === section.id
                                        ? "bg-[#151515] text-white"
                                        : "text-[#9d9d9d] hover:bg-[#0f0f0f] hover:text-white"
                                        }`}
                                >
                                    {section.icon}
                                    {section.title}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-12 max-w-4xl mx-auto space-y-12">
                    {activeSection === "intro" && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-3xl font-bold">Introduction</h2>
                            <p className="text-[#9d9d9d] leading-7">
                                Welcome to the Unio Documentation. Unio is a unified gateway for accessing various LLM providers through a single, consistent API.
                                Use this dashboard to manage your API keys, monitor usage, and leverage advanced features like Retrieval Augmented Generation (RAG).
                            </p>
                            <div className="bg-[#151515] p-6 rounded-xl border border-[#2a2a2a] mt-6">
                                <h3 className="font-semibold text-lg mb-2">Base URL</h3>
                                <p className="text-[#9d9d9d] text-sm mb-4">All API requests should be sent to:</p>
                                <CodeBlock code="https://api.unio.chipling.xyz/v1" />
                            </div>
                        </div>
                    )}

                    {activeSection === "auth" && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-3xl font-bold">API Keys & Providers</h2>
                            <p className="text-[#9d9d9d] leading-7">
                                To start using Unio, you need to configure your upstream providers (like OpenAI, Groq, Anthropic) in the <strong>API Keys</strong> section.
                            </p>
                            <ol className="list-decimal list-inside space-y-2 text-[#b0b0b0]">
                                <li>Go to the <strong className="text-white">API Keys</strong> page.</li>
                                <li>Click <strong className="text-white">Add New Key</strong>.</li>
                                <li>Select a provider (e.g., OpenAI) and paste your API key.</li>
                                <li>Give it a friendly name (e.g., "My Personal OpenAI Key").</li>
                            </ol>
                            <p className="text-[#9d9d9d] mt-4">
                                Unio will automatically route your requests to the correct provider based on the model you specify in your API call.
                            </p>
                        </div>
                    )}

                    {activeSection === "models" && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-3xl font-bold">Models</h2>
                            <p className="text-[#9d9d9d] leading-7">
                                The <strong>Models</strong> page lists all available models from your configured providers. It automatically synchronizes with the upstream APIs.
                            </p>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">Listing Models via API</h3>
                                <CodeBlock code={`import { OpenAI } from "openai";

const client = new OpenAI({
  baseURL: "https://api.unio.chipling.xyz/v1",
  apiKey: "YOUR_UNIO_KEY" 
});

const models = await client.models.list();
console.log(models);`} />
                            </div>
                        </div>
                    )}

                    {activeSection === "chat" && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-3xl font-bold">Chat Completions</h2>
                            <p className="text-[#9d9d9d] leading-7">
                                Unio supports the standard OpenAI Chat Completions schema. You can toggle between streaming and non-streaming responses using the <code>stream</code> parameter.
                            </p>

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">Non-Streaming Response</h3>
                                <p className="text-[#9d9d9d] text-sm">Returns the full response once generated.</p>
                                <CodeBlock code={`const response = await client.chat.completions.create({
  model: "openai:gpt-4o",
  messages: [{ role: "user", content: "Say hello!" }],
  stream: false
});
console.log(response.choices[0].message.content);`} />
                            </div>

                            <div className="space-y-4 mt-8">
                                <h3 className="text-xl font-semibold">Streaming Response</h3>
                                <p className="text-[#9d9d9d] text-sm">Streams the response in chunks as it's being generated.</p>
                                <CodeBlock code={`const stream = await client.chat.completions.create({
  model: "openai:gpt-4o",
  messages: [{ role: "user", content: "Write a long story..." }],
  stream: true
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}`} />
                            </div>
                        </div>
                    )}

                    {activeSection === "fallback" && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-3xl font-bold">Fallback Models</h2>
                            <p className="text-[#9d9d9d] leading-7">
                                Unio provides built-in reliability with fallback models. If the primary model fails (due to rate limits or provider downtime), Unio can automatically retry the request using a secondary model.
                            </p>

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">Using Fallback via Header</h3>
                                <p className="text-[#9d9d9d] text-sm">
                                    Add the <code>X-Fallback-Model</code> header to your request.
                                </p>
                                <CodeBlock code={`curl https://api.unio.chipling.xyz/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "X-Fallback-Model: anthropic:claude-3-5-sonnet" \\
  -d '{
    "model": "openai:gpt-4o",
    "messages": [{"role": "user", "content": "..."}]
  }'`} />
                            </div>

                            <div className="space-y-4 mt-8">
                                <h3 className="text-xl font-semibold">Using Fallback in SDK</h3>
                                <p className="text-[#9d9d9d] text-sm">
                                    You can also pass it in the request body if the provider supports extra parameters.
                                </p>
                                <CodeBlock code={`const response = await client.chat.completions.create({
  model: "openai:gpt-4o",
  messages: [{ role: "user", content: "..." }],
  fallback_model: "groq:llama-3.1-70b-versatile" // Supported via Unio gateway
});`} />
                            </div>
                        </div>
                    )}

                    {activeSection === "vaults" && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-3xl font-bold">Knowledge Vaults (RAG)</h2>
                            <p className="text-[#9d9d9d] leading-7">
                                Knowledge Vaults allow you to upload documents (PDF, DOCX, TXT) and use them as context for your LLM queries.
                                Unio handles the embedding and retrieval automatically.
                            </p>

                            <div className="space-y-4 mt-8">
                                <h3 className="text-xl font-semibold">1. Create a Vault & Upload Docs</h3>
                                <p className="text-[#9d9d9d] mb-2">Use the Dashboard to create a vault and upload files.</p>

                                <h3 className="text-xl font-semibold mt-8">2. Query with Context</h3>
                                <p className="text-[#9d9d9d] mb-2">
                                    Add the <code>vault_id</code> to your API request to enable RAG. obtain the ID from the Vaults page.
                                </p>

                                <h4 className="text-sm font-medium text-white mb-2">Python Example (OpenAI SDK)</h4>
                                <CodeBlock code={`response = client.chat.completions.create(
    model="openai:gpt-4o",
    messages=[{"role": "user", "content": "What is the vacation policy?"}],
    extra_body={
        "vault_id": "YOUR_VAULT_ID"
    }
)`} />

                                <h4 className="text-sm font-medium text-white mb-2 mt-4">cURL Example</h4>
                                <CodeBlock code={`curl https://api.unio.chipling.xyz/v1/chat/completions \\
  -H "Authorization: Bearer KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "openai:gpt-4o",
    "messages": [{"role": "user", "content": "..."}],
    "vault_id": "YOUR_VAULT_ID"
  }'`} />
                            </div>
                        </div>
                    )}

                    {activeSection === "logs" && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-3xl font-bold">Logs & Analytics</h2>
                            <p className="text-[#9d9d9d] leading-7">
                                Unio logs every request, response, and performance metric.
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-[#b0b0b0]">
                                <li><strong>Latency tracking:</strong> See Time-to-First-Token (TTFT) and total response time.</li>
                                <li><strong>Token usage:</strong> Monitor input/output tokens and estimated costs.</li>
                                <li><strong>RAG Inspection:</strong> View exactly what context was retrieved and injected into your prompts.</li>
                                <li><strong>Key Rotation:</strong> See if keys were rotated due to rate limits.</li>
                            </ul>
                        </div>
                    )}

                    <div className="pt-12 border-t border-[#1b1b1b]">
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    );
}

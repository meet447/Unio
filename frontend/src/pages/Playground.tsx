import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Copy, 
  CheckCircle, 
  Sparkles, 
  Settings, 
  Code2,
  Zap,
  Loader2,
  Send,
  StopCircle,
  ChevronDown,
  ChevronUp,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import OpenAI from "openai";

const Playground = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState<string>("");
  const [input, setInput] = useState<string>("What is the capital of France?");
  const [model, setModel] = useState<string>("google:gemini-2.0-flash");
  const [temperature, setTemperature] = useState<number[]>([0.7]);
  const [streaming, setStreaming] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [streamController, setStreamController] = useState<AbortController | null>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [usage, setUsage] = useState<{ prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } | null>(null);
  const [conversationMode, setConversationMode] = useState<boolean>(false);
  const [conversation, setConversation] = useState<Array<{ role: string; content: string }>>([]);

  const models = [
    { value: "google:gemini-2.0-flash", label: "Google Gemini 2.0 Flash", provider: "Google" },
    { value: "openai:gpt-4o-mini", label: "OpenAI GPT-4o Mini", provider: "OpenAI" },
    { value: "anthropic:claude-3-5-sonnet-20241022", label: "Anthropic Claude 3.5 Sonnet", provider: "Anthropic" },
    { value: "groq:llama-3.1-70b-versatile", label: "Groq Llama 3.1 70B", provider: "Groq" },
    { value: "together:meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", label: "Together Llama 3.1 8B", provider: "Together" },
  ];

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/v1/api";

  useEffect(() => {
    // Try to get API key from user's tokens if available
    const fetchUserApiKey = async () => {
      if (user && !apiKey) {
        try {
          const { data, error } = await supabase
            .from('user_api_tokens')
            .select('token_hash')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (!error && data?.token_hash) {
            setApiKey(data.token_hash);
          }
        } catch (err) {
          // Silently fail - user can enter key manually
        }
      }
    };
    fetchUserApiKey();
  }, [user]);

  const handleSubmit = async () => {
    if (!apiKey) {
      setError("Please enter your API key");
      toast.error("API key required");
      return;
    }

    if (!input.trim()) {
      setError("Please enter a message");
      toast.error("Message required");
      return;
    }

    setLoading(true);
    setError("");
    setResponse("");
    setUsage(null);

    try {
      const client = new OpenAI({
        apiKey: apiKey,
        baseURL: baseUrl,
        dangerouslyAllowBrowser: true,
      });

      const requestInput = conversationMode && conversation.length > 0
        ? [...conversation, { role: "user", content: input }]
        : input;

      if (streaming) {
        // Streaming response
        const controller = new AbortController();
        setStreamController(controller);
        
        let fullResponse = "";
        const stream = await client.responses.create(
          {
            input: requestInput,
            model: model,
            temperature: temperature[0],
            stream: true,
          },
          { signal: controller.signal }
        );

        for await (const event of stream) {
          if (controller.signal.aborted) break;
          
          if (event.type === "response.output_text.delta") {
            fullResponse += event.delta || "";
            setResponse(fullResponse);
          } else if (event.type === "response.completed") {
            if (event.usage) {
              setUsage(event.usage);
            }
          }
        }

        // Add to conversation if in conversation mode
        if (conversationMode && fullResponse) {
          setConversation([...conversation, { role: "user", content: input }, { role: "assistant", content: fullResponse }]);
          setInput("");
        }
      } else {
        // Non-streaming response
        const result = await client.responses.create({
          input: requestInput,
          model: model,
          temperature: temperature[0],
          stream: false,
        });

        // Extract text from response
        let outputText = "";
        if (result.output && result.output.length > 0) {
          const message = result.output[0];
          if (message.content && Array.isArray(message.content)) {
            const textContent = message.content.find((c: any) => c.type === "text");
            if (textContent) {
              outputText = textContent.text;
            }
          }
        }

        setResponse(outputText || "No response received");
        if (result.usage) {
          setUsage(result.usage);
        }

        // Add to conversation if in conversation mode
        if (conversationMode && outputText) {
          setConversation([...conversation, { role: "user", content: input }, { role: "assistant", content: outputText }]);
          setInput("");
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setResponse(response + "\n\n[Stream stopped]");
      } else {
        const errorMsg = err.message || "An error occurred";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
      setStreamController(null);
    }
  };

  const handleStop = () => {
    if (streamController) {
      streamController.abort();
      setStreamController(null);
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const copyResponse = () => {
    if (response) {
      copyToClipboard(response);
    }
  };

  const copyCode = () => {
    const code = `from openai import OpenAI

client = OpenAI(
    api_key="${apiKey || "your-api-key"}",
    base_url="${baseUrl}"
)

response = client.responses.create(
    input="${input.replace(/"/g, '\\"')}",
    model="${model}",
    temperature=${temperature[0]}${streaming ? ",\n    stream=True" : ""}
)

${streaming ? "for event in response:\n    if event.type == 'response.output_text.delta':\n        print(event.delta, end='')" : "print(response.output[0].content[0].text)"}`;
    copyToClipboard(code);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in to use Playground</CardTitle>
            <CardDescription>
              You need to be signed in to test the API in the playground.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Playground</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Test and experiment with Unio's API in real-time
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Configuration</CardTitle>
                <Badge variant="outline" className="gap-1">
                  <Zap className="h-3 w-3" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* API Key */}
              <div className="space-y-2">
                <Label htmlFor="api-key" className="text-sm font-medium">
                  API Key
                </Label>
                <div className="flex gap-2">
                  <Textarea
                    id="api-key"
                    placeholder="rk_..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="font-mono text-sm"
                    rows={1}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={async () => {
                      if (user) {
                        try {
                          const { data, error } = await supabase
                            .from('user_api_tokens')
                            .select('token_hash')
                            .eq('user_id', user.id)
                            .eq('is_active', true)
                            .order('created_at', { ascending: false })
                            .limit(1)
                            .single();

                          if (!error && data?.token_hash) {
                            setApiKey(data.token_hash);
                            toast.success("API key loaded from profile");
                          } else {
                            toast.error("No active API key found. Create one in your Profile.");
                          }
                        } catch (err) {
                          toast.error("Failed to fetch API key");
                        }
                      } else {
                        toast.error("Please sign in first");
                      }
                    }}
                    title="Get from profile"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get your API key from the{" "}
                  <a href="/profile" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Profile page
                  </a>
                </p>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <Label htmlFor="model" className="text-sm font-medium">
                  Model
                </Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger id="model" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{m.label}</span>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {m.provider}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Input Mode Toggle */}
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Input Mode</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Single</span>
                  <Switch
                    checked={conversationMode}
                    onCheckedChange={setConversationMode}
                  />
                  <span className="text-xs text-gray-500">Conversation</span>
                </div>
              </div>

              {/* Input */}
              <div className="space-y-2">
                <Label htmlFor="input" className="text-sm font-medium">
                  {conversationMode ? "Conversation" : "Input"}
                </Label>
                {conversationMode ? (
                  <div className="space-y-2 min-h-[200px] max-h-[400px] overflow-y-auto border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                    {conversation.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">Start a conversation...</p>
                    ) : (
                      conversation.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-lg p-2 text-sm ${
                            msg.role === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                          }`}>
                            <div className="text-xs font-semibold mb-1 opacity-70">{msg.role}</div>
                            <div>{msg.content}</div>
                          </div>
                        </div>
                      ))
                    )}
                    <Textarea
                      id="input"
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          handleSubmit();
                        }
                      }}
                      className="mt-2 font-mono text-sm"
                      rows={2}
                    />
                  </div>
                ) : (
                  <Textarea
                    id="input"
                    placeholder="Enter your message here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleSubmit();
                      }
                    }}
                    className="min-h-[200px] font-mono text-sm"
                  />
                )}
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <span>Advanced Settings</span>
                  {showAdvanced ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {showAdvanced && (
                  <div className="space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Temperature: {temperature[0]}</Label>
                      </div>
                      <Slider
                        value={temperature}
                        onValueChange={setTemperature}
                        min={0}
                        max={2}
                        step={0.1}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Controls randomness. Lower = more focused, Higher = more creative
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="streaming" className="text-sm">
                        Streaming
                      </Label>
                      <Switch
                        id="streaming"
                        checked={streaming}
                        onCheckedChange={setStreaming}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !apiKey || !input.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {streaming ? "Streaming..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Request
                    </>
                  )}
                </Button>
                {loading && streaming && (
                  <Button
                    onClick={handleStop}
                    variant="destructive"
                    size="icon"
                  >
                    <StopCircle className="h-4 w-4" />
                  </Button>
                )}
                {conversationMode && conversation.length > 0 && (
                  <Button
                    onClick={() => {
                      setConversation([]);
                      setResponse("");
                      setInput("");
                    }}
                    variant="outline"
                    size="icon"
                    title="Clear conversation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {conversationMode && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Press Cmd/Ctrl + Enter to send
                </p>
              )}
            </CardContent>
          </Card>

          {/* Right Panel - Output */}
          <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Response</CardTitle>
                <div className="flex gap-2">
                  {usage && (
                    <Badge variant="outline" className="text-xs">
                      {usage.total_tokens} tokens
                    </Badge>
                  )}
                  {response && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyResponse}
                      className="h-8"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {response ? (
                  <div className="bg-gradient-to-br from-gray-900 to-gray-950 dark:from-gray-950 dark:to-black rounded-lg p-6 border border-gray-800 shadow-inner">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-400 font-mono">Response</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyResponse}
                        className="h-7 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <pre className="text-sm text-gray-100 whitespace-pre-wrap font-mono leading-relaxed">
                      {response}
                    </pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full mb-4">
                      <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      Your response will appear here
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Configure your request and click "Send Request" to test the API
                    </p>
                  </div>
                )}

                {usage && (
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Prompt</p>
                      <p className="text-sm font-semibold">{usage.prompt_tokens || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Completion</p>
                      <p className="text-sm font-semibold">{usage.completion_tokens || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                      <p className="text-sm font-semibold">{usage.total_tokens || 0}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Example */}
        <Card className="mt-6 border-2 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Code Example</CardTitle>
              <Button variant="outline" size="sm" onClick={copyCode}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 border border-gray-800 overflow-x-auto">
              <pre className="text-sm text-gray-100 font-mono">
                <code>{`from openai import OpenAI

client = OpenAI(
    api_key="${apiKey || "your-api-key"}",
    base_url="${baseUrl}"
)

response = client.responses.create(
    input="${input.replace(/"/g, '\\"')}",
    model="${model}",
    temperature=${temperature[0]}${streaming ? ",\n    stream=True" : ""}
)

${streaming ? "for event in response:\n    if event.type == 'response.output_text.delta':\n        print(event.delta, end='')" : "print(response.output[0].content[0].text)"}`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Playground;


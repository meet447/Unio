import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/kibo-ui/button";
import { Input } from "@/components/kibo-ui/input";
import { 
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputProvider,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import {
  ModelSelector,
  ModelSelectorTrigger,
  ModelSelectorContent,
  ModelSelectorInput,
  ModelSelectorList,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorItem,
} from "@/components/ai-elements/model-selector";
import { Loader } from "@/components/ai-elements/loader";
import { RotateCw } from "lucide-react";
import { toast } from "sonner";
import OpenAI from "openai";
import { Switch } from "@/components/kibo-ui/switch";
import { Label } from "@/components/kibo-ui/label";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const Playground = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState<string>("");
  const [model, setModel] = useState<string>("google:gemini-2.5-flash-lite");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [prefilled, setPrefilled] = useState(false);
  const [streaming, setStreaming] = useState<boolean>(true);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitted" | "streaming" | "error">("idle");

  const models = [
    { value: "google:gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
    { value: "google:gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { value: "google:gemini-2.5-pro", label: "Gemini 2.5 Pro" },
    { value: "google:gemini-2.0-flash-lite", label: "Gemini 2.0 Flash Lite" },
    { value: "google:gemini-2.0-flash", label: "Gemini 2.0 Flash" },
    { value: "google:gemini-2.0-pro", label: "Gemini 2.0 Pro" },
    { value: "groq:qwen/qwen3-32b", label: "Qwen3 32B" },
    { value: "groq:groq/compound", label: "Groq Compound" },
    { value: "groq:groq/compound-mini", label: "Groq Compound Mini" },
    { value: "groq:llama-3.1-8b-instant", label: "Llama 3.1 8B Instant" },
    { value: "groq:llama-3.3-70b-versatile", label: "Llama 3.3 70B Versatile" },
    { value: "groq:meta-llama/llama-4-maverick-17b-128e-instruct", label: "Llama 4 Maverick 17B" },
    { value: "groq:meta-llama/llama-4-scout-17b-16e-instruct", label: "Llama 4 Scout 17B" },
    { value: "groq:moonshotai/kimi-k2-instruct-0905", label: "Kimi K2 Instruct" },
    { value: "groq:openai/gpt-oss-120b", label: "GPT-OSS 120B" },
    { value: "groq:openai/gpt-oss-20b", label: "GPT-OSS 20B" },
  ];

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/v1/api";

  useEffect(() => {
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
            setPrefilled(true);
          } else {
            setPrefilled(false);
          }
        } catch (err) {
          // Silently fail
          setPrefilled(false);
        }
      }
    };
    fetchUserApiKey();
  }, [user]);

  const handleSubmit = async (message: { text: string; files: any[] }) => {
    if (!apiKey) {
      toast.error("API key required");
      return;
    }

    if (!message.text.trim()) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message.text,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setSubmitStatus(streaming ? "streaming" : "submitted");

    // Create assistant message placeholder
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: ""
    };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      const client = new OpenAI({
        apiKey: apiKey,
        baseURL: baseUrl,
        dangerouslyAllowBrowser: true,
      });

      // Convert messages to the format expected by the API
      const requestInput = [
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: message.text }
      ];

      if (streaming) {
        // Handle streaming response
        const stream = await client.responses.create({
          input: requestInput,
          model: model,
          stream: true,
        });

        let fullContent = "";
        setSubmitStatus("streaming");
        
        try {
          for await (const chunk of stream) {
            // Process streaming chunks - the event type is "response.output_text.delta"
            if (chunk.type === "response.output_text.delta") {
              const delta = (chunk as any).delta;
              if (typeof delta === 'string') {
                fullContent += delta;
                // Update message content incrementally
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessageId 
                    ? { ...msg, content: fullContent }
                    : msg
                ));
              }
            } else if (chunk.type === "response.output_text.done") {
              // Stream completed
              break;
            }
          }
          
          // Ensure final content is set
          if (fullContent) {
            setMessages(prev => prev.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, content: fullContent }
                : msg
            ));
          }
          
          setSubmitStatus("idle");
        } catch (streamError: any) {
          throw new Error(streamError.message || "Streaming error occurred");
        }
      } else {
        // Handle non-streaming response
        const response = await client.responses.create({
          input: requestInput,
          model: model,
          stream: false,
        });

        // Handle response - check if it's a text output
        const outputItem = response.output?.[0];
        if (outputItem && 'content' in outputItem && outputItem.content && Array.isArray(outputItem.content)) {
          const textContent = outputItem.content.find((item: any) => {
            if (typeof item === 'object' && item !== null) {
              return 'text' in item || item.type === 'text';
            }
            return typeof item === 'string';
          });
          
          let content = 'No response';
          if (textContent) {
            if (typeof textContent === 'string') {
              content = textContent;
            } else if (typeof textContent === 'object' && textContent !== null && 'text' in textContent) {
              content = (textContent as any).text;
            }
          }
          
          // Update the assistant message with full content
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: content }
              : msg
          ));
          setSubmitStatus("idle");
        } else {
          throw new Error("Invalid response format");
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred";
      // Update the assistant message with error
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: `Error: ${errorMessage}` }
          : msg
      ));
      setSubmitStatus("error");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSubmitStatus("idle");
  };

  const selectedModel = models.find(m => m.value === model);

  return (
    <div className="h-screen flex flex-col bg-[#030303] text-white">
      {/* Header */}
      <header className="border-b border-[#1b1b1b] px-3 sm:px-5 py-3 sm:py-4 flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.2rem] sm:tracking-[0.3rem] text-[#7d7d7d]">Playground</p>
          <div className="flex flex-col gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">Prototype across providers</h1>
              <p className="text-xs sm:text-sm text-[#9c9c9c] mt-1">We route every request through your OpenAI-compatible endpoint.</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  id="streaming-mode"
                  checked={streaming}
                  onCheckedChange={setStreaming}
                />
                <Label 
                  htmlFor="streaming-mode" 
                  className="text-xs sm:text-sm text-[#9c9c9c] cursor-pointer"
                >
                  Streaming
                </Label>
              </div>
              <ModelSelector>
                <ModelSelectorTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-40 bg-[#0c0c0c] border-[#1f1f1f] text-white hover:bg-[#141414] text-xs sm:text-sm">
                    {selectedModel?.label || "Select model"}
                  </Button>
                </ModelSelectorTrigger>
                <ModelSelectorContent>
                  <ModelSelectorInput placeholder="Search models..." />
                  <ModelSelectorList>
                    <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                    <ModelSelectorGroup>
                      {models.map((m) => (
                        <ModelSelectorItem
                          key={m.value}
                          value={m.value}
                          onSelect={() => setModel(m.value)}
                        >
                          {m.label}
                        </ModelSelectorItem>
                      ))}
                    </ModelSelectorGroup>
                  </ModelSelectorList>
                </ModelSelectorContent>
              </ModelSelector>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#acacac] hover:text-white w-full sm:w-auto"
                onClick={handleNewChat}
              >
                <RotateCw className="h-4 w-4 mr-2" />
                <span className="text-xs sm:text-sm">Reset chat</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex-1">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setPrefilled(false);
              }}
              placeholder="Your Unio API token (prefilled from Profile)"
              className="bg-[#0c0c0c] border-[#1f1f1f] text-white placeholder-[#6f6f6f] text-sm"
            />
            <p className="text-xs text-[#6c6c6c] mt-1">
              {prefilled
                ? "Using your most recent active API token."
                : "Generate a personal token under Profile → API Access."}
            </p>
          </div>
          <div className="text-xs text-[#6f6f6f] break-all">
            Endpoint: <span className="text-white">{baseUrl}</span>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="Start a conversation"
              description="Ask 'What's the cheapest model for summarization?'"
            />
          ) : (
            messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  <MessageResponse>
                    {message.content}
                  </MessageResponse>
                </MessageContent>
              </Message>
            ))
          )}
          {loading && submitStatus === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Loader size={16} />
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Input Area */}
      <div className="border-t border-[#1b1b1b] px-3 sm:px-4 py-3 sm:py-4">
        <PromptInputProvider>
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea placeholder="Ask 'What's the cheapest model for summarization?'" />
            <PromptInputSubmit 
              status={submitStatus === "streaming" ? "streaming" : submitStatus === "submitted" ? "submitted" : submitStatus === "error" ? "error" : undefined}
            />
          </PromptInput>
        </PromptInputProvider>
      </div>
    </div>
  );
};

export default Playground;

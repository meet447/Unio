import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/kibo-ui/badge";

interface ProviderRow {
  id: string;
  name: string;
  description: string | null;
}

interface ModelInfo {
  name: string;
  context: string;
  strengths: string;
  latency: string;
  status?: "live" | "beta" | "soon";
}

const modelsByProvider: Record<string, ModelInfo[]> = {
  OpenAI: [
    { name: "gpt-4o", context: "128k", strengths: "General reasoning, UI co-pilot", latency: "~150ms", status: "live" },
    { name: "gpt-4o-mini", context: "128k", strengths: "High-volume chatbots", latency: "~90ms", status: "live" },
    { name: "o1-preview", context: "200k", strengths: "Deep reasoning, planning", latency: "~400ms", status: "beta" },
  ],
  Anthropic: [
    { name: "claude-3.5-sonnet", context: "200k", strengths: "Long-form reasoning, RAG", latency: "~180ms", status: "live" },
    { name: "claude-3.5-haiku", context: "200k", strengths: "Streaming, customer support", latency: "~120ms", status: "live" },
  ],
  Google: [
    { name: "gemini-1.5-pro", context: "1M", strengths: "Multimodal, massive context", latency: "~220ms", status: "live" },
    { name: "gemini-1.5-flash", context: "1M", strengths: "Interactive agents, copilots", latency: "~140ms", status: "live" },
  ],
  Groq: [
    { name: "llama-3.1-70b-versatile", context: "128k", strengths: "Ultra low latency responses", latency: "~50ms", status: "live" },
    { name: "mixtral-8x7b", context: "32k", strengths: "Cost-efficient summarization", latency: "~45ms", status: "live" },
  ],
  Together: [
    { name: "meta-llama-3-70b-instruct", context: "32k", strengths: "Enterprise copilots", latency: "~130ms", status: "live" },
    { name: "mistral-large-latest", context: "32k", strengths: "Multilingual chat", latency: "~110ms", status: "beta" },
  ],
  OpenRouter: [
    { name: "nous-hermes-3", context: "32k", strengths: "Creative writing", latency: "~160ms", status: "live" },
    { name: "perplexity-llama-3-sonar-large", context: "64k", strengths: "Search-grounded QA", latency: "~200ms", status: "beta" },
  ],
};

const statusCopy: Record<ModelInfo["status"], { label: string; className: string }> = {
  live: { label: "Live", className: "bg-[#132315] text-[#82f2a6]" },
  beta: { label: "Beta", className: "bg-[#2c1f06] text-[#ffd599]" },
  soon: { label: "Soon", className: "bg-[#2b2b2b] text-[#d7d7d7]" },
};

const Models = () => {
  const [providers, setProviders] = useState<ProviderRow[]>([]);

  useEffect(() => {
    const fetchProviders = async () => {
      const { data } = await supabase.from("providers").select("*").order("name");
      setProviders(data || []);
    };

    fetchProviders();
  }, []);

  const providerCards = useMemo(() => {
    if (providers.length === 0) {
      return Object.keys(modelsByProvider).map((name) => ({
        id: name,
        name,
        description: null,
        models: modelsByProvider[name],
      }));
    }

    return providers.map((provider) => ({
      ...provider,
      models: modelsByProvider[provider.name] || [],
    }));
  }, [providers]);

  return (
    <div className="min-h-screen bg-[#030303] text-white p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <div>
          <p className="text-sm uppercase tracking-[0.25rem] text-[#6f6f6f] mb-3">Model Matrix</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Every provider, curated in one place
          </h1>
          <p className="text-[#9d9d9d] mt-3 max-w-3xl">
            Compare context windows, strengths, and latency before routing requests. Unio keeps a live
            catalog so you can pick the best model for each workload.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providerCards.map((provider) => (
            <div
              key={provider.id}
              className="rounded-3xl border border-[#1a1a1a] bg-[#050505] p-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-medium">{provider.name}</h3>
                  <p className="text-sm text-[#8c8c8c] mt-1">
                    {provider.description || "Provider description coming soon."}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-[#101010] text-[#c9c9c9] border-0">
                  {modelsByProvider[provider.name] ? "Supported" : "Roadmap"}
                </Badge>
              </div>

              {provider.models.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#242424] p-4 text-sm text-[#8c8c8c]">
                  Model catalog coming soon for this provider.
                </div>
              ) : (
                <div className="space-y-3">
                  {provider.models.map((model) => (
                    <div
                      key={`${provider.name}-${model.name}`}
                      className="rounded-2xl border border-[#161616] bg-[#090909] px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <p className="font-medium">{model.name}</p>
                        {model.status && (
                          <Badge
                            variant="secondary"
                            className={`${statusCopy[model.status].className} border-0`}
                          >
                            {statusCopy[model.status].label}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-[#9d9d9d]">
                        <p>{model.strengths}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-xs text-[#7c7c7c] uppercase tracking-wide">
                          <span>Context: {model.context}</span>
                          <span>Latency: {model.latency}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Models;


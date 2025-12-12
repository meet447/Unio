import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/kibo-ui/badge";
import { Loader2 } from "lucide-react";

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
  Google: [
    { name: "google:gemini-2.5-flash-lite", context: "1M", strengths: "Fast, efficient responses", latency: "~100ms", status: "live" },
    { name: "google:gemini-2.5-flash", context: "1M", strengths: "Balanced performance and speed", latency: "~120ms", status: "live" },
    { name: "google:gemini-2.5-pro", context: "1M", strengths: "Advanced reasoning and capabilities", latency: "~200ms", status: "live" },
    { name: "google:gemini-2.0-flash-lite", context: "1M", strengths: "Lightweight, fast responses", latency: "~90ms", status: "live" },
    { name: "google:gemini-2.0-flash", context: "1M", strengths: "Fast multimodal understanding", latency: "~110ms", status: "live" },
    { name: "google:gemini-2.0-pro", context: "1M", strengths: "High-performance reasoning", latency: "~180ms", status: "live" },
  ],
  Groq: [
    { name: "groq:qwen/qwen3-32b", context: "128k", strengths: "Large-scale reasoning tasks", latency: "~60ms", status: "live" },
    { name: "groq:groq/compound", context: "128k", strengths: "Complex multi-step reasoning", latency: "~70ms", status: "live" },
    { name: "groq:groq/compound-mini", context: "128k", strengths: "Efficient compound reasoning", latency: "~50ms", status: "live" },
    { name: "groq:llama-3.1-8b-instant", context: "128k", strengths: "Ultra-fast instant responses", latency: "~30ms", status: "live" },
    { name: "groq:llama-3.3-70b-versatile", context: "128k", strengths: "Versatile high-performance model", latency: "~55ms", status: "live" },
    { name: "groq:meta-llama/llama-4-maverick-17b-128e-instruct", context: "128k", strengths: "Advanced instruction following", latency: "~65ms", status: "live" },
    { name: "groq:meta-llama/llama-4-scout-17b-16e-instruct", context: "128k", strengths: "Scout model for exploration", latency: "~60ms", status: "live" },
    { name: "groq:moonshotai/kimi-k2-instruct-0905", context: "128k", strengths: "Specialized instruction tasks", latency: "~70ms", status: "live" },
    { name: "groq:openai/gpt-oss-120b", context: "128k", strengths: "Massive scale reasoning", latency: "~80ms", status: "live" },
    { name: "groq:openai/gpt-oss-20b", context: "128k", strengths: "Open source GPT alternative", latency: "~45ms", status: "live" },
  ],
};

const statusCopy: Record<ModelInfo["status"], { label: string; className: string }> = {
  live: { label: "Live", className: "bg-[#132315] text-[#82f2a6]" },
  beta: { label: "Beta", className: "bg-[#2c1f06] text-[#ffd599]" },
  soon: { label: "Soon", className: "bg-[#2b2b2b] text-[#d7d7d7]" },
};

const Models = () => {
  const [providers, setProviders] = useState<ProviderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.from("providers").select("*").order("name");
        setProviders(data || []);
      } finally {
        setLoading(false);
      }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-[#0a0a0a]/50 backdrop-blur-md p-8 rounded-[1.5rem] border border-[#1b1b1b] shadow-2xl">
          <Loader2 className="w-10 h-10 animate-spin text-[#93c5fd] mx-auto mb-4" />
          <p className="text-[#b0b0b0] text-lg">Loading models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white p-6 lg:p-10">
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
              className="rounded-[1.5rem] border border-[#1b1b1b] bg-[#0a0a0a]/50 backdrop-blur-md p-6 flex flex-col gap-4 shadow-2xl"
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
                <div className="rounded-[1rem] border border-dashed border-[#1b1b1b] p-4 text-sm text-[#8c8c8c] bg-[#0a0a0a]/50">
                  Model catalog coming soon for this provider.
                </div>
              ) : (
                <div className="space-y-3">
                  {provider.models.map((model) => (
                    <div
                      key={`${provider.name}-${model.name}`}
                      className="rounded-[1rem] border border-[#1b1b1b] bg-[#0a0a0a]/50 backdrop-blur-sm px-4 py-3"
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


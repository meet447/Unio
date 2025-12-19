import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/kibo-ui/badge";
import { Button } from "@/components/kibo-ui/button";
import { Input } from "@/components/kibo-ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/kibo-ui/accordion";
import { Loader2, Search, ChevronsUpDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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

// Fallback data for providers that fail to load or have no dynamic models
const modelsByProvider: Record<string, ModelInfo[]> = {
  Google: [
    { name: "google:gemini-2.5-flash-lite", context: "1M", strengths: "Fast, efficient responses", latency: "~100ms", status: "live" },
    { name: "google:gemini-2.5-flash", context: "1M", strengths: "Balanced performance and speed", latency: "~120ms", status: "live" },
  ],
  Groq: [
    { name: "groq:llama-3.1-8b-instant", context: "128k", strengths: "Ultra-fast instant responses", latency: "~30ms", status: "live" },
  ],
};

const statusCopy: Record<ModelInfo["status"], { label: string; className: string }> = {
  live: { label: "Live", className: "bg-[#132315] text-[#82f2a6]" },
  beta: { label: "Beta", className: "bg-[#2c1f06] text-[#ffd599]" },
  soon: { label: "Soon", className: "bg-[#2b2b2b] text-[#d7d7d7]" },
};

const PAGE_SIZE = 10;

const Models = () => {
  const { user } = useAuth();
  const [providers, setProviders] = useState<ProviderRow[]>([]);
  const [activeProviderIds, setActiveProviderIds] = useState<Set<string>>(new Set());
  const [dynamicModels, setDynamicModels] = useState<Record<string, ModelInfo[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Track pagination state per provider (how many items to show)
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Providers from DB
        const { data } = await supabase.from("providers").select("*").order("name");
        setProviders(data || []);

        // 2. Fetch User's Active Keys to filter providers
        if (user) {
          const { data: keyData } = await supabase
            .from("api_keys")
            .select("provider_id")
            .eq("user_id", user.id)
            .eq("is_active", true);

          if (keyData) {
            setActiveProviderIds(new Set(keyData.map((k: any) => k.provider_id)));
          }

          // 3. Fetch Dynamic Models from Backend
          const res = await fetch("https://api.unio.chipling.xyz/v1/models/fetch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id })
          });
          const json = await res.json();

          if (json.data) {
            const mapping: Record<string, ModelInfo[]> = {};
            json.data.forEach((p: any) => {
              mapping[p.provider] = p.models.map((m: any) => ({
                name: m.id,
                context: "?",
                strengths: "Fetched from Provider",
                latency: "~",
                status: "live"
              }));
            });
            setDynamicModels(mapping);
          }
        }
      } catch (err) {
        console.error("Error loading models page data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const providerCards = useMemo(() => {
    return providers
      .filter((p) => activeProviderIds.has(p.id))
      .map((provider) => {
        const dynamicList = dynamicModels[provider.name] || [];
        const hardcodedList = modelsByProvider[provider.name] || [];
        const finalModels = dynamicList.length > 0 ? dynamicList : hardcodedList;

        // Apply search filter locally
        const filtered = finalModels.filter(m =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          provider.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return {
          ...provider,
          models: filtered,
        };
      });
  }, [providers, activeProviderIds, dynamicModels, searchQuery]);

  const handleLoadMore = (providerId: string) => {
    setVisibleCounts(prev => ({
      ...prev,
      [providerId]: (prev[providerId] || PAGE_SIZE) + PAGE_SIZE
    }));
  };

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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.25rem] text-[#6f6f6f] mb-3">Model Matrix</p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Every provider, curated
            </h1>
            <p className="text-[#9d9d9d] mt-2 max-w-xl">
              Compare context windows, strengths, and latency.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6f6f6f]" />
            <Input
              placeholder="Search models or providers..."
              className="pl-10 bg-[#0a0a0a]/50 border-[#1b1b1b] text-white placeholder:text-[#6f6f6f]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 gap-6">
          {providerCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-[#8c8c8c] border border-dashed border-[#1b1b1b] rounded-[1.5rem] bg-[#0a0a0a]/30">
              <p className="text-lg font-medium mb-2">No Setup Providers</p>
              <p className="text-sm">Add an API Key in the dashboard to see your models here.</p>
            </div>
          ) : (
            <Accordion type="multiple" defaultValue={providerCards.map(p => p.id)} className="w-full space-y-4">
              {providerCards.map((provider) => {
                const visibleCount = visibleCounts[provider.id] || PAGE_SIZE;
                const displayedModels = provider.models.slice(0, visibleCount);
                const hasMore = provider.models.length > visibleCount;

                return (
                  <AccordionItem
                    key={provider.id}
                    value={provider.id}
                    className="border border-[#1b1b1b] rounded-[1rem] bg-[#0a0a0a]/50 backdrop-blur-md overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-[#151515] transition-colors">
                      <div className="flex items-center gap-4">
                        <h3 className="text-xl font-medium">{provider.name}</h3>
                        <Badge variant="outline" className="border-[#2a2a2a] text-[#8c8c8c]">
                          {provider.models.length} Models
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-2">
                      <div className="space-y-4">
                        <div className="text-sm text-[#8c8c8c] mb-4">
                          {provider.description || "Active provider"}
                        </div>

                        {/* Models List */}
                        <div className="grid grid-cols-1 gap-3">
                          {displayedModels.map((model) => (
                            <div
                              key={`${provider.name}-${model.name}`}
                              className="flex items-center justify-between p-3 rounded-lg border border-[#1b1b1b] bg-[#0a0a0a]/30 hover:bg-[#151515] transition-colors"
                            >
                              <div className="flex-1 min-w-0 mr-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium truncate">{model.name}</p>
                                  {model.status && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusCopy[model.status].className}`}>
                                      {statusCopy[model.status].label}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-[#6f6f6f]">
                                  <span>Context: {model.context}</span>
                                  <span>•</span>
                                  <span>Price: N/A</span>
                                </div>
                              </div>
                              <div className="text-xs text-[#6f6f6f] hidden sm:block">
                                {model.strengths}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                          <div className="flex justify-center pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLoadMore(provider.id)}
                              className="text-[#8c8c8c] hover:text-white"
                            >
                              Load More ({provider.models.length - visibleCount} remaining)
                              <ChevronsUpDown className="ml-2 w-3 h-3" />
                            </Button>
                          </div>
                        )}

                        {provider.models.length === 0 && (
                          <div className="text-center py-8 text-[#6f6f6f] border border-dashed border-[#1b1b1b] rounded-lg">
                            No models found.
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
};

export default Models;

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/kibo-ui/use-toast";
import { AddApiKeyDialog } from "@/components/AddApiKeyDialog";
import { Button } from "@/components/kibo-ui/button";
import { Badge } from "@/components/kibo-ui/badge";
import { Loader2, KeyRound, ShieldCheck, Trash2, RefreshCcw } from "lucide-react";

interface ApiKeyRecord {
  id: string;
  name: string;
  provider_name: string;
  is_active: boolean;
  usage_count: number;
  created_at: string;
}

const ApiKeys = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchApiKeys = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("api_keys")
        .select(
          `
            id,
            name,
            is_active,
            usage_count,
            created_at,
            providers (
              name
            )
          `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted: ApiKeyRecord[] =
        data?.map((entry) => ({
          id: entry.id,
          name: entry.name,
          provider_name: (entry.providers as { name: string } | null)?.name || "Unknown",
          is_active: entry.is_active,
          usage_count: entry.usage_count,
          created_at: entry.created_at,
        })) || [];

      setApiKeys(formatted);
    } catch (error: any) {
      console.error("Error fetching API keys:", error);
      toast({
        variant: "destructive",
        title: "Failed to load API keys",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const handleDelete = async (keyId: string) => {
    if (!user) return;

    const confirmed = window.confirm(
      "Delete this API key? Any requests using it will stop working immediately."
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(keyId);
    try {
      const { error } = await supabase
        .from("api_keys")
        .delete()
        .eq("id", keyId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "API key deleted",
        description: "The key has been removed from your vault.",
      });
      fetchApiKeys();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete API key",
        description: error.message,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const stats = useMemo(() => {
    const total = apiKeys.length;
    const active = apiKeys.filter((key) => key.is_active).length;
    const usage = apiKeys.reduce((sum, key) => sum + (key.usage_count || 0), 0);
    return { total, active, usage };
  }, [apiKeys]);

  const groupedKeys = useMemo(() => {
    return apiKeys.reduce((acc, key) => {
      if (!acc[key.provider_name]) {
        acc[key.provider_name] = [];
      }
      acc[key.provider_name].push(key);
      return acc;
    }, {} as Record<string, ApiKeyRecord[]>);
  }, [apiKeys]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#b0b0b0] bg-[#030303]">
        Please sign in to manage your API keys.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-[0.2rem] sm:tracking-[0.25rem] text-[#6f6f6f] mb-2 sm:mb-3">
              API Vault
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              Manage your provider credentials
            </h1>
            <p className="text-sm sm:text-base text-[#9d9d9d] mt-2 sm:mt-3 max-w-2xl">
              Bring your own keys for each provider. We store them encrypted, route traffic securely,
              and keep full audit trails of usage.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="border-[#333333] text-[#d7d7d7] hover:bg-[#111111] w-full sm:w-auto"
              onClick={fetchApiKeys}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <AddApiKeyDialog onApiKeyAdded={fetchApiKeys}>
              <Button className="bg-white text-black hover:bg-[#ededed] w-full sm:w-auto">
                <KeyRound className="w-4 h-4 mr-2" />
                Add API Key
              </Button>
            </AddApiKeyDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-[#1b1b1b] rounded-2xl p-5 bg-[#050505]">
            <p className="text-sm text-[#7f7f7f] mb-2">Total Keys</p>
            <p className="text-3xl font-semibold">{stats.total}</p>
          </div>
          <div className="border border-[#1b1b1b] rounded-2xl p-5 bg-[#050505]">
            <p className="text-sm text-[#7f7f7f] mb-2">Active Keys</p>
            <p className="text-3xl font-semibold">{stats.active}</p>
          </div>
          <div className="border border-[#1b1b1b] rounded-2xl p-5 bg-[#050505]">
            <p className="text-sm text-[#7f7f7f] mb-2">Lifetime Requests</p>
            <p className="text-3xl font-semibold">{stats.usage.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div>
              <p className="text-base sm:text-lg font-medium">Stored keys</p>
              <p className="text-xs sm:text-sm text-[#8c8c8c] mt-1">
                Every key stays encrypted at rest. Delete instantly when no longer required.
              </p>
            </div>
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#6f6f6f] ml-2 flex-shrink-0" />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-[#8c8c8c] border border-[#1b1b1b] rounded-2xl bg-[#050505]">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Fetching API keys
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-16 text-[#9d9d9d] border border-[#1b1b1b] rounded-2xl bg-[#050505]">
              <p>No API keys yet. Add your first provider credential to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedKeys).map(([providerName, keys]) => (
                <div key={providerName} className="border border-[#1b1b1b] rounded-2xl sm:rounded-3xl bg-[#050505] overflow-hidden">
                  <div className="bg-[#0a0a0a] px-4 sm:px-6 py-3 border-b border-[#1c1c1c]">
                    <h3 className="text-sm font-semibold text-[#e1e1e1] uppercase tracking-wider">
                      {providerName}
                    </h3>
                  </div>
                  <div className="divide-y divide-[#111111]">
                    {keys.map((key) => (
                      <div key={key.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 hover:bg-[#0a0a0a]/50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                            <p className="text-base sm:text-lg font-medium truncate">{key.name}</p>
                            <Badge
                              variant="secondary"
                              className={`${
                                key.is_active ? "bg-[#132315] text-[#82f2a6]" : "bg-[#2b2b2b] text-[#d3d3d3]"
                              } border-0 text-xs`}
                            >
                              {key.is_active ? "Active" : "Disabled"}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-[#8c8c8c]">
                            Added on {new Date(key.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                          <div className="text-left sm:text-right">
                            <p className="text-xs sm:text-sm text-[#8c8c8c]">Requests</p>
                            <p className="text-base sm:text-lg font-medium">{(key.usage_count || 0).toLocaleString()}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#ff9494] hover:text-white hover:bg-[#2b0000] flex-shrink-0"
                            onClick={() => handleDelete(key.id)}
                            disabled={deletingId === key.id}
                          >
                            {deletingId === key.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                <span className="hidden sm:inline">Removing</span>
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Delete</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeys;


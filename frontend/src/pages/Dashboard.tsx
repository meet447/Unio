import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Key, Activity, BarChart3, MoreHorizontal, ChevronRight, ChevronDown, Power, Trash2 } from "lucide-react";
import { AddApiKeyDialog } from "@/components/AddApiKeyDialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ApiKey {
  id: string;
  name: string;
  provider_name: string;
  is_active: boolean;
  usage_count: number;
  created_at: string;
}

interface Provider {
  name: string;
  keys: ApiKey[];
  totalUsage: number;
  activeKeys: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    fetchApiKeys();
  }, [user, navigate]);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select(`
          *,
          providers (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedKeys = data?.map(key => ({
        id: key.id,
        name: key.name,
        provider_name: key.providers?.name || 'Unknown',
        is_active: key.is_active,
        usage_count: key.usage_count,
        created_at: key.created_at,
      })) || [];

      setApiKeys(formattedKeys);

      // Group keys by provider
      const providerMap = new Map<string, ApiKey[]>();
      formattedKeys.forEach(key => {
        if (!providerMap.has(key.provider_name)) {
          providerMap.set(key.provider_name, []);
        }
        providerMap.get(key.provider_name)!.push(key);
      });

      const providersData = Array.from(providerMap.entries()).map(([name, keys]) => ({
        name,
        keys,
        totalUsage: keys.reduce((sum, key) => sum + key.usage_count, 0),
        activeKeys: keys.filter(key => key.is_active).length,
      }));

      setProviders(providersData);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleApiKeyStatus = async (keyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: !currentStatus })
        .eq('id', keyId);

      if (error) throw error;

      await fetchApiKeys(); // Refresh the data
    } catch (error) {
      console.error('Error toggling API key status:', error);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;

      await fetchApiKeys(); // Refresh the data
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  const toggleProvider = (providerName: string) => {
    const newExpanded = new Set(expandedProviders);
    if (newExpanded.has(providerName)) {
      newExpanded.delete(providerName);
    } else {
      newExpanded.add(providerName);
    }
    setExpandedProviders(newExpanded);
  };

  const stats = [
    {
      title: "API Keys",
      value: apiKeys.length.toString(),
      subtitle: `${apiKeys.filter(k => k.is_active).length} active`,
    },
    {
      title: "Providers",
      value: new Set(apiKeys.map(k => k.provider_name)).size.toString(),
      subtitle: "Connected",
    },
    {
      title: "Requests",
      value: apiKeys.reduce((sum, k) => sum + k.usage_count, 0).toLocaleString(),
      subtitle: "Total usage",
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-medium text-black dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              Manage your API keys and monitor usage
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <AddApiKeyDialog onApiKeyAdded={fetchApiKeys}>
              <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-6 py-3 font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Add API Key
              </Button>
            </AddApiKeyDialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 sm:p-8">
              <div className="text-4xl sm:text-5xl font-medium text-black dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-medium text-black dark:text-white mb-1">
                {stat.title}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-light">
                {stat.subtitle}
              </div>
            </div>
          ))}
        </div>

        {/* Providers Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-black dark:text-white mb-6">
            Your Providers
          </h2>
          
          {providers.length === 0 ? (
            <div className="text-center py-16 sm:py-24">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Key className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-black dark:text-white mb-2">
                No API keys yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light mb-8 max-w-md mx-auto">
                Add your first API key to start using Unio with your favorite LLM providers
              </p>
              <AddApiKeyDialog onApiKeyAdded={fetchApiKeys}>
                <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full px-8 py-4 font-medium">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Key
                </Button>
              </AddApiKeyDialog>
            </div>
          ) : (
            <div className="space-y-4">
              {providers.map((provider) => (
                <div key={provider.name} className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
                  {/* Provider Header */}
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                    onClick={() => toggleProvider(provider.name)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        {expandedProviders.has(provider.name) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                        <h3 className="text-lg font-medium text-black dark:text-white">
                          {provider.name}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-black dark:text-white font-medium">
                          {provider.keys.length}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          {provider.keys.length === 1 ? 'Key' : 'Keys'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-black dark:text-white font-medium">
                          {provider.activeKeys}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Active
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-black dark:text-white font-medium">
                          {provider.totalUsage.toLocaleString()}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Requests
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Provider Keys */}
                  {expandedProviders.has(provider.name) && (
                    <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
                      <div className="p-4 space-y-3">
                        {provider.keys.map((apiKey) => (
                          <div
                            key={apiKey.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium text-black dark:text-white">
                                  {apiKey.name}
                                </h4>
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  apiKey.is_active 
                                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' 
                                    : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400'
                                }`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                    apiKey.is_active ? 'bg-green-500' : 'bg-gray-400'
                                  }`}></div>
                                  {apiKey.is_active ? "Active" : "Inactive"}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">Usage: </span>
                                  <span className="text-black dark:text-white font-medium">{apiKey.usage_count.toLocaleString()} requests</span>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">Added: </span>
                                  <span className="text-black dark:text-white font-medium">{new Date(apiKey.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-3 sm:mt-0 sm:ml-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => toggleApiKeyStatus(apiKey.id, apiKey.is_active)}
                                    className="flex items-center gap-2"
                                  >
                                    <Power className="w-4 h-4" />
                                    {apiKey.is_active ? 'Deactivate' : 'Activate'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => deleteApiKey(apiKey.id)}
                                    className="flex items-center gap-2 text-red-600 dark:text-red-400"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {apiKeys.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="p-6 sm:p-8 border border-gray-200 dark:border-gray-800 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white dark:text-black" />
                </div>
                <h3 className="text-lg font-medium text-black dark:text-white">
                  API Logs
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-light mb-4">
                Monitor your API requests in real-time
              </p>
              <Button variant="outline" asChild className="border-gray-300 dark:border-gray-700 rounded-full">
                <Link to="/analytics">View Logs</Link>
              </Button>
            </div>

            <div className="p-6 sm:p-8 border border-gray-200 dark:border-gray-800 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white dark:text-black" />
                </div>
                <h3 className="text-lg font-medium text-black dark:text-white">
                  Analytics
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-light mb-4">
                Track usage patterns and costs
              </p>
              <Button variant="outline" asChild className="border-gray-300 dark:border-gray-700 rounded-full">
                <Link to="/analytics">View Analytics</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
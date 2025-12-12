import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/kibo-ui/button";
import { AddApiKeyDialog } from "@/components/AddApiKeyDialog";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics, AnalyticsFilters } from "@/hooks/useAnalytics";
import { supabase } from "@/integrations/supabase/client";
import { Plus, TrendingUp, FileText, BarChart3, Zap, DollarSign, ChevronDown } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/kibo-ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/kibo-ui/select";

interface ApiKey {
  id: string;
  name: string;
  provider_name: string;
  is_active: boolean;
  usage_count: number;
  created_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  // Use analytics for dashboard insights
  const analyticsFilters: AnalyticsFilters = {
    timeRange: timeRange as any,
    searchQuery: '',
    statusFilter: 'all',
    limit: 10
  };
  
  const { logs, chartData, stats } = useAnalytics(analyticsFilters);

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
          id,
          name,
          is_active,
          usage_count,
          created_at,
          providers (
            name
          )
        `)
        .eq('user_id', user.id)
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
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-center bg-[#0a0a0a]/50 backdrop-blur-md p-8 rounded-[1.5rem] border border-[#1b1b1b] shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#93c5fd] mx-auto mb-4"></div>
          <p className="text-[#b0b0b0] text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const displayStats = [
    {
      title: "Total Requests",
      value: stats.totalRequests.toLocaleString(),
      change: `${stats.successRate.toFixed(1)}% success`,
      icon: BarChart3,
    },
    {
      title: "Success Rate",
      value: `${stats.successRate.toFixed(1)}%`,
      change: `${stats.errorCount} errors`,
      icon: TrendingUp,
    },
    {
      title: "Avg Response Time",
      value: `${stats.avgResponseTime.toFixed(0)}ms`,
      change: "Average",
      icon: Zap,
    },
    {
      title: "Total Cost",
      value: `$${stats.totalCost.toFixed(2)}`,
      change: "Estimated",
      icon: DollarSign,
    }
  ];

  // Format chart data for display
  const formatChartData = (data: typeof chartData) => {
    return data.slice(-12).map(point => ({
      ...point,
      time: new Date(point.time).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }));
  };

  return (
    <div className="text-white">

      <div className="p-4 sm:p-6">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
            Welcome back, {user?.email?.split('@')[0] || 'User'}
          </h1>
          <p className="text-sm sm:text-base text-[#b0b0b0] mb-1">
            Here's an overview of your API usage and performance metrics
          </p>
          <p className="text-xs sm:text-sm text-[#7a7a7a]">
            {apiKeys.length} API {apiKeys.length === 1 ? 'key' : 'keys'} • {new Set(apiKeys.map(k => k.provider_name)).size} {new Set(apiKeys.map(k => k.provider_name)).size === 1 ? 'provider' : 'providers'}
          </p>
        </div>

        {/* Overview Statistics */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Overview Statistics</h2>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-32 bg-[#0a0a0a]/50 border-[#1b1b1b] text-white hover:bg-[#121212]/50 focus:ring-[#2b2b2b]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0b0b0b] border-[#1f1f1f] text-white [&>*]:text-white">
                <SelectItem value="1d" className="text-white focus:bg-[#151515] focus:text-white hover:bg-[#151515] data-[highlighted]:bg-[#151515]">Last 24 hours</SelectItem>
                <SelectItem value="7d" className="text-white focus:bg-[#151515] focus:text-white hover:bg-[#151515] data-[highlighted]:bg-[#151515]">Last 7 days</SelectItem>
                <SelectItem value="30d" className="text-white focus:bg-[#151515] focus:text-white hover:bg-[#151515] data-[highlighted]:bg-[#151515]">Last 30 days</SelectItem>
                <SelectItem value="all" className="text-white focus:bg-[#151515] focus:text-white hover:bg-[#151515] data-[highlighted]:bg-[#151515]">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {displayStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-[#0a0a0a]/50 backdrop-blur-md border border-[#1b1b1b] rounded-[1.5rem] p-4 sm:p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#bbbbbb]" />
                  </div>
                  <div className="text-xl sm:text-2xl font-semibold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-[#b5b5b5] mb-1">
                    {stat.title}
                  </div>
                  <div className="text-xs text-[#7b7b7b]">
                    {stat.change}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* API Usage Overview */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white">API Usage Overview</h2>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-32 bg-[#0a0a0a]/50 border-[#1b1b1b] text-white hover:bg-[#121212]/50 focus:ring-[#2b2b2b]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a]/80 backdrop-blur-md border-[#1b1b1b] text-white">
                <SelectItem value="1d" className="text-white focus:bg-[#151515]/50 focus:text-white hover:bg-[#151515]/50 data-[highlighted]:bg-[#151515]/50">Last 24 hours</SelectItem>
                <SelectItem value="7d" className="text-white focus:bg-[#151515]/50 focus:text-white hover:bg-[#151515]/50 data-[highlighted]:bg-[#151515]/50">Last 7 days</SelectItem>
                <SelectItem value="30d" className="text-white focus:bg-[#151515]/50 focus:text-white hover:bg-[#151515]/50 data-[highlighted]:bg-[#151515]/50">Last 30 days</SelectItem>
                <SelectItem value="all" className="text-white focus:bg-[#151515]/50 focus:text-white hover:bg-[#151515]/50 data-[highlighted]:bg-[#151515]/50">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-[#0a0a0a]/50 backdrop-blur-md border border-[#1b1b1b] rounded-[1.5rem] p-3 sm:p-6 overflow-x-auto shadow-2xl">
            {chartData.length > 0 ? (
              <ChartContainer config={{ requests: { label: "Requests", color: "hsl(0, 0%, 100%)" } }} className="h-48 sm:h-64 min-w-[400px]">
                <AreaChart data={formatChartData(chartData)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    fontSize={10}
                    stroke="#8c8c8c"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    fontSize={10}
                    stroke="#8c8c8c"
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent className="bg-[#111111]/80 backdrop-blur-md border-[#2a2a2a]" />} 
                  />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="#FFFFFF"
                    fill="#FFFFFF"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="h-48 sm:h-64 flex items-center justify-center text-[#6f6f6f] text-sm">
                No usage data available
              </div>
            )}
          </div>
        </div>

        {/* API Keys Overview */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white">API Keys</h2>
            <AddApiKeyDialog onApiKeyAdded={fetchApiKeys}>
              <Button className="w-full sm:w-auto bg-white text-black hover:bg-[#e1e1e1]">
                <Plus className="w-4 h-4 mr-2" />
                Add API Key
              </Button>
            </AddApiKeyDialog>
          </div>
          <div className="bg-[#0a0a0a]/50 backdrop-blur-md border border-[#1b1b1b] rounded-[1.5rem] p-4 sm:p-6 shadow-2xl">
            {apiKeys.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-[#0f0f0f]/50 rounded-lg">
                    <div>
                      <div className="text-xs sm:text-sm text-[#b5b5b5]">Total Keys</div>
                      <div className="text-xl sm:text-2xl font-semibold text-white">{apiKeys.length}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-[#0f0f0f]/50 rounded-lg">
                    <div>
                      <div className="text-xs sm:text-sm text-[#b5b5b5]">Active Keys</div>
                      <div className="text-xl sm:text-2xl font-semibold text-white">
                        {apiKeys.filter(k => k.is_active).length}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-[#0f0f0f]/50 rounded-lg">
                    <div>
                      <div className="text-xs sm:text-sm text-[#b5b5b5]">Total Usage</div>
                      <div className="text-xl sm:text-2xl font-semibold text-white">
                        {apiKeys.reduce((sum, k) => sum + (k.usage_count || 0), 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#1c1c1c]">
                  <div className="text-xs sm:text-sm text-[#b5b5b5] mb-2">Recent Keys</div>
                  <div className="space-y-2">
                    {apiKeys.slice(0, 5).map((key) => (
                      <div key={key.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 bg-[#0f0f0f]/50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-white">{key.name}</div>
                          <div className="text-xs text-[#9d9d9d]">{key.provider_name}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-white">{key.usage_count || 0} requests</div>
                            <div className="text-xs text-[#9d9d9d]">
                              {key.is_active ? "Active" : "Inactive"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <p className="text-sm sm:text-base text-[#b0b0b0] mb-4">No API keys yet</p>
                <AddApiKeyDialog onApiKeyAdded={fetchApiKeys}>
                  <Button className="bg-white text-black hover:bg-[#e1e1e1]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First API Key
                  </Button>
                </AddApiKeyDialog>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

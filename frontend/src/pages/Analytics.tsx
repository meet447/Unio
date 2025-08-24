import { useState, useMemo } from "react";
import { useAnalytics, RequestLog, AnalyticsFilters } from "@/hooks/useAnalytics";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { 
  Activity, 
  BarChart3, 
  Clock, 
  DollarSign, 
  Filter,
  Search,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showMore, setShowMore] = useState(false);

  const filters: AnalyticsFilters = {
    timeRange,
    searchQuery,
    statusFilter,
    limit: showMore ? 50 : 10,
    offset: 0
  };

  const { logs, allLogs, loading, loadingMore, error, hasMore, totalCount, loadMore, refetch, chartData, stats } = useAnalytics(filters);

  const displayStats = useMemo(() => {
    return [
      {
        title: "Total Requests",
        value: stats.totalRequests.toLocaleString(),
        change: "",
        trend: "up"
      },
      {
        title: "Success Rate",
        value: `${stats.successRate.toFixed(1)}%`,
        change: "",
        trend: "up"
      },
      {
        title: "Avg Response Time",
        value: `${stats.avgResponseTime.toFixed(0)}ms`,
        change: "",
        trend: "up"
      },
      {
        title: "Total Cost",
        value: `$${stats.totalCost.toFixed(2)}`,
        change: "",
        trend: "down"
      }
    ];
  }, [stats]);

  const getStatusIcon = (status: number | null) => {
    if (status === null) return <AlertCircle className="w-4 h-4 text-gray-500" />;
    if (status >= 200 && status < 300) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (status >= 400 && status < 500) {
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    } else {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: number | null) => {
    if (status === null) return "text-gray-600 dark:text-gray-400";
    if (status >= 200 && status < 300) {
      return "text-green-600 dark:text-green-400";
    } else if (status >= 400 && status < 500) {
      return "text-yellow-600 dark:text-yellow-400";
    } else {
      return "text-red-600 dark:text-red-400";
    }
  };

  // Chart configurations
  const requestVolumeConfig = {
    requests: {
      label: "Requests",
      color: "hsl(var(--chart-1))",
    },
    errors: {
      label: "Errors",
      color: "hsl(var(--chart-2))",
    },
  };

  const responseTimeConfig = {
    responseTime: {
      label: "Avg Response Time (ms)",
      color: "hsl(var(--chart-3))",
    },
  };

  const costConfig = {
    cost: {
      label: "Cost ($)",
      color: "hsl(var(--chart-4))",
    },
  };

  // Format chart data for display
  const formatChartData = (data: typeof chartData) => {
    return data.map(point => ({
      ...point,
      time: new Date(point.time).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <Activity className="w-12 h-12 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-black dark:text-white mb-2">
            Error fetching data
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-light">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-medium text-black dark:text-white mb-2">
              Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              Monitor your API usage, performance, and costs
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 border-gray-300 dark:border-gray-700 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="1d">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3 mb-8">
          <Button
            onClick={refetch}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 sm:gap-8 mb-12">
          {displayStats.map((stat, index) => (
            <div key={index} className="p-6 sm:p-8 border border-gray-200 dark:border-gray-800 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 font-light">
                  {stat.title}
                </div>
                <TrendingUp className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
              </div>
              <div className="text-2xl sm:text-3xl font-medium text-black dark:text-white mb-1">
                {stat.value}
              </div>
              <div className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Request Volume Chart */}
          <div className="p-6 sm:p-8 border border-gray-200 dark:border-gray-800 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white dark:text-black" />
              </div>
              <h3 className="text-lg font-medium text-black dark:text-white">
                Request Volume & Errors
              </h3>
            </div>
            <ChartContainer config={requestVolumeConfig} className="h-64">
              <AreaChart data={formatChartData(chartData)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stackId="1"
                  stroke="var(--color-requests)"
                  fill="var(--color-requests)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="errors"
                  stackId="1"
                  stroke="var(--color-errors)"
                  fill="var(--color-errors)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </div>

          {/* Response Time Chart */}
          <div className="p-6 sm:p-8 border border-gray-200 dark:border-gray-800 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white dark:text-black" />
              </div>
              <h3 className="text-lg font-medium text-black dark:text-white">
                Average Response Time
              </h3>
            </div>
            <ChartContainer config={responseTimeConfig} className="h-64">
              <LineChart data={formatChartData(chartData)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="var(--color-responseTime)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>

        {/* Cost Over Time Chart */}
        <div className="p-6 sm:p-8 border border-gray-200 dark:border-gray-800 rounded-2xl mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white dark:text-black" />
            </div>
            <h3 className="text-lg font-medium text-black dark:text-white">
              Cost Over Time
            </h3>
          </div>
          <ChartContainer config={costConfig} className="h-64">
            <BarChart data={formatChartData(chartData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                fontSize={12}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                fontSize={12}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="cost"
                fill="var(--color-cost)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>

        {/* API Logs Section */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h2 className="text-2xl font-medium text-black dark:text-white mb-4 sm:mb-0">
              API Logs
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64 border-gray-300 dark:border-gray-700 rounded-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32 border-gray-300 dark:border-gray-700 rounded-full">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Errors</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Logs Table */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Request
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Response Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tokens
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
                  {logs.slice(0, showMore ? logs.length : 10).map((log: RequestLog) => (
                    <tr key={log.log_id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-mono">
                        {log.time_stamp ? new Date(log.time_stamp).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-black dark:text-white">
                          {log.model}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white font-medium">
                        {log.provider}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <span className={`text-sm font-medium ${getStatusColor(log.status)}`}>
                            {log.status || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white font-mono">
                        {log.response_time_ms ? `${log.response_time_ms}ms` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                        {log.total_tokens ? log.total_tokens.toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white font-mono">
                        {log.estimated_cost ? `$${log.estimated_cost.toFixed(4)}` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {logs.length === 0 && !loading && (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-black dark:text-white mb-2">
                  No logs found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-light">
                  {searchQuery || statusFilter !== "all" 
                    ? "Try adjusting your search or filter criteria"
                    : "API logs will appear here once you start making requests"
                  }
                </p>
              </div>
            )}
          </div>

          {/* Show More / Load More Section */}
          {logs.length > 0 && (
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Showing {Math.min(showMore ? logs.length : 10, logs.length)} of {totalCount} logs
              </div>
              {!showMore && logs.length > 10 ? (
                <Button
                  onClick={() => setShowMore(true)}
                  variant="outline"
                  className="mr-4"
                >
                  Show More ({logs.length - 10} more)
                </Button>
              ) : null}
              {hasMore && (
                <Button
                  onClick={loadMore}
                  disabled={loadingMore}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

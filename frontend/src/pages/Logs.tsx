import { useState, useMemo } from "react";
import { useAnalytics, RequestLog, AnalyticsFilters } from "@/hooks/useAnalytics";
import { Input } from "@/components/kibo-ui/input";
import { Button } from "@/components/kibo-ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/kibo-ui/select";
import {
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Zap,
  ArrowRightLeft // Added for key rotation visualization
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/kibo-ui/badge";

const Logs = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const filters: AnalyticsFilters = {
    timeRange,
    searchQuery,
    statusFilter,
    limit: itemsPerPage,
    offset: 0
  };

  const { logs, loading, loadingMore, error, hasMore, totalCount, loadMore, refetch } = useAnalytics(filters);

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

  const toggleLogExpansion = (logId: string) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Model', 'Provider', 'Key Name', 'Status', 'Response Time (ms)', 'Latency (TTFT ms)', 'Speed (tok/s)', 'Input Tokens', 'Output Tokens', 'Total Tokens', 'Cost', 'Fallback', 'Rotated', 'Error'].join(','),
      ...logs.map(log => [
        log.time_stamp ? new Date(log.time_stamp).toISOString() : 'N/A',
        log.model || 'N/A',
        log.provider || 'N/A',
        log.key_name || 'N/A',
        log.status || 'N/A',
        log.response_time_ms || 'N/A',
        log.latency_ms || '0',
        log.tokens_per_second ? log.tokens_per_second.toFixed(2) : '0',
        log.input_tokens || '0',
        log.output_tokens || '0',
        log.total_tokens || 'N/A',
        log.estimated_cost || '0',
        log.is_fallback ? 'Yes' : 'No',
        (log.key_rotation_log && log.key_rotation_log.length > 1) ? 'Yes' : 'No',
        log.status && log.status >= 400 ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const displayedLogs = useMemo(() => {
    return logs.slice(0, page * itemsPerPage);
  }, [logs, page]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#b0b0b0] bg-[#030303]">
        Please sign in to view logs.
      </div>
    );
  }

  if (loading && logs.length === 0) { // Only show full page loader if no logs are loaded yet
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-[#0a0a0a]/50 backdrop-blur-md p-8 rounded-[1.5rem] border border-[#1b1b1b] shadow-2xl">
          <RefreshCw className="w-10 h-10 animate-spin text-[#93c5fd] mx-auto mb-4" />
          <p className="text-[#b0b0b0] text-lg">Loading logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-[0.2rem] sm:tracking-[0.25rem] text-[#6f6f6f] mb-2 sm:mb-3">
              Request Logs
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              API Request Logs
            </h1>
            <p className="text-sm sm:text-base text-[#9d9d9d] mt-2 sm:mt-3 max-w-2xl">
              View all API requests, responses, and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="border-[#333333] text-[#d7d7d7] hover:bg-[#111111] w-full sm:w-auto"
              onClick={exportLogs}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              className="border-[#333333] text-[#d7d7d7] hover:bg-[#111111] w-full sm:w-auto"
              onClick={() => refetch()}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6f6f6f]" />
              <Input
                placeholder="Search by model, provider, or key name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#0a0a0a]/50 backdrop-blur-md border-[#1b1b1b] text-white placeholder-[#6f6f6f]"
              />
            </div>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-40 bg-[#0a0a0a]/50 backdrop-blur-md border-[#1b1b1b] text-white hover:bg-[#121212]/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0a0a]/80 backdrop-blur-md border-[#1b1b1b] text-white">
              <SelectItem value="all" className="text-white focus:bg-[#151515]/50">All Time</SelectItem>
              <SelectItem value="1d" className="text-white focus:bg-[#151515]/50">Last 24h</SelectItem>
              <SelectItem value="7d" className="text-white focus:bg-[#151515]/50">Last 7 days</SelectItem>
              <SelectItem value="30d" className="text-white focus:bg-[#151515]/50">Last 30 days</SelectItem>
              <SelectItem value="90d" className="text-white focus:bg-[#151515]/50">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-[#0a0a0a]/50 backdrop-blur-md border-[#1b1b1b] text-white hover:bg-[#121212]/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0a0a]/80 backdrop-blur-md border-[#1b1b1b] text-white">
              <SelectItem value="all" className="text-white focus:bg-[#151515]/50">All Status</SelectItem>
              <SelectItem value="success" className="text-white focus:bg-[#151515]/50">Success</SelectItem>
              <SelectItem value="error" className="text-white focus:bg-[#151515]/50">Errors</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#0a0a0a]/50 backdrop-blur-md border border-[#1b1b1b] rounded-[1.5rem] p-3 sm:p-4 shadow-2xl">
            <p className="text-xs sm:text-sm text-[#7f7f7f] mb-1">Total Logs</p>
            <p className="text-xl sm:text-2xl font-semibold">{totalCount.toLocaleString()}</p>
          </div>
          <div className="bg-[#0a0a0a]/50 backdrop-blur-md border border-[#1b1b1b] rounded-[1.5rem] p-3 sm:p-4 shadow-2xl">
            <p className="text-xs sm:text-sm text-[#7f7f7f] mb-1">Success</p>
            <p className="text-xl sm:text-2xl font-semibold text-green-500">
              {logs.filter(l => l.status && l.status >= 200 && l.status < 300).length}
            </p>
          </div>
          <div className="bg-[#0a0a0a]/50 backdrop-blur-md border border-[#1b1b1b] rounded-[1.5rem] p-3 sm:p-4 shadow-2xl">
            <p className="text-xs sm:text-sm text-[#7f7f7f] mb-1">Errors</p>
            <p className="text-xl sm:text-2xl font-semibold text-red-500">
              {logs.filter(l => l.status && l.status >= 400).length}
            </p>
          </div>
          <div className="bg-[#0a0a0a]/50 backdrop-blur-md border border-[#1b1b1b] rounded-[1.5rem] p-3 sm:p-4 shadow-2xl">
            <p className="text-xs sm:text-sm text-[#7f7f7f] mb-1">Avg Response</p>
            <p className="text-xl sm:text-2xl font-semibold">
              {logs.length > 0
                ? `${Math.round(logs.reduce((acc, l) => acc + (l.response_time_ms || 0), 0) / logs.length)}ms`
                : '0ms'}
            </p>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-[#0a0a0a]/50 backdrop-blur-md border border-[#1b1b1b] rounded-[1.5rem] overflow-hidden shadow-2xl">
          {loading && logs.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-[#8c8c8c] bg-[#0a0a0a]/50 backdrop-blur-md">
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Loading logs...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-16 text-red-500 bg-[#0a0a0a]/50 backdrop-blur-md">
              <AlertCircle className="w-5 h-5 mr-2" />
              Error loading logs: {error.message}
            </div>
          ) : displayedLogs.length === 0 ? (
            <div className="text-center py-16 text-[#9d9d9d] bg-[#0a0a0a]/50 backdrop-blur-md">
              <p>No logs found matching your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0f0f0f]/50 border-b border-[#1b1b1b]">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#b5b5b5] uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#b5b5b5] uppercase tracking-wider">
                      Model
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#b5b5b5] uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#b5b5b5] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#b5b5b5] uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#b5b5b5] uppercase tracking-wider">
                      Tokens (In/Out)
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#b5b5b5] uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-[#b5b5b5] uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111111]">
                  {displayedLogs.map((log: RequestLog) => {
                    const isExpanded = expandedLogs.has(log.log_id);
                    const hasRotation = log.key_rotation_log && log.key_rotation_log.length > 1;

                    return (
                      <>
                        <tr key={log.log_id} className="hover:bg-[#0f0f0f]/50 transition-colors">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-[#9d9d9d] font-mono">
                            {log.time_stamp ? new Date(log.time_stamp).toLocaleString() : 'N/A'}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm font-medium text-white break-all max-w-[250px]">
                            <div className="flex flex-col gap-1">
                              <span>{log.model || 'N/A'}</span>
                              <div className="flex gap-1">
                                {log.is_fallback && <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Fallback</Badge>}
                                {hasRotation && <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-blue-500/10 text-blue-500 border-blue-500/20">Rotated</Badge>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-[#9d9d9d] break-all max-w-[150px]">
                            {log.provider || 'N/A'}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(log.status)}
                              <span className={`text-sm font-medium ${getStatusColor(log.status)}`}>
                                {log.status || 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                            <div className="flex flex-col">
                              <span>{log.response_time_ms ? `${log.response_time_ms}ms` : 'N/A'}</span>
                              <span className="text-xs text-[#6f6f6f]">
                                {log.latency_ms ? `TTFT: ${Math.round(log.latency_ms)}ms` : ''}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-white">
                            <div className="flex flex-col">
                              <span>{log.total_tokens ? log.total_tokens.toLocaleString() : 'N/A'}</span>
                              <span className="text-xs text-[#6f6f6f]">
                                {log.input_tokens || 0} / {log.output_tokens || 0}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-white">
                            {log.estimated_cost ? `$${log.estimated_cost.toFixed(4)}` : '$0.0000'}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleLogExpansion(log.log_id)}
                              className="text-[#9d9d9d] hover:text-white"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={8} className="px-4 sm:px-6 py-4 bg-[#0f0f0f]/50">
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#0a0a0a]/50 p-3 rounded-[1rem] border border-[#1b1b1b]">
                                  <div>
                                    <span className="text-[#7f7f7f] text-xs uppercase tracking-wider block mb-1">Performance</span>
                                    <div className="space-y-1">
                                      <div className="flex justify-between">
                                        <span className="text-[#9d9d9d] text-xs">Latency (TTFT):</span>
                                        <span className="text-white text-xs">{log.latency_ms ? `${Math.round(log.latency_ms)}ms` : 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-[#9d9d9d] text-xs">Speed:</span>
                                        <span className="text-white text-xs">{log.tokens_per_second ? `${log.tokens_per_second.toFixed(1)} t/s` : 'N/A'}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-[#7f7f7f] text-xs uppercase tracking-wider block mb-1">Token Usage</span>
                                    <div className="space-y-1">
                                      <div className="flex justify-between">
                                        <span className="text-[#9d9d9d] text-xs">Input:</span>
                                        <span className="text-white text-xs">{log.input_tokens || 0}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-[#9d9d9d] text-xs">Output:</span>
                                        <span className="text-white text-xs">{log.output_tokens || 0}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-[#7f7f7f] text-xs uppercase tracking-wider block mb-1">Request Info</span>
                                    <div className="space-y-1">
                                      <div className="flex justify-between">
                                        <span className="text-[#9d9d9d] text-xs">Key Name:</span>
                                        <span className="text-white text-xs">{log.key_name || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-[#9d9d9d] text-xs">Fallback Used:</span>
                                        <span className={`text-xs ${log.is_fallback ? 'text-yellow-500' : 'text-white'}`}>{log.is_fallback ? 'Yes' : 'No'}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-[#7f7f7f] text-xs uppercase tracking-wider block mb-1">Rotation Log</span>
                                    <div className="space-y-1 max-h-20 overflow-y-auto">
                                      {log.key_rotation_log && log.key_rotation_log.length > 0 ? (
                                        log.key_rotation_log.map((entry: any, i: number) => (
                                          <div key={i} className="flex justify-between text-xs">
                                            <span className="text-[#9d9d9d]">{entry.key}:</span>
                                            <span className={entry.status === 'success' ? 'text-green-500' : 'text-red-500'}>{entry.status}</span>
                                          </div>
                                        ))
                                      ) : (
                                        <span className="text-[#555] text-xs">No rotation events</span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium text-white mb-2">Request Payload</h4>
                                  <pre className="text-xs bg-[#0a0a0a]/50 p-3 rounded-[1rem] border border-[#1b1b1b] overflow-x-auto text-[#9d9d9d]">
                                    {JSON.stringify(log.request_payload, null, 2)}
                                  </pre>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-white mb-2">Response Payload</h4>
                                  <pre className="text-xs bg-[#0a0a0a]/50 p-3 rounded-[1rem] border border-[#1b1b1b] overflow-x-auto text-[#9d9d9d]">
                                    {JSON.stringify(log.response_payload, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Load More */}
        {hasMore && !loading && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setPage(prev => prev + 1);
                loadMore();
              }}
              disabled={loadingMore}
              className="border-[#333333] text-[#d7d7d7] hover:bg-[#111111]"
            >
              {loadingMore ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
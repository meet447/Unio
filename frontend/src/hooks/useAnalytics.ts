import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PostgrestError } from '@supabase/supabase-js';

export interface RequestLog {
  log_id: string;
  user_id: string | null;
  api_key: string;
  provider: string | null;
  model: string | null;
  status: number | null;
  request_payload: any | null;
  response_payload: any | null;
  input_tokens: number | null;
  output_tokens: number | null;
  total_tokens: number | null;
  estimated_cost: number | null;
  response_time_ms: number | null;
  latency_ms: number | null;
  tokens_per_second: number | null;
  time_stamp: string | null;
  key_name: string | null;
  is_fallback: boolean | null;
  key_rotation_log: any[] | null;
  is_cache_hit: boolean | null;
}

export interface AnalyticsFilters {
  timeRange: string;
  statusFilter: string;
  searchQuery: string;
  limit?: number;
  offset?: number;
}

export interface ChartDataPoint {
  time: string;
  requests: number;
  responseTime: number;
  cost: number;
  errors: number;
}

export interface ModelUsage {
  name: string;
  value: number;
}

export interface ProviderUsage {
  name: string;
  requests: number;
  cost: number;
}

export const useAnalytics = (filters: AnalyticsFilters = {
  timeRange: 'all',
  statusFilter: 'all',
  searchQuery: '',
  limit: 50,
  offset: 0
}) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [allLogsForAnalytics, setAllLogsForAnalytics] = useState<RequestLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Calculate date range based on timeRange filter
  const getDateRange = useCallback((timeRange: string) => {
    if (timeRange === 'all') {
      // Return a very old date to get all records
      return new Date('2020-01-01');
    }

    const now = new Date();
    const ranges = {
      '1d': new Date(now.getTime() - 24 * 60 * 60 * 1000),
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      '90d': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
    };
    return ranges[timeRange as keyof typeof ranges] || new Date('2020-01-01');
  }, []);

  // Fetch all logs for analytics (without pagination)
  const fetchAllLogsForAnalytics = useCallback(async () => {
    if (!user) return;

    try {
      const startDate = getDateRange(filters.timeRange);

      // Build query for all logs (no pagination, but with high limit)
      // Supabase default limit is 1000, so we need to explicitly set a higher limit
      let analyticsQuery = supabase
        .from('request_logs')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('time_stamp', { ascending: false })
        .limit(100000); // Set a very high limit to get all records

      // Apply time range filter only if not 'all'
      if (filters.timeRange !== 'all') {
        analyticsQuery = analyticsQuery.gte('time_stamp', startDate.toISOString());
      }

      // Apply status filter for analytics
      if (filters.statusFilter === 'success') {
        analyticsQuery = analyticsQuery.gte('status', 200).lt('status', 300);
      } else if (filters.statusFilter === 'error') {
        analyticsQuery = analyticsQuery.gte('status', 400);
      }

      // Apply search filter for analytics
      if (filters.searchQuery) {
        analyticsQuery = analyticsQuery.or(`provider.ilike.%${filters.searchQuery}%,model.ilike.%${filters.searchQuery}%,key_name.ilike.%${filters.searchQuery}%`);
      }

      const analyticsResult = await analyticsQuery;

      if (analyticsResult.error) {
        console.error('Error fetching analytics data:', analyticsResult.error);
        setError(analyticsResult.error);
        setAllLogsForAnalytics([]);
        return;
      }

      // If we hit the limit, fetch remaining records in batches
      let allData = (analyticsResult.data as any[]) || [];
      const totalCount = analyticsResult.count || 0;

      // If there are more records than we fetched, fetch them in batches
      if (totalCount > allData.length && allData.length >= 100000) {
        const batches: any[] = [];
        let offset = 100000;

        while (offset < totalCount) {
          const batchSize = Math.min(100000, totalCount - offset);
          const batchQuery = supabase
            .from('request_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('time_stamp', { ascending: false })
            .range(offset, offset + batchSize - 1);

          // Apply same filters
          if (filters.timeRange !== 'all') {
            batchQuery.gte('time_stamp', startDate.toISOString());
          }
          if (filters.statusFilter === 'success') {
            batchQuery.gte('status', 200).lt('status', 300);
          } else if (filters.statusFilter === 'error') {
            batchQuery.gte('status', 400);
          }
          if (filters.searchQuery) {
            batchQuery.or(`provider.ilike.%${filters.searchQuery}%,model.ilike.%${filters.searchQuery}%,key_name.ilike.%${filters.searchQuery}%`);
          }

          const batchResult = await batchQuery;
          if (batchResult.error) {
            console.error('Error fetching batch:', batchResult.error);
            break;
          }

          if (batchResult.data && batchResult.data.length > 0) {
            batches.push(...batchResult.data);
            offset += batchResult.data.length;
          } else {
            break;
          }
        }

        allData = [...allData, ...batches];
      }

      // Process the data - key_name is already a column in request_logs
      const processedData = allData.map((row: any) => ({
        log_id: row.log_id,
        user_id: row.user_id,
        api_key: row.api_key,
        provider: row.provider,
        model: row.model,
        status: row.status,
        request_payload: row.request_payload,
        response_payload: row.response_payload,
        input_tokens: row.input_tokens || row.prompt_tokens, // Fallback for old data
        output_tokens: row.output_tokens || row.completion_tokens, // Fallback for old data
        total_tokens: row.total_tokens,
        estimated_cost: row.estimated_cost,
        response_time_ms: row.response_time_ms,
        latency_ms: row.latency_ms,
        tokens_per_second: row.tokens_per_second,
        time_stamp: row.time_stamp,
        key_name: row.key_name || null,
        is_fallback: row.is_fallback,
        key_rotation_log: row.key_rotation_log,
        is_cache_hit: row.is_cache_hit
      })) as RequestLog[];

      setAllLogsForAnalytics(processedData);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err as PostgrestError);
      setAllLogsForAnalytics([]);
    }
  }, [user, filters.timeRange, filters.statusFilter, filters.searchQuery, getDateRange]);

  const fetchLogs = useCallback(async (loadMore = false) => {
    if (!user) return;

    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
    }

    try {
      const startDate = getDateRange(filters.timeRange);
      const currentOffset = loadMore ? logs.length : (filters.offset || 0);
      const currentLimit = filters.limit || 50;

      // Build query for paginated logs
      let query = supabase
        .from('request_logs')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('time_stamp', { ascending: false });

      // Apply time range filter only if not 'all'
      if (filters.timeRange !== 'all') {
        query = query.gte('time_stamp', startDate.toISOString());
      }

      // Apply status filter
      if (filters.statusFilter === 'success') {
        query = query.gte('status', 200).lt('status', 300);
      } else if (filters.statusFilter === 'error') {
        query = query.gte('status', 400);
      }

      // Apply search filter
      if (filters.searchQuery) {
        // Note: key_name might not be directly searchable, so we search provider and model
        query = query.or(`provider.ilike.%${filters.searchQuery}%,model.ilike.%${filters.searchQuery}%,key_name.ilike.%${filters.searchQuery}%`);
      }

      // Apply pagination
      query = query.range(currentOffset, currentOffset + currentLimit - 1);

      const result = await query;

      if (result.error) {
        throw result.error;
      }

      // Map the data to ensure all fields are present
      const data = ((result.data || []) as any[]).map((row: any) => ({
        log_id: row.log_id,
        user_id: row.user_id,
        api_key: row.api_key || '',
        provider: row.provider,
        model: row.model,
        status: row.status,
        request_payload: row.request_payload,
        response_payload: row.response_payload,
        input_tokens: row.input_tokens || row.prompt_tokens,
        output_tokens: row.output_tokens || row.completion_tokens,
        total_tokens: row.total_tokens,
        estimated_cost: row.estimated_cost,
        response_time_ms: row.response_time_ms,
        latency_ms: row.latency_ms,
        tokens_per_second: row.tokens_per_second,
        time_stamp: row.time_stamp,
        key_name: row.key_name || null,
        is_fallback: row.is_fallback,
        key_rotation_log: row.key_rotation_log,
        is_cache_hit: row.is_cache_hit
      })) as RequestLog[];
      const count = result.count || 0;

      if (loadMore) {
        setLogs(prev => [...prev, ...data]);
      } else {
        setLogs(data);
      }

      setTotalCount(count);
      setHasMore(data.length === currentLimit);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err as PostgrestError);
      if (!loadMore) {
        setLogs([]);
        setTotalCount(0);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user, filters, logs.length, getDateRange]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchLogs(true);
    }
  }, [fetchLogs, loadingMore, hasMore]);

  // Generate chart data from ALL logs for analytics
  const chartData = useMemo(() => {
    const dataSource = allLogsForAnalytics;

    if (dataSource.length === 0) {
      // Return empty array when no data is available
      return [];
    }

    // Group ALL logs by hour for better granularity
    const groupedData = new Map<string, ChartDataPoint>();

    dataSource.forEach(log => {
      if (!log.time_stamp) return;

      const date = new Date(log.time_stamp);
      const hourKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;

      if (!groupedData.has(hourKey)) {
        groupedData.set(hourKey, {
          time: hourKey,
          requests: 0,
          responseTime: 0,
          cost: 0,
          errors: 0
        });
      }

      const point = groupedData.get(hourKey)!;
      point.requests += 1;
      point.responseTime += log.response_time_ms || 0;
      point.cost += log.estimated_cost || 0;
      if (log.status && log.status >= 400) {
        point.errors += 1;
      }
    });

    // Calculate averages and format data
    return Array.from(groupedData.values())
      .map(point => ({
        ...point,
        responseTime: point.requests > 0 ? Math.round(point.responseTime / point.requests) : 0
      }))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
      .slice(-72); // Show last 72 hours of data for better visualization
  }, [allLogsForAnalytics]);

  const { modelUsage, providerUsage } = useMemo(() => {
    const dataSource = allLogsForAnalytics;
    if (dataSource.length === 0) return { modelUsage: [], providerUsage: [] };

    const mUsage = new Map<string, number>();
    const pUsage = new Map<string, { requests: number; cost: number }>();

    dataSource.forEach(log => {
      const model = log.model || 'Unknown';
      const provider = log.provider || 'Unknown';

      mUsage.set(model, (mUsage.get(model) || 0) + 1);

      if (!pUsage.has(provider)) {
        pUsage.set(provider, { requests: 0, cost: 0 });
      }
      const p = pUsage.get(provider)!;
      p.requests += 1;
      p.cost += log.estimated_cost || 0;
    });

    const sortedModelUsage = Array.from(mUsage.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 models

    const sortedProviderUsage = Array.from(pUsage.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 8); // Top 8 providers

    return { modelUsage: sortedModelUsage, providerUsage: sortedProviderUsage };
  }, [allLogsForAnalytics]);

  // Calculate summary statistics from ALL logs for analytics
  const stats = useMemo(() => {
    const dataSource = allLogsForAnalytics;

    if (dataSource.length === 0) {
      // Return zero stats when no data is available
      return {
        totalRequests: 0,
        successRate: 0,
        avgResponseTime: 0,
        totalCost: 0,
        errorCount: 0
      };
    }

    const totalRequests = dataSource.length;
    const successfulRequests = dataSource.filter(log => log.status && log.status >= 200 && log.status < 300).length;
    const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;
    const avgResponseTime = dataSource.reduce((acc, log) => acc + (log.response_time_ms || 0), 0) / totalRequests;
    const totalCost = dataSource.reduce((acc, log) => acc + (log.estimated_cost || 0), 0);
    const errorCount = dataSource.filter(log => log.status && log.status >= 400).length;

    return {
      totalRequests,
      successRate,
      avgResponseTime,
      totalCost,
      errorCount
    };
  }, [allLogsForAnalytics]);

  useEffect(() => {
    fetchAllLogsForAnalytics();
    fetchLogs();
  }, [user, filters.timeRange, filters.statusFilter, filters.searchQuery]);

  return {
    logs,
    allLogs: allLogsForAnalytics,
    loading,
    loadingMore,
    error,
    hasMore,
    totalCount,
    loadMore,
    refetch: () => {
      fetchAllLogsForAnalytics();
      fetchLogs();
    },
    chartData,
    stats,
    modelUsage,
    providerUsage
  };
};

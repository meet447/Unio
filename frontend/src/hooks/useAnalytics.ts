import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PostgrestError } from '@supabase/supabase-js';

export interface RequestLog {
  log_id: string;
  time_stamp: string | null;
  model: string | null;
  provider: string | null;
  status: number | null;
  response_time_ms: number | null;
  total_tokens: number | null;
  estimated_cost: number | null;
}

export const useAnalytics = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchLogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('request_logs')
        .select('log_id,time_stamp,model,provider,status,response_time_ms,total_tokens,estimated_cost')
        .eq('user_id', user.id)
        .order('time_stamp', { ascending: false });

      if (error) {
        setError(error);
      } else {
        setLogs(data as RequestLog[]);
      }
      setLoading(false);
    };

    fetchLogs();
  }, [user]);

  return { logs, loading, error };
};

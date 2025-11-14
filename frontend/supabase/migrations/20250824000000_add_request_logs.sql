-- Create request_logs table for API analytics
CREATE TABLE public.request_logs (
  log_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  api_key_id UUID REFERENCES public.api_keys ON DELETE SET NULL,
  provider TEXT NOT NULL,
  model TEXT,
  request_path TEXT,
  method TEXT,
  status INTEGER,
  response_time_ms INTEGER,
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER,
  estimated_cost DECIMAL(10, 6),
  error_message TEXT,
  user_agent TEXT,
  ip_address INET,
  time_stamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on request_logs table
ALTER TABLE public.request_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for request_logs
CREATE POLICY "Users can view their own request logs" 
ON public.request_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own request logs" 
ON public.request_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_request_logs_user_id ON public.request_logs(user_id);
CREATE INDEX idx_request_logs_time_stamp ON public.request_logs(time_stamp DESC);
CREATE INDEX idx_request_logs_provider ON public.request_logs(provider);
CREATE INDEX idx_request_logs_status ON public.request_logs(status);
CREATE INDEX idx_request_logs_user_time ON public.request_logs(user_id, time_stamp DESC);

-- Add comments for documentation
COMMENT ON TABLE public.request_logs IS 'Stores API request logs for analytics and monitoring';
COMMENT ON COLUMN public.request_logs.log_id IS 'Unique identifier for each log entry';
COMMENT ON COLUMN public.request_logs.user_id IS 'User who made the request';
COMMENT ON COLUMN public.request_logs.api_key_id IS 'API key used for the request';
COMMENT ON COLUMN public.request_logs.provider IS 'AI provider name (OpenAI, Anthropic, etc.)';
COMMENT ON COLUMN public.request_logs.model IS 'Model name used for the request';
COMMENT ON COLUMN public.request_logs.status IS 'HTTP response status code';
COMMENT ON COLUMN public.request_logs.response_time_ms IS 'Response time in milliseconds';
COMMENT ON COLUMN public.request_logs.estimated_cost IS 'Estimated cost of the request';
COMMENT ON COLUMN public.request_logs.time_stamp IS 'When the request was made';
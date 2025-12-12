-- Add missing columns to request_logs
ALTER TABLE public.request_logs 
ADD COLUMN IF NOT EXISTS api_key TEXT,
ADD COLUMN IF NOT EXISTS request_payload JSONB,
ADD COLUMN IF NOT EXISTS response_payload JSONB,
ADD COLUMN IF NOT EXISTS key_name TEXT;

-- Create function to increment API key usage
CREATE OR REPLACE FUNCTION public.increment_api_key_usage(key_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.api_keys
  SET usage_count = usage_count + 1
  WHERE id = key_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment API key rate limit
CREATE OR REPLACE FUNCTION public.increment_api_key_rate_limit(key_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Placeholder: currently we only track total usage_count
  NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced logging columns
ALTER TABLE public.request_logs
ADD COLUMN IF NOT EXISTS is_fallback BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS key_rotation_log JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS latency_ms INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tokens_per_second DECIMAL(10, 2) DEFAULT 0.0,
-- Ensure input/output tokens exist (in case previous manual migration wasn't run)
ADD COLUMN IF NOT EXISTS input_tokens INTEGER,
ADD COLUMN IF NOT EXISTS output_tokens INTEGER;

-- Comment on columns
COMMENT ON COLUMN public.request_logs.latency_ms IS 'Time to first token (TTFT) in milliseconds';
COMMENT ON COLUMN public.request_logs.tokens_per_second IS 'Token generation speed (tokens/sec)';
COMMENT ON COLUMN public.request_logs.key_rotation_log IS 'Log of keys tried during the request';

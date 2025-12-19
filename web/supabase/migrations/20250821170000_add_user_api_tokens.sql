-- Create user_api_tokens table for personal access tokens
CREATE TABLE public.user_api_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT 'Personal Access Token',
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_api_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_api_tokens
CREATE POLICY "Users can view their own API tokens" 
ON public.user_api_tokens FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API tokens" 
ON public.user_api_tokens FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API tokens" 
ON public.user_api_tokens FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API tokens" 
ON public.user_api_tokens FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_api_tokens_updated_at
  BEFORE UPDATE ON public.user_api_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
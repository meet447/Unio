-- Add base_url and user_id to providers table
ALTER TABLE public.providers 
ADD COLUMN base_url TEXT,
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing providers with known base URLs and standardize names
UPDATE public.providers SET base_url = 'https://openrouter.ai/api/v1', name = 'openrouter' WHERE name = 'OpenRouter';
UPDATE public.providers SET base_url = 'https://api.openai.com/v1', name = 'openai' WHERE name = 'OpenAI';
UPDATE public.providers SET base_url = 'https://api.groq.com/openai/v1', name = 'groq' WHERE name = 'Groq';
UPDATE public.providers SET name = 'google' WHERE name = 'Google Cloud';
UPDATE public.providers SET name = 'aws' WHERE name = 'AWS';
UPDATE public.providers SET name = 'anthropic' WHERE name = 'Anthropic';

-- Update RLS for providers
DROP POLICY IF EXISTS "Providers are viewable by everyone" ON public.providers;

CREATE POLICY "Public providers are viewable by everyone" 
ON public.providers FOR SELECT 
USING (user_id IS NULL);

CREATE POLICY "Users can view their own providers" 
ON public.providers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own providers" 
ON public.providers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own providers" 
ON public.providers FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own providers" 
ON public.providers FOR DELETE 
USING (auth.uid() = user_id);
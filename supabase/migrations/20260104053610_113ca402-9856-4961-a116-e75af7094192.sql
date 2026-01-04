-- Create a table to store user API keys securely
CREATE TABLE public.user_api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  groq_api_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- Users can only view their own API key
CREATE POLICY "Users can view their own API key"
ON public.user_api_keys
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own API key
CREATE POLICY "Users can insert their own API key"
ON public.user_api_keys
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own API key
CREATE POLICY "Users can update their own API key"
ON public.user_api_keys
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own API key
CREATE POLICY "Users can delete their own API key"
ON public.user_api_keys
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger to update the updated_at column
CREATE TRIGGER update_user_api_keys_updated_at
BEFORE UPDATE ON public.user_api_keys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
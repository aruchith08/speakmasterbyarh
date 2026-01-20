-- Create vocabulary bank table
CREATE TABLE public.user_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  word TEXT NOT NULL,
  definition TEXT,
  example_sentence TEXT,
  source_session_id UUID REFERENCES public.session_summaries(id) ON DELETE SET NULL,
  mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 5),
  next_review_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS on vocabulary
ALTER TABLE public.user_vocabulary ENABLE ROW LEVEL SECURITY;

-- Vocabulary policies
CREATE POLICY "Users can view their own vocabulary"
  ON public.user_vocabulary FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vocabulary"
  ON public.user_vocabulary FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vocabulary"
  ON public.user_vocabulary FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vocabulary"
  ON public.user_vocabulary FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Achievement policies
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add timestamp trigger for vocabulary
CREATE TRIGGER update_user_vocabulary_updated_at
  BEFORE UPDATE ON public.user_vocabulary
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for achievements
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_vocabulary;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_achievements;
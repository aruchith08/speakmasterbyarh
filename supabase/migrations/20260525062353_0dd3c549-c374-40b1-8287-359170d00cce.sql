-- Cleanup any orphaned API keys before adding FK
DELETE FROM public.user_api_keys
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Add cascading FK so deleted users clean up their api key
ALTER TABLE public.user_api_keys
  ADD CONSTRAINT user_api_keys_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Deduplicate any existing vocabulary rows on (user_id, lower(word)) keeping oldest
DELETE FROM public.user_vocabulary a
USING public.user_vocabulary b
WHERE a.user_id = b.user_id
  AND lower(a.word) = lower(b.word)
  AND a.created_at > b.created_at;

-- Prevent future duplicates (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS user_vocabulary_user_word_unique
  ON public.user_vocabulary (user_id, lower(word));
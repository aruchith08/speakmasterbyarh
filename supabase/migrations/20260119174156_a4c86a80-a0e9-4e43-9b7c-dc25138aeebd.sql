-- Enable realtime for stats tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_summaries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.learning_progress;
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface VocabularyWord {
  id: string;
  word: string;
  definition: string | null;
  example_sentence: string | null;
  mastery_level: number;
  next_review_date: string;
  created_at: string;
  source_session_id: string | null;
}

export const useVocabulary = () => {
  const { user } = useAuth();
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVocabulary = useCallback(async () => {
    if (!user) {
      setVocabulary([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_vocabulary')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVocabulary(data || []);
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVocabulary();

    if (!user) return;

    const channel = supabase
      .channel('vocabulary-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_vocabulary', filter: `user_id=eq.${user.id}` },
        () => {
          fetchVocabulary();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchVocabulary]);

  const addWord = async (word: string, definition?: string, example?: string, sessionId?: string) => {
    if (!user) {
      toast.error('Please sign in to save vocabulary');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_vocabulary')
        .insert({
          user_id: user.id,
          word: word.toLowerCase().trim(),
          definition,
          example_sentence: example,
          source_session_id: sessionId,
        });

      if (error) {
        if (error.code === '23505') {
          toast.info('Word already in your vocabulary');
          return false;
        }
        throw error;
      }

      toast.success(`"${word}" added to vocabulary`);
      return true;
    } catch (error) {
      console.error('Error adding word:', error);
      toast.error('Failed to add word');
      return false;
    }
  };

  const updateMastery = async (wordId: string, newLevel: number) => {
    if (!user) return false;

    try {
      // Calculate next review date based on mastery level (spaced repetition)
      const daysUntilReview = Math.pow(2, newLevel); // 2, 4, 8, 16, 32 days
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + daysUntilReview);

      const { error } = await supabase
        .from('user_vocabulary')
        .update({
          mastery_level: Math.min(newLevel, 5),
          next_review_date: nextReviewDate.toISOString(),
        })
        .eq('id', wordId)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating mastery:', error);
      return false;
    }
  };

  const deleteWord = async (wordId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_vocabulary')
        .delete()
        .eq('id', wordId)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Word removed from vocabulary');
      return true;
    } catch (error) {
      console.error('Error deleting word:', error);
      toast.error('Failed to remove word');
      return false;
    }
  };

  const getWordsForReview = () => {
    const now = new Date();
    return vocabulary.filter(word => new Date(word.next_review_date) <= now);
  };

  return {
    vocabulary,
    isLoading,
    addWord,
    updateMastery,
    deleteWord,
    getWordsForReview,
    refreshVocabulary: fetchVocabulary,
  };
};

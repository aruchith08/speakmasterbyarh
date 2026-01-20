import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'xp' | 'score' | 'sessions' | 'vocabulary';
  requirement: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Streak achievements
  { id: 'streak_3', name: 'Getting Started', description: '3-day practice streak', icon: '🔥', category: 'streak', requirement: 3 },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day practice streak', icon: '⚡', category: 'streak', requirement: 7 },
  { id: 'streak_30', name: 'Monthly Master', description: '30-day practice streak', icon: '🏆', category: 'streak', requirement: 30 },
  
  // XP achievements
  { id: 'xp_100', name: 'First Steps', description: 'Earn 100 XP', icon: '⭐', category: 'xp', requirement: 100 },
  { id: 'xp_500', name: 'Rising Star', description: 'Earn 500 XP', icon: '🌟', category: 'xp', requirement: 500 },
  { id: 'xp_1000', name: 'XP Champion', description: 'Earn 1000 XP', icon: '💫', category: 'xp', requirement: 1000 },
  
  // Score achievements
  { id: 'band_7', name: 'Band 7 Achiever', description: 'Score Band 7 or higher', icon: '🎯', category: 'score', requirement: 7 },
  { id: 'band_8', name: 'Band 8 Expert', description: 'Score Band 8 or higher', icon: '🏅', category: 'score', requirement: 8 },
  { id: 'band_9', name: 'Perfect Score', description: 'Score Band 9', icon: '👑', category: 'score', requirement: 9 },
  
  // Session achievements
  { id: 'sessions_5', name: 'Practice Makes Progress', description: 'Complete 5 sessions', icon: '📝', category: 'sessions', requirement: 5 },
  { id: 'sessions_25', name: 'Dedicated Learner', description: 'Complete 25 sessions', icon: '📚', category: 'sessions', requirement: 25 },
  { id: 'sessions_100', name: 'Century Club', description: 'Complete 100 sessions', icon: '🎓', category: 'sessions', requirement: 100 },
  
  // Vocabulary achievements
  { id: 'vocab_10', name: 'Word Collector', description: 'Save 10 vocabulary words', icon: '📖', category: 'vocabulary', requirement: 10 },
  { id: 'vocab_50', name: 'Lexicon Builder', description: 'Save 50 vocabulary words', icon: '📗', category: 'vocabulary', requirement: 50 },
  { id: 'vocab_100', name: 'Vocabulary Master', description: 'Save 100 vocabulary words', icon: '📕', category: 'vocabulary', requirement: 100 },
];

export const useAchievements = () => {
  const { user } = useAuth();
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAchievements = useCallback(async () => {
    if (!user) {
      setUnlockedAchievements([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setUnlockedAchievements(data?.map(a => a.achievement_id) || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAchievements();

    if (!user) return;

    const channel = supabase
      .channel('achievements-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_achievements', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const newAchievementId = payload.new.achievement_id;
          setUnlockedAchievements(prev => [...prev, newAchievementId]);
          
          const achievement = ACHIEVEMENTS.find(a => a.id === newAchievementId);
          if (achievement) {
            toast.success(`🏆 Achievement Unlocked: ${achievement.name}`, {
              description: achievement.description,
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchAchievements]);

  const checkAndUnlockAchievements = useCallback(async (stats: {
    streakDays?: number;
    totalXp?: number;
    bestBandScore?: number;
    totalSessions?: number;
    vocabularyCount?: number;
  }) => {
    if (!user) return;

    const achievementsToUnlock: string[] = [];

    for (const achievement of ACHIEVEMENTS) {
      if (unlockedAchievements.includes(achievement.id)) continue;

      let shouldUnlock = false;
      switch (achievement.category) {
        case 'streak':
          shouldUnlock = (stats.streakDays || 0) >= achievement.requirement;
          break;
        case 'xp':
          shouldUnlock = (stats.totalXp || 0) >= achievement.requirement;
          break;
        case 'score':
          shouldUnlock = (stats.bestBandScore || 0) >= achievement.requirement;
          break;
        case 'sessions':
          shouldUnlock = (stats.totalSessions || 0) >= achievement.requirement;
          break;
        case 'vocabulary':
          shouldUnlock = (stats.vocabularyCount || 0) >= achievement.requirement;
          break;
      }

      if (shouldUnlock) {
        achievementsToUnlock.push(achievement.id);
      }
    }

    if (achievementsToUnlock.length > 0) {
      const inserts = achievementsToUnlock.map(id => ({
        user_id: user.id,
        achievement_id: id,
      }));

      const { error } = await supabase
        .from('user_achievements')
        .insert(inserts);

      if (error) {
        console.error('Error unlocking achievements:', error);
      }
    }
  }, [user, unlockedAchievements]);

  return {
    achievements: ACHIEVEMENTS,
    unlockedAchievements,
    isLoading,
    checkAndUnlockAchievements,
    refreshAchievements: fetchAchievements,
  };
};

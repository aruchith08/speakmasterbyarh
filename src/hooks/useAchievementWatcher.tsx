import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useRealtimeStats } from "./useRealtimeStats";
import { useVocabulary } from "./useVocabulary";
import { useAchievements } from "./useAchievements";

/**
 * Mounted once at app root. Watches user stats + vocabulary and triggers
 * achievement unlock checks whenever any of them change. Safe no-op when
 * the user is signed out.
 */
export const useAchievementWatcher = () => {
  const { user } = useAuth();
  const { stats } = useRealtimeStats();
  const { vocabulary } = useVocabulary();
  const { checkAndUnlockAchievements, isLoading } = useAchievements();

  useEffect(() => {
    if (!user || isLoading) return;
    // Approximate total XP from sessions (10 XP each) — matches XP awarded on save.
    const totalXp = (stats.sessionsCompleted || 0) * 10;
    checkAndUnlockAchievements({
      streakDays: stats.streak,
      totalXp,
      bestBandScore: stats.bestBandScore,
      totalSessions: stats.sessionsCompleted,
      vocabularyCount: vocabulary.length,
    });
  }, [
    user,
    isLoading,
    stats.streak,
    stats.bestBandScore,
    stats.sessionsCompleted,
    vocabulary.length,
    checkAndUnlockAchievements,
  ]);
};

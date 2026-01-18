import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface UserStats {
  streak: number;
  avgBandScore: number;
  bestBandScore: number;
  sessionsCompleted: number;
  practiceHours: number;
  latestScore: number;
  latestFluency: number;
  latestLexical: number;
  latestPronunciation: number;
}

export interface ActivityDay {
  date: string;
  sessions: number;
  intensity: "none" | "low" | "medium" | "high";
}

export interface Weakness {
  id: number;
  issue: string;
  frequency: number;
  severity: "low" | "medium" | "high";
}

export interface LearningProgress {
  skillArea: string;
  currentLevel: number;
  xpPoints: number;
}

export const useRealtimeStats = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    streak: 0,
    avgBandScore: 0,
    bestBandScore: 0,
    sessionsCompleted: 0,
    practiceHours: 0,
    latestScore: 0,
    latestFluency: 0,
    latestLexical: 0,
    latestPronunciation: 0,
  });
  const [activityData, setActivityData] = useState<ActivityDay[]>([]);
  const [weaknesses, setWeaknesses] = useState<Weakness[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([]);

  const calculateStats = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch profile and sessions in parallel
      const [profileResult, sessionsResult, progressResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("streak_days, last_practice_date")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("session_summaries")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("learning_progress")
          .select("*")
          .eq("user_id", user.id)
      ]);

      const profile = profileResult.data;
      const sessions = sessionsResult.data || [];
      const progress = progressResult.data || [];

      // Calculate basic stats
      const streak = profile?.streak_days || 0;
      const sessionsCompleted = sessions.length;

      // Calculate band scores
      let avgBandScore = 0;
      let bestBandScore = 0;
      let totalDuration = 0;

      if (sessions.length > 0) {
        const sessionsWithBand = sessions.filter(s => s.overall_band != null);
        if (sessionsWithBand.length > 0) {
          avgBandScore = sessionsWithBand.reduce((sum, s) => sum + Number(s.overall_band), 0) / sessionsWithBand.length;
          bestBandScore = Math.max(...sessionsWithBand.map(s => Number(s.overall_band)));
        }

        totalDuration = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
      }

      const practiceHours = Math.round(totalDuration / 3600);

      // Get latest session scores
      let latestScore = 0;
      let latestFluency = 0;
      let latestLexical = 0;
      let latestPronunciation = 0;

      if (sessions.length > 0) {
        const latestSession = sessions[0];
        latestScore = latestSession.overall_band ? Number(latestSession.overall_band) : 0;
        latestFluency = latestSession.fluency_score ? Number(latestSession.fluency_score) * 10 : 0;
        latestLexical = latestSession.lexical_score ? Number(latestSession.lexical_score) * 10 : 0;
        latestPronunciation = latestSession.pronunciation_score ? Number(latestSession.pronunciation_score) * 10 : 0;
      }

      setStats({
        streak,
        avgBandScore,
        bestBandScore,
        sessionsCompleted,
        practiceHours,
        latestScore,
        latestFluency,
        latestLexical,
        latestPronunciation,
      });

      // Calculate activity data for last 28 days
      const activityMap = new Map<string, number>();
      const today = new Date();
      
      for (let i = 27; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        activityMap.set(dateStr, 0);
      }

      sessions.forEach(session => {
        const sessionDate = new Date(session.created_at).toISOString().split("T")[0];
        if (activityMap.has(sessionDate)) {
          activityMap.set(sessionDate, (activityMap.get(sessionDate) || 0) + 1);
        }
      });

      const activity: ActivityDay[] = [];
      activityMap.forEach((sessions, date) => {
        let intensity: ActivityDay["intensity"] = "none";
        if (sessions > 0) intensity = "low";
        if (sessions > 1) intensity = "medium";
        if (sessions > 3) intensity = "high";
        activity.push({ date, sessions, intensity });
      });

      setActivityData(activity);

      // Calculate weaknesses from recent sessions
      const recentWeaknesses = sessions
        .slice(0, 20)
        .flatMap(s => s.weaknesses || []);

      const weaknessCount = new Map<string, number>();
      recentWeaknesses.forEach(w => {
        weaknessCount.set(w, (weaknessCount.get(w) || 0) + 1);
      });

      const weaknessesArray: Weakness[] = [];
      let id = 1;
      weaknessCount.forEach((frequency, issue) => {
        let severity: Weakness["severity"] = "low";
        if (frequency >= 4) severity = "medium";
        if (frequency >= 8) severity = "high";
        weaknessesArray.push({ id: id++, issue, frequency, severity });
      });

      // Sort by frequency descending
      weaknessesArray.sort((a, b) => b.frequency - a.frequency);
      setWeaknesses(weaknessesArray.slice(0, 5));

      // Set learning progress
      const progressArray: LearningProgress[] = progress.map(p => ({
        skillArea: p.skill_area,
        currentLevel: p.current_level || 1,
        xpPoints: p.xp_points || 0,
      }));
      setLearningProgress(progressArray);

    } catch (error) {
      console.error("Error calculating stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to session_summaries changes
    const sessionsChannel = supabase
      .channel('session_summaries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_summaries',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('Session changed, recalculating stats...');
          calculateStats();
        }
      )
      .subscribe();

    // Subscribe to profiles changes
    const profilesChannel = supabase
      .channel('profiles_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('Profile changed, recalculating stats...');
          calculateStats();
        }
      )
      .subscribe();

    // Subscribe to learning_progress changes
    const progressChannel = supabase
      .channel('learning_progress_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'learning_progress',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          console.log('Learning progress changed, recalculating stats...');
          calculateStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(progressChannel);
    };
  }, [user, calculateStats]);

  const updateLearningProgress = useCallback(async (skillArea: string, xpGained: number) => {
    if (!user) return;

    try {
      // Check if record exists
      const { data: existing } = await supabase
        .from("learning_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("skill_area", skillArea)
        .maybeSingle();

      if (existing) {
        const newXp = (existing.xp_points || 0) + xpGained;
        const newLevel = Math.floor(newXp / 100) + 1; // Level up every 100 XP

        await supabase
          .from("learning_progress")
          .update({
            xp_points: newXp,
            current_level: newLevel,
            last_updated: new Date().toISOString()
          })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("learning_progress")
          .insert({
            user_id: user.id,
            skill_area: skillArea,
            xp_points: xpGained,
            current_level: 1
          });
      }
    } catch (error) {
      console.error("Error updating learning progress:", error);
    }
  }, [user]);

  const refreshStats = useCallback(() => {
    calculateStats();
  }, [calculateStats]);

  return {
    stats,
    activityData,
    weaknesses,
    learningProgress,
    isLoading,
    updateLearningProgress,
    refreshStats,
  };
};

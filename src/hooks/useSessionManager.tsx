import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useApiKey } from "./useApiKey";
import { toast } from "sonner";

interface SessionData {
  session_type: string;
  topic?: string;
  transcript?: string;
  fluency_score?: number;
  lexical_score?: number;
  grammar_score?: number;
  pronunciation_score?: number;
  overall_band?: number;
  strengths?: string[];
  weaknesses?: string[];
  ai_feedback?: string;
  optimized_response?: string;
  vocabulary_learned?: string[];
  duration_seconds?: number;
}

interface AnalysisResult {
  fluency_score?: number;
  lexical_score?: number;
  grammar_score?: number;
  pronunciation_score?: number;
  overall_band?: number;
  strengths?: string[];
  weaknesses?: string[];
  ai_feedback?: string;
  optimized_response?: string;
  vocabulary_learned?: string[];
  accuracy_percentage?: number;
  mispronounced_words?: Array<{ word: string; issue: string; correction: string }>;
  target_sounds_analysis?: Array<{ sound: string; attempts: number; correct: number; needs_work: boolean; tips: string }>;
  practice_words?: string[];
  error?: string;
}

export const useSessionManager = () => {
  const { user } = useAuth();
  const { hasApiKey } = useApiKey();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const analyzeTranscript = useCallback(async (
    transcript: string,
    sessionType: string,
    topic?: string
  ): Promise<AnalysisResult | null> => {
    if (!transcript.trim()) {
      toast.error("No transcript to analyze");
      return null;
    }

    if (!user) {
      toast.error("Login required", {
        description: "Sign in and add your Groq API key in Settings to run AI protocols. New here? Create a free account to unlock analysis.",
        duration: 6000,
      });
      return null;
    }

    if (!hasApiKey) {
      toast.error("Groq API key required", {
        description: "Add your free Groq API key in Settings → API Key to enable AI-powered analysis.",
        duration: 6000,
      });
      return null;
    }

    setIsAnalyzing(true);
    try {
      // API key is fetched server-side from database using authenticated user
      const { data, error } = await supabase.functions.invoke("analyze-speech", {
        body: { transcript, sessionType, topic }
      });

      if (error) {
        console.error("Analysis error:", error);
        toast.error("Failed to analyze speech. Please try again.");
        return null;
      }

      if (data.error) {
        toast.error(data.error);
        return null;
      }

      return data as AnalysisResult;
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze speech");
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, hasApiKey]);

  const saveSession = useCallback(async (sessionData: SessionData): Promise<boolean> => {
    if (!user) {
      toast.error("Please sign in to save your progress");
      return false;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from("session_summaries").insert({
        user_id: user.id,
        ...sessionData
      });

      if (error) {
        console.error("Save session error:", error);
        toast.error("Failed to save session");
        return false;
      }

      // Update streak if applicable
      await updateStreak();

      // Award XP for completing a session (10 XP per session)
      await awardSessionXp(sessionData.session_type);
      
      toast.success("Session saved to your profile! +10 XP");
      return true;
    } catch (error) {
      console.error("Save session error:", error);
      toast.error("Failed to save session");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user]);

  const awardSessionXp = useCallback(async (sessionType: string) => {
    if (!user) return;

    try {
      // Check if record exists for this session type
      const { data: existing } = await supabase
        .from("learning_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("skill_area", sessionType)
        .maybeSingle();

      if (existing) {
        const newXp = (existing.xp_points || 0) + 10;
        const newLevel = Math.floor(newXp / 100) + 1;

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
            skill_area: sessionType,
            xp_points: 10,
            current_level: 1
          });
      }
    } catch (error) {
      console.error("Error awarding XP:", error);
    }
  }, [user]);

  const updateStreak = useCallback(async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("streak_days, last_practice_date")
        .eq("user_id", user.id)
        .maybeSingle();

      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      
      let newStreak = 1;
      
      if (profile) {
        if (profile.last_practice_date === yesterday) {
          newStreak = (profile.streak_days || 0) + 1;
        } else if (profile.last_practice_date === today) {
          newStreak = profile.streak_days || 1;
        }
      }

      await supabase
        .from("profiles")
        .update({
          streak_days: newStreak,
          last_practice_date: today
        })
        .eq("user_id", user.id);
    } catch (error) {
      console.error("Update streak error:", error);
    }
  }, [user]);

  const getSessionHistory = useCallback(async (limit = 10) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from("session_summaries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Get history error:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Get history error:", error);
      return [];
    }
  }, [user]);

  const getUserProfile = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Get profile error:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Get profile error:", error);
      return null;
    }
  }, [user]);

  const generatePersonalizedContent = useCallback(async (
    type: string,
    topic?: string,
    level?: number
  ) => {
    if (!user) {
      toast.error("Please sign in to use AI features");
      return null;
    }

    if (!hasApiKey) {
      toast.error("Please add your Groq API key in settings");
      return null;
    }

    try {
      const history = await getSessionHistory(5);
      
      // API key is fetched server-side from database using authenticated user
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { 
          type, 
          topic, 
          level,
          userHistory: history.length > 0 ? {
            avgBand: history.reduce((sum, s) => sum + (s.overall_band || 0), 0) / history.length,
            recentWeaknesses: history.flatMap(s => s.weaknesses || []).slice(0, 5),
            sessionsCompleted: history.length
          } : null
        }
      });

      if (error) {
        console.error("Generate content error:", error);
        toast.error("Failed to generate content");
        return null;
      }

      if (data.error) {
        toast.error(data.error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Generate content error:", error);
      toast.error("Failed to generate content");
      return null;
    }
  }, [user, hasApiKey, getSessionHistory]);

  return {
    analyzeTranscript,
    saveSession,
    getSessionHistory,
    getUserProfile,
    generatePersonalizedContent,
    isAnalyzing,
    isSaving,
    hasApiKey
  };
};

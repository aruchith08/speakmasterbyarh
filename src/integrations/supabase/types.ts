export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      learning_progress: {
        Row: {
          current_level: number | null
          id: string
          last_updated: string
          skill_area: string
          user_id: string
          xp_points: number | null
        }
        Insert: {
          current_level?: number | null
          id?: string
          last_updated?: string
          skill_area: string
          user_id: string
          xp_points?: number | null
        }
        Update: {
          current_level?: number | null
          id?: string
          last_updated?: string
          skill_area?: string
          user_id?: string
          xp_points?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_band_target: number | null
          display_name: string | null
          id: string
          last_practice_date: string | null
          streak_days: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_band_target?: number | null
          display_name?: string | null
          id?: string
          last_practice_date?: string | null
          streak_days?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_band_target?: number | null
          display_name?: string | null
          id?: string
          last_practice_date?: string | null
          streak_days?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      session_summaries: {
        Row: {
          ai_feedback: string | null
          created_at: string
          duration_seconds: number | null
          fluency_score: number | null
          grammar_score: number | null
          id: string
          lexical_score: number | null
          optimized_response: string | null
          overall_band: number | null
          pronunciation_score: number | null
          session_type: string
          strengths: string[] | null
          topic: string | null
          transcript: string | null
          user_id: string
          vocabulary_learned: string[] | null
          weaknesses: string[] | null
        }
        Insert: {
          ai_feedback?: string | null
          created_at?: string
          duration_seconds?: number | null
          fluency_score?: number | null
          grammar_score?: number | null
          id?: string
          lexical_score?: number | null
          optimized_response?: string | null
          overall_band?: number | null
          pronunciation_score?: number | null
          session_type: string
          strengths?: string[] | null
          topic?: string | null
          transcript?: string | null
          user_id: string
          vocabulary_learned?: string[] | null
          weaknesses?: string[] | null
        }
        Update: {
          ai_feedback?: string | null
          created_at?: string
          duration_seconds?: number | null
          fluency_score?: number | null
          grammar_score?: number | null
          id?: string
          lexical_score?: number | null
          optimized_response?: string | null
          overall_band?: number | null
          pronunciation_score?: number | null
          session_type?: string
          strengths?: string[] | null
          topic?: string | null
          transcript?: string | null
          user_id?: string
          vocabulary_learned?: string[] | null
          weaknesses?: string[] | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_api_keys: {
        Row: {
          created_at: string
          groq_api_key: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          groq_api_key: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          groq_api_key?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_vocabulary: {
        Row: {
          created_at: string | null
          definition: string | null
          example_sentence: string | null
          id: string
          mastery_level: number | null
          next_review_date: string | null
          source_session_id: string | null
          updated_at: string | null
          user_id: string
          word: string
        }
        Insert: {
          created_at?: string | null
          definition?: string | null
          example_sentence?: string | null
          id?: string
          mastery_level?: number | null
          next_review_date?: string | null
          source_session_id?: string | null
          updated_at?: string | null
          user_id: string
          word: string
        }
        Update: {
          created_at?: string | null
          definition?: string | null
          example_sentence?: string | null
          id?: string
          mastery_level?: number | null
          next_review_date?: string | null
          source_session_id?: string | null
          updated_at?: string | null
          user_id?: string
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_vocabulary_source_session_id_fkey"
            columns: ["source_session_id"]
            isOneToOne: false
            referencedRelation: "session_summaries"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

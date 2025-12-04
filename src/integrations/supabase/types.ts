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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      avatar_accessories: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          rarity: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number
          rarity?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          rarity?: string | null
        }
        Relationships: []
      }
      barter_offers: {
        Row: {
          created_at: string | null
          id: string
          offered_accessory_id: string
          offerer_id: string
          receiver_id: string | null
          status: string | null
          wanted_accessory_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          offered_accessory_id: string
          offerer_id: string
          receiver_id?: string | null
          status?: string | null
          wanted_accessory_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          offered_accessory_id?: string
          offerer_id?: string
          receiver_id?: string | null
          status?: string | null
          wanted_accessory_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "barter_offers_offered_accessory_id_fkey"
            columns: ["offered_accessory_id"]
            isOneToOne: false
            referencedRelation: "avatar_accessories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barter_offers_wanted_accessory_id_fkey"
            columns: ["wanted_accessory_id"]
            isOneToOne: false
            referencedRelation: "avatar_accessories"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          challenger_id: string
          created_at: string | null
          deadline: string
          id: string
          opponent_id: string | null
          stake_accessory_id: string | null
          stake_coins: number | null
          status: string | null
          subject_id: string
          winner_id: string | null
        }
        Insert: {
          challenger_id: string
          created_at?: string | null
          deadline: string
          id?: string
          opponent_id?: string | null
          stake_accessory_id?: string | null
          stake_coins?: number | null
          status?: string | null
          subject_id: string
          winner_id?: string | null
        }
        Update: {
          challenger_id?: string
          created_at?: string | null
          deadline?: string
          id?: string
          opponent_id?: string | null
          stake_accessory_id?: string | null
          stake_coins?: number | null
          status?: string | null
          subject_id?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_stake_accessory_id_fkey"
            columns: ["stake_accessory_id"]
            isOneToOne: false
            referencedRelation: "avatar_accessories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string | null
          friend_id: string
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          friend_id: string
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          friend_id?: string
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string | null
          deadline: string | null
          id: string
          predicted_value: number | null
          subject_id: string
          target_value: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deadline?: string | null
          id?: string
          predicted_value?: number | null
          subject_id: string
          target_value: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          deadline?: string | null
          id?: string
          predicted_value?: number | null
          subject_id?: string
          target_value?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          academic_year: string | null
          created_at: string | null
          id: string
          period: string | null
          subject_id: string
          user_id: string
          value: number
        }
        Insert: {
          academic_year?: string | null
          created_at?: string | null
          id?: string
          period?: string | null
          subject_id: string
          user_id: string
          value: number
        }
        Update: {
          academic_year?: string | null
          created_at?: string | null
          id?: string
          period?: string | null
          subject_id?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "grades_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_base: string | null
          coins: number | null
          created_at: string | null
          display_name: string | null
          id: string
          level: number | null
          rank: number | null
          streak: number | null
          updated_at: string | null
          user_id: string
          username: string | null
          xp: number | null
          xp_max: number | null
        }
        Insert: {
          avatar_base?: string | null
          coins?: number | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          level?: number | null
          rank?: number | null
          streak?: number | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          xp?: number | null
          xp_max?: number | null
        }
        Update: {
          avatar_base?: string | null
          coins?: number | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          level?: number | null
          rank?: number | null
          streak?: number | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          xp?: number | null
          xp_max?: number | null
        }
        Relationships: []
      }
      subjects: {
        Row: {
          created_at: string | null
          id: string
          name: string
          short_name: string
          target_value: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          short_name: string
          target_value?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          short_name?: string
          target_value?: number | null
        }
        Relationships: []
      }
      user_accessories: {
        Row: {
          accessory_id: string
          equipped: boolean | null
          id: string
          purchased_at: string | null
          user_id: string
        }
        Insert: {
          accessory_id: string
          equipped?: boolean | null
          id?: string
          purchased_at?: string | null
          user_id: string
        }
        Update: {
          accessory_id?: string
          equipped?: boolean | null
          id?: string
          purchased_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_accessories_accessory_id_fkey"
            columns: ["accessory_id"]
            isOneToOne: false
            referencedRelation: "avatar_accessories"
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

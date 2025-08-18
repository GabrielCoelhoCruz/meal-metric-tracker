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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      analytics_daily: {
        Row: {
          completed_meals: number
          completion_rate: number
          consumed_calories: number
          consumed_carbohydrates: number
          consumed_fat: number
          consumed_protein: number
          created_at: string
          date: string
          id: string
          target_calories: number
          total_meals: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_meals?: number
          completion_rate?: number
          consumed_calories?: number
          consumed_carbohydrates?: number
          consumed_fat?: number
          consumed_protein?: number
          created_at?: string
          date: string
          id?: string
          target_calories?: number
          total_meals?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_meals?: number
          completion_rate?: number
          consumed_calories?: number
          consumed_carbohydrates?: number
          consumed_fat?: number
          consumed_protein?: number
          created_at?: string
          date?: string
          id?: string
          target_calories?: number
          total_meals?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      body_metrics: {
        Row: {
          body_fat_percent: number | null
          chest_cm: number | null
          created_at: string
          date: string
          hip_cm: number | null
          id: string
          notes: string | null
          updated_at: string
          user_id: string
          waist_cm: number | null
          weight_kg: number | null
        }
        Insert: {
          body_fat_percent?: number | null
          chest_cm?: number | null
          created_at?: string
          date?: string
          hip_cm?: number | null
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Update: {
          body_fat_percent?: number | null
          chest_cm?: number | null
          created_at?: string
          date?: string
          hip_cm?: number | null
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      daily_plans: {
        Row: {
          created_at: string
          date: string
          id: string
          target_calories: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          target_calories?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          target_calories?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      foods: {
        Row: {
          calories_per_unit: number
          carbohydrates_per_unit: number
          category: Database["public"]["Enums"]["food_category"]
          created_at: string
          default_quantity: number
          default_unit: string
          fat_per_unit: number
          fiber_per_unit: number | null
          id: string
          is_custom: boolean | null
          name: string
          protein_per_unit: number
          sodium_per_unit: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          calories_per_unit: number
          carbohydrates_per_unit: number
          category: Database["public"]["Enums"]["food_category"]
          created_at?: string
          default_quantity: number
          default_unit: string
          fat_per_unit: number
          fiber_per_unit?: number | null
          id?: string
          is_custom?: boolean | null
          name: string
          protein_per_unit: number
          sodium_per_unit?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          calories_per_unit?: number
          carbohydrates_per_unit?: number
          category?: Database["public"]["Enums"]["food_category"]
          created_at?: string
          default_quantity?: number
          default_unit?: string
          fat_per_unit?: number
          fiber_per_unit?: number | null
          id?: string
          is_custom?: boolean | null
          name?: string
          protein_per_unit?: number
          sodium_per_unit?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      meal_foods: {
        Row: {
          created_at: string
          food_id: string
          id: string
          is_completed: boolean | null
          meal_id: string
          quantity: number
          substituted_food_id: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          food_id: string
          id?: string
          is_completed?: boolean | null
          meal_id: string
          quantity: number
          substituted_food_id?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          food_id?: string
          id?: string
          is_completed?: boolean | null
          meal_id?: string
          quantity?: number
          substituted_food_id?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_foods_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_foods_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_foods_substituted_food_id_fkey"
            columns: ["substituted_food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          completed_at: string | null
          created_at: string
          daily_plan_id: string
          id: string
          is_completed: boolean | null
          name: string
          scheduled_time: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          daily_plan_id: string
          id?: string
          is_completed?: boolean | null
          name: string
          scheduled_time: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          daily_plan_id?: string
          id?: string
          is_completed?: boolean | null
          name?: string
          scheduled_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_daily_plan_id_fkey"
            columns: ["daily_plan_id"]
            isOneToOne: false
            referencedRelation: "daily_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          birthdate: string | null
          created_at: string
          display_name: string | null
          gender: string | null
          height_cm: number | null
          id: string
          updated_at: string
        }
        Insert: {
          birthdate?: string | null
          created_at?: string
          display_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id: string
          updated_at?: string
        }
        Update: {
          birthdate?: string | null
          created_at?: string
          display_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          allergies: string[] | null
          created_at: string
          dietary_preferences: string[] | null
          dislikes: string[] | null
          preferred_calorie_target: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string
          dietary_preferences?: string[] | null
          dislikes?: string[] | null
          preferred_calorie_target?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allergies?: string[] | null
          created_at?: string
          dietary_preferences?: string[] | null
          dislikes?: string[] | null
          preferred_calorie_target?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_fixed_meal_plan: {
        Args: { plan_date: string; user_uuid: string }
        Returns: undefined
      }
      create_new_meal_plan: {
        Args: { plan_date: string; user_uuid: string }
        Returns: undefined
      }
      refresh_analytics_for_day: {
        Args: { _date: string; _user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      food_category:
        | "protein"
        | "carbohydrate"
        | "fruit"
        | "vegetable"
        | "dairy"
        | "fat"
        | "supplement"
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
    Enums: {
      food_category: [
        "protein",
        "carbohydrate",
        "fruit",
        "vegetable",
        "dairy",
        "fat",
        "supplement",
      ],
    },
  },
} as const

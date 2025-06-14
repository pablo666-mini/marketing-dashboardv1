export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      general_info: {
        Row: {
          id: string
          media_kit: Json | null
          protocols: Json | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          media_kit?: Json | null
          protocols?: Json | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          media_kit?: Json | null
          protocols?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      launch_phases: {
        Row: {
          created_at: string
          end_date: string
          id: string
          launch_id: string
          name: string
          notes: string | null
          responsible: string
          start_date: string
          status: Database["public"]["Enums"]["phase_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          launch_id: string
          name: string
          notes?: string | null
          responsible: string
          start_date: string
          status?: Database["public"]["Enums"]["phase_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          launch_id?: string
          name?: string
          notes?: string | null
          responsible?: string
          start_date?: string
          status?: Database["public"]["Enums"]["phase_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "launch_phases_launch_id_fkey"
            columns: ["launch_id"]
            isOneToOne: false
            referencedRelation: "launches"
            referencedColumns: ["id"]
          },
        ]
      }
      launches: {
        Row: {
          category: Database["public"]["Enums"]["launch_category"]
          created_at: string
          description: string | null
          end_date: string
          id: string
          name: string
          product_id: string | null
          responsible: string
          start_date: string
          status: Database["public"]["Enums"]["launch_status"]
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["launch_category"]
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          name: string
          product_id?: string | null
          responsible: string
          start_date: string
          status?: Database["public"]["Enums"]["launch_status"]
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["launch_category"]
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          name?: string
          product_id?: string | null
          responsible?: string
          start_date?: string
          status?: Database["public"]["Enums"]["launch_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "launches_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      media_resources: {
        Row: {
          created_at: string | null
          description: string | null
          format: string | null
          id: string
          name: string
          type: Database["public"]["Enums"]["media_type"]
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          format?: string | null
          id?: string
          name: string
          type: Database["public"]["Enums"]["media_type"]
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          format?: string | null
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["media_type"]
          url?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          briefing: string | null
          communication_kit_url: string | null
          countries: string[] | null
          created_at: string | null
          creative_concept: string | null
          description: string | null
          hashtags: string[] | null
          id: string
          landing_url: string | null
          name: string
          sales_objectives: string[] | null
          updated_at: string | null
        }
        Insert: {
          briefing?: string | null
          communication_kit_url?: string | null
          countries?: string[] | null
          created_at?: string | null
          creative_concept?: string | null
          description?: string | null
          hashtags?: string[] | null
          id?: string
          landing_url?: string | null
          name: string
          sales_objectives?: string[] | null
          updated_at?: string | null
        }
        Update: {
          briefing?: string | null
          communication_kit_url?: string | null
          countries?: string[] | null
          created_at?: string | null
          creative_concept?: string | null
          description?: string | null
          hashtags?: string[] | null
          id?: string
          landing_url?: string | null
          name?: string
          sales_objectives?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          content_format: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          copies: Json | null
          created_at: string | null
          hashtags: string[] | null
          id: string
          media_resources_ids: string[] | null
          post_date: string
          product_id: string | null
          profile_id: string | null
          status: Database["public"]["Enums"]["post_status"] | null
          updated_at: string | null
        }
        Insert: {
          content_format?: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          copies?: Json | null
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          media_resources_ids?: string[] | null
          post_date: string
          product_id?: string | null
          profile_id?: string | null
          status?: Database["public"]["Enums"]["post_status"] | null
          updated_at?: string | null
        }
        Update: {
          content_format?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          copies?: Json | null
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          media_resources_ids?: string[] | null
          post_date?: string
          product_id?: string | null
          profile_id?: string | null
          status?: Database["public"]["Enums"]["post_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_posts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "social_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_profiles: {
        Row: {
          active: boolean | null
          created_at: string | null
          handle: string
          id: string
          name: string
          platform: Database["public"]["Enums"]["platform_type"]
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          handle: string
          id?: string
          name: string
          platform: Database["public"]["Enums"]["platform_type"]
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          handle?: string
          id?: string
          name?: string
          platform?: Database["public"]["Enums"]["platform_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_type: "Post" | "Reel" | "Story" | "Video"
      launch_category: "Product Launch" | "Campaign" | "Update" | "Other"
      launch_status: "Planned" | "In Progress" | "Completed" | "Canceled"
      media_type: "banner" | "photo" | "video"
      phase_status: "Not Started" | "In Progress" | "Completed" | "Blocked"
      platform_type:
        | "Instagram"
        | "TikTok"
        | "LinkedIn"
        | "X"
        | "Pinterest"
        | "YouTube"
      post_status: "Draft" | "Pending" | "Approved" | "Published" | "Canceled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      content_type: ["Post", "Reel", "Story", "Video"],
      launch_category: ["Product Launch", "Campaign", "Update", "Other"],
      launch_status: ["Planned", "In Progress", "Completed", "Canceled"],
      media_type: ["banner", "photo", "video"],
      phase_status: ["Not Started", "In Progress", "Completed", "Blocked"],
      platform_type: [
        "Instagram",
        "TikTok",
        "LinkedIn",
        "X",
        "Pinterest",
        "YouTube",
      ],
      post_status: ["Draft", "Pending", "Approved", "Published", "Canceled"],
    },
  },
} as const

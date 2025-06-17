
// Supabase-specific types that match our database schema
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
          launch_id: string | null
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
          launch_id?: string | null
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
          launch_id?: string | null
          media_resources_ids?: string[] | null
          post_date?: string
          product_id?: string | null
          profile_id?: string | null
          status?: Database["public"]["Enums"]["post_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_launch_id_fkey"
            columns: ["launch_id"]
            isOneToOne: false
            referencedRelation: "launches"
            referencedColumns: ["id"]
          },
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
          description: string | null
          engagement_rate: number | null
          followers_count: number | null
          growth_rate: number | null
          handle: string
          id: string
          last_updated: string | null
          name: string
          notes: string | null
          platform: Database["public"]["Enums"]["platform_type"]
          updated_at: string | null
          url: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          engagement_rate?: number | null
          followers_count?: number | null
          growth_rate?: number | null
          handle: string
          id?: string
          last_updated?: string | null
          name: string
          notes?: string | null
          platform: Database["public"]["Enums"]["platform_type"]
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          engagement_rate?: number | null
          followers_count?: number | null
          growth_rate?: number | null
          handle?: string
          id?: string
          last_updated?: string | null
          name?: string
          notes?: string | null
          platform?: Database["public"]["Enums"]["platform_type"]
          updated_at?: string | null
          url?: string | null
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

// Derived types
export type SocialPost = Database['public']['Tables']['social_posts']['Row'];
export type CreateSocialPost = Database['public']['Tables']['social_posts']['Insert'];
export type UpdateSocialPost = Database['public']['Tables']['social_posts']['Update'];

export type SocialProfile = Database['public']['Tables']['social_profiles']['Row'];
export type CreateSocialProfile = Database['public']['Tables']['social_profiles']['Insert'];
export type UpdateSocialProfile = Database['public']['Tables']['social_profiles']['Update'];

export type Product = Database['public']['Tables']['products']['Row'];
export type CreateProduct = Database['public']['Tables']['products']['Insert'];
export type UpdateProduct = Database['public']['Tables']['products']['Update'];

export type Launch = Database['public']['Tables']['launches']['Row'];
export type CreateLaunch = Database['public']['Tables']['launches']['Insert'];
export type UpdateLaunch = Database['public']['Tables']['launches']['Update'];

export type LaunchPhase = Database['public']['Tables']['launch_phases']['Row'];
export type CreateLaunchPhase = Database['public']['Tables']['launch_phases']['Insert'];
export type UpdateLaunchPhase = Database['public']['Tables']['launch_phases']['Update'];

export type MediaResource = Database['public']['Tables']['media_resources']['Row'];
export type CreateMediaResource = Database['public']['Tables']['media_resources']['Insert'];
export type UpdateMediaResource = Database['public']['Tables']['media_resources']['Update'];

export type GeneralInfo = Database['public']['Tables']['general_info']['Row'];
export type CreateGeneralInfo = Database['public']['Tables']['general_info']['Insert'];
export type UpdateGeneralInfo = Database['public']['Tables']['general_info']['Update'];

// Enums
export type Platform = Database['public']['Enums']['platform_type'];
export type ContentType = Database['public']['Enums']['content_type'];
export type PostStatus = Database['public']['Enums']['post_status'];
export type LaunchCategory = Database['public']['Enums']['launch_category'];
export type LaunchStatus = Database['public']['Enums']['launch_status'];
export type PhaseStatus = Database['public']['Enums']['phase_status'];
export type MediaType = Database['public']['Enums']['media_type'];

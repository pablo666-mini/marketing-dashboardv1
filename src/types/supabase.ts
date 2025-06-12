
// Supabase-specific types that match our database schema
export type Database = {
  public: {
    Tables: {
      social_profiles: {
        Row: {
          id: string;
          name: string;
          handle: string;
          platform: 'Instagram' | 'TikTok' | 'LinkedIn' | 'X' | 'Pinterest' | 'YouTube';
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          handle: string;
          platform: 'Instagram' | 'TikTok' | 'LinkedIn' | 'X' | 'Pinterest' | 'YouTube';
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          handle?: string;
          platform?: 'Instagram' | 'TikTok' | 'LinkedIn' | 'X' | 'Pinterest' | 'YouTube';
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          landing_url: string | null;
          hashtags: string[] | null;
          briefing: string | null;
          communication_kit_url: string | null;
          countries: string[] | null;
          sales_objectives: string[] | null;
          creative_concept: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          landing_url?: string | null;
          hashtags?: string[] | null;
          briefing?: string | null;
          communication_kit_url?: string | null;
          countries?: string[] | null;
          sales_objectives?: string[] | null;
          creative_concept?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          landing_url?: string | null;
          hashtags?: string[] | null;
          briefing?: string | null;
          communication_kit_url?: string | null;
          countries?: string[] | null;
          sales_objectives?: string[] | null;
          creative_concept?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      social_posts: {
        Row: {
          id: string;
          product_id: string | null;
          post_date: string;
          profile_id: string | null;
          content_type: 'Post' | 'Reel' | 'Story' | 'Video';
          content_format: string | null;
          copies: any | null;
          hashtags: string[] | null;
          status: 'Draft' | 'Pending' | 'Approved' | 'Published' | 'Canceled';
          media_resources_ids: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          post_date: string;
          profile_id?: string | null;
          content_type: 'Post' | 'Reel' | 'Story' | 'Video';
          content_format?: string | null;
          copies?: any | null;
          hashtags?: string[] | null;
          status?: 'Draft' | 'Pending' | 'Approved' | 'Published' | 'Canceled';
          media_resources_ids?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          post_date?: string;
          profile_id?: string | null;
          content_type?: 'Post' | 'Reel' | 'Story' | 'Video';
          content_format?: string | null;
          copies?: any | null;
          hashtags?: string[] | null;
          status?: 'Draft' | 'Pending' | 'Approved' | 'Published' | 'Canceled';
          media_resources_ids?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      media_resources: {
        Row: {
          id: string;
          name: string;
          type: 'banner' | 'photo' | 'video';
          url: string;
          description: string | null;
          format: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: 'banner' | 'photo' | 'video';
          url: string;
          description?: string | null;
          format?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: 'banner' | 'photo' | 'video';
          url?: string;
          description?: string | null;
          format?: string | null;
          created_at?: string;
        };
      };
      general_info: {
        Row: {
          id: string;
          protocols: any | null;
          media_kit: any | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          protocols?: any | null;
          media_kit?: any | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          protocols?: any | null;
          media_kit?: any | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      platform_type: 'Instagram' | 'TikTok' | 'LinkedIn' | 'X' | 'Pinterest' | 'YouTube';
      content_type: 'Post' | 'Reel' | 'Story' | 'Video';
      post_status: 'Draft' | 'Pending' | 'Approved' | 'Published' | 'Canceled';
      media_type: 'banner' | 'photo' | 'video';
    };
  };
};

export type SocialProfile = Database['public']['Tables']['social_profiles']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type SocialPost = Database['public']['Tables']['social_posts']['Row'];
export type MediaResource = Database['public']['Tables']['media_resources']['Row'];
export type GeneralInfo = Database['public']['Tables']['general_info']['Row'];

export type CreateSocialProfile = Database['public']['Tables']['social_profiles']['Insert'];
export type UpdateSocialProfile = Database['public']['Tables']['social_profiles']['Update'];
export type CreateProduct = Database['public']['Tables']['products']['Insert'];
export type UpdateProduct = Database['public']['Tables']['products']['Update'];
export type CreateSocialPost = Database['public']['Tables']['social_posts']['Insert'];
export type UpdateSocialPost = Database['public']['Tables']['social_posts']['Update'];
export type CreateMediaResource = Database['public']['Tables']['media_resources']['Insert'];
export type UpdateMediaResource = Database['public']['Tables']['media_resources']['Update'];
export type UpdateGeneralInfo = Database['public']['Tables']['general_info']['Update'];

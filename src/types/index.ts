
// Re-export Supabase types and add additional UI-specific types
export * from './supabase';

// UI-specific types that extend the database types
export interface CalendarFilters {
  profileId?: string;
  status?: 'Draft' | 'Pending' | 'Approved' | 'Published' | 'Canceled';
  contentType?: 'Post' | 'Reel' | 'Story' | 'Video';
  platform?: 'Instagram' | 'TikTok' | 'LinkedIn' | 'X' | 'Pinterest' | 'YouTube';
}

// Extended types for UI components
export interface Protocol {
  id: string;
  title: string;
  description: string;
  type: 'image_naming' | 'briefing' | 'hashtags' | 'general';
  content: string;
}

export interface MediaKitResource {
  id: string;
  name: string;
  category: 'press_convocation' | 'press_note' | 'banners' | 'photos' | 'videos';
  url: string;
  format?: string;
  description?: string;
}

// Form types for creating/updating
export interface PostFormData {
  productId: string;
  postDate: string;
  profileId: string;
  contentType: 'Post' | 'Reel' | 'Story' | 'Video';
  contentFormat: string;
  copies: Record<string, string>;
  hashtags: string[];
  status: 'Draft' | 'Pending' | 'Approved' | 'Published' | 'Canceled';
}

export interface ProfileFormData {
  name: string;
  handle: string;
  platform: 'Instagram' | 'TikTok' | 'LinkedIn' | 'X' | 'Pinterest' | 'YouTube';
  active: boolean;
}

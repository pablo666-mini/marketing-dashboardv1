
// Re-export Supabase types and add additional UI-specific types
export * from './supabase';

// Add missing type exports
export type Platform = 'Instagram' | 'TikTok' | 'LinkedIn' | 'X' | 'Pinterest' | 'YouTube';
export type ContentType = 'Post' | 'Reel' | 'Story' | 'Video';
export type PostStatus = 'Draft' | 'Pending' | 'Approved' | 'Published' | 'Canceled';
export type ContentFormat = '9:16' | '4:5' | '1:1' | 'None';

// Legacy API types (for mock API compatibility)
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

export interface CreatePostForm {
  productId: string;
  date: string;
  profileId: string;
  contentType: ContentType;
  contentFormat: ContentFormat;
  hashtags: string[];
  copies: PlatformCopy[];
}

export interface UpdatePostForm {
  productId?: string;
  date?: string;
  profileId?: string;
  contentType?: ContentType;
  contentFormat?: ContentFormat;
  hashtags?: string[];
  copies?: PlatformCopy[];
  status?: PostStatus;
}

export interface PlatformCopy {
  platform: Platform;
  content: string;
  hashtags: string[];
}

// UI-specific types that extend the database types
export interface CalendarFilters {
  profileId?: string;
  status?: PostStatus;
  contentType?: ContentType;
  platform?: Platform;
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
  contentType: ContentType;
  contentFormat: string;
  copies: Record<string, string>;
  hashtags: string[];
  status: PostStatus;
}

export interface ProfileFormData {
  name: string;
  handle: string;
  platform: Platform;
  active: boolean;
}

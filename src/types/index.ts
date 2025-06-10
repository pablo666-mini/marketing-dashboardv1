
// TypeScript types for the social media management dashboard

export type Platform = 'Instagram' | 'TikTok' | 'LinkedIn' | 'X' | 'Pinterest' | 'YouTube';

export type ContentType = 'Post' | 'Reel' | 'Story' | 'Video';

export type ContentFormat = '9:16' | '4:5' | '1:1' | 'None';

export type PostStatus = 'Pending' | 'Approved' | 'Published' | 'Canceled';

export interface SocialProfile {
  id: string;
  name: string;
  handle: string;
  platform: Platform;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaResource {
  id: string;
  name: string;
  type: 'image' | 'video' | 'banner';
  url: string;
  format: ContentFormat;
}

export interface PlatformCopy {
  platform: Platform;
  content: string;
  hashtags: string[];
}

export interface SocialPost {
  id: string;
  productId: string;
  date: string; // ISO string
  profileId: string;
  contentType: ContentType;
  contentFormat: ContentFormat;
  mediaResources: MediaResource[];
  copies: PlatformCopy[];
  hashtags: string[];
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  landingUrl: string;
  hashtags: string[];
  briefing: string;
  communicationKitUrl: string;
  countries: string[];
  salesObjectives: string[];
  creativeConcept: string;
  createdAt: string;
  updatedAt: string;
}

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

export interface GeneralInfo {
  protocols: Protocol[];
  mediaKit: MediaKitResource[];
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Form types
export interface CreatePostForm {
  productId: string;
  date: string;
  profileId: string;
  contentType: ContentType;
  contentFormat: ContentFormat;
  copies: PlatformCopy[];
  hashtags: string[];
}

export interface UpdatePostForm extends Partial<CreatePostForm> {
  status?: PostStatus;
}

// Filter types
export interface CalendarFilters {
  profileId?: string;
  status?: PostStatus;
  contentType?: ContentType;
  platform?: Platform;
}

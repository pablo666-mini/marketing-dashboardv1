
// Re-export Supabase types and add additional UI-specific types
export * from './supabase';

// Platform enum - supported social media platforms (extensible)
export type Platform = 'Instagram' | 'TikTok' | 'LinkedIn' | 'X' | 'Pinterest' | 'YouTube' | 'Other';

// Predefined platforms for UI consistency
export const PREDEFINED_PLATFORMS: readonly Platform[] = [
  'Instagram', 
  'TikTok', 
  'LinkedIn', 
  'X', 
  'Pinterest', 
  'YouTube'
] as const;

// Content type enum - types of social media content
export type ContentType = 'Post' | 'Reel' | 'Story' | 'Video';

// Post status enum - workflow states for social media posts
export type PostStatus = 'Draft' | 'Pending' | 'Approved' | 'Published' | 'Canceled';

// Content format enum - aspect ratios and formats
export type ContentFormat = '9:16' | '4:5' | '1:1' | 'None';

// Launch management enums
export type LaunchCategory = 'Product Launch' | 'Campaign' | 'Update' | 'Other';
export type LaunchStatus = 'Planned' | 'In Progress' | 'Completed' | 'Canceled';
export type PhaseStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Blocked';

// Platform-specific copy content with optional profile specificity
export interface PlatformCopy {
  platform: Platform;
  content: string;
  hashtags: string[];
  profileId?: string; // Optional: for profile-specific copies
}

// Multi-profile copy content structure
export interface ProfileCopy {
  profileId: string;
  content: string;
  hashtags: string[];
}

// Import SocialProfile from Supabase types first
import { SocialProfile as SupabaseSocialProfile } from './supabase';

// Re-export SocialProfile for consistent imports
export interface SocialProfile extends SupabaseSocialProfile {}

// Define SocialPost with proper multi-profile support
import { SocialPost as SupabaseSocialPost } from './supabase';

export interface SocialPost {
  id: string;
  product_id: string | null;
  post_date: string;
  profile_id?: string | null;          // Legacy support - OPTIONAL
  profile_ids: string[];               // Multi-profile support - REQUIRED
  content_type: ContentType;
  content_format: string | null;
  copies: PlatformCopy[] | null;
  hashtags: string[] | null;
  status: PostStatus | null;
  media_resources_ids: string[] | null;
  launch_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Launch interface
export interface Launch {
  id: string;
  product_id: string | null;
  name: string;
  category: LaunchCategory;
  status: LaunchStatus;
  start_date: string;
  end_date: string;
  description: string | null;
  responsible: string;
  created_at: string;
  updated_at: string;
}

// Launch phase interface
export interface LaunchPhase {
  id: string;
  launch_id: string;
  name: string;
  status: PhaseStatus;
  start_date: string;
  end_date: string;
  responsible: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Launch input types for forms
export interface CreateLaunchInput {
  product_id?: string | null;
  name: string;
  category: LaunchCategory;
  status?: LaunchStatus;
  start_date: string;
  end_date: string;
  description?: string | null;
  responsible: string;
}

export interface UpdateLaunchInput {
  product_id?: string | null;
  name?: string;
  category?: LaunchCategory;
  status?: LaunchStatus;
  start_date?: string;
  end_date?: string;
  description?: string | null;
  responsible?: string;
}

// Launch phase input types
export interface CreateLaunchPhaseInput {
  launch_id: string;
  name: string;
  status?: PhaseStatus;
  start_date: string;
  end_date: string;
  responsible: string;
  notes?: string | null;
}

export interface UpdateLaunchPhaseInput {
  name?: string;
  status?: PhaseStatus;
  start_date?: string;
  end_date?: string;
  responsible?: string;
  notes?: string | null;
}

// Launch filters
export interface LaunchFilters {
  status?: LaunchStatus[];
  category?: LaunchCategory[];
  productId?: string;
  dateRange?: { start: string; end: string };
}

// Legacy API response wrapper for mock API compatibility
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

// Multi-profile form data for creating new posts
export interface CreatePostForm {
  productId: string;
  date: string;
  profileIds: string[]; // Multi-profile support
  contentType: ContentType;
  contentFormat: ContentFormat;
  hashtags: string[];
  copies: PlatformCopy[];
}

// Multi-profile form data for updating existing posts
export interface UpdatePostForm {
  productId?: string;
  date?: string;
  profileIds?: string[]; // Multi-profile support
  contentType?: ContentType;
  contentFormat?: ContentFormat;
  hashtags?: string[];
  copies?: PlatformCopy[];
  status?: PostStatus;
}

// UI-specific calendar filters
export interface CalendarFilters {
  profileId?: string;
  status?: PostStatus;
  contentType?: ContentType;
  platform?: Platform;
}

// Protocol information for communication guidelines
export interface Protocol {
  id: string;
  title: string;
  description: string;
  type: 'image_naming' | 'briefing' | 'hashtags' | 'general';
  content: string;
}

// Media kit resource information
export interface MediaKitResource {
  id: string;
  name: string;
  category: 'press_convocation' | 'press_note' | 'banners' | 'photos' | 'videos';
  url: string;
  format?: string;
  description?: string;
}

// Multi-profile form data for creating/updating posts (UI layer)
export interface PostFormData {
  productId: string;
  postDate: string;
  profileIds: string[]; // Multi-profile support
  contentType: ContentType;
  contentFormat: string;
  copies: Record<string, string>;
  hashtags: string[];
  status: PostStatus;
}

// Form data for creating/updating profiles (UI layer)
export interface ProfileFormData {
  name: string;
  handle: string;
  platform: Platform;
  customPlatformName?: string; // only when platform === "Other"
  active: boolean;
}

// Multi-profile selection state
export interface MultiProfileSelection {
  [platform: string]: string[]; // platform -> profileIds
}

// Profile grouped by platform for UI
export interface ProfilesByPlatform {
  [platform: string]: SocialProfile[];
}

// Post item for timeline
export interface PostItem {
  id: string;
  postDate: string;
  profileIds: string[];
}

export interface LaunchWithPosts {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: { id: string; name: string; color: string };
  posts: PostItem[];
}

export interface TimelineStatus {
  id: string;
  name: string;
  color: string;
}

// Social Media Metrics Types
export interface SocialProfileMetric {
  id: string;
  profile_id: string;
  timestamp: string;
  followers_count: number | null;
  engagement_rate: number | null;
  impressions: number | null;
  reach: number | null;
  created_at: string;
}

export interface CreateSocialProfileMetric {
  profile_id: string;
  timestamp: string;
  followers_count?: number;
  engagement_rate?: number;
  impressions?: number;
  reach?: number;
}

// Scheduled Posts Types
export interface ScheduledPost {
  id: string;
  profile_id: string;
  content: {
    text: string;
    mediaUrls?: string[];
    hashtags?: string[];
  };
  scheduled_for: string;
  status: 'pending' | 'sent' | 'failed';
  external_id: string | null;
  error_message: string | null;
  created_at: string;
}

export interface CreateScheduledPost {
  profile_id: string;
  content: {
    text: string;
    mediaUrls?: string[];
    hashtags?: string[];
  };
  scheduled_for: string;
}

export interface UpdateScheduledPost {
  status?: 'pending' | 'sent' | 'failed';
  external_id?: string;
  error_message?: string;
}

// API Request/Response Types
export interface FetchMetricsRequest {
  profileId: string;
}

export interface FetchMetricsResponse {
  success: boolean;
  message: string;
  data?: SocialProfileMetric[];
}

export interface SchedulePostRequest {
  profileId: string;
  content: {
    text: string;
    mediaUrls?: string[];
    hashtags?: string[];
  };
  scheduledFor: string;
}

export interface SchedulePostResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    external_id?: string;
  };
}

// Chart Data Types
export interface MetricChartData {
  timestamp: string;
  followers_count?: number;
  engagement_rate?: number;
  impressions?: number;
  reach?: number;
}

export interface ProfileMetricsSummary {
  profileId: string;
  profileName: string;
  platform: Platform;
  currentFollowers: number;
  followersChange: number;
  engagementRate: number;
  engagementChange: number;
  sparklineData: MetricChartData[];
}

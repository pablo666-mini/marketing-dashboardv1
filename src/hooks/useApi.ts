
// Re-export all Supabase hooks for backward compatibility
export { 
  useSocialProfiles as useProfiles,
  useActiveSocialProfiles as useActiveProfiles,
  useUpdateSocialProfile as useUpdateProfile,
  useCreateSocialProfile as useCreateProfile,
  useDeleteSocialProfile as useDeleteProfile
} from './useSocialProfiles';

export {
  useSocialPosts as usePosts,
  useCreateSocialPost as useCreatePost,
  useUpdateSocialPost as useUpdatePost,
  useDeleteSocialPost as useDeletePost,
  useSocialPostsByDateRange as usePostsByDateRange
} from './useSocialPosts';

export { 
  useProducts,
  useCreateProduct,
  useUpdateProduct
} from './useProducts';

export {
  useGeneralInfo,
  useUpdateGeneralInfo
} from './useGeneralInfo';

// Query keys for reference
export const queryKeys = {
  profiles: ['social-profiles'],
  posts: ['social-posts'],
  products: ['products'],
  generalInfo: ['general-info'],
  activeProfiles: ['social-profiles', 'active'],
  postsByDate: (startDate: string, endDate: string) => ['social-posts', 'date-range', startDate, endDate]
};

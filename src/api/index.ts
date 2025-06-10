
// Mock API functions for social media management
import { 
  SocialProfile, 
  SocialPost, 
  Product, 
  GeneralInfo, 
  ApiResponse,
  CreatePostForm,
  UpdatePostForm
} from '@/types';
import { mockProfiles, mockProducts, mockPosts, mockGeneralInfo } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage (simulating a database)
let profiles = [...mockProfiles];
let posts = [...mockPosts];
let products = [...mockProducts];
let generalInfo = { ...mockGeneralInfo };

// Social Profiles API
export const getProfiles = async (): Promise<ApiResponse<SocialProfile[]>> => {
  console.log('API: Fetching social profiles...');
  await delay(500);
  return {
    data: profiles,
    success: true,
    message: 'Perfiles obtenidos exitosamente'
  };
};

export const updateProfile = async (
  id: string, 
  updates: Partial<SocialProfile>
): Promise<ApiResponse<SocialProfile>> => {
  console.log(`API: Updating profile ${id}`, updates);
  await delay(300);
  
  const profileIndex = profiles.findIndex(p => p.id === id);
  if (profileIndex === -1) {
    return {
      data: {} as SocialProfile,
      success: false,
      message: 'Perfil no encontrado'
    };
  }

  profiles[profileIndex] = {
    ...profiles[profileIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  return {
    data: profiles[profileIndex],
    success: true,
    message: 'Perfil actualizado exitosamente'
  };
};

// Social Posts API
export const getPosts = async (): Promise<ApiResponse<SocialPost[]>> => {
  console.log('API: Fetching social posts...');
  await delay(600);
  return {
    data: posts,
    success: true,
    message: 'Publicaciones obtenidas exitosamente'
  };
};

export const createPost = async (postData: CreatePostForm): Promise<ApiResponse<SocialPost>> => {
  console.log('API: Creating new post', postData);
  await delay(800);

  const newPost: SocialPost = {
    id: Date.now().toString(),
    ...postData,
    mediaResources: [], // Will be added separately
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  posts.push(newPost);

  return {
    data: newPost,
    success: true,
    message: 'Publicación creada exitosamente'
  };
};

export const updatePost = async (
  id: string, 
  updates: UpdatePostForm
): Promise<ApiResponse<SocialPost>> => {
  console.log(`API: Updating post ${id}`, updates);
  await delay(400);

  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) {
    return {
      data: {} as SocialPost,
      success: false,
      message: 'Publicación no encontrada'
    };
  }

  posts[postIndex] = {
    ...posts[postIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
    ...(updates.status === 'Published' && { publishedAt: new Date().toISOString() })
  };

  return {
    data: posts[postIndex],
    success: true,
    message: 'Publicación actualizada exitosamente'
  };
};

export const deletePost = async (id: string): Promise<ApiResponse<void>> => {
  console.log(`API: Deleting post ${id}`);
  await delay(300);

  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) {
    return {
      data: undefined,
      success: false,
      message: 'Publicación no encontrada'
    };
  }

  posts.splice(postIndex, 1);

  return {
    data: undefined,
    success: true,
    message: 'Publicación eliminada exitosamente'
  };
};

// Products API
export const getProducts = async (): Promise<ApiResponse<Product[]>> => {
  console.log('API: Fetching products...');
  await delay(400);
  return {
    data: products,
    success: true,
    message: 'Productos obtenidos exitosamente'
  };
};

// General Info API
export const getGeneralInfo = async (): Promise<ApiResponse<GeneralInfo>> => {
  console.log('API: Fetching general info...');
  await delay(500);
  return {
    data: generalInfo,
    success: true,
    message: 'Información general obtenida exitosamente'
  };
};

// Utility functions
export const getActiveProfiles = async (): Promise<ApiResponse<SocialProfile[]>> => {
  console.log('API: Fetching active profiles...');
  await delay(300);
  const activeProfiles = profiles.filter(p => p.active);
  return {
    data: activeProfiles,
    success: true,
    message: 'Perfiles activos obtenidos exitosamente'
  };
};

export const getPostsByDateRange = async (
  startDate: string, 
  endDate: string
): Promise<ApiResponse<SocialPost[]>> => {
  console.log(`API: Fetching posts from ${startDate} to ${endDate}`);
  await delay(400);
  
  const filteredPosts = posts.filter(post => {
    const postDate = new Date(post.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return postDate >= start && postDate <= end;
  });

  return {
    data: filteredPosts,
    success: true,
    message: 'Publicaciones filtradas por fecha obtenidas exitosamente'
  };
};

import { api } from "@/utils/api";
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  GetPostsQuery,
  ApiResponse,
  PaginatedResponse,
} from "@kite/types";

// Re-export types for use in hooks
export type { Post, CreatePostRequest, UpdatePostRequest, GetPostsQuery };

// Get user's posts
export const getPostsApi = (params: GetPostsQuery = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.status) queryParams.append("status", params.status);

  return api.get<ApiResponse<PaginatedResponse<Post>>>(`/posts?${queryParams.toString()}`);
};

// Get single post
export const getPostApi = (id: string) =>
  api.get<ApiResponse<{ post: Post }>>(`/posts/${id}`);

// Create post
export const createPostApi = (data: CreatePostRequest) =>
  api.post<ApiResponse<{ post: Post }>>("/posts", data);

// Update post
export const updatePostApi = (id: string, data: UpdatePostRequest) =>
  api.put<ApiResponse<{ post: Post }>>(`/posts/${id}`, data);

// Publish post
export const publishPostApi = (id: string) =>
  api.post<ApiResponse<{ post: Post }>>(`/posts/${id}/publish`);

// Unpublish post
export const unpublishPostApi = (id: string) =>
  api.post<ApiResponse<{ post: Post }>>(`/posts/${id}/unpublish`);

// Delete post
export const deletePostApi = (id: string) =>
  api.delete<ApiResponse<{ message: string }>>(`/posts/${id}`);

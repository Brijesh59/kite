import { api } from "@/utils/api";
import type { ApiResponse, PaginatedResponse } from "@kite/types";
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  GetPostsQuery,
} from "@kite/types";

// Re-export types for use in hooks
export type { Post, CreatePostRequest, UpdatePostRequest, GetPostsQuery };

// Custom type for posts API response structure
interface PostsApiResponse {
  message: string;
  data: {
    posts: Post[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getPostsApi = (params?: GetPostsQuery) =>
  api.get<PostsApiResponse>("/admin/posts", { params });

export const getPostByIdApi = (id: string) =>
  api.get<ApiResponse<Post>>(`/posts/${id}`);

export const createPostApi = (data: CreatePostRequest) =>
  api.post<ApiResponse<Post>>("/posts", data);

export const updatePostApi = (id: string, data: UpdatePostRequest) =>
  api.put<ApiResponse<Post>>(`/posts/${id}`, data);

export const deletePostApi = (id: string) =>
  api.delete<ApiResponse<void>>(`/posts/${id}`);

export const getMyPostsApi = (params?: GetPostsQuery) =>
  api.get<PaginatedResponse<Post>>("/posts/user/my-posts", { params });

export const togglePostStatusApi = (id: string, isActive: boolean) =>
  api.put<ApiResponse<Post>>(`/admin/posts/${id}`, { isActive });

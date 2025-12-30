// Re-export types from shared packages
export type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  PostFilters,
} from "@kite/types";

export { POST_STATUS, POST_LIMITS, type PostStatus } from "@kite/config";

// Query parameters for listing posts
export interface GetPostsQuery {
  page?: number;
  limit?: number;
  status?: "DRAFT" | "PUBLISHED" | "ALL";
  userId?: string;
  search?: string;
}

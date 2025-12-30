// Import and re-export types from shared packages
import type {
  User,
  DashboardStats,
  Post,
  CreatePostRequest,
  GetPostsQuery,
  UpdatePostRequest,
  CreateUserRequest,
  UpdateUserRequest as UpdateUserRequestBase,
  GetUsersQuery as GetUsersQueryBase,
  UserRole,
} from "@kite/types";

export type {
  User,
  DashboardStats,
  Post,
  CreatePostRequest,
  GetPostsQuery,
  UpdatePostRequest as UpdatePostData,
  CreateUserRequest,
  UserRole,
};

export { ROLES, type Role, PAGINATION } from "@kite/config";

// Extend base types for admin-specific needs
export interface UpdateUserRequest extends UpdateUserRequestBase {
  // All fields already included in base type
}

export interface GetUsersQuery extends GetUsersQueryBase {
  // All fields already included in base type
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Posts management types - using UpdatePostData to avoid conflict
export interface PostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

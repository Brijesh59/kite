import type { User } from "./user.types";
import type { Workspace } from "./workspace.types";

export interface Post {
  id: string;
  userId: string;
  workspaceId: string;
  title: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
  isActive: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  workspace?: Workspace;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  workspaceId: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  status?: "DRAFT" | "PUBLISHED";
  isActive?: boolean;
}

export interface PublishPostRequest {
  postId: string;
}

export interface GetPostsQuery {
  page?: number;
  limit?: number;
  status?: "DRAFT" | "PUBLISHED" | "ALL";
  search?: string;
  userId?: string;
  workspaceId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  tags?: string;
}

export interface PostFilters {
  status?: "DRAFT" | "PUBLISHED" | "ALL";
  userId?: string;
  search?: string;
}

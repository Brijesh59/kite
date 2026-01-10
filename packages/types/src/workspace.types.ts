import type { User } from "./user.types";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: User;
  _count?: {
    members: number;
    posts: number;
  };
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceMemberRole;
  joinedAt: string;
  updatedAt: string;
  workspace?: Workspace;
  user?: User;
}

export type WorkspaceMemberRole = "OWNER" | "ADMIN" | "MEMBER";

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  slug?: string;
}

export interface GetWorkspacesQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface WorkspaceWithRole extends Workspace {
  memberRole: WorkspaceMemberRole;
}

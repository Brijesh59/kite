import { api } from "@/utils/api";
import type {
  Workspace,
  GetWorkspacesQuery,
  ApiResponse,
  PaginatedResponse,
} from "@kite/types";

// Re-export types for use in hooks
export type { Workspace, GetWorkspacesQuery };

// Get all workspaces (admin only - returns all workspaces across all users)
// Admins can only view workspaces, not create/update/delete them
export const getWorkspacesApi = (params: GetWorkspacesQuery = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.isActive !== undefined)
    queryParams.append("isActive", params.isActive.toString());

  return api.get<ApiResponse<PaginatedResponse<Workspace>>>(
    `/admin/workspaces?${queryParams.toString()}`
  );
};

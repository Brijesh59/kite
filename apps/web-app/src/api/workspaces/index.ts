import { api } from "@/utils/api";
import type {
  Workspace,
  WorkspaceWithRole,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  GetWorkspacesQuery,
  ApiResponse,
  PaginatedResponse,
} from "@kite/types";

// Re-export types for use in hooks
export type {
  Workspace,
  WorkspaceWithRole,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  GetWorkspacesQuery,
};

// Get user's workspaces
export const getWorkspacesApi = (params: GetWorkspacesQuery = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.isActive !== undefined)
    queryParams.append("isActive", params.isActive.toString());

  return api.get<ApiResponse<PaginatedResponse<WorkspaceWithRole>>>(
    `/workspaces?${queryParams.toString()}`
  );
};

// Get single workspace
export const getWorkspaceApi = (id: string) =>
  api.get<ApiResponse<WorkspaceWithRole>>(`/workspaces/${id}`);

// Create workspace
export const createWorkspaceApi = (data: CreateWorkspaceRequest) =>
  api.post<ApiResponse<Workspace>>("/workspaces", data);

// Update workspace
export const updateWorkspaceApi = (
  id: string,
  data: UpdateWorkspaceRequest
) => api.put<ApiResponse<Workspace>>(`/workspaces/${id}`, data);

// Delete workspace
export const deleteWorkspaceApi = (id: string) =>
  api.delete<ApiResponse<null>>(`/workspaces/${id}`);

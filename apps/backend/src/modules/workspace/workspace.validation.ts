import {
  createWorkspaceRequestSchema,
  getWorkspacesQuerySchema,
  updateWorkspaceRequestSchema,
  uuidParamSchema,
} from "@kite/types";

export const workspaceValidation = {
  create: {
    body: createWorkspaceRequestSchema,
  },
  update: {
    params: uuidParamSchema,
    body: updateWorkspaceRequestSchema,
  },
  getById: {
    params: uuidParamSchema,
  },
  delete: {
    params: uuidParamSchema,
  },
  getAll: {
    query: getWorkspacesQuerySchema,
  },
};

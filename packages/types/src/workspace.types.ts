import { z } from "zod";
import { PAGINATION, WORKSPACE_LIMITS } from "@kite/config";
import { userSchema } from "./user.types";
import {
  optionalBooleanQuerySchema,
  optionalIntegerQuerySchema,
} from "./schema-helpers";

export const workspaceMemberRoleSchema = z.enum(["OWNER", "ADMIN", "MEMBER"]);
export type WorkspaceMemberRole = z.infer<typeof workspaceMemberRoleSchema>;

export const workspaceCountSchema = z.object({
  members: z.number(),
  posts: z.number(),
});

export const workspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  ownerId: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  owner: userSchema.optional(),
  _count: workspaceCountSchema.optional(),
});
export type Workspace = z.infer<typeof workspaceSchema>;

export const workspaceMemberSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  userId: z.string(),
  role: workspaceMemberRoleSchema,
  joinedAt: z.string(),
  updatedAt: z.string(),
  workspace: workspaceSchema.optional(),
  user: userSchema.optional(),
});
export type WorkspaceMember = z.infer<typeof workspaceMemberSchema>;

export const createWorkspaceRequestSchema = z.object({
  name: z
    .string()
    .min(
      WORKSPACE_LIMITS.nameMinLength,
      `Workspace name must be at least ${WORKSPACE_LIMITS.nameMinLength} characters`
    )
    .max(
      WORKSPACE_LIMITS.nameMaxLength,
      `Workspace name must not exceed ${WORKSPACE_LIMITS.nameMaxLength} characters`
    ),
  description: z
    .string()
    .max(
      WORKSPACE_LIMITS.descriptionMaxLength,
      `Description must not exceed ${WORKSPACE_LIMITS.descriptionMaxLength} characters`
    )
    .nullable()
    .optional(),
});
export type CreateWorkspaceRequest = z.infer<typeof createWorkspaceRequestSchema>;

export const updateWorkspaceRequestSchema = z
  .object({
    name: z
      .string()
      .min(
        WORKSPACE_LIMITS.nameMinLength,
        `Workspace name must be at least ${WORKSPACE_LIMITS.nameMinLength} characters`
      )
      .max(
        WORKSPACE_LIMITS.nameMaxLength,
        `Workspace name must not exceed ${WORKSPACE_LIMITS.nameMaxLength} characters`
      )
      .optional(),
    description: z
      .string()
      .max(
        WORKSPACE_LIMITS.descriptionMaxLength,
        `Description must not exceed ${WORKSPACE_LIMITS.descriptionMaxLength} characters`
      )
      .nullable()
      .optional(),
    slug: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
export type UpdateWorkspaceRequest = z.infer<typeof updateWorkspaceRequestSchema>;

export const getWorkspacesQuerySchema = z.object({
  page: optionalIntegerQuerySchema(PAGINATION.maxLimit),
  limit: optionalIntegerQuerySchema(PAGINATION.maxLimit),
  search: z.string().optional(),
  isActive: optionalBooleanQuerySchema,
  sortBy: z.enum(["name", "slug", "createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
export type GetWorkspacesQuery = z.infer<typeof getWorkspacesQuerySchema>;

export const workspaceWithRoleSchema = workspaceSchema.extend({
  memberRole: workspaceMemberRoleSchema,
});
export type WorkspaceWithRole = z.infer<typeof workspaceWithRoleSchema>;

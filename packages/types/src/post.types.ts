import { z } from "zod";
import { PAGINATION, POST_LIMITS } from "@kite/config";
import { userSchema } from "./user.types";
import { workspaceSchema } from "./workspace.types";
import { optionalIntegerQuerySchema } from "./schema-helpers";

export const postStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);
export const postStatusFilterSchema = z.enum(["DRAFT", "PUBLISHED", "ALL"]);
export type PostStatus = z.infer<typeof postStatusSchema>;

export const postSchema = z.object({
  id: z.string(),
  userId: z.string(),
  workspaceId: z.string(),
  title: z.string(),
  content: z.string(),
  status: postStatusSchema,
  isActive: z.boolean(),
  publishedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: userSchema.optional(),
  workspace: workspaceSchema.optional(),
});
export type Post = z.infer<typeof postSchema>;

export const createPostRequestSchema = z.object({
  title: z
    .string()
    .min(
      POST_LIMITS.titleMinLength,
      `Title must be at least ${POST_LIMITS.titleMinLength} character long`
    )
    .max(
      POST_LIMITS.titleMaxLength,
      `Title cannot exceed ${POST_LIMITS.titleMaxLength} characters`
    ),
  content: z
    .string()
    .max(
      POST_LIMITS.contentMaxLength,
      `Content cannot exceed ${POST_LIMITS.contentMaxLength} characters`
    ),
});
export type CreatePostRequest = z.infer<typeof createPostRequestSchema>;

export const createPostDataSchema = createPostRequestSchema.extend({
  workspaceId: z.string().uuid("Invalid workspace ID format"),
});
export type CreatePostData = z.infer<typeof createPostDataSchema>;

export const updatePostRequestSchema = z
  .object({
    title: z
      .string()
      .min(
        POST_LIMITS.titleMinLength,
        `Title must be at least ${POST_LIMITS.titleMinLength} character long`
      )
      .max(
        POST_LIMITS.titleMaxLength,
        `Title cannot exceed ${POST_LIMITS.titleMaxLength} characters`
      )
      .optional(),
    content: z
      .string()
      .max(
        POST_LIMITS.contentMaxLength,
        `Content cannot exceed ${POST_LIMITS.contentMaxLength} characters`
      )
      .optional(),
    status: postStatusSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
export type UpdatePostRequest = z.infer<typeof updatePostRequestSchema>;

export const publishPostRequestSchema = z.object({
  postId: z.string().uuid("Invalid post ID format"),
});
export type PublishPostRequest = z.infer<typeof publishPostRequestSchema>;

export const getPostsQuerySchema = z.object({
  page: optionalIntegerQuerySchema(),
  limit: optionalIntegerQuerySchema(PAGINATION.maxLimit),
  status: postStatusFilterSchema.optional(),
  search: z.string().min(2, "Search term must be at least 2 characters long").max(100).optional(),
  userId: z.string().uuid("Invalid user ID format").optional(),
  workspaceId: z.string().uuid("Invalid workspace ID format").optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  tags: z.string().optional(),
});
export type GetPostsQuery = z.infer<typeof getPostsQuerySchema>;

export const postFiltersSchema = z.object({
  status: postStatusFilterSchema.optional(),
  userId: z.string().uuid("Invalid user ID format").optional(),
  search: z.string().optional(),
});
export type PostFilters = z.infer<typeof postFiltersSchema>;

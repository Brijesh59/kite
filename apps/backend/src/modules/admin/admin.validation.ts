import {
  createUserRequestSchema,
  getPostsQuerySchema,
  getUsersQuerySchema,
  getWorkspacesQuerySchema,
  updatePostRequestSchema,
  updateUserRequestSchema,
  uuidParamSchema,
} from "@kite/types";

export const createUserValidation = createUserRequestSchema;
export const updateUserValidation = updateUserRequestSchema;
export const userIdValidation = uuidParamSchema;
export const getUsersQueryValidation = getUsersQuerySchema;
export const getPostsQueryValidation = getPostsQuerySchema;
export const getWorkspacesQueryValidation = getWorkspacesQuerySchema;
export const updatePostValidation = updatePostRequestSchema;

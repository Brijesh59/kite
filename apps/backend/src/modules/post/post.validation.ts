import {
  createPostRequestSchema,
  getPostsQuerySchema,
  updatePostRequestSchema,
  uuidParamSchema,
} from "@kite/types";

export const postValidation = {
  create: {
    body: createPostRequestSchema,
  },
  update: {
    params: uuidParamSchema,
    body: updatePostRequestSchema,
  },
  publish: {
    params: uuidParamSchema,
  },
  unpublish: {
    params: uuidParamSchema,
  },
  getById: {
    params: uuidParamSchema,
  },
  delete: {
    params: uuidParamSchema,
  },
  getAll: {
    query: getPostsQuerySchema,
  },
};

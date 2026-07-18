import { z } from "zod";

export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema,
  });
export type ApiResponse<T = unknown> = z.infer<
  ReturnType<typeof apiResponseSchema<z.ZodType<T>>>
>;

export const apiErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
});
export type ApiError = z.infer<typeof apiErrorSchema>;

export const paginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  });
export type PaginatedResponse<T> = z.infer<
  ReturnType<typeof paginatedResponseSchema<z.ZodType<T>>>
>;

export const paginationParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
});
export type PaginationParams = z.infer<typeof paginationParamsSchema>;

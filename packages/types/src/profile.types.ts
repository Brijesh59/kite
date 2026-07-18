import { z } from "zod";
import { INTEREST_OPTIONS } from "@kite/config";

export const profileMetadataSchema = z.object({
  interests: z.array(z.enum(INTEREST_OPTIONS)).optional(),
  location: z.string().max(100).optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});
export type ProfileMetadata = z.infer<typeof profileMetadataSchema>;

export const updateProfileRequestSchema = z.object({
  bio: z.string().max(500).optional(),
  avatar: z.string().url().or(z.literal("")).optional(),
  metadata: profileMetadataSchema.optional(),
});
export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;

export const profileResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  bio: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  metadata: profileMetadataSchema.nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ProfileResponse = z.infer<typeof profileResponseSchema>;

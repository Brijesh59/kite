import { z } from "zod";

export const dashboardStatsSchema = z.object({
  totalUsers: z.number(),
  activeUsers: z.number(),
  totalPosts: z.number(),
  publishedPosts: z.number(),
  draftPosts: z.number(),
});
export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

export const userStatsSchema = z.object({
  totalPosts: z.number(),
  publishedPosts: z.number(),
  draftPosts: z.number(),
});
export type UserStats = z.infer<typeof userStatsSchema>;

export const recentActivitySchema = z.object({
  id: z.string(),
  type: z.enum(["USER_REGISTERED", "POST_CREATED", "POST_PUBLISHED"]),
  message: z.string(),
  timestamp: z.string(),
  userId: z.string().optional(),
  postId: z.string().optional(),
});
export type RecentActivity = z.infer<typeof recentActivitySchema>;

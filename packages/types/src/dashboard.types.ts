export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
}

export interface UserStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
}

export interface RecentActivity {
  id: string;
  type: "USER_REGISTERED" | "POST_CREATED" | "POST_PUBLISHED";
  message: string;
  timestamp: string;
  userId?: string;
  postId?: string;
}

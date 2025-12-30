import { useQuery } from "@tanstack/react-query";
import { useUsers } from "@/api/users/use-users";
import { usePosts } from "@/api/posts/use-posts";
import type { User, Post } from "@kite/types";

export interface DashboardStats {
  totalUsers: number;
  usersByRole: {
    admin: number;
    member: number;
    organiser?: number;
    artist?: number;
  };
  totalPosts: number;
  publishedPosts: number;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
  recentPosts: Array<{
    id: string;
    title: string;
    content: string;
    authorName: string;
    isPublished: boolean;
    createdAt: string;
  }>;
}

export const useDashboardStats = () => {
  // Get all users for stats
  const { data: usersResponse, isLoading: usersLoading } = useUsers({
    limit: 1000, // Get all users
  });

  // Get all posts for stats
  const { data: postsResponse, isLoading: postsLoading } = usePosts({
    limit: 1000, // Get all posts
  });

  return useQuery({
    queryKey: ["dashboard-stats", usersResponse, postsResponse],
    queryFn: () => {
      const users = usersResponse?.users || [];
      const posts = postsResponse?.data?.posts || [];

      // Calculate user stats by role
      const usersByRole = users.reduce(
        (acc: Record<string, number>, user: User) => {
          const role = user.role;
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      // Get recent users (last 5)
      const recentUsers = users
        .sort(
          (a: User, b: User) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .map((user: User) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        }));

      // Get recent posts (last 5)
      const recentPosts = posts
        .sort(
          (a: Post, b: Post) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .map((post: Post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          authorName: post.user?.name || "Unknown Author",
          isPublished: post.status === "PUBLISHED",
          createdAt: post.createdAt,
        }));

      const publishedPostsCount = posts.filter(
        (post: Post) => post.status === "PUBLISHED"
      ).length;

      const stats: DashboardStats = {
        totalUsers: users.length,
        usersByRole: {
          admin: usersByRole.admin || 0,
          member: usersByRole.member || 0,
          organiser: usersByRole.organiser || 0,
          artist: usersByRole.artist || 0,
        },
        totalPosts: posts.length,
        publishedPosts: publishedPostsCount,
        recentUsers,
        recentPosts,
      };

      return stats;
    },
    enabled:
      !usersLoading && !postsLoading && !!usersResponse && !!postsResponse,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

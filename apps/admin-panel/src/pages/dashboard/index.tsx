import { FileText, Users, CheckCircle, XCircle } from "lucide-react";
import { usePosts } from "@/api/posts/use-posts";
import { useUsers } from "@/api/users/use-users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PAGINATION, POST_STATUS } from "@kite/config";

export default function DashboardPage() {
  const { data: postsData } = usePosts({ limit: PAGINATION.maxLimit });
  const { data: draftPostsData } = usePosts({
    limit: 1,
    status: POST_STATUS.DRAFT,
  });
  const { data: publishedPostsData } = usePosts({
    limit: 1,
    status: POST_STATUS.PUBLISHED,
  });
  const { data: usersData } = useUsers({ limit: PAGINATION.maxLimit });
  const { data: activeUsersData } = useUsers({ limit: 1, isActive: true });
  const { data: inactiveUsersData } = useUsers({ limit: 1, isActive: false });

  const posts = postsData?.data?.posts || [];
  const users = usersData?.users || [];

  // Calculate stats
  const totalPosts = postsData?.pagination.total ?? posts.length;
  const totalUsers = usersData?.pagination.total ?? users.length;
  const draftPosts =
    draftPostsData?.pagination.total ??
    posts.filter((p) => p.status === POST_STATUS.DRAFT).length;
  const publishedPosts =
    publishedPostsData?.pagination.total ??
    posts.filter((p) => p.status === POST_STATUS.PUBLISHED).length;
  const activeUsers =
    activeUsersData?.pagination.total ?? users.filter((u) => u.isActive).length;
  const inactiveUsers =
    inactiveUsersData?.pagination.total ??
    users.filter((u) => !u.isActive).length;

  return (
    <div className="flex flex-col gap-section">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-normal">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your platform's activity
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">All posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
            <CardTitle className="text-sm font-medium">Draft Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftPosts}</div>
            <p className="text-xs text-muted-foreground">Unpublished posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
            <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedPosts}</div>
            <p className="text-xs text-muted-foreground">Live posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">All users</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {totalUsers > 0
                ? `${Math.round((activeUsers / totalUsers) * 100)}% of total users`
                : "No users yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveUsers}</div>
            <p className="text-xs text-muted-foreground">
              {totalUsers > 0
                ? `${Math.round((inactiveUsers / totalUsers) * 100)}% of total users`
                : "No users yet"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

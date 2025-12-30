import { useAuthStore } from "@/utils/auth-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@kite/ui";
import { FileText, User, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@kite/ui";
import { usePosts } from "@/api/posts/use-posts";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: postsData } = usePosts({ limit: 1 });

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="mt-2 text-gray-600">
          Here's an overview of your account
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Role</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.role}</div>
            <p className="text-xs text-muted-foreground">Your current role</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postsData?.data?.data?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Total posts created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Complete</div>
            <p className="text-xs text-muted-foreground">Profile status</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create Content</CardTitle>
            <CardDescription>
              Start creating and managing your posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/posts">
              <Button className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Go to Posts
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Update Profile</CardTitle>
            <CardDescription>
              Manage your account and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/profile">
              <Button variant="outline" className="w-full">
                <User className="mr-2 h-4 w-4" />
                Go to Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Role:</span>
            <span className="font-medium">{user?.role}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium text-green-600">Active</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

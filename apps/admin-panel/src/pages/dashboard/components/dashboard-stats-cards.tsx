import { Card, CardContent, CardHeader, CardTitle } from "@kite/ui";
import { ArrowUpRight } from "lucide-react";
import { type DashboardStats } from "@/api/dashboard/use-dashboard";

interface DashboardStatsCardsProps {
  stats: DashboardStats | undefined;
  onNavigate: (path: string) => void;
}

export function DashboardStatsCards({
  stats,
  onNavigate,
}: DashboardStatsCardsProps) {
  const dashboardStats = [
    {
      title: "Total Users",
      value: stats?.totalUsers?.toString() || "0",
      description: `${stats?.usersByRole.admin || 0} admins, ${
        stats?.usersByRole.member || 0
      } members`,
      icon: "Users",
      color: "text-blue-600",
      action: () => onNavigate("/users"),
    },
    {
      title: "Published Posts",
      value: stats?.publishedPosts?.toString() || "0",
      description: `${stats?.totalPosts || 0} total posts`,
      icon: "FileText",
      color: "text-green-600",
      action: () => onNavigate("/posts"),
    },
    {
      title: "Admin Users",
      value: stats?.usersByRole.admin?.toString() || "0",
      description: "System administrators",
      icon: "UserCheck",
      color: "text-purple-600",
      action: () => onNavigate("/users?role=ADMIN"),
    },
    {
      title: "Recent Activity",
      value: stats?.recentUsers?.length?.toString() || "0",
      description: "New users this period",
      icon: "Trophy",
      color: "text-yellow-600",
    },
  ];

  // Icon components mapping
  const iconComponents = {
    Users: () => (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
    ),
    FileText: () => (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    UserCheck: () => (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    Trophy: () => (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {dashboardStats.map((stat) => {
        const IconComponent =
          iconComponents[stat.icon as keyof typeof iconComponents];

        return (
          <Card
            key={stat.title}
            className={
              stat.action
                ? "cursor-pointer hover:shadow-md transition-shadow"
                : ""
            }
            onClick={stat.action}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="flex items-center gap-1">
                <div className={stat.color}>
                  <IconComponent />
                </div>
                {stat.action && (
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@kite/ui";
import { Users, Shield, UserCheck, Calendar } from "lucide-react";
import type { User } from "@kite/types";

interface UserStatsCardsProps {
  users: User[];
  totalCount: number;
}

export function UserStatsCards({ users, totalCount }: UserStatsCardsProps) {
  const adminUsers = users.filter((user) => user.role === "ADMIN");
  const memberUsers = users.filter((user) => user.role === "USER");

  // Calculate recent users (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const recentUsers = users.filter(
    (user) => new Date(user.createdAt) > weekAgo
  );

  const stats = [
    {
      title: "Total Users",
      value: totalCount,
      icon: Users,
      description: "All users in the system",
    },
    {
      title: "Admins",
      value: adminUsers.length,
      icon: Shield,
      description: "System administrators",
    },
    {
      title: "Members",
      value: memberUsers.length,
      icon: UserCheck,
      description: "Regular users",
    },
    {
      title: "Recent",
      value: recentUsers.length,
      icon: Calendar,
      description: "Last 7 days",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

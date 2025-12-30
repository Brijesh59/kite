import { Card, CardContent, CardHeader, CardTitle } from "@kite/ui";
import { FileText, Eye, EyeOff, Calendar } from "lucide-react";
import type { Post } from "@kite/types";

interface PostStatsCardsProps {
  posts: Post[];
  totalCount: number;
}

export function PostStatsCards({ posts, totalCount }: PostStatsCardsProps) {
  const publishedPosts = posts.filter((post) => post.status === "PUBLISHED");
  const draftPosts = posts.filter((post) => post.status === "DRAFT");

  // Calculate recent posts (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const recentPosts = posts.filter(
    (post) => new Date(post.createdAt) > weekAgo
  );

  const stats = [
    {
      title: "Total Posts",
      value: totalCount,
      icon: FileText,
      description: "All posts in the system",
    },
    {
      title: "Published",
      value: publishedPosts.length,
      icon: Eye,
      description: "Visible to users",
    },
    {
      title: "Drafts",
      value: draftPosts.length,
      icon: EyeOff,
      description: "Unpublished posts",
    },
    {
      title: "Recent",
      value: recentPosts.length,
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

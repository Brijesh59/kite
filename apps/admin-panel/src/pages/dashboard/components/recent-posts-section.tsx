import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@kite/ui";
import { Badge } from "@kite/ui";
import { Button } from "@kite/ui";
import { ChevronRightIcon, FileTextIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: string;
  title: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
  author: {
    name: string;
  };
}

interface RecentPostsSectionProps {
  posts: Post[];
}

export function RecentPostsSection({ posts }: RecentPostsSectionProps) {
  const navigate = useNavigate();
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null);

  const statusColors = {
    DRAFT: "bg-yellow-100 text-yellow-800",
    PUBLISHED: "bg-green-100 text-green-800",
    ARCHIVED: "bg-gray-100 text-gray-800",
  };

  const handleViewAllPosts = () => {
    navigate("/posts");
  };

  const handlePostClick = (postId: string) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">Recent Posts</CardTitle>
          <CardDescription>Latest blog posts and articles</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewAllPosts}
          className="ml-auto"
        >
          View All
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileTextIcon className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                No recent posts found
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                  hoveredPostId === post.id
                    ? "bg-muted/50 border-border"
                    : "hover:bg-muted/30"
                }`}
                onMouseEnter={() => setHoveredPostId(post.id)}
                onMouseLeave={() => setHoveredPostId(null)}
                onClick={() => handlePostClick(post.id)}
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileTextIcon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      by {post.author.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${statusColors[post.status]}`}
                  >
                    {post.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

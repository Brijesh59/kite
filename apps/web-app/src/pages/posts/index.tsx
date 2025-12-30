import { useState } from "react";
import { Button } from "@kite/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@kite/ui";
import { Badge } from "@kite/ui";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { usePosts, useDeletePost, usePublishPost, useUnpublishPost } from "@/api/posts/use-posts";
import { LoadingSpinner } from "@kite/ui";
import type { Post } from "@kite/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@kite/ui";

export default function PostsPage() {
  const [statusFilter, setStatusFilter] = useState<"ALL" | "DRAFT" | "PUBLISHED">("ALL");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = usePosts({ status: statusFilter, limit: 20 });
  const deleteMutation = useDeletePost();
  const publishMutation = usePublishPost();
  const unpublishMutation = useUnpublishPost();

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handlePublish = (id: string) => {
    publishMutation.mutate(id);
  };

  const handleUnpublish = (id: string) => {
    unpublishMutation.mutate(id);
  };

  const posts = data?.data?.data?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="mt-2 text-gray-600">
            Create and manage your posts
          </p>
        </div>
        <Link to="/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === "ALL" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("ALL")}
        >
          All
        </Button>
        <Button
          variant={statusFilter === "DRAFT" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("DRAFT")}
        >
          Drafts
        </Button>
        <Button
          variant={statusFilter === "PUBLISHED" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("PUBLISHED")}
        >
          Published
        </Button>
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600">
              No posts yet. Create your first post to get started!
            </p>
            <Link to="/posts/new">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post: Post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle>{post.title}</CardTitle>
                      <Badge variant={post.status === "PUBLISHED" ? "default" : "secondary"}>
                        {post.status}
                      </Badge>
                    </div>
                    <CardDescription className="mt-2">
                      {post.status === "PUBLISHED" && post.publishedAt
                        ? `Published on ${new Date(post.publishedAt).toLocaleDateString()}`
                        : `Created on ${new Date(post.createdAt).toLocaleDateString()}`}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {post.status === "DRAFT" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePublish(post.id)}
                        disabled={publishMutation.isPending}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Publish
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUnpublish(post.id)}
                        disabled={unpublishMutation.isPending}
                      >
                        <EyeOff className="mr-2 h-4 w-4" />
                        Unpublish
                      </Button>
                    )}
                    <Link to={`/posts/edit/${post.id}`}>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteId(post.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

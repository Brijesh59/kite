import { useState } from "react";
import { Button } from "@kite/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@kite/ui";
import { Badge } from "@kite/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kite/ui";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@kite/ui";
import {
  usePosts,
  useTogglePostStatus,
  useDeletePost,
} from "@/api/posts/use-posts";
import { LoadingSpinner } from "@kite/ui";
import { Trash2, Ban, CheckCircle, Eye } from "lucide-react";
import type { Post } from "@kite/types";

export default function PostsPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewPost, setViewPost] = useState<Post | null>(null);
  const { data, isLoading } = usePosts({ limit: 100 });
  const toggleStatusMutation = useTogglePostStatus();
  const deleteMutation = useDeletePost();

  const handleToggleStatus = (postId: string, currentStatus: boolean) => {
    toggleStatusMutation.mutate({ id: postId, isActive: !currentStatus });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const posts = data?.data?.posts || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Posts</h1>
        <p className="mt-2 text-gray-600">
          Manage all posts across the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No posts found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.user?.name || "Unknown"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          post.status === "PUBLISHED" ? "default" : "secondary"
                        }
                      >
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.isActive ? "default" : "secondary"}>
                        {post.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewPost(post)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleToggleStatus(post.id, post.isActive)
                          }
                          disabled={toggleStatusMutation.isPending}
                        >
                          {post.isActive ? (
                            <Ban className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteId(post.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Post Modal */}
      <Dialog open={!!viewPost} onOpenChange={() => setViewPost(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewPost?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  viewPost?.status === "PUBLISHED" ? "default" : "secondary"
                }
              >
                {viewPost?.status}
              </Badge>
              <Badge variant={viewPost?.isActive ? "default" : "secondary"}>
                {viewPost?.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Author:</strong> {viewPost?.user?.name || "Unknown"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {viewPost?.user?.email || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Created:</strong>{" "}
                {viewPost?.createdAt
                  ? new Date(viewPost.createdAt).toLocaleString()
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Updated:</strong>{" "}
                {viewPost?.updatedAt
                  ? new Date(viewPost.updatedAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Content</h3>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: viewPost?.content || "" }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              post.
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

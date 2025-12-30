import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@kite/ui";
import { Badge } from "@kite/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@kite/ui";
import { format } from "date-fns";
import { Calendar, User, Eye, EyeOff, FileText } from "lucide-react";
import type { Post } from "@kite/types";

interface PostDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
}

export function PostDetailsDialog({
  open,
  onOpenChange,
  post,
}: PostDetailsDialogProps) {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{post.title}</DialogTitle>
          <DialogDescription>Post details and information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Post Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Post Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Author:</span>
                  <span className="font-medium">{post.user?.name || "Unknown"}</span>
                </div>

                <div className="flex items-center gap-2">
                  {post.status === "PUBLISHED" ? (
                    <Eye className="h-4 w-4 text-green-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="text-sm text-gray-600">Visibility:</span>
                  <Badge variant={post.status === "PUBLISHED" ? "default" : "secondary"}>
                    {post.status === "PUBLISHED" ? "Published" : "Draft"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="font-medium">
                    {format(
                      new Date(post.createdAt),
                      "MMM dd, yyyy 'at' HH:mm"
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Updated:</span>
                  <span className="font-medium">
                    {format(
                      new Date(post.updatedAt),
                      "MMM dd, yyyy 'at' HH:mm"
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Post Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {post.content}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

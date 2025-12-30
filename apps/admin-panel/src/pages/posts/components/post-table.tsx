import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kite/ui";
import { Button } from "@kite/ui";
import { Badge } from "@kite/ui";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { Post } from "@kite/types";

interface PostTableProps {
  posts: Post[];
  isLoading: boolean;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onView: (post: Post) => void;
}

export function PostTable({
  posts,
  isLoading,
  onEdit,
  onDelete,
  onView,
}: PostTableProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts?.map((post) => (
          <TableRow
            key={post.id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => onView(post)}
          >
            <TableCell className="font-medium max-w-xs">
              <div className="truncate" title={post.title}>
                {post.title}
              </div>
            </TableCell>
            <TableCell>{post.user?.name || "Unknown"}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Badge variant={post.status === "PUBLISHED" ? "default" : "secondary"}>
                  {post.status === "PUBLISHED" ? "Published" : "Draft"}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              {format(new Date(post.createdAt), "MMM dd, yyyy")}
            </TableCell>
            <TableCell>
              {format(new Date(post.updatedAt), "MMM dd, yyyy")}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(post);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(post);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(post);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {posts?.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
              No posts found. Create your first post to get started!
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

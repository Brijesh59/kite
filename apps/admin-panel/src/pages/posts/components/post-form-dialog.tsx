import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@kite/ui";
import { Button } from "@kite/ui";
import { Input } from "@kite/ui";
import { Textarea } from "@kite/ui";
import { Label } from "@kite/ui";
import { Switch } from "@kite/ui";
import type { Post, CreatePostRequest } from "@kite/types";

const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(5000, "Content cannot exceed 5000 characters"),
  isPublished: z.boolean(),
});

type PostForm = z.infer<typeof postSchema>;

interface PostFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: Post | null;
  onSubmit: (data: CreatePostRequest) => void;
  isLoading?: boolean;
}

export function PostFormDialog({
  open,
  onOpenChange,
  post,
  onSubmit,
  isLoading = false,
}: PostFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      isPublished: post ? post.status === "PUBLISHED" : true,
    },
  });

  const isPublished = watch("isPublished");

  const handleClose = () => {
    reset();

    onOpenChange(false);
  };

  const onFormSubmit = (data: PostForm) => {
    onSubmit({
      ...data,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Post" : "Create New Post"}</DialogTitle>
          <DialogDescription>
            {post
              ? "Update your post details below."
              : "Fill in the details to create a new post."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter post title..."
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Write your post content here..."
              rows={8}
              className="resize-none"
              {...register("content")}
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          {/* Visibility */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublished"
              checked={isPublished}
              onCheckedChange={(checked) => setValue("isPublished", checked)}
            />
            <Label htmlFor="isPublished" className="font-medium">
              Make this post published
            </Label>
          </div>
          <p className="text-xs text-gray-500">
            Published posts are visible to everyone. Unpublished posts are only
            visible to you.
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : post ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@kite/ui";
import { Button } from "@kite/ui";
import type { Post } from "@kite/types";

interface PostDeleteDialogProps {
  open: boolean;
  post: Post | null;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (post: Post) => void;
}

export function PostDeleteDialog({
  open,
  post,
  isDeleting,
  onOpenChange,
  onConfirm,
}: PostDeleteDialogProps) {
  const handleConfirm = () => {
    if (post) {
      onConfirm(post);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{post?.title}"? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

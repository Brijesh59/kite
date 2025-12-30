import { Button } from "@kite/ui";
import { FileText, Plus } from "lucide-react";

interface PostPageHeaderProps {
  onCreatePost: () => void;
}

export function PostPageHeader({ onCreatePost }: PostPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <FileText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Posts Management</h1>
      </div>
      <Button onClick={onCreatePost}>
        <Plus className="mr-2 h-4 w-4" />
        Create Post
      </Button>
    </div>
  );
}

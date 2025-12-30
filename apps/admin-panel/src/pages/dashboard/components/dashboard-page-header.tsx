import { Button } from "@kite/ui";
import { Plus } from "lucide-react";

interface DashboardPageHeaderProps {
  onNavigate: (path: string) => void;
}

export function DashboardPageHeader({ onNavigate }: DashboardPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Admin Panel</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => onNavigate("/users")}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
        <Button onClick={() => onNavigate("/posts")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>
    </div>
  );
}

import { Button } from "@kite/ui";
import { Users, Plus } from "lucide-react";

interface UserPageHeaderProps {
  onCreateUser: () => void;
}

export function UserPageHeader({ onCreateUser }: UserPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Users Management</h1>
      </div>
      <Button onClick={onCreateUser}>
        <Plus className="mr-2 h-4 w-4" />
        Add User
      </Button>
    </div>
  );
}

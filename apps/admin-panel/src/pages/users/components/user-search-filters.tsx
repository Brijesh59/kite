import { Input } from "@kite/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kite/ui";
import { Search } from "lucide-react";

interface UserSearchFiltersProps {
  search: string;
  role?: string;
  sortBy: string;
  sortOrder: string;
  onSearchChange: (search: string) => void;
  onRoleChange: (role: string | undefined) => void;
  onSortByChange: (sortBy: string) => void;
  onSortOrderChange: (sortOrder: string) => void;
}

export function UserSearchFilters({
  search,
  role,
  sortBy,
  sortOrder,
  onSearchChange,
  onRoleChange,
  onSortByChange,
  onSortOrderChange,
}: UserSearchFiltersProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select
        value={role || "all"}
        onValueChange={(value) =>
          onRoleChange(value === "all" ? undefined : value)
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="ORGANISER">Organiser</SelectItem>
          <SelectItem value="ARTIST">Artist</SelectItem>
          <SelectItem value="USER">User</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Created Date</SelectItem>
          <SelectItem value="updatedAt">Updated Date</SelectItem>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="email">Email</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={onSortOrderChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Newest</SelectItem>
          <SelectItem value="asc">Oldest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

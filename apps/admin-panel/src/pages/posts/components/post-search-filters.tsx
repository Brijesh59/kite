import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getWorkspacesApi } from "@/api/workspaces";

interface PostSearchFiltersProps {
  search: string;
  sortBy: string;
  sortOrder: string;
  workspaceId?: string;
  onSearchChange: (search: string) => void;
  onSortByChange: (sortBy: string) => void;
  onSortOrderChange: (sortOrder: string) => void;
  onWorkspaceChange?: (workspaceId: string) => void;
}

export function PostSearchFilters({
  search,
  sortBy,
  sortOrder,
  workspaceId,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
  onWorkspaceChange,
}: PostSearchFiltersProps) {
  const { data: workspacesData } = useQuery({
    queryKey: ["workspaces"],
    queryFn: () => getWorkspacesApi({ limit: 100 }),
  });

  const workspaces = workspacesData?.data.data.items || [];

  return (
    <div className="flex items-center space-x-4 flex-wrap gap-2">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Created Date</SelectItem>
          <SelectItem value="updatedAt">Updated Date</SelectItem>
          <SelectItem value="title">Title</SelectItem>
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
      {onWorkspaceChange && (
        <Select value={workspaceId || "all"} onValueChange={onWorkspaceChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Workspaces" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Workspaces</SelectItem>
            {workspaces.map((workspace) => (
              <SelectItem key={workspace.id} value={workspace.id}>
                {workspace.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWorkspaceStore } from "@/utils/workspace-store";
import { getWorkspacesApi } from "@/api/workspaces";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WorkspaceWithRole } from "@kite/types";

interface WorkspaceSwitcherProps {
  className?: string;
  onCreateWorkspace?: () => void;
}

export function WorkspaceSwitcher({
  className,
  onCreateWorkspace,
}: WorkspaceSwitcherProps) {
  const { currentWorkspace, setCurrentWorkspace, setWorkspaces } =
    useWorkspaceStore();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: workspacesData } = useQuery({
    queryKey: ["workspaces"],
    queryFn: () => getWorkspacesApi({ limit: 100 }),
  });

  const workspaces = workspacesData?.data.data.items || [];

  // Update store when workspaces change
  useEffect(() => {
    if (workspaces.length > 0) {
      setWorkspaces(workspaces);
    }
  }, [workspaces, setWorkspaces]);

  const handleSelectWorkspace = (workspace: WorkspaceWithRole) => {
    setCurrentWorkspace(workspace);
    setOpen(false);

    // Invalidate all queries to refetch data for the new workspace
    queryClient.invalidateQueries();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <span className="text-xs font-semibold">
                {currentWorkspace?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="truncate text-sm font-medium">
              {currentWorkspace?.name || "Select workspace"}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onSelect={() => handleSelectWorkspace(workspace)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                <span className="text-xs font-semibold">
                  {workspace.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{workspace.name}</span>
                <span className="text-xs text-muted-foreground">
                  {workspace.memberRole}
                </span>
              </div>
            </div>
            {currentWorkspace?.id === workspace.id && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
        {onCreateWorkspace && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={onCreateWorkspace}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create workspace</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

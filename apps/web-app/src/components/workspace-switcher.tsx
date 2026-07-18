import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
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

  const workspaces = useMemo(
    () => workspacesData?.data.data.items || [],
    [workspacesData?.data.data.items]
  );

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
          className={cn(
            "w-full justify-between group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0",
            className
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <span className="text-xs font-semibold">
                {currentWorkspace?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="truncate text-sm font-medium group-data-[collapsible=icon]:hidden">
              {currentWorkspace?.name || "Select workspace"}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 group-data-[collapsible=icon]:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((workspace: WorkspaceWithRole) => (
          <DropdownMenuItem
            key={workspace.id}
            onSelect={() => handleSelectWorkspace(workspace)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
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

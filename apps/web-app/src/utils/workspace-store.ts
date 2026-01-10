import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WorkspaceWithRole } from "@kite/types";

interface WorkspaceState {
  currentWorkspace: WorkspaceWithRole | null;
  workspaces: WorkspaceWithRole[];
  setCurrentWorkspace: (workspace: WorkspaceWithRole) => void;
  setWorkspaces: (workspaces: WorkspaceWithRole[]) => void;
  clearWorkspaces: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      currentWorkspace: null,
      workspaces: [],
      setCurrentWorkspace: (workspace) => {
        set({ currentWorkspace: workspace });
      },
      setWorkspaces: (workspaces) => {
        set({ workspaces });
        // If there's no current workspace and workspaces exist, set the first one
        set((state) => ({
          currentWorkspace:
            state.currentWorkspace || workspaces[0] || null,
        }));
      },
      clearWorkspaces: () => {
        set({ currentWorkspace: null, workspaces: [] });
      },
    }),
    {
      name: "workspace-storage",
      partialize: (state) => ({
        currentWorkspace: state.currentWorkspace,
        workspaces: state.workspaces,
      }),
    }
  )
);

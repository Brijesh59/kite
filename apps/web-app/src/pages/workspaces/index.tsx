import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWorkspacesApi,
  createWorkspaceApi,
  updateWorkspaceApi,
  deleteWorkspaceApi,
  type CreateWorkspaceRequest,
  type UpdateWorkspaceRequest,
} from "@/api/workspaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Plus, Users, FileText } from "lucide-react";
import { toast } from "sonner";
import type { WorkspaceWithRole } from "@kite/types";

export default function WorkspacesPage() {
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkspaceWithRole | null>(null);
  const [formData, setFormData] = useState<CreateWorkspaceRequest>({
    name: "",
    description: "",
  });

  const { data: workspacesData, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: () => getWorkspacesApi({ limit: 100 }),
  });

  const workspaces = workspacesData?.data.data.items || [];

  const createMutation = useMutation({
    mutationFn: createWorkspaceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      setCreateDialogOpen(false);
      setFormData({ name: "", description: "" });
      toast.success("Workspace created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create workspace");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkspaceRequest }) =>
      updateWorkspaceApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      setEditDialogOpen(false);
      setSelectedWorkspace(null);
      setFormData({ name: "", description: "" });
      toast.success("Workspace updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update workspace");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWorkspaceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      setDeleteDialogOpen(false);
      setSelectedWorkspace(null);
      toast.success("Workspace deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete workspace");
    },
  });

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleEdit = () => {
    if (selectedWorkspace) {
      updateMutation.mutate({ id: selectedWorkspace.id, data: formData });
    }
  };

  const handleDelete = () => {
    if (selectedWorkspace) {
      deleteMutation.mutate(selectedWorkspace.id);
    }
  };

  const openEditDialog = (workspace: WorkspaceWithRole) => {
    setSelectedWorkspace(workspace);
    setFormData({
      name: workspace.name,
      description: workspace.description || "",
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (workspace: WorkspaceWithRole) => {
    setSelectedWorkspace(workspace);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workspaces</h1>
          <p className="mt-2 text-gray-600">
            Manage your workspaces and collaborate with your team
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Workspace
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((workspace) => (
          <Card key={workspace.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{workspace.name}</h3>
                  <Badge variant="secondary">{workspace.memberRole}</Badge>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {workspace.description || "No description"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{workspace._count?.members || 0} members</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{workspace._count?.posts || 0} posts</span>
              </div>
            </div>

            {workspace.memberRole === "OWNER" && (
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(workspace)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteDialog(workspace)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Workspace</DialogTitle>
            <DialogDescription>
              Create a new workspace to organize your work
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="My Workspace"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="A brief description of your workspace"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createMutation.isPending || !formData.name.trim()}
            >
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Workspace</DialogTitle>
            <DialogDescription>
              Update your workspace details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="My Workspace"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="A brief description of your workspace"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={updateMutation.isPending || !formData.name.trim()}
            >
              {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedWorkspace?.name}"? This
              action cannot be undone and will remove all posts in this
              workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

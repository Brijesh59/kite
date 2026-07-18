import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type User,
  type CreateUserRequest,
  type UpdateUserRequest,
  type UserRole,
} from "@kite/types";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => void;
  isLoading?: boolean;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  isLoading = false,
}: UserFormDialogProps) {
  const emptyFormData = {
    name: "",
    email: "",
    password: "",
    role: "USER" as UserRole,
  };

  const [draft, setDraft] = useState({
    key: "new",
    data: emptyFormData,
  });

  const isEdit = !!user;

  // Helper function to map frontend role to backend role
  const mapToBackendRole = (frontendRole: string): UserRole => {
    switch (frontendRole) {
      case "admin":
        return "ADMIN";
      case "member":
        return "USER";
      default:
        return "USER";
    }
  };

  const formKey = user?.id ?? "new";
  const initialFormData = user
    ? {
        name: user.name,
        email: user.email,
        password: "",
        role: mapToBackendRole(user.role),
      }
    : emptyFormData;
  const formData = draft.key === formKey ? draft.data : initialFormData;

  const updateFormData = (data: Partial<typeof formData>) => {
    setDraft({
      key: formKey,
      data: {
        ...formData,
        ...data,
      },
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setDraft({ key: "new", data: emptyFormData });
    }

    onOpenChange(nextOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit) {
      const updateData: UpdateUserRequest = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      onSubmit(updateData);
    } else {
      const createData: CreateUserRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };
      onSubmit(createData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Make changes to the user here. Click save when you're done."
              : "Fill in the details to create a new user. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              Password {isEdit && "(leave empty to keep current password)"}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => updateFormData({ password: e.target.value })}
              required={!isEdit}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: UserRole) =>
                updateFormData({ role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="ORGANISER">Organiser</SelectItem>
                <SelectItem value="ARTIST">Artist</SelectItem>
                <SelectItem value="USER">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : isEdit
                ? "Save Changes"
                : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

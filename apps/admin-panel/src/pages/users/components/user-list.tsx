import { useState } from "react";
import { toast } from "sonner";
import { UserTable } from "./user-table";
import { UserFormDialog } from "./user-form-dialog";
import { UserDeleteDialog } from "./user-delete-dialog";
import { UserPagination } from "./user-pagination";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/api/users/use-users";
import {
  type User,
  type CreateUserRequest,
  type UpdateUserRequest,
  type GetUsersQuery,
} from "@kite/types";

interface UserListProps {
  filters: GetUsersQuery;
  onFiltersChange: (filters: Partial<GetUsersQuery>) => void;
}

export function UserList({ filters, onFiltersChange }: UserListProps) {
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: usersResponse, error } = useUsers(filters);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const users = usersResponse?.users || [];
  const pagination = usersResponse?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsFormDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (
    data: CreateUserRequest | UpdateUserRequest
  ) => {
    try {
      if (userToEdit) {
        await updateUserMutation.mutateAsync({
          id: userToEdit.id,
          data: data as UpdateUserRequest,
        });
        toast.success("User updated successfully");
      } else {
        await createUserMutation.mutateAsync(data as CreateUserRequest);
        toast.success("User created successfully");
      }
      setIsFormDialogOpen(false);
      setUserToEdit(null);
    } catch {
      toast.error(
        userToEdit ? "Failed to update user" : "Failed to create user"
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await deleteUserMutation.mutateAsync(userToDelete.id);
      toast.success("User deleted successfully");
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handlePageChange = (page: number) => {
    onFiltersChange({ page });
  };

  const handlePageSizeChange = (limit: number) => {
    onFiltersChange({ limit, page: 1 });
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UserTable
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {pagination.total > 0 && (
        <UserPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          pageSize={pagination.limit}
          totalUsers={pagination.total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <UserFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        user={userToEdit}
        onSubmit={handleFormSubmit}
        isLoading={createUserMutation.isPending || updateUserMutation.isPending}
      />

      <UserDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={userToDelete}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  );
}

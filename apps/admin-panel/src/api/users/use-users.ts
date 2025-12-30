import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsersApi,
  getUserByIdApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  toggleUserStatusApi,
} from "./index";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type {
  GetUsersQuery,
  UpdateUserRequest,
  User,
} from "@kite/types";

interface ApiError {
  message: string;
}

interface UsersHookResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const useUsers = (params?: GetUsersQuery) =>
  useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => getUsersApi(params),
    select: (response): UsersHookResponse => ({
      users: response.data.data.users,
      pagination: response.data.pagination,
    }),
  });

export const useUser = (id: string) =>
  useQuery({
    queryKey: ["admin-users", id],
    queryFn: () => getUserByIdApi(id),
    select: (response) => response.data.data.user,
    enabled: !!id,
  });

export const useCreateUser = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User created successfully!");
      onSuccess?.();
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to create user");
    },
  });
};

export const useUpdateUser = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      updateUserApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User updated successfully!");
      onSuccess?.();
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });
};

export const useDeleteUser = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User deleted successfully!");
      onSuccess?.();
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
};

export const useToggleUserStatus = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleUserStatusApi(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User status updated successfully!");
      onSuccess?.();
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to update user status");
    },
  });
};

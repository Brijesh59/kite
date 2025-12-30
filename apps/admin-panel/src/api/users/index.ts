import { api } from "@/utils/api";
import type {
  GetUsersQuery,
  CreateUserRequest,
  UpdateUserRequest,
  User,
} from "@kite/types";

// API Response types matching backend structure
interface UsersApiResponse {
  message: string;
  data: {
    users: User[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UserApiResponse {
  message: string;
  data: {
    user: User;
  };
}

interface DeleteUserApiResponse {
  message: string;
}

export const getUsersApi = (params?: GetUsersQuery) =>
  api.get<UsersApiResponse>("/admin/users", { params });

export const getUserByIdApi = (id: string) =>
  api.get<UserApiResponse>(`/admin/users/${id}`);

export const createUserApi = (data: CreateUserRequest) =>
  api.post<UserApiResponse>("/admin/users", data);

export const updateUserApi = (id: string, data: UpdateUserRequest) =>
  api.put<UserApiResponse>(`/admin/users/${id}`, data);

export const deleteUserApi = (id: string) =>
  api.delete<DeleteUserApiResponse>(`/admin/users/${id}`);

export const toggleUserStatusApi = (id: string, isActive: boolean) =>
  api.put<UserApiResponse>(`/admin/users/${id}`, { isActive });

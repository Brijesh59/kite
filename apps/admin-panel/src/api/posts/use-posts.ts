import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPostsApi,
  getPostByIdApi,
  createPostApi,
  updatePostApi,
  deletePostApi,
  getMyPostsApi,
  togglePostStatusApi,
} from "./index";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { GetPostsQuery, UpdatePostRequest } from "@kite/types";

interface ApiError {
  message: string;
}

export const usePosts = (params?: GetPostsQuery) =>
  useQuery({
    queryKey: ["posts", params],
    queryFn: () => getPostsApi(params),
    select: (response) => response.data,
  });

export const usePost = (id: string) =>
  useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPostByIdApi(id),
    select: (data) => data.data.data,
    enabled: !!id,
  });

export const useMyPosts = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) =>
  useQuery({
    queryKey: ["my-posts", params],
    queryFn: () => getMyPostsApi(params),
    select: (response) => response.data,
  });

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      toast.success("Post created successfully!");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to create post");
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdatePostRequest;
    }) => updatePostApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      toast.success("Post updated successfully!");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to update post");
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePostApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      toast.success("Post deleted successfully!");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to delete post");
    },
  });
};

export const useTogglePostStatus = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      togglePostStatusApi(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      toast.success("Post status updated successfully!");
      onSuccess?.();
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error.response?.data?.message || "Failed to update post status"
      );
    },
  });
};

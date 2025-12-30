import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  getPostsApi,
  getPostApi,
  createPostApi,
  updatePostApi,
  publishPostApi,
  unpublishPostApi,
  deletePostApi,
  type GetPostsQuery,
  type UpdatePostRequest,
} from "./index";

// Get posts list
export const usePosts = (params: GetPostsQuery = {}) => {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => getPostsApi(params),
  });
};

// Get single post
export const usePost = (id: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostApi(id),
    enabled: !!id,
  });
};

// Create post
export const useCreatePost = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created successfully!");
      navigate("/posts");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create post");
    },
  });
};

// Update post
export const useUpdatePost = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostRequest }) =>
      updatePostApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post updated successfully!");
      navigate("/posts");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update post");
    },
  });
};

// Publish post
export const usePublishPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post published successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to publish post");
    },
  });
};

// Unpublish post
export const useUnpublishPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unpublishPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post unpublished successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to unpublish post");
    },
  });
};

// Delete post
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete post");
    },
  });
};

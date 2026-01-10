import { useMutation } from "@tanstack/react-query";
import { loginApi, registerApi, forgotPasswordApi, resetPasswordApi } from "./index";
import { getProfileApi } from "../profile";
import { getWorkspacesApi } from "../workspaces";
import { useAuthStore } from "@/utils/auth-store";
import { useWorkspaceStore } from "@/utils/workspace-store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ApiError {
  message: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { setWorkspaces } = useWorkspaceStore();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: async (response) => {
      const { user } = response.data.data;

      // Check profile status and fetch workspaces
      try {
        const [profileResponse, workspacesResponse] = await Promise.all([
          getProfileApi(),
          getWorkspacesApi({ limit: 100 }),
        ]);

        const profileCompleted = profileResponse.data.data.completed;
        const workspaces = workspacesResponse.data.data.items;

        // Set workspaces in store (first workspace will be auto-selected)
        if (workspaces.length > 0) {
          setWorkspaces(workspaces);
        }

        login(user, profileCompleted);
        toast.success("Login successful!");

        // Redirect based on profile completion
        navigate(profileCompleted ? "/dashboard" : "/onboarding");
      } catch {
        // If check fails, assume not completed
        login(user, false);
        navigate("/onboarding");
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { setWorkspaces } = useWorkspaceStore();

  return useMutation({
    mutationFn: registerApi,
    onSuccess: async (response) => {
      const { user } = response.data.data;

      // Fetch workspaces (backend auto-creates default workspace on registration)
      try {
        const workspacesResponse = await getWorkspacesApi({ limit: 100 });
        const workspaces = workspacesResponse.data.data.items;

        // Set workspaces in store (first workspace will be auto-selected)
        if (workspaces.length > 0) {
          setWorkspaces(workspaces);
        }
      } catch (error) {
        console.error("Failed to fetch workspaces:", error);
      }

      login(user, false); // Not onboarded yet
      toast.success("Registration successful!");
      navigate("/onboarding");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
};

export const useForgotPassword = () =>
  useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: () => {
      toast.success("Password reset email sent!");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error.response?.data?.message || "Failed to send reset email"
      );
    },
  });

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      toast.success("Password reset successful!");
      navigate("/login");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Failed to reset password");
    },
  });
};

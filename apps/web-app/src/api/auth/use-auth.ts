import { useMutation } from "@tanstack/react-query";
import { loginApi, registerApi, forgotPasswordApi, resetPasswordApi } from "./index";
import { getProfileApi } from "../profile";
import { useAuthStore } from "@/utils/auth-store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ApiError {
  message: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: async (response) => {
      const { user } = response.data.data;

      // Check profile status
      try {
        const profileResponse = await getProfileApi();
        const profileCompleted = profileResponse.data.data.completed;

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

  return useMutation({
    mutationFn: registerApi,
    onSuccess: (response) => {
      const { user } = response.data.data;
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

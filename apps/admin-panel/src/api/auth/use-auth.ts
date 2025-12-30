import { useMutation } from "@tanstack/react-query";
import { loginApi, forgotPasswordApi, resetPasswordApi } from "./index";
import { useAuthStore } from "@/utils/auth-store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ApiError {
  message: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      const { user } = response.data.data;

      console.log("Login successful:", user);

      login(user);
      toast.success("Login successful!");

      navigate("/dashboard");
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Login failed:", error);

      toast.error(error.response?.data?.message || "Login failed");
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

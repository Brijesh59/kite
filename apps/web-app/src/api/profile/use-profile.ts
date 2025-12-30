import { useMutation, useQuery } from "@tanstack/react-query";
import { updateProfileApi, getProfileApi } from "./index";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/utils/auth-store";
import { toast } from "sonner";

export const useUpdateProfile = () => {
  const navigate = useNavigate();
  const { setOnboardingCompleted } = useAuthStore();

  return useMutation({
    mutationFn: updateProfileApi,
    onSuccess: () => {
      setOnboardingCompleted(true);
      toast.success("Profile completed!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
};

export const useProfileStatus = () => {
  return useQuery({
    queryKey: ["profile-status"],
    queryFn: getProfileApi,
  });
};

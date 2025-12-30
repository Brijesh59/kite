import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/utils/auth-store";

export function OnboardingRoute() {
  const user = useAuthStore((state) => state.user);
  const onboardingCompleted = useAuthStore((state) => state.onboardingCompleted);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

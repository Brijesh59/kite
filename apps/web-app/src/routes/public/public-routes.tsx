import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/utils/auth-store";

export function PublicRoute() {
  const user = useAuthStore((state) => state.user);
  const onboardingCompleted = useAuthStore((state) => state.onboardingCompleted);

  if (user) {
    if (!onboardingCompleted) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

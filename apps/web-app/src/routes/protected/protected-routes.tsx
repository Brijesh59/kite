import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/utils/auth-store";
import { Layout } from "@/components/layout/layout";

export function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  const onboardingCompleted = useAuthStore(
    (state) => state.onboardingCompleted
  );

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

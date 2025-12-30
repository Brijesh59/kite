import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/utils/auth-store";
import { Layout } from "@/components/layout/layout";

export function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

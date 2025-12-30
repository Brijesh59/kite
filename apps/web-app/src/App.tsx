import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

// Route components
import { PublicRoute } from "@/routes/public/public-routes";
import { ProtectedRoute } from "@/routes/protected/protected-routes";
import { OnboardingRoute } from "@/routes/onboarding/onboarding-route";

// Pages
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ForgotPasswordPage from "@/pages/auth/forget-password";
import ResetPasswordPage from "@/pages/auth/reset-password";
import OnboardingPage from "@/pages/onboarding";
import DashboardPage from "@/pages/dashboard";
import PostsPage from "@/pages/posts";
import PostFormPage from "@/pages/posts/post-form";
import ProfilePage from "@/pages/profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route element={<PublicRoute />}>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
              <Route path="/login" element={<Navigate to="/auth/login" replace />} />
            </Route>

            {/* Onboarding route */}
            <Route element={<OnboardingRoute />}>
              <Route path="/onboarding" element={<OnboardingPage />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/posts" element={<PostsPage />} />
              <Route path="/posts/new" element={<PostFormPage />} />
              <Route path="/posts/edit/:id" element={<PostFormPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

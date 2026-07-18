import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginRequestSchema, type LoginRequest } from "@kite/types";
import { useLogin } from "@/api/auth/use-auth";
import { Form } from "@kite/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type LoginForm = LoginRequest;

const demoAdminCredentials = {
  email: "admin@kite.test",
  password: "DemoPass123!",
};

export default function LoginPage() {
  const login = useLogin();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: demoAdminCredentials,
  });

  const onSubmit = (data: LoginForm) => {
    login.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center overflow-hidden rounded-lg bg-background shadow-sm ring-1 ring-border">
            <img
              src="/logo.png"
              alt="Kite logo"
              className="size-full scale-150 object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-normal text-foreground">
              Kite Admin
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage users, workspaces, and content.
            </p>
          </div>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Demo credentials are ready for local testing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form form={form} onSubmit={onSubmit}>
              {({ FormInput }) => (
                <>
                  <FormInput
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                  <FormInput
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    showPasswordToggle
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={login.isPending}
                  >
                    {login.isPending ? "Signing in..." : "Sign in"}
                  </Button>

                  <div className="text-center">
                    <Link
                      to="/forget-password"
                      className="text-sm font-medium text-primary hover:text-primary/80"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </>
              )}
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

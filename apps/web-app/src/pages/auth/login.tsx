import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginRequestSchema, type LoginRequest } from "@kite/types";
import { useLogin } from "@/api/auth/use-auth";
import { Form } from "@kite/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type LoginForm = LoginRequest;

const demoUserCredentials = {
  email: "user@kite.test",
  password: "DemoPass123!",
};

export default function LoginPage() {
  const login = useLogin();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: demoUserCredentials,
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
              Kite
            </h1>
            <p className="text-sm text-muted-foreground">
              Workspaces, drafts, and publishing in one place.
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
                    placeholder="your@email.com"
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

                  <div className="flex items-center justify-between">
                    <Link
                      to="/auth/forgot-password"
                      className="text-sm font-medium text-primary hover:text-primary/80"
                    >
                      Forgot password?
                    </Link>
                    <Link
                      to="/auth/register"
                      className="text-sm font-medium text-primary hover:text-primary/80"
                    >
                      Create account
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

import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPasswordRequestSchema } from "@kite/types";
import { useResetPassword } from "@/api/auth/use-auth";
import { Form } from "@kite/ui";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const resetPasswordSchema = z
  .object({
    password: resetPasswordRequestSchema.shape.password,
    confirmPassword: resetPasswordRequestSchema.shape.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const resetPassword = useResetPassword();

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordForm) => {
    if (!token) {
      return;
    }
    resetPassword.mutate({
      token,
      password: data.password,
    });
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Invalid Reset Link</CardTitle>
              <CardDescription>
                The password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/auth/login">
                <Button className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
            <img
              src="/logo.png"
              alt="Kite logo"
              className="size-full scale-150 object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Kite</h1>
          <p className="text-gray-600">Reset your password</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <Form form={form} onSubmit={onSubmit}>
              {({ FormInput }) => (
                <>
                  <FormInput
                    name="password"
                    label="New Password"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    showPasswordToggle
                  />
                  <FormInput
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    showPasswordToggle
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={resetPassword.isPending}
                  >
                    {resetPassword.isPending ? "Resetting..." : "Reset Password"}
                  </Button>

                  <div className="text-center">
                    <Link to="/auth/login">
                      <Button variant="ghost" className="w-full">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                      </Button>
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

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordRequestSchema,
  type ForgotPasswordRequest,
} from "@kite/types";
import { useForgotPassword } from "@/api/auth/use-auth";
import { Form } from "@kite/ui";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ForgotPasswordForm = ForgotPasswordRequest;

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordRequestSchema),
  });

  const onSubmit = (data: ForgotPasswordForm) => {
    forgotPassword.mutate(data);
  };

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
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your
              password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {forgotPassword.isSuccess ? (
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800">
                    Password reset email sent! Check your inbox for further
                    instructions.
                  </p>
                </div>
                <Link to="/auth/login">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
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
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={forgotPassword.isPending}
                    >
                      {forgotPassword.isPending ? "Sending..." : "Send Reset Link"}
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

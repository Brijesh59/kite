import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerRequestSchema } from "@kite/types";
import { useRegister } from "@/api/auth/use-auth";
import { Link } from "react-router-dom";
import { Form } from "@kite/ui";
import { Button } from "@/components/ui/button";

const registerSchema = z
  .object({
    ...registerRequestSchema.shape,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useRegister();

  const onSubmit = (data: RegisterForm) => {
    const registerData = registerRequestSchema.parse(data);
    registerMutation.mutate(registerData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
            <img
              src="/logo.png"
              alt="Kite logo"
              className="size-full scale-150 object-cover"
            />
          </div>
          <h2 className="text-center text-3xl font-bold">Kite</h2>
          <p className="text-center text-sm text-gray-600">
            Create your account
          </p>
        </div>

        <Form form={form} onSubmit={onSubmit} className="gap-6">
          {({ FormInput }) => (
            <>
              <FormInput
                name="name"
                label="Full Name"
                placeholder="Full Name"
                autoComplete="name"
              />
              <FormInput
                name="email"
                label="Email"
                type="email"
                placeholder="Email"
                autoComplete="email"
              />
              <FormInput
                name="mobile"
                label="Mobile"
                placeholder="Mobile (optional)"
                autoComplete="tel"
              />
              <FormInput
                name="password"
                label="Password"
                placeholder="Password"
                autoComplete="new-password"
                showPasswordToggle
              />
              <FormInput
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm Password"
                autoComplete="new-password"
                showPasswordToggle
              />
              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Creating account..." : "Sign Up"}
              </Button>
            </>
          )}
        </Form>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

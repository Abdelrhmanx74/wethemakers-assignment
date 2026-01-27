"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type ActionResult, type Role } from "@/types/auth";
import { Briefcase, Users } from "lucide-react";
import { toast } from "sonner";
import { signUpAction } from "../_actions/signUp";

interface SignupFormProps extends React.ComponentProps<"div"> {
  role: Role;
}

export function SignupForm({ className, role, ...props }: SignupFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<
    ActionResult | undefined,
    FormData
  >(signUpAction, undefined);

  useEffect(() => {
    if (state?.success) {
      toast.success("Account created!", {
        description: "Welcome to Acme Jobs. Your account has been created.",
      });
      router.push("/dashboard");
      router.refresh();
    } else if (state?.error) {
      toast.error("Signup failed", {
        description: state.error,
      });
    }
  }, [state, router]);

  const isJobSeeker = role === "jobseeker";
  const Icon = isJobSeeker ? Briefcase : Users;
  const title = isJobSeeker
    ? "Create Job Seeker Account"
    : "Create Employer Account";
  const description = isJobSeeker
    ? "Find your dream job today"
    : "Start hiring top talent";
  const accentColor = isJobSeeker ? "blue" : "purple";

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div
            className={`mx-auto mb-4 inline-flex items-center justify-center size-14 rounded-2xl bg-${accentColor}-500/20`}
          >
            <Icon className={`size-7 text-${accentColor}-500`} />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <input type="hidden" name="role" value={role} />
            <FieldGroup>
              {state?.error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {state.error}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  disabled={isPending}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isPending}
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      disabled={isPending}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      disabled={isPending}
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <a href="/login" className="underline underline-offset-4">
                    Sign in
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}

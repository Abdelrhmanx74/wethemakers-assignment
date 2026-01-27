"use server";
import { signIn } from "@/auth";
import { ActionResult } from "@/types/auth";
import { AuthError } from "next-auth";

export async function signInAction(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      return { success: false, error: "Invalid email or password" };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { success: false, error: "Invalid email or password" };
      }
      return { success: false, error: "Something went wrong. Please try again." };
    }
    // Next.js redirect might throw an error we need to rethrow
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

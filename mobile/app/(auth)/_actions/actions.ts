import { api, AuthResponse, User } from "@/lib/api";

export async function loginAction(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
}

export async function registerAction(
  fullName: string,
  email: string,
  password: string,
  role: "admin" | "jobseeker" = "jobseeker",
): Promise<AuthResponse> {
  const response = await api.post("/auth/register", {
    fullName,
    email,
    password,
    role,
  });
  return response.data;
}

export async function getMeAction(): Promise<User> {
  const response = await api.get("/auth/me");
  return response.data;
}

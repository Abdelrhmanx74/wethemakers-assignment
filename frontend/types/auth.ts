export type Role = "admin" | "jobseeker";

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: Role;
  };
  accessToken: string;
}

export interface ActionResult {
  success: boolean;
  error?: string;
}

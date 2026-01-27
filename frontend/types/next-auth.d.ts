import { Role } from "./auth/actions";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      fullName: string;
      role: Role;
      accessToken: string;
    };
  }

  interface User {
    id: string;
    email: string;
    fullName: string;
    role: Role;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    fullName: string;
    role: Role;
    accessToken: string;
  }
}

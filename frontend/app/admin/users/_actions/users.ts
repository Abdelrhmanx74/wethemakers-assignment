"use server";

import { auth } from "@/auth";
import {
  api,
  User,
  UserStats,
  PaginatedResponse,
  UserQueryParams,
} from "@/lib/api";

export async function getApplicants(
  params?: UserQueryParams,
): Promise<PaginatedResponse<User>> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await api.get("/users", {
    params,
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
}

export async function getUserStats(): Promise<UserStats> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await api.get("/users/stats", {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
}

export async function getUser(id: string): Promise<User> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await api.get(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
}

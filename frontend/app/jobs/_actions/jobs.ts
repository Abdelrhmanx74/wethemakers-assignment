"use server";

import { auth } from "@/auth";
import { api, Job, PaginatedResponse, JobQueryParams } from "@/lib/api";

export async function getJobs(
  params?: JobQueryParams,
): Promise<PaginatedResponse<Job>> {
  const response = await api.get("/jobs", { params });
  return response.data;
}

export async function getOpenJobs(
  params?: JobQueryParams,
): Promise<PaginatedResponse<Job>> {
  const response = await api.get("/jobs/open", { params });
  return response.data;
}

export async function getJob(id: string): Promise<Job> {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
}

export async function getJobLocations(): Promise<string[]> {
  const response = await api.get("/jobs/locations");
  return response.data;
}

export async function createJob(data: {
  title: string;
  description: string;
  location: string;
  salary?: number;
  status?: "open" | "closed";
}): Promise<Job> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await api.post("/jobs", data, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
}

export async function updateJob(
  id: string,
  data: {
    title?: string;
    description?: string;
    location?: string;
    salary?: number;
    status?: "open" | "closed";
  },
): Promise<Job> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await api.patch(`/jobs/${id}`, data, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
}

export async function deleteJob(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("Unauthorized");
  }

  await api.delete(`/jobs/${id}`, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
}

export async function getMyJobs(
  params?: JobQueryParams,
): Promise<PaginatedResponse<Job>> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await api.get("/jobs/my", {
    params,
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
}

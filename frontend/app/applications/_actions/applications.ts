"use server";

import { auth } from "@/auth";
import axios from "axios";
import {
  api,
  Application,
  PaginatedResponse,
  ApplicationQueryParams,
} from "@/lib/api";

export async function getApplications(
  params?: ApplicationQueryParams,
): Promise<PaginatedResponse<Application>> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await api.get("/applications", {
    params,
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
}

export async function getMyApplications(
  params?: ApplicationQueryParams,
): Promise<PaginatedResponse<Application>> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await api.get("/applications/my", {
    params,
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
}

export async function hasAppliedToJob(jobId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await api.get(`/applications/my/exists/${jobId}`, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  return Boolean((response.data as { applied?: unknown })?.applied);
}

export async function getJobApplications(
  jobId: string,
  params?: ApplicationQueryParams,
): Promise<PaginatedResponse<Application>> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await api.get(`/applications/job/${jobId}`, {
    params,
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
}

export async function getApplication(id: string): Promise<Application> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await api.get(`/applications/${id}`, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  return response.data;
}

export async function createApplication(data: {
  jobId: string;
  resume: string;
  coverLetter: string;
}): Promise<Application> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("Unauthorized");
  }

  try {
    const response = await api.post("/applications", data, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const payload = error.response?.data as unknown;

      if (status === 409) {
        throw new Error("You have already applied for this job");
      }

      if (payload && typeof payload === "object" && "message" in payload) {
        const message = (payload as { message?: unknown }).message;
        if (typeof message === "string") {
          throw new Error(message);
        }
        if (
          Array.isArray(message) &&
          message.every((m) => typeof m === "string")
        ) {
          throw new Error(message.join(", "));
        }
      }
    }

    throw error instanceof Error
      ? error
      : new Error("Failed to submit application");
  }
}

export async function updateApplicationStatus(
  id: string,
  status: "submitted" | "reviewed" | "rejected",
): Promise<Application> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("Unauthorized");
  }

  const response = await api.patch(
    `/applications/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    },
  );
  return response.data;
}

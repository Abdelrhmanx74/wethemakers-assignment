import {
  api,
  Application,
  ApplicationQueryParams,
  Job,
  JobQueryParams,
  PaginatedResponse,
  User,
} from "@/lib/api";

export async function getMyJobsAction(
  params?: JobQueryParams,
): Promise<PaginatedResponse<Job>> {
  const response = await api.get("/jobs/my", { params });
  return response.data;
}

export async function createJobAction(data: {
  title: string;
  description: string;
  location: string;
  salary?: number;
}): Promise<Job> {
  const response = await api.post("/jobs", data);
  return response.data;
}

export async function deleteJobAction(id: string): Promise<void> {
  await api.delete(`/jobs/${id}`);
}

export async function getApplicantsAction(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<User>> {
  const response = await api.get("/users", { params });
  return response.data;
}

export async function getAllApplicationsAction(
  params?: ApplicationQueryParams & { jobId?: string },
): Promise<PaginatedResponse<Application>> {
  const response = await api.get("/applications", { params });
  return response.data;
}

export async function updateApplicationStatusAction(
  id: string,
  status: "submitted" | "reviewed" | "rejected",
): Promise<Application> {
  const response = await api.patch(`/applications/${id}`, { status });
  return response.data;
}

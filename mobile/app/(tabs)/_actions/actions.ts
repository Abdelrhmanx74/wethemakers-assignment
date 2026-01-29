import {
  api,
  Application,
  ApplicationQueryParams,
  Job,
  JobQueryParams,
  PaginatedResponse,
} from "@/lib/api";

export async function getOpenJobsAction(
  params?: JobQueryParams,
): Promise<PaginatedResponse<Job>> {
  const response = await api.get("/jobs/open", { params });
  return response.data;
}

export async function getMyApplicationsAction(
  params?: ApplicationQueryParams,
): Promise<PaginatedResponse<Application>> {
  const response = await api.get("/applications/my", { params });
  return response.data;
}

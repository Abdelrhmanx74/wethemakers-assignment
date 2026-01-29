import { api, Application, Job } from "@/lib/api";

export async function getJobAction(id: string): Promise<Job> {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
}

export async function hasAppliedToJobAction(jobId: string): Promise<boolean> {
  const response = await api.get(`/applications/my/exists/${jobId}`);
  return Boolean(response.data?.applied);
}

export async function createApplicationAction(data: {
  jobId: string;
  resume: string;
  coverLetter: string;
}): Promise<Application> {
  const response = await api.post("/applications", data);
  return response.data;
}

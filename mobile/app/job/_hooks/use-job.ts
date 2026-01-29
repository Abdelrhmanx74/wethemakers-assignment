import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createApplicationAction,
  getJobAction,
  hasAppliedToJobAction,
} from "@/app/job/_actions/actions";

const keys = {
  job: (id: string) => ["job", "detail", id] as const,
  hasApplied: (id: string) => ["job", "hasApplied", id] as const,
};

export function useJobQuery(id: string | undefined) {
  return useQuery({
    queryKey: id ? keys.job(id) : ["job", "detail", "__missing__"],
    queryFn: () => getJobAction(id!),
    enabled: Boolean(id),
  });
}

export function useHasAppliedQuery(
  jobId: string | undefined,
  enabled: boolean,
) {
  return useQuery({
    queryKey: jobId
      ? keys.hasApplied(jobId)
      : ["job", "hasApplied", "__missing__"],
    queryFn: () => hasAppliedToJobAction(jobId!),
    enabled: Boolean(jobId) && enabled,
  });
}

export function useCreateApplicationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApplicationAction,
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({
        queryKey: keys.hasApplied(created.jobId),
      });
      await queryClient.invalidateQueries({
        queryKey: ["tabs", "applications", "my"],
      });
    },
  });
}

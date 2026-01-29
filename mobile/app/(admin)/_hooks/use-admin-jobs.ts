import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createJobAction,
  deleteJobAction,
  getMyJobsAction,
} from "@/app/(admin)/_actions/actions";
import { JobQueryParams } from "@/lib/api";

const keys = {
  myJobs: (params: JobQueryParams | undefined) =>
    ["admin", "jobs", "my", params ?? {}] as const,
};

export function useMyJobsPreviewQuery(limit = 4) {
  return useQuery({
    queryKey: keys.myJobs({ limit, page: 1 }),
    queryFn: () => getMyJobsAction({ limit, page: 1 }),
  });
}

export function useMyJobsInfinite(params: Omit<JobQueryParams, "page">) {
  const limit = params.limit ?? 10;

  return useInfiniteQuery({
    queryKey: keys.myJobs({ ...params, limit }),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getMyJobsAction({ ...params, limit, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}

export function useCreateJobMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createJobAction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "jobs", "my"],
      });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useDeleteJobMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteJobAction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "jobs", "my"],
      });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

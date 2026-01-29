import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAllApplicationsAction,
  updateApplicationStatusAction,
} from "@/app/(admin)/_actions/actions";
import { ApplicationQueryParams } from "@/lib/api";

const keys = {
  allApplications: (
    params: (ApplicationQueryParams & { jobId?: string }) | undefined,
  ) => ["admin", "applications", "all", params ?? {}] as const,
};

export function useAllApplicationsPreviewQuery(limit = 5) {
  return useQuery({
    queryKey: keys.allApplications({ limit, page: 1 }),
    queryFn: () => getAllApplicationsAction({ limit, page: 1 }),
  });
}

export function useAllApplicationsInfinite(
  params: Omit<ApplicationQueryParams & { jobId?: string }, "page">,
) {
  const limit = params.limit ?? 10;

  return useInfiniteQuery({
    queryKey: keys.allApplications({ ...params, limit }),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getAllApplicationsAction({ ...params, limit, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}

export function useUpdateApplicationStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; status: "reviewed" | "rejected" }) =>
      updateApplicationStatusAction(vars.id, vars.status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "applications", "all"],
      });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

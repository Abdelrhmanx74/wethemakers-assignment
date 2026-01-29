import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getOpenJobsAction } from "@/app/(tabs)/_actions/actions";
import { JobQueryParams } from "@/lib/api";

const keys = {
  openJobs: (params: JobQueryParams | undefined) =>
    ["tabs", "jobs", "open", params ?? {}] as const,
};

export function useOpenJobsPreviewQuery(limit = 4) {
  return useQuery({
    queryKey: keys.openJobs({ limit, page: 1 }),
    queryFn: () => getOpenJobsAction({ limit, page: 1 }),
  });
}

export function useOpenJobsInfinite(params: Omit<JobQueryParams, "page">) {
  const limit = params.limit ?? 10;

  return useInfiniteQuery({
    queryKey: keys.openJobs({ ...params, limit }),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getOpenJobsAction({ ...params, limit, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}

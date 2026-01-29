import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getMyApplicationsAction } from "@/app/(tabs)/_actions/actions";
import { ApplicationQueryParams } from "@/lib/api";

const keys = {
  myApplications: (params: ApplicationQueryParams | undefined) =>
    ["tabs", "applications", "my", params ?? {}] as const,
};

export function useMyApplicationsPreviewQuery(limit = 3) {
  return useQuery({
    queryKey: keys.myApplications({ limit, page: 1 }),
    queryFn: () => getMyApplicationsAction({ limit, page: 1 }),
  });
}

export function useMyApplicationsInfinite(
  params: Omit<ApplicationQueryParams, "page">,
) {
  const limit = params.limit ?? 10;

  return useInfiniteQuery({
    queryKey: keys.myApplications({ ...params, limit }),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getMyApplicationsAction({ ...params, limit, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}

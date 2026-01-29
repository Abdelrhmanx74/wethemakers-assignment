import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getApplicantsAction } from "@/app/(admin)/_actions/actions";

const keys = {
  applicants: (params: { limit?: number } | undefined) =>
    ["admin", "users", "applicants", params ?? {}] as const,
};

export function useApplicantsPreviewQuery(limit = 1) {
  return useQuery({
    queryKey: keys.applicants({ limit }),
    queryFn: () => getApplicantsAction({ limit }),
  });
}

export function useApplicantsInfinite(params: { limit?: number }) {
  const limit = params.limit ?? 10;
  return useInfiniteQuery({
    queryKey: keys.applicants({ limit }),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getApplicantsAction({ limit, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import {
  getOpenJobsAction,
  getMyApplicationsAction,
} from "@/app/(tabs)/_actions/actions";

export function useTabsDashboardQuery() {
  return useQuery({
    queryKey: ["tabs", "dashboard"],
    queryFn: async () => {
      const [jobsData, applicationsData] = await Promise.all([
        getOpenJobsAction({ limit: 4, page: 1 }),
        getMyApplicationsAction({ limit: 3, page: 1 }),
      ]);

      return {
        jobs: jobsData.data,
        applications: applicationsData.data,
        totals: {
          jobs: jobsData.meta.total,
          applications: applicationsData.meta.total,
        },
      };
    },
  });
}

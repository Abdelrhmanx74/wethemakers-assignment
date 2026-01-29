import { useQuery } from "@tanstack/react-query";
import {
  getAllApplicationsAction,
  getApplicantsAction,
  getMyJobsAction,
} from "@/app/(admin)/_actions/actions";

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const [jobsData, applicationsData, applicantsData] = await Promise.all([
        getMyJobsAction({ limit: 4, page: 1 }),
        getAllApplicationsAction({ limit: 5, page: 1 }),
        getApplicantsAction({ limit: 1, page: 1 }),
      ]);

      const openJobsCount = jobsData.data.filter(
        (j) => j.status === "open",
      ).length;

      return {
        recentJobs: jobsData.data,
        recentApplications: applicationsData.data,
        stats: {
          totalJobs: jobsData.meta.total,
          openJobs: openJobsCount,
          totalApplications: applicationsData.meta.total,
          totalApplicants: applicantsData.meta.total,
        },
      };
    },
  });
}

import { Suspense } from "react";
import { getOpenJobs, getJobLocations } from "@/app/jobs/_actions/jobs";
import { JobsListClient } from "./_components/jobs-list-client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    location?: string;
    page?: string;
  }>;
}

function JobsListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i}>
          <CardContent className="p-3">
            <Skeleton className="h-5 w-3/4 mb-1" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function JobsList({
  search,
  location,
  page,
}: {
  search: string;
  location: string;
  page: number;
}) {
  const [jobsData, locations] = await Promise.all([
    getOpenJobs({
      search: search || undefined,
      location: location || undefined,
      page,
      limit: 10,
    }),
    getJobLocations(),
  ]);

  return <JobsListClient initialData={jobsData} locations={locations} />;
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const location = params.location || "";
  const page = parseInt(params.page || "1", 10);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Jobs</h1>
        <p className="text-muted-foreground">Find your next opportunity</p>
      </div>

      <Suspense fallback={<JobsListSkeleton />}>
        <JobsList search={search} location={location} page={page} />
      </Suspense>
    </div>
  );
}

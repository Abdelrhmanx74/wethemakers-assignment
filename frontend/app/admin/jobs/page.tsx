import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMyJobs } from "@/app/jobs/_actions/jobs";
import { AdminJobsListClient } from "./_components/admin-jobs-list-client";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
    created?: string;
  }>;
}

export default async function AdminJobsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const params = await searchParams;
  const search = params.search || "";
  const status = params.status as "open" | "closed" | undefined;
  const page = parseInt(params.page || "1", 10);
  const created = params.created === "1";

  const jobsData = await getMyJobs({
    search: search || undefined,
    status,
    page,
    limit: 10,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Jobs</h1>
          <p className="text-muted-foreground text-sm">
            Manage your job postings
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/jobs/create">
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </div>

      <AdminJobsListClient initialData={jobsData} created={created} />
    </div>
  );
}

import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getJob } from "@/app/jobs/_actions/jobs";
import { getJobApplications } from "@/app/applications/_actions/applications";
import { JobApplicationsClient } from "./_components/job-applications-client";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
}

export default async function JobApplicationsPage({
  params,
  searchParams,
}: PageProps) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const { id } = await params;
  const search = await searchParams;
  const status = search.status as
    | "submitted"
    | "reviewed"
    | "rejected"
    | undefined;
  const page = parseInt(search.page || "1", 10);

  let job;
  try {
    job = await getJob(id);
  } catch {
    notFound();
  }

  const applicationsData = await getJobApplications(id, {
    status,
    page,
    limit: 10,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/admin/jobs/${id}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to job
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Applications for {job.title}</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage applications for this position
        </p>
      </div>

      <JobApplicationsClient initialData={applicationsData} jobId={id} />
    </div>
  );
}

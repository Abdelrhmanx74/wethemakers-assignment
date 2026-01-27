import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getJob } from "@/app/jobs/_actions/jobs";
import { JobForm } from "../../_components/job-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const { id } = await params;

  let job;
  try {
    job = await getJob(id);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href={`/admin/jobs/${id}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to job
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Edit Job</h1>
        <p className="text-muted-foreground mt-1">
          Update the job posting details
        </p>
      </div>

      <JobForm job={job} />
    </div>
  );
}

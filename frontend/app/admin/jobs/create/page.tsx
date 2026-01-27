import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JobForm } from "../_components/job-form";

export default async function CreateJobPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/admin/jobs"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to jobs
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Create Job</h1>
        <p className="text-muted-foreground mt-1">
          Create a new job posting for your platform
        </p>
      </div>

      <JobForm />
    </div>
  );
}

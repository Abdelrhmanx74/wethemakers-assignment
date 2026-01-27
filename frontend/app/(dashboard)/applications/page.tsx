import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getMyApplications } from "@/app/applications/_actions/applications";
import { ApplicationsListClient } from "./_components/applications-list-client";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const params = await searchParams;
  const status = params.status as
    | "submitted"
    | "reviewed"
    | "rejected"
    | undefined;
  const page = parseInt(params.page || "1", 10);

  const applicationsData = await getMyApplications({
    status,
    page,
    limit: 10,
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-muted-foreground">Track your job applications</p>
      </div>

      <ApplicationsListClient initialData={applicationsData} />
    </div>
  );
}

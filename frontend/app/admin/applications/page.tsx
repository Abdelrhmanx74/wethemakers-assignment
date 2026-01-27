import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getApplications } from "@/app/applications/_actions/applications";
import { AdminApplicationsListClient } from "./_components/admin-applications-list-client";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
}

export default async function AdminApplicationsPage({
  searchParams,
}: PageProps) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const params = await searchParams;
  const status = params.status as
    | "submitted"
    | "reviewed"
    | "rejected"
    | undefined;
  const page = parseInt(params.page || "1", 10);

  const applicationsData = await getApplications({
    status,
    page,
    limit: 10,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Applications</h1>
        <p className="text-muted-foreground text-sm">
          Review and manage applications
        </p>
      </div>

      <AdminApplicationsListClient initialData={applicationsData} />
    </div>
  );
}

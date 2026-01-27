import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getApplicants } from "./_actions/users";
import { UsersListClient } from "./_components/users-list-client";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  const usersData = await getApplicants({
    page,
    limit: 10,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Applicants</h1>
        <p className="text-muted-foreground text-sm">
          Job seekers who have applied
        </p>
      </div>

      <UsersListClient initialData={usersData} />
    </div>
  );
}

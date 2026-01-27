import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "jobseeker") {
    redirect("/dashboard");
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/admin/jobs", label: "Jobs", icon: "Briefcase" },
    { href: "/admin/users", label: "Applicants", icon: "Users" },
    { href: "/admin/applications", label: "Applications", icon: "FileText" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        navItems={navItems}
        user={{
          fullName: session.user.fullName,
          email: session.user.email,
          role: session.user.role,
        }}
        homeHref="/admin/dashboard"
      />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

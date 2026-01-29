import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "admin") {
    redirect("/admin/dashboard");
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "Home" },
    { href: "/jobs", label: "Jobs", icon: "Briefcase" },
    { href: "/applications", label: "My Applications", icon: "FileText" },
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
        homeHref="/dashboard"
      />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

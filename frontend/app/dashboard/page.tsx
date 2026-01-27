import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";
import { signOutAction } from "../(auth)/_actions/signOut";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Welcome, {session.user.fullName}!</h1>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Email:</span> {session.user.email}
            </p>
            <p>
              <span className="font-medium">Role:</span>{" "}
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize">
                {session.user.role}
              </span>
            </p>
          </div>
          <form className="mt-6">
            <button
              formAction={signOutAction}
              className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

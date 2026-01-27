import { GalleryVerticalEnd } from "lucide-react";
import { SignupForm } from "../../_components/signup-form";

export default function EmployerSignupPage() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium text-white">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Jobs
        </a>
        <SignupForm role="admin" />
      </div>
    </div>
  );
}

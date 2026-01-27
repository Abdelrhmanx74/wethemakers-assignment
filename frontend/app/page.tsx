import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GalleryVerticalEnd, Briefcase, Users } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();

  // If already logged in, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-xl">
              <GalleryVerticalEnd className="size-7" />
            </div>
            <h1 className="text-4xl font-bold text-white">Acme Jobs</h1>
          </div>
          <p className="text-xl text-slate-300">
            Find your dream job or hire top talent
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Job Seeker Card */}
          <Link
            href="/signup/jobseeker"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 p-8 transition-all duration-300 hover:scale-[1.02] hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
            <div className="relative">
              <div className="mb-6 inline-flex items-center justify-center size-16 rounded-2xl bg-blue-500/20 text-blue-400">
                <Briefcase className="size-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                I&apos;m looking for a job
              </h2>
              <p className="text-slate-300 mb-6">
                Browse thousands of job listings and find your perfect match.
                Apply with one click.
              </p>
              <div className="flex items-center gap-2 text-blue-400 font-medium">
                Get Started
                <svg
                  className="size-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Employer Card */}
          <Link
            href="/signup/employer"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-8 transition-all duration-300 hover:scale-[1.02] hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
            <div className="relative">
              <div className="mb-6 inline-flex items-center justify-center size-16 rounded-2xl bg-purple-500/20 text-purple-400">
                <Users className="size-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                I&apos;m hiring
              </h2>
              <p className="text-slate-300 mb-6">
                Post jobs and find the best candidates for your company. Manage
                applications easily.
              </p>
              <div className="flex items-center gap-2 text-purple-400 font-medium">
                Start Hiring
                <svg
                  className="size-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Already have account */}
        <div className="text-center mt-8">
          <p className="text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-white underline underline-offset-4 hover:text-blue-400 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

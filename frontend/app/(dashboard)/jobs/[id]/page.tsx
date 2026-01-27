import { notFound } from "next/navigation";
import { getJob } from "@/app/jobs/_actions/jobs";
import { hasAppliedToJob } from "@/app/applications/_actions/applications";
import { auth } from "@/auth";
import { MapPin, DollarSign, Calendar, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ApplyButton } from "./_components/apply-button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  let job;
  try {
    job = await getJob(id);
  } catch {
    notFound();
  }

  let hasApplied = false;
  if (session?.user?.role === "jobseeker" && job.status === "open") {
    try {
      hasApplied = await hasAppliedToJob(job.id);
    } catch {
      hasApplied = false;
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/jobs"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to jobs
      </Link>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl md:text-3xl">
                {job.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                {job.salary && (
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4" />
                    {job.salary.toLocaleString()}/year
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {job._count?.applications || 0} applicants
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={job.status === "open" ? "default" : "secondary"}
                className="text-sm"
              >
                {job.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold mb-4">Job Description</h3>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {job.description}
            </ReactMarkdown>
          </div>

          {job.creator && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-2">Posted by</h3>
              <p className="text-muted-foreground">{job.creator.fullName}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Apply Section */}
      {session?.user?.role === "jobseeker" && job.status === "open" && (
        <Card>
          <CardHeader>
            <CardTitle>Apply for this position</CardTitle>
          </CardHeader>
          <CardContent>
            {hasApplied ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  You already applied for this job.
                </p>
                <Button asChild variant="outline">
                  <Link href="/applications">View my applications</Link>
                </Button>
              </div>
            ) : (
              <ApplyButton jobId={job.id} jobTitle={job.title} />
            )}
          </CardContent>
        </Card>
      )}

      {!session && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              You need to be logged in as a job seeker to apply for this
              position.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild variant="outline">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup/jobseeker">Create Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

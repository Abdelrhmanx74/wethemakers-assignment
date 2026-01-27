import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  FileText,
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { getMyApplications } from "@/app/applications/_actions/applications";
import { getOpenJobs } from "@/app/jobs/_actions/jobs";
import { formatCurrency, truncateDescription } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [applicationsData, jobsData] = await Promise.all([
    getMyApplications({ limit: 3 }),
    getOpenJobs({ limit: 4 }),
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reviewed":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Reviewed
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Hello, {session.user.fullName?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your job search
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Jobs
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobsData.meta.total}</div>
            <Link
              href="/jobs"
              className="text-xs text-primary hover:underline inline-flex items-center mt-1"
            >
              Browse all
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              My Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applicationsData.meta.total}
            </div>
            <Link
              href="/applications"
              className="text-xs text-primary hover:underline inline-flex items-center mt-1"
            >
              View all
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      {applicationsData.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Applications</CardTitle>
            <CardDescription>Your latest job applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {applicationsData.data.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{app.job?.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {app.job?.location}
                  </p>
                </div>
                {getStatusBadge(app.status)}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="ml-auto mt-2">
              <Link href="/applications">
                View all applications
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Recommended Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recommended Jobs</CardTitle>
          <CardDescription>Based on your profile</CardDescription>
        </CardHeader>
        <CardContent>
          {jobsData.data.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No jobs available</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {jobsData.data.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block p-3 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-medium truncate mb-2">{job.title}</h3>
                  <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {truncateDescription(job.description)}
                  </p>
                  {job.salary && (
                    <p className="text-sm font-medium text-primary">
                      {formatCurrency(job.salary)}/year
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" asChild className="ml-auto mt-4">
            <Link href="/jobs">
              Browse all jobs
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

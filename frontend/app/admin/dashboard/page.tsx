import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  FileText,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { getMyJobs } from "@/app/jobs/_actions/jobs";
import { getUserStats } from "./_actions/stats";
import { getApplications } from "@/app/applications/_actions/applications";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [jobsData, stats, applicationsData] = await Promise.all([
    getMyJobs({ limit: 4 }),
    getUserStats(),
    getApplications({ limit: 5 }),
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reviewed":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Reviewed
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your job postings and applications
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/jobs/create">
            <Plus className="mr-2 h-4 w-4" />
            Post Job
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Jobs
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.openJobs} open
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">Total received</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Applicants
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplicants}</div>
            <p className="text-xs text-muted-foreground">Unique candidates</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Applications</CardTitle>
            <CardDescription>Latest applications to review</CardDescription>
          </CardHeader>
          <CardContent>
            {applicationsData.data.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No applications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applicationsData.data.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">
                        {app.user?.fullName}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {app.job?.title}
                      </p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                ))}
              </div>
            )}
            <Button variant="ghost" size="sm" asChild className="w-full mt-3">
              <Link href="/admin/applications">
                View all
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* My Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Jobs</CardTitle>
            <CardDescription>Your active job postings</CardDescription>
          </CardHeader>
          <CardContent>
            {jobsData.data.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-3">No jobs posted yet</p>
                <Button asChild size="sm">
                  <Link href="/admin/jobs/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Post your first job
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {jobsData.data.map((job) => (
                  <Link
                    key={job.id}
                    href={`/admin/jobs/${job.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{job.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{job.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          job.status === "open" ? "default" : "secondary"
                        }
                      >
                        {job.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {job._count?.applications || 0}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <Button variant="ghost" size="sm" asChild className="w-full mt-3">
              <Link href="/admin/jobs">
                View all
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

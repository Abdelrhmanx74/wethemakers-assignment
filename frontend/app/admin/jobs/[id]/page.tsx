import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  Users,
  MapPin,
  DollarSign,
  Calendar,
} from "lucide-react";
import { getJob } from "@/app/jobs/_actions/jobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminJobDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const { id } = await params;

  let job;
  try {
    job = await getJob(id);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/jobs"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to jobs
        </Link>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/jobs/${id}/applications`}>
              <Users className="mr-2 h-4 w-4" />
              View Applications ({job._count?.applications || 0})
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/jobs/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Job
            </Link>
          </Button>
        </div>
      </div>

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
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />$
                    {job.salary.toLocaleString()}/year
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {job._count?.applications || 0} applications
                </span>
              </div>
            </div>
            <Badge
              variant={job.status === "open" ? "default" : "secondary"}
              className="text-sm"
            >
              {job.status}
            </Badge>
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
              <h3 className="text-lg font-semibold mb-2">Created by</h3>
              <p className="text-muted-foreground">
                {job.creator.fullName} ({job.creator.email})
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

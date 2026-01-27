"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Application, PaginatedResponse } from "@/lib/api";
import { updateApplicationStatus } from "@/app/applications/_actions/applications";

interface AdminApplicationsListClientProps {
  initialData: PaginatedResponse<Application>;
}

export function AdminApplicationsListClient({
  initialData,
}: AdminApplicationsListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const currentStatus = searchParams.get("status") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    if (!updates.page) {
      params.delete("page");
    }
    startTransition(() => {
      router.push(`/admin/applications?${params.toString()}`);
    });
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: "submitted" | "reviewed" | "rejected",
  ) => {
    setIsUpdating(true);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      toast.success("Status updated");
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const { data: applications, meta } = initialData;

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
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-2">
        <Select
          value={currentStatus || "all"}
          onValueChange={(value) =>
            updateFilters({ status: value === "all" ? "" : value })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="submitted">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {meta.total} application{meta.total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-1">No applications</h3>
            <p className="text-sm text-muted-foreground">
              {currentStatus
                ? "No applications with this status"
                : "No applications received yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">
                      {app.user?.fullName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {app.user?.email}
                    </p>
                    <Link
                      href={`/admin/jobs/${app.jobId}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {app.job?.title}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={app.status}
                      onValueChange={(value) =>
                        handleStatusChange(
                          app.id,
                          value as "submitted" | "reviewed" | "rejected",
                        )
                      }
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-28 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">Pending</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApplication(app)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilters({ page: String(currentPage - 1) })}
            disabled={currentPage <= 1 || isPending}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            {currentPage} / {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilters({ page: String(currentPage + 1) })}
            disabled={currentPage >= meta.totalPages || isPending}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Application Detail Dialog */}
      <Dialog
        open={!!selectedApplication}
        onOpenChange={() => setSelectedApplication(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedApplication?.user?.fullName}</DialogTitle>
            <DialogDescription>
              {selectedApplication?.user?.email} •{" "}
              {selectedApplication?.job?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              {getStatusBadge(selectedApplication?.status || "")}
            </div>

            {/* Resume */}
            <div>
              <p className="text-sm font-medium mb-2">Resume</p>
              {selectedApplication?.resumeUrl ? (
                <a
                  href={selectedApplication.resumeUrl}
                  download={selectedApplication.resumeName || "resume"}
                  className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm truncate flex-1">
                    {selectedApplication.resumeName || "Resume"}
                  </span>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">No resume</p>
              )}
            </div>

            {/* Cover Letter */}
            <div>
              <p className="text-sm font-medium mb-2">Cover Letter</p>
              <div className="p-3 rounded-lg bg-muted text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                {selectedApplication?.coverLetter || "No cover letter"}
              </div>
            </div>

            {/* Update Status */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                Update status:
              </span>
              <Select
                value={selectedApplication?.status || "submitted"}
                onValueChange={(value) => {
                  if (selectedApplication) {
                    handleStatusChange(
                      selectedApplication.id,
                      value as "submitted" | "reviewed" | "rejected",
                    );
                    setSelectedApplication({
                      ...selectedApplication,
                      status: value as "submitted" | "reviewed" | "rejected",
                    });
                  }
                }}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, User, Mail, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface JobApplicationsClientProps {
  initialData: PaginatedResponse<Application>;
  jobId: string;
}

export function JobApplicationsClient({
  initialData,
  jobId,
}: JobApplicationsClientProps) {
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
      router.push(`/admin/jobs/${jobId}/applications?${params.toString()}`);
    });
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: "submitted" | "reviewed" | "rejected",
  ) => {
    setIsUpdating(true);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      toast.success("Application status updated");
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const { data: applications, meta } = initialData;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "submitted":
        return "default";
      case "reviewed":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Select
              value={currentStatus}
              onValueChange={(value) =>
                updateFilters({ status: value === "all" ? "" : value })
              }
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {applications.length} of {meta.total} applications
      </div>

      {/* Applications list */}
      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">
              No applications found
            </h3>
            <p className="text-muted-foreground">
              {currentStatus
                ? "No applications match your filter criteria"
                : "No one has applied for this job yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {application.user?.fullName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      {application.user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Applied{" "}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={application.status}
                      onValueChange={(value) =>
                        handleStatusChange(
                          application.id,
                          value as "submitted" | "reviewed" | "rejected",
                        )
                      }
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-32">
                        <Badge variant={getStatusVariant(application.status)}>
                          {application.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className="text-sm font-medium mb-1">
                    Cover Letter Preview
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {application.coverLetter}
                  </p>
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
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilters({ page: String(currentPage + 1) })}
            disabled={currentPage >= meta.totalPages || isPending}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Application Detail Dialog */}
      <Dialog
        open={!!selectedApplication}
        onOpenChange={() => setSelectedApplication(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Application from {selectedApplication?.user?.fullName}
            </DialogTitle>
            <DialogDescription>
              {selectedApplication?.user?.email} • Applied{" "}
              {selectedApplication?.createdAt &&
                new Date(selectedApplication.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <h3 className="font-semibold mb-2">Resume / CV</h3>
              {selectedApplication?.resume ? (
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap text-sm max-h-64 overflow-y-auto">
                  {selectedApplication.resume}
                </div>
              ) : (
                <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
                  No resume provided
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Cover Letter</h3>
              <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap text-sm">
                {selectedApplication?.coverLetter}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

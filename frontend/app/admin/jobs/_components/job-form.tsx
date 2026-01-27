"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createJob, updateJob } from "@/app/jobs/_actions/jobs";
import { Job } from "@/lib/api";

interface JobFormProps {
  job?: Job;
}

export function JobForm({ job }: JobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState(job?.title || "");
  const [description, setDescription] = useState(job?.description || "");
  const [location, setLocation] = useState(job?.location || "");
  const [salary, setSalary] = useState(job?.salary?.toString() || "");
  const [status, setStatus] = useState<"open" | "closed">(
    job?.status || "open",
  );

  const isEditing = !!job;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !location.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        salary: salary ? parseFloat(salary) : undefined,
        status,
      };

      if (isEditing) {
        await updateJob(job.id, data);
        toast.success("Job updated successfully");
      } else {
        await createJob(data);
        toast.success("Job created successfully");
      }
      router.push(isEditing ? "/admin/jobs" : "/admin/jobs?created=1");
      router.refresh();
    } catch {
      toast.error(isEditing ? "Failed to update job" : "Failed to create job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Job" : "Job Details"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Senior Software Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="e.g. New York, NY or Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Annual Salary (USD)</Label>
              <Input
                id="salary"
                type="number"
                placeholder="e.g. 120000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as "open" | "closed")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, requirements, and benefits..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
              required
            />
            <p className="text-xs text-muted-foreground">
              Include information about responsibilities, requirements,
              qualifications, and benefits.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
                ? "Update Job"
                : "Create Job"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

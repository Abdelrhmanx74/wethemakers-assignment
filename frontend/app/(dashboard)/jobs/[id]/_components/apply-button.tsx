"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createApplication } from "@/app/applications/_actions/applications";

interface ApplyButtonProps {
  jobId: string;
  jobTitle: string;
}

export function ApplyButton({ jobId, jobTitle }: ApplyButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resume.trim()) {
      toast.error("Please enter your resume");
      return;
    }

    if (!coverLetter.trim()) {
      toast.error("Please write a cover letter");
      return;
    }

    setIsSubmitting(true);
    try {
      await createApplication({
        jobId,
        resume: resume.trim(),
        coverLetter: coverLetter.trim(),
      });

      toast.success("Application submitted!");
      setOpen(false);
      setResume("");
      setCoverLetter("");
      router.push("/applications");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to submit application";
      if (message.includes("already applied")) {
        toast.error("You have already applied for this job");
      } else {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto">
          <Send className="mr-2 h-4 w-4" />
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Apply for this position</DialogTitle>
            <DialogDescription>{jobTitle}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Resume Text */}
            <div className="space-y-2">
              <Label htmlFor="resume">Resume / CV</Label>
              <Textarea
                id="resume"
                placeholder="Paste your resume here or describe your experience, skills, and qualifications..."
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Include your work experience, education, skills, and relevant
                achievements.
              </p>
            </div>

            {/* Cover Letter */}
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                placeholder="Tell us why you're a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !resume.trim()}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

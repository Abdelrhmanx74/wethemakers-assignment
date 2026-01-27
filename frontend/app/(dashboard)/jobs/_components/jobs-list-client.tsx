"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Job, PaginatedResponse } from "@/lib/api";
import { formatCurrency, truncateDescription } from "@/lib/utils";

interface JobsListClientProps {
  initialData: PaginatedResponse<Job>;
  locations: string[];
}

export function JobsListClient({
  initialData,
  locations,
}: JobsListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const currentLocation = searchParams.get("location") || "";
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
      router.push(`/jobs?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search });
  };

  const { data: jobs, meta } = initialData;

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row items-center justify-end gap-2"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={currentLocation || "all"}
          onValueChange={(value) =>
            updateFilters({ location: value === "all" ? "" : value })
          }
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" disabled={isPending}>
          Search
        </Button>
      </form>

      {/* Results */}
      <p className="text-sm text-muted-foreground">
        {meta.total} job{meta.total !== 1 ? "s" : ""} found
      </p>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-1">No jobs found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Link className="block" key={job.id} href={`/jobs/${job.id}`}>
              <Card className="size-full hover:border-primary/50 hover:shadow-sm transition-all">
                <CardContent className="p-3 py-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold truncate mb-1">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {truncateDescription(job.description)}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {job.salary && (
                        <Badge variant="secondary">
                          {formatCurrency(job.salary)}
                        </Badge>
                      )}
                      <Badge>{job._count?.applications || 0} applicants</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
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
    </div>
  );
}

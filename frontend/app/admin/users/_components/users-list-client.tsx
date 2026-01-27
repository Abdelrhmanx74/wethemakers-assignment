"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
  Briefcase,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User as UserType, PaginatedResponse } from "@/lib/api";

interface UsersListClientProps {
  initialData: PaginatedResponse<UserType>;
}

export function UsersListClient({ initialData }: UsersListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

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
    startTransition(() => {
      router.push(`/admin/users?${params.toString()}`);
    });
  };

  const { data: users, meta } = initialData;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {meta.total} applicant{meta.total !== 1 ? "s" : ""}
      </p>

      {users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No applicants yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    Applications
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {user._count?.applications || 0}
                  </Badge>
                </div>

                {user.applications && user.applications.length > 0 && (
                  <div className="mt-3 pt-3 border-t space-y-1.5">
                    {user.applications.slice(0, 2).map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="truncate flex-1 pr-2 text-muted-foreground">
                          {app.job.title}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            app.status === "reviewed"
                              ? "border-green-500 text-green-600"
                              : app.status === "rejected"
                                ? "border-red-500 text-red-600"
                                : ""
                          }`}
                        >
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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

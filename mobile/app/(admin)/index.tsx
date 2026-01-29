import React, { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/stores/auth-store";
import { formatCurrency } from "@/lib/api";
import { useAdminDashboardQuery } from "@/app/(admin)/_hooks/use-admin-dashboard";

export default function AdminDashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { user } = useAuth();

  const dashboardQuery = useAdminDashboardQuery();

  useFocusEffect(
    useCallback(() => {
      dashboardQuery.refetch();
    }, [dashboardQuery]),
  );

  const onRefresh = () => {
    dashboardQuery.refetch();
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, { bg: string; text: string }> = {
      open: { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e" },
      closed: { bg: "rgba(239, 68, 68, 0.2)", text: "#ef4444" },
      submitted: { bg: "rgba(234, 179, 8, 0.2)", text: "#eab308" },
      reviewed: { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e" },
      rejected: { bg: "rgba(239, 68, 68, 0.2)", text: "#ef4444" },
    };
    const style = statusColors[status] || statusColors.submitted;
    return (
      <View
        className="px-2 py-1 rounded-full"
        style={{ backgroundColor: style.bg }}
      >
        <Text
          className="text-xs font-medium capitalize"
          style={{ color: style.text }}
        >
          {status}
        </Text>
      </View>
    );
  };

  if (dashboardQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const stats = dashboardQuery.data?.stats ?? {
    totalJobs: 0,
    openJobs: 0,
    totalApplications: 0,
    totalApplicants: 0,
  };
  const recentJobs = dashboardQuery.data?.recentJobs ?? [];
  const recentApplications = dashboardQuery.data?.recentApplications ?? [];

  return (
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl
          refreshing={dashboardQuery.isRefetching}
          onRefresh={onRefresh}
        />
      }
    >
      <View className="p-4">
        {/* Welcome Section */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">
            Welcome back, {user?.fullName?.split(" ")[0]}
          </Text>
          <Text className="text-muted-foreground">
            Manage your jobs and review applications
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          <View className="flex-1 min-w-[45%] bg-card rounded-xl p-4 border border-border">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-lg bg-blue-500/20 items-center justify-center">
                <Ionicons name="briefcase" size={20} color="#3b82f6" />
              </View>
              <View>
                <Text className="text-2xl font-bold text-card-foreground">
                  {stats.totalJobs}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Total Jobs
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-1 min-w-[45%] bg-card rounded-xl p-4 border border-border">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-lg bg-green-500/20 items-center justify-center">
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              </View>
              <View>
                <Text className="text-2xl font-bold text-card-foreground">
                  {stats.openJobs}
                </Text>
                <Text className="text-xs text-muted-foreground">Open Jobs</Text>
              </View>
            </View>
          </View>

          <View className="flex-1 min-w-[45%] bg-card rounded-xl p-4 border border-border">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-lg bg-purple-500/20 items-center justify-center">
                <Ionicons name="document-text" size={20} color="#a855f7" />
              </View>
              <View>
                <Text className="text-2xl font-bold text-card-foreground">
                  {stats.totalApplications}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Applications
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-1 min-w-[45%] bg-card rounded-xl p-4 border border-border">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-lg bg-orange-500/20 items-center justify-center">
                <Ionicons name="people" size={20} color="#f97316" />
              </View>
              <View>
                <Text className="text-2xl font-bold text-card-foreground">
                  {stats.totalApplicants}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Applicants
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <TouchableOpacity
          className="bg-primary rounded-xl p-4 flex-row items-center justify-center gap-2 mb-6"
          onPress={() => router.push("/admin-job-create" as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color={colors.primaryForeground} />
          <Text className="text-primary-foreground font-semibold">
            Post New Job
          </Text>
        </TouchableOpacity>

        {/* Recent Jobs */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-foreground">
              My Jobs
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(admin)/jobs" as any)}
            >
              <Text className="text-primary text-sm">View All</Text>
            </TouchableOpacity>
          </View>

          {recentJobs.length === 0 ? (
            <View className="bg-card rounded-xl p-6 border border-border items-center">
              <Ionicons
                name="briefcase-outline"
                size={32}
                color={colors.mutedForeground}
              />
              <Text className="text-muted-foreground mt-2">
                No jobs posted yet
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {recentJobs.map((job) => (
                <TouchableOpacity
                  key={job.id}
                  className="bg-card rounded-xl p-4 border border-border"
                  onPress={() => router.push(`/job/${job.id}` as any)}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text
                        className="font-semibold text-card-foreground"
                        numberOfLines={1}
                      >
                        {job.title}
                      </Text>
                      <View className="flex-row items-center gap-2 mt-1">
                        <Ionicons
                          name="location-outline"
                          size={14}
                          color={colors.mutedForeground}
                        />
                        <Text className="text-muted-foreground text-sm">
                          {job.location}
                        </Text>
                      </View>
                      {job.salary && (
                        <Text className="text-muted-foreground text-sm mt-1">
                          {formatCurrency(job.salary)}
                        </Text>
                      )}
                    </View>
                    <View className="items-end gap-2">
                      {getStatusBadge(job.status)}
                      {job._count?.applications !== undefined && (
                        <Text className="text-xs text-muted-foreground">
                          {job._count.applications} applicants
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Recent Applications */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-foreground">
              Recent Applications
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(admin)/applications" as any)}
            >
              <Text className="text-primary text-sm">View All</Text>
            </TouchableOpacity>
          </View>

          {recentApplications.length === 0 ? (
            <View className="bg-card rounded-xl p-6 border border-border items-center">
              <Ionicons
                name="document-text-outline"
                size={32}
                color={colors.mutedForeground}
              />
              <Text className="text-muted-foreground mt-2">
                No applications yet
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {recentApplications.map((app) => (
                <View
                  key={app.id}
                  className="bg-card rounded-xl p-4 border border-border"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text
                        className="font-semibold text-card-foreground"
                        numberOfLines={1}
                      >
                        {app.user?.fullName || "Unknown User"}
                      </Text>
                      <Text
                        className="text-muted-foreground text-sm"
                        numberOfLines={1}
                      >
                        Applied for: {app.job?.title || "Unknown Job"}
                      </Text>
                    </View>
                    {getStatusBadge(app.status)}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

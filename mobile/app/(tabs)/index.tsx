import React, { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/stores/auth-store";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { formatCurrency } from "@/lib/api";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTabsDashboardQuery } from "@/app/(tabs)/_hooks/use-dashboard";

export default function DashboardScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const dashboardQuery = useTabsDashboardQuery();

  const onRefresh = useCallback(() => {
    dashboardQuery.refetch();
  }, [dashboardQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reviewed":
        return {
          bg: colors.successLight,
          text: colors.success,
          label: "Reviewed",
        };
      case "rejected":
        return {
          bg: colors.errorLight,
          text: colors.error,
          label: "Rejected",
        };
      default:
        return {
          bg: colors.warningLight,
          text: colors.warning,
          label: "Pending",
        };
    }
  };

  if (dashboardQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const jobs = dashboardQuery.data?.jobs ?? [];
  const applications = dashboardQuery.data?.applications ?? [];
  const totalJobs = dashboardQuery.data?.totals.jobs ?? 0;
  const totalApplications = dashboardQuery.data?.totals.applications ?? 0;

  const firstName = user?.fullName?.split(" ")[0] || "there";

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={dashboardQuery.isRefetching}
            onRefresh={onRefresh}
          />
        }
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">
            Hello, {firstName}
          </Text>
          <Text className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your job search
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="flex-row gap-4 mb-6">
          <TouchableOpacity
            className="flex-1 bg-card rounded-xl p-4 border border-border"
            onPress={() => router.push("/(tabs)/jobs")}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm text-muted-foreground">Open Jobs</Text>
              <IconSymbol
                name="briefcase.fill"
                size={16}
                color={colors.mutedForeground}
              />
            </View>
            <Text className="text-2xl font-bold text-card-foreground">
              {totalJobs}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-xs text-primary">Browse all</Text>
              <IconSymbol name="arrow.right" size={12} color={colors.primary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-card rounded-xl p-4 border border-border"
            onPress={() => router.push("/(tabs)/applications")}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm text-muted-foreground">
                My Applications
              </Text>
              <IconSymbol
                name="doc.text.fill"
                size={16}
                color={colors.mutedForeground}
              />
            </View>
            <Text className="text-2xl font-bold text-card-foreground">
              {totalApplications}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-xs text-primary">View all</Text>
              <IconSymbol name="arrow.right" size={12} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Applications */}
        {applications.length > 0 && (
          <View className="bg-card rounded-xl border border-border mb-6">
            <View className="p-4 border-b border-border">
              <Text className="text-lg font-semibold text-card-foreground">
                Recent Applications
              </Text>
              <Text className="text-sm text-muted-foreground">
                Your latest job applications
              </Text>
            </View>
            <View className="p-4">
              {applications.map((app) => {
                const status = getStatusBadge(app.status);
                return (
                  <View
                    key={app.id}
                    className="flex-row items-center justify-between p-3 rounded-lg border border-border mb-2"
                  >
                    <View className="flex-1 mr-3">
                      <Text
                        className="font-medium text-card-foreground"
                        numberOfLines={1}
                      >
                        {app.job?.title}
                      </Text>
                      <Text
                        className="text-sm text-muted-foreground"
                        numberOfLines={1}
                      >
                        {app.job?.location}
                      </Text>
                    </View>
                    <View
                      className="px-2 py-1 rounded-full"
                      style={{ backgroundColor: status.bg }}
                    >
                      <Text
                        className="text-xs font-medium"
                        style={{ color: status.text }}
                      >
                        {status.label}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            <TouchableOpacity
              className="p-4 border-t border-border flex-row items-center justify-end"
              onPress={() => router.push("/(tabs)/applications")}
            >
              <Text className="text-sm text-primary mr-1">
                View all applications
              </Text>
              <IconSymbol name="arrow.right" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Recent Jobs */}
        <View className="bg-card rounded-xl border border-border">
          <View className="p-4 border-b border-border">
            <Text className="text-lg font-semibold text-card-foreground">
              Recent Jobs
            </Text>
            <Text className="text-sm text-muted-foreground">
              Latest opportunities for you
            </Text>
          </View>
          <View className="p-4">
            {jobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                className="p-3 rounded-lg border border-border mb-2"
                onPress={() => router.push(`/job/${job.id}` as any)}
                activeOpacity={0.7}
              >
                <Text
                  className="font-semibold text-card-foreground mb-1"
                  numberOfLines={1}
                >
                  {job.title}
                </Text>
                <View className="flex-row items-center mb-2">
                  <IconSymbol
                    name="location.fill"
                    size={12}
                    color={colors.mutedForeground}
                  />
                  <Text className="text-sm text-muted-foreground ml-1">
                    {job.location}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  {job.salary && (
                    <View className="bg-secondary px-2 py-1 rounded">
                      <Text className="text-xs text-secondary-foreground">
                        {formatCurrency(job.salary)}
                      </Text>
                    </View>
                  )}
                  <View className="bg-secondary px-2 py-1 rounded">
                    <Text className="text-xs text-secondary-foreground">
                      {job._count?.applications || 0} applicants
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            className="p-4 border-t border-border flex-row items-center justify-end"
            onPress={() => router.push("/(tabs)/jobs")}
          >
            <Text className="text-sm text-primary mr-1">Browse all jobs</Text>
            <IconSymbol name="arrow.right" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

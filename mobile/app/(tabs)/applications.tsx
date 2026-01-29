import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { Application, formatCurrency } from "@/lib/api";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useMyApplicationsInfinite } from "@/app/(tabs)/_hooks/use-my-applications";

type StatusFilter = "all" | "submitted" | "reviewed" | "rejected";

export default function ApplicationsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const applicationsQuery = useMyApplicationsInfinite({
    status: statusFilter === "all" ? undefined : statusFilter,
    limit: 10,
  });

  const applications =
    applicationsQuery.data?.pages.flatMap((p) => p.data) ?? [];
  const total = applicationsQuery.data?.pages[0]?.meta.total ?? 0;

  const onRefresh = () => {
    applicationsQuery.refetch();
  };

  const loadMore = () => {
    if (
      applicationsQuery.hasNextPage &&
      !applicationsQuery.isFetchingNextPage
    ) {
      applicationsQuery.fetchNextPage();
    }
  };

  const getStatusBadge = useCallback(
    (status: string) => {
      switch (status) {
        case "reviewed":
          return {
            bg: colors.successLight,
            text: colors.success,
            label: "Reviewed",
            icon: "checkmark.circle.fill" as const,
          };
        case "rejected":
          return {
            bg: colors.errorLight,
            text: colors.error,
            label: "Rejected",
            icon: "xmark.circle.fill" as const,
          };
        default:
          return {
            bg: colors.warningLight,
            text: colors.warning,
            label: "Pending",
            icon: "clock.fill" as const,
          };
      }
    },
    [colors],
  );

  const statusFilters: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "submitted", label: "Pending" },
    { key: "reviewed", label: "Reviewed" },
    { key: "rejected", label: "Rejected" },
  ];

  const renderApplication = useCallback(
    ({ item: app }: { item: Application }) => {
      const status = getStatusBadge(app.status);

      return (
        <TouchableOpacity
          className="bg-card rounded-xl p-4 border border-border mb-3"
          onPress={() => router.push(`/job/${app.jobId}` as any)}
          activeOpacity={0.7}
        >
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1 mr-3">
              <Text
                className="font-semibold text-card-foreground text-base"
                numberOfLines={1}
              >
                {app.job?.title}
              </Text>
              <View className="flex-row items-center mt-1">
                <IconSymbol
                  name="location.fill"
                  size={12}
                  color={colors.mutedForeground}
                />
                <Text className="text-sm text-muted-foreground ml-1">
                  {app.job?.location}
                </Text>
              </View>
            </View>
            <View
              className="flex-row items-center px-2 py-1 rounded-full"
              style={{ backgroundColor: status.bg }}
            >
              <IconSymbol name={status.icon} size={12} color={status.text} />
              <Text
                className="text-xs font-medium ml-1"
                style={{ color: status.text }}
              >
                {status.label}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            {app.job?.salary && (
              <Text className="text-sm text-muted-foreground">
                {formatCurrency(app.job.salary)}/year
              </Text>
            )}
            {app.job?.status === "closed" && (
              <View className="px-2 py-0.5 rounded border border-orange-500">
                <Text className="text-xs text-orange-500">Job Closed</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [colors, getStatusBadge],
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20">
      <IconSymbol
        name="doc.text.fill"
        size={48}
        color={colors.mutedForeground}
      />
      <Text className="font-semibold text-foreground mt-4 mb-1">
        No applications
      </Text>
      <Text className="text-sm text-muted-foreground text-center mb-4">
        {statusFilter !== "all"
          ? "No applications with this status"
          : "You haven't applied to any jobs yet"}
      </Text>
      <TouchableOpacity
        className="bg-primary px-4 py-2 rounded-lg flex-row items-center"
        onPress={() => router.push("/(tabs)/jobs")}
      >
        <IconSymbol
          name="briefcase.fill"
          size={16}
          color={colors.primaryForeground}
        />
        <Text className="text-primary-foreground font-medium ml-2">
          Browse Jobs
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!applicationsQuery.isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  if (applicationsQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-background">
      <View className="px-4 pt-4">
        {/* Header */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-foreground">
            Applications
          </Text>
          <Text className="text-muted-foreground">
            Track your job applications
          </Text>
        </View>

        {/* Status Filter */}
        <View className="flex-row gap-2 mb-4">
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              className={`px-3 py-2 rounded-lg ${
                statusFilter === filter.key
                  ? "bg-primary"
                  : "bg-card border border-border"
              }`}
              onPress={() => setStatusFilter(filter.key)}
            >
              <Text
                className={
                  statusFilter === filter.key
                    ? "text-primary-foreground font-medium"
                    : "text-foreground"
                }
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Results count */}
        <Text className="text-sm text-muted-foreground mb-3">
          {total} application{total !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Applications List */}
      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={renderApplication}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={applicationsQuery.isRefetching}
            onRefresh={onRefresh}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
}

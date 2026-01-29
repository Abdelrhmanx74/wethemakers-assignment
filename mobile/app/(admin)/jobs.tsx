import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { formatCurrency, Job } from "@/lib/api";
import {
  useDeleteJobMutation,
  useMyJobsInfinite,
} from "@/app/(admin)/_hooks/use-admin-jobs";

export default function AdminJobsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const jobsQuery = useMyJobsInfinite({ limit: 10 });
  const deleteMutation = useDeleteJobMutation();

  const jobs = jobsQuery.data?.pages.flatMap((p) => p.data) ?? [];
  const totalJobs = jobsQuery.data?.pages[0]?.meta.total ?? 0;

  useFocusEffect(
    useCallback(() => {
      jobsQuery.refetch();
    }, [jobsQuery]),
  );

  const onRefresh = () => {
    jobsQuery.refetch();
  };

  const loadMore = () => {
    if (jobsQuery.hasNextPage && !jobsQuery.isFetchingNextPage) {
      jobsQuery.fetchNextPage();
    }
  };

  const handleDelete = (job: Job) => {
    Alert.alert(
      "Delete Job",
      `Are you sure you want to delete "${job.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(job.id);
              Alert.alert("Job deleted");
            } catch (error) {
              console.error("Failed to delete job:", error);
              Alert.alert("Delete failed", "Please try again.");
            }
          },
        },
      ],
    );
  };

  const getStatusBadge = (status: string) => {
    const isOpen = status === "open";
    return (
      <View
        className="px-2 py-1 rounded-full"
        style={{
          backgroundColor: isOpen
            ? "rgba(34, 197, 94, 0.2)"
            : "rgba(239, 68, 68, 0.2)",
        }}
      >
        <Text
          className="text-xs font-medium capitalize"
          style={{ color: isOpen ? "#22c55e" : "#ef4444" }}
        >
          {status}
        </Text>
      </View>
    );
  };

  const renderJob = ({ item }: { item: Job }) => (
    <TouchableOpacity
      className="bg-card rounded-xl p-4 border border-border mb-3"
      onPress={() => router.push(`/job/${item.id}` as any)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 pr-2">
          <Text
            className="font-semibold text-card-foreground text-lg"
            numberOfLines={1}
          >
            {item.title}
          </Text>
        </View>
        {getStatusBadge(item.status)}
      </View>

      <View className="flex-row items-center gap-4 mb-3">
        <View className="flex-row items-center gap-1">
          <Ionicons
            name="location-outline"
            size={14}
            color={colors.mutedForeground}
          />
          <Text className="text-muted-foreground text-sm">{item.location}</Text>
        </View>
        {item.salary && (
          <View className="flex-row items-center gap-1">
            <Ionicons
              name="cash-outline"
              size={14}
              color={colors.mutedForeground}
            />
            <Text className="text-muted-foreground text-sm">
              {formatCurrency(item.salary)}
            </Text>
          </View>
        )}
      </View>

      {item._count?.applications !== undefined && (
        <View className="flex-row items-center gap-1 mb-3">
          <Ionicons
            name="people-outline"
            size={14}
            color={colors.mutedForeground}
          />
          <Text className="text-muted-foreground text-sm">
            {item._count.applications} applicant
            {item._count.applications !== 1 ? "s" : ""}
          </Text>
        </View>
      )}

      <View className="flex-row gap-2">
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center gap-2 bg-primary/10 rounded-lg py-2"
          onPress={() => router.push(`/job/${item.id}` as any)}
        >
          <Ionicons name="eye" size={16} color={colors.primary} />
          <Text className="text-primary font-medium text-sm">View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center gap-2 bg-red-500/10 rounded-lg py-2"
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash" size={16} color="#ef4444" />
          <Text className="text-red-500 font-medium text-sm">Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (jobsQuery.isLoading && jobs.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center justify-between mb-2">
          <View>
            <Text className="text-xl font-bold text-foreground">My Jobs</Text>
            <Text className="text-muted-foreground text-sm">
              {totalJobs} job{totalJobs !== 1 ? "s" : ""} posted
            </Text>
          </View>
          <TouchableOpacity
            className="bg-primary px-4 py-2 rounded-lg flex-row items-center gap-2"
            onPress={() => router.push("/admin-job-create" as any)}
          >
            <Ionicons name="add" size={18} color={colors.primaryForeground} />
            <Text className="text-primary-foreground font-medium">New Job</Text>
          </TouchableOpacity>
        </View>
      </View>

      {jobs.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons
            name="briefcase-outline"
            size={64}
            color={colors.mutedForeground}
          />
          <Text className="text-xl font-semibold text-foreground mt-4">
            No jobs yet
          </Text>
          <Text className="text-muted-foreground text-center mt-2">
            Post your first job to start receiving applications
          </Text>
          <TouchableOpacity
            className="bg-primary px-6 py-3 rounded-lg mt-4"
            onPress={() => router.push("/admin-job-create" as any)}
          >
            <Text className="text-primary-foreground font-semibold">
              Post a Job
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderJob}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingTop: 8 }}
          refreshControl={
            <RefreshControl
              refreshing={jobsQuery.isRefetching}
              onRefresh={onRefresh}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            jobsQuery.isFetchingNextPage ? (
              <ActivityIndicator
                color={colors.primary}
                style={{ marginVertical: 16 }}
              />
            ) : null
          }
        />
      )}
    </View>
  );
}

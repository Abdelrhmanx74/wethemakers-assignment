import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { Job, formatCurrency, truncateDescription } from "@/lib/api";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useOpenJobsInfinite } from "@/app/(tabs)/_hooks/use-open-jobs";

export default function JobsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const jobsQuery = useOpenJobsInfinite({
    search: query.trim() ? query.trim() : undefined,
    limit: 10,
  });

  const jobs = jobsQuery.data?.pages.flatMap((p) => p.data) ?? [];
  const total = jobsQuery.data?.pages[0]?.meta.total ?? 0;

  const handleSearch = () => {
    setQuery(searchInput.trim());
  };

  const onRefresh = () => {
    jobsQuery.refetch();
  };

  const loadMore = () => {
    if (jobsQuery.hasNextPage && !jobsQuery.isFetchingNextPage) {
      jobsQuery.fetchNextPage();
    }
  };

  const renderJob = useCallback(
    ({ item: job }: { item: Job }) => (
      <TouchableOpacity
        className="bg-card rounded-xl p-4 border border-border mb-3"
        onPress={() => router.push(`/job/${job.id}` as any)}
        activeOpacity={0.7}
      >
        <Text
          className="font-semibold text-card-foreground text-base mb-1"
          numberOfLines={1}
        >
          {job.title}
        </Text>
        <Text className="text-sm text-muted-foreground mb-2" numberOfLines={2}>
          {truncateDescription(job.description)}
        </Text>
        <View className="flex-row items-center mb-2">
          <IconSymbol
            name="location.fill"
            size={14}
            color={colors.mutedForeground}
          />
          <Text className="text-sm text-muted-foreground ml-1">
            {job.location}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          {job.salary != null && (
            <View className="bg-secondary px-2 py-1 rounded">
              <Text className="text-xs text-secondary-foreground font-medium">
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
    ),
    [colors.mutedForeground],
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20">
      <IconSymbol
        name="briefcase.fill"
        size={48}
        color={colors.mutedForeground}
      />
      <Text className="font-semibold text-foreground mt-4 mb-1">
        No jobs found
      </Text>
      <Text className="text-sm text-muted-foreground text-center">
        Try a different search
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!jobsQuery.isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  if (jobsQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-background">
      <View className="px-4 pt-4">
        <View className="mb-4">
          <Text className="text-2xl font-bold text-foreground">Jobs</Text>
          <Text className="text-muted-foreground">
            Find your next opportunity
          </Text>
        </View>

        <View className="flex-row gap-2 mb-4">
          <View className="flex-1 flex-row items-center bg-card border border-border rounded-lg px-3">
            <IconSymbol
              name="magnifyingglass"
              size={18}
              color={colors.mutedForeground}
            />
            <TextInput
              className="flex-1 h-11 ml-2 text-foreground"
              placeholder="Search jobs..."
              placeholderTextColor={colors.mutedForeground}
              value={searchInput}
              onChangeText={setSearchInput}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            className="h-11 px-4 bg-primary rounded-lg items-center justify-center"
            onPress={handleSearch}
            activeOpacity={0.85}
          >
            <Text className="text-primary-foreground font-medium">Search</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-sm text-muted-foreground mb-3">
          {total} job{total !== 1 ? "s" : ""} found
        </Text>
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJob}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={jobsQuery.isRefetching}
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

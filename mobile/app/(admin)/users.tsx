import React from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { User } from "@/lib/api";
import { useApplicantsInfinite } from "@/app/(admin)/_hooks/use-admin-users";

export default function AdminUsersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const usersQuery = useApplicantsInfinite({ limit: 10 });
  const users = usersQuery.data?.pages.flatMap((p) => p.data) ?? [];
  const totalUsers = usersQuery.data?.pages[0]?.meta.total ?? 0;

  const onRefresh = () => {
    usersQuery.refetch();
  };

  const loadMore = () => {
    if (usersQuery.hasNextPage && !usersQuery.isFetchingNextPage) {
      usersQuery.fetchNextPage();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderUser = ({ item }: { item: User }) => (
    <View className="bg-card rounded-xl p-4 border border-border mb-3">
      <View className="flex-row items-center gap-3">
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary + "20" }}
        >
          <Text className="text-primary font-bold text-lg">
            {getInitials(item.fullName)}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-card-foreground text-base">
            {item.fullName}
          </Text>
          <Text className="text-muted-foreground text-sm">{item.email}</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-4 mt-3 pt-3 border-t border-border">
        <View className="flex-row items-center gap-1">
          <Ionicons
            name="calendar-outline"
            size={14}
            color={colors.mutedForeground}
          />
          <Text className="text-muted-foreground text-xs">
            Joined {formatDate(item.createdAt)}
          </Text>
        </View>
        <View
          className="px-2 py-1 rounded-full"
          style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
        >
          <Text className="text-xs font-medium" style={{ color: "#3b82f6" }}>
            {item.role}
          </Text>
        </View>
      </View>
    </View>
  );

  if (usersQuery.isLoading && users.length === 0) {
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
        <Text className="text-xl font-bold text-foreground">Applicants</Text>
        <Text className="text-muted-foreground text-sm">
          {totalUsers} job seeker{totalUsers !== 1 ? "s" : ""} registered
        </Text>
      </View>

      {users.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons
            name="people-outline"
            size={64}
            color={colors.mutedForeground}
          />
          <Text className="text-xl font-semibold text-foreground mt-4">
            No applicants yet
          </Text>
          <Text className="text-muted-foreground text-center mt-2">
            Job seekers who apply will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingTop: 8 }}
          refreshControl={
            <RefreshControl
              refreshing={usersQuery.isRefetching}
              onRefresh={onRefresh}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            usersQuery.isFetchingNextPage ? (
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

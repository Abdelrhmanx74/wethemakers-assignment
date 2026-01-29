import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { Application } from "@/lib/api";
import { BottomDrawer } from "@/components/bottom-drawer";
import {
  useAllApplicationsInfinite,
  useUpdateApplicationStatusMutation,
} from "@/app/(admin)/_hooks/use-admin-applications";

export default function AdminApplicationsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [filter, setFilter] = useState<
    "all" | "submitted" | "reviewed" | "rejected"
  >("all");
  const [selected, setSelected] = useState<Application | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const applicationsQuery = useAllApplicationsInfinite({
    status: filter === "all" ? undefined : filter,
    limit: 10,
  });
  const updateStatusMutation = useUpdateApplicationStatusMutation();

  const applications =
    applicationsQuery.data?.pages.flatMap((p) => p.data) ?? [];
  const totalApplications = applicationsQuery.data?.pages[0]?.meta.total ?? 0;

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

  const handleStatusChange = (
    app: Application,
    newStatus: "reviewed" | "rejected",
  ) => {
    Alert.alert(
      `Mark as ${newStatus}`,
      `Are you sure you want to mark this application as ${newStatus}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await updateStatusMutation.mutateAsync({
                id: app.id,
                status: newStatus,
              });
              setSelected((prev) =>
                prev?.id === app.id ? { ...prev, status: newStatus } : prev,
              );
              Alert.alert("Status updated");
            } catch (error) {
              console.error("Failed to update application status:", error);
              Alert.alert("Update failed", "Please try again.");
            }
          },
        },
      ],
    );
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, { bg: string; text: string }> = {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderApplication = ({ item }: { item: Application }) => (
    <TouchableOpacity
      className="bg-card rounded-xl p-4 border border-border mb-3"
      activeOpacity={0.7}
      onPress={() => {
        setSelected(item);
        setDrawerOpen(true);
      }}
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 pr-2">
          <Text className="font-semibold text-card-foreground text-base">
            {item.user?.fullName || "Unknown User"}
          </Text>
          <Text className="text-muted-foreground text-sm">
            {item.user?.email}
          </Text>
        </View>
        {getStatusBadge(item.status)}
      </View>

      <View className="bg-muted/50 rounded-lg p-3 mb-3">
        <Text className="text-xs text-muted-foreground mb-1">Applied for</Text>
        <Text className="font-medium text-foreground">
          {item.job?.title || "Unknown Job"}
        </Text>
        {item.job?.location && (
          <View className="flex-row items-center gap-1 mt-1">
            <Ionicons
              name="location-outline"
              size={12}
              color={colors.mutedForeground}
            />
            <Text className="text-muted-foreground text-xs">
              {item.job.location}
            </Text>
          </View>
        )}
      </View>

      <View className="mb-3">
        <Text className="text-xs text-muted-foreground mb-1">Application</Text>
        <Text className="text-foreground text-sm" numberOfLines={2}>
          Tap to view resume and cover letter
        </Text>
      </View>

      <View className="flex-row items-center justify-between pt-3 border-t border-border">
        <Text className="text-muted-foreground text-xs">
          Applied {formatDate(item.createdAt)}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.mutedForeground}
        />
      </View>
    </TouchableOpacity>
  );

  const filters = [
    { key: "all", label: "All" },
    { key: "submitted", label: "Pending" },
    { key: "reviewed", label: "Reviewed" },
    { key: "rejected", label: "Rejected" },
  ];

  if (applicationsQuery.isLoading && applications.length === 0) {
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
        <Text className="text-xl font-bold text-foreground">Applications</Text>
        <Text className="text-muted-foreground text-sm">
          {totalApplications} application{totalApplications !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Filter Tabs */}
      <View className="px-4 pb-2">
        <View className="flex-row bg-muted rounded-lg p-1">
          {filters.map((f) => (
            <TouchableOpacity
              key={f.key}
              className={`flex-1 py-2 rounded-md items-center ${
                filter === f.key ? "bg-card" : ""
              }`}
              onPress={() => setFilter(f.key as any)}
            >
              <Text
                className={`text-sm font-medium ${
                  filter === f.key ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {applications.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons
            name="document-text-outline"
            size={64}
            color={colors.mutedForeground}
          />
          <Text className="text-xl font-semibold text-foreground mt-4">
            No applications
          </Text>
          <Text className="text-muted-foreground text-center mt-2">
            {filter === "all"
              ? "No applications have been submitted yet"
              : `No ${filter} applications`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={applications}
          renderItem={renderApplication}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingTop: 8 }}
          refreshControl={
            <RefreshControl
              refreshing={applicationsQuery.isRefetching}
              onRefresh={onRefresh}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            applicationsQuery.isFetchingNextPage ? (
              <ActivityIndicator
                color={colors.primary}
                style={{ marginVertical: 16 }}
              />
            ) : null
          }
        />
      )}

      <BottomDrawer
        visible={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelected(null);
        }}
        containerStyle={{ backgroundColor: colors.card }}
      >
        {selected && (
          <ScrollView
            style={{ maxHeight: 520 }}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-1 pr-3">
                <Text className="text-lg font-semibold text-card-foreground">
                  {selected.user?.fullName || "Unknown User"}
                </Text>
                <Text className="text-muted-foreground text-sm">
                  {selected.user?.email}
                </Text>
              </View>
              {getStatusBadge(selected.status)}
            </View>

            <View className="bg-muted/50 rounded-lg p-3 mb-4">
              <Text className="text-xs text-muted-foreground mb-1">
                Applied for
              </Text>
              <Text className="font-medium text-foreground">
                {selected.job?.title || "Unknown Job"}
              </Text>
              {selected.job?.location && (
                <View className="flex-row items-center gap-1 mt-1">
                  <Ionicons
                    name="location-outline"
                    size={12}
                    color={colors.mutedForeground}
                  />
                  <Text className="text-muted-foreground text-xs">
                    {selected.job.location}
                  </Text>
                </View>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-xs text-muted-foreground mb-1">Resume</Text>
              <View className="bg-background rounded-lg border border-border p-3">
                <Text className="text-foreground text-sm">
                  {selected.resume || "(No resume)"}
                </Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-xs text-muted-foreground mb-1">
                Cover Letter
              </Text>
              <View className="bg-background rounded-lg border border-border p-3">
                <Text className="text-foreground text-sm">
                  {selected.coverLetter || "(No cover letter)"}
                </Text>
              </View>
            </View>

            {selected.status === "submitted" && (
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center gap-2 bg-green-500/10 rounded-lg py-3"
                  onPress={() => handleStatusChange(selected, "reviewed")}
                >
                  <Ionicons name="checkmark" size={18} color="#22c55e" />
                  <Text className="text-green-500 font-medium">
                    Mark Reviewed
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center gap-2 bg-red-500/10 rounded-lg py-3"
                  onPress={() => handleStatusChange(selected, "rejected")}
                >
                  <Ionicons name="close" size={18} color="#ef4444" />
                  <Text className="text-red-500 font-medium">Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </BottomDrawer>
    </View>
  );
}

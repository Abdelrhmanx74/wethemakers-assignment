import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/stores/auth-store";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/context/theme-context";

export default function AdminProfileScreen() {
  const { user, logout } = useAuth();
  const { mode, setMode } = useTheme();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const initials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)" as any);
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">Profile</Text>
          <Text className="text-muted-foreground">Manage your account</Text>
        </View>

        {/* Profile Card */}
        <View className="bg-card rounded-xl border border-border p-6 mb-6">
          <View className="items-center mb-4">
            {/* Avatar */}
            <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-3">
              <Text className="text-primary-foreground text-2xl font-bold">
                {initials}
              </Text>
            </View>
            <Text className="text-xl font-semibold text-card-foreground">
              {user?.fullName}
            </Text>
            <Text className="text-muted-foreground">{user?.email}</Text>
            <View className="mt-2 px-3 py-1 bg-secondary rounded-full">
              <Text className="text-xs text-secondary-foreground font-medium capitalize">
                Administrator
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="bg-card rounded-xl border border-border overflow-hidden">
          <View className="flex-row items-center justify-between p-4 border-b border-border">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-lg bg-secondary items-center justify-center mr-3">
                <IconSymbol
                  name="moon.stars.fill"
                  size={20}
                  color={colors.secondaryForeground}
                />
              </View>
              <View>
                <Text className="text-card-foreground font-medium">
                  Dark mode
                </Text>
                <Text className="text-muted-foreground text-xs">
                  System / Light / Dark
                </Text>
              </View>
            </View>
            <Switch
              value={mode === "dark"}
              onValueChange={(val) => setMode(val ? "dark" : "light")}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>

          <TouchableOpacity
            className="flex-row items-center justify-between p-4 border-b border-border"
            onPress={() => setMode("system")}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-lg bg-secondary items-center justify-center mr-3">
                <IconSymbol
                  name="gearshape.fill"
                  size={20}
                  color={colors.secondaryForeground}
                />
              </View>
              <Text className="text-card-foreground font-medium">
                Use system theme
              </Text>
            </View>
            <Text className="text-muted-foreground text-sm">
              {mode === "system" ? "On" : "Off"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between p-4 border-b border-border"
            onPress={() => router.push("/(admin)/jobs" as any)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-lg bg-blue-500/20 items-center justify-center mr-3">
                <IconSymbol name="briefcase.fill" size={20} color="#3b82f6" />
              </View>
              <Text className="text-card-foreground font-medium">My Jobs</Text>
            </View>
            <IconSymbol
              name="chevron.right"
              size={16}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between p-4 border-b border-border"
            onPress={() => router.push("/(admin)/applications" as any)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-lg bg-green-500/20 items-center justify-center mr-3">
                <IconSymbol name="doc.text.fill" size={20} color="#22c55e" />
              </View>
              <Text className="text-card-foreground font-medium">
                All Applications
              </Text>
            </View>
            <IconSymbol
              name="chevron.right"
              size={16}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between p-4 border-b border-border"
            onPress={() => router.push("/(admin)/users" as any)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-lg bg-orange-500/20 items-center justify-center mr-3">
                <IconSymbol name="person.2.fill" size={20} color="#f97316" />
              </View>
              <Text className="text-card-foreground font-medium">
                Applicants
              </Text>
            </View>
            <IconSymbol
              name="chevron.right"
              size={16}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          className="mt-6 bg-red-500/10 rounded-xl p-4 flex-row items-center justify-center"
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <IconSymbol
            name="rectangle.portrait.and.arrow.right"
            size={20}
            color="#ef4444"
          />
          <Text className="text-red-500 font-semibold ml-2">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

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

export default function ProfileScreen() {
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
          router.replace("/(auth)/login");
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
              <Text className="text-xs text-secondary-foreground capitalize">
                {user?.role}
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
            onPress={() => router.push("/(tabs)/applications")}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-lg bg-secondary items-center justify-center mr-3">
                <IconSymbol
                  name="doc.text.fill"
                  size={20}
                  color={colors.secondaryForeground}
                />
              </View>
              <Text className="text-card-foreground font-medium">
                My Applications
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
            onPress={() => router.push("/(tabs)/jobs")}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-lg bg-secondary items-center justify-center mr-3">
                <IconSymbol
                  name="briefcase.fill"
                  size={20}
                  color={colors.secondaryForeground}
                />
              </View>
              <Text className="text-card-foreground font-medium">
                Browse Jobs
              </Text>
            </View>
            <IconSymbol
              name="chevron.right"
              size={16}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between p-4"
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-lg bg-destructive/10 items-center justify-center mr-3">
                <IconSymbol
                  name="rectangle.portrait.and.arrow.right"
                  size={20}
                  color={colors.destructive}
                />
              </View>
              <Text className="text-destructive font-medium">Sign Out</Text>
            </View>
            <IconSymbol
              name="chevron.right"
              size={16}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="mt-8 items-center">
          <View className="w-12 h-12 bg-primary rounded-lg items-center justify-center mb-2">
            <Text className="text-primary-foreground text-xl font-bold">A</Text>
          </View>
          <Text className="text-muted-foreground text-sm">Acme Jobs</Text>
          <Text className="text-muted-foreground text-xs mt-1">
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import { Drawer } from "expo-router/drawer";
import { Redirect } from "expo-router";
import React from "react";
import { View, ActivityIndicator } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { CustomDrawerContent } from "@/components/ui/custom-drawer-content";
import { UserMenuButton } from "@/components/user-menu-button";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/stores/auth-store";

export default function AdminTabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Redirect job seekers to regular tabs
  if (user?.role === "jobseeker") {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.foreground,
        headerTitleStyle: { fontWeight: "600" },
        headerRight: () => <UserMenuButton />,
        drawerStyle: { backgroundColor: colors.card },
        drawerActiveTintColor: colors.foreground,
        drawerInactiveTintColor: colors.mutedForeground,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <IconSymbol size={size ?? 22} name="house.fill" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="jobs"
        options={{
          title: "Jobs",
          drawerIcon: ({ color, size }) => (
            <IconSymbol size={size ?? 22} name="briefcase.fill" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="users"
        options={{
          title: "Applicants",
          drawerIcon: ({ color, size }) => (
            <IconSymbol size={size ?? 22} name="person.2.fill" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="applications"
        options={{
          title: "Applications",
          drawerIcon: ({ color, size }) => (
            <IconSymbol size={size ?? 22} name="doc.text.fill" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: "",
          drawerLabel: () => null,
          drawerItemStyle: { height: 0 },
        }}
      />
    </Drawer>
  );
}

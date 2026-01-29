import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import React from "react";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemeProvider as AppThemeProvider } from "@/context/theme-context";
import { useAuthStore } from "@/stores/auth-store";

import "./global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const bootstrap = useAuthStore((s) => s.bootstrap);

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000,
          },
        },
      }),
  );

  React.useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(admin)" options={{ headerShown: false }} />
          <Stack.Screen
            name="job/[id]"
            options={{
              title: "Job Details",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name="admin-job-create"
            options={{
              presentation: "transparentModal",
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootLayoutInner />
    </AppThemeProvider>
  );
}

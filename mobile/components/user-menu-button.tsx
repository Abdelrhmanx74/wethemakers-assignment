import React, { useRef, useState } from "react";
import { Text, TouchableOpacity, View, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/stores/auth-store";
import { useTheme } from "@/context/theme-context";

export function UserMenuButton() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { user, logout } = useAuth();
  const { mode, setMode } = useTheme();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);

  const waitPopoverClose = () =>
    new Promise<void>((resolve) => setTimeout(resolve, 150));

  return (
    <>
      <TouchableOpacity
        ref={anchorRef}
        onPress={() => setOpen(true)}
        className="mr-3 p-1 rounded-full"
        activeOpacity={0.75}
      >
        <Ionicons name="person-circle" size={30} color={colors.foreground} />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)}>
          <View
            style={{
              position: "absolute",
              top: 48,
              right: 8,
              width: 200,
              backgroundColor: colors.card,
              borderRadius: 10,
            }}
          >
            <View className="p-3">
              <View className="mb-2">
                <Text
                  className="text-base font-semibold text-card-foreground"
                  numberOfLines={1}
                >
                  {user?.fullName || "Account"}
                </Text>
                <Text
                  className="text-xs text-muted-foreground"
                  numberOfLines={1}
                >
                  {user?.email}
                </Text>
              </View>
              <View className="h-px w-10 bg-red-500 my-2" />
              <Text className="text-xs text-muted-foreground mt-2">Theme</Text>
              {(
                [
                  { key: "system", label: "System" },
                  { key: "light", label: "Light" },
                  { key: "dark", label: "Dark" },
                ] as const
              ).map((item) => (
                <TouchableOpacity
                  key={item.key}
                  className="flex-row items-center justify-between px-2 py-2 rounded-xl"
                  onPress={() => {
                    setMode(item.key);
                    setOpen(false);
                  }}
                  activeOpacity={0.75}
                >
                  <View className="flex-row items-center gap-2">
                    <Ionicons
                      name={
                        item.key === "dark"
                          ? "moon"
                          : item.key === "light"
                            ? "sunny"
                            : "settings"
                      }
                      size={16}
                      color={colors.mutedForeground}
                    />
                    <Text className="text-foreground font-medium">
                      {item.label}
                    </Text>
                  </View>
                  {mode === item.key ? (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={colors.primary}
                    />
                  ) : null}
                </TouchableOpacity>
              ))}

              <View className="h-px bg-border my-2" />

              <TouchableOpacity
                className="flex-row items-center justify-between px-2 py-2 mt-2 rounded-xl"
                onPress={async () => {
                  // Ensure popover fully closes before changing auth state or
                  // navigating away. This avoids react-native-popover-view
                  // attempting to measure an element that has been unmounted
                  // (which triggers "getRectForRef - current is not set").
                  try {
                    setOpen(false);
                    await waitPopoverClose();
                  } catch {}

                  try {
                    await logout();
                  } catch (err) {
                    console.error("Logout failed:", err);
                  }

                  try {
                    router.replace("/(auth)/login" as any);
                  } catch (err) {
                    console.error("Navigation after logout failed:", err);
                  }
                }}
                activeOpacity={0.75}
              >
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name="log-out-outline"
                    size={16}
                    color={colors.destructive}
                  />
                  <Text className="text-destructive font-semibold">
                    Sign out
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

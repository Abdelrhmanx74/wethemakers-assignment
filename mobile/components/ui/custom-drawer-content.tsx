import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { IconSymbol } from "./icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export function CustomDrawerContent(props: any) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <DrawerContentScrollView {...props} className="bg-card">
      {/* Logo and App Name Header */}
      <View className="pb-2 border-b border-border mb-4">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => props.navigation.closeDrawer()}
            className="w-10 h-10 rounded-lg items-center justify-center"
          >
            <IconSymbol
              name="line.3.horizontal"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
          <Text
            className="text-xl font-bold"
            style={{ color: colors.foreground }}
          >
            Acme Jobs
          </Text>
        </View>
      </View>

      {/* Navigation Items */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

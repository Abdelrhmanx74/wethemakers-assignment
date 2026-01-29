/**
 * Theme colors matching the frontend web app
 */

import { Platform } from "react-native";

export const Colors = {
  light: {
    // Core colors matching frontend
    background: "#ffffff",
    foreground: "#0f172a",
    card: "#ffffff",
    cardForeground: "#0f172a",
    primary: "#1e293b",
    primaryForeground: "#f8fafc",
    secondary: "#f1f5f9",
    secondaryForeground: "#1e293b",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
    accent: "#f1f5f9",
    accentForeground: "#1e293b",
    destructive: "#dc2626",
    border: "#e2e8f0",
    input: "#e2e8f0",
    ring: "#94a3b8",
    // Status colors
    success: "#16a34a",
    successLight: "#dcfce7",
    warning: "#ca8a04",
    warningLight: "#fef9c3",
    error: "#dc2626",
    errorLight: "#fee2e2",
    // Tab bar
    tabIconDefault: "#64748b",
    tabIconSelected: "#0f172a",
    tint: "#0f172a",
    text: "#0f172a",
    icon: "#64748b",
  },
  dark: {
    // Core colors matching frontend dark mode
    background: "#0f172a",
    foreground: "#f8fafc",
    card: "#1e293b",
    cardForeground: "#f8fafc",
    primary: "#e2e8f0",
    primaryForeground: "#1e293b",
    secondary: "#334155",
    secondaryForeground: "#f8fafc",
    muted: "#334155",
    mutedForeground: "#94a3b8",
    accent: "#334155",
    accentForeground: "#f8fafc",
    destructive: "#ef4444",
    border: "rgba(255, 255, 255, 0.1)",
    input: "rgba(255, 255, 255, 0.15)",
    ring: "#64748b",
    // Status colors
    success: "#22c55e",
    successLight: "rgba(34, 197, 94, 0.2)",
    warning: "#eab308",
    warningLight: "rgba(234, 179, 8, 0.2)",
    error: "#ef4444",
    errorLight: "rgba(239, 68, 68, 0.2)",
    // Tab bar
    tabIconDefault: "#94a3b8",
    tabIconSelected: "#f8fafc",
    tint: "#f8fafc",
    text: "#f8fafc",
    icon: "#94a3b8",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

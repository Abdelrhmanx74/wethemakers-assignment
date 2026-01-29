import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { Uniwind, useUniwind } from "uniwind";

type ThemeMode = "system" | "light" | "dark";

type ThemeContextValue = {
  mode: ThemeMode;
  colorScheme: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_MODE_KEY = "themeMode";

async function loadThemeMode(): Promise<ThemeMode | null> {
  try {
    if (Platform.OS === "web") {
      const raw = localStorage.getItem(THEME_MODE_KEY);
      return (raw as ThemeMode) || null;
    }
    const SecureStore = await import("expo-secure-store");
    const raw = await SecureStore.getItemAsync(THEME_MODE_KEY);
    return (raw as ThemeMode) || null;
  } catch {
    return null;
  }
}

async function saveThemeMode(mode: ThemeMode): Promise<void> {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(THEME_MODE_KEY, mode);
      return;
    }
    const SecureStore = await import("expo-secure-store");
    await SecureStore.setItemAsync(THEME_MODE_KEY, mode);
  } catch {
    // ignore
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const { theme } = useUniwind();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await loadThemeMode();
      if (!cancelled && stored) {
        setModeState(stored);
        Uniwind.setTheme(stored);
      }
      if (!cancelled) {
        setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Uniwind's runtime theme resolves to the effective scheme ('light' | 'dark').
  const colorScheme = (theme === "dark" ? "dark" : "light") as "light" | "dark";

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    Uniwind.setTheme(next);
    void saveThemeMode(next);
  };

  const toggle = () => {
    setMode(colorScheme === "dark" ? "light" : "dark");
  };

  const value: ThemeContextValue = { mode, colorScheme, setMode, toggle };

  if (!hydrated) {
    // Keep rendering; default is system.
    return (
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

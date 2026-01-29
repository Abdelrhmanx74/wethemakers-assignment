import { create } from "zustand";
import { Platform } from "react-native";
import { router } from "expo-router";

import { User, setUnauthorizedHandler } from "@/lib/api";
import { getMeAction } from "@/app/(auth)/_actions/actions";

// Cross-platform storage (web localStorage, native SecureStore)
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    const SecureStore = await import("expo-secure-store");
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
      return;
    }
    const SecureStore = await import("expo-secure-store");
    await SecureStore.setItemAsync(key, value);
  },
  async deleteItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
      return;
    }
    const SecureStore = await import("expo-secure-store");
    await SecureStore.deleteItemAsync(key);
  },
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  bootstrap: () => Promise<void>;
  setSession: (session: { user: User; accessToken: string }) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  bootstrap: async () => {
    // Install a single global handler for 401s.
    setUnauthorizedHandler(async () => {
      await storage.deleteItem("accessToken");
      set({ user: null, isAuthenticated: false });
      router.replace("/(auth)/login" as any);
    });

    try {
      const token = await storage.getItem("accessToken");
      if (!token) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const me = await getMeAction();
      set({ user: me, isAuthenticated: true, isLoading: false });
    } catch {
      await storage.deleteItem("accessToken");
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setSession: async ({ user, accessToken }) => {
    await storage.setItem("accessToken", accessToken);
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await storage.deleteItem("accessToken");
    set({ user: null, isAuthenticated: false });
  },
}));

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  return { user, isLoading, isAuthenticated, logout };
}

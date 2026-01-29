import axios from "axios";
import { Platform } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001";

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

// Storage helper for cross-platform support
const getToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === "web") {
      const token = localStorage.getItem("accessToken");
      return token;
    }
    const SecureStore = await import("expo-secure-store");
    return SecureStore.getItemAsync("accessToken");
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

const clearToken = async (): Promise<void> => {
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem("accessToken");
      return;
    }
    const SecureStore = await import("expo-secure-store");
    await SecureStore.deleteItemAsync("accessToken");
  } catch {
    // ignore
  }
};

// Synchronous token getter for web
const getTokenSync = (): string | null => {
  if (Platform.OS === "web") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token interceptor
api.interceptors.request.use(
  async (config) => {
    // Try sync first for web
    let token = getTokenSync();

    // Fall back to async for native
    if (!token && Platform.OS !== "web") {
      token = await getToken();
    }

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      await clearToken();
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);

// Types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: number | null;
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  creator?: {
    id: string;
    fullName: string;
    email: string;
  };
  _count?: {
    applications: number;
  };
}

export interface Application {
  id: string;
  resume: string;
  coverLetter: string;
  status: "submitted" | "reviewed" | "rejected";
  createdAt: string;
  updatedAt: string;
  jobId: string;
  userId: string;
  job?: {
    id: string;
    title: string;
    location: string;
    salary: number | null;
    status: "open" | "closed";
  };
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "jobseeker";
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Jobs API
export interface JobQueryParams {
  search?: string;
  location?: string;
  status?: "open" | "closed";
  page?: number;
  limit?: number;
}

// Applications API
export interface ApplicationQueryParams {
  status?: "submitted" | "reviewed" | "rejected";
  page?: number;
  limit?: number;
}

// Utilities
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function truncateDescription(
  description: string,
  maxLength = 100,
): string {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength).trim() + "...";
}

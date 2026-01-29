import React, { PropsWithChildren } from "react";

export { useAuth } from "@/stores/auth-store";

// Legacy compatibility shim: previous code used an AuthProvider + useAuth context.
// The app now uses the Zustand store in `stores/auth-store.ts`.
export function AuthProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}

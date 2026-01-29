import { useMutation } from "@tanstack/react-query";

import { loginAction, registerAction } from "@/app/(auth)/_actions/actions";
import { useAuthStore } from "@/stores/auth-store";

export function useLoginMutation() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: async (vars: { email: string; password: string }) => {
      return loginAction(vars.email, vars.password);
    },
    onSuccess: async (session) => {
      await setSession(session);
    },
  });
}

export function useRegisterMutation() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: async (vars: {
      fullName: string;
      email: string;
      password: string;
      role: "admin" | "jobseeker";
    }) => {
      return registerAction(
        vars.fullName,
        vars.email,
        vars.password,
        vars.role,
      );
    },
    onSuccess: async (session) => {
      await setSession(session);
    },
  });
}

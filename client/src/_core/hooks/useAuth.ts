import { startLogin } from "@/const";
import { ApiError, apiRequest, queryKeys } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";

export type AuthUser = {
  id: number;
  name: string | null;
  email: string | null;
  role: "user" | "editor" | "admin";
  lastSignedIn?: string;
  createdAt?: string;
};

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath } = options ?? {};
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: queryKeys.authMe,
    queryFn: () => apiRequest<AuthUser | null>("auth/me"),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      apiRequest<AuthUser>("auth/login", { method: "POST", body: credentials }),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.authMe, data);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: { name: string; email: string; password: string }) =>
      apiRequest<AuthUser>("auth/register", { method: "POST", body: payload }),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.authMe, data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest<{ success: boolean }>("auth/logout", { method: "POST" }),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.authMe, null);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) =>
      apiRequest<{ success: boolean; message: string; resetToken?: string }>("auth/forgot-password", {
        method: "POST",
        body: { email },
      }),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (payload: { token: string; password: string }) =>
      apiRequest<{ success: boolean; message: string }>("auth/reset-password", {
        method: "POST",
        body: payload,
      }),
  });

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 401) {
        return;
      }
      throw error;
    } finally {
      queryClient.setQueryData(queryKeys.authMe, null);
      await queryClient.invalidateQueries({ queryKey: queryKeys.authMe });
    }
  }, [logoutMutation, queryClient]);

  const state = useMemo(() => {
    const user = meQuery.data ?? null;
    const isAdmin = user?.role === "admin";
    const isEditor = user?.role === "editor";
    return {
      user,
      isAdmin,
      isEditor,
      loading: meQuery.isLoading || logoutMutation.isPending || loginMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? loginMutation.error ?? null,
      isAuthenticated: Boolean(user),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
    loginMutation.error,
    loginMutation.isPending,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading || logoutMutation.isPending) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (redirectPath && window.location.pathname === redirectPath) return;

    if (redirectPath) {
      window.location.href = redirectPath;
    } else {
      startLogin();
    }
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    meQuery.isLoading,
    state.user,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    login: (credentials: { username: string; password: string }) => loginMutation.mutateAsync(credentials),
    register: (payload: { name: string; email: string; password: string }) => registerMutation.mutateAsync(payload),
    forgotPassword: (email: string) => forgotPasswordMutation.mutateAsync(email),
    resetPassword: (payload: { token: string; password: string }) => resetPasswordMutation.mutateAsync(payload),
    logout,
  };
}

import { useQuery } from "@tanstack/react-query";

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export const queryKeys = {
  authMe: ["api", "auth", "me"] as const,
  adminOverview: ["api", "admin", "overview"] as const,
  adminContent: ["api", "admin", "content"] as const,
  adminMedia: ["api", "admin", "media"] as const,
  adminUsers: ["api", "admin", "users"] as const,
  adminSchools: ["api", "admin", "schools"] as const,
  adminTeachers: ["api", "admin", "teachers"] as const,
  adminAlumni: ["api", "admin", "alumni"] as const,
  adminNews: ["api", "admin", "news"] as const,
  adminGallery: ["api", "admin", "gallery"] as const,
  adminPractices: ["api", "admin", "best-practices"] as const,
  adminCoordinators: ["api", "admin", "coordinators"] as const,
  adminMentors: ["api", "admin", "mentors"] as const,
  publicCoordinators: ["api", "coordinators"] as const,
  publicMentors: ["api", "mentors"] as const,
  socialPlatforms: ["api", "social", "platforms"] as const,
  socialPosts: ["api", "social", "posts"] as const,
  adminSocialAccounts: ["api", "admin", "social", "accounts"] as const,
  adminSocialPosts: ["api", "admin", "social", "posts"] as const,
  adminSocialSyncLogs: ["api", "admin", "social", "sync-logs"] as const,
};

export async function apiRequest<T>(
  path: string,
  options: Omit<RequestInit, "body"> & { body?: unknown } = {},
): Promise<T> {
  const { body, headers, ...requestOptions } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const apiBaseUrl = envApiBaseUrl
    ? (envApiBaseUrl.endsWith("/") ? envApiBaseUrl : `${envApiBaseUrl}/`)
    : (window.__PTRP_CONFIG__?.apiBaseUrl ?? window.__MANUS_CONFIG__?.apiBaseUrl ?? `${import.meta.env.BASE_URL}api/`);
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...requestOptions,
    credentials: "include",
    headers: {
      ...(body !== undefined && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : isFormData || typeof body === "string" ? body : JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(payload?.error || `Request failed (${response.status})`, response.status);
  }
  return payload as T;
}

export function useApiQuery<T>(key: readonly unknown[], path: string, enabled = true) {
  return useQuery<T>({ queryKey: key, queryFn: () => apiRequest<T>(path), enabled });
}
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
  adminRecentUpdates: ["api", "admin", "recent-updates"] as const,
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
  publicContent: (slug: string) => ["api", "content", slug] as const,
  publicPageBanner: (slug: string) => ["api", "banners", slug] as const,
  adminPageBanners: ["api", "admin", "banners"] as const,
  publicSettings: ["api", "settings"] as const,
  publicNavigation: ["api", "navigation"] as const,
  adminNavigation: ["api", "admin", "navigation"] as const,
  adminSettings: ["api", "admin", "settings"] as const,
  socialPlatforms: ["api", "social", "platforms"] as const,
  socialPosts: ["api", "social", "posts"] as const,
  adminSocialAccounts: ["api", "admin", "social", "accounts"] as const,
  adminSocialPosts: ["api", "admin", "social", "posts"] as const,
  adminSocialSyncLogs: ["api", "admin", "social", "sync-logs"] as const,
  adminResidentTeachers: ["api", "admin", "resident-teachers"] as const,
  adminResidentBestPractices: ["api", "admin", "resident-best-practices"] as const,
  publicResidentTeachers: ["api", "resident-teachers"] as const,
  publicResidentTeacher: ["api", "resident-teacher"] as const,
  publicResidentBestPractices: ["api", "resident-best-practices"] as const,
  adminUserStats: ["api", "admin", "user-stats"] as const,
  adminActivityLogs: ["api", "admin", "activity-logs"] as const,
  adminNotifications: ["api", "admin", "notifications"] as const,
  adminContactMessages: ["api", "admin", "contact-messages"] as const,
  adminAnalytics: ["api", "admin", "analytics"] as const,
};

function getApiBaseUrl(): string {
  const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  return envApiBaseUrl
    ? (envApiBaseUrl.endsWith("/") ? envApiBaseUrl : `${envApiBaseUrl}/`)
    : (window.__PTRP_CONFIG__?.apiBaseUrl ?? window.__MANUS_CONFIG__?.apiBaseUrl ?? `${import.meta.env.BASE_URL}api/`);
}

export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const uploadPath = url.match(/(?:^|\/)uploads\/([^?#]*)([?#].*)?$/i);
  if (uploadPath) {
    const apiOrigin = new URL(getApiBaseUrl(), window.location.href).origin;
    return new URL(`/uploads/${uploadPath[1]}${uploadPath[2] ?? ""}`, apiOrigin).href;
  }
  return url;
}

export async function apiRequest<T>(
  path: string,
  options: Omit<RequestInit, "body"> & { body?: unknown } = {},
): Promise<T> {
  const { body, headers, ...requestOptions } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const apiBaseUrl = getApiBaseUrl();
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...requestOptions,
      credentials: "include",
      headers: {
        ...(body !== undefined && !isFormData ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : isFormData || typeof body === "string" ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("PTRP services are temporarily unreachable. Please try again later.", 0);
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status >= 500) {
      throw new ApiError(
        response.status === 503
          ? "PTRP services are temporarily unavailable. Please try again later."
          : "The request could not be completed. Please try again later.",
        response.status,
      );
    }
    throw new ApiError(payload?.error || `Request failed (${response.status})`, response.status);
  }
  return payload as T;
}

export function useApiQuery<T>(key: readonly unknown[], path: string, enabled = true) {
  return useQuery<T>({ queryKey: key, queryFn: () => apiRequest<T>(path), enabled });
}
import { useAuth } from "@/_core/hooks/useAuth";
import { apiRequest, queryKeys, resolveMediaUrl, useApiQuery } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Archive, ArrowDown, ArrowUp, BarChart3, Bell, BookOpen, Building2, CheckCircle2, Copy, FileText, GraduationCap, Mail, MailOpen,
  ImagePlus, LayoutDashboard, Loader2, LogOut, Pencil, Plus, School, ShieldCheck,
  Trash2, UploadCloud, UserCog, UsersRound, X, KeyRound, AlertCircle, GripVertical,
  RefreshCw,
  Smartphone,
  UserRound,
  Briefcase,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SocialManager } from "./SocialManager";
import { CmsPageRenderer, parseCmsPageLayout, type CmsPageSection } from "@/components/ptrp/CmsPageRenderer";
import { BannerImage } from "@/components/ptrp/BannerImage";
import { residentTeacherPhotoUrl } from "@/data/ptrp";

type AdminTab =
  | "overview" | "content" | "banners" | "uploads" | "users"
  | "schools" | "teachers" | "alumni" | "news" | "gallery" | "practices"
  | "social" | "coordinators" | "mentors" | "resident-teachers" | "resident-best-practices"
  | "navigation" | "settings" | "notifications" | "contact-messages" | "analytics";

const starterPages = [
  { slug: "home", title: "PTR Alumni Network home", summary: "Hero, program snapshot, and homepage narrative", body: "Keep this record for the public homepage." },
  { slug: "about", title: "About PTR Alumni Network", summary: "Program background, mission, values, and approach", body: "Add the verified program background here." },
  { slug: "network", title: "Our Network", summary: "Resident teachers and model schools", body: "Add approved network details here." },
  { slug: "impact", title: "Impact and evidence", summary: "Verified indicators and demonstrated outcomes", body: "Only publish verified indicators, reporting dates, sources, and evidence-aware outcome language here." },
];

const cmsPageCatalog = [
  { slug: "home", label: "Homepage", title: "Celebrating Excellence in Teacher Education" },
  { slug: "about", label: "About", title: "About the Program" },
  { slug: "network", label: "Model schools", title: "Our 17 model schools" },
  { slug: "impact", label: "Impact", title: "From Residents to Education Leaders" },
  { slug: "news", label: "News", title: "What We Are Doing" },
  { slug: "gallery", label: "Gallery", title: "Our Journey in Pictures and Videos" },
  { slug: "alumni", label: "Alumni", title: "Meet Our Alumni" },
  { slug: "resources", label: "Resources", title: "Learn, Teach, Share" },
  { slug: "partners", label: "Partners", title: "Together, We Make Teachers Matter" },
  { slug: "contact", label: "Contact", title: "Join the PTR Alumni Network" },
  { slug: "team", label: "Program team", title: "PTRP Program Coordinators & Mentors" },
  { slug: "residents", label: "Resident teachers", title: "Resident Teachers" },
  { slug: "register-resident", label: "Resident registration", title: "Register as a Resident Teacher" },
];

const bannerCatalog = [
  { slug: "home", label: "Homepage", imageUrl: "gallery/gallery-07.jpg" },
  { slug: "about", label: "About", imageUrl: "gallery/gallery-01.jpg" },
  { slug: "network", label: "Model schools", imageUrl: "gallery/gallery-07.jpg" },
  { slug: "impact", label: "Impact", imageUrl: "gallery/gallery-05.jpg" },
  { slug: "news", label: "News", imageUrl: "manus-storage/ptrp-residents-2.jpg" },
  { slug: "gallery", label: "Gallery", imageUrl: "gallery/gallery-04.jpg" },
  { slug: "alumni", label: "Alumni", imageUrl: "gallery/gallery-02.jpg" },
  { slug: "resources", label: "Resources", imageUrl: "gallery/gallery-03.jpg" },
  { slug: "partners", label: "Partners", imageUrl: "manus-storage/ptrp-pilot-launch.jpg" },
  { slug: "contact", label: "Contact", imageUrl: "gallery/gallery-06.jpg" },
  { slug: "team", label: "Program team", imageUrl: "gallery/gallery-05.jpg" },
  { slug: "residents", label: "Resident teachers", imageUrl: "gallery/gallery-08.jpg" },
  { slug: "register-resident", label: "Resident registration", imageUrl: "gallery/gallery-03.jpg" },
];

const emptyCmsLayout = JSON.stringify({
  eyebrow: "PTR Alumni Network",
  heroImage: "",
  heroImageAlt: "",
  sections: [
    { type: "text", title: "Welcome", body: "Add approved page content here." },
  ],
}, null, 2);

function AdminLoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError("Please enter your username or email and password.");
      return;
    }
    setLoading(true);
    try {
      const u = await login({ username, password });
      if (u.role === "admin") {
        toast.success("Administrator session verified.");
      } else if (u.role === "editor") {
        toast.success("Content editor session verified.");
      } else {
        setError("Your account is authenticated, but does not have content editor or administrator privileges.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate administrator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-access">
      <div className="admin-access-card" style={{ maxWidth: 440 }}>
        <div className="admin-brand-mark" style={{ margin: "0 auto 1rem" }}>P</div>
        <h1>PTRP Admin Portal</h1>
        <p className="admin-access-subtitle">Secure workspace for PTR Alumni Network content and administration.</p>

        {error && (
          <div style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca", padding: "0.75rem", borderRadius: "8px", fontSize: "0.8rem", marginBottom: "1rem", textAlign: "left" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem", textAlign: "left" }}>
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#4b5563", display: "block", marginBottom: "0.3rem" }}>
              Username or Email
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Residents teachers"
              autoComplete="username"
              style={{ width: "100%", padding: "0.65rem 0.85rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", color: "#111" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#4b5563", display: "block", marginBottom: "0.3rem" }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              style={{ width: "100%", padding: "0.65rem 0.85rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", color: "#111" }}
            />
          </div>

          <button type="submit" disabled={loading} className="button-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
            {loading ? "Authenticating…" : "Sign In to Admin Portal"} <ShieldCheck className="size-4" />
          </button>
        </form>

        <p className="admin-muted" style={{ marginTop: "1.25rem", fontSize: "0.75rem" }}>
          This workspace is restricted to authorized content editors and administrators. Administrative operations are protected.
        </p>
        <div style={{ marginTop: "1rem" }}>
          <a href="/" style={{ color: "#0098d9", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none" }}>
            ← Return to public site
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [editing, setEditing] = useState<number | null>(null);
  const [contentForm, setContentForm] = useState({ slug: "", title: "", summary: "", body: "", status: "draft" as "draft" | "published" });
  const [uploadAlt, setUploadAlt] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const isAdmin = user?.role === "admin";
  const isEditor = user?.role === "editor";
  const canManageContent = isAdmin || isEditor;
  const queryClient = useQueryClient();

  useEffect(() => {
    setTab(isAdmin ? "overview" : "content");
  }, [isAdmin]);

  const overview = useApiQuery<any>(queryKeys.adminOverview, "admin/overview", isAdmin);
  const recentUpdates = useApiQuery<any[]>(queryKeys.adminRecentUpdates, "admin/recent-updates", isAdmin);
  const content = useApiQuery<any[]>(queryKeys.adminContent, "admin/content", canManageContent);
  const pageBanners = useApiQuery<any[]>(queryKeys.adminPageBanners, "admin/banners", canManageContent);
  const media = useApiQuery<any[]>(queryKeys.adminMedia, "admin/media", canManageContent);
  const notifications = useApiQuery<any[]>(queryKeys.adminNotifications, "admin/notifications", isAdmin);
  const contactMessages = useApiQuery<any[]>(queryKeys.adminContactMessages, "admin/contact-messages", isAdmin);
  const analytics = useApiQuery<any>(queryKeys.adminAnalytics, "admin/analytics", isAdmin);

  const markNotificationRead = useMutation({ mutationFn: (id: number) => apiRequest(`admin/notifications/${id}/read`, { method: "PATCH" }), onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: queryKeys.adminNotifications }); }, onError: (error: Error) => toast.error(error.message) });
  const markAllNotificationsRead = useMutation({ mutationFn: () => apiRequest("admin/notifications/read-all", { method: "POST" }), onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: queryKeys.adminNotifications }); }, onError: (error: Error) => toast.error(error.message) });
  const markContactMessageRead = useMutation({ mutationFn: (id: number) => apiRequest(`admin/contact-messages/${id}/read`, { method: "PATCH" }), onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: queryKeys.adminContactMessages }); }, onError: (error: Error) => toast.error(error.message) });
  const retryContactMessage = useMutation({ mutationFn: (id: number) => apiRequest<{ deliveryStatus: string; message: string }>(`admin/contact-messages/${id}/retry`, { method: "POST" }), onSuccess: async (result) => { (result.deliveryStatus === "sent" ? toast.success : toast.error)(result.message); await queryClient.invalidateQueries({ queryKey: queryKeys.adminContactMessages }); }, onError: (error: Error) => toast.error(error.message) });
  const deleteContactMessage = useMutation({ mutationFn: (id: number) => apiRequest(`admin/contact-messages/${id}`, { method: "DELETE" }), onSuccess: async () => { toast.success("Contact message deleted"); await queryClient.invalidateQueries({ queryKey: queryKeys.adminContactMessages }); }, onError: (error: Error) => toast.error(error.message) });
  const users = useApiQuery<any[]>(queryKeys.adminUsers, "admin/users", isAdmin);
  const schools = useApiQuery<any[]>(queryKeys.adminSchools, "admin/schools", isAdmin);
  const teachers = useApiQuery<any[]>(queryKeys.adminTeachers, "admin/teachers", isAdmin);
  const alumni = useApiQuery<any[]>(queryKeys.adminAlumni, "admin/alumni", isAdmin);
  const news = useApiQuery<any[]>(queryKeys.adminNews, "admin/news", isAdmin);
  const gallery = useApiQuery<any[]>(queryKeys.adminGallery, "admin/gallery", isAdmin);
  const practices = useApiQuery<any[]>(queryKeys.adminPractices, "admin/best-practices", isAdmin);
  const socialAccounts = useApiQuery<any[]>(queryKeys.adminSocialAccounts, "admin/social/accounts", isAdmin);
  const socialPosts = useApiQuery<any[]>(queryKeys.adminSocialPosts, "admin/social/posts?status=pending", isAdmin);
  const socialSyncLogs = useApiQuery<any[]>(queryKeys.adminSocialSyncLogs, "admin/social/sync-logs", isAdmin);
  const coordinators = useApiQuery<any[]>(queryKeys.adminCoordinators, "admin/coordinators", isAdmin);
  const mentors = useApiQuery<any[]>(queryKeys.adminMentors, "admin/mentors", isAdmin);
  const residentTeachers = useApiQuery<any[]>(queryKeys.adminResidentTeachers, "admin/resident-teachers", isAdmin);
  const residentBestPractices = useApiQuery<any[]>(queryKeys.adminResidentBestPractices, "admin/resident-best-practices", isAdmin);
  const navigation = useApiQuery<any[]>(queryKeys.adminNavigation, "admin/navigation", canManageContent);
  const settings = useApiQuery<any[]>(queryKeys.adminSettings, "admin/settings", isAdmin);
  const userStats = useApiQuery<any>(queryKeys.adminUserStats, "admin/users/stats", isAdmin);
  const activityLogs = useApiQuery<any[]>(queryKeys.adminActivityLogs, "admin/activity-logs", isAdmin);

  const saveContent = useMutation({ mutationFn: (input: typeof contentForm) => apiRequest("admin/content", { method: "POST", body: input }), onSuccess: async (_data, input) => { toast.success("Page content saved"); setEditing(null); setContentForm({ slug: "", title: "", summary: "", body: "", status: "draft" }); await queryClient.invalidateQueries({ queryKey: queryKeys.adminContent }); await queryClient.invalidateQueries({ queryKey: queryKeys.adminOverview }); await queryClient.invalidateQueries({ queryKey: queryKeys.publicContent(input.slug) }); }, onError: (error: Error) => toast.error(error.message) });

  const deleteContent = useMutation({
    mutationFn: (row: { id: number; slug: string }) => apiRequest(`admin/content/${row.id}`, { method: "DELETE" }),
    onSuccess: async (_data, row) => {
      toast.success("Page override deleted");
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminContent });
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminOverview });
      await queryClient.invalidateQueries({ queryKey: queryKeys.publicContent(row.slug) });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const saveBanner = useMutation({
    mutationFn: (input: Record<string, unknown>) => apiRequest("admin/banners", { method: "POST", body: input }),
    onSuccess: async (_data, input) => {
      const slug = String(input.slug);
      toast.success("Page banner saved");
      await invalidate(queryKeys.adminPageBanners);
      await invalidate(queryKeys.publicPageBanner(slug));
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteBanner = useMutation({
    mutationFn: (slug: string) => apiRequest(`admin/banners/${slug}`, { method: "DELETE" }),
    onSuccess: async (_data, slug) => {
      toast.success("Page banner reset to its PTRP default");
      await invalidate(queryKeys.adminPageBanners);
      await invalidate(queryKeys.publicPageBanner(slug));
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const saveNavigation = useMutation({
    mutationFn: (input: Record<string, unknown>) => apiRequest("admin/navigation", { method: "POST", body: input }),
    onSuccess: async () => {
      toast.success("Navigation item saved");
      await invalidate(queryKeys.adminNavigation);
      await invalidate(queryKeys.publicNavigation);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const saveSetting = useMutation({
    mutationFn: (input: { settingKey: string; settingValue: string }) => apiRequest("admin/settings", { method: "POST", body: input }),
    onSuccess: async () => {
      toast.success("Website setting saved");
      await invalidate(queryKeys.adminSettings);
      await invalidate(queryKeys.publicSettings);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const uploadMedia = useMutation({ mutationFn: (input: { filename: string; mimeType: string; size: number; base64: string; altText: string | null }) => apiRequest("admin/media/upload", { method: "POST", body: input }), onSuccess: async () => { toast.success("Upload added to the media library"); setUploadAlt(""); if (fileRef.current) fileRef.current.value = ""; await queryClient.invalidateQueries({ queryKey: queryKeys.adminMedia }); await queryClient.invalidateQueries({ queryKey: queryKeys.adminOverview }); }, onError: (error: Error) => toast.error(error.message) });

  const updateMedia = useMutation({ mutationFn: (input: { id: number; altText?: string | null; status?: "pending" | "approved" | "archived" }) => apiRequest(`admin/media/${input.id}`, { method: "PUT", body: { altText: input.altText, status: input.status } }), onSuccess: async () => { toast.success("Media status updated"); await queryClient.invalidateQueries({ queryKey: queryKeys.adminMedia }); }, onError: (error: Error) => toast.error(error.message) });

  const setRole = useMutation({ mutationFn: (input: { id: number; role: "user" | "editor" | "admin" }) => apiRequest(`admin/users/${input.id}/role`, { method: "PATCH", body: { role: input.role } }), onSuccess: async () => { toast.success("Role updated"); await invalidate(queryKeys.adminUsers); await invalidate(queryKeys.adminUserStats); }, onError: (error: Error) => toast.error(error.message) });

  const setUserStatus = useMutation({ mutationFn: (input: { id: number; account_status: "active" | "inactive" }) => apiRequest(`admin/users/${input.id}/status`, { method: "PATCH", body: { account_status: input.account_status } }), onSuccess: async () => { toast.success("Account status updated"); await invalidate(queryKeys.adminUsers); await invalidate(queryKeys.adminUserStats); }, onError: (error: Error) => toast.error(error.message) });

  const updateUser = useMutation({ mutationFn: (input: { id: number; name?: string; email?: string; role?: "user" | "editor" | "admin"; account_type?: "public" | "resident_teacher" | "admin"; account_status?: "active" | "inactive" }) => apiRequest(`admin/users/${input.id}`, { method: "PATCH", body: input }), onSuccess: async () => { toast.success("Account updated"); await invalidate(queryKeys.adminUsers); await invalidate(queryKeys.adminUserStats); }, onError: (error: Error) => toast.error(error.message) });

  const createUser = useMutation({ mutationFn: (input: { name: string; email: string; password: string; role: "user" | "editor" | "admin"; account_type: "public" | "resident_teacher" | "admin"; account_status: "active" | "inactive" }) => apiRequest("admin/users", { method: "POST", body: input }), onSuccess: async () => { toast.success("User created successfully"); await invalidate(queryKeys.adminUsers); await invalidate(queryKeys.adminUserStats); }, onError: (error: Error) => toast.error(error.message || "Failed to create user") });

  const deleteUser = useMutation({ mutationFn: (id: number) => apiRequest(`admin/users/${id}`, { method: "DELETE" }), onSuccess: async () => { toast.success("Account deleted"); await invalidate(queryKeys.adminUsers); await invalidate(queryKeys.adminUserStats); await invalidate(queryKeys.adminActivityLogs); }, onError: (error: Error) => toast.error(error.message) });

  const connectAccount = useMutation({
    mutationFn: (input: { platform: string; accountId: string; accountName: string; pageId?: string; accessToken: string; refreshToken?: string; tokenExpiresAt?: string }) =>
      apiRequest("admin/social/accounts", { method: "POST", body: input }),
    onSuccess: async () => { toast.success("Social account connected"); await invalidate(queryKeys.adminSocialAccounts); await invalidate(queryKeys.adminOverview); },
    onError: (error: Error) => toast.error(error.message),
  });

  const disconnectAccount = useMutation({
    mutationFn: (id: number) => apiRequest(`admin/social/accounts/${id}`, { method: "DELETE" }),
    onSuccess: async () => { toast.success("Social account disconnected"); await invalidate(queryKeys.adminSocialAccounts); await invalidate(queryKeys.adminOverview); },
    onError: (error: Error) => toast.error(error.message),
  });

  const moderatePost = useMutation({
    mutationFn: (input: { id: number; action: "approve" | "reject" | "archive" }) =>
      apiRequest(`admin/social/posts/${input.id}/${input.action}`, { method: "POST" }),
    onSuccess: async () => { toast.success("Post updated"); await invalidate(queryKeys.adminSocialPosts); await invalidate(queryKeys.adminOverview); },
    onError: (error: Error) => toast.error(error.message),
  });

  const publishPost = useMutation({
    mutationFn: (input: { id: number; section: "gallery" | "news" | "videos" | "homepage" }) =>
      apiRequest(`admin/social/posts/${input.id}/publish`, { method: "POST", body: { section: input.section } }),
    onSuccess: async () => { toast.success("Post published to website"); await invalidate(queryKeys.adminSocialPosts); await invalidate(queryKeys.adminOverview); },
    onError: (error: Error) => toast.error(error.message),
  });

  const syncAccounts = useMutation({
    mutationFn: (accountId?: number) => apiRequest("admin/social/sync", { method: "POST", body: accountId ? { accountId } : {} }),
    onSuccess: async (result: any) => {
      const imported = result.results?.reduce((sum: number, r: any) => sum + (r.imported || 0), 0) || 0;
      toast.success(`Sync complete — ${imported} new post(s) imported`);
      await invalidate(queryKeys.adminSocialPosts);
      await invalidate(queryKeys.adminSocialSyncLogs);
      await invalidate(queryKeys.adminSocialAccounts);
      await invalidate(queryKeys.adminOverview);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const contentRows = useMemo(() => content.data ?? [], [content.data]);
  const pageBannerRows = useMemo(() => pageBanners.data ?? [], [pageBanners.data]);
  const mediaRows = useMemo(() => media.data ?? [], [media.data]);
  const userRows = useMemo(() => users.data ?? [], [users.data]);
  const schoolRows = useMemo(() => schools.data ?? [], [schools.data]);
  const teacherRows = useMemo(() => teachers.data ?? [], [teachers.data]);
  const alumniRows = useMemo(() => alumni.data ?? [], [alumni.data]);
  const newsRows = useMemo(() => news.data ?? [], [news.data]);
  const galleryRows = useMemo(() => gallery.data ?? [], [gallery.data]);
  const practiceRows = useMemo(() => practices.data ?? [], [practices.data]);
  const socialAccountRows = useMemo(() => socialAccounts.data ?? [], [socialAccounts.data]);
  const socialPostRows = useMemo(() => socialPosts.data ?? [], [socialPosts.data]);
  const socialSyncLogRows = useMemo(() => socialSyncLogs.data ?? [], [socialSyncLogs.data]);
  const coordinatorRows = useMemo(() => coordinators.data ?? [], [coordinators.data]);
  const mentorRows = useMemo(() => mentors.data ?? [], [mentors.data]);
  const residentTeacherRows = useMemo(() => residentTeachers.data ?? [], [residentTeachers.data]);
  const residentBestPracticeRows = useMemo(() => residentBestPractices.data ?? [], [residentBestPractices.data]);
  const navigationRows = useMemo(() => navigation.data ?? [], [navigation.data]);
  const settingRows = useMemo(() => settings.data ?? [], [settings.data]);

  const invalidate = (key: readonly unknown[]) => queryClient.invalidateQueries({ queryKey: key });

  const makeDelete = (path: string, key: readonly unknown[]) => useMutation({
    mutationFn: (id: number) => apiRequest(`${path}/${id}`, { method: "DELETE" }),
    onSuccess: async () => { toast.success("Deleted"); await invalidate(key); await invalidate(queryKeys.adminOverview); },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteSchool = makeDelete("admin/schools", queryKeys.adminSchools);
  const deleteTeacher = makeDelete("admin/teachers", queryKeys.adminTeachers);
  const deleteAlumni = makeDelete("admin/alumni", queryKeys.adminAlumni);
  const deleteNews = makeDelete("admin/news", queryKeys.adminNews);
  const deleteGallery = makeDelete("admin/gallery", queryKeys.adminGallery);
  const deletePractice = makeDelete("admin/best-practices", queryKeys.adminPractices);
  const deleteCoordinator = makeDelete("admin/coordinators", queryKeys.adminCoordinators);
  const deleteMentor = makeDelete("admin/mentors", queryKeys.adminMentors);
  const deleteResidentTeacher = makeDelete("admin/resident-teachers", queryKeys.adminResidentTeachers);
  const deleteResidentBestPractice = makeDelete("admin/resident-best-practices", queryKeys.adminResidentBestPractices);
  const deleteNavigation = makeDelete("admin/navigation", queryKeys.adminNavigation);
  const deleteSetting = useMutation({
    mutationFn: (settingKey: string) => apiRequest(`admin/settings/${encodeURIComponent(settingKey)}`, { method: "DELETE" }),
    onSuccess: async () => {
      toast.success("Website setting deleted");
      await invalidate(queryKeys.adminSettings);
      await invalidate(queryKeys.publicSettings);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const setResidentTeacherStatus = useMutation({
    mutationFn: (input: { id: number; status: string; isFeatured?: boolean; displayOrder?: number }) =>
      apiRequest(`admin/resident-teachers/${input.id}/status`, { method: "PATCH", body: { status: input.status, isFeatured: input.isFeatured, displayOrder: input.displayOrder } }),
    onSuccess: async () => { toast.success("Teacher status updated"); await invalidate(queryKeys.adminResidentTeachers); await invalidate(queryKeys.adminResidentBestPractices); },
    onError: (error: Error) => toast.error(error.message),
  });

  const saveResidentTeacher = useMutation({
    mutationFn: (input: any) => apiRequest("admin/resident-teachers", { method: "POST", body: input }),
    onSuccess: async () => { toast.success("Resident teacher saved"); await invalidate(queryKeys.adminResidentTeachers); },
    onError: (error: Error) => toast.error(error.message),
  });

  const saveResidentBestPractice = useMutation({
    mutationFn: (input: any) => apiRequest("admin/resident-best-practices", { method: "POST", body: input }),
    onSuccess: async () => { toast.success("Best practice saved"); await invalidate(queryKeys.adminResidentBestPractices); await invalidate(queryKeys.adminResidentTeachers); },
    onError: (error: Error) => toast.error(error.message),
  });

  if (authLoading) return <div className="admin-loading"><Loader2 className="size-6 animate-spin" /> Checking administrator access…</div>;
  if (!user) return <AdminLoginForm />;
  if (!canManageContent) return (
    <div className="admin-access">
      <div className="admin-access-card" style={{ maxWidth: 440 }}>
        <ShieldCheck className="size-10 text-[#e6a24b]" style={{ margin: "0 auto 1rem" }} />
        <h1>Admin access required</h1>
        <p className="admin-access-subtitle">Your account is signed in as <strong>{user.email}</strong>, but does not have administrator or editor access.</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.5rem" }}>
          <button className="button-secondary" onClick={() => logout()}>Sign out</button>
          <button className="button-primary" onClick={() => window.location.href = "/"}><LogOut className="size-4" /> Return to site</button>
        </div>
      </div>
    </div>
  );

  const openEditor = (row?: typeof contentRows[number] | typeof cmsPageCatalog[number]) => {
    if (row && "id" in row) {
      setEditing(row.id);
      setContentForm({ slug: row.slug, title: row.title, summary: row.summary ?? "", body: row.body, status: row.status });
    } else if (row) {
      setEditing(0);
      setContentForm({ slug: row.slug, title: row.title, summary: "", body: emptyCmsLayout, status: "draft" });
    } else {
      setEditing(0);
      setContentForm({ slug: "", title: "", summary: "", body: emptyCmsLayout, status: "draft" });
    }
    setTab("content");
  };

  const uploadFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) { toast.error("Uploads are limited to 10 MB"); return; }
    const base64 = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1] ?? ""); reader.onerror = reject; reader.readAsDataURL(file); });
    uploadMedia.mutate({ filename: file.name, mimeType: file.type || "application/octet-stream", size: file.size, base64, altText: uploadAlt || null });
  };

  const navItems: { id: AdminTab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "content", label: "Website content", icon: FileText },
    { id: "banners", label: "Page banners", icon: ImagePlus },
    { id: "uploads", label: "Media uploads", icon: ImagePlus },
    { id: "schools", label: "Schools", icon: School },
    { id: "teachers", label: "Teacher applications", icon: GraduationCap },
    { id: "alumni", label: "Alumni", icon: UsersRound },
    { id: "news", label: "News & events", icon: BookOpen },
    { id: "gallery", label: "Gallery", icon: ImagePlus },
    { id: "practices", label: "Best practices", icon: Archive },
    { id: "social", label: "Social Media", icon: Smartphone },
    { id: "coordinators", label: "Coordinators", icon: Building2 },
    { id: "mentors", label: "Mentors", icon: UserRound },
    { id: "resident-teachers", label: "Resident Teachers", icon: UsersRound },
    { id: "resident-best-practices", label: "Best Practices", icon: Briefcase },
    { id: "navigation", label: "Navigation", icon: FileText },
    { id: "settings", label: "Website settings", icon: Building2 },
    { id: "users", label: "Access and roles", icon: UserCog },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "contact-messages", label: "Contact messages", icon: Mail },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const tabAccess: Record<AdminTab, boolean> = {
    overview: isAdmin,
    content: canManageContent,
    banners: canManageContent,
    uploads: canManageContent,
    navigation: canManageContent,
    schools: isAdmin,
    teachers: isAdmin,
    alumni: isAdmin,
    news: isAdmin,
    gallery: isAdmin,
    practices: isAdmin,
    social: isAdmin,
    coordinators: isAdmin,
    mentors: isAdmin,
    "resident-teachers": isAdmin,
    "resident-best-practices": isAdmin,
    settings: isAdmin,
    users: isAdmin,
    notifications: isAdmin,
    "contact-messages": isAdmin,
    analytics: isAdmin,
  };

  const visibleNavItems = navItems.filter((item) => tabAccess[item.id]);

  return (
    <main className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-brand"><div className="admin-brand-mark">P</div><div><strong>PTR Alumni Network Control</strong><span>Alumni Network</span></div></div>
        <div className="admin-role"><ShieldCheck className="size-4" /><span>{isAdmin ? "Administrator workspace" : "Content editor workspace"}</span></div>
        <nav className="admin-nav" aria-label="Admin sections">
          {visibleNavItems.map((item) => <button key={item.id} className={tab === item.id ? "admin-nav-active" : ""} onClick={() => setTab(item.id)}><item.icon className="size-4" />{item.label}</button>)}
        </nav>
        <div className="admin-sidebar-bottom"><a href="/" className="admin-back-link">View public site ↗</a><button className="admin-signout" onClick={() => logout()}><LogOut className="size-4" /> Sign out</button></div>
      </aside>
      <section className="admin-main">
        <header className="admin-header">
          <div>
            <p className="eyebrow text-[#168d6d]">Protected administration</p>
            <h1>{tab === "overview" ? "Keep every public surface trustworthy." : tab === "content" ? "Edit website content" : tab === "banners" ? "Manage page image banners" : tab === "uploads" ? "Manage media uploads" : tab === "schools" ? "Manage model schools" : tab === "teachers" ? "Manage teacher applications" : tab === "alumni" ? "Manage alumni" : tab === "news" ? "Manage news and events" : tab === "gallery" ? "Manage gallery" : tab === "practices" ? "Manage best practices" : tab === "social" ? "Social Media Integration" : tab === "coordinators" ? "Program Coordinators" : tab === "mentors" ? "Program Mentors" : tab === "resident-teachers" ? "Resident Teachers" : tab === "resident-best-practices" ? "Best Practices" : tab === "navigation" ? "Manage website navigation" : tab === "settings" ? "Website identity and contact settings" : tab === "notifications" ? "Admin notifications" : tab === "contact-messages" ? "Contact message inbox" : tab === "analytics" ? "Website analytics" : "Access and roles"}</h1>
            <p>Signed in as <strong>{user.name || user.email || (isAdmin ? "Administrator" : "Content editor")}</strong>. Editors manage pages, banners, media, and navigation; administrator-only modules remain restricted.</p>
          </div>
          <div className="admin-header-actions"><span className="admin-user-pill"><span className="admin-online-dot" /> {isAdmin ? "Admin" : "Editor"}</span><button className="admin-icon-button" onClick={() => window.location.href = "/"} aria-label="Close admin workspace"><X className="size-4" /></button></div>
        </header>

        {tab === "overview" && <OverviewPanel stats={overview.data} recentUpdates={recentUpdates.data ?? []} onNavigate={setTab} onSeedHome={openEditor} />}
        {tab === "content" && <ContentManager rows={contentRows} editing={editing} form={contentForm} setForm={setContentForm} onSave={() => saveContent.mutate(contentForm)} saving={saveContent.isPending} onOpenEditor={openEditor} onCancel={() => setEditing(null)} onDelete={(row: any) => { if (window.confirm(`Delete the ${row.slug} page override? The bundled page will be shown again.`)) deleteContent.mutate({ id: row.id, slug: row.slug }); }} deleting={deleteContent.isPending} pageCatalog={cmsPageCatalog} />}
        {tab === "banners" && <BannerManager rows={pageBannerRows} onSave={saveBanner.mutate} saving={saveBanner.isPending} onDelete={(slug: string) => { if (window.confirm("Reset this page banner to its bundled PTRP image and text?")) deleteBanner.mutate(slug); }} deleting={deleteBanner.isPending} />}
        {tab === "uploads" && <UploadManager rows={mediaRows} altText={uploadAlt} setAltText={setUploadAlt} fileRef={fileRef} onFile={uploadFile} uploading={uploadMedia.isPending} onArchive={(id: number) => updateMedia.mutate({ id, status: "archived" })} />}
        {tab === "users" && <UsersManager rows={userRows} stats={userStats.data} logs={activityLogs.data ?? []} onRole={(id: number, role: "user" | "editor" | "admin") => setRole.mutate({ id, role })} onSetStatus={(id: number, status: "active" | "inactive") => setUserStatus.mutate({ id, account_status: status })} onUpdate={(id: number, data: any) => updateUser.mutate({ id, ...data })} onCreate={(data: any) => createUser.mutate(data)} onDelete={(id: number) => { if (window.confirm("Are you sure you want to remove this account?")) { deleteUser.mutate(id); } }} changing={setRole.isPending || setUserStatus.isPending || updateUser.isPending || createUser.isPending} onRefresh={() => { queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers }); queryClient.invalidateQueries({ queryKey: queryKeys.adminUserStats }); queryClient.invalidateQueries({ queryKey: queryKeys.adminActivityLogs }); }} />}
        {tab === "schools" && <SchoolsManager rows={schoolRows} onDelete={(id: number) => deleteSchool.mutate(id)} onRefresh={() => queryClient.invalidateQueries({ queryKey: queryKeys.adminSchools })} />}
        {tab === "teachers" && <TeachersManager rows={teacherRows} schools={schoolRows} onDelete={(id: number) => deleteTeacher.mutate(id)} onRefresh={() => queryClient.invalidateQueries({ queryKey: queryKeys.adminTeachers })} />}
        {tab === "alumni" && <AlumniManager rows={alumniRows} schools={schoolRows} onDelete={(id: number) => deleteAlumni.mutate(id)} onRefresh={() => queryClient.invalidateQueries({ queryKey: queryKeys.adminAlumni })} />}
        {tab === "news" && <NewsManager rows={newsRows} onDelete={(id: number) => deleteNews.mutate(id)} onRefresh={() => queryClient.invalidateQueries({ queryKey: queryKeys.adminNews })} />}
        {tab === "gallery" && <GalleryManager rows={galleryRows} onDelete={(id: number) => deleteGallery.mutate(id)} onRefresh={() => queryClient.invalidateQueries({ queryKey: queryKeys.adminGallery })} />}
        {tab === "practices" && <PracticesManager rows={practiceRows} onDelete={(id: number) => deletePractice.mutate(id)} onRefresh={() => queryClient.invalidateQueries({ queryKey: queryKeys.adminPractices })} />}
        {tab === "social" && <SocialManager accounts={socialAccountRows} posts={socialPostRows} syncLogs={socialSyncLogRows} onConnect={connectAccount.mutate} onDisconnect={disconnectAccount.mutate} onModerate={moderatePost.mutate} onPublish={publishPost.mutate} onSync={syncAccounts.mutate} connecting={connectAccount.isPending} syncing={syncAccounts.isPending} moderating={moderatePost.isPending} publishing={publishPost.isPending} onRefresh={() => { invalidate(queryKeys.adminSocialAccounts); invalidate(queryKeys.adminSocialPosts); invalidate(queryKeys.adminSocialSyncLogs); }} />}
        {tab === "coordinators" && <TeamManager rows={coordinatorRows} role="coordinator" onDelete={(id: number) => deleteCoordinator.mutate(id)} onRefresh={() => queryClient.invalidateQueries({ queryKey: queryKeys.adminCoordinators })} />}
        {tab === "mentors" && <TeamManager rows={mentorRows} role="mentor" onDelete={(id: number) => deleteMentor.mutate(id)} onRefresh={() => queryClient.invalidateQueries({ queryKey: queryKeys.adminMentors })} />}
        {tab === "resident-teachers" && <ResidentTeachersManager rows={residentTeacherRows} onSave={saveResidentTeacher.mutate} onSetStatus={setResidentTeacherStatus.mutate} onDelete={deleteResidentTeacher.mutate} onRefresh={() => queryClient.invalidateQueries({ queryKey: queryKeys.adminResidentTeachers })} saving={saveResidentTeacher.isPending || setResidentTeacherStatus.isPending} />}
        {tab === "resident-best-practices" && <ResidentBestPracticesManager rows={residentBestPracticeRows} teachers={residentTeacherRows} onSave={saveResidentBestPractice.mutate} onDelete={deleteResidentBestPractice.mutate} onRefresh={() => queryClient.invalidateQueries({ queryKey: queryKeys.adminResidentBestPractices })} saving={saveResidentBestPractice.isPending} />}
        {tab === "navigation" && <NavigationManager rows={navigationRows} onSave={saveNavigation.mutate} onDelete={(id: number) => { if (window.confirm("Delete this navigation item and its dropdown items?")) deleteNavigation.mutate(id); }} saving={saveNavigation.isPending} />}
        {tab === "settings" && <WebsiteSettingsManager rows={settingRows} onSave={saveSetting.mutate} onDelete={(key: string) => { if (window.confirm(`Delete the ${key} setting?`)) deleteSetting.mutate(key); }} saving={saveSetting.isPending} />}
        {tab === "notifications" && tabAccess.notifications && <NotificationsPanel notifications={notifications.data ?? []} onRead={(id: number) => markNotificationRead.mutate(id)} onReadAll={() => markAllNotificationsRead.mutate()} marking={markAllNotificationsRead.isPending} markingRead={markNotificationRead.isPending} />}
        {tab === "contact-messages" && tabAccess["contact-messages"] && <ContactMessagesPanel messages={contactMessages.data ?? []} loading={contactMessages.isLoading} error={contactMessages.error} onRead={(id: number) => markContactMessageRead.mutate(id)} onRetry={(id: number) => retryContactMessage.mutate(id)} onDelete={(id: number) => { if (window.confirm("Permanently delete this contact message?")) deleteContactMessage.mutate(id); }} markingRead={markContactMessageRead.isPending} retrying={retryContactMessage.isPending} deleting={deleteContactMessage.isPending} />}
        {tab === "analytics" && tabAccess.analytics && <AnalyticsPanel analytics={analytics.data} />}
      </section>
    </main>
  );
}

function NotificationsPanel({ notifications, onRead, onReadAll, marking, markingRead }: any) {
  return (
    <div className="admin-content">
      <section className="admin-panel admin-editor">
        <div className="admin-panel-heading">
          <div><p className="eyebrow text-[#168d6d]">Admin inbox</p><h3>Notifications</h3></div>
          <button className="button-secondary" onClick={onReadAll} disabled={marking || markingRead}>{marking || markingRead ? "Marking…" : "Mark all read"}</button>
        </div>
        {notifications.length === 0 ? (
          <p className="admin-muted">No notifications yet. Approval and publishing events will appear here.</p>
        ) : (
          notifications.map((n: any) => (
            <div key={n.id} style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start", border: "1px solid #e5edf1", borderRadius: 14, padding: "14px 16px", background: "#fbfdfe" }}>
              <div>
                <strong style={{ color: "#0b2347" }}>{n.title}</strong>
                <p style={{ margin: "6px 0 0", color: "#4b5563", fontSize: "0.85rem", lineHeight: 1.6 }}>{n.message}</p>
                <small style={{ display: "block", marginTop: 6, color: "#70849a", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{n.type}{n.createdAt ? ` · ${new Date(n.createdAt).toLocaleString()}` : ""}</small>
              </div>
              <button className="admin-table-action" onClick={() => onRead(n.id)} disabled={markingRead}>Mark read</button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

function ContactMessagesPanel({ messages, loading, error, onRead, onRetry, onDelete, markingRead, retrying, deleting }: any) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filteredMessages = useMemo(() => messages.filter((message: any) => {
    const matchesSearch = `${message.senderName} ${message.senderEmail} ${message.subject} ${message.message}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "unread" ? !message.readAt : filter === "read" ? Boolean(message.readAt) : message.deliveryStatus === filter);
    return matchesSearch && matchesFilter;
  }), [messages, search, filter]);

  return (
    <div className="admin-content">
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div><p className="eyebrow text-[#168d6d]">Visitor inbox</p><h3>Contact messages</h3></div>
          <span className="admin-status admin-status-published">{messages.filter((message: any) => !message.readAt).length} unread</span>
        </div>
        <p className="admin-muted">Messages are stored in the database. Email delivery status is shown for each message; failed messages can be retried after SMTP is configured.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input aria-label="Search contact messages" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search sender, email, subject, or message" className="min-w-0 flex-1 rounded-lg border border-[#d1d5db] px-3 py-2 text-sm" />
          <select aria-label="Filter contact messages" value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border border-[#d1d5db] bg-white px-3 py-2 text-sm">
            <option value="all">All messages</option><option value="unread">Unread</option><option value="read">Read</option><option value="sent">Email delivered</option><option value="failed">Email failed</option><option value="pending">Pending</option>
          </select>
        </div>
        {loading ? <p className="admin-muted py-8">Loading messages…</p> : error ? <p role="alert" className="py-6 text-sm text-red-700">{error instanceof Error ? error.message : "Could not load messages."}</p> : filteredMessages.length === 0 ? <p className="admin-muted py-8">{messages.length ? "No messages match this search or filter." : "No contact messages have been submitted yet."}</p> : (
          <div className="mt-4 grid gap-3">
            {filteredMessages.map((message: any) => (
              <article key={message.id} className={`rounded-xl border p-4 ${message.readAt ? "border-[#e5edf1] bg-white" : "border-[#b9dbe9] bg-[#f7fcff]"}`}>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {message.readAt ? <MailOpen className="size-4 text-[#7b8da2]" /> : <Mail className="size-4 text-[#0098d9]" />}
                      <h4 className="break-words font-bold text-[#0b2347]">{message.subject}</h4>
                      {!message.readAt && <span className="admin-status admin-status-published">Unread</span>}
                      <span className={`admin-status ${message.deliveryStatus === "sent" ? "admin-status-published" : "admin-status-draft"}`}>Email {message.deliveryStatus}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[#334155]">{message.senderName} · <a href={`mailto:${message.senderEmail}`} className="break-all text-[#0098d9] hover:underline">{message.senderEmail}</a></p>
                    <p className="mt-1 text-xs text-[#70849a]">Received {message.createdAt ? new Date(message.createdAt).toLocaleString() : "date unavailable"}{message.deliveredAt ? ` · Delivered ${new Date(message.deliveredAt).toLocaleString()}` : ""}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {!message.readAt && <button className="admin-table-action" disabled={markingRead} onClick={() => onRead(message.id)}>Mark read</button>}
                    {message.deliveryStatus === "failed" && <button className="admin-table-action" disabled={retrying} onClick={() => onRetry(message.id)}>Retry email</button>}
                    <button className="admin-table-action" disabled={deleting} onClick={() => onDelete(message.id)}>Delete</button>
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap break-words border-t border-[#e5edf1] pt-3 text-sm leading-6 text-[#334155]">{message.message}</p>
                {message.deliveryError && <p className="mt-2 text-xs text-[#9b3425]">{message.deliveryError}</p>}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AnalyticsPanel({ analytics }: any) {
  const topPages = Array.isArray(analytics?.topPages) ? analytics.topPages : [];
  return (
    <div className="admin-content">
      <section className="admin-panel admin-editor">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Insights</p><h3>Website analytics</h3></div></div>
        <div className="admin-stats">
          <div className="admin-stat"><strong>{analytics?.totalViews ?? 0}</strong><span>Total page views</span></div>
          <div className="admin-stat"><strong>{analytics?.viewsLast7Days ?? 0}</strong><span>Views · last 7 days</span></div>
          <div className="admin-stat"><strong>{analytics?.trackedPaths ?? 0}</strong><span>Tracked pages</span></div>
        </div>
        <h3 style={{ marginTop: 18, color: "#0b2347" }}>Top pages</h3>
        {topPages.length === 0 ? <p className="admin-muted">No page views recorded yet.</p> : (
          <div style={{ display: "grid", gap: 8 }}>
            {topPages.map((p: any) => (
              <div key={p.path} style={{ display: "flex", justifyContent: "space-between", border: "1px solid #e5edf1", borderRadius: 12, padding: "10px 14px", background: "#fbfdfe" }}>
                <span style={{ color: "#0b2347", fontWeight: 700 }}>{p.path}</span>
                <strong>{p.views}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function OverviewPanel({ stats, recentUpdates, onNavigate, onSeedHome }: any) {
  const cards = [
    { id: "content", label: "Public pages", value: stats?.publicPageCount ?? cmsPageCatalog.length, desc: "Editable website routes" },
    { id: "content", label: "Content items", value: stats?.contentCount ?? 0, desc: `${stats?.publishedCount ?? 0} published · ${stats?.draftCount ?? 0} drafts or hidden` },
    { id: "schools", label: "Model schools", value: stats?.schoolCount ?? 0, desc: "TTC-partner demonstration schools" },
    { id: "resident-teachers", label: "Resident teachers", value: stats?.residentTeacherCount ?? 0, desc: `${stats?.pendingResidentTeachers ?? 0} pending review` },
    { id: "teachers", label: "Teacher applications", value: stats?.teacherCount ?? 0, desc: `${stats?.pendingTeachers ?? 0} pending review` },
    { id: "alumni", label: "Alumni network", value: stats?.alumniCount ?? 0, desc: `${stats?.pendingAlumni ?? 0} pending review` },
    { id: "news", label: "News & updates", value: stats?.newsCount ?? 0, desc: "Articles, briefings, events" },
    { id: "gallery", label: "Gallery records", value: stats?.galleryCount ?? 0, desc: "Photos & event videos" },
    { id: "practices", label: "Best practices", value: stats?.practiceCount ?? 0, desc: "Documented classroom resources" },
    { id: "uploads", label: "Media assets", value: stats?.mediaCount ?? 0, desc: "Images & documents" },
    { id: "users", label: "Administrators", value: stats?.adminCount ?? 0, desc: `${stats?.userCount ?? 0} total accounts` },
    { id: "social", label: "Social media", value: stats?.socialCount ?? 0, desc: "Connected accounts & posts" },
  ];
  return (
    <div className="admin-content">
      <div className="admin-stats">
        {cards.map((card) => (
          <button key={card.id} className="admin-stat-card" onClick={() => onNavigate(card.id)}>
            <div className="admin-stat-top"><span>{card.label}</span><ShieldCheck className="size-4 text-[#168d6d]" /></div>
            <strong>{card.value}</strong>
            <small>{card.desc}</small>
          </button>
        ))}
      </div>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Quick start</p><h3>Editorial workflows</h3></div></div>
        <p className="admin-muted">These totals show records managed in the admin database. Public pages can also display bundled PTRP content when a database section has no records.</p>
        <div className="admin-starter-grid">
          {starterPages.map((item) => (
            <article className="admin-starter-card" key={item.slug}>
              <div className="admin-starter-top"><span className={`admin-status admin-status-published`}>{item.slug}</span><button className="admin-table-action" onClick={() => onSeedHome(item)}>Edit</button></div>
              <h4>{item.title}</h4>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Content health</p><h3>{stats?.attentionCount ?? 0} items need review</h3></div><span className="admin-status admin-status-draft">Drafts: {stats?.draftCount ?? 0}</span></div>
        <p className="admin-muted mt-3">Pending registrations, unpublished records, and draft page content are not visible to public visitors.</p>
        <div className="admin-table-wrap mt-3"><table className="admin-table"><thead><tr><th>Recent update</th><th>Content type</th><th>Updated</th></tr></thead><tbody>
          {recentUpdates.map((row: any) => <tr key={`${row.contentType}-${row.id}`}><td><strong>{row.title}</strong></td><td>{row.contentType}</td><td>{row.updatedAt ? new Date(row.updatedAt).toLocaleString() : "—"}</td></tr>)}
          {!recentUpdates.length && <tr><td colSpan={3} className="admin-empty">No recent database content updates.</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}

function ContentManager({ rows, editing, form, setForm, onSave, saving, onOpenEditor, onCancel, onDelete, deleting, pageCatalog }: any) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const pageSize = 10;
  const filteredRows = rows.filter((row: any) => {
    const matchesSearch = `${row.slug} ${row.title} ${row.summary ?? ""}`.toLowerCase().includes(search.trim().toLowerCase());
    return matchesSearch && (statusFilter === "all" || row.status === statusFilter);
  });
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pageRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);
  const layout = parseCmsPageLayout(form.body);
  const canSave = /^[a-zA-Z0-9_-]{1,120}$/.test(form.slug) && form.title.trim() && form.summary.trim() && !!layout;
  const updateLayout = (nextLayout: NonNullable<typeof layout>) => setForm((current: any) => ({ ...current, body: JSON.stringify(nextLayout, null, 2) }));
  const updateSection = (index: number, patch: Partial<CmsPageSection>) => {
    if (!layout) return;
    updateLayout({ ...layout, sections: layout.sections.map((section, sectionIndex) => sectionIndex === index ? { ...section, ...patch } : section) });
  };
  const moveSection = (index: number, destination: number) => {
    if (!layout || destination < 0 || destination >= layout.sections.length) return;
    const sections = [...layout.sections];
    const [section] = sections.splice(index, 1);
    sections.splice(destination, 0, section);
    updateLayout({ ...layout, sections });
  };
  const addSection = (type: CmsPageSection["type"]) => {
    if (!layout) return;
    const templates: Record<CmsPageSection["type"], CmsPageSection> = {
      text: { type, title: "New section", body: "" },
      image: { type, title: "Photo", body: "", imageUrl: "", imageAlt: "" },
      cards: { type, title: "Featured items", items: [{ title: "New item", body: "" }] },
      callout: { type, title: "Get involved", body: "", buttonLabel: "Learn more", buttonHref: "/contact" },
    };
    updateLayout({ ...layout, sections: [...layout.sections, templates[type]] });
  };
  const updateCard = (sectionIndex: number, cardIndex: number, patch: Partial<NonNullable<CmsPageSection["items"]>[number]>) => {
    if (!layout) return;
    const section = layout.sections[sectionIndex];
    if (section.type !== "cards") return;
    updateSection(sectionIndex, { items: section.items?.map((item, index) => index === cardIndex ? { ...item, ...patch } : item) });
  };

  return (
    <div className="admin-content">
      {editing !== null && (
        <section className="admin-panel admin-editor">
          <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">{editing ? "Edit page" : "New page"}</p><h3>Page content editor</h3></div><button className="admin-icon-button" onClick={onCancel} aria-label="Close editor"><X className="size-4" /></button></div>
          <p className="admin-muted">Page records replace the bundled page only after publication. Content is rendered as safe text and image blocks; HTML and scripts are not executed.</p>
          <div className="admin-form-grid">
            <label>Slug<input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-") })} placeholder="about" disabled={!!editing} /></label>
            <label>Page title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Page title" /></label>
            <label className="admin-full">Page description<textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} placeholder="Short page description" /></label>
            <label className="admin-full">Hero eyebrow<input value={layout?.eyebrow ?? ""} onChange={(event) => layout && updateLayout({ ...layout, eyebrow: event.target.value })} maxLength={120} /></label>
            <label className="admin-full">Hero image URL<input value={layout?.heroImage ?? ""} onChange={(event) => layout && updateLayout({ ...layout, heroImage: event.target.value })} maxLength={2000} placeholder="Use a media-library URL or leave blank" /></label>
            <label className="admin-full">Hero image description<input value={layout?.heroImageAlt ?? ""} onChange={(event) => layout && updateLayout({ ...layout, heroImageAlt: event.target.value })} maxLength={255} /></label>
            <div className="admin-full">
              <div className="admin-panel-heading">
                <div><p className="eyebrow text-[#168d6d]">Visual page builder</p><h3>Page sections</h3></div>
                <div className="flex flex-wrap gap-2">
                  {(["text", "image", "cards", "callout"] as const).map((type) => <button key={type} type="button" className="admin-table-action" disabled={!layout || layout.sections.length >= 100} onClick={() => addSection(type)}><Plus className="size-3.5" />{type}</button>)}
                </div>
              </div>
              {!layout ? <p role="alert" className="mt-3 text-sm text-red-600">This page layout is invalid. Correct its stored JSON before editing.</p> : layout.sections.length === 0 ? <p className="admin-muted mt-3">No sections yet. Add a section template above.</p> : (
                <div className="mt-3 grid gap-3">
                  {layout.sections.map((section, index) => (
                    <article
                      key={`${section.type}-${index}`}
                      draggable
                      onDragStart={(event) => event.dataTransfer.setData("text/plain", String(index))}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => { event.preventDefault(); const source = Number(event.dataTransfer.getData("text/plain")); if (Number.isInteger(source)) moveSection(source, index); }}
                      className="rounded-xl border border-[#dce8ed] bg-[#fbfdfe] p-4"
                    >
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-sm font-bold capitalize text-[#0b2347]"><GripVertical className="size-4 text-[#7b8da2]" />{section.type} section {index + 1}</div>
                        <div className="flex flex-wrap gap-1">
                          <button type="button" className="admin-table-action" aria-label={`Move section ${index + 1} up`} disabled={index === 0} onClick={() => moveSection(index, index - 1)}><ArrowUp className="size-3.5" /></button>
                          <button type="button" className="admin-table-action" aria-label={`Move section ${index + 1} down`} disabled={index === layout.sections.length - 1} onClick={() => moveSection(index, index + 1)}><ArrowDown className="size-3.5" /></button>
                          <button type="button" className="admin-table-action" onClick={() => updateLayout({ ...layout, sections: [...layout.sections.slice(0, index + 1), { ...section, items: section.items?.map((item) => ({ ...item })) }, ...layout.sections.slice(index + 1)] })}><Copy className="size-3.5" />Duplicate</button>
                          <button type="button" className="admin-table-action admin-danger" aria-label={`Delete section ${index + 1}`} onClick={() => updateLayout({ ...layout, sections: layout.sections.filter((_, sectionIndex) => sectionIndex !== index) })}><Trash2 className="size-3.5" /></button>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="admin-full">Section heading<input value={section.title ?? ""} onChange={(event) => updateSection(index, { title: event.target.value })} maxLength={255} /></label>
                        {(section.type === "text" || section.type === "callout" || section.type === "image") && <label className="admin-full">{section.type === "image" ? "Caption" : "Text"}<textarea value={section.body ?? ""} onChange={(event) => updateSection(index, { body: event.target.value })} rows={3} maxLength={20000} /></label>}
                        {section.type === "image" && <>
                          <label className="admin-full">Image URL<input value={section.imageUrl ?? ""} onChange={(event) => updateSection(index, { imageUrl: event.target.value })} maxLength={2000} /></label>
                          <label className="admin-full">Image description<input value={section.imageAlt ?? ""} onChange={(event) => updateSection(index, { imageAlt: event.target.value })} maxLength={255} /></label>
                        </>}
                        {section.type === "callout" && <>
                          <label>Button label<input value={section.buttonLabel ?? ""} onChange={(event) => updateSection(index, { buttonLabel: event.target.value })} maxLength={120} /></label>
                          <label>Button destination<input value={section.buttonHref ?? ""} onChange={(event) => updateSection(index, { buttonHref: event.target.value })} maxLength={2000} /></label>
                        </>}
                      </div>
                      {section.type === "cards" && (
                        <div className="mt-3 grid gap-3">
                          {section.items?.map((item, cardIndex) => (
                            <div key={`${item.title}-${cardIndex}`} className="grid gap-2 rounded-lg border border-[#e5edf1] bg-white p-3 sm:grid-cols-2">
                              <label>Card title<input value={item.title} onChange={(event) => updateCard(index, cardIndex, { title: event.target.value })} maxLength={255} /></label>
                              <label>Card description<input value={item.body ?? ""} onChange={(event) => updateCard(index, cardIndex, { body: event.target.value })} maxLength={10000} /></label>
                              <label>Image URL<input value={item.imageUrl ?? ""} onChange={(event) => updateCard(index, cardIndex, { imageUrl: event.target.value })} maxLength={2000} /></label>
                              <label>Link destination<input value={item.href ?? ""} onChange={(event) => updateCard(index, cardIndex, { href: event.target.value })} maxLength={2000} /></label>
                              <button type="button" className="admin-table-action admin-danger sm:col-span-2 sm:justify-self-start" onClick={() => updateSection(index, { items: section.items?.filter((_, itemIndex) => itemIndex !== cardIndex) })}><Trash2 className="size-3.5" />Remove card</button>
                            </div>
                          ))}
                          <button type="button" className="admin-table-action sm:justify-self-start" disabled={(section.items?.length ?? 0) >= 30} onClick={() => updateSection(index, { items: [...(section.items ?? []), { title: "New item", body: "" }] })}><Plus className="size-3.5" />Add card</button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
            <div className="admin-full flex flex-wrap items-center justify-between gap-3">
              <p className={`text-xs ${layout ? "text-[#168d6d]" : "text-red-600"}`}>{layout ? `${layout.sections.length} valid content section(s)` : "Invalid JSON. Fix the page layout before saving."}</p>
              <button type="button" className="button-secondary" onClick={() => setShowPreview((visible) => !visible)} disabled={!layout}>{showPreview ? "Hide preview" : "Preview page"}</button>
            </div>
            <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}><option value="draft">Draft</option><option value="published">Published</option></select></label>
          </div>
          <div className="admin-form-actions"><button className="button-secondary" onClick={onCancel}>Cancel</button><button className="button-primary" onClick={onSave} disabled={saving || !canSave}>{saving ? "Saving…" : form.status === "published" ? "Publish page" : "Save draft"}</button></div>
          {showPreview && layout && <div className="mt-6 overflow-hidden rounded-xl border border-[#dce8ed]"><CmsPageRenderer title={form.title} summary={form.summary} layout={layout} /></div>}
        </section>
      )}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div><p className="eyebrow text-[#168d6d]">Website pages</p><h3>{filteredRows.length} matching page records</h3></div>
          <button className="button-primary" onClick={() => onOpenEditor()}><Plus className="size-4" /> Add page</button>
        </div>
        <p className="admin-muted mt-3">Existing bundled content remains as the fallback until a matching page override is published.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="flex items-center border border-[#d9e5eb] rounded-lg px-3"><span className="sr-only">Search pages</span><input className="w-full bg-transparent py-2 text-sm outline-none" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search pages by slug, title, or description" /></label>
          <label className="flex items-center border border-[#d9e5eb] rounded-lg px-3"><span className="sr-only">Filter page status</span><select className="bg-transparent py-2 text-sm outline-none" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option></select></label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {pageCatalog.filter((item: any) => !rows.some((row: any) => row.slug === item.slug)).map((item: any) => <button key={item.slug} className="admin-table-action rounded-full border border-[#dce8ed] px-3 py-1.5" onClick={() => onOpenEditor(item)}>Create {item.label} page</button>)}
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table"><thead><tr><th>Slug</th><th>Title</th><th>Status</th><th>Updated</th><th /></tr></thead><tbody>
            {pageRows.length ? pageRows.map((row: any) => (
              <tr key={row.id}><td><strong>{row.slug}</strong><span>/{row.slug}</span></td><td>{row.title}</td><td><span className={`admin-status ${row.status === "published" ? "admin-status-published" : "admin-status-draft"}`}>{row.status}</span></td><td>{row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : "—"}</td><td className="admin-row-actions"><button className="admin-table-action" onClick={() => onOpenEditor(row)}><Pencil className="size-3.5" /> Edit</button><button className="admin-table-action admin-danger" disabled={deleting} onClick={() => onDelete(row)}><Trash2 className="size-3.5" /></button></td></tr>
            )) : <tr><td colSpan={5} className="admin-empty">{rows.length ? "No page records match these filters." : "No page overrides yet. Create one to manage an existing page."}</td></tr>}
          </tbody></table>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-[#64748b]">
          <span>Page {Math.min(page, pageCount)} of {pageCount} · {filteredRows.length} records</span>
          <div className="flex gap-2"><button className="admin-table-action" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</button><button className="admin-table-action" disabled={page >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Next</button></div>
        </div>
      </section>
    </div>
  );
}

function BannerManager({ rows, onSave, onDelete, saving, deleting }: { rows: any[]; onSave: (input: Record<string, unknown>) => void; onDelete: (slug: string) => void; saving: boolean; deleting: boolean }) {
  const [selectedSlug, setSelectedSlug] = useState(bannerCatalog[0].slug);
  const [form, setForm] = useState(() => ({
    eyebrow: "",
    title: "",
    description: "",
    imageUrl: bannerCatalog[0].imageUrl,
    imageAlt: "",
    imagePosition: "center",
    isVisible: true,
  }));
  const [uploading, setUploading] = useState(false);
  const selectedPage = bannerCatalog.find((page) => page.slug === selectedSlug) ?? bannerCatalog[0];
  const existing = rows.find((row) => row.slug === selectedSlug);

  useEffect(() => {
    setForm({
      eyebrow: existing?.eyebrow ?? "",
      title: existing?.title ?? "",
      description: existing?.description ?? "",
      imageUrl: existing ? existing.imageUrl : selectedPage.imageUrl,
      imageAlt: existing?.imageAlt ?? "",
      imagePosition: existing?.imagePosition ?? "center",
      isVisible: existing ? Boolean(Number(existing.isVisible)) : true,
    });
  }, [existing, selectedPage]);

  const selectPage = (slug: string) => {
    setSelectedSlug(slug);
  };

  const uploadBanner = async (file: File) => {
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      toast.error("Choose a PNG, JPEG, GIF, or WebP banner image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Banner images are limited to 10 MB.");
      return;
    }
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
        reader.onerror = () => reject(reader.error ?? new Error("Could not read the selected image."));
        reader.readAsDataURL(file);
      });
      const uploaded = await apiRequest<{ url: string }>("admin/media/upload", {
        method: "POST",
        body: { filename: file.name, mimeType: file.type, size: file.size, base64, altText: form.imageAlt || `${selectedPage.label} PTRP banner` },
      });
      setForm((current) => ({ ...current, imageUrl: uploaded.url, isVisible: true }));
      toast.success("Banner image uploaded. Save the banner to publish it.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Banner image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const submit = () => {
    if (form.imageUrl.trim() && !form.imageAlt.trim()) {
      toast.error("Add descriptive alt text for the banner image.");
      return;
    }
    onSave({ slug: selectedSlug, ...form });
  };

  return (
    <div className="admin-content">
      <section className="admin-panel admin-editor">
        <div className="admin-panel-heading">
          <div><p className="eyebrow text-[#168d6d]">Public image headers</p><h3>Manage a page banner</h3></div>
          <label className="text-sm font-bold text-[#264665]">Page
            <select className="ml-2 rounded-lg border border-[#d9e5eb] bg-white px-3 py-2" value={selectedSlug} onChange={(event) => selectPage(event.target.value)}>
              {bannerCatalog.map((page) => <option key={page.slug} value={page.slug}>{page.label}</option>)}
            </select>
          </label>
        </div>
        <p className="admin-muted">Upload a high-resolution landscape photo or use a media-library URL. Blank headline fields retain the page's original copy. Hiding the photo keeps the page title and description visible on the PTRP background.</p>
        <div className="admin-form-grid">
          <label>Eyebrow<input value={form.eyebrow} onChange={(event) => setForm({ ...form, eyebrow: event.target.value })} maxLength={120} placeholder="Keep the existing page label" /></label>
          <label>Image position<select value={form.imagePosition} onChange={(event) => setForm({ ...form, imagePosition: event.target.value })}><option value="center">Center</option><option value="center 35%">Center (upper focus)</option><option value="center 65%">Center (lower focus)</option><option value="left center">Left focus</option><option value="right center">Right focus</option></select></label>
          <label className="admin-full">Banner title<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} maxLength={255} placeholder="Keep the existing page title" /></label>
          <label className="admin-full">Banner description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} maxLength={1000} rows={3} placeholder="Keep the existing page description" /></label>
          <label className="admin-full">Image URL<input value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} maxLength={700} placeholder="Upload an image or paste a local/http(s) image URL" /></label>
          <label>Image alt text<input value={form.imageAlt} onChange={(event) => setForm({ ...form, imageAlt: event.target.value })} maxLength={255} placeholder="Describe the photograph" /></label>
          <label className="upload-drop">
            <UploadCloud className="size-6 text-[#16a878]" />
            <strong>{uploading ? "Uploading image…" : "Upload banner image"}</strong>
            <small>PNG, JPEG, GIF or WebP · Up to 10 MB</small>
            <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" disabled={uploading} onChange={(event) => event.target.files?.[0] && uploadBanner(event.target.files[0])} />
          </label>
          <label className="admin-full flex items-center gap-3">
            <input type="checkbox" checked={form.isVisible} onChange={(event) => setForm({ ...form, isVisible: event.target.checked })} />
            <span>Display the photo background on this page banner</span>
          </label>
        </div>
        <div className="admin-form-actions">
          {existing && <button className="button-secondary" disabled={deleting} onClick={() => onDelete(selectedSlug)}>Reset to default</button>}
          <button className="button-primary" disabled={saving || uploading} onClick={submit}>{saving ? "Saving…" : "Save banner"}</button>
        </div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Live preview</p><h3>{selectedPage.label} banner</h3></div></div>
        <div className="relative flex min-h-64 items-center overflow-hidden bg-[#071935] px-6 py-10 sm:px-10" aria-label="Banner preview">
          {form.isVisible && <BannerImage src={form.imageUrl || selectedPage.imageUrl} fallbackSrc={[selectedPage.imageUrl, "gallery/gallery-01.jpg"]} alt="" className="absolute inset-0 h-full w-full object-cover" objectPosition={form.imagePosition} />}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071935]/95 via-[#071935]/70 to-[#071935]/25" />
          <div className="relative max-w-2xl text-white">
            <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#7dd3fc]">PTR Alumni Network · {form.eyebrow || selectedPage.label}</p>
            <h4 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-0.04em]">{form.title || selectedPage.label}</h4>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/85">{form.description || "The existing page description will remain in place."}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">{bannerCatalog.map((page) => {
          const configured = rows.some((row) => row.slug === page.slug);
          return <button key={page.slug} type="button" onClick={() => selectPage(page.slug)} className={`admin-table-action rounded-full border px-3 py-1.5 ${selectedSlug === page.slug ? "border-[#0098d9] text-[#007ab0]" : "border-[#dce8ed]"}`}>
            {page.label}{configured ? " · managed" : ""}
          </button>;
        })}</div>
      </section>
    </div>
  );
}

function NavigationManager({ rows, onSave, onDelete, saving }: any) {
  const [form, setForm] = useState({ id: 0, label: "", href: "", parentId: "", sortOrder: 0, isVisible: true, status: "published" });
  const [search, setSearch] = useState("");
  const filtered = rows.filter((row: any) => `${row.label} ${row.href}`.toLowerCase().includes(search.trim().toLowerCase()));
  const edit = (row: any) => setForm({ id: row.id, label: row.label, href: row.href, parentId: row.parentId ? String(row.parentId) : "", sortOrder: Number(row.sortOrder) || 0, isVisible: Boolean(Number(row.isVisible)), status: row.status });
  const submit = () => {
    if (!form.label.trim() || !form.href.trim()) {
      toast.error("Enter a navigation label and destination.");
      return;
    }
    onSave({ ...form, id: form.id || undefined, parentId: form.parentId ? Number(form.parentId) : null, sortOrder: Number(form.sortOrder) || 0 });
    setForm({ id: 0, label: "", href: "", parentId: "", sortOrder: 0, isVisible: true, status: "published" });
  };
  return (
    <div className="admin-content">
      <section className="admin-panel admin-editor">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Navigation</p><h3>{form.id ? "Edit menu item" : "Add menu item"}</h3></div></div>
        <div className="admin-form-grid">
          <label>Menu label<input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} maxLength={120} /></label>
          <label>Link destination<input value={form.href} onChange={(event) => setForm({ ...form, href: event.target.value })} placeholder="/about or https://example.com" maxLength={500} /></label>
          <label>Dropdown parent<select value={form.parentId} onChange={(event) => setForm({ ...form, parentId: event.target.value })}><option value="">Top-level item</option>{rows.filter((row: any) => !row.parentId && row.id !== form.id).map((row: any) => <option key={row.id} value={row.id}>{row.label}</option>)}</select></label>
          <label>Display order<input type="number" min="0" max="9999" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) || 0 })} /></label>
          <label>Visibility<select value={form.isVisible ? "yes" : "no"} onChange={(event) => setForm({ ...form, isVisible: event.target.value === "yes" })}><option value="yes">Visible</option><option value="no">Hidden</option></select></label>
          <label>Publication<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="published">Published</option><option value="draft">Draft</option></select></label>
        </div>
        <div className="admin-form-actions">{form.id !== 0 && <button className="button-secondary" onClick={() => setForm({ id: 0, label: "", href: "", parentId: "", sortOrder: 0, isVisible: true, status: "published" })}>Cancel edit</button>}<button className="button-primary" disabled={saving} onClick={submit}>{saving ? "Saving…" : form.id ? "Save menu item" : "Add menu item"}</button></div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Published and draft links</p><h3>{rows.length} navigation items</h3></div></div>
        <label className="mt-4 flex items-center rounded-lg border border-[#d9e5eb] px-3"><span className="sr-only">Search navigation items</span><input className="w-full bg-transparent py-2 text-sm outline-none" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search menu labels and destinations" /></label>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Label</th><th>Destination</th><th>Parent</th><th>Order</th><th>Status</th><th /></tr></thead><tbody>
          {filtered.map((row: any) => <tr key={row.id}><td><strong>{row.label}</strong></td><td>{row.href}</td><td>{rows.find((item: any) => item.id === Number(row.parentId))?.label ?? "—"}</td><td>{row.sortOrder}</td><td><span className={`admin-status ${row.status === "published" && Number(row.isVisible) ? "admin-status-published" : "admin-status-draft"}`}>{row.status}{!Number(row.isVisible) ? " · hidden" : ""}</span></td><td className="admin-row-actions"><button className="admin-table-action" onClick={() => edit(row)}><Pencil className="size-3.5" /> Edit</button><button className="admin-table-action admin-danger" onClick={() => onDelete(row.id)}><Trash2 className="size-3.5" /></button></td></tr>)}
          {!filtered.length && <tr><td colSpan={6} className="admin-empty">No navigation items found. Existing links remain active until at least one menu item is published.</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}

function WebsiteSettingsManager({ rows, onSave, onDelete, saving }: any) {
  const [settingKey, setSettingKey] = useState("");
  const [settingValue, setSettingValue] = useState("");
  const [search, setSearch] = useState("");
  const examples = [
    ["siteName", "PTR Alumni Network"], ["logoUrl", "/ptrp-logo.svg"], ["contactEmail", "info@example.org"],
    ["contactPhone", ""], ["contactAddress", ""], ["footerText", ""], ["primaryColor", "#0b2347"],
    ["accentColor", "#0098d9"], ["metaTitle", ""], ["metaDescription", ""],
    ["social.facebook", ""], ["social.instagram", ""], ["social.youtube", ""], ["social.linkedin", ""],
  ];
  const filtered = rows.filter((row: any) => `${row.settingKey} ${row.settingValue}`.toLowerCase().includes(search.trim().toLowerCase()));
  const edit = (row: any) => { setSettingKey(row.settingKey); setSettingValue(row.settingValue); };
  const submit = () => {
    if (!/^[a-z][a-z0-9._-]{0,99}$/.test(settingKey) || !settingValue.trim()) {
      toast.error("Enter a valid setting key and a non-empty value.");
      return;
    }
    onSave({ settingKey, settingValue });
    setSettingKey("");
    setSettingValue("");
  };
  return (
    <div className="admin-content">
      <section className="admin-panel admin-editor">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Brand, contact, and SEO</p><h3>{settingKey ? `Edit ${settingKey}` : "Add website setting"}</h3></div></div>
        <p className="admin-muted">Recommended keys connect to the live header, footer, social links, and page metadata. Values are public and must never contain credentials.</p>
        <div className="admin-form-grid">
          <label>Setting key<input value={settingKey} onChange={(event) => setSettingKey(event.target.value)} placeholder="contactEmail" maxLength={100} /></label>
          <label className="admin-full">Value<textarea value={settingValue} onChange={(event) => setSettingValue(event.target.value)} rows={2} maxLength={50000} /></label>
        </div>
        <div className="admin-form-actions">{settingKey && <button className="button-secondary" onClick={() => { setSettingKey(""); setSettingValue(""); }}>Cancel</button>}<button className="button-primary" disabled={saving} onClick={submit}>{saving ? "Saving…" : "Save setting"}</button></div>
        <div className="mt-4 flex flex-wrap gap-2">{examples.filter(([key]) => !rows.some((row: any) => row.settingKey === key)).map(([key, value]) => <button key={key} className="admin-table-action rounded-full border border-[#dce8ed] px-3 py-1.5" onClick={() => { setSettingKey(key); setSettingValue(value); }}>{key}</button>)}</div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Website configuration</p><h3>{rows.length} settings</h3></div></div>
        <label className="mt-4 flex items-center rounded-lg border border-[#d9e5eb] px-3"><span className="sr-only">Search website settings</span><input className="w-full bg-transparent py-2 text-sm outline-none" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search settings" /></label>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Key</th><th>Value</th><th>Updated</th><th /></tr></thead><tbody>
          {filtered.map((row: any) => <tr key={row.settingKey}><td><strong>{row.settingKey}</strong></td><td className="max-w-[420px] truncate">{row.settingValue}</td><td>{row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : "—"}</td><td className="admin-row-actions"><button className="admin-table-action" onClick={() => edit(row)}><Pencil className="size-3.5" /> Edit</button><button className="admin-table-action admin-danger" onClick={() => onDelete(row.settingKey)}><Trash2 className="size-3.5" /></button></td></tr>)}
          {!filtered.length && <tr><td colSpan={4} className="admin-empty">No website settings found. Add one of the recommended keys to override its bundled default.</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}

function UploadManager({ rows, altText, setAltText, fileRef, onFile, uploading, onArchive }: any) {
  return (
    <div className="admin-content">
      <section className="admin-panel upload-panel">
        <div><p className="eyebrow text-[#168d6d]">Managed storage</p><h3>Add an approved media asset</h3><p className="admin-muted">Images, video, PDF, Word, PowerPoint, and text files up to 10 MB.</p></div>
        <div className="upload-controls">
          <label>Alt text<input value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Describe the image for accessibility" /></label>
          <label className="upload-drop"><UploadCloud className="size-7 text-[#16a878]" /><strong>{uploading ? "Uploading securely…" : "Choose a file"}</strong><small>Type and size are validated before storage</small><input ref={fileRef} type="file" accept="image/*,video/mp4,video/webm,application/pdf,.doc,.docx,.ppt,.pptx,.txt" disabled={uploading} onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} /></label>
        </div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Media library</p><h3>{rows.length} uploads</h3></div></div>
        <div className="admin-media-grid">
          {rows.length ? rows.map((row: any) => (
            <article className="admin-media-card" key={row.id}>
              {row.mimeType?.startsWith("image/") ? <img src={resolveMediaUrl(row.url) ?? row.url} alt={row.altText || row.filename} /> : <div className="admin-media-file"><FileText className="size-7" /><span>{row.mimeType?.split("/").pop()}</span></div>}
              <div className="admin-media-meta"><strong title={row.filename}>{row.filename}</strong><span>{Math.round(row.size / 1024)} KB · {row.status}</span><div className="admin-media-actions"><a href={row.url} target="_blank" rel="noreferrer">Open</a><button onClick={() => onArchive(row.id)}>Archive</button></div></div>
            </article>
          )) : <p className="admin-empty">No uploads yet.</p>}
        </div>
      </section>
    </div>
  );
}

function UsersManager({ rows, stats, logs, onRole, onSetStatus, onUpdate, onCreate, onDelete, changing, onRefresh }: any) {
  const [showAdd, setShowAdd] = useState(false);
  const [resetId, setResetId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [resetPasswordVal, setResetPasswordVal] = useState("");
  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", role: "user" as "user" | "editor" | "admin", account_type: "public" as "public" | "resident_teacher" | "admin", account_status: "active" as "active" | "inactive" });
  const [editForm, setEditForm] = useState({ id: 0, name: "", email: "", role: "user" as "user" | "editor" | "admin", account_type: "public" as "public" | "resident_teacher" | "admin", account_status: "active" as "active" | "inactive" });
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [saving, setSaving] = useState(false);

  const filteredRows = useMemo(() => {
    return rows.filter((row: any) => {
      const matchesSearch = search === "" ||
        (row.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (row.email || "").toLowerCase().includes(search.toLowerCase());
      const matchesRole = filterRole === "all" || row.role === filterRole;
      const matchesStatus = filterStatus === "all" || row.account_status === filterStatus;
      const matchesType = filterType === "all" || row.account_type === filterType;
      return matchesSearch && matchesRole && matchesStatus && matchesType;
    });
  }, [rows, search, filterRole, filterStatus, filterType]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.email || !addForm.password) {
      toast.error("Name, email, and password are required.");
      return;
    }
    setSaving(true);
    try {
      await onCreate(addForm);
      setShowAdd(false);
      setAddForm({ name: "", email: "", password: "", role: "user", account_type: "public", account_status: "active" });
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (id: number) => {
    if (!resetPasswordVal || resetPasswordVal.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    try {
      await apiRequest(`admin/users/${id}/reset-password`, { method: "POST", body: { password: resetPasswordVal } });
      toast.success("Password reset successfully");
      setResetId(null);
      setResetPasswordVal("");
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to remove this account? This cannot be undone.")) return;
    try {
      await onDelete(id);
      toast.success("Account removed");
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
    }
  };

  const handleSaveEdit = async (id: number) => {
    setSaving(true);
    try {
      await onUpdate(id, { name: editForm.name, email: editForm.email, role: editForm.role, account_type: editForm.account_type, account_status: editForm.account_status });
      setEditId(null);
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update account");
    } finally {
      setSaving(false);
    }
  };

  const typeLabel: Record<string, string> = { public: "Public User", resident_teacher: "Resident Teacher", admin: "Administrator" };
  const typeColor: Record<string, string> = { public: "#6b7280", resident_teacher: "#0098d9", admin: "#168d6d" };
  const statusLabel: Record<string, string> = { active: "Active", inactive: "Inactive" };
  const statusColor: Record<string, string> = { active: "#168d6d", inactive: "#9ca3af" };

  return (
    <div className="admin-content">
      {/* Stats Dashboard */}
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Account Overview</p><h3>User Statistics</h3></div></div>
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-top"><span>Total Accounts</span><UsersRound className="size-4 text-[#0098d9]" /></div>
            <strong>{stats?.totalUsers ?? 0}</strong>
            <small>All registered accounts</small>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-top"><span>Public Users</span><UserRound className="size-4 text-[#6b7280]" /></div>
            <strong>{stats?.publicUsers ?? 0}</strong>
            <small>General public accounts</small>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-top"><span>Resident Teachers</span><GraduationCap className="size-4 text-[#168d6d]" /></div>
            <strong>{stats?.residentTeacherUsers ?? 0}</strong>
            <small>Resident teacher accounts</small>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-top"><span>Administrators</span><ShieldCheck className="size-4 text-[#0098d9]" /></div>
            <strong>{stats?.adminUsers ?? 0}</strong>
            <small>Full system access</small>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-top"><span>Active</span><CheckCircle2 className="size-4 text-[#168d6d]" /></div>
            <strong>{stats?.activeUsers ?? 0}</strong>
            <small>Can sign in</small>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-top"><span>Inactive</span><AlertCircle className="size-4 text-[#9ca3af]" /></div>
            <strong>{stats?.inactiveUsers ?? 0}</strong>
            <small>Cannot sign in</small>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-top"><span>Recent (7 days)</span><BarChart3 className="size-4 text-[#38bdf8]" /></div>
            <strong>{stats?.recentUsers ?? 0}</strong>
            <small>New registrations</small>
          </div>
        </div>
      </section>

      {/* Add User Form */}
      {showAdd && (
        <section className="admin-panel admin-editor">
          <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Create Account</p><h3>Register New User</h3></div><button className="admin-icon-button" onClick={() => setShowAdd(false)} aria-label="Close"><X className="size-4" /></button></div>
          <form onSubmit={handleAdd}>
            <div className="admin-form-grid">
              <label>Full Name<input required value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} placeholder="Full name" /></label>
              <label>Email Address<input required type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} placeholder="name@domain.rw" /></label>
              <label>Initial Password (min 8 chars)<input required type="password" minLength={8} value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} placeholder="••••••••" /></label>
              <label>Role<select value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value as "user" | "editor" | "admin" })}><option value="user">User / Member</option><option value="editor">Program Editor</option><option value="admin">Administrator</option></select></label>
              <label>Account Type<select value={addForm.account_type} onChange={(e) => setAddForm({ ...addForm, account_type: e.target.value as "public" | "resident_teacher" | "admin" })}><option value="public">Public User</option><option value="resident_teacher">Resident Teacher</option><option value="admin">Administrator</option></select></label>
              <label>Account Status<select value={addForm.account_status} onChange={(e) => setAddForm({ ...addForm, account_status: e.target.value as "active" | "inactive" })}><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
            </div>
            <div className="admin-form-actions">
              <button type="button" className="button-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="button-primary" disabled={saving}>{saving ? "Creating…" : "Create Account"}</button>
            </div>
          </form>
        </section>
      )}

      {/* Reset Password Form */}
      {resetId !== null && (
        <section className="admin-panel admin-editor" style={{ borderColor: "#0098d9" }}>
          <div className="admin-panel-heading"><div><p className="eyebrow text-[#0098d9]">Security</p><h3>Reset Password for Account #{resetId}</h3></div></div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "1rem" }}>
            <input
              type="password"
              placeholder="Enter new password (min 8 chars)"
              value={resetPasswordVal}
              onChange={(e) => setResetPasswordVal(e.target.value)}
              style={{ padding: "0.5rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "6px", flex: 1 }}
            />
            <button className="button-primary" onClick={() => handleResetPassword(resetId)} disabled={saving}>{saving ? "Updating…" : "Set Password"}</button>
            <button className="button-secondary" onClick={() => { setResetId(null); setResetPasswordVal(""); }}>Cancel</button>
          </div>
        </section>
      )}

      {/* Edit User Form */}
      {editId !== null && (
        <section className="admin-panel admin-editor">
          <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Edit Account</p><h3>Update User Details</h3></div><button className="admin-icon-button" onClick={() => setEditId(null)} aria-label="Close"><X className="size-4" /></button></div>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(editId); }}>
            <div className="admin-form-grid">
              <label>Full Name<input required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></label>
              <label>Email Address<input required type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></label>
              <label>Role<select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value as "user" | "editor" | "admin" })}><option value="user">User / Member</option><option value="editor">Program Editor</option><option value="admin">Administrator</option></select></label>
              <label>Account Type<select value={editForm.account_type} onChange={(e) => setEditForm({ ...editForm, account_type: e.target.value as "public" | "resident_teacher" | "admin" })}><option value="public">Public User</option><option value="resident_teacher">Resident Teacher</option><option value="admin">Administrator</option></select></label>
              <label>Account Status<select value={editForm.account_status} onChange={(e) => setEditForm({ ...editForm, account_status: e.target.value as "active" | "inactive" })}><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
            </div>
            <div className="admin-form-actions">
              <button type="button" className="button-secondary" onClick={() => setEditId(null)}>Cancel</button>
              <button type="submit" className="button-primary" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
            </div>
          </form>
        </section>
      )}

      {/* Filters and Search */}
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Account Directory</p><h3>{filteredRows.length} account(s)</h3></div></div>
        <div className="admin-search-filters" style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", marginBottom: "1rem" }}>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-[#4b5563]">Search</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or email…" className="px-3 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-[#4b5563]">Role</label>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-3 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none">
              <option value="all">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="editor">Program Editor</option>
              <option value="user">User / Member</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-[#4b5563]">Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none">
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-[#4b5563]">Account Type</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 rounded-lg border border-[#d1d5db] text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none">
              <option value="all">All Types</option>
              <option value="public">Public User</option>
              <option value="resident_teacher">Resident Teacher</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Account</th><th>Type</th><th>Role</th><th>Status</th><th>Last Sign-in</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredRows.length ? filteredRows.map((row: any) => (
                <tr key={row.id}>
                  <td>
                    <div>
                      <strong>{row.name || "Unnamed account"}</strong>
                      <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>{row.email || "No email"}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: typeColor[row.account_type] || "#6b7280", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase" }}>{typeLabel[row.account_type] || row.account_type}</span>
                  </td>
                  <td>
                    <span className={`admin-status ${row.role === "admin" ? "admin-status-published" : "admin-status-draft"}`}>{row.role}</span>
                  </td>
                  <td>
                    <span className={`admin-status ${row.account_status === "active" ? "admin-status-published" : "admin-status-draft"}`}>{statusLabel[row.account_status] || row.account_status}</span>
                  </td>
                  <td>{row.lastSignedIn ? new Date(row.lastSignedIn).toLocaleDateString() : "—"}</td>
                  <td className="admin-row-actions">
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      <button className="admin-table-action" onClick={() => { const r = rows.find((r2: any) => r2.id === row.id); setEditForm({ id: row.id, name: r.name, email: r.email, role: r.role, account_type: r.account_type, account_status: r.account_status }); setEditId(row.id); }}>Edit</button>
                      <button className="admin-table-action" onClick={() => onSetStatus(row.id, row.account_status === "active" ? "inactive" : "active")}>{row.account_status === "active" ? "Deactivate" : "Activate"}</button>
                      <button className="admin-table-action" onClick={() => { setResetId(row.id); setResetPasswordVal(""); }}>Reset Password</button>
                      <button className="admin-table-action" onClick={() => onRole(row.id, row.role === "admin" ? "user" : row.role === "editor" ? "admin" : "editor")} disabled={changing}>{row.role === "admin" ? "Remove Admin" : row.role === "editor" ? "Make Admin" : "Make Editor"}</button>
                      <button className="admin-table-action admin-danger" onClick={() => handleDelete(row.id)} disabled={changing}><Trash2 className="size-3.5" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="admin-empty">No accounts match those filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-actions" style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
          <button className="button-primary" onClick={() => { setShowAdd(true); setEditId(null); }} disabled={changing}><Plus className="size-4" /> Add Account</button>
          <button className="button-secondary" onClick={onRefresh}>Refresh</button>
        </div>
      </section>

      {/* Audit Logs */}
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Audit Trail</p><h3>Recent Administrative Actions</h3></div></div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Date</th><th>Administrator</th><th>Action</th><th>Entity</th><th>ID</th></tr>
            </thead>
            <tbody>
              {logs.length ? logs.slice(0, 10).map((log: any) => (
                <tr key={log.id}>
                  <td>{log.createdAt ? new Date(log.createdAt).toLocaleDateString() : "—"}</td>
                  <td>{log.adminName || "Unknown"}</td>
                  <td style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>{log.action}</td>
                  <td>{log.entityType}</td>
                  <td>{log.entityId ?? "—"}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="admin-empty">No audit log entries yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="admin-actions" style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
          <button className="button-secondary" onClick={onRefresh}>Refresh Logs</button>
        </div>
      </section>
    </div>
  );
}

function SchoolsManager({ rows, onDelete, onRefresh }: any) {
  const [form, setForm] = useState({ id: 0, name: "", district: "", description: "", imageUrl: "", latitude: "", longitude: "", status: "published" });
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    try {
      await apiRequest("admin/schools", { method: "POST", body: { ...form, id: form.id || undefined, latitude: form.latitude || null, longitude: form.longitude || null } });
      toast.success("School saved"); setForm({ id: 0, name: "", district: "", description: "", imageUrl: "", latitude: "", longitude: "", status: "published" }); onRefresh();
    } catch (error: any) { toast.error(error.message); } finally { setSaving(false); }
  };
  return (
    <div className="admin-content">
      <section className="admin-panel admin-editor">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Model schools</p><h3>{form.id ? "Edit school" : "Add school"}</h3></div></div>
        <div className="admin-form-grid">
          <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>District<input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} /></label>
          <label className="admin-full">Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></label>
          <label>Image URL<input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></label>
          <label>Latitude<input value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} /></label>
          <label>Longitude<input value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} /></label>
          <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="draft">Draft</option><option value="published">Published</option></select></label>
        </div>
        <div className="admin-form-actions"><button className="button-primary" onClick={submit} disabled={saving}>{saving ? "Saving…" : "Save school"}</button></div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Participating schools</p><h3>{rows.length} schools</h3></div></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>District</th><th>Status</th><th /></tr></thead><tbody>
          {rows.length ? rows.map((row: any) => (
            <tr key={row.id}><td><strong>{row.name}</strong></td><td>{row.district}</td><td><span className={`admin-status ${row.status === "published" ? "admin-status-published" : "admin-status-draft"}`}>{row.status}</span></td><td className="admin-row-actions"><button className="admin-table-action" onClick={() => setForm({ id: row.id, name: row.name, district: row.district, description: row.description ?? "", imageUrl: row.imageUrl ?? "", latitude: row.latitude ?? "", longitude: row.longitude ?? "", status: row.status })}>Edit</button><button className="admin-table-action admin-danger" onClick={() => onDelete(row.id)}><Trash2 className="size-3.5" /></button></td></tr>
          )) : <tr><td colSpan={4} className="admin-empty">No schools yet.</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}

function TeachersManager({ rows, schools, onDelete, onRefresh }: any) {
  const [form, setForm] = useState({ id: 0, fullName: "", email: "", phone: "", schoolId: "", bio: "", photoUrl: "", status: "pending" });
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    try {
      await apiRequest("admin/teachers", { method: "POST", body: { ...form, id: form.id || undefined, schoolId: form.schoolId || null } });
      toast.success("Teacher saved"); setForm({ id: 0, fullName: "", email: "", phone: "", schoolId: "", bio: "", photoUrl: "", status: "pending" }); onRefresh();
    } catch (error: any) { toast.error(error.message); } finally { setSaving(false); }
  };
  return (
    <div className="admin-content">
      <section className="admin-panel admin-editor">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Resident teachers</p><h3>{form.id ? "Edit teacher" : "Add teacher"}</h3></div></div>
        <div className="admin-form-grid">
          <label>Full name<input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label>
          <label>Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          <label>School<select value={form.schoolId} onChange={(e) => setForm({ ...form, schoolId: e.target.value })}><option value="">None selected</option>{schools.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
          <label>Photo URL<input value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} /></label>
          <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="pending">Pending</option><option value="approved">Approved</option><option value="inactive">Inactive</option></select></label>
          <label className="admin-full">Bio<textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} /></label>
        </div>
        <div className="admin-form-actions"><button className="button-primary" onClick={submit} disabled={saving}>{saving ? "Saving…" : "Save teacher"}</button></div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Resident teachers</p><h3>{rows.length} records</h3></div></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>School</th><th>Status</th><th /></tr></thead><tbody>
          {rows.length ? rows.map((row: any) => (
            <tr key={row.id}><td><strong>{row.fullName}</strong><span>{row.email}</span></td><td>{row.schoolName || "—"}</td><td><span className={`admin-status ${row.status === "approved" ? "admin-status-published" : "admin-status-draft"}`}>{row.status}</span></td><td className="admin-row-actions"><button className="admin-table-action" onClick={() => setForm({ id: row.id, fullName: row.fullName, email: row.email ?? "", phone: row.phone ?? "", schoolId: row.schoolId ?? "", bio: row.bio ?? "", photoUrl: row.photoUrl ?? "", status: row.status })}>Edit</button><button className="admin-table-action admin-danger" onClick={() => onDelete(row.id)}><Trash2 className="size-3.5" /></button></td></tr>
          )) : <tr><td colSpan={4} className="admin-empty">No teachers yet.</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}

function AlumniManager({ rows, schools, onDelete, onRefresh }: any) {
  const [form, setForm] = useState({ id: 0, fullName: "", email: "", phone: "", graduationYear: "", schoolId: "", bio: "", status: "pending" });
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    try {
      await apiRequest("admin/alumni", { method: "POST", body: { ...form, id: form.id || undefined, graduationYear: form.graduationYear ? Number(form.graduationYear) : null, schoolId: form.schoolId || null } });
      toast.success("Alumni saved"); setForm({ id: 0, fullName: "", email: "", phone: "", graduationYear: "", schoolId: "", bio: "", status: "pending" }); onRefresh();
    } catch (error: any) { toast.error(error.message); } finally { setSaving(false); }
  };
  return (
    <div className="admin-content">
      <section className="admin-panel admin-editor">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Alumni</p><h3>{form.id ? "Edit alumni" : "Add alumni"}</h3></div></div>
        <div className="admin-form-grid">
          <label>Full name<input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label>
          <label>Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          <label>Graduation year<input value={form.graduationYear} onChange={(e) => setForm({ ...form, graduationYear: e.target.value })} /></label>
          <label>School<select value={form.schoolId} onChange={(e) => setForm({ ...form, schoolId: e.target.value })}><option value="">— None selected</option>{schools.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
          <label className="admin-full">Bio<textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} /></label>
          <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></label>
        </div>
        <div className="admin-form-actions"><button className="button-primary" onClick={submit} disabled={saving}>{saving ? "Saving…" : "Save alumni"}</button></div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Alumni members</p><h3>{rows.length} standalone records</h3></div></div>
        <p className="admin-muted">Resident teachers marked as PTRP Alumni Network members are managed in the Resident Teachers section so their profiles stay in sync.</p>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Graduation</th><th>Status</th><th /></tr></thead><tbody>
          {rows.length ? rows.map((row: any) => (
            <tr key={row.id}><td><strong>{row.fullName}</strong><span>{row.email}</span></td><td>{row.graduationYear || "—"}</td><td><span className={`admin-status ${row.status === "approved" ? "admin-status-published" : "admin-status-draft"}`}>{row.status}</span></td><td className="admin-row-actions"><button className="admin-table-action" onClick={() => setForm({ id: row.id, fullName: row.fullName, email: row.email ?? "", phone: row.phone ?? "", graduationYear: row.graduationYear ?? "", schoolId: row.schoolId ?? "", bio: row.bio ?? "", status: row.status })}>Edit</button><button className="admin-table-action admin-danger" onClick={() => onDelete(row.id)}><Trash2 className="size-3.5" /></button></td></tr>
          )) : <tr><td colSpan={4} className="admin-empty">No standalone alumni records yet. Check Resident Teachers for members flagged as alumni.</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}

function NewsManager({ rows, onDelete, onRefresh }: any) {
  const [form, setForm] = useState({ id: 0, slug: "", title: "", category: "Announcements", excerpt: "", body: "", imageUrl: "", status: "draft" });
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    try {
      await apiRequest("admin/news", { method: "POST", body: { ...form, id: form.id || undefined } });
      toast.success("Article saved"); setForm({ id: 0, slug: "", title: "", category: "Announcements", excerpt: "", body: "", imageUrl: "", status: "draft" }); onRefresh();
    } catch (error: any) { toast.error(error.message); } finally { setSaving(false); }
  };
  return (
    <div className="admin-content">
      <section className="admin-panel admin-editor">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">News and events</p><h3>{form.id ? "Edit article" : "Create article"}</h3></div></div>
        <div className="admin-form-grid">
          <label>Slug<input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></label>
          <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Category<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
          <label>Image URL<input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></label>
          <label className="admin-full">Excerpt<textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} /></label>
          <label className="admin-full">Body<textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={6} /></label>
          <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="draft">Draft</option><option value="published">Published</option></select></label>
        </div>
        <div className="admin-form-actions"><button className="button-primary" onClick={submit} disabled={saving}>{saving ? "Saving…" : "Save article"}</button></div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Articles</p><h3>{rows.length} records</h3></div></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Title</th><th>Category</th><th>Status</th><th /></tr></thead><tbody>
          {rows.length ? rows.map((row: any) => (
            <tr key={row.id}><td><strong>{row.title}</strong><span>{row.slug}</span></td><td>{row.category}</td><td><span className={`admin-status ${row.status === "published" ? "admin-status-published" : "admin-status-draft"}`}>{row.status}</span></td><td className="admin-row-actions"><button className="admin-table-action" onClick={() => setForm({ id: row.id, slug: row.slug, title: row.title, category: row.category, excerpt: row.excerpt ?? "", body: row.body, imageUrl: row.imageUrl ?? "", status: row.status })}>Edit</button><button className="admin-table-action admin-danger" onClick={() => onDelete(row.id)}><Trash2 className="size-3.5" /></button></td></tr>
          )) : <tr><td colSpan={4} className="admin-empty">No articles yet.</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}

function GalleryManager({ rows, onDelete, onRefresh }: any) {
  const [form, setForm] = useState({ id: 0, title: "", caption: "", url: "", mediaType: "image", category: "", status: "approved" });
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    try {
      await apiRequest("admin/gallery", { method: "POST", body: { ...form, id: form.id || undefined } });
      toast.success("Gallery item saved"); setForm({ id: 0, title: "", caption: "", url: "", mediaType: "image", category: "", status: "approved" }); onRefresh();
    } catch (error: any) { toast.error(error.message); } finally { setSaving(false); }
  };
  return (
    <div className="admin-content">
      <section className="admin-panel admin-editor">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Gallery</p><h3>{form.id ? "Edit item" : "Add item"}</h3></div></div>
        <div className="admin-form-grid">
          <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Media URL<input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /></label>
          <label>Type<select value={form.mediaType} onChange={(e) => setForm({ ...form, mediaType: e.target.value })}><option value="image">Image</option><option value="video">Video</option></select></label>
          <label>Category<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
          <label className="admin-full">Caption<textarea value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} rows={2} /></label>
          <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="pending">Pending</option><option value="approved">Approved</option><option value="archived">Archived</option></select></label>
        </div>
        <div className="admin-form-actions"><button className="button-primary" onClick={submit} disabled={saving}>{saving ? "Saving…" : "Save item"}</button></div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Gallery items</p><h3>{rows.length} records</h3></div></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Title</th><th>Type</th><th>Status</th><th /></tr></thead><tbody>
          {rows.length ? rows.map((row: any) => (
            <tr key={row.id}><td><strong>{row.title}</strong><span>{row.url}</span></td><td>{row.mediaType}</td><td><span className={`admin-status ${row.status === "approved" ? "admin-status-published" : "admin-status-draft"}`}>{row.status}</span></td><td className="admin-row-actions"><button className="admin-table-action" onClick={() => setForm({ id: row.id, title: row.title, caption: row.caption ?? "", url: row.url, mediaType: row.mediaType, category: row.category ?? "", status: row.status })}>Edit</button><button className="admin-table-action admin-danger" onClick={() => onDelete(row.id)}><Trash2 className="size-3.5" /></button></td></tr>
          )) : <tr><td colSpan={4} className="admin-empty">No gallery items yet.</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}

function PracticesManager({ rows, onDelete, onRefresh }: any) {
  const [form, setForm] = useState({ id: 0, title: "", category: "Teaching practice", summary: "", body: "", documentUrl: "", imageUrl: "", status: "draft" });
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    setSaving(true);
    try {
      await apiRequest("admin/best-practices", { method: "POST", body: { ...form, id: form.id || undefined } });
      toast.success("Practice saved"); setForm({ id: 0, title: "", category: "Teaching practice", summary: "", body: "", documentUrl: "", imageUrl: "", status: "draft" }); onRefresh();
    } catch (error: any) { toast.error(error.message); } finally { setSaving(false); }
  };
  return (
    <div className="admin-content">
      <section className="admin-panel admin-editor">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Best practices</p><h3>{form.id ? "Edit practice" : "Publish practice"}</h3></div></div>
        <div className="admin-form-grid">
          <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Category<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
          <label>Image URL<input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></label>
          <label>Document URL<input value={form.documentUrl} onChange={(e) => setForm({ ...form, documentUrl: e.target.value })} /></label>
          <label className="admin-full">Summary<textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} /></label>
          <label className="admin-full">Body<textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={6} /></label>
          <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="draft">Draft</option><option value="published">Published</option></select></label>
        </div>
        <div className="admin-form-actions"><button className="button-primary" onClick={submit} disabled={saving}>{saving ? "Saving…" : "Save practice"}</button></div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Best practices</p><h3>{rows.length} records</h3></div></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Title</th><th>Category</th><th>Status</th><th /></tr></thead><tbody>
          {rows.length ? rows.map((row: any) => (
            <tr key={row.id}><td><strong>{row.title}</strong></td><td>{row.category}</td><td><span className={`admin-status ${row.status === "published" ? "admin-status-published" : "admin-status-draft"}`}>{row.status}</span></td><td className="admin-row-actions"><button className="admin-table-action" onClick={() => setForm({ id: row.id, title: row.title, category: row.category, summary: row.summary ?? "", body: row.body, documentUrl: row.documentUrl ?? "", imageUrl: row.imageUrl ?? "", status: row.status })}>Edit</button><button className="admin-table-action admin-danger" onClick={() => onDelete(row.id)}><Trash2 className="size-3.5" /></button></td></tr>
          )) : <tr><td colSpan={4} className="admin-empty">No practices yet.</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}

function TeamManager({ rows, role, onDelete, onRefresh }: { rows: any[]; role: "coordinator" | "mentor"; onDelete: (id: number) => void; onRefresh: () => void }) {
  const [form, setForm] = useState(() => ({
    id: 0,
    fullName: "",
    organization: role === "coordinator" ? "TTC De La Salle Byumba" : "De La Salle",
    email: "",
    phone: "",
    photoUrl: "",
    bio: "",
    responsibilities: "",
    displayOrder: 0,
    isVisible: true,
    status: role === "coordinator" ? "published" : "draft",
  }));
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const organizations = role === "coordinator"
    ? ["TTC De La Salle Byumba", "SAVE"]
    : ["De La Salle", "SAVE"];

  const uploadPhoto = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file for the profile photo.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Profile photos are limited to 10 MB.");
      return;
    }

    setUploadingPhoto(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
        reader.onerror = () => reject(reader.error ?? new Error("Could not read the selected image."));
        reader.readAsDataURL(file);
      });
      const uploaded = await apiRequest<{ url: string }>("admin/media/upload", {
        method: "POST",
        body: {
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          base64,
          altText: form.fullName ? `Portrait of ${form.fullName}` : "Program team profile photo",
        },
      });
      setForm((current) => ({ ...current, photoUrl: uploaded.url }));
      toast.success("Profile photo uploaded. Save the profile to apply it.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Profile photo upload failed.");
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const submit = async () => {
    if (!form.fullName.trim()) {
      toast.error("Enter a name before saving this profile.");
      return;
    }
    setSaving(true);
    try {
      await apiRequest(role === "coordinator" ? "admin/coordinators" : "admin/mentors", {
        method: "POST",
        body: {
          ...form,
          id: form.id || undefined,
          displayOrder: form.displayOrder ? Number(form.displayOrder) : 0,
          isVisible: form.isVisible,
          status: form.status,
        },
      });
      toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} saved`);
      setForm({
        id: 0,
        fullName: "",
        organization: role === "coordinator" ? "TTC De La Salle Byumba" : "De La Salle",
        email: "",
        phone: "",
        photoUrl: "",
        bio: "",
        responsibilities: "",
        displayOrder: 0,
        isVisible: true,
        status: role === "coordinator" ? "published" : "draft",
      });
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Could not save this ${role} profile.`);
    } finally { setSaving(false); }
  };
  return (
    <div className="admin-content">
      <section className="admin-panel admin-editor">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">{role}</p><h3>{form.id ? `Edit ${role}` : `Add ${role}`}</h3></div></div>
        <div className="admin-form-grid">
          <label>Full name<input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Full name" /></label>
          <label>Position<input value={role === "coordinator" ? "Coordinator of PTRP" : "Program Mentor"} readOnly /></label>
          <label>Organization<select value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })}>{organizations.map((organization) => <option key={organization} value={organization}>{organization}</option>)}</select></label>
          <label>Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@domain.rw" /></label>
          <label>Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" /></label>
          <label>Photo URL<input value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} placeholder="Image URL" /></label>
          <label className="upload-drop">
            <UploadCloud className="size-6 text-[#16a878]" />
            <strong>{uploadingPhoto ? "Uploading photo…" : "Upload profile photo"}</strong>
            <small>JPG, PNG, GIF or WebP · Up to 10 MB</small>
            <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" disabled={uploadingPhoto} onChange={(event) => event.target.files?.[0] && uploadPhoto(event.target.files[0])} />
          </label>
          {form.photoUrl && (
            <div className="flex items-center gap-3">
              <img src={resolveMediaUrl(form.photoUrl) ?? form.photoUrl} alt={`Profile photo preview for ${form.fullName || "team member"}`} className="size-16 rounded-lg object-cover" />
              <span className="text-xs font-semibold text-[#4e677f]">Current profile photo</span>
            </div>
          )}
          <label className="admin-full">Biography<textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Short biography" /></label>
          <label className="admin-full">Responsibilities<textarea value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} rows={3} placeholder="Role responsibilities" /></label>
          <label>Display order<input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) || 0 })} /></label>
          <label>Visible<input type="checkbox" checked={form.isVisible} onChange={(e) => setForm({ ...form, isVisible: e.target.checked })} /></label>
          <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="draft">Draft</option><option value="published">Published</option></select></label>
        </div>
        <div className="admin-form-actions"><button className="button-primary" onClick={submit} disabled={saving || uploadingPhoto}>{saving ? "Saving…" : `Save ${role}`}</button></div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">{role === "coordinator" ? "Program Coordinators" : "Program Mentors"}</p><h3>{rows.length} records</h3></div></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Organization</th><th>Status</th><th>Visible</th><th /></tr></thead><tbody>
          {rows.length ? rows.map((row: any) => (
            <tr key={row.id}><td><strong>{row.fullName}</strong><span>{row.organization}</span></td><td>{row.organization}</td><td><span className={`admin-status ${row.status === "published" ? "admin-status-published" : "admin-status-draft"}`}>{row.status}</span></td><td><span className={`admin-status ${row.isVisible ? "admin-status-published" : "admin-status-draft"}`}>{row.isVisible ? "Yes" : "No"}</span></td><td className="admin-row-actions"><button className="admin-table-action" onClick={() => setForm({ id: row.id, fullName: row.fullName, organization: row.organization, email: row.email ?? "", phone: row.phone ?? "", photoUrl: row.photoUrl ?? "", bio: row.bio ?? "", responsibilities: row.responsibilities ?? "", displayOrder: Number(row.displayOrder) || 0, isVisible: row.isVisible, status: row.status })}>Edit</button><button className="admin-table-action admin-danger" onClick={() => onDelete(row.id)}><Trash2 className="size-3.5" /></button></td></tr>
          )) : <tr><td colSpan={5} className="admin-empty">No {role} records yet.</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}

function ResidentTeachersManager({ rows, onSave, onSetStatus, onDelete, onRefresh, saving }: any) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    id: 0, fullName: "", email: "", phone: "", gender: "", modelSchool: "",
    position: "", bestPractice: "", bestPracticeDescription: "", subjects: "",
    skills: "", contributions: "", bio: "", photoUrl: "",
    status: "pending", isFeatured: false, isAlumni: false, displayOrder: 0,
  });
  const [savingLocal, setSavingLocal] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const statuses: { value: string; label: string }[] = [
    { value: "pending", label: "Pending Review" },
    { value: "approved", label: "Approved" },
    { value: "published", label: "Published" },
    { value: "rejected", label: "Rejected" },
    { value: "unpublished", label: "Unpublished" },
  ];

  const submit = async () => {
    setSavingLocal(true);
    try {
      await onSave({ ...form, id: form.id || undefined, isFeatured: form.isFeatured, displayOrder: form.displayOrder ? Number(form.displayOrder) : 0 });
      setForm({ id: 0, fullName: "", email: "", phone: "", gender: "", modelSchool: "", position: "", bestPractice: "", bestPracticeDescription: "", subjects: "", skills: "", contributions: "", bio: "", photoUrl: "", status: "pending", isFeatured: false, isAlumni: false, displayOrder: 0 });
      setEditingId(null);
      onRefresh();
    } catch (error: any) { toast.error(error.message); } finally { setSavingLocal(false); }
  };

  const handleSetStatus = (id: number, status: string) => {
    onSetStatus({ id, status });
  };

  const handleFeature = (id: number, featured: boolean) => {
    onSetStatus({ id, status: rows.find((r: any) => r.id === id)?.status || "published", isFeatured: featured });
  };

  const handleDisplayOrder = (id: number, order: string) => {
    const row = rows.find((r: any) => r.id === id);
    onSetStatus({ id, status: row?.status || "published", isFeatured: row?.isFeatured, displayOrder: Number(order) || 0 });
  };

  const uploadPhoto = async (file: File) => {
    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
      toast.error("Choose a JPG, PNG, GIF, or WEBP image for the profile photo.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Profile photos are limited to 10 MB.");
      return;
    }

    setUploadingPhoto(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
        reader.onerror = () => reject(reader.error ?? new Error("Could not read the selected image."));
        reader.readAsDataURL(file);
      });
      const uploaded = await apiRequest<{ url: string }>("admin/media/upload", {
        method: "POST",
        body: {
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          base64,
          altText: form.fullName ? `Portrait of ${form.fullName}` : "Resident teacher profile photo",
        },
      });
      setForm((current) => ({ ...current, photoUrl: uploaded.url }));
      toast.success("Profile photo uploaded. Save the profile to apply it.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Profile photo upload failed.");
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  return (
    <div className="admin-content">
      {editingId !== null && (
        <section className="admin-panel admin-editor">
          <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Resident Teachers</p><h3>Edit Teacher</h3></div><button className="admin-icon-button" onClick={() => setEditingId(null)} aria-label="Close"><X className="size-4" /></button></div>
          <div className="admin-form-grid">
            <label>Full name<input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label>
            <label>Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label>Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
            <label>Model school<input value={form.modelSchool} onChange={(e) => setForm({ ...form, modelSchool: e.target.value })} /></label>
            <label>Position<input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></label>
            <label>Best practice<input value={form.bestPractice} onChange={(e) => setForm({ ...form, bestPractice: e.target.value })} /></label>
            <label className="admin-full">Best practice description<textarea value={form.bestPracticeDescription} onChange={(e) => setForm({ ...form, bestPracticeDescription: e.target.value })} rows={3} /></label>
            <label className="admin-full">Bio<textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} /></label>
            <label className="admin-full">Contributions<textarea value={form.contributions} onChange={(e) => setForm({ ...form, contributions: e.target.value })} rows={3} /></label>
            <label className="admin-full">Upload profile photo<input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" disabled={uploadingPhoto} onChange={(event) => event.target.files?.[0] && uploadPhoto(event.target.files[0])} /><span>{uploadingPhoto ? "Uploading securely…" : "JPG, PNG, GIF, or WEBP · max 10 MB"}</span></label>
            <label className="admin-full">Photo URL<input value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} /></label>
            {form.photoUrl && <div className="admin-full"><img src={residentTeacherPhotoUrl(form.photoUrl) ?? undefined} alt={`Profile photo preview for ${form.fullName || "resident teacher"}`} className="size-24 rounded-lg object-cover" /></div>}
            <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></label>
            <label>Featured<input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /></label>
            <label>PTRP Alumni Network member<input type="checkbox" checked={form.isAlumni} onChange={(e) => setForm({ ...form, isAlumni: e.target.checked })} /></label>
            <label>Display order<input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) || 0 })} /></label>
          </div>
          <div className="admin-form-actions"><button className="button-primary" onClick={submit} disabled={savingLocal || saving || uploadingPhoto}>{savingLocal || saving ? "Saving…" : uploadingPhoto ? "Uploading photo…" : "Save teacher"}</button></div>
        </section>
      )}
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Resident Teachers</p><h3>{rows.length} registered teachers</h3><button className="button-primary" onClick={() => { setEditingId(null); setForm({ id: 0, fullName: "", email: "", phone: "", gender: "", modelSchool: "", position: "", bestPractice: "", bestPracticeDescription: "", subjects: "", skills: "", contributions: "", bio: "", photoUrl: "", status: "pending", isFeatured: false, isAlumni: false, displayOrder: 0 }); }}><Plus className="size-4" /> Add Teacher</button></div></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Email</th><th>School</th><th>Status</th><th>Featured</th><th /></tr></thead><tbody>
          {rows.length ? rows.map((row: any) => (
            <tr key={row.id}><td><strong>{row.fullName}</strong><span>{row.position || "—"}</span></td><td>{row.email}</td><td>{row.modelSchool || "—"}</td><td><span className={`admin-status ${row.status === "published" ? "admin-status-published" : row.status === "approved" ? "admin-status-published" : "admin-status-draft"}`}>{row.status}</span></td><td><button className="admin-table-action" onClick={() => handleFeature(row.id, !row.isFeatured)}>{row.isFeatured ? "Unfeature" : "Feature"}</button></td><td className="admin-row-actions"><button className="admin-table-action" onClick={() => { setEditingId(row.id); setForm({ id: row.id, fullName: row.fullName, email: row.email, phone: row.phone, gender: row.gender, modelSchool: row.modelSchool, position: row.position, bestPractice: row.bestPractice, bestPracticeDescription: row.bestPracticeDescription, subjects: row.subjects, skills: row.skills, contributions: row.contributions, bio: row.bio, photoUrl: row.photoUrl, status: row.status, isFeatured: row.isFeatured, isAlumni: row.isAlumni, displayOrder: row.displayOrder }); }}><Pencil className="size-3.5" /></button><button className="admin-table-action admin-danger" onClick={() => { if (confirm(`Delete ${row.fullName}?`)) onDelete(row.id); }}><Trash2 className="size-3.5" /></button></td></tr>
          )) : <tr><td colSpan={6} className="admin-empty">No resident teachers registered yet.</td></tr>}
        </tbody></table></div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Bulk Status Actions</p><h3>Approve / Publish teachers</h3></div></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Current Status</th><th>New Status</th><th /></tr></thead><tbody>
          {rows.filter((r: any) => r.status !== "published").length > 0 ? (
            rows.filter((r: any) => r.status !== "published").map((row: any) => (
              <tr key={row.id}><td><strong>{row.fullName}</strong></td><td><span className={`admin-status ${row.status}`}>{row.status}</span></td><td><select value={row.status} onChange={(e) => setForm({ ...form, id: row.id, status: e.target.value })} className="admin-mod-select"><option value="pending">Pending</option><option value="approved">Approved</option><option value="published">Publish</option><option value="rejected">Reject</option><option value="unpublished">Unpublish</option></select></td><td className="admin-row-actions"><button className="admin-table-action" onClick={() => handleSetStatus(row.id, form.status)}>Apply</button></td></tr>
            ))
          ) : <tr><td colSpan={4} className="admin-empty">All teachers are published.</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}

function ResidentBestPracticesManager({ rows, teachers, onSave, onDelete, onRefresh, saving }: any) {
  const [form, setForm] = useState({ id: 0, teacherId: "", title: "", category: "ICT Integration in Education", description: "", mediaUrl: "", mediaType: "" });
  const [savingLocal, setSavingLocal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const submit = async () => {
    setSavingLocal(true);
    try {
      await onSave({ ...form, id: form.id || undefined, teacherId: Number(form.teacherId) || undefined });
      setForm({ id: 0, teacherId: "", title: "", category: "ICT Integration in Education", description: "", mediaUrl: "", mediaType: "" });
      setEditingId(null);
      onRefresh();
    } catch (error: any) { toast.error(error.message); } finally { setSavingLocal(false); }
  };

  return (
    <div className="admin-content">
      {editingId !== null && (
        <section className="admin-panel admin-editor">
          <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Best Practices</p><h3>Edit Best Practice</h3></div><button className="admin-icon-button" onClick={() => setEditingId(null)} aria-label="Close"><X className="size-4" /></button></div>
          <div className="admin-form-grid">
            <label>Teacher<select value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })}><option value="">Select teacher</option>{teachers.map((t: any) => <option key={t.id} value={t.id}>{t.fullName}</option>)}</select></label>
            <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
            <label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="ICT Integration in Education">ICT Integration in Education</option><option value="Learner-Centred Teaching">Learner-Centred Teaching</option><option value="Competency-Based Education">Competency-Based Education</option><option value="Project-Based Learning">Project-Based Learning</option><option value="Inclusive Education">Inclusive Education</option><option value="Assessment for Learning">Assessment for Learning</option><option value="Collaborative Learning">Collaborative Learning</option><option value="Classroom Management">Classroom Management</option><option value="Digital Learning Resources">Digital Learning Resources</option><option value="Innovative Teaching Strategies">Innovative Teaching Strategies</option></select></label>
            <label className="admin-full">Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} /></label>
            <label>Media URL<input value={form.mediaUrl} onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })} placeholder="Image, video, or document URL" /></label>
            <label>Media Type<select value={form.mediaType} onChange={(e) => setForm({ ...form, mediaType: e.target.value })}><option value="image">Image</option><option value="video">Video</option><option value="document">Document</option></select></label>
          </div>
          <div className="admin-form-actions"><button className="button-primary" onClick={submit} disabled={savingLocal || saving}>{savingLocal || saving ? "Saving…" : "Save best practice"}</button></div>
        </section>
      )}
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Best Practices</p><h3>{rows.length} practices</h3><button className="button-primary" onClick={() => { setEditingId(null); setForm({ id: 0, teacherId: "", title: "", category: "ICT Integration in Education", description: "", mediaUrl: "", mediaType: "" }); }}><Plus className="size-4" /> Add Practice</button></div></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Title</th><th>Teacher</th><th>Category</th><th /></tr></thead><tbody>
          {rows.length ? rows.map((row: any) => (
            <tr key={row.id}><td><strong>{row.title}</strong></td><td>{row.teacherName || "—"}</td><td>{row.category}</td><td className="admin-row-actions"><button className="admin-table-action" onClick={() => { setEditingId(row.id); setForm({ id: row.id, teacherId: row.teacherId, title: row.title, category: row.category, description: row.description, mediaUrl: row.mediaUrl, mediaType: row.mediaType }); }}><Pencil className="size-3.5" /></button><button className="admin-table-action admin-danger" onClick={() => { if (confirm(`Delete "${row.title}"?`)) onDelete(row.id); }}><Trash2 className="size-3.5" /></button></td></tr>
          )) : <tr><td colSpan={4} className="admin-empty">No best practices yet.</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}
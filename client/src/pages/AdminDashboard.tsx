import { useAuth } from "@/_core/hooks/useAuth";
import { apiRequest, queryKeys, useApiQuery } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Archive, BarChart3, BookOpen, Building2, CheckCircle2, FileText, GraduationCap,
  ImagePlus, LayoutDashboard, Loader2, LogOut, Pencil, Plus, School, ShieldCheck,
  Trash2, UploadCloud, UserCog, UsersRound, X, KeyRound, AlertCircle,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { SocialManager } from "./SocialManager";

type AdminTab =
  | "overview" | "content" | "uploads" | "users"
  | "schools" | "teachers" | "alumni" | "news" | "gallery" | "practices"
  | "social";

const starterPages = [
  { slug: "home", title: "PTR Alumni Network home", summary: "Hero, program snapshot, and homepage narrative", body: "Keep this record for the public homepage." },
  { slug: "about", title: "About PTR Alumni Network", summary: "Program background, mission, values, and approach", body: "Add the verified program background here." },
  { slug: "network", title: "Our Network", summary: "Resident teachers and model schools", body: "Add approved network details here." },
  { slug: "impact", title: "Impact and evidence", summary: "Verified indicators and demonstrated outcomes", body: "Only publish verified indicators, reporting dates, sources, and evidence-aware outcome language here." },
];

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
      setError("Please enter your administrator username and password.");
      return;
    }
    setLoading(true);
    try {
      const u = await login({ username, password });
      if (u.role !== "admin") {
        setError("Your account is authenticated, but does not have administrator privileges.");
      } else {
        toast.success("Administrator session verified.");
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
        <h1>Administrator Portal</h1>
        <p className="admin-access-subtitle">Secure control panel for the PTR Alumni Network.</p>

        {error && (
          <div style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca", padding: "0.75rem", borderRadius: "8px", fontSize: "0.8rem", marginBottom: "1rem", textAlign: "left" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem", textAlign: "left" }}>
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#4b5563", display: "block", marginBottom: "0.3rem" }}>
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Residents teachers"
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
              style={{ width: "100%", padding: "0.65rem 0.85rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9rem", color: "#111" }}
            />
          </div>

          <button type="submit" disabled={loading} className="button-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
            {loading ? "Authenticating…" : "Sign In to Admin Portal"} <ShieldCheck className="size-4" />
          </button>
        </form>

        <p className="admin-muted" style={{ marginTop: "1.25rem", fontSize: "0.75rem" }}>
          This workspace is strictly restricted to authorized administrators. All administrative operations are monitored and protected.
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
  const queryClient = useQueryClient();

  const overview = useApiQuery<any>(queryKeys.adminOverview, "admin/overview", isAdmin);
  const content = useApiQuery<any[]>(queryKeys.adminContent, "admin/content", isAdmin);
  const media = useApiQuery<any[]>(queryKeys.adminMedia, "admin/media", isAdmin);
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

  const saveContent = useMutation({ mutationFn: (input: typeof contentForm) => apiRequest("admin/content", { method: "POST", body: input }), onSuccess: async () => { toast.success("Content saved"); setEditing(null); setContentForm({ slug: "", title: "", summary: "", body: "", status: "draft" }); await queryClient.invalidateQueries({ queryKey: queryKeys.adminContent }); await queryClient.invalidateQueries({ queryKey: queryKeys.adminOverview }); }, onError: (error: Error) => toast.error(error.message) });

  const uploadMedia = useMutation({ mutationFn: (input: { filename: string; mimeType: string; size: number; base64: string; altText: string | null }) => apiRequest("admin/media/upload", { method: "POST", body: input }), onSuccess: async () => { toast.success("Upload added to the media library"); setUploadAlt(""); if (fileRef.current) fileRef.current.value = ""; await queryClient.invalidateQueries({ queryKey: queryKeys.adminMedia }); await queryClient.invalidateQueries({ queryKey: queryKeys.adminOverview }); }, onError: (error: Error) => toast.error(error.message) });

  const updateMedia = useMutation({ mutationFn: (input: { id: number; altText?: string | null; status?: "pending" | "approved" | "archived" }) => apiRequest(`admin/media/${input.id}`, { method: "PUT", body: { altText: input.altText, status: input.status } }), onSuccess: async () => { toast.success("Media status updated"); await queryClient.invalidateQueries({ queryKey: queryKeys.adminMedia }); }, onError: (error: Error) => toast.error(error.message) });

  const setRole = useMutation({ mutationFn: (input: { id: number; role: "user" | "admin" }) => apiRequest(`admin/users/${input.id}/role`, { method: "PATCH", body: { role: input.role } }), onSuccess: async () => { toast.success("Role updated"); await queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers }); }, onError: (error: Error) => toast.error(error.message) });

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

  if (authLoading) return <div className="admin-loading"><Loader2 className="size-6 animate-spin" /> Checking administrator access…</div>;
  if (!user) return <AdminLoginForm />;
  if (!isAdmin) return (
    <div className="admin-access">
      <div className="admin-access-card" style={{ maxWidth: 440 }}>
        <ShieldCheck className="size-10 text-[#e6a24b]" style={{ margin: "0 auto 1rem" }} />
        <h1>Admin access required</h1>
        <p className="admin-access-subtitle">Your account is signed in as <strong>{user.email}</strong>, but is not assigned the administrator role.</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.5rem" }}>
          <button className="button-secondary" onClick={() => logout()}>Sign out</button>
          <button className="button-primary" onClick={() => window.location.href = "/"}><LogOut className="size-4" /> Return to site</button>
        </div>
      </div>
    </div>
  );

  const openEditor = (row?: typeof contentRows[number]) => {
    if (row) { setEditing(row.id); setContentForm({ slug: row.slug, title: row.title, summary: row.summary ?? "", body: row.body, status: row.status }); }
    else { setEditing(0); setContentForm({ slug: "", title: "", summary: "", body: "", status: "draft" }); }
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
    { id: "uploads", label: "Media uploads", icon: ImagePlus },
    { id: "schools", label: "Schools", icon: School },
    { id: "teachers", label: "Resident teachers", icon: GraduationCap },
    { id: "alumni", label: "Alumni", icon: UsersRound },
    { id: "news", label: "News & events", icon: BookOpen },
    { id: "gallery", label: "Gallery", icon: ImagePlus },
    { id: "practices", label: "Best practices", icon: Archive },
    { id: "social", label: "Social Media", icon: Smartphone },
    { id: "users", label: "Access and roles", icon: UserCog },
  ];

  return (
    <main className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-brand"><div className="admin-brand-mark">P</div><div><strong>PTR Alumni Network Control</strong><span>Alumni Network</span></div></div>
        <div className="admin-role"><ShieldCheck className="size-4" /><span>Administrator workspace</span></div>
        <nav className="admin-nav" aria-label="Admin sections">
          {navItems.map((item) => <button key={item.id} className={tab === item.id ? "admin-nav-active" : ""} onClick={() => setTab(item.id)}><item.icon className="size-4" />{item.label}</button>)}
        </nav>
        <div className="admin-sidebar-bottom"><a href="/" className="admin-back-link">View public site ↗</a><button className="admin-signout" onClick={() => logout()}><LogOut className="size-4" /> Sign out</button></div>
      </aside>
      <section className="admin-main">
        <header className="admin-header">
          <div>
            <p className="eyebrow text-[#168d6d]">Protected administration</p>
            <h1>{tab === "overview" ? "Keep every public surface trustworthy." : tab === "content" ? "Edit website content" : tab === "uploads" ? "Manage media uploads" : tab === "schools" ? "Manage model schools" : tab === "teachers" ? "Manage resident teachers" : tab === "alumni" ? "Manage alumni" : tab === "news" ? "Manage news and events" : tab === "gallery" ? "Manage gallery" : tab === "practices" ? "Manage best practices" : tab === "social" ? "Social Media Integration" : "Access and roles"}</h1>
            <p>Signed in as <strong>{user.name || user.email || "Administrator"}</strong>. Only approved administrators can change public content.</p>
          </div>
          <div className="admin-header-actions"><span className="admin-user-pill"><span className="admin-online-dot" /> Admin</span><button className="admin-icon-button" onClick={() => window.location.href = "/"} aria-label="Close admin workspace"><X className="size-4" /></button></div>
        </header>

        {tab === "overview" && <OverviewPanel stats={overview.data} onNavigate={setTab} onSeedHome={() => openEditor()} />}
        {tab === "content" && <ContentManager rows={contentRows} editing={editing} form={contentForm} setForm={setContentForm} onSave={() => saveContent.mutate(contentForm)} saving={saveContent.isPending} onOpenEditor={openEditor} onCancel={() => setEditing(null)} />}
        {tab === "uploads" && <UploadManager rows={mediaRows} altText={uploadAlt} setAltText={setUploadAlt} fileRef={fileRef} onFile={uploadFile} uploading={uploadMedia.isPending} onArchive={(id: number) => updateMedia.mutate({ id, status: "archived" })} />}
        {tab === "users" && <UsersManager rows={userRows} onRole={(id: number, role: "user" | "admin") => setRole.mutate({ id, role })} changing={setRole.isPending} onRefresh={() => queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers })} />}
        {tab === "schools" && <SchoolsManager rows={schoolRows} onDelete={(id: number) => deleteSchool.mutate(id)} onRefresh={() => queryClient.invalidateQueries({ queryKey: queryKeys.adminSchools })} />}
        {tab === "teachers" && <TeachersManager rows={teacherRows} schools={schoolRows} onDelete={(id: number) => deleteTeacher.mutate(id)} onRefresh={() => queryClient.invalidateQueries({ queryKey: queryKeys.adminTeachers })} />}
        {tab === "alumni" && <AlumniManager rows={alumniRows} schools={schoolRows} onDelete={(id: number) => deleteAlumni.mutate(id)} onRefresh={() => queryClient.invalidateQueries({ queryKey: queryKeys.adminAlumni })} />}
        {tab === "news" && <NewsManager rows={newsRows} onDelete={(id: number) => deleteNews.mutate(id)} onRefresh={() => queryClient.invalidateQueries({ queryKey: queryKeys.adminNews })} />}
        {tab === "gallery" && <GalleryManager rows={galleryRows} onDelete={(id: number) => deleteGallery.mutate(id)} onRefresh={() => queryClient.invalidateQueries({ queryKey: queryKeys.adminGallery })} />}
        {tab === "practices" && <PracticesManager rows={practiceRows} onDelete={(id: number) => deletePractice.mutate(id)} onRefresh={() => queryClient.invalidateQueries({ queryKey: queryKeys.adminPractices })} />}
        {tab === "social" && <SocialManager accounts={socialAccountRows} posts={socialPostRows} syncLogs={socialSyncLogRows} onConnect={connectAccount.mutate} onDisconnect={disconnectAccount.mutate} onModerate={moderatePost.mutate} onPublish={publishPost.mutate} onSync={syncAccounts.mutate} connecting={connectAccount.isPending} syncing={syncAccounts.isPending} moderating={moderatePost.isPending} publishing={publishPost.isPending} onRefresh={() => { invalidate(queryKeys.adminSocialAccounts); invalidate(queryKeys.adminSocialPosts); invalidate(queryKeys.adminSocialSyncLogs); }} />}
      </section>
    </main>
  );
}

function OverviewPanel({ stats, onNavigate, onSeedHome }: any) {
  const cards = [
    { id: "schools", label: "Model schools", value: stats?.schoolCount ?? 0, desc: "TTC-partner demonstration schools" },
    { id: "teachers", label: "Resident teachers", value: stats?.teacherCount ?? 0, desc: `${stats?.pendingTeachers ?? 0} pending review` },
    { id: "alumni", label: "Alumni network", value: stats?.alumniCount ?? 0, desc: `${stats?.pendingAlumni ?? 0} pending review` },
    { id: "news", label: "News & updates", value: stats?.newsCount ?? 0, desc: "Articles, briefings, events" },
    { id: "gallery", label: "Gallery records", value: stats?.galleryCount ?? 0, desc: "Photos & event videos" },
    { id: "practices", label: "Best practices", value: stats?.practiceCount ?? 0, desc: "Documented classroom resources" },
    { id: "content", label: "Site content", value: stats?.publishedCount ?? 0, desc: `${stats?.publishedCount ?? 0} total revisions` },
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
        <p className="admin-muted">Manage the PTR Alumni Network repository from this workspace. Publish verified news, maintain alumni and teacher directories, and upload approved media assets.</p>
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
    </div>
  );
}

function ContentManager({ rows, editing, form, setForm, onSave, saving, onOpenEditor, onCancel }: any) {
  return (
    <div className="admin-content">
      {editing !== null && (
        <section className="admin-panel admin-editor">
          <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">{editing ? "Edit record" : "New record"}</p><h3>Content editor</h3></div><button className="admin-icon-button" onClick={onCancel} aria-label="Close editor"><X className="size-4" /></button></div>
          <div className="admin-form-grid">
            <label>Slug<input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="about" /></label>
            <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Page title" /></label>
            <label className="admin-full">Summary<textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} placeholder="Short description" /></label>
            <label className="admin-full">Body<textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={7} placeholder="Approved content" /></label>
            <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}><option value="draft">Draft</option><option value="published">Published</option></select></label>
          </div>
          <div className="admin-form-actions"><button className="button-secondary" onClick={onCancel}>Cancel</button><button className="button-primary" onClick={onSave} disabled={saving}>{saving ? "Saving…" : "Save record"}</button></div>
          </section>
      )}
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Website content</p><h3>{rows.length} records</h3></div></div>
        <div className="admin-table-wrap">
          <table className="admin-table"><thead><tr><th>Slug</th><th>Title</th><th>Status</th><th>Updated</th><th /></tr></thead><tbody>
            {rows.length ? rows.map((row: any) => (
              <tr key={row.id}><td><strong>{row.slug}</strong></td><td>{row.title}</td><td><span className={`admin-status ${row.status === "published" ? "admin-status-published" : "admin-status-draft"}`}>{row.status}</span></td><td>{row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : "—"}</td><td><button className="admin-table-action" onClick={() => onOpenEditor(row)}>Edit</button></td></tr>
            )) : <tr><td colSpan={5} className="admin-empty">No content records yet.</td></tr>}
          </tbody></table>
        </div>
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
              {row.mimeType?.startsWith("image/") ? <img src={row.url} alt={row.altText || row.filename} /> : <div className="admin-media-file"><FileText className="size-7" /><span>{row.mimeType?.split("/").pop()}</span></div>}
              <div className="admin-media-meta"><strong title={row.filename}>{row.filename}</strong><span>{Math.round(row.size / 1024)} KB · {row.status}</span><div className="admin-media-actions"><a href={row.url} target="_blank" rel="noreferrer">Open</a><button onClick={() => onArchive(row.id)}>Archive</button></div></div>
            </article>
          )) : <p className="admin-empty">No uploads yet.</p>}
        </div>
      </section>
    </div>
  );
}

function UsersManager({ rows, onRole, changing, onRefresh }: any) {
  const [showAdd, setShowAdd] = useState(false);
  const [resetId, setResetId] = useState<number | null>(null);
  const [resetPasswordVal, setResetPasswordVal] = useState("");
  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", role: "admin" as "user" | "admin" });
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.email || !addForm.password) {
      toast.error("All fields are required.");
      return;
    }
    setSaving(true);
    try {
      await apiRequest("admin/users", { method: "POST", body: addForm });
      toast.success("User created successfully");
      setShowAdd(false);
      setAddForm({ name: "", email: "", password: "", role: "admin" });
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
    if (!confirm("Are you sure you want to remove this user account?")) return;
    try {
      await apiRequest(`admin/users/${id}`, { method: "DELETE" });
      toast.success("User removed");
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  return (
    <div className="admin-content">
      {showAdd && (
        <section className="admin-panel admin-editor">
          <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">User Provisioning</p><h3>Create Administrator or Member Account</h3></div></div>
          <form onSubmit={handleAdd}>
            <div className="admin-form-grid">
              <label>Full Name<input required value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} placeholder="Full name" /></label>
              <label>Email Address<input required type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} placeholder="name@domain.rw" /></label>
              <label>Initial Password (min 8 chars)<input required type="password" minLength={8} value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} placeholder="••••••••" /></label>
              <label>Role<select value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value as "user" | "admin" })}><option value="admin">Administrator</option><option value="user">User / Member</option></select></label>
            </div>
            <div className="admin-form-actions">
              <button type="button" className="button-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button type="submit" className="button-primary" disabled={saving}>{saving ? "Saving…" : "Create Account"}</button>
            </div>
          </form>
        </section>
      )}

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

      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Access control</p><h3>{rows.length} authenticated accounts</h3></div></div>
        <p className="admin-muted">Only administrators can edit the site and manage uploads. Role changes are restricted server-side to the project owner.</p>
        <div className="admin-table-wrap">
          <table className="admin-table"><thead><tr><th>Account</th><th>Role</th><th>Last sign-in</th><th /></tr></thead><tbody>
            {rows.length ? rows.map((row: any) => (
              <tr key={row.id}><td><strong>{row.name || "Unnamed account"}</strong><span>{row.email || "No email supplied"}</span></td><td><span className={`admin-status ${row.role === "admin" ? "admin-status-published" : "admin-status-draft"}`}>{row.role}</span></td><td>{row.lastSignedIn ? new Date(row.lastSignedIn).toLocaleDateString() : "—"}</td><td><button className="admin-table-action" disabled={changing} onClick={() => onRole(row.id, row.role === "admin" ? "user" : "admin")}>{row.role === "admin" ? "Remove admin" : "Make admin"}</button></td></tr>
            )) : <tr><td colSpan={4} className="admin-empty">No authenticated users have signed in yet.</td></tr>}
          </tbody></table>
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
        <div className="admin-panel-heading"><div><p className="eyebrow text-[#168d6d]">Alumni members</p><h3>{rows.length} records</h3></div></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Graduation</th><th>Status</th><th /></tr></thead><tbody>
          {rows.length ? rows.map((row: any) => (
            <tr key={row.id}><td><strong>{row.fullName}</strong><span>{row.email}</span></td><td>{row.graduationYear || "—"}</td><td><span className={`admin-status ${row.status === "approved" ? "admin-status-published" : "admin-status-draft"}`}>{row.status}</span></td><td className="admin-row-actions"><button className="admin-table-action" onClick={() => setForm({ id: row.id, fullName: row.fullName, email: row.email ?? "", phone: row.phone ?? "", graduationYear: row.graduationYear ?? "", schoolId: row.schoolId ?? "", bio: row.bio ?? "", status: row.status })}>Edit</button><button className="admin-table-action admin-danger" onClick={() => onDelete(row.id)}><Trash2 className="size-3.5" /></button></td></tr>
          )) : <tr><td colSpan={4} className="admin-empty">No alumni yet.</td></tr>}
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
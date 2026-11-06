import { apiRequest } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  RefreshCw, Smartphone, FileVideo, Trash2, Plus,
} from "lucide-react";
import { useState } from "react";
import { PublicImage } from "@/components/ptrp/PublicImage";

const platformLabels: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
};
const platformColor: Record<string, string> = {
  facebook: "#1877f2",
  instagram: "#e1306c",
  youtube: "#ff0000",
  tiktok: "#fe2c55",
};

export function SocialManager({
  accounts,
  posts,
  syncLogs,
  onConnect,
  onDisconnect,
  onModerate,
  onPublish,
  onSync,
  connecting,
  syncing,
  moderating,
  publishing,
  onRefresh,
}: any) {
  const [connectForm, setConnectForm] = useState({
    platform: "",
    accountId: "",
    accountName: "",
    pageId: "",
    accessToken: "",
    refreshToken: "",
    tokenExpiresAt: "",
  });
  const [showConnect, setShowConnect] = useState(false);
  const [moderateId, setModerateId] = useState<number | null>(null);
  const [moderateAction, setModerateAction] = useState<
    "approve" | "reject" | "archive" | "publish"
  >("approve");
  const [publishSection, setPublishSection] = useState<
    "gallery" | "news" | "videos" | "homepage"
  >("gallery");

  const fbConnected = accounts.some((a: any) => a.platform === "facebook" && a.status === "connected");
  const igConnected = accounts.some((a: any) => a.platform === "instagram" && a.status === "connected");
  const ytConnected = accounts.some((a: any) => a.platform === "youtube" && a.status === "connected");
  const tkConnected = accounts.some((a: any) => a.platform === "tiktok" && a.status === "connected");

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConnectForm({ ...connectForm, platform: e.target.value });
  };
  const handleAccountIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnectForm({ ...connectForm, accountId: e.target.value });
  };
  const handleAccountNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnectForm({ ...connectForm, accountName: e.target.value });
  };
  const handlePageIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnectForm({ ...connectForm, pageId: e.target.value });
  };
  const handleAccessTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnectForm({ ...connectForm, accessToken: e.target.value });
  };
  const handleRefreshTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnectForm({ ...connectForm, refreshToken: e.target.value });
  };
  const handleTokenExpiresAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnectForm({ ...connectForm, tokenExpiresAt: e.target.value });
  };
  const handleConnectClose = () => { setShowConnect(false); };
  const handleToggleConnect = () => { setShowConnect(!showConnect); };

  const submitConnect = async () => {
    try {
      await onConnect({
        platform: connectForm.platform,
        accountId: connectForm.accountId,
        accountName: connectForm.accountName,
        pageId: connectForm.pageId || undefined,
        accessToken: connectForm.accessToken,
        refreshToken: connectForm.refreshToken || undefined,
        tokenExpiresAt: connectForm.tokenExpiresAt || undefined,
      });
      toast.success("Social account connected");
      setShowConnect(false);
      setConnectForm({ platform: "", accountId: "", accountName: "", pageId: "", accessToken: "", refreshToken: "", tokenExpiresAt: "" });
      onRefresh();
    } catch (e: any) { toast.error(e.message || "Failed to connect account"); }
  };

  const doModerate = async (id: number, action: "approve" | "reject" | "archive" | "publish") => {
    try {
      if (action === "publish") { await onPublish({ id, section: publishSection }); } else { await onModerate({ id, action }); }
      toast.success(`Post ${action}d`);
      setModerateId(null);
      onRefresh();
    } catch (error: any) { toast.error(error.message || "Failed to update post"); }
  };

  const doSync = async () => {
    try { await onSync(); } catch (error: any) { toast.error(error.message || "Sync failed"); }
  };

  const handleModerateActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModerateAction(e.target.value as any);
  };
  const handlePublishSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPublishSection(e.target.value as any);
  };
  const handleApplyModerate = (id: number, action: string) => { doModerate(id, action as any); };
  const handleCancelModerate = () => { setModerateId(null); };
  const handleSetModerate = (id: number, action: string) => { setModerateId(rowIdForSet(id)); setModerateAction(action as any); };
  const rowIdForSet = (id: number) => id;

  const renderAccountRow = (row: any) => (
    <tr key={row.id}>
      <td><span style={{ color: platformColor[row.platform] || "#0098d9", fontWeight: 700 }}>{platformLabels[row.platform]}</span></td>
      <td><strong>{row.accountName}</strong><span>{row.pageId ? `· Page ${row.pageId}` : ""}</span></td>
      <td><span className={`admin-status ${row.status === "connected" ? "admin-status-published" : "admin-status-draft"}`}>{row.status}</span></td>
      <td>{row.lastSyncAt ? new Date(row.lastSyncAt).toLocaleDateString() : "—"}</td>
      <td>{row.syncError || "—"}</td>
      <td className="admin-row-actions"><button className="admin-table-action admin-danger" onClick={() => onDisconnect(row.id)}><Trash2 className="size-3.5" /></button></td>
    </tr>
  );

  const renderPostRow = (row: any) => (
    <tr key={row.id}>
      <td><span style={{ color: platformColor[row.platform] || "#0098d9", fontWeight: 700 }}>{platformLabels[row.platform]}</span></td>
      <td><strong>{row.authorName || "Unknown"}</strong></td>
      <td className="admin-social-preview">
        {row.mediaUrl && row.mediaType === "image" ? <PublicImage src={row.mediaUrl} alt={row.message} className="social-thumb" loading="lazy" /> : row.mediaType === "video" ? <FileVideo className="size-4 text-[#0098d9]" /> : <span className="text-[#6b7280]">Text post</span>}
        <span className="social-text">{row.message || ""}</span>
      </td>
      <td>{row.publishedAt ? new Date(row.publishedAt).toLocaleDateString() : "—"}</td>
      <td><span className={`admin-status ${row.websiteStatus === "approved" || row.websiteStatus === "published" ? "admin-status-published" : "admin-status-draft"}`}>{row.websiteStatus}</span></td>
      <td className="admin-row-actions">
        {moderateId === row.id ? (
          <div className="admin-moderate-form">
            <select value={moderateAction} onChange={handleModerateActionChange} className="admin-mod-select">
              <option value="approve">Approve</option><option value="reject">Reject</option><option value="archive">Archive</option><option value="publish">Publish to…</option>
            </select>
            {moderateAction === "publish" && (
              <select value={publishSection} onChange={handlePublishSectionChange} className="admin-mod-select">
                <option value="gallery">Gallery</option><option value="news">News</option><option value="videos">Videos</option><option value="homepage">Homepage</option>
              </select>
            )}
            <button className="button-primary" onClick={() => handleApplyModerate(row.id, moderateAction)} disabled={moderating}>{moderating ? "…" : "Apply"}</button>
            <button className="button-secondary" onClick={handleCancelModerate}>Cancel</button>
          </div>
        ) : (
          <div className="admin-action-grid" style={{ display: "flex", gap: "0.4rem" }}>
            <button className="admin-table-action" onClick={() => handleSetModerate(row.id, "approve")}>Approve</button>
            <button className="admin-table-action" onClick={() => handleSetModerate(row.id, "reject")}>Reject</button>
            <button className="admin-table-action" onClick={() => handleSetModerate(row.id, "publish")}>Publish</button>
          </div>
        )}
      </td>
    </tr>
  );

  const renderSyncLogRow = (row: any) => (
    <tr key={row.id}>
      <td>{platformLabels[row.platform]}</td>
      <td><span className={`admin-status ${row.status === "success" ? "admin-status-published" : "admin-status-draft"}`}>{row.status}</span></td>
      <td>{row.recordsFetched}</td><td>{row.recordsImported}</td><td>{row.recordsUpdated}</td>
      <td>{row.startedAt ? new Date(row.startedAt).toLocaleDateString() : "—"}</td>
      <td>{row.errorMessage || "—"}</td>
    </tr>
  );

  return (
    <div className="admin-content">
      <section className="admin-panel admin-editor">
        <div className="admin-panel-heading">
          <div><p className="eyebrow text-[#168d6d]">Connect social account</p><h3>Add a platform account</h3></div>
          <button className="button-primary" onClick={handleToggleConnect}>
            {showConnect ? "Cancel" : "Connect Account"} <Plus className="size-4" />
          </button>
        </div>
        {showConnect && (
          <div className="admin-form-grid">
            <label>Platform<select value={connectForm.platform} onChange={handlePlatformChange}><option value="">Select platform</option><option value="facebook">Facebook</option><option value="instagram">Instagram</option><option value="youtube">YouTube</option><option value="tiktok">TikTok</option></select></label>
            <label>Account ID<input value={connectForm.accountId} onChange={handleAccountIdChange} placeholder="Platform user/page ID" /></label>
            <label>Account Name<input value={connectForm.accountName} onChange={handleAccountNameChange} placeholder="Display name" /></label>
            <label>Page ID<input value={connectForm.pageId} onChange={handlePageIdChange} placeholder="Facebook Page ID (optional)" /></label>
            <label>Access Token<input value={connectForm.accessToken} onChange={handleAccessTokenChange} /></label>
            <label>Refresh Token<input value={connectForm.refreshToken} onChange={handleRefreshTokenChange} placeholder="OAuth refresh token" /></label>
            <label>Token Expires At<input type="datetime-local" value={connectForm.tokenExpiresAt} onChange={handleTokenExpiresAtChange} /></label>
            <div className="admin-form-actions"><button className="button-secondary" onClick={handleConnectClose}>Cancel</button><button className="button-primary" onClick={submitConnect} disabled={connecting}>{connecting ? "Connecting…" : "Connect Account"}</button></div>
          </div>
        )}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div><p className="eyebrow text-[#168d6d]">Connected accounts</p><h3>{accounts.length} account(s)</h3></div>
          <div className="admin-action-grid" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button className="button-primary" onClick={doSync} disabled={syncing}><RefreshCw className="size-4" /> {syncing ? "Syncing…" : "Sync All Accounts"}</button>
            <button className="button-secondary" onClick={onRefresh}>Refresh</button>
          </div>
          <p className="admin-muted">Connected social media accounts. Use Sync to import recent posts from each account.</p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Platform</th><th>Account</th><th>Status</th><th>Last sync</th><th>Error</th><th /></tr></thead>
              <tbody>
                {accounts.length ? accounts.map(renderAccountRow) : [<tr key="empty-accounts"><td colSpan={6} className="admin-empty">No connected social media accounts.</td></tr>]}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div><p className="eyebrow text-[#168d6d]">Post moderation queue</p><h3>{posts.length} pending item(s)</h3></div>
          <p className="admin-muted">Imported posts await your approval before appearing on the website.</p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Platform</th><th>Author</th><th>Preview</th><th>Posted</th><th>Website status</th><th>Actions</th></tr></thead>
              <tbody>
                {posts.length ? posts.map(renderPostRow) : [<tr key="empty-posts"><td colSpan={6} className="admin-empty">No pending posts. Sync an account to import content.</td></tr>]}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div><p className="eyebrow text-[#168d6d]">Sync history</p><h3>{syncLogs.length} sync run(s)</h3></div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Platform</th><th>Status</th><th>Fetched</th><th>Imported</th><th>Updated</th><th>Started</th><th>Error</th></tr></thead>
            <tbody>
              {syncLogs.length ? syncLogs.map(renderSyncLogRow) : [<tr key="empty-sync"><td colSpan={7} className="admin-empty">No sync history yet.</td></tr>]}
              </tbody>
          </table>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div><p className="eyebrow text-[#168d6d]">Platform setup</p><h3>Configure API credentials</h3></div>
        </div>
        <div className="admin-muted">Configure OAuth credentials in <code>config.php</code> (or environment variables) before connecting accounts:</div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Platform</th><th>Required credentials</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              <tr>
                <td><span style={{ color: "#1877f2", fontWeight: 700 }}>Facebook</span></td>
                <td>App ID + App Secret</td>
                <td><span className={`admin-status ${fbConnected ? "admin-status-published" : "admin-status-draft"}`}>{fbConnected ? "Connected" : "Not configured"}</span></td>
                <td><button className="admin-table-action">Get OAuth URL</button></td>
              </tr>
              <tr>
                <td><span style={{ color: "#e1306c", fontWeight: 700 }}>Instagram</span></td>
                <td>App ID + App Secret</td>
                <td><span className={`admin-status ${igConnected ? "admin-status-published" : "admin-status-draft"}`}>{igConnected ? "Connected" : "Not configured"}</span></td>
                <td><button className="admin-table-action">Get OAuth URL</button></td>
              </tr>
              <tr>
                <td><span style={{ color: "#ff0000", fontWeight: 700 }}>YouTube</span></td>
                <td>API Key</td>
                <td><span className={`admin-status ${ytConnected ? "admin-status-published" : "admin-status-draft"}`}>{ytConnected ? "Connected" : "Not configured"}</span></td>
                <td><button className="admin-table-action">Get OAuth URL</button></td>
              </tr>
              <tr>
                <td><span style={{ color: "#fe2c55", fontWeight: 700 }}>TikTok</span></td>
                <td>App ID + App Secret</td>
                <td><span className={`admin-status ${tkConnected ? "admin-status-published" : "admin-status-draft"}`}>{tkConnected ? "Connected" : "Not configured"}</span></td>
                <td><button className="admin-table-action">Get OAuth URL</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

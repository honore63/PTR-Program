import { useState } from "react";
import { ArrowLeft, ShieldCheck, UsersRound, Instagram, Facebook, Send, Youtube, Linkedin, Music2, AtSign, CheckCircle2, AlertCircle, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "wouter";
import { copy, socialLinks, type Language } from "@/data/ptrp";
import { BrandMark } from "@/components/ptrp/BrandMark";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

type PortalProps = { language: Language };
type AuthMode = "login" | "register" | "forgot" | "reset";

export default function Portal({ language }: PortalProps) {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading, login, register, forgotPassword, resetPassword, logout } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!username || !password) {
      setErrorMsg("Please enter both username and password.");
      return;
    }
    setSubmitting(true);
    try {
      const loggedUser = await login({ username, password });
      toast.success("Signed in successfully!");
      if (loggedUser.role === "admin") {
        setLocation("/admin");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in. Please verify your credentials.");
      toast.error(err.message || "Sign-in failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!name.trim() || !username.trim() || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const newUser = await register({ name: name.trim(), email: username.trim(), password });
      toast.success("Account registered successfully!");
      if (newUser.role === "admin") {
        setLocation("/admin");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Email may already be in use.");
      toast.error(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!username.trim()) {
      setErrorMsg("Please enter your username.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await forgotPassword(username.trim());
      setSuccessMsg(res.message || "Password reset instructions generated.");
      toast.success("Reset request submitted.");
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Could not process password reset request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!resetToken.trim() || !password) {
      setErrorMsg("Reset token and new password are required.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await resetPassword({ token: resetToken.trim(), password });
      toast.success(res.message || "Password reset successfully!");
      setSuccessMsg("Your password has been reset. You may now sign in.");
      setMode("login");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reset password. The token may be expired.");
      toast.error(err.message || "Reset failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#e2eef0] bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 h-[78px] flex items-center justify-between">
          <BrandMark />
          <Link href="/" className="button-primary text-sm px-4 py-2">
            ← Back to site
          </Link>
        </div>
      </header>

      {/* Login Content */}
      <div className="portal-workspace-content mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12 py-12 md:py-20 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.65fr] items-start">
          
          {/* Left: Info */}
          <div className="space-y-6">
            <div>
              <p className="eyebrow text-[#0098d9] mb-4">Secure program workspace</p>
              <h1 className="text-[2.8rem] md:text-[3.8rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#111] mb-6">
                Enter the PTR Alumni Network
              </h1>
              <p className="text-[#4b5563] text-lg leading-[1.8] max-w-xl">
                One trusted space for resident teachers, school coordinators, and administrators
                to share what is happening in classrooms across Rwanda.
              </p>
            </div>

            {/* Network stats */}
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { number: "100", label: "Resident teachers" },
                { number: "17", label: "Model schools" },
                { number: "1", label: "Connected network" },
              ].map((stat, index) => (
                <div key={index} className="bg-[#f8fafc] rounded-xl p-5 border border-[#e2eef0]">
                  <p className="text-2xl font-extrabold text-[#0098d9]">{stat.number}</p>
                  <p className="text-sm font-bold text-[#4b5563] uppercase tracking-wide mt-2">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#f8fafc] rounded-xl p-6 border border-[#e2eef0]">
              <p className="eyebrow text-[#0098d9] mb-4">Who can access</p>
              <ul className="space-y-3 text-[#4b5563] leading-[1.8]">
                <li className="flex items-start gap-3">
                  <UsersRound className="size-4 text-[#0098d9] mt-0.5 flex-shrink-0" />
                  <span>Resident teachers placed in model schools</span>
                </li>
                <li className="flex items-start gap-3">
                  <UsersRound className="size-4 text-[#0098d9] mt-0.5 flex-shrink-0" />
                  <span>Mentor teachers and school coordinators</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="size-4 text-[#0098d9] mt-0.5 flex-shrink-0" />
                  <span>Authorized PTR Alumni Network administrators</span>
                </li>
              </ul>
            </div>

            {/* Alumni Network Platforms */}
            <div className="bg-[#f8fafc] rounded-xl p-6 border border-[#e2eef0]">
              <p className="eyebrow text-[#0098d9] mb-4">PTR Alumni Network Platforms</p>
              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                {socialLinks.map((social) => {
                  const IconMap: Record<string, typeof Instagram | typeof Facebook | typeof Send | typeof Youtube | typeof Linkedin | typeof Music2 | typeof AtSign> = {
                    instagram: Instagram,
                    facebook: Facebook,
                    threads: Send,
                    youtube: Youtube,
                    linkedin: Linkedin,
                    tiktok: Music2,
                    x: AtSign,
                  };
                  const Icon = IconMap[social.key] || UsersRound;
                  return (
                    <div key={social.key} className="flex min-w-0 items-center gap-3 p-3 rounded-lg bg-white border border-[#e2eef0] hover:border-[#0098d9] transition-colors">
                      <Icon className="size-4 text-[#0098d9] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#111]">{social.label}</p>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#0098d9] hover:underline truncate block"
                        >
                          {social.href.replace(/https?:\/\/(www\.)?/, "")}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Auth Card / Member Panel */}
          <div className="bg-[#f8fafc] rounded-2xl p-6 md:p-7 border border-[#e2eef0] shadow-sm">
            {user ? (
              // Authenticated Member Panel
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#e2eef0] pb-5">
                  <BrandMark compact />
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-[#0098d9]/10 text-[#0098d9]' : 'bg-[#168d6d]/10 text-[#168d6d]'}`}>
                    {user.role === 'admin' ? 'Administrator' : 'Resident Teacher'}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-[#111]">Welcome back,</h2>
                  <p className="text-lg font-bold text-[#0098d9] mt-1">{user.name || user.email}</p>
                  <p className="text-xs text-[#6b7280] mt-1">Signed in as {user.email}</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#e2eef0] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6b7280]">Account Role</span>
                    <span className="font-bold text-[#111] capitalize">{user.role}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6b7280]">Status</span>
                    <span className="font-bold text-[#168d6d] flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#168d6d]"></span> Active Session
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="button-primary w-full py-3 flex items-center justify-center gap-2 text-center"
                    >
                      <LayoutDashboard className="size-4" /> Open Administrator Portal
                    </Link>
                  )}
                  <button
                    onClick={() => logout()}
                    className="button-secondary w-full py-3 flex items-center justify-center gap-2"
                  >
                    <LogOut className="size-4" /> Sign out
                  </button>
                </div>
              </div>
            ) : (
              // Non-authenticated Auth Forms
              <div>
                <div className="flex items-center justify-between mb-5">
                  <BrandMark compact />
                  <div className="flex items-center gap-1 bg-[#e2eef0]/50 p-1 rounded-lg text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => { setMode("login"); setErrorMsg(null); setSuccessMsg(null); }}
                      className={`px-3 py-1.5 rounded-md transition-all ${mode === "login" ? "bg-white text-[#0098d9] shadow-xs" : "text-[#6b7280]"}`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMode("register"); setErrorMsg(null); setSuccessMsg(null); }}
                      className={`px-3 py-1.5 rounded-md transition-all ${mode === "register" ? "bg-white text-[#0098d9] shadow-xs" : "text-[#6b7280]"}`}
                    >
                      Register
                    </button>
                  </div>
                </div>

                <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111] mb-2">
                  {mode === "login" && "Sign in to continue"}
                  {mode === "register" && "Create an account"}
                  {mode === "forgot" && "Reset your password"}
                  {mode === "reset" && "Set a new password"}
                </h2>
                <p className="text-xs text-[#6b7280] mb-6">
                  {mode === "login" && "Enter your username or email and password to access the network."}
                  {mode === "register" && "Register your profile with your educational email address."}
                  {mode === "forgot" && "Username or email based password recovery is not available yet. Contact a network administrator for help."}
                  {mode === "reset" && "Enter your reset verification token and choose a new password."}
                </p>

                {errorMsg && (
                  <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                    <AlertCircle className="size-4 flex-shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                    <CheckCircle2 className="size-4 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p>{successMsg}</p>
                      {resetToken && (
                        <div className="mt-2 pt-2 border-t border-emerald-200">
                          <p className="font-semibold text-[11px]">Verification code: <code className="bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900">{resetToken}</code></p>
                          <button
                            type="button"
                            onClick={() => { setMode("reset"); setErrorMsg(null); }}
                            className="mt-1 text-xs font-bold text-emerald-700 underline"
                          >
                            Proceed to set new password →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Form based on mode */}
                <div className="bg-white rounded-xl p-6 border border-[#d1d5db] shadow-xs">
                  {mode === "login" && (
                    <form onSubmit={handleLogin} className="space-y-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Username or Email</label>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Residents teachers"
                          autoComplete="username"
                          className="px-4 py-2.5 border border-[#d1d5db] rounded-lg text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Password</label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="px-4 py-2.5 border border-[#d1d5db] rounded-lg text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-[#6b7280]">Contact a network administrator for account support.</span>
                        <button
                          type="button"
                          onClick={() => { setMode("forgot"); setErrorMsg(null); setSuccessMsg(null); }}
                          className="font-bold text-[#0098d9] hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="button-primary w-full py-3 font-bold text-sm tracking-wide disabled:opacity-50"
                      >
                        {submitting ? "Signing in…" : "Sign In"}
                      </button>
                    </form>
                  )}

                  {mode === "register" && (
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Full Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Jane Doe"
                          className="px-4 py-2.5 border border-[#d1d5db] rounded-lg text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Email address</label>
                        <input
                          type="email"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="name@school.rw"
                          className="px-4 py-2.5 border border-[#d1d5db] rounded-lg text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Password (min 8 chars)</label>
                        <input
                          type="password"
                          required
                          minLength={8}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="px-4 py-2.5 border border-[#d1d5db] rounded-lg text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Confirm Password</label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="px-4 py-2.5 border border-[#d1d5db] rounded-lg text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="button-primary w-full py-3 font-bold text-sm tracking-wide disabled:opacity-50 mt-2"
                      >
                        {submitting ? "Creating account…" : "Register Account"}
                      </button>
                    </form>
                  )}

                  {mode === "forgot" && (
                    <form onSubmit={handleForgot} className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Account Email</label>
                        <input
                          type="email"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="name@school.rw"
                          className="px-4 py-2.5 border border-[#d1d5db] rounded-lg text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="button-primary w-full py-3 font-bold text-sm tracking-wide disabled:opacity-50"
                      >
                        {submitting ? "Requesting reset…" : "Request Password Reset"}
                      </button>

                      <div className="flex items-center justify-between text-xs pt-2">
                        <button
                          type="button"
                          onClick={() => { setMode("login"); setErrorMsg(null); setSuccessMsg(null); }}
                          className="font-bold text-[#6b7280] hover:underline"
                        >
                          ← Back to sign in
                        </button>
                        <button
                          type="button"
                          onClick={() => { setMode("reset"); setErrorMsg(null); setSuccessMsg(null); }}
                          className="font-bold text-[#0098d9] hover:underline"
                        >
                          Already have code?
                        </button>
                      </div>
                    </form>
                  )}

                  {mode === "reset" && (
                    <form onSubmit={handleReset} className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Reset Token / Code</label>
                        <input
                          type="text"
                          required
                          value={resetToken}
                          onChange={(e) => setResetToken(e.target.value)}
                          placeholder="Paste reset token here"
                          className="px-4 py-2.5 border border-[#d1d5db] rounded-lg text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all font-mono text-xs"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">New Password (min 8 chars)</label>
                        <input
                          type="password"
                          required
                          minLength={8}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="px-4 py-2.5 border border-[#d1d5db] rounded-lg text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Confirm New Password</label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="px-4 py-2.5 border border-[#d1d5db] rounded-lg text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="button-primary w-full py-3 font-bold text-sm tracking-wide disabled:opacity-50"
                      >
                        {submitting ? "Updating password…" : "Save New Password"}
                      </button>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => { setMode("login"); setErrorMsg(null); setSuccessMsg(null); }}
                          className="text-xs font-bold text-[#6b7280] hover:underline"
                        >
                          ← Back to sign in
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="border-t border-[#e2eef0] pt-6 mt-6">
                  <p className="text-xs text-[#6b7280] text-center mb-3">
                    Need assistance accessing your account? Contact the program administrator.
                  </p>
                  <Link href="/" className="block text-center text-xs font-bold text-[#0098d9] hover:underline">
                    Return to public website →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

import { useState } from "react";
import {
  ArrowUpRight,
  AtSign,
  Building2,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPinned,
  Music2,
  Phone,
  Send,
  Youtube,
} from "lucide-react";
import { Link } from "wouter";
import { brand, copy, navItems, socialLinks, type Language } from "@/data/ptrp";
import { BrandMark } from "./BrandMark";
import { toast } from "sonner";
import { queryKeys, useApiQuery } from "@/lib/api";

const footerQuickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Program", href: "/team" },
  { label: "Schools", href: "/network" },
  { label: "Residents", href: "/alumni" },
  { label: "Best Practices", href: "/resources" },
  { label: "Gallery", href: "/gallery" },
  { label: "News & Events", href: "/news" },
  { label: "Impact", href: "/impact" },
  { label: "Contact", href: "/contact" },
];

const socialIcons: Record<string, typeof AtSign | typeof Facebook | typeof Instagram | typeof Linkedin | typeof Music2 | typeof Send | typeof Youtube> = {
  youtube: Youtube,
  tiktok: Music2,
  instagram: Instagram,
  facebook: Facebook,
  threads: Send,
  linkedin: Linkedin,
  x: AtSign,
};

const currentYear = new Date().getFullYear();

export function SiteFooter({ language, settings }: { language: Language; settings: Record<string, string> }) {
  const t = copy[language];
  const { data: managedNavigation } = useApiQuery<Array<{ id: number; label: string; href: string; parentId: number | null }>>(queryKeys.publicNavigation, "navigation");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const quickLinks = managedNavigation?.length
    ? managedNavigation.filter((item) => item.parentId === null)
    : footerQuickLinks;
  const managedSocialLinks = socialLinks.map((item) => ({ ...item, href: settings[`social.${item.key}`] || item.href }));

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      setNewsletterStatus("error");
      toast.error("Please enter a valid email address.");
      return;
    }
    setNewsletterStatus("submitting");
    // Simulate subscription; backend newsletter endpoint is not configured.
    setTimeout(() => {
      setNewsletterStatus("success");
      setNewsletterEmail("");
      toast.success("Thank you for subscribing to PTR Alumni Network updates.");
    }, 600);
  };

  return (
    <footer className="site-footer bg-[#071935] text-white">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-4 lg:gap-12">
          {/* Column 1: Brand & About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <BrandMark light logoUrl={settings.logoUrl} />
            </div>
            <p className="mt-2 max-w-sm text-sm leading-[1.7] text-[#cbd5e1]">
              {settings.footerText || t.footer.description}
            </p>
            <p className="mt-6 text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-[#38bdf8]">
              {settings.tagline || brand.tagline}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {managedSocialLinks.map((social) => {
                const Icon = socialIcons[social.key as keyof typeof socialIcons];
                return (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="social-footer-icon flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] transition-all hover:border-[#38bdf8] hover:bg-[#38bdf8]/10 hover:text-[#38bdf8]"
                    aria-label={`PTR Alumni Network on ${social.label}`}
                    title={social.label}
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-6 text-xs font-extrabold uppercase tracking-[0.2em] text-[#38bdf8]">Quick Links</h3>
            <div className="grid gap-3">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="footer-link text-sm text-[#cbd5e1] transition-colors hover:text-[#38bdf8] hover:pl-1.5"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Contact Information */}
          <div>
            <h3 className="mb-6 text-xs font-extrabold uppercase tracking-[0.2em] text-[#38bdf8]">Contact Us</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <Mail className="size-5 shrink-0 mt-0.5 text-[#38bdf8]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#94a3b8]">Email</p>
                  <a href={`mailto:${settings.contactEmail || "info@ptr.rw"}`} className="text-sm text-white hover:text-[#38bdf8] transition-colors">{settings.contactEmail || "info@ptr.rw"}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="size-5 shrink-0 mt-0.5 text-[#38bdf8]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#94a3b8]">Phone</p>
                  {settings.contactPhone ? <a href={`tel:${settings.contactPhone.replace(/[^\d+]/g, "")}`} className="text-sm text-white hover:text-[#38bdf8]">{settings.contactPhone}</a> : <p className="text-sm text-[#94a3b8]">To be confirmed</p>}
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPinned className="size-5 shrink-0 mt-0.5 text-[#38bdf8]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#94a3b8]">Location</p>
                  <p className="text-sm text-[#94a3b8]">{settings.contactAddress || "Kigali, Rwanda · Office location to be confirmed"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Follow Us + Newsletter */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-[#38bdf8]">Follow Us</h3>
              <div className="flex gap-3">
                {managedSocialLinks.map((social) => {
                  const Icon = socialIcons[social.key as keyof typeof socialIcons];
                  return (
                    <a
                      key={social.key}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="social-footer-icon flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] transition-all hover:border-[#38bdf8] hover:bg-[#38bdf8]/10 hover:text-[#38bdf8]"
                      aria-label={`PTR Alumni Network on ${social.label}`}
                      title={social.label}
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            </div>
            <div className="border border-white/10 rounded-xl bg-white/[0.03] p-5">
              <h3 className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#38bdf8]">Newsletter</h3>
              <p className="mb-4 text-xs text-[#94a3b8] leading-relaxed">
                Subscribe to receive program updates, alumni stories, and resources straight to your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row sm:gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  disabled={newsletterStatus === "submitting"}
                  className="flex-1 min-w-0 px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.04] text-sm text-white placeholder-[#64748b] focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === "submitting"}
                  className="px-4 py-2.5 rounded-lg bg-[#0098d9] text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-white transition-all hover:bg-[#007ab0] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {newsletterStatus === "submitting" ? "Subscribing…" : "Subscribe"}
                </button>
              </form>
              {newsletterStatus === "success" && (
                <p className="mt-3 text-xs text-[#168d6d]">You're subscribed. Thank you!</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-[#64748b] leading-[1.6]">
            <p>
              © {currentYear} {settings.siteName || brand.name} · All rights reserved.
            </p>
            <p className="mt-1">
              Official digital community of the Primary Teacher Residency Program (PTRP) · Rwanda.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="/about" className="footer-link text-[#94a3b8] hover:text-white transition-colors">{t.footer.privacy}</Link>
            <Link href="/about" className="footer-link text-[#94a3b8] hover:text-white transition-colors">{t.footer.terms}</Link>
            <Link href="/contact" className="inline-flex items-center gap-1.5 text-[#0098d9] font-bold hover:text-[#38bdf8] transition-colors">
              Contact <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { ArrowUpRight, AtSign, Facebook, Instagram, Linkedin, Music2, Send, Youtube } from "lucide-react";
import { Link } from "wouter";
import { copy, navItems, socialLinks, type Language } from "@/data/ptrp";
import { BrandMark } from "./BrandMark";

export function SiteFooter({ language }: { language: Language }) {
  const t = copy[language];
  const socialIcons: Record<string, typeof AtSign | typeof Facebook | typeof Instagram | typeof Linkedin | typeof Music2 | typeof Send | typeof Youtube> = {
    youtube: Youtube,
    tiktok: Music2,
    instagram: Instagram,
    facebook: Facebook,
    threads: Send,
    linkedin: Linkedin,
    x: AtSign,
  };
  return <footer className="site-footer">
    <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[1.6fr_0.8fr_0.8fr_1fr] lg:gap-16">
        <div>
          <BrandMark light />
          <p className="mt-6 max-w-sm text-[0.85rem] leading-[1.7] text-white/60">{t.footer.description}</p>
          <div className="mt-8 flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = socialIcons[social.key as keyof typeof socialIcons];
              return (
                <a key={social.key} className="social-button" href={social.href} target="_blank" rel="noreferrer" aria-label={`PTR Alumni Network on ${social.label}`} title={social.label}>
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
        <div>
          <p className="footer-label">Explore</p>
          <div className="mt-6 grid gap-2">
            {navItems.slice(0, 5).map((item) => (
              <Link key={item.href} href={item.href} className="footer-link">{item.label}</Link>
            ))}
          </div>
        </div>
        <div>
          <p className="footer-label">Continue</p>
          <div className="mt-6 grid gap-2">
            {navItems.slice(5).map((item) => (
              <Link key={item.href} href={item.href} className="footer-link">{item.label}</Link>
            ))}
          </div>
        </div>
        <div>
          <p className="footer-label">A note on data</p>
          <p className="mt-6 text-[0.85rem] leading-[1.7] text-white/55">
            Official statements, profiles, contact details, and impact figures will be published only after verification and approval.
          </p>
          <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#38bdf8]">
            How this works <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
      <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-[0.75rem] text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <p>{t.footer.copyright}</p>
        <div className="flex gap-6">
          <Link href="/about" className="footer-link hover:text-white/80">{t.footer.privacy}</Link>
          <Link href="/about" className="footer-link hover:text-white/80">{t.footer.terms}</Link>
        </div>
      </div>
    </div>
  </footer>;
}

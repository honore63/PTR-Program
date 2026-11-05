import { ArrowUpRight, AtSign, Facebook, Instagram, Linkedin, Music2, Send, Youtube } from "lucide-react";
import { Link } from "wouter";
import { brand, copy, navItems, partners, socialLinks, type Language } from "@/data/ptrp";
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
    <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1.2fr] lg:gap-12">
        <div>
          <BrandMark light />
          <p className="mt-6 max-w-sm text-[0.85rem] leading-[1.7] text-white/60">{t.footer.description}</p>
          <p className="mt-5 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#38bdf8]">{brand.tagline}</p>
          <div className="mt-7 flex flex-wrap items-center gap-2.5">
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
          <p className="footer-label">Network</p>
          <div className="mt-6 grid gap-2">
            {navItems.slice(5).map((item) => (
              <Link key={item.href} href={item.href} className="footer-link">{item.label}</Link>
            ))}
            <Link href="/portal" className="footer-link">Portal login</Link>
          </div>
        </div>
        <div>
          <p className="footer-label">Our partners</p>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {partners.map((partner) => (
              <a key={partner.shortName} href={partner.url} target="_blank" rel="noreferrer" title={partner.name} className="flex min-h-14 flex-col justify-center border border-white/10 bg-white/[0.03] px-3 py-2 transition-colors hover:border-[#38bdf8]/60 hover:bg-white/[0.06]">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.08em] text-[#38bdf8]">{partner.shortName}</span>
                <span className="mt-1 text-[0.6rem] font-semibold leading-4 text-white/45">{partner.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-8 text-[0.75rem] text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p>{t.footer.copyright}</p>
          <p className="mt-2 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[#38bdf8]">{brand.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-6">
          <Link href="/about" className="footer-link hover:text-white/80">{t.footer.privacy}</Link>
          <Link href="/about" className="footer-link hover:text-white/80">{t.footer.terms}</Link>
          <Link href="/contact" className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-[#38bdf8] hover:text-white">Contact <ArrowUpRight className="size-3.5" /></Link>
        </div>
      </div>
      <p className="mt-6 text-[0.66rem] leading-6 text-white/30">Official digital community of the Primary Teacher Residency Program (PTRP) · Rwanda. Program facts and images are attributed to MINEDUC and published sources. Unverified details are clearly marked.</p>
    </div>
  </footer>;
}

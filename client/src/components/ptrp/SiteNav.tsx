import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { copy, languages, navItems, type Language } from "@/data/ptrp";
import { BrandMark } from "./BrandMark";

export function SiteNav({ language, onLanguageChange }: { language: Language; onLanguageChange: (language: Language) => void }) {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const t = copy[language];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setOpen(false); setMoreOpen(false); }, [location]);

  return <header className={`site-nav ${scrolled ? "site-nav-scrolled" : ""}`}>
    <div className="mx-auto flex h-[78px] max-w-[1400px] items-center justify-between px-5 md:px-8">
      <BrandMark />
      <nav className="hidden items-center gap-6 lg:flex absolute left-1/2 -translate-x-1/2" aria-label="Primary navigation">
        {navItems.slice(0, 7).map((item) => <Link key={item.href} href={item.href} aria-current={location === item.href ? "page" : undefined} className={`nav-link ${location === item.href ? "nav-link-active" : ""}`}>{item.label}</Link>)}
        <div className="nav-more-wrap relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
          <button className="nav-link inline-flex items-center gap-1" aria-label="More pages" aria-expanded={moreOpen} aria-controls="more-pages-menu" onClick={() => setMoreOpen((value) => !value)}>More <span aria-hidden="true">▾</span></button>
          <div id="more-pages-menu" className={`nav-more-menu absolute right-0 top-full z-30 mt-2 w-48 border border-[#e5e7eb] bg-white p-2 shadow-lg transition-all ${moreOpen ? "nav-more-menu-open" : ""}`}>
            {navItems.slice(7).map((item) => <Link key={item.href} href={item.href} aria-current={location === item.href ? "page" : undefined} className={`block px-3 py-2 text-[0.82rem] font-bold uppercase tracking-wide transition ${location === item.href ? "text-[#0098d9]" : "text-[#4b5563] hover:text-[#0098d9]"}`}>{item.label}</Link>)}
          </div>
        </div>
      </nav>
      <div className="hidden items-center gap-3 lg:flex">
        <div className="language-switcher" aria-label="Language selector">
          {languages.map((item) => <button key={item.key} onClick={() => onLanguageChange(item.key)} className={language === item.key ? "language-active" : ""} aria-pressed={language === item.key}>{item.label}</button>)}
        </div>
        <span className="text-gray-300">|</span>
        <Link href="/portal" className="nav-login">{t.nav.login}</Link>
      </div>
      <button className="icon-button lg:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? t.nav.close : t.nav.menu}>{open ? <X /> : <Menu />}</button>
    </div>
    <AnimatePresence>
      {open && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-[#e5e7eb] bg-white lg:hidden">
        <nav className="mx-auto flex max-w-[1400px] flex-col gap-1 px-5 py-4" aria-label="Mobile navigation">
          {navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`mobile-nav-link ${location === item.href ? "mobile-nav-link-active" : ""}`}>{item.label}</Link>)}
          <div className="my-3 h-px bg-[#e5e7eb]" />
          <div className="flex items-center justify-between gap-4 py-2"><div className="language-switcher">{languages.map((item) => <button key={item.key} onClick={() => onLanguageChange(item.key)} className={language === item.key ? "language-active" : ""}>{item.label}</button>)}</div><Link href="/portal" onClick={() => setOpen(false)} className="nav-login">{t.nav.login}<span aria-hidden="true">↗</span></Link></div>
        </nav>
      </motion.div>}
    </AnimatePresence>
  </header>;
}

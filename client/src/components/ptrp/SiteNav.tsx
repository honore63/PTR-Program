import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { copy, languages, navItems, type Language } from "@/data/ptrp";
import { BrandMark } from "./BrandMark";

const PRIMARY_COUNT = 5;

export function SiteNav({ language, onLanguageChange }: { language: Language; onLanguageChange: (language: Language) => void }) {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const moreRef = useRef<HTMLDivElement>(null);
  const t = copy[language];

  const normalizePath = (path: string) => (path === "/" ? "/" : path.replace(/\/$/, ""));
  const isActive = (href: string) => normalizePath(location) === normalizePath(href);

  const primaryItems = navItems.slice(0, PRIMARY_COUNT);
  const moreItems = navItems.slice(PRIMARY_COUNT);
  const moreActive = moreItems.some((item) => isActive(item.href));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setOpen(false); setMoreOpen(false); }, [location]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) setMoreOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMoreOpen(false); setOpen(false); }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className={`site-nav ${scrolled ? "site-nav-scrolled" : ""}`}>
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 md:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="PTR Alumni Network home">
          <BrandMark compact light={false} />
        </Link>

        {/* Primary navigation (desktop) */}
        <nav className="hidden shrink-0 flex-1 items-center justify-center gap-8 min-[1024px]:flex" aria-label="Primary navigation">
          {primaryItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="nav-link transition-colors"
              onMouseEnter={() => setMoreOpen(false)}
            >
              {item.label}
              <span className="nav-link-underline" />
            </Link>
          ))}
          <div
            ref={moreRef}
            className="relative group"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button
              type="button"
              className="nav-link inline-flex items-center gap-1.5 transition-colors"
              aria-label="More pages"
              aria-haspopup="true"
              aria-expanded={moreOpen}
              aria-controls="more-pages-menu"
              onClick={() => setMoreOpen((value) => !value)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              More <ChevronDown className={`size-3.5 ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            <div
              id="more-pages-menu"
              className={`nav-more-menu absolute right-0 mt-2 w-60 border border-[#e2e8f0] bg-white rounded-xl shadow-xl transition-all ${moreOpen ? "nav-more-menu-open" : "opacity-0 invisible translate-y-2 pointer-events-none"}`}
            >
              <div className="px-3 py-2">
                {moreItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="nav-more-item block px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-[#4b5563] hover:bg-[#f0f9fe] hover:text-[#0098d9] transition-colors"
                    onClick={() => setMoreOpen(false)}
                    onMouseEnter={() => setMoreOpen(true)}
                    onMouseLeave={() => setMoreOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Right actions */}
        <div className="hidden shrink-0 items-center gap-3 min-[1024px]:flex">
          <div className="language-switcher" aria-label="Language selector">
            {languages.map((item) => (
              <button
                key={item.key}
                onClick={() => onLanguageChange(item.key)}
                className={`language-btn transition-all ${language === item.key ? "language-active" : ""}`}
                aria-pressed={language === item.key}
                title={item.label}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Link href="/admin" className="nav-admin-portal" aria-label="Admin Portal">
            <ShieldCheck className="size-4" /> Admin Portal
          </Link>
          <Link href="/portal" className="nav-login">{t.nav.login}</Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="icon-button min-[1024px]:!hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? t.nav.close : t.nav.menu}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-[#e5e7eb] bg-white min-[1024px]:hidden"
          >
            <nav className="mx-auto flex max-w-[1400px] flex-col gap-0 px-5 py-5" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="mobile-nav-link flex items-center justify-between gap-3 border-b border-[#eef2f5] pb-3.5 pt-3.5 transition-colors"
                >
                  <span>{item.label}</span>
                  <ChevronDown className="size-4 opacity-0 group-hover:opacity-100 ml-1 transition-opacity" />
                </Link>
              ))}
              <div className="my-4 h-[1px] bg-[#eef2f5]" />
              <div className="flex items-center justify-between gap-4 px-2 py-3 border-t border-[#eef2f5] pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-[0.62rem] font-bold uppercase tracking-widest text-[#7b8da2]">Language</span>
                  <div className="language-switcher-mobile" aria-label="Language selector">
                    {languages.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => { onLanguageChange(item.key); setOpen(false); }}
                        className={`transition-all ${language === item.key ? "language-active" : ""}`}
                        aria-pressed={language === item.key}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Link href="/portal" onClick={() => setOpen(false)} className="nav-login-mobile">{t.nav.login}</Link>
              </div>
              <div className="my-4 h-[1px] bg-[#eef2f5]" />
              <Link href="/admin" onClick={() => setOpen(false)} className="mobile-admin-link flex items-center gap-2 border-b border-[#eef2f5] pb-3 pt-3 transition-colors">
                <ShieldCheck className="size-4" /> Admin Portal
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

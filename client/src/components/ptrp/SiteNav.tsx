import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, Menu, ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { copy, navItems, type Language } from "@/data/ptrp";
import { queryKeys, useApiQuery } from "@/lib/api";
import { BrandMark } from "./BrandMark";

const PRIMARY_COUNT = 5;

type NavigationRecord = { id?: number; label: string; href: string; parentId?: number | null };
type NavigationSection = { root: NavigationRecord; children: NavigationRecord[] };

export function SiteNav({ language, settings = {} }: { language: Language; settings?: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const moreRef = useRef<HTMLDivElement>(null);
  const t = copy[language];
  const navigationQuery = useApiQuery<NavigationRecord[]>(queryKeys.publicNavigation, "navigation");

  const normalizePath = (path: string) => (path === "/" ? "/" : path.replace(/\/$/, ""));
  const isActive = (href: string) => normalizePath(location) === normalizePath(href);

  const managedItems = navigationQuery.data?.filter((item) => item.parentId == null || navigationQuery.data?.some((parent) => parent.id === Number(item.parentId)));
  const sourceItems: NavigationRecord[] = managedItems?.length ? managedItems : navItems;
  const rootItems = sourceItems.filter((item) => !("parentId" in item) || item.parentId == null);
  const childItems = sourceItems.filter((item) => "parentId" in item && item.parentId != null);
  const primaryItems = rootItems.slice(0, PRIMARY_COUNT);
  const moreSections: NavigationSection[] = rootItems
    .filter((root, index) => index >= PRIMARY_COUNT || childItems.some((child) => Number(child.parentId) === Number(root.id)))
    .map((root) => ({
      root,
      children: childItems.filter((child) => Number(child.parentId) === Number(root.id)),
    }));
  const moreGroups = [
    { label: "Stories & impact", hrefs: ["/news", "/gallery"] },
    { label: "People & schools", hrefs: ["/alumni", "/residents", "/team"] },
    { label: "Resources & connections", hrefs: ["/resources", "/partners", "/contact"] },
  ].map(({ label, hrefs }) => ({
    label,
    sections: moreSections.filter(({ root }) => hrefs.includes(root.href)),
  })).filter((group) => group.sections.length > 0);
  const categorizedHrefs = new Set(moreGroups.flatMap((group) => group.sections.map(({ root }) => root.href)));
  const uncategorizedSections = moreSections.filter(({ root }) => !categorizedHrefs.has(root.href));
  if (uncategorizedSections.length > 0) moreGroups.push({ label: "More to explore", sections: uncategorizedSections });
  const moreActive = moreSections.some(({ root, children }) =>
    isActive(root.href) || children.some((child) => isActive(child.href)),
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setOpen(false); setMoreOpen(false); setMobileMoreOpen(false); setExpandedSection(null); }, [location]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) setMoreOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMoreOpen(false); setMobileMoreOpen(false); setOpen(false); }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className={`site-nav ${scrolled ? "site-nav-scrolled" : ""}`} aria-label={settings.siteName || "PTR Alumni Network"}>
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 md:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="PTR Alumni Network home">
          <BrandMark compact light={false} logoUrl={settings.logoUrl} />
        </Link>

        {/* Primary navigation (desktop) */}
        <nav className="hidden shrink-0 flex-1 items-center justify-center gap-8 min-[1280px]:flex" aria-label="Primary navigation">
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
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setMoreOpen(false);
            }}
          >
            <button
              type="button"
              className="nav-link inline-flex items-center gap-1.5 transition-colors"
              aria-label="More pages"
              aria-haspopup="true"
              aria-expanded={moreOpen}
              aria-controls="more-pages-menu"
              aria-current={moreActive ? "page" : undefined}
              onClick={() => setMoreOpen(true)}
            >
              More <ChevronDown className={`size-3.5 ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  id="more-pages-menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="nav-more-menu"
                >
                  <div className="nav-more-heading">
                    <span className="nav-more-eyebrow">Explore PTRP</span>
                    <span className="nav-more-description">Discover our people, work, and community.</span>
                  </div>
                  <div className="nav-more-grid">
                    {moreGroups.map((group) => (
                      <section className="nav-more-category" key={group.label}>
                        <h3 className="nav-more-category-title">{group.label}</h3>
                        {group.sections.map(({ root, children }) => (
                          <section className="nav-more-section" key={root.href}>
                            <Link
                              href={root.href}
                              aria-current={isActive(root.href) ? "page" : undefined}
                              className={`nav-more-section-title ${isActive(root.href) || children.some((child) => isActive(child.href)) ? "nav-more-section-active" : ""}`}
                              onClick={() => setMoreOpen(false)}
                            >
                              {root.label}
                              <ChevronRight className="size-4 shrink-0" />
                            </Link>
                            {children.length > 0 && (
                              <ul className="nav-more-children">
                                {children.map((child) => (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      aria-current={isActive(child.href) ? "page" : undefined}
                                      className="nav-more-child"
                                      onClick={() => setMoreOpen(false)}
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </section>
                        ))}
                      </section>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right actions */}
        <div className="hidden shrink-0 items-center gap-3 min-[1280px]:flex">
          <Link href="/admin" className="nav-admin-portal" aria-label="Admin Portal">
            <ShieldCheck className="size-4" /> Admin Portal
          </Link>
          <Link href="/portal" className="nav-login">{t.nav.login}</Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="icon-button min-[1280px]:!hidden"
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
            className="border-t border-[#e5e7eb] bg-white min-[1280px]:hidden"
          >
            <nav className="mx-auto flex max-h-[calc(100dvh-72px)] max-w-[1400px] flex-col gap-0 overflow-y-auto overscroll-contain px-5 py-5" aria-label="Mobile navigation">
              {primaryItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="mobile-nav-link flex items-center justify-between gap-3 border-b border-[#eef2f5] py-3.5 transition-colors"
                >
                  <span>{item.label}</span>
                  {isActive(item.href) && <span className="mobile-nav-current">Current page</span>}
                </Link>
              ))}
              <section className="mobile-more">
                <button
                  type="button"
                  className={`mobile-nav-link flex w-full items-center justify-between gap-3 border-b border-[#eef2f5] py-3.5 text-left ${moreActive ? "mobile-nav-active" : ""}`}
                  aria-expanded={mobileMoreOpen}
                  aria-controls="mobile-more-menu"
                  onClick={() => setMobileMoreOpen((value) => !value)}
                >
                  <span>More</span>
                  <ChevronDown className={`size-4 transition-transform ${mobileMoreOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {mobileMoreOpen && (
                    <motion.div
                      id="mobile-more-menu"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="mobile-more-content"
                    >
                      {moreGroups.map((group) => (
                        <section className="mobile-more-category" key={group.label}>
                          <h3 className="mobile-more-category-title">{group.label}</h3>
                          {group.sections.map(({ root, children }) => {
                            const sectionKey = root.href;
                            const sectionOpen = expandedSection === sectionKey;
                            const submenuId = `mobile-submenu-${sectionKey.replace(/[^a-z0-9]/gi, "-")}`;
                            return (
                              <section className="mobile-more-section" key={sectionKey}>
                                <div className="mobile-more-row">
                                  <Link
                                    href={root.href}
                                    onClick={() => setOpen(false)}
                                    aria-current={isActive(root.href) ? "page" : undefined}
                                    className={`mobile-more-title ${isActive(root.href) || children.some((child) => isActive(child.href)) ? "mobile-nav-active" : ""}`}
                                  >
                                    {root.label}
                                  </Link>
                                  {children.length > 0 && (
                                    <button
                                      type="button"
                                      className="mobile-more-toggle"
                                      aria-label={`${sectionOpen ? "Collapse" : "Expand"} ${root.label} links`}
                                      aria-expanded={sectionOpen}
                                      aria-controls={submenuId}
                                      onClick={() => setExpandedSection(sectionOpen ? null : sectionKey)}
                                    >
                                      <ChevronDown className={`size-4 transition-transform ${sectionOpen ? "rotate-180" : ""}`} />
                                    </button>
                                  )}
                                </div>
                                <AnimatePresence initial={false}>
                                  {sectionOpen && children.length > 0 && (
                                    <motion.div
                                      id={submenuId}
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.18, ease: "easeOut" }}
                                      className="mobile-submenu"
                                    >
                                      {children.map((child) => (
                                        <Link
                                          key={child.href}
                                          href={child.href}
                                          onClick={() => setOpen(false)}
                                          aria-current={isActive(child.href) ? "page" : undefined}
                                          className="mobile-submenu-link"
                                        >
                                          {child.label}
                                          {isActive(child.href) && <span className="mobile-nav-current">Current page</span>}
                                        </Link>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </section>
                            );
                          })}
                        </section>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
              <div className="my-4 h-[1px] bg-[#eef2f5]" />
              <Link href="/portal" onClick={() => setOpen(false)} className="nav-login-mobile">{t.nav.login}</Link>
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

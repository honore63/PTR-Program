import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import { Redirect, Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import NotFound from "./pages/NotFound";
import { SiteFooter } from "./components/ptrp/SiteFooter";
import { SiteNav } from "./components/ptrp/SiteNav";
import { brand, sectionMeta, type Language } from "./data/ptrp";
import { apiRequest, queryKeys, useApiQuery } from "./lib/api";
import { CmsPageRenderer, parseCmsPageLayout } from "./components/ptrp/CmsPageRenderer";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AlumniPage = lazy(() => import("./pages/AlumniPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const Home = lazy(() => import("./pages/Home"));
const ImpactPage = lazy(() => import("./pages/ImpactPage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const PartnersPage = lazy(() => import("./pages/PartnersPage"));
const Portal = lazy(() => import("./pages/Portal"));
const ProgramTeamPage = lazy(() => import("./pages/ProgramTeamPage"));
const ResidentTeacherDetail = lazy(() => import("./pages/ResidentTeacherDetail"));
const ResidentTeacherRegistration = lazy(() => import("./pages/ResidentTeacherRegistration"));
const ResidentsDirectory = lazy(() => import("./pages/ResidentsDirectory"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const SchoolsPage = lazy(() => import("./pages/SchoolsPage"));

const pageTitles: Record<string, string> = {
  "/": `${brand.name} — ${brand.subtitle}`,
  "/about": "About the Program",
  "/network": "Model Schools",
  "/impact": "Impact",
  "/news": "News & Activities",
  "/gallery": "Gallery",
  "/alumni": "Alumni Directory",
  "/resources": "Resources",
  "/partners": "Partners",
  "/contact": "Join & Contact",
  "/team": "Program Team",
  "/residents": "Resident Teachers",
  "/register-resident": "Register Resident Teacher",
  "/portal": "Portal Login",
  "/admin": "Administrator Workspace",
  "/404": "Page Not Found",
};

function PageMeta({ language }: { language: Language }) {
  const [location] = useLocation();
  const { data: settingsData } = useApiQuery<Record<string, string>>(queryKeys.publicSettings, "settings");
  const settings: Record<string, string> = settingsData ?? {};
  const contentSlug = location === "/" ? "home" : location.replace(/^\/|\/$/g, "");
  const { data: cmsPage } = useApiQuery<{ title: string; summary: string | null } | null>(
    queryKeys.publicContent(contentSlug),
    `content/${contentSlug}`,
    !location.startsWith("/admin") && !location.startsWith("/portal") && !location.startsWith("/resident-teacher/"),
  );
  useEffect(() => {
    const meta = sectionMeta[location];
    const pageTitle = pageTitles[location];
    const siteName = settings.siteName || brand.name;
    const resolvedTitle = cmsPage?.title || pageTitle;
    const homeFallbackTitle = `${brand.name} — ${brand.subtitle}`;
    const homeTitle = resolvedTitle && resolvedTitle !== homeFallbackTitle ? `${resolvedTitle} — ${brand.subtitle}` : homeFallbackTitle;
    const title = settings.metaTitle || (location === "/" ? homeTitle : resolvedTitle ? `${resolvedTitle} — ${siteName}` : `${siteName} — ${brand.subtitle}`);
    const description = location === "/"
      ? "PTR Alumni Network is the official digital community for the Primary Teacher Residency Program (PTRP) in Rwanda — connecting resident teachers, alumni, mentors, and model schools."
      : meta?.description ?? "The official digital community for the Primary Teacher Residency Program (PTRP) in Rwanda.";
    const resolvedDescription = settings.metaDescription || cmsPage?.summary || description;
    document.title = title;
    document.documentElement.lang = "en";

    const robots = document.querySelector('meta[name="robots"]') ?? document.createElement("meta");
    robots.setAttribute("name", "robots");
    robots.setAttribute("content", location === "/portal" || location === "/admin" ? "noindex,nofollow" : "index,follow");
    document.head.appendChild(robots);

    const descriptionTag = document.querySelector('meta[name="description"]') ?? document.createElement("meta");
    descriptionTag.setAttribute("name", "description");
    descriptionTag.setAttribute("content", resolvedDescription);
    document.head.appendChild(descriptionTag);

    const propertyTags: Array<[string, string]> = [
      ["og:title", title],
      ["og:description", resolvedDescription],
      ["og:type", "website"],
      ["og:image", `${import.meta.env.BASE_URL.replace(/\/$/, "")}/manus-storage/ptrp-pilot-launch.jpg`],
      ["twitter:title", title],
      ["twitter:description", resolvedDescription],
    ];
    for (const [property, content] of propertyTags) {
      const isProperty = property.startsWith("og:");
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      const tag = document.querySelector(selector) ?? document.createElement("meta");
      tag.setAttribute(isProperty ? "property" : "name", property);
      tag.setAttribute("content", content);
      document.head.appendChild(tag);
    }
  }, [cmsPage?.summary, cmsPage?.title, location, settings.metaDescription, settings.metaTitle, settings.siteName]);
  return null;
}

function Router({ language }: { language: Language }) {
  return <Suspense fallback={<div className="min-h-[40vh] bg-white" aria-busy="true" />}>
    <Switch>
      <Route path="/"><CmsPageRoute slug="home" fallback={<Home language={language} />} /></Route>
      <Route path="/about"><CmsPageRoute slug="about" fallback={<AboutPage />} /></Route>
      <Route path="/network"><CmsPageRoute slug="network" fallback={<SchoolsPage />} /></Route>
      <Route path="/impact"><CmsPageRoute slug="impact" fallback={<ImpactPage />} /></Route>
      <Route path="/news"><CmsPageRoute slug="news" fallback={<NewsPage />} /></Route>
      <Route path="/gallery"><CmsPageRoute slug="gallery" fallback={<GalleryPage />} /></Route>
      <Route path="/alumni"><CmsPageRoute slug="alumni" fallback={<AlumniPage />} /></Route>
      <Route path="/resources"><CmsPageRoute slug="resources" fallback={<ResourcesPage />} /></Route>
      <Route path="/partners"><CmsPageRoute slug="partners" fallback={<PartnersPage />} /></Route>
      <Route path="/contact"><CmsPageRoute slug="contact" fallback={<ContactPage />} /></Route>
      <Route path="/team"><CmsPageRoute slug="team" fallback={<ProgramTeamPage />} /></Route>
      <Route path="/residents"><CmsPageRoute slug="residents" fallback={<ResidentsDirectory />} /></Route>
      <Route path="/register-resident"><CmsPageRoute slug="register-resident" fallback={<ResidentTeacherRegistration />} /></Route>
      <Route path="/resident-teacher/:id"><ResidentTeacherDetail /></Route>
      <Route path="/activities"><Redirect to="/news" /></Route>
      <Route path="/practices"><Redirect to="/resources" /></Route>
      <Route path="/portal"><Portal language={language} /></Route>
      <Route path="/admin"><AdminDashboard /></Route>
      <Route path="/404"><NotFound language={language} /></Route>
      <Route path="/:slug">{(params) => <CmsPageRoute slug={params.slug} fallback={<NotFound language={language} />} />}</Route>
      <Route><NotFound language={language} /></Route>
    </Switch>
  </Suspense>;
}

function CmsPageRoute({ slug, fallback }: { slug: string; fallback: React.ReactNode }) {
  const { data } = useApiQuery<{ title: string; summary: string | null; body: string; status: string } | null>(
    queryKeys.publicContent(slug),
    `content/${slug}`,
  );
  const layout = data?.status === "published" ? parseCmsPageLayout(data.body) : null;
  return layout && data ? <CmsPageRenderer title={data.title} summary={data.summary ?? ""} layout={layout} /> : <>{fallback}</>;
}

function AppFrame() {
  const [location] = useLocation();
  const { data: settingsData } = useApiQuery<Record<string, string> | null>(queryKeys.publicSettings, "settings");
  const settings = settingsData ?? {};
  const language: Language = "en";
  const isStandaloneRoute = location.startsWith("/admin") || location.startsWith("/portal");
  useEffect(() => {
    const primaryColor = settings.primaryColor;
    const accentColor = settings.accentColor;
    if (primaryColor && /^#[\da-f]{6}$/i.test(primaryColor)) document.documentElement.style.setProperty("--ptr-primary", primaryColor);
    if (accentColor && /^#[\da-f]{6}$/i.test(accentColor)) document.documentElement.style.setProperty("--ptr-accent", accentColor);
  }, [settings.accentColor, settings.primaryColor]);

  const trackedPath = location === "/" ? "/" : location.replace(/\/$/, "") || "/";

  useEffect(() => {
    apiRequest("analytics/page-views", { method: "POST", body: { path: trackedPath } }).catch(() => undefined);
  }, [trackedPath]);

  return <><PageMeta language={language} />{!isStandaloneRoute && <SiteNav language={language} settings={settings} />}<Router language={language} />{!isStandaloneRoute && <SiteFooter language={language} settings={settings} />}</>;
}

function App() {
  return <ErrorBoundary><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><AppFrame /></TooltipProvider></ThemeProvider></WouterRouter></ErrorBoundary>;
}

export default App;

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect, useState } from "react";
import { Redirect, Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import NotFound from "./pages/NotFound";
import { SiteFooter } from "./components/ptrp/SiteFooter";
import { SiteNav } from "./components/ptrp/SiteNav";
import { brand, sectionMeta, type Language } from "./data/ptrp";

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
  "/portal": "Portal Login",
  "/admin": "Administrator Workspace",
  "/404": "Page Not Found",
};

function PageMeta({ language }: { language: Language }) {
  const [location] = useLocation();
  useEffect(() => {
    const meta = sectionMeta[location];
    const pageTitle = pageTitles[location];
    const title = location === "/" ? `${brand.name} — ${brand.subtitle}` : pageTitle ? `${pageTitle} — ${brand.name}` : `${brand.name} — ${brand.subtitle}`;
    const description = location === "/"
      ? "PTR Alumni Network is the official digital community for the Primary Teacher Residency Program (PTRP) in Rwanda — connecting resident teachers, alumni, mentors, and model schools."
      : meta?.description ?? "The official digital community for the Primary Teacher Residency Program (PTRP) in Rwanda.";
    document.title = title;
    document.documentElement.lang = language === "rw" ? "rw" : language;

    const robots = document.querySelector('meta[name="robots"]') ?? document.createElement("meta");
    robots.setAttribute("name", "robots");
    robots.setAttribute("content", location === "/portal" || location === "/admin" ? "noindex,nofollow" : "index,follow");
    document.head.appendChild(robots);

    const descriptionTag = document.querySelector('meta[name="description"]') ?? document.createElement("meta");
    descriptionTag.setAttribute("name", "description");
    descriptionTag.setAttribute("content", description);
    document.head.appendChild(descriptionTag);

    const propertyTags: Array<[string, string]> = [
      ["og:title", title],
      ["og:description", description],
      ["og:type", "website"],
      ["og:image", `${import.meta.env.BASE_URL.replace(/\/$/, "")}/manus-storage/ptrp-pilot-launch.jpg`],
      ["twitter:title", title],
      ["twitter:description", description],
    ];
    for (const [property, content] of propertyTags) {
      const isProperty = property.startsWith("og:");
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      const tag = document.querySelector(selector) ?? document.createElement("meta");
      tag.setAttribute(isProperty ? "property" : "name", property);
      tag.setAttribute("content", content);
      document.head.appendChild(tag);
    }
  }, [language, location]);
  return null;
}

function Router({ language }: { language: Language }) {
  return <Suspense fallback={<div className="min-h-[40vh] bg-white" aria-busy="true" />}>
    <Switch>
      <Route path="/"><Home language={language} /></Route>
      <Route path="/about"><AboutPage /></Route>
      <Route path="/network"><SchoolsPage /></Route>
      <Route path="/impact"><ImpactPage /></Route>
      <Route path="/news"><NewsPage /></Route>
      <Route path="/gallery"><GalleryPage /></Route>
      <Route path="/alumni"><AlumniPage /></Route>
      <Route path="/resources"><ResourcesPage /></Route>
      <Route path="/partners"><PartnersPage /></Route>
      <Route path="/contact"><ContactPage /></Route>
      <Route path="/activities"><Redirect to="/news" /></Route>
      <Route path="/practices"><Redirect to="/resources" /></Route>
      <Route path="/portal"><Portal language={language} /></Route>
      <Route path="/admin"><AdminDashboard /></Route>
      <Route path="/404"><NotFound language={language} /></Route>
      <Route><NotFound language={language} /></Route>
    </Switch>
  </Suspense>;
}

function AppFrame() {
  const [location] = useLocation();
  const [language, setLanguage] = useState<Language>(() => {
    try { return (localStorage.getItem("ptrp-language") as Language) || "en"; } catch { return "en"; }
  });
  const updateLanguage = (next: Language) => { setLanguage(next); try { localStorage.setItem("ptrp-language", next); } catch { /* storage is optional */ } };
  const isStandaloneRoute = location.startsWith("/admin") || location.startsWith("/portal");
  return <><PageMeta language={language} />{!isStandaloneRoute && <SiteNav language={language} onLanguageChange={updateLanguage} />}<Router language={language} />{!isStandaloneRoute && <SiteFooter language={language} />}</>;
}

function App() {
  return <ErrorBoundary><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><AppFrame /></TooltipProvider></ThemeProvider></WouterRouter></ErrorBoundary>;
}

export default App;

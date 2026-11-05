import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Portal from "./pages/Portal";
import AdminDashboard from "./pages/AdminDashboard";
import SectionPage from "./pages/SectionPage";
import { SiteFooter } from "./components/ptrp/SiteFooter";
import { SiteNav } from "./components/ptrp/SiteNav";
import { sectionMeta, type Language } from "./data/ptrp";

function PageMeta({ language }: { language: Language }) {
  const [location] = useLocation();
  useEffect(() => {
    const meta = sectionMeta[location];
    const title = location === "/" ? "PTR Alumni Network — Connecting Resident Teachers, Inspiring Educational Excellence" : location === "/portal" ? "Portal Login — PTR Alumni Network" : location === "/404" ? "Page Not Found — PTR Alumni Network" : location === "/about" ? "About Us — PTR Alumni Network" : meta ? `${meta.eyebrow} — PTR Alumni Network` : "PTR Alumni Network";
    const description = location === "/" ? "PTR Alumni Network is the official digital community for the Primary Teacher Residency Program (PTRP) in Rwanda — connecting resident teachers, alumni, mentors, and model schools." : meta?.description ?? "The official digital community for the Primary Teacher Residency Program (PTRP) in Rwanda.";
    document.title = title;
    document.documentElement.lang = language === "rw" ? "rw" : language;
    const robots = document.querySelector('meta[name="robots"]') ?? document.createElement("meta");
    robots.setAttribute("name", "robots"); robots.setAttribute("content", location === "/portal" ? "noindex,nofollow" : "index,follow"); document.head.appendChild(robots);
    const tag = document.querySelector('meta[name="description"]') ?? document.createElement("meta");
    tag.setAttribute("name", "description"); tag.setAttribute("content", description); document.head.appendChild(tag);
  }, [language, location]);
  return null;
}

function Router({ language }: { language: Language }) {
  return <Switch>
    <Route path="/"><Home language={language} /></Route>
    <Route path="/portal"><Portal language={language} /></Route>
    <Route path="/admin"><AdminDashboard /></Route>
    {Object.keys(sectionMeta).map((path) => <Route key={path} path={path}><SectionPage path={path} language={language} /></Route>)}
    <Route path="/404"><NotFound language={language} /></Route>
    <Route><NotFound language={language} /></Route>
  </Switch>;
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

import { ArrowLeft, AlertCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { copy, type Language } from "@/data/ptrp";
import { BrandMark } from "@/components/ptrp/BrandMark";
import { useEffect } from "react";

// Hosting answers this path with HTTP 404 while still serving the app.
const NOT_FOUND_PATH = "/404";

// Render for unknown routes and for items the server confirmed missing (e.g. `/page/:id`).
// The redirect is irreversible: never render while loading, on other errors, or before auth resolves.
export default function NotFound({ language }: { language: Language }) {
  const t = copy[language];
  const [, setLocation] = useLocation();

  useEffect(() => {
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);

    // Full-page navigation: a client-side route change sends no request, so no 404 status.
    if (window.location.pathname.replace(/\/$/, "") !== NOT_FOUND_PATH) {
      window.location.replace(NOT_FOUND_PATH);
    }

    return () => robots.remove();
  }, []);

  const handleGoHome = () => {
    setLocation("/");
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

      {/* 404 Content */}
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12 py-20 md:py-28 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] items-center">
          
          {/* Left: Illustration & Message */}
          <div className="space-y-8">
            <div className="relative">
              <AlertCircle className="size-24 text-[#e0f2fe]" />
              <div className="absolute inset-0 bg-[#0098d9]/10 rounded-full animate-pulse" />
            </div>
            <h1 className="text-[3rem] md:text-[4rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#111] mb-6">
              404
            </h1>
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111] mb-4">Page Not Found</h2>
            <p className="text-[#4b5563] text-lg leading-[1.8] max-w-lg">
              Sorry, the page you are looking for doesn't exist. It may have been moved or deleted.
            </p>
          </div>

          {/* Right: Action Card */}
          <div className="bg-[#f8fafc] rounded-xl p-8 border border-[#e2eef0] shadow-sm">
            <BrandMark compact />
            <div className="mt-6 space-y-6">
              <div className="border-l-4 border-[#0098d9] pl-5 py-4 bg-white rounded-r-lg">
                <p className="eyebrow text-[#0098d9] mb-2">Explore PTR Alumni Network</p>
                <p className="text-[#4b5563] text-sm leading-[1.7]">
                  Discover the Primary Teacher Residency Program, meet our network of resident teachers,
                  and explore model schools across Rwanda.
                </p>
              </div>
              <Link
                href="/"
                className="button-primary w-full py-3 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="size-4" /> Return to homepage
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-[#e2eef0]">
              <p className="eyebrow text-[#0098d9] mb-4">Quick Links</p>
              <div className="space-y-3">
                {[
                  { label: "About PTR Alumni Network", href: "/about" },
                  { label: "Our Network", href: "/network" },
                  { label: "Activities", href: "/activities" },
                  { label: "Best Practices", href: "/practices" },
                  { label: "Impact", href: "/impact" },
                  { label: "Contact", href: "/contact" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-bold text-[#0098d9] hover:underline transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

import { Link } from "wouter";
import { ArrowUpRight, FileText } from "lucide-react";
import { PageHero } from "./PageHero";

export type CmsPageSection = {
  type: "text" | "image" | "cards" | "callout";
  title?: string;
  body?: string;
  imageUrl?: string;
  imageAlt?: string;
  items?: Array<{ title: string; body?: string; imageUrl?: string; href?: string }>;
  buttonLabel?: string;
  buttonHref?: string;
};

export type CmsPageLayout = {
  eyebrow?: string;
  heroImage?: string;
  heroImageAlt?: string;
  sections: CmsPageSection[];
};

export function parseCmsPageLayout(body: string): CmsPageLayout | null {
  try {
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || !Array.isArray((parsed as CmsPageLayout).sections)) return null;
    return parsed as CmsPageLayout;
  } catch {
    return null;
  }
}

function isSafeHref(href: string) {
  return href.startsWith("/") || /^https?:\/\//i.test(href);
}

function CmsLink({ href, children, className }: { href: string; children: React.ReactNode; className: string }) {
  if (!isSafeHref(href)) return null;
  if (/^https?:\/\//i.test(href)) {
    return <a href={href} className={className} target="_blank" rel="noreferrer">{children}</a>;
  }
  return <Link href={href} className={className}>{children}</Link>;
}

export function CmsPageRenderer({ title, summary, layout }: { title: string; summary: string; layout: CmsPageLayout }) {
  return (
    <main>
      <PageHero
        eyebrow={layout.eyebrow || "Website"}
        title={title}
        description={summary}
        icon={FileText}
        image={layout.heroImage}
        imageAlt={layout.heroImageAlt || ""}
      />
      {layout.sections.map((section, index) => (
        <section key={`${section.type}-${index}`} className={`${index % 2 ? "bg-[#f6fafb]" : "bg-white"} py-12 md:py-16`}>
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            {section.title && <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-[#0b2347] md:text-3xl">{section.title}</h2>}
            {section.type === "text" && section.body && (
              <div className="mt-4 max-w-4xl space-y-4 text-[0.98rem] leading-8 text-[#4b5563]">
                {section.body.split(/\n{2,}/).map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
              </div>
            )}
            {section.type === "image" && section.imageUrl && (
              <figure className="mt-5 max-w-4xl">
                <img src={section.imageUrl} alt={section.imageAlt || section.title || ""} className="max-h-[560px] w-full rounded-xl object-cover" loading="lazy" />
                {section.body && <figcaption className="mt-2 text-sm text-[#64748b]">{section.body}</figcaption>}
              </figure>
            )}
            {section.type === "cards" && section.items && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item, itemIndex) => (
                  <article key={`${item.title}-${itemIndex}`} className="overflow-hidden rounded-xl border border-[#e2eef0] bg-white">
                    {item.imageUrl && <img src={item.imageUrl} alt="" className="aspect-[16/9] w-full object-cover" loading="lazy" />}
                    <div className="p-5">
                      <h3 className="font-extrabold text-[#0b2347]">{item.title}</h3>
                      {item.body && <p className="mt-2 text-sm leading-6 text-[#4b5563]">{item.body}</p>}
                      {item.href && <CmsLink href={item.href} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#0098d9]">Learn more <ArrowUpRight className="size-4" /></CmsLink>}
                    </div>
                  </article>
                ))}
              </div>
            )}
            {section.type === "callout" && (
              <div className="mt-5 rounded-xl border border-[#dce8ed] bg-[#0b2347] p-6 text-white md:p-8">
                {section.body && <p className="max-w-3xl leading-7 text-white/75">{section.body}</p>}
                {section.buttonLabel && section.buttonHref && <CmsLink href={section.buttonHref} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0098d9] px-4 py-2.5 text-sm font-bold text-white">{section.buttonLabel}<ArrowUpRight className="size-4" /></CmsLink>}
              </div>
            )}
          </div>
        </section>
      ))}
    </main>
  );
}

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isOptionalText(value: unknown, maxLength: number) {
  return value === undefined || (typeof value === "string" && value.length <= maxLength);
}

function isSafeHref(href: string) {
  if (href.startsWith("/") && !href.startsWith("//")) return true;
  try {
    const url = new URL(href);
    return (url.protocol === "http:" || url.protocol === "https:") && !url.username && !url.password;
  } catch {
    return false;
  }
}

function isOptionalSafeHref(value: unknown) {
  return value === undefined || (typeof value === "string" && value.length <= 2000 && (value === "" || isSafeHref(value)));
}

function isCmsPageLayout(value: unknown): value is CmsPageLayout {
  if (!isRecord(value) || !Array.isArray(value.sections) || value.sections.length > 100) return false;
  if (
    !isOptionalText(value.eyebrow, 120)
    || !isOptionalText(value.heroImageAlt, 255)
    || !isOptionalText(value.heroImage, 2000)
    || !isOptionalSafeHref(value.heroImage)
  ) return false;

  for (const section of value.sections) {
    if (!isRecord(section) || !["text", "image", "cards", "callout"].includes(String(section.type))) return false;
    if (
      !isOptionalText(section.title, 255)
      || !isOptionalText(section.body, 20000)
      || !isOptionalText(section.imageAlt, 255)
      || !isOptionalText(section.buttonLabel, 120)
      || !isOptionalText(section.imageUrl, 2000)
      || !isOptionalSafeHref(section.imageUrl)
      || !isOptionalSafeHref(section.buttonHref)
    ) return false;

    if (section.items !== undefined) {
      if (!Array.isArray(section.items) || section.items.length > 30) return false;
      for (const item of section.items) {
        if (!isRecord(item) || typeof item.title !== "string" || !item.title.trim() || item.title.length > 255) return false;
        if (
          !isOptionalText(item.body, 10000)
          || !isOptionalText(item.imageUrl, 2000)
          || !isOptionalSafeHref(item.imageUrl)
          || !isOptionalSafeHref(item.href)
        ) return false;
      }
    }
  }
  return true;
}

export function parseCmsPageLayout(body: string): CmsPageLayout | null {
  try {
    const parsed: unknown = JSON.parse(body);
    return isCmsPageLayout(parsed) ? parsed : null;
  } catch {
    return null;
  }
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

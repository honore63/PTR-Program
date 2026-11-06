import { useMemo } from "react";
import { GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLocation } from "wouter";
import { queryKeys, useApiQuery } from "@/lib/api";
import { PublicImage } from "./PublicImage";
import { RotatingBannerHeading } from "./RotatingBannerHeading";
import { getBannerHeadings } from "./bannerHeadings";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
  icon?: LucideIcon;
  image?: string;
  imageAlt?: string;
  imageCredit?: string;
  children?: React.ReactNode;
};

type PageBanner = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imagePosition: string;
  isVisible: boolean | number;
};

const defaultBannerImages: Record<string, string> = {
  home: "gallery/gallery-07.jpg",
  about: "gallery/gallery-01.jpg",
  network: "gallery/gallery-07.jpg",
  impact: "gallery/gallery-05.jpg",
  news: "manus-storage/ptrp-residents-2.jpg",
  gallery: "gallery/gallery-04.jpg",
  alumni: "gallery/gallery-02.jpg",
  resources: "gallery/gallery-03.jpg",
  partners: "manus-storage/ptrp-pilot-launch.jpg",
  contact: "gallery/gallery-06.jpg",
  team: "gallery/gallery-05.jpg",
  residents: "gallery/gallery-08.jpg",
  "register-resident": "gallery/gallery-03.jpg",
  "resident-teacher": "manus-storage/ptrp-residents-2.jpg",
};

export function PageHero({ eyebrow, title, description, meta, icon: Icon = GraduationCap, image, imageAlt = "", imageCredit, children }: PageHeroProps) {
  const [location] = useLocation();
  const slug = location === "/" ? "home" : location.replace(/^\/+|\/+$/g, "");
  const bannerSlug = slug.startsWith("resident-teacher/") ? "resident-teacher" : slug;
  const bannerQuery = useApiQuery<PageBanner | null>(
    queryKeys.publicPageBanner(bannerSlug),
    `banners/${bannerSlug}`,
    Object.hasOwn(defaultBannerImages, bannerSlug),
  );
  const banner = bannerQuery.data;
  const fallbackImage = image || defaultBannerImages[bannerSlug] || defaultBannerImages.about;
  const bannerImage = banner?.imageUrl || fallbackImage;
  const showImage = banner ? Boolean(Number(banner.isVisible)) : Boolean(bannerImage);
  const headings = useMemo(
    () => getBannerHeadings(bannerSlug, title, banner?.title),
    [bannerSlug, title, banner?.title],
  );

  return (
    <>
      <section className={`page-banner relative isolate flex min-h-[300px] items-center overflow-hidden bg-[#071935] text-white sm:min-h-[360px] lg:min-h-[410px] ${showImage ? "page-banner-photo" : ""}`}>
        {showImage && (
          <PublicImage
            src={bannerImage}
            fallbackSrc={[fallbackImage, defaultBannerImages.about]}
            alt={banner?.imageAlt || imageAlt || `${title} banner`}
            className="page-banner-image absolute inset-0 -z-10 h-full w-full object-cover"
            objectPosition={banner?.imagePosition || "center"}
            fetchPriority="high"
            loading="eager"
          />
        )}
        <div className="page-banner-overlay absolute inset-0 -z-10" />
        <div className="relative mx-auto flex w-full max-w-[1400px] items-center px-5 py-14 sm:py-16 md:px-8 lg:px-12">
          <RotatingBannerHeading headings={headings} className="max-w-4xl text-[2.4rem] font-extrabold leading-[1.04] tracking-[-0.04em] sm:text-[3.2rem] md:text-[3.7rem] lg:text-[4.3rem]" />
        </div>
      </section>
      <section className="page-banner-copy bg-[#f6fafb]">
        <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-8 md:py-10 lg:px-12">
          <p className="eyebrow text-[#168d6d]">
            <span className="eyebrow-dot bg-[#16a878]" />
            PTR Alumni Network · {banner?.eyebrow || eyebrow}
          </p>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[#42566b] sm:text-base sm:leading-8">
            {banner?.description || description}
          </p>
          {children && <div className="mt-5 flex flex-wrap gap-3">{children}</div>}
          {(meta || (showImage && imageCredit)) && (
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-[#62768a]">
              {meta && <span className="inline-flex items-center gap-2"><Icon className="size-4 text-[#0098d9]" strokeWidth={1.7} />{meta}</span>}
              {showImage && imageCredit && <span>{imageCredit}</span>}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

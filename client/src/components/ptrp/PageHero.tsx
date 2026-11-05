import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLocation } from "wouter";
import { queryKeys, useApiQuery } from "@/lib/api";

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
};

function publicImageUrl(image: string) {
  if (/^https?:\/\//i.test(image) || image.startsWith(import.meta.env.BASE_URL)) return image;
  return `${import.meta.env.BASE_URL}${image.replace(/^\/+/, "")}`;
}

export function PageHero({ eyebrow, title, description, meta, icon: Icon = GraduationCap, image, imageAlt = "", imageCredit, children }: PageHeroProps) {
  const [location] = useLocation();
  const slug = location === "/" ? "home" : location.replace(/^\/+|\/+$/g, "");
  const bannerQuery = useApiQuery<PageBanner | null>(
    queryKeys.publicPageBanner(slug),
    `banners/${slug}`,
    Object.hasOwn(defaultBannerImages, slug),
  );
  const banner = bannerQuery.data;
  const bannerImage = banner
    ? banner.imageUrl
    : image || defaultBannerImages[slug] || "";
  const showImage = Boolean(bannerImage) && (banner ? Boolean(Number(banner.isVisible)) : true);

  return (
    <section className={`page-banner relative isolate flex min-h-[390px] items-center overflow-hidden bg-[#071935] text-white sm:min-h-[430px] lg:min-h-[470px] ${showImage ? "page-banner-photo" : ""}`}>
      {showImage && (
        <img
          src={publicImageUrl(bannerImage)}
          alt={banner?.imageAlt || imageAlt}
          className="page-banner-image absolute inset-0 -z-10 h-full w-full object-cover"
          style={{ objectPosition: banner?.imagePosition || "center" }}
          fetchPriority="high"
        />
      )}
      <div className="page-banner-overlay absolute inset-0 -z-10" />
      <div className="relative mx-auto flex w-full max-w-[1400px] items-center px-5 py-14 sm:py-16 md:px-8 md:py-20 lg:px-12 lg:py-24">
        <div className="max-w-3xl">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="eyebrow text-[#7dd3fc]">
            <span className="eyebrow-dot bg-[#38bdf8]" />
            PTR Alumni Network · {banner?.eyebrow || eyebrow}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, duration: 0.55 }} className="mt-5 max-w-3xl text-[2.4rem] font-extrabold leading-[1.04] tracking-[-0.04em] sm:text-[3.2rem] md:text-[3.7rem] lg:text-[4.3rem]">
            {banner?.title || title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.55 }} className="mt-5 max-w-2xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
            {banner?.description || description}
          </motion.p>
          {children && <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.55 }} className="mt-7 flex flex-wrap gap-3">{children}</motion.div>}
          {meta && (
            <div className="mt-7 flex items-center gap-2 text-[0.66rem] font-extrabold uppercase tracking-[0.14em] text-white/70">
              <Icon className="size-4 text-[#7dd3fc]" strokeWidth={1.7} />
              <span>{meta}</span>
            </div>
          )}
        </div>
      </div>
      {showImage && imageCredit && (
        <span className="absolute bottom-3 right-5 rounded-full border border-white/15 bg-[#071935]/50 px-3 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-white/70 backdrop-blur-sm md:right-8 lg:right-12">
          {imageCredit}
        </span>
      )}
    </section>
  );
}

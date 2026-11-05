import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

export function PageHero({ eyebrow, title, description, meta, icon: Icon = GraduationCap, image, imageAlt = "", imageCredit, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#0b2347] pt-[78px] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#0098d9]/20 to-transparent" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
      </div>
      <div className="relative mx-auto grid max-w-[1400px] gap-10 px-5 py-16 md:px-8 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16 lg:px-12 lg:py-24">
        <div className="max-w-3xl">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="eyebrow text-[#38bdf8]">
            <span className="eyebrow-dot bg-[#38bdf8]" />
            PTR Alumni Network · {eyebrow}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.6 }} className="mt-5 text-[2.65rem] font-extrabold leading-[1.03] tracking-[-0.035em] sm:text-[3.4rem] lg:text-[4.15rem]">
            {title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.6 }} className="mt-6 max-w-2xl text-[0.98rem] leading-[1.8] text-white/70">
            {description}
          </motion.p>
          {children && <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.6 }} className="mt-8 flex flex-wrap gap-3">{children}</motion.div>}
        </div>
        <div className="relative">
          {image ? (
            <motion.figure initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12, duration: 0.7 }} className="relative overflow-hidden border border-white/15 bg-white/5 shadow-2xl">
              <img src={image} alt={imageAlt} className="aspect-[4/3] w-full object-contain" loading="eager" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-12 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white/70">
                <span>{imageCredit ?? "PTR Alumni Network"}</span>
                <span>{eyebrow}</span>
              </figcaption>
            </motion.figure>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12, duration: 0.7 }} className="relative overflow-hidden border border-white/15 bg-white/[0.06] p-7 backdrop-blur-sm">
              <Icon className="size-14 text-[#38bdf8]" strokeWidth={1.4} />
              {meta && <p className="mt-10 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white/45">{meta}</p>}
              <p className="mt-3 text-2xl font-extrabold leading-tight tracking-[-0.04em] text-white">One network.<br />Every classroom.</p>
              <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#38bdf8]">
                <span className="h-2 w-2 bg-[#38bdf8]" />
                Inspire · Educate · Empower
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

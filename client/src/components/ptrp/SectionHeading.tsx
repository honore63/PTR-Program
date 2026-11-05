import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

type SectionHeadingProps = { eyebrow: string; title: string; body?: string; cta?: string; href?: string; light?: boolean };

export function SectionHeading({ eyebrow, title, body, cta, href, light = false }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
      <div className="max-w-3xl">
        <motion.p initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} className={`eyebrow ${light ? "text-[#38bdf8]" : "text-[#0098d9]"}`}>{eyebrow}</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: 0.06 }} className={`mt-4 max-w-2xl text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-[2.75rem] ${light ? "text-white" : "text-[#111]"}`}>{title}</motion.h2>
        {body && <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: 0.12 }} className={`mt-5 max-w-xl text-[0.95rem] leading-[1.7] ${light ? "text-white/70" : "text-[#4b5563]"}`}>{body}</motion.p>}
      </div>
      {cta && href && <Link href={href} className={`group inline-flex shrink-0 items-center gap-2 text-[0.85rem] font-bold uppercase tracking-wide ${light ? "text-white" : "text-[#0098d9]"}`}>{cta}<ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>}
    </div>
  );
}

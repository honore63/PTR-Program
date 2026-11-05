import { motion, useInView } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import type { LucideIcon } from "lucide-react";

export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const duration = 1100;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCurrent(Math.round((1 - Math.pow(1 - progress, 3)) * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);
  return <span ref={ref}>{current}{suffix}</span>;
}

export function StatCard({ value, suffix, label, detail, icon: Icon, tone }: { value: number; suffix?: string; label: string; detail: string; icon: LucideIcon; tone: string }) {
  return <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="stat-card">
    <div className={`stat-icon stat-icon-${tone}`}><Icon /></div>
    <p className="mt-9 font-display text-5xl font-extrabold tracking-[-0.07em] text-[#0b2347] sm:text-6xl"><CountUp value={value} suffix={suffix} /></p>
    <p className="mt-2 text-sm font-bold text-[#264665]">{label}</p>
    <p className="mt-1 text-xs text-[#7b8da2]">{detail}</p>
  </motion.div>;
}

export function FeatureCard({ icon: Icon, title, body, href, accent }: { icon: LucideIcon; title: string; body: string; href: string; accent: string }) {
  return <Link href={href} className="feature-card group"><span className={`feature-icon feature-icon-${accent}`}><Icon /></span><div className="mt-8 flex items-start justify-between gap-3"><h3 className="font-display text-2xl font-extrabold tracking-[-0.045em] text-[#0b2347]">{title}</h3><ArrowUpRight className="mt-1 size-5 shrink-0 text-[#6b849d] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div><p className="mt-3 text-sm leading-6 text-[#60758c]">{body}</p><span className="mt-7 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#168d6d]">Explore <span aria-hidden="true">→</span></span></Link>;
}

export function StatusPill({ children }: { children: React.ReactNode }) { return <span className="status-pill"><CheckCircle2 className="size-3.5" />{children}</span>; }

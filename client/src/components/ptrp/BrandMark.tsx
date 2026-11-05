import { GraduationCap } from "lucide-react";
import { Link } from "wouter";

type BrandMarkProps = { compact?: boolean; light?: boolean };

export function BrandMark({ compact = false, light = false }: BrandMarkProps) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="PTR Alumni Network home">
      <span className={`brand-mark ${light ? "brand-mark-light" : ""}`} aria-hidden="true">
        <GraduationCap className="w-7 h-7" />
      </span>
      <span className="leading-none">
        <span className={`block text-[1.35rem] font-extrabold tracking-[-0.02em] ${light ? "text-white" : "text-[#111]"}`}>PTR</span>
        {!compact && <span className={`mt-1 block text-[0.65rem] font-bold uppercase tracking-[0.14em] ${light ? "text-white/70" : "text-[#6b7280]"}`}>ALUMNI NETWORK</span>}
      </span>
    </Link>
  );
}

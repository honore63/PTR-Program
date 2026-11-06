import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { resolveMediaUrl } from "@/lib/api";

type PublicImageProps = {
  src: string;
  fallbackSrc?: string[];
  alt: string;
  className: string;
  objectPosition?: string;
  fetchPriority?: "high" | "low" | "auto";
  loading?: "eager" | "lazy";
};

export function resolvePublicImageUrl(src: string): string {
  const resolvedUrl = resolveMediaUrl(src) ?? src;
  const legacyStoragePath = resolvedUrl.match(/^\/PTRP\/storage\/(.+)$/);
  if (legacyStoragePath && import.meta.env.BASE_URL !== "/PTRP/") {
    return `${import.meta.env.BASE_URL}storage/${legacyStoragePath[1]}`;
  }
  if (/^(?:https?:)?\/\//i.test(resolvedUrl) || resolvedUrl.startsWith(import.meta.env.BASE_URL)) {
    return resolvedUrl;
  }
  return `${import.meta.env.BASE_URL}${resolvedUrl.replace(/^\/+/, "")}`;
}

export function PublicImage({
  src,
  fallbackSrc = [],
  alt,
  className,
  objectPosition = "center",
  fetchPriority = "auto",
  loading = "lazy",
}: PublicImageProps) {
  const candidates = [...new Set([src, ...fallbackSrc].filter(Boolean))];
  const candidateKey = candidates.join("\u0000");
  const [failedState, setFailedState] = useState<{ key: string; sources: string[] }>({
    key: "",
    sources: [],
  });
  const failedSources = failedState.key === candidateKey ? failedState.sources : [];
  const activeSource = candidates.find((candidate) => !failedSources.includes(candidate));

  if (!activeSource) {
    return (
      <div
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={`${className} flex items-center justify-center bg-gradient-to-br from-[#0b2347] via-[#123c68] to-[#087ca8] text-white`}
      >
        <span className="flex flex-col items-center gap-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/85">
          <GraduationCap className="size-10 text-[#7dd3fc]" strokeWidth={1.5} />
          PTRP
        </span>
      </div>
    );
  }

  return (
    <img
      src={resolvePublicImageUrl(activeSource)}
      alt={alt}
      className={className}
      style={{ objectPosition }}
      sizes="100vw"
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      onError={() => {
        console.warn("PTRP image failed to load:", resolvePublicImageUrl(activeSource).split(/[?#]/, 1)[0]);
        setFailedState((current) => {
          const sources = current.key === candidateKey ? current.sources : [];
          if (sources.includes(activeSource)) return current;
          return { key: candidateKey, sources: [...sources, activeSource] };
        });
      }}
    />
  );
}

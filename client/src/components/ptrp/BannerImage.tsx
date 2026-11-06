import { useState } from "react";
import { resolveMediaUrl } from "@/lib/api";

type BannerImageProps = {
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
  if (/^(?:https?:)?\/\//i.test(resolvedUrl) || resolvedUrl.startsWith(import.meta.env.BASE_URL)) {
    return resolvedUrl;
  }
  return `${import.meta.env.BASE_URL}${resolvedUrl.replace(/^\/+/, "")}`;
}

export function BannerImage({
  src,
  fallbackSrc = [],
  alt,
  className,
  objectPosition = "center",
  fetchPriority = "auto",
  loading = "eager",
}: BannerImageProps) {
  const candidates = [...new Set([src, ...fallbackSrc].filter(Boolean))];
  const candidateKey = candidates.join("\u0000");
  const [failedState, setFailedState] = useState<{ key: string; sources: string[] }>({
    key: "",
    sources: [],
  });
  const failedSources = failedState.key === candidateKey ? failedState.sources : [];
  const activeSource = candidates.find((candidate) => !failedSources.includes(candidate));

  if (!activeSource) return null;

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
        setFailedState((current) => {
          const sources = current.key === candidateKey ? current.sources : [];
          if (sources.includes(activeSource)) return current;
          return { key: candidateKey, sources: [...sources, activeSource] };
        });
      }}
    />
  );
}

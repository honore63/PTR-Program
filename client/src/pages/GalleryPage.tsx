import { useEffect, useState } from "react";
import { ArrowUpRight, Camera, CheckCircle2, PlayCircle, ShieldCheck, X } from "lucide-react";
import { Link } from "wouter";
import { PageHero } from "@/components/ptrp/PageHero";
import { SectionHeading } from "@/components/ptrp/SectionHeading";
import { apiRequest } from "@/lib/api";
import { galleryAlbums, galleryPhotos, galleryRules } from "@/data/ptrp";

type Album = typeof galleryAlbums[number];
type GalleryPhoto = { src: string; alt: string };

const publicImageUrl = (image: string) => {
  if (/^https?:\/\//i.test(image) || image.startsWith(import.meta.env.BASE_URL)) return image;
  return `${import.meta.env.BASE_URL}${image.replace(/^\/+/, "")}`;
};

export default function GalleryPage() {
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [apiPhotos, setApiPhotos] = useState<GalleryPhoto[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiRequest<any[]>("gallery").then((items) => {
      if (!Array.isArray(items)) throw new Error("The gallery API returned an invalid response.");
      const photos = items
        .filter((item) => item.mediaType === "image" && item.url)
        .map((item) => ({ src: String(item.url), alt: String(item.caption || item.title || "PTRP community photo") }));
      if (!cancelled && photos.length) setApiPhotos(photos);
    }).catch((error) => {
      console.error("Gallery API error", error);
    });
    return () => { cancelled = true; };
  }, []);

  const photos = apiPhotos ?? galleryPhotos;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setActiveAlbum(null); setLightboxIndex(null); }
      if (lightboxIndex !== null) {
        if (event.key === "ArrowRight") setLightboxIndex((i) => (i! + 1) % photos.length);
        if (event.key === "ArrowLeft") setLightboxIndex((i) => (i! - 1 + photos.length) % photos.length);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, photos.length]);

  return <main>
    <PageHero
      eyebrow="Gallery"
      title="Our Journey in Pictures and Videos"
      description="From graduation and commissioning to the residency at both host colleges, model school practice, training, and alumni events — explore the story of PTRP and the network it created."
      image="/gallery/gallery-01.jpg"
      imageAlt="PTRP gallery - community moments in pictures and videos"
      imageCredit="Photo: MINEDUC · PTR Alumni Network"
    >
      <Link href="#albums" className="button-primary">Browse albums <ArrowUpRight className="size-4" /></Link>
      <Link href="/contact" className="button-ghost-light">Contribute media</Link>
    </PageHero>

    <section id="albums" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="Albums" title="A visual record of the residency year and beyond." body="Select an album to view its description and available media. Where a photo or video is not yet available, the album remains a placeholder for approved contributions." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryAlbums.map((album, index) => <button key={album.title} type="button" onClick={() => setActiveAlbum(album)} className={`group flex flex-col overflow-hidden border border-[#dce8ed] bg-white text-left transition-shadow hover:shadow-lg ${index === 0 ? "lg:col-span-2" : ""}`}>
            <div className={`relative w-full overflow-hidden bg-gradient-to-br ${album.gradient} ${index === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
              {album.image && <img src={publicImageUrl(album.image)} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />}
              {album.videoUrl && <PlayCircle className="absolute right-4 top-4 size-6 text-white drop-shadow" />}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.12em] text-[#0098d9]">{album.date}</span>
              <h2 className={`mt-2 font-extrabold leading-tight tracking-[-0.04em] text-[#0b2347] ${index === 0 ? "text-2xl sm:text-3xl" : "text-lg"}`}>{album.title}</h2>
              <p className="mt-2 max-w-md text-[0.72rem] leading-5 text-[#4b5563]">{album.body}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">Open album <ArrowUpRight className="size-3.5" /></span>
            </div>
          </button>)}
        </div>
        <p className="mt-5 text-[0.68rem] leading-6 text-[#7b8da2]">Launch and residency photographs are credited to MINEDUC. Additional albums will be populated through approved alumni submissions.</p>
      </div>
    </section>

    <section id="photos" className="scroll-mt-24 bg-[#f6fafb] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="Community photos" title="Moments from the network." body="Approved photographs from PTRP events, residencies, and alumni gatherings. Click any photo to view it larger." />
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, index) => (
            <button key={photo.src} type="button" onClick={() => setLightboxIndex(index)} className="group relative aspect-square overflow-hidden border border-[#dce8ed] bg-white" aria-label={`View photo ${index + 1}`}>
              <img src={publicImageUrl(photo.src)} alt={photo.alt} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </section>

    {lightboxIndex !== null && (
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#071935]/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setLightboxIndex(null)}>
        <button type="button" onClick={() => setLightboxIndex(null)} className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center border border-white/20 bg-white/10 text-white hover:bg-white/20" aria-label="Close photo"><X className="size-5" /></button>
        <button type="button" onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i! - 1 + photos.length) % photos.length); }} className="absolute left-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center border border-white/20 bg-white/10 text-white hover:bg-white/20" aria-label="Previous photo">‹</button>
        <button type="button" onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i! + 1) % photos.length); }} className="absolute right-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center border border-white/20 bg-white/10 text-white hover:bg-white/20" aria-label="Next photo">›</button>
        <img src={publicImageUrl(photos[lightboxIndex].src)} alt={photos[lightboxIndex].alt} className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-white/60">{lightboxIndex + 1} / {photos.length}</p>
      </div>
    )}

    <section className="bg-[#f6fafb] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading eyebrow="How alumni contribute" title="Add your part of the story." body="Members upload photos and videos with a title, date, and school. An administrator reviews every submission before anything is published." />
            <div className="mt-8 space-y-4">
              {[
                { step: "01", title: "Prepare your media", body: "Choose a photo or video you have permission to share. Include a title, date, and school." },
                { step: "02", title: "Submit for review", body: "Send the media to the network through the contact page or the member portal." },
                { step: "03", title: "Admin approval", body: "An administrator checks consent, context, and quality before publishing." },
              ].map((item) => <div key={item.step} className="flex items-start gap-4 border border-[#e2eef0] bg-white p-5"><span className="flex size-9 shrink-0 items-center justify-center bg-[#0098d9] text-[0.66rem] font-extrabold text-white">{item.step}</span><div><h3 className="text-sm font-extrabold text-[#0b2347]">{item.title}</h3><p className="mt-1 text-sm leading-6 text-[#4b5563]">{item.body}</p></div></div>)}
            </div>
          </div>
          <div className="border border-[#dce8ed] bg-[#0b2347] p-7 text-white sm:p-9">
            <div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-[#38bdf8]">Before you upload</p><h2 className="mt-4 text-2xl font-extrabold tracking-[-0.04em]">Media rules that protect everyone.</h2></div><ShieldCheck className="size-9 shrink-0 text-[#38bdf8]" /></div>
            <ul className="mt-7 space-y-4">{galleryRules.map((rule) => <li key={rule} className="flex items-start gap-3 text-sm leading-6 text-white/65"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#38bdf8]" />{rule}</li>)}</ul>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 border border-[#38bdf8] bg-[#0098d9] px-4 py-2.5 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-white">Submit media <ArrowUpRight className="size-4" /></Link>
          </div>
        </div>
      </div>
    </section>

    {activeAlbum && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#071935]/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${activeAlbum.title} album`} onClick={() => setActiveAlbum(null)}>
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-white/15 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={() => setActiveAlbum(null)} className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center border border-[#d1d5db] bg-white text-[#0b2347] hover:border-[#0098d9] hover:text-[#0098d9]" aria-label="Close album"><X className="size-5" /></button>
        {activeAlbum.videoUrl ? <div className="social-video-frame"><iframe src="https://www.youtube.com/embed/kDFHWe75e-I?rel=0" title={activeAlbum.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div> : activeAlbum.image ? <img src={activeAlbum.image} alt={activeAlbum.title} className="aspect-[16/10] w-full object-contain" /> : <div className={`flex aspect-[16/10] items-center justify-center bg-gradient-to-br ${activeAlbum.gradient}`}><Camera className="size-14 text-white/60" /></div>}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]"><span>{activeAlbum.date}</span>{activeAlbum.credit && <span className="text-[#8a9bab]">{activeAlbum.credit}</span>}</div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#0b2347]">{activeAlbum.title}</h2>
          <p className="mt-4 text-sm leading-7 text-[#4b5563]">{activeAlbum.body}</p>
          {activeAlbum.videoUrl && <a href={activeAlbum.videoUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">Open on YouTube <ArrowUpRight className="size-4" /></a>}
          <div className="mt-7 border-t border-[#e2eef0] pt-5"><Link href="/contact" className="button-primary" onClick={() => setActiveAlbum(null)}>Contribute to this album <ArrowUpRight className="size-4" /></Link></div>
        </div>
      </div>
    </div>}
  </main>;
}

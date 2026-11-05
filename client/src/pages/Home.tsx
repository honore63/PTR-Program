import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Handshake,
  MapPinned,
  PlayCircle,
  Quote,
  School,
  UsersRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  brand,
  copy,
  homeContent,
  keyNumbers,
  newsPosts,
  officialPilot,
  officialSocialVideo,
  galleryPhotos,
  partners,
  programOverview,
  socialProfileEvidence,
  type Language,
} from "@/data/ptrp";
import { StatCard } from "@/components/ptrp/ContentCards";
import { SectionHeading } from "@/components/ptrp/SectionHeading";
import { queryKeys, useApiQuery } from "@/lib/api";

type HomeProps = { language: Language };

export default function Home({ language }: HomeProps) {
  const t = copy[language];
  const [leadStory, ...otherStories] = newsPosts;
  const latestStories = [leadStory, ...otherStories].slice(0, 3);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const heroImages = galleryPhotos.slice(0, 8);
  const { data: managedBanner } = useApiQuery<{
    title: string;
    description: string;
    eyebrow: string;
    imageUrl: string;
    imageAlt: string;
    imagePosition: string;
    isVisible: boolean | number;
  } | null>(queryKeys.publicPageBanner("home"), "banners/home");
  const managedImageVisible = Boolean(managedBanner && Number(managedBanner.isVisible));
  const slides = managedBanner
    ? managedImageVisible && managedBanner.imageUrl ? [{ src: managedBanner.imageUrl, alt: managedBanner.imageAlt }] : []
    : heroImages;
  const activeSlide = slides.length ? slides[managedBanner ? 0 : slide] : undefined;
  const heroImageUrl = (src: string) => {
    if (/^https?:\/\//i.test(src) || src.startsWith(import.meta.env.BASE_URL)) return src;
    return `${import.meta.env.BASE_URL}${src.replace(/^\/+/, "")}`;
  };
  useEffect(() => {
    if (managedBanner || paused || heroImages.length < 2) return;
    const id = window.setInterval(() => setSlide((s) => (s + 1) % heroImages.length), 5000);
    return () => window.clearInterval(id);
  }, [managedBanner, paused, heroImages.length]);

  return <main>
    <section className="relative isolate overflow-hidden bg-[#071935] text-white" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {activeSlide && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          {slides.map((photo, index) => (
            <img
              key={photo.src}
              src={heroImageUrl(photo.src)}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${index === (managedBanner ? 0 : slide) ? "opacity-100" : "opacity-0"}`}
              style={{ objectPosition: managedBanner?.imagePosition || "center" }}
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071935]/95 via-[#071935]/70 to-[#071935]/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071935]/80 via-transparent to-[#071935]/20" />
      <div className="relative mx-auto flex min-h-[510px] max-w-[1400px] flex-col justify-center px-5 py-16 sm:min-h-[560px] md:px-8 md:py-20 lg:min-h-[620px] lg:px-12">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 border border-[#38bdf8]/40 bg-[#0098d9]/15 px-3 py-1.5 text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-[#7dd3fc]">
              <span className="h-1.5 w-1.5 bg-[#38bdf8]" />
              {managedBanner?.eyebrow || t.hero.eyebrow}
            </span>
            <span className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white/45">Official community of PTRP</span>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, duration: 0.6 }} className="mt-7 text-[0.85rem] font-extrabold uppercase tracking-[0.24em] text-white/80">
            {brand.name}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }} className="mt-3 max-w-3xl text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.045em] sm:text-[3.4rem] lg:text-[4.4rem]">
            {managedBanner?.title || t.hero.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="mt-6 max-w-2xl text-[1rem] leading-[1.8] text-white/72">
            {managedBanner?.description || t.hero.body}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="button-primary">{t.hero.primary}<ArrowUpRight className="size-4" /></Link>
            <a href="#story" className="button-ghost-light"><PlayCircle className="size-4" />{t.hero.secondary}</a>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.7 }} className="mt-7 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#7dd3fc]">
            {t.hero.note}
          </motion.p>
        </div>
        {!managedBanner && slides.length > 1 && (
          <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full border border-white/20 bg-[#071935]/55 px-3 py-2 backdrop-blur-md md:bottom-8 md:right-8 lg:right-12">
            <span className="mr-1 hidden text-[0.58rem] font-bold uppercase tracking-[0.1em] text-white/65 sm:inline">PTRP moments · {slide + 1}/{slides.length}</span>
            <button type="button" onClick={() => setSlide((s) => (s - 1 + slides.length) % slides.length)} aria-label="Previous slide" className="flex size-7 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:border-[#38bdf8] hover:text-white">‹</button>
            {slides.map((_, index) => (
              <button key={index} type="button" onClick={() => setSlide(index)} aria-label={`Show slide ${index + 1}`} aria-pressed={index === slide} className={`h-1.5 rounded-full transition-all ${index === slide ? "w-6 bg-[#38bdf8]" : "w-1.5 bg-white/45 hover:bg-white/80"}`} />
            ))}
            <button type="button" onClick={() => setSlide((s) => (s + 1) % slides.length)} aria-label="Next slide" className="flex size-7 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:border-[#38bdf8] hover:text-white">›</button>
          </div>
        )}
      </div>
      <div className="relative mx-auto max-w-[1400px] px-5 pb-2 md:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.7 }} className="mt-2 border border-white/15 bg-[#0b2347]/70 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#38bdf8]">Program at a glance</p>
              <p className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-white">From residency to alumni leadership</p>
            </div>
            <GraduationCap className="size-9 shrink-0 text-[#38bdf8]" strokeWidth={1.4} />
          </div>
          <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-4">
            {[
              { value: "100", label: "Teacher Residents" },
              { value: "12", label: "Months of residency" },
              { value: "17", label: "Model schools" },
              { value: "2", label: "Host TTCs" },
            ].map((item) => <div key={item.label} className="bg-[#0b2347] p-4 sm:p-5"><p className="text-3xl font-extrabold tracking-[-0.06em] text-white">{item.value}</p><p className="mt-1 text-[0.64rem] font-bold uppercase tracking-[0.08em] text-white/45">{item.label}</p></div>)}
          </div>
          <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5">
            <Quote className="mt-0.5 size-4 shrink-0 text-[#38bdf8]" />
            <p className="text-[0.82rem] leading-6 text-white/65">{homeContent.quote}</p>
          </div>
          <a href={officialPilot.sourceUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-[#38bdf8] hover:text-white">
            {officialPilot.imageCredit ?? "Official source"} · Read the launch record <ArrowUpRight className="size-3.5" />
          </a>
        </motion.div>
      </div>
      <div className="relative border-t border-white/10 bg-black/15">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-4 text-[0.61rem] font-bold uppercase tracking-[0.14em] text-white/45 md:px-8 lg:px-12">
          <span>Primary Teacher Residency Program · Rwanda</span>
          <a href="#who-we-are" className="inline-flex items-center gap-2 text-white/70 hover:text-white">Discover the network <ArrowDown className="size-3.5" /></a>
        </div>
      </div>
    </section>

    <section id="who-we-are" className="bg-white py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
          <div>
            <SectionHeading eyebrow="Who we are" title="The official digital community formed through PTRP." body={homeContent.intro} />
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: UsersRound, label: "Resident teachers" },
                { icon: School, label: "Alumni & mentors" },
                { icon: MapPinned, label: "Model schools" },
              ].map((item) => <div key={item.label} className="flex items-center gap-3 border border-[#e2eef0] bg-[#f8fbfc] px-4 py-3"><item.icon className="size-4 text-[#0098d9]" /><span className="text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-[#264665]">{item.label}</span></div>)}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="button-primary">About the program <ArrowUpRight className="size-4" /></Link>
              <Link href="/network" className="button-secondary">Explore model schools</Link>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden border border-[#dce8ed] bg-[#eef7fa] shadow-[0_24px_70px_rgba(11,35,71,0.12)]">
              <img src={officialPilot.image} alt="Teacher residents and education leaders at the PTRP pilot launch" className="aspect-[4/3] w-full object-contain" loading="lazy" />
              <div className="flex flex-col gap-2 border-t border-[#dce8ed] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.1em] text-[#0b2347]">Pilot launch · Kigali, 4 October 2023</p>
                <a href={officialPilot.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[0.66rem] font-bold uppercase tracking-[0.08em] text-[#0098d9] hover:text-[#007ab0]">MINEDUC source <ArrowUpRight className="size-3.5" /></a>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {keyNumbers.map((stat) => <StatCard key={stat.label} {...stat} />)}
        </div>
      </div>
    </section>

    <section className="impact-band py-16 md:py-20">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-12">
        <div className="flex items-start gap-5">
          <div className="quote-mark shrink-0"><Quote /></div>
          <div>
            <p className="eyebrow text-[#38bdf8]">A belief we share</p>
            <blockquote className="mt-4 text-2xl font-extrabold leading-[1.2] tracking-[-0.03em] text-white sm:text-3xl">“{homeContent.quote}”</blockquote>
            <p className="mt-4 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-white/45">PTR Alumni Network · {brand.tagline}</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Connect", "Alumni across districts"],
            ["Share", "Practice and resources"],
            ["Transform", "Learning outcomes"],
          ].map(([title, body]) => <div key={title} className="border border-white/10 bg-white/[0.04] p-5"><p className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-[#38bdf8]">{title}</p><p className="mt-2 text-sm leading-6 text-white/60">{body}</p></div>)}
        </div>
      </div>
    </section>

    <section id="story" className="scroll-mt-24 bg-[#f6fafb] py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="Watch our story" title="The network in motion." body="Resident teachers share the energy, pride, and purpose of the first PTRP cohort. This video is embedded from the official PTR Alumni Network channel." cta="More stories" href="/news" />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="social-video-card">
            <div className="social-video-frame"><iframe src={officialSocialVideo.embedUrl} title={officialSocialVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
            <div className="social-video-copy">
              <p className="eyebrow text-[#0098d9]">{officialSocialVideo.channel} · {officialSocialVideo.date}</p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.04em] text-[#111]">{officialSocialVideo.title}</h2>
              <a className="mt-4 inline-flex items-center gap-2 text-[0.74rem] font-bold uppercase tracking-wide text-[#0098d9] hover:text-[#007ab0]" href={officialSocialVideo.videoUrl} target="_blank" rel="noreferrer">Open on YouTube <ArrowUpRight className="size-4" /></a>
            </div>
          </div>
          <div className="border border-[#dce8ed] bg-[#0b2347] p-7 text-white sm:p-9">
            <p className="eyebrow text-[#38bdf8]">From the official channel</p>
            <p className="mt-5 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-white/45">{socialProfileEvidence.displayName} · @{socialProfileEvidence.handle}</p>
            <p className="mt-4 text-2xl font-extrabold leading-tight tracking-[-0.04em]">{socialProfileEvidence.xText}</p>
            <div className="mt-8 border-t border-white/10 pt-5 text-sm leading-7 text-white/60">
              <p>Follow the network for classroom stories, alumni updates, and the next chapter of PTRP.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={socialProfileEvidence.xUrl} target="_blank" rel="noreferrer" className="border border-white/20 px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-white/75 hover:border-[#38bdf8] hover:text-white">X / Twitter <span className="sr-only">(opens in a new tab)</span></a>
              <a href={socialProfileEvidence.tiktokUrl} target="_blank" rel="noreferrer" className="border border-white/20 px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-white/75 hover:border-[#38bdf8] hover:text-white">TikTok</a>
              <Link href="/contact" className="border border-[#38bdf8] bg-[#0098d9] px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-white">Join the network</Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="The program behind the network" title="How PTRP prepared the first cohort." body="A 12-month residency combined structured classroom learning with guided practice in primary demonstration schools." cta="Read the full program story" href="/about" />
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-[#e2eef0] bg-[#f8fbfc] p-7 sm:p-9">
            <p className="eyebrow text-[#0098d9]">The residency year</p>
            <div className="mt-7 space-y-6">
              {programOverview.howItWorked.map((item, index) => <div key={item.title}>
                <div className="flex items-end justify-between gap-4"><p className="text-sm font-extrabold text-[#0b2347]">{item.title}</p><span className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[#7b8da2]">{index === 0 ? "Structured learning" : "In schools"}</span></div>
                <div className="mt-3 h-2 bg-[#dbe9ef]"><div className="h-2 bg-[#0098d9]" style={{ width: index === 0 ? "40%" : "60%" }} /></div>
                <p className="mt-3 text-sm leading-6 text-[#4b5563]">{item.body}</p>
              </div>)}
            </div>
            <div className="mt-8 border-t border-[#dbe9ef] pt-5">
              <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-[#7b8da2]">What residents received</p>
              <ul className="mt-3 space-y-2">{programOverview.received.map((item) => <li key={item} className="flex items-start gap-2 text-sm text-[#4b5563]"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#0098d9]" />{item}</li>)}</ul>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {programOverview.learned.map((item, index) => {
              const Icon = [BookOpen, GraduationCap, School][index] ?? BookOpen;
              return <div key={item.title} className="group border border-[#e2eef0] bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                <span className="flex size-11 items-center justify-center bg-[#e0f2fe] text-[#0098d9]"><Icon className="size-5" /></span>
                <h3 className="mt-8 text-lg font-extrabold leading-tight tracking-[-0.03em] text-[#0b2347]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#4b5563]">{item.body}</p>
              </div>;
            })}
            <div className="sm:col-span-3 border border-[#0b2347] bg-[#0b2347] p-6 text-white">
              <p className="eyebrow text-[#38bdf8]">The result</p>
              <p className="mt-3 text-xl font-extrabold leading-tight tracking-[-0.03em]">100 teachers commissioned on 5 August 2024, ready to lead learning in Rwanda's primary schools.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#f6fafb] py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="News & activities" title="What we are doing." body="Stories, announcements, and milestones from the PTR Alumni Network." cta="View all updates" href="/news" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {latestStories.map((story, index) => <Link key={story.slug} href="/news" className="group flex h-full flex-col border border-[#e2eef0] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0098d9] hover:shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-[#0098d9]">{story.category}</span>
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[#8a9bab]">{story.date}</span>
            </div>
            <h3 className="mt-5 text-xl font-extrabold leading-tight tracking-[-0.03em] text-[#0b2347] transition-colors group-hover:text-[#0098d9]">{story.title}</h3>
            <p className="mt-4 flex-1 text-sm leading-6 text-[#4b5563]">{story.excerpt}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">Read story <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
            {index === 0 && <span className="mt-4 inline-flex w-fit items-center gap-1.5 bg-[#e0f2fe] px-2.5 py-1 text-[0.58rem] font-extrabold uppercase tracking-[0.1em] text-[#007ab0]">Featured</span>}
          </Link>)}
        </div>
      </div>
    </section>

    <motion.section className="bg-white py-20 md:py-24" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="Partners" title="Together, we make teachers matter." body="PTRP was made possible by a partnership of government, universities, and education organizations that share one belief: investing in teachers improves learning for children." cta="Meet our partners" href="/partners" />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => <Link key={partner.shortName} href="/partners" className="group flex min-h-28 flex-col items-center justify-center gap-3 border border-[#e2eef0] bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#0098d9] hover:shadow-lg">
            {partner.logo ? (
              <img src={`${import.meta.env.BASE_URL}${partner.logo.startsWith("/") ? partner.logo.slice(1) : partner.logo}`} alt={`${partner.name} logo`} className="h-10 w-auto max-w-[110px] object-contain transition-transform duration-300 group-hover:scale-110" loading="lazy" />
            ) : (
              <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">{partner.shortName}</span>
            )}
            <span className="text-center text-[0.68rem] font-bold leading-5 text-[#264665] transition-colors group-hover:text-[#0b2347]">{partner.shortName}</span>
          </Link>)}
        </div>
      </div>
    </motion.section>

    <section className="cta-band py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-center">
          <div>
            <p className="eyebrow text-[#38bdf8]">Keep the network moving</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-[1.08] tracking-[-0.04em] text-white sm:text-4xl">Join the PTR Alumni Network.</h2>
            <p className="mt-5 max-w-xl text-[0.95rem] leading-[1.8] text-white/60">Are you a graduate of the Primary Teacher Residency Program? Share ideas, find support, and help write the next chapter of teacher education in Rwanda.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link href="/contact" className="button-primary">Join the network <ArrowUpRight className="size-4" /></Link>
            <Link href="/partners" className="button-ghost-light">Become a partner</Link>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white/40">
          <span className="inline-flex items-center gap-2"><Handshake className="size-4 text-[#38bdf8]" /> {brand.tagline}</span>
          <span>100 residents · 17 model schools · 2 host TTCs</span>
        </div>
      </div>
    </section>
  </main>;
}

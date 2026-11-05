import { motion } from "framer-motion";
import { ArrowUpRight, UsersRound } from "lucide-react";
import { Link } from "wouter";
import { commissioningPost, copy, galleryItems, officialPilot, officialSocialVideo, socialProfileEvidence, stats, type Language } from "@/data/ptrp";
import { StatCard } from "@/components/ptrp/ContentCards";
import { SectionHeading } from "@/components/ptrp/SectionHeading";

type HomeProps = { language: Language };

export default function Home({ language }: HomeProps) {
  const t = copy[language];
  return <main>
    <section className="hero-shell">
      <div className="hero-image-frame">
        <img src={officialPilot.image} alt="Primary Teacher Residency pilot launch gathering in Rwanda" className="hero-image" />
        <div className="hero-image-shade" />
        <div className="hero-image-label"><span className="live-dot" /> Official pilot launch <span className="text-white/60">/ MINEDUC · 2023</span></div>
        <div className="hero-image-stamp"><span className="text-3xl font-extrabold leading-none">100</span><span className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/80">selected graduates</span></div>
      </div>
      <div className="absolute inset-0 flex flex-col justify-center px-5 md:px-8 lg:px-12 max-w-[1400px] mx-auto w-full">
        <div className="max-w-3xl">
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-[#38bdf8] text-[0.8rem] font-bold uppercase tracking-[0.15em]">
            {t.hero.eyebrow}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }} className="mt-3 text-white text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] font-extrabold leading-[0.95] tracking-[-0.02em] drop-shadow-lg">
            PTR ALUMNI NETWORK
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="mt-2 text-white/90 text-xl md:text-2xl font-light tracking-wide">
            {t.hero.title}
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }} className="mt-6 max-w-xl text-[0.95rem] leading-[1.7] text-white/80">
            {t.hero.body}
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }} className="mt-4 text-[#7dd3fc] text-[0.8rem] font-bold uppercase tracking-[0.14em]">
            {t.hero.note}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/about" className="button-primary">{t.hero.primary}<ArrowUpRight className="size-4" /></Link>
            <Link href="/network" className="button-ghost-light">{t.hero.secondary}</Link>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Overlapping cards – MINEDUC style */}
    <section className="relative z-10 bg-white pb-0">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 -mt-[-60px] relative z-10">
        <div className="grid gap-6 md:grid-cols-3 -mt-24">
          <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-7">
            <div className="w-10 h-10 bg-[#0098d9] flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42z"/></svg>
            </div>
            <h3 className="mt-5 text-[1.35rem] font-extrabold text-[#111] leading-tight">Primary Teacher<br/>Residency</h3>
            <p className="mt-4 text-[0.9rem] leading-[1.7] text-[#4b5563] text-justify">
              The Primary Teacher Residency Program (PTRP) is a 12-month post-training residency designed to bridge the gap between initial teacher training and effective classroom practice. PTR Alumni Network is its official digital community.
            </p>
          </div>
          <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-7">
            <div className="w-10 h-10 bg-[#0098d9] flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42z"/></svg>
            </div>
            <h3 className="mt-5 text-[1.35rem] font-extrabold text-[#111] leading-tight">Resident Teacher<br/>Network</h3>
            <p className="mt-4 text-[0.9rem] leading-[1.7] text-[#4b5563] text-justify">
              A growing national network of 100 resident teachers and 17 model schools, designed to make collaboration practical, visible, and focused on learner outcomes.
            </p>
          </div>
          <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-7">
            <div className="w-10 h-10 bg-[#0098d9] flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42z"/></svg>
            </div>
            <h3 className="mt-5 text-[1.35rem] font-extrabold text-[#111] leading-tight">Evidence-Based<br/>Impact</h3>
            <p className="mt-4 text-[0.9rem] leading-[1.7] text-[#4b5563] text-justify">
              Track the work. Understand the evidence. Keep improving. Impact reporting distinguishes what happened, what was produced, and what has been demonstrated.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Stats section */}
    <section className="bg-white py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow={t.stats.label} title={t.stats.title} body="Program snapshot — verified, approved indicators shown." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
        </div>
      </div>
    </section>

    {/* Social evidence / resident voice */}
    <section className="bg-white py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="From the official network" title="Watch the latest resident teacher update." body="This exact video is embedded from the public PTR Alumni Network channel." />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="social-video-card">
            <div className="social-video-frame"><iframe src={officialSocialVideo.embedUrl} title={officialSocialVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
            <div className="social-video-copy">
              <p className="eyebrow text-[#0098d9]">{officialSocialVideo.channel} · @{socialProfileEvidence.handle} · {officialSocialVideo.date}</p>
              <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-[#111]">{officialSocialVideo.title}</h2>
              <a className="mt-5 inline-flex items-center gap-2 text-[0.85rem] font-bold uppercase tracking-wide text-[#0098d9]" href={officialSocialVideo.videoUrl} target="_blank" rel="noreferrer">Open on YouTube <ArrowUpRight className="size-4" /></a>
            </div>
          </div>
          <div className="commissioning-card">
            <div className="flex items-center justify-between gap-4">
              <span className="eyebrow text-[#0098d9]">Social record</span>
              <span className="text-xs font-bold uppercase tracking-[0.1em] text-white/45">{commissioningPost.date}</span>
            </div>
            <p className="social-account-identity"><span>Official social identity</span>{socialProfileEvidence.displayName} · @{socialProfileEvidence.handle}</p>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-[-0.04em] text-white">{commissioningPost.title}</h2>
            <p className="mt-5 text-sm leading-7 text-white/70">{commissioningPost.body}</p>
          </div>
        </div>
      </div>
    </section>

    {/* Story / mission section */}
    <section className="bg-white py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow={t.story.eyebrow} title={t.story.title} body={t.story.body} cta={t.story.cta} href="/about" />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="border-l-2 border-[#0098d9] pl-5 py-4 bg-[#f8fafc]">
            <p className="font-extrabold text-[1.1rem] leading-tight text-[#111]">CONNECT</p>
            <p className="mt-2 text-[0.9rem] leading-[1.7] text-[#4b5563]">Bring people, school communities, and practical knowledge closer together.</p>
          </div>
          <div className="border-l-2 border-[#0098d9] pl-5 py-4 bg-[#f8fafc]">
            <p className="font-extrabold text-[1.1rem] leading-tight text-[#111]">SHARE</p>
            <p className="mt-2 text-[0.9rem] leading-[1.7] text-[#4b5563]">Turn everyday classroom experience into evidence-based practice everyone can use.</p>
          </div>
          <div className="border-l-2 border-[#0098d9] pl-5 py-4 bg-[#f8fafc]">
            <p className="font-extrabold text-[1.1rem] leading-tight text-[#111]">TRANSFORM</p>
            <p className="mt-2 text-[0.9rem] leading-[1.7] text-[#4b5563]">Keep improving learner outcomes through documented, shared practice.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Network section */}
    <section className="network-band py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading light eyebrow={t.network.eyebrow} title={t.network.title} body={t.network.body} cta={t.network.cta} href="/network" />
        <div className="network-visual">
          <div className="network-map-lines" />
          <div className="network-center">
            <div className="network-center-ring"><UsersRound /></div>
            <span>ONE<br/>NETWORK</span>
          </div>
          <div className="network-node node-1"><span>01</span><small>North</small></div>
          <div className="network-node node-2"><span>02</span><small>East</small></div>
          <div className="network-node node-3"><span>03</span><small>South</small></div>
          <div className="network-node node-4"><span>04</span><small>West</small></div>
          <div className="network-legend"><span><i className="bg-[#0098d9]" /> Verified network view</span><span><i className="bg-[#f59e0b]" /> Pending approval</span></div>
        </div>
      </div>
    </section>

    {/* Impact section */}
    <section className="impact-band py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading light eyebrow={t.impact.eyebrow} title={t.impact.title} body={t.impact.body} cta={t.impact.cta} href="/impact" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="border-l-2 border-[#0098d9] pl-5 py-4 bg-[#f8fafc]">
            <p className="font-extrabold text-[1.1rem] leading-tight text-[#111]">Teacher participation</p>
            <p className="mt-2 text-[0.9rem] leading-[1.7] text-[#4b5563]">86% of residents consistently meet or exceed expectations.</p>
          </div>
          <div className="border-l-2 border-[#0098d9] pl-5 py-4 bg-[#f8fafc]">
            <p className="font-extrabold text-[1.1rem] leading-tight text-[#111]">School participation</p>
            <p className="mt-2 text-[0.9rem] leading-[1.7] text-[#4b5563]">17 model schools hosting resident teachers nationwide.</p>
          </div>
          <div className="border-l-2 border-[#0098d9] pl-5 py-4 bg-[#f8fafc]">
            <p className="font-extrabold text-[1.1rem] leading-tight text-[#111]">Zero attrition</p>
            <p className="mt-2 text-[0.9rem] leading-[1.7] text-[#4b5563]">No resident teachers left the program during pilot year.</p>
          </div>
        </div>
        <div className="mt-12 flex gap-3">
          <Link href="/impact" className="button-primary">View impact dashboard <ArrowUpRight className="size-4" /></Link>
        </div>
      </div>
    </section>

    {/* Stories section */}
    <section className="bg-white py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow={t.stories.eyebrow} title={t.stories.title} body={t.stories.body} cta={t.stories.cta} href="/news" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="activity-card border-l-2 border-[#0098d9]">
            <div className="p-6">
              <h3 className="text-xl font-extrabold tracking-[-0.04em] text-[#111] mb-3">Resilient classrooms, confident teachers</h3>
              <p className="text-[0.9rem] leading-[1.7] text-[#4b5563]">A resident teacher's first year of mentorship transformed her classroom practice — and her learners' results.</p>
            </div>
          </div>
          <div className="activity-card border-l-2 border-[#0098d9]">
            <div className="p-6">
              <h3 className="text-xl font-extrabold tracking-[-0.04em] text-[#111] mb-3">From observation to leadership</h3>
              <p className="text-[0.9rem] leading-[1.7] text-[#4b5563]">Peer coaching circles helped resident teachers share strategies that work across Rwanda's schools.</p>
            </div>
          </div>
          <div className="activity-card border-l-2 border-[#0098d9]">
            <div className="p-6">
              <h3 className="text-xl font-extrabold tracking-[-0.04em] text-[#111] mb-3">Technology in every lesson</h3>
              <p className="text-[0.9rem] leading-[1.7] text-[#4b5563]">ICT integration training equipped residents to bring digital tools to resource-limited classrooms.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Gallery section */}
    <section className="bg-white py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow={t.gallery.eyebrow} title={t.gallery.title} body={t.gallery.body} cta={t.gallery.cta} href="/gallery" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryItems.map((item, index) => <Link key={item.caption} href="/gallery" className={`gallery-tile group ${index === 0 ? "sm:row-span-2" : ""} ${index === 3 ? "lg:col-span-2" : ""}`}><div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} /><div className="gallery-pattern" /><div className="relative z-10 flex h-full flex-col justify-between p-6"><div className="flex items-center justify-between"><span className="eyebrow text-white/80">{item.label}</span><ArrowUpRight className="size-5 text-white/70 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div><div><p className="text-xl font-extrabold tracking-[-0.04em] text-white">{item.caption}</p><span className="mt-2 block text-[0.8rem] font-semibold text-white/60">Approved media · demo visual</span></div></div></Link>)}</div>
      </div>
    </section>

    {/* CTA section */}
    <section className="cta-band py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="eyebrow text-[#38bdf8]">Keep the network moving</p>
            <h2 className="mt-2 text-xl sm:text-2xl font-extrabold leading-tight tracking-[-0.03em] text-white">A platform for the work that happens between the milestones.</h2>
          </div>
          <Link href="/contact" className="button-primary shrink-0">Start a conversation <ArrowUpRight className="size-4" /></Link>
        </div>
      </div>
    </section>
  </main>;
}

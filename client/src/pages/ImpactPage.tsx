import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Laptop,
  MessageCircle,
  School,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Link } from "wouter";
import { PageHero } from "@/components/ptrp/PageHero";
import { SectionHeading } from "@/components/ptrp/SectionHeading";
import { impactContent, keyNumbers, officialSocialVideo, programOverview } from "@/data/ptrp";

const focusIcons = [GraduationCap, MessageCircle, Laptop, Sparkles];

export default function ImpactPage() {
  return <main>
    <PageHero
      eyebrow="Impact in Education Today"
      title="From Residents to Education Leaders"
      description="On 5 August 2024, 100 Primary Teacher Residents graduated from PTRP. The commissioning ceremony marked the beginning of a greater journey toward educational excellence."
      image="/manus-storage/ptrp-residents-3.jpg"
      imageAlt="PTRP residents during the residency year"
      imageCredit="Photo: MINEDUC"
    >
      <Link href="#impact-focus" className="button-primary">Explore the impact <ArrowUpRight className="size-4" /></Link>
      <Link href="/news" className="button-ghost-light">Read the stories</Link>
    </PageHero>

    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-20">
          <div>
            <SectionHeading eyebrow="The milestone" title="More than a graduation." />
            {impactContent.paragraphs.map((paragraph) => <p key={paragraph} className="mt-6 text-[1.02rem] leading-[1.9] text-[#4b5563]">{paragraph}</p>)}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="button-primary">About the program <ArrowUpRight className="size-4" /></Link>
              <Link href="/gallery" className="button-secondary">View the gallery</Link>
            </div>
          </div>
          <div className="overflow-hidden border border-[#dce8ed] bg-[#f8fbfc] shadow-[0_20px_60px_rgba(11,35,71,0.1)]">
            <img src="/manus-storage/ptrp-pilot-launch.jpg" alt="The first PTRP cohort at the commissioning celebration" className="aspect-[4/3] w-full object-contain" loading="lazy" />
            <div className="grid grid-cols-3 divide-x divide-[#e2eef0] border-t border-[#e2eef0] bg-white">
              {keyNumbers.slice(0, 3).map((stat) => <div key={stat.label} className="p-4 text-center"><p className="text-2xl font-extrabold tracking-[-0.05em] text-[#0b2347]">{stat.value}{stat.suffix}</p><p className="mt-1 text-[0.58rem] font-extrabold uppercase leading-4 tracking-[0.06em] text-[#7b8da2]">{stat.label}</p></div>)}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="impact-focus" className="scroll-mt-24 bg-[#f6fafb] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="Our impact in focus areas" title="What changed for teachers and learners." body="The pilot focused on the skills and confidence teachers need to respond to the diverse needs of pupils." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {impactContent.focusAreas.map((area, index) => {
            const Icon = focusIcons[index] ?? Sparkles;
            return <div key={area.title} className="border border-[#e2eef0] bg-white p-6 shadow-sm">
              <span className="flex size-11 items-center justify-center bg-[#e0f2fe] text-[#0098d9]"><Icon className="size-5" /></span>
              <h3 className="mt-7 text-lg font-extrabold leading-tight tracking-[-0.03em] text-[#0b2347]">{area.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">{area.body}</p>
            </div>;
          })}
        </div>
      </div>
    </section>

    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="border border-[#dce8ed] bg-[#f8fbfc] p-7 sm:p-9">
            <div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-[#0098d9]">Where our alumni work now</p><h2 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-[#0b2347]">{impactContent.whereAlumniWork.title}</h2></div><School className="size-8 shrink-0 text-[#0098d9]" /></div>
            <p className="mt-5 text-sm leading-7 text-[#4b5563]">{impactContent.whereAlumniWork.body}</p>
            <Link href="/alumni" className="mt-6 inline-flex items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">Browse the alumni directory <ArrowUpRight className="size-4" /></Link>
          </div>
          <div className="border border-[#0b2347] bg-[#0b2347] p-7 text-white sm:p-9">
            <div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-[#38bdf8]">Results in classrooms</p><h2 className="mt-4 text-2xl font-extrabold tracking-[-0.04em]">{impactContent.classroomResults.title}</h2></div><BarChart3 className="size-8 shrink-0 text-[#38bdf8]" /></div>
            <p className="mt-5 text-sm leading-7 text-white/65">{impactContent.classroomResults.body}</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-[#38bdf8]">Share classroom evidence <ArrowUpRight className="size-4" /></Link>
          </div>
        </div>
        <div className="mt-6 flex items-start gap-4 border border-[#e2eef0] bg-white p-6">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#0098d9]" />
          <div><h3 className="text-sm font-extrabold text-[#0b2347]">A note on data integrity</h3><p className="mt-2 text-sm leading-7 text-[#4b5563]">The PTR Alumni Network publishes verified program information only. Where data is not yet available, we say so and invite alumni and partners to contribute evidence for review.</p></div>
        </div>
      </div>
    </section>

    <section className="bg-[#f6fafb] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="Alumni stories" title="The human impact of the residency model." body="Each story will include a photo, name, school, district, and a short quote or video about how the residency changed teaching practice." cta="Share your story" href="/contact" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {impactContent.stories.map((story, index) => <div key={index} className="flex h-full flex-col border border-[#e2eef0] bg-white p-6">
            <div className="flex items-center justify-between gap-3"><span className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-[#0098d9]">{story.label}</span><span className="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-[#a3b2bf]">Awaiting profile</span></div>
            <div className="mt-5 flex size-16 items-center justify-center rounded-full bg-[#e8f2f6] text-[#0098d9]"><UsersRound className="size-7" strokeWidth={1.4} /></div>
            <h3 className="mt-5 text-lg font-extrabold leading-tight tracking-[-0.03em] text-[#0b2347]">{story.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-6 text-[#4b5563]">{story.body}</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">Submit a story <ArrowUpRight className="size-4" /></Link>
          </div>)}
        </div>
      </div>
    </section>

    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="border border-[#dce8ed] bg-[#f8fbfc] p-7">
            <p className="eyebrow text-[#0098d9]">Watch the cohort</p>
            <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-[#0b2347]">{officialSocialVideo.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[#4b5563]">A moment from the official PTR Alumni Network channel. Follow the network for more classroom stories and updates.</p>
            <a href={officialSocialVideo.videoUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">Open on YouTube <ArrowUpRight className="size-4" /></a>
          </div>
          <div className="social-video-frame border border-[#dce8ed]"><iframe src={officialSocialVideo.embedUrl} title={officialSocialVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
        </div>
      </div>
    </section>

    <section className="cta-band py-16 md:py-20">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between md:px-8 lg:px-12">
        <div className="flex items-center gap-4"><HeartHandshake className="size-8 text-[#38bdf8]" /><div><p className="text-[0.64rem] font-extrabold uppercase tracking-[0.14em] text-[#38bdf8]">{programOverview.title}</p><p className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-white">Help us document what happens next.</p></div></div>
        <Link href="/contact" className="button-ghost-light">Contact the network <ArrowUpRight className="size-4" /></Link>
      </div>
    </section>
  </main>;
}

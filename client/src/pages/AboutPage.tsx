import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Compass,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Laptop,
  MapPinned,
  School,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import { Link } from "wouter";
import { PageHero } from "@/components/ptrp/PageHero";
import { SectionHeading } from "@/components/ptrp/SectionHeading";
import {
  hostColleges,
  keyNumbers,
  officialPilot,
  partners,
  programOverview,
  visionMission,
} from "@/data/ptrp";

export default function AboutPage() {
  return <main>
    <PageHero
      eyebrow="About the Program"
      title="A 12-month residency that prepared 100 teachers for Rwanda's classrooms."
      description="The Primary Teacher Residency Program (PTRP) is the program. The PTR Alumni Network is its official digital community — formed by the residents who completed the pilot and the partners who made it possible."
      image={officialPilot.image}
      imageAlt="The launch of the Primary Teacher Residency Program in Kigali"
      imageCredit="Photo: MINEDUC · 4 October 2023"
    >
      <Link href="#program" className="button-primary">Explore the program <ArrowUpRight className="size-4" /></Link>
      <Link href="/network" className="button-ghost-light">Meet the model schools</Link>
    </PageHero>

    <section id="program" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="What is PTRP?" title="A bridge between teacher training and the classroom." />
            <p className="mt-6 text-[1.02rem] leading-[1.9] text-[#4b5563]">{programOverview.whatIs}</p>
            <div className="mt-8 border-l-4 border-[#0098d9] bg-[#f8fbfc] p-6">
              <p className="text-sm font-bold leading-7 text-[#0b2347]">The pilot was launched to show the value of investing in teachers and giving them the knowledge, practical skills, and confidence to respond to the diverse learning needs of pupils.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/impact" className="button-primary">See the impact <ArrowUpRight className="size-4" /></Link>
              <Link href="/gallery" className="button-secondary">View the gallery</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 self-start sm:grid-cols-2">
            {keyNumbers.map((stat) => <div key={stat.label} className="border border-[#e2eef0] bg-[#f8fbfc] p-5">
              <stat.icon className="size-5 text-[#0098d9]" />
              <p className="mt-5 text-3xl font-extrabold tracking-[-0.06em] text-[#0b2347]">{stat.value}{stat.suffix}</p>
              <p className="mt-1 text-[0.68rem] font-extrabold uppercase leading-5 tracking-[0.06em] text-[#60758c]">{stat.label}</p>
            </div>)}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#f6fafb] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="How the program worked" title="40% classroom instruction. 60% guided practice." body="Residents spent the year moving between structured learning and real classrooms, with mentors beside them." />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {programOverview.howItWorked.map((item, index) => <div key={item.title} className="relative overflow-hidden border border-[#dce8ed] bg-white p-7 shadow-sm sm:p-9">
            <span className="absolute right-5 top-4 text-[4.8rem] font-extrabold leading-none tracking-[-0.08em] text-[#eef7fa]">{index === 0 ? "40" : "60"}<span className="text-2xl">%</span></span>
            <span className="relative flex size-12 items-center justify-center bg-[#e0f2fe] text-[#0098d9]">{index === 0 ? <BookOpen className="size-5" /> : <School className="size-5" />}</span>
            <h3 className="relative mt-8 text-2xl font-extrabold leading-tight tracking-[-0.04em] text-[#0b2347]">{item.title}</h3>
            <p className="relative mt-4 max-w-md text-sm leading-7 text-[#4b5563]">{item.body}</p>
            <div className="relative mt-7 h-2 bg-[#e8f2f6]"><div className="h-2 bg-[#0098d9]" style={{ width: index === 0 ? "40%" : "60%" }} /></div>
          </div>)}
        </div>
      </div>
    </section>

    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="What residents learned" title="Practical skills for the realities of Rwandan classrooms." body="The residency focused on evidence-based teaching, 21st-century skills, and intensive practice." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {programOverview.learned.map((item, index) => {
            const icons = [Sparkles, GraduationCap, UsersRound];
            const Icon = icons[index] ?? Sparkles;
            return <div key={item.title} className="border border-[#e2eef0] bg-[#f8fbfc] p-7 transition-colors hover:border-[#0098d9] hover:bg-white">
              <span className="flex size-12 items-center justify-center bg-[#e0f2fe] text-[#0098d9]"><Icon className="size-5" /></span>
              <h3 className="mt-8 text-xl font-extrabold tracking-[-0.03em] text-[#0b2347]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#4b5563]">{item.body}</p>
            </div>;
          })}
        </div>

        <div className="mt-12 grid gap-8 border border-[#dce8ed] bg-white p-7 shadow-sm lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
          <div>
            <p className="eyebrow text-[#0098d9]">What residents received</p>
            <h3 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-[#0b2347]">Support that made practice possible.</h3>
            <p className="mt-4 text-sm leading-7 text-[#4b5563]">The residency combined people, tools, and school partnerships so that residents could learn by doing.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: UsersRound, label: "Mentorship", body: programOverview.received[0] },
              { icon: Laptop, label: "Technology", body: programOverview.received[1] },
              { icon: School, label: "Practice", body: programOverview.received[2] },
            ].map((item) => <div key={item.label} className="border border-[#e2eef0] p-5"><item.icon className="size-5 text-[#0098d9]" /><p className="mt-5 text-[0.66rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">{item.label}</p><p className="mt-2 text-sm font-semibold leading-6 text-[#264665]">{item.body}</p></div>)}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#0b2347] py-20 text-white md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading light eyebrow="Where it took place" title="Two host colleges. Seventeen model schools." body="The 100 residents were split between two host Teacher Training Colleges, with guided practice in primary demonstration schools." cta="Explore the schools" href="/network" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {hostColleges.map((college) => <div key={college.name} className="border border-white/15 bg-white/[0.05] p-7 sm:p-9">
            <div className="flex items-start justify-between gap-5"><div><p className="text-[0.64rem] font-extrabold uppercase tracking-[0.14em] text-[#38bdf8]">{college.district}</p><h3 className="mt-3 text-2xl font-extrabold tracking-[-0.04em]">{college.name}</h3></div><MapPinned className="size-8 shrink-0 text-[#38bdf8]" strokeWidth={1.4} /></div>
            <p className="mt-5 text-sm leading-7 text-white/60">{college.body}</p>
          </div>)}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-white/40">
          <span>50 residents per host college</span>
          <span>17 primary demonstration schools</span>
          <span>12-month residency</span>
        </div>
      </div>
    </section>

    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="Who launched it" title="A shared commitment to teacher education." body={programOverview.launchedBy} cta="Meet our partners" href="/partners" />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => <a key={partner.shortName} href={partner.url} target="_blank" rel="noreferrer" className="group flex min-h-24 flex-col justify-between border border-[#e2eef0] bg-[#f8fbfc] p-4 transition-colors hover:border-[#0098d9] hover:bg-white">
            <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">{partner.shortName}</span>
            <span className="mt-4 text-[0.72rem] font-bold leading-5 text-[#264665] group-hover:text-[#0b2347]">{partner.name}</span>
          </a>)}
        </div>
      </div>
    </section>

    <section className="bg-[#f6fafb] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="Timeline" title="From launch to a living alumni network." body="The pilot launched in 2023. The first cohort was commissioned on 5 August 2024." />
        <div className="mt-12 grid gap-0 border border-[#dce8ed] bg-white md:grid-cols-4">
          {programOverview.timeline.map((item, index) => <div key={item.title} className={`relative p-6 md:p-7 ${index < programOverview.timeline.length - 1 ? "border-b border-[#e2eef0] md:border-b-0 md:border-r" : ""}`}>
            <div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center bg-[#0098d9] text-[0.66rem] font-extrabold text-white">{String(index + 1).padStart(2, "0")}</span><span className="text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">{item.date}</span></div>
            <h3 className="mt-5 text-lg font-extrabold leading-tight tracking-[-0.03em] text-[#0b2347]">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#4b5563]">{item.body}</p>
          </div>)}
        </div>
        <p className="mt-4 text-[0.68rem] leading-6 text-[#7b8da2]">The exact 2023 start date is still to be confirmed by program administrators. The launch record is dated 4 October 2023.</p>
      </div>
    </section>

    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="Vision, mission, values" title="What the network stands for." />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="border border-[#dce8ed] bg-[#f8fbfc] p-7 sm:p-9">
            <span className="flex size-12 items-center justify-center bg-[#e0f2fe] text-[#0098d9]"><Compass className="size-5" /></span>
            <h3 className="mt-7 text-2xl font-extrabold tracking-[-0.04em] text-[#0b2347]">Our vision</h3>
            <p className="mt-4 text-[1.02rem] leading-[1.8] text-[#4b5563]">{visionMission.vision}</p>
          </div>
          <div className="border border-[#0b2347] bg-[#0b2347] p-7 text-white sm:p-9">
            <span className="flex size-12 items-center justify-center bg-white/10 text-[#38bdf8]"><Target className="size-5" /></span>
            <h3 className="mt-7 text-2xl font-extrabold tracking-[-0.04em]">Our mission</h3>
            <p className="mt-4 text-[1.02rem] leading-[1.8] text-white/65">{visionMission.mission}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-[#e2eef0] p-7 sm:p-9">
            <p className="eyebrow text-[#0098d9]">Our objectives</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {visionMission.objectives.map((objective, index) => <li key={objective} className="flex items-start gap-3 text-sm leading-6 text-[#4b5563]"><span className="flex size-6 shrink-0 items-center justify-center bg-[#e0f2fe] text-[0.62rem] font-extrabold text-[#0098d9]">{index + 1}</span>{objective}</li>)}
            </ul>
          </div>
          <div className="border border-[#e2eef0] p-7 sm:p-9">
            <p className="eyebrow text-[#0098d9]">Our core values</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {visionMission.values.map((value) => <span key={value.title} title={value.body} className="border border-[#dce8ed] bg-[#f8fbfc] px-3 py-2 text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-[#264665]">{value.title}</span>)}
            </div>
            <div className="mt-7 border-t border-[#e2eef0] pt-5">
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-[#7b8da2]">Our motto</p>
              <p className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[#0b2347]">{visionMission.motto}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border border-[#dce8ed] bg-[#f8fbfc] p-6">
          <div className="flex items-center gap-4"><HeartHandshake className="size-7 text-[#0098d9]" /><div><p className="text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-[#0098d9]">From program to network</p><p className="mt-1 text-sm font-bold text-[#0b2347]">PTR Alumni Network is the official digital community of PTRP.</p></div></div>
          <Link href="/contact" className="button-primary">Join the network <ArrowUpRight className="size-4" /></Link>
        </div>
      </div>
    </section>

    <section className="cta-band py-16 md:py-20">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between md:px-8 lg:px-12">
        <div className="flex items-center gap-4"><CalendarDays className="size-8 text-[#38bdf8]" /><div><p className="text-[0.64rem] font-extrabold uppercase tracking-[0.14em] text-[#38bdf8]">5 August 2024</p><p className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-white">100 residents commissioned. A network begins.</p></div></div>
        <Link href="/gallery" className="button-ghost-light">See the journey <ArrowUpRight className="size-4" /></Link>
      </div>
    </section>
  </main>;
}

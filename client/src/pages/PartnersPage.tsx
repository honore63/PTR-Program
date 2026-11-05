import { ArrowUpRight, Globe2, Handshake, HeartHandshake, Landmark, School, Sparkles, UsersRound } from "lucide-react";
import { Link } from "wouter";
import { PageHero } from "@/components/ptrp/PageHero";
import { SectionHeading } from "@/components/ptrp/SectionHeading";
import { brand, partners } from "@/data/ptrp";

const initials = (shortName: string) => shortName.replace(/[^A-Za-z0-9]/g, "").slice(0, 4).toUpperCase();

export default function PartnersPage() {
  return <main>
    <PageHero
      eyebrow="Partners"
      title="Together, we make teachers matter."
      description="PTRP was made possible by a partnership of government, universities, and education organizations that share one belief: investing in teachers improves learning for children."
      image="/gallery/gallery-03.jpg"
      imageAlt="PTRP partners - education organizations and government"
      imageCredit="Photo: MINEDUC · PTR Alumni Network"
    >
      <Link href="#partners" className="button-primary">Meet our partners <ArrowUpRight className="size-4" /></Link>
      <Link href="#partner-with-us" className="button-ghost-light">Partner with us</Link>
    </PageHero>

    <section id="partners" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="Our partners" title="A shared commitment to teacher education." body="The pilot brought together national leadership, academic expertise, and implementation partners to prepare 100 resident teachers for Rwanda's primary schools." />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {partners.map((partner) => <article key={partner.shortName} className="group flex h-full flex-col border border-[#e2eef0] bg-white p-7 transition-all hover:border-[#0098d9] hover:shadow-lg sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <span className="flex size-16 shrink-0 items-center justify-center border border-[#dce8ed] bg-white p-2">
                {partner.logo ? (
                  <img src={`${import.meta.env.BASE_URL}${partner.logo.startsWith("/") ? partner.logo.slice(1) : partner.logo}`} alt={`${partner.name} logo`} className="max-h-12 max-w-[52px] object-contain" loading="lazy" />
                ) : (
                  <span className="text-[0.78rem] font-extrabold tracking-[0.04em] text-[#0098d9]">{initials(partner.shortName)}</span>
                )}
              </span>
              <span className="border border-[#e2eef0] bg-[#f8fbfc] px-2.5 py-1 text-[0.56rem] font-extrabold uppercase tracking-[0.1em] text-[#60758c]">Partner</span>
            </div>
            <p className="mt-6 text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-[#0098d9]">{partner.role}</p>
            <h2 className="mt-2 text-xl font-extrabold leading-tight tracking-[-0.03em] text-[#0b2347] group-hover:text-[#0098d9]">{partner.name}</h2>
            <p className="mt-3 flex-1 text-sm leading-7 text-[#4b5563]">{partner.body}</p>
            <a href={partner.url} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-fit items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9] hover:text-[#007ab0]">
              Visit website <ArrowUpRight className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </article>)}
        </div>

        <p className="mt-6 text-[0.68rem] leading-6 text-[#7b8da2]">Partner names, links, and logos are published from official launch information. Full organizational descriptions and higher-resolution logos can be refreshed as partners approve them.</p>
      </div>
    </section>

    <section className="bg-[#0b2347] py-20 text-white md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading light eyebrow="Why partnership matters" title="No single institution prepares a teacher alone." body="Teacher education works when government, colleges, schools, universities, and communities align around the same goal: better learning for every child." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Landmark, title: "National leadership", body: "MINEDUC and REB set direction, quality standards, and coordination across the system." },
            { icon: School, title: "School practice", body: "Model schools open their classrooms so residents can learn by teaching with mentors." },
            { icon: Globe2, title: "Academic expertise", body: "University partners contribute research, tools, and evidence about what works." },
            { icon: UsersRound, title: "Community delivery", body: "Implementing partners turn the model into training and support on the ground." },
          ].map((item) => <div key={item.title} className="border border-white/12 bg-white/[0.04] p-6">
            <span className="flex size-11 items-center justify-center bg-white/10 text-[#38bdf8]"><item.icon className="size-5" /></span>
            <h3 className="mt-6 text-lg font-extrabold tracking-[-0.03em]">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/60">{item.body}</p>
          </div>)}
        </div>
      </div>
    </section>

    <section id="partner-with-us" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-20">
          <div>
            <SectionHeading eyebrow="Partner with us" title="Help the network grow." />
            <p className="mt-6 text-[1.02rem] leading-[1.9] text-[#4b5563]">The PTR Alumni Network is building the next chapter of PTRP. We welcome partnerships that strengthen teacher professional development, document classroom impact, and connect alumni across Rwanda.</p>
            <div className="mt-8 space-y-4">
              {[
                { icon: HeartHandshake, title: "Programme support", body: "Fund alumni gatherings, professional learning, or classroom resources." },
                { icon: School, title: "School partnerships", body: "Host resident teachers or open your school for peer learning visits." },
                { icon: Sparkles, title: "Knowledge partnership", body: "Contribute research, training expertise, or evidence of impact." },
              ].map((item) => <div key={item.title} className="flex items-start gap-4 border border-[#e2eef0] bg-[#f8fbfc] p-5">
                <span className="flex size-10 shrink-0 items-center justify-center bg-[#e0f2fe] text-[#0098d9]"><item.icon className="size-5" /></span>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0b2347]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#4b5563]">{item.body}</p>
                </div>
              </div>)}
            </div>
          </div>
          <div className="border border-[#dce8ed] bg-white p-7 shadow-[0_20px_60px_rgba(11,35,71,0.08)] sm:p-9">
            <p className="eyebrow text-[#0098d9]">Start a conversation</p>
            <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-[-0.04em] text-[#0b2347]">Tell us how you would like to work together.</h2>
            <p className="mt-4 text-sm leading-7 text-[#4b5563]">Send a short note about your organization and the kind of partnership you have in mind. We will respond through the confirmed network email channel.</p>
            <div className="mt-7 border-t border-[#e2eef0] pt-6">
              <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.12em] text-[#7b8da2]">Email</p>
              <a href="mailto:info@ptr.rw?subject=Partnership%20with%20PTR%20Alumni%20Network" className="mt-2 inline-block text-lg font-extrabold tracking-[-0.02em] text-[#0098d9] hover:underline">info@ptr.rw</a>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="button-primary">Contact the network <ArrowUpRight className="size-4" /></Link>
              <Link href="/about" className="button-secondary">About PTRP</Link>
            </div>
            <p className="mt-6 text-[0.68rem] leading-6 text-[#7b8da2]">{brand.name} · {brand.tagline}</p>
          </div>
        </div>
      </div>
    </section>

    <section className="cta-band py-16 md:py-20">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between md:px-8 lg:px-12">
        <div className="flex items-center gap-4">
          <Handshake className="size-8 text-[#38bdf8]" />
          <div>
            <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.14em] text-[#38bdf8]">Invest in teachers</p>
            <p className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-white">Strong partnerships build strong classrooms.</p>
          </div>
        </div>
        <Link href="/contact" className="button-ghost-light">Get in touch <ArrowUpRight className="size-4" /></Link>
      </div>
    </section>
  </main>;
}

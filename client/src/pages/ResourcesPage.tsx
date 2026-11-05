import { useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, Download, FileText, FolderOpen, Search, UploadCloud } from "lucide-react";
import { Link } from "wouter";
import { PageHero } from "@/components/ptrp/PageHero";
import { SectionHeading } from "@/components/ptrp/SectionHeading";
import { resourceCategories, resources } from "@/data/ptrp";

const resourceHref = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export default function ResourcesPage() {
  const [category, setCategory] = useState("All resources");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => resources.filter((resource) => {
    const matchesCategory = category === "All resources" || resource.category === category;
    const matchesQuery = `${resource.title} ${resource.type} ${resource.category}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesCategory && matchesQuery;
  }), [category, query]);

  return <main>
    <PageHero
      eyebrow="Resources"
      title="Learn, teach, share."
      description="Practical guides, lesson planning tools, and network newsletters for PTRP alumni, mentors, and teachers. Every resource here is free to download and use in your classroom."
      image="/storage/ptrp-pilot-launch.jpg"
      imageAlt="PTRP resources - teaching materials and guides"
      imageCredit="Photo: MINEDUC · PTR Alumni Network"
    >
      <Link href="#library" className="button-primary">Browse the library <ArrowUpRight className="size-4" /></Link>
      <Link href="/contact" className="button-ghost-light">Share a resource</Link>
    </PageHero>

    <section id="library" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="Resource library" title="Tools you can use tomorrow." body="Filter by theme or search the library. Files open in your browser and can be saved for offline use." />

        <div className="mt-8 flex flex-col gap-3 border border-[#e2eef0] bg-[#f8fbfc] p-4">
          <div className="flex flex-wrap gap-2">
            {["All resources", ...resourceCategories].map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`border px-3 py-2 text-[0.64rem] font-extrabold uppercase tracking-[0.06em] transition-colors ${category === item ? "border-[#0098d9] bg-[#0098d9] text-white" : "border-[#d1d5db] bg-white text-[#4b5563] hover:border-[#0098d9] hover:text-[#0098d9]"}`}>{item}</button>)}
          </div>
          <label className="flex items-center gap-3 border border-[#d1d5db] bg-white px-3 py-2.5">
            <Search className="size-4 shrink-0 text-[#0098d9]" />
            <span className="sr-only">Search resources</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resources..." className="w-full bg-transparent text-sm text-[#0b2347] outline-none placeholder:text-[#9aabba]" />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.1em] text-[#7b8da2]">{filtered.length} of {resources.length} resources</p>
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.08em] text-[#a3b2bf]">Text guides · No account required</p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filtered.map((resource) => <article key={resource.title} className="group flex h-full flex-col border border-[#e2eef0] bg-white p-6 transition-all hover:border-[#0098d9] hover:shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <span className="flex size-11 items-center justify-center bg-[#e0f2fe] text-[#0098d9]"><FileText className="size-5" /></span>
              <span className="border border-[#e2eef0] bg-[#f8fbfc] px-2.5 py-1 text-[0.58rem] font-extrabold uppercase tracking-[0.08em] text-[#60758c]">{resource.type}</span>
            </div>
            <p className="mt-5 text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">{resource.category}</p>
            <h3 className="mt-2 text-xl font-extrabold leading-tight tracking-[-0.03em] text-[#0b2347] group-hover:text-[#0098d9]">{resource.title}</h3>
            <p className="mt-3 flex-1 text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#9aabba]">{resource.file}</p>
            <a href={resourceHref(resource.href)} download className="mt-5 inline-flex w-fit items-center gap-2 bg-[#0098d9] px-4 py-2.5 text-[0.66rem] font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#0086c0]">
              Download <Download className="size-4" />
            </a>
          </article>)}

          {filtered.length === 0 && <div className="md:col-span-2 border border-dashed border-[#d1d5db] bg-[#f8fbfc] p-10 text-center">
            <FolderOpen className="mx-auto size-8 text-[#0098d9]" />
            <p className="mt-4 text-sm font-bold text-[#0b2347]">No resources match that search.</p>
            <button type="button" onClick={() => { setCategory("All resources"); setQuery(""); }} className="mt-3 text-[0.7rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">Clear filters</button>
          </div>}
        </div>

        <div className="mt-8 flex items-start gap-3 border border-[#dce8ed] bg-[#f8fbfc] p-5 text-sm leading-7 text-[#4b5563]">
          <FileText className="mt-0.5 size-5 shrink-0 text-[#0098d9]" />
          <p>These resources are provided as plain-text guides so they open quickly and work on slow connections. Printable versions and official program documents will be added as they are approved for release.</p>
        </div>
      </div>
    </section>

    <section className="bg-[#f6fafb] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: BookOpen, title: "Made for the classroom", body: "Each guide focuses on a practice you can apply in a primary classroom with the materials you already have." },
            { icon: Download, title: "Lightweight by design", body: "Files are small text documents, chosen so teachers on slow or limited connections can still access them." },
            { icon: UploadCloud, title: "Built by the network", body: "Alumni can submit lesson ideas and materials for review. Approved resources are shared with everyone." },
          ].map((item) => <div key={item.title} className="border border-[#e2eef0] bg-white p-6">
            <span className="flex size-11 items-center justify-center bg-[#e0f2fe] text-[#0098d9]"><item.icon className="size-5" /></span>
            <h3 className="mt-6 text-lg font-extrabold tracking-[-0.03em] text-[#0b2347]">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#4b5563]">{item.body}</p>
          </div>)}
        </div>
      </div>
    </section>

    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-8 border border-[#dce8ed] bg-[#0b2347] p-7 text-white lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
          <div>
            <p className="eyebrow text-[#38bdf8]">Contribute</p>
            <h2 className="mt-4 max-w-2xl text-2xl font-extrabold leading-tight tracking-[-0.04em] sm:text-3xl">Have a lesson plan or guide worth sharing?</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/60">Send it to the network with a short description. An administrator reviews every submission before it is published in the library.</p>
          </div>
          <Link href="/contact" className="button-ghost-light w-fit">Submit a resource <ArrowUpRight className="size-4" /></Link>
        </div>
      </div>
    </section>
  </main>;
}

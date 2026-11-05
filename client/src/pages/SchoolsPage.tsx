import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  MapPinned,
  Search,
  School,
  UsersRound,
} from "lucide-react";
import { Link } from "wouter";
import { PageHero } from "@/components/ptrp/PageHero";
import { SectionHeading } from "@/components/ptrp/SectionHeading";
import { hostColleges, modelSchools } from "@/data/ptrp";

const districtPositions: Record<string, { x: number; y: number }> = {
  Nyagatare: { x: 87, y: 25 },
  Burera: { x: 45, y: 11 },
  Gicumbi: { x: 55, y: 20 },
  Gatsibo: { x: 81, y: 35 },
  Rwamagana: { x: 72, y: 46 },
  Kayonza: { x: 84, y: 49 },
  Ngoma: { x: 77, y: 62 },
  Bugesera: { x: 65, y: 63 },
  Gisagara: { x: 43, y: 73 },
  Nyaruguru: { x: 32, y: 84 },
  Rusizi: { x: 11, y: 75 },
  Nyamagabe: { x: 26, y: 67 },
  Karongi: { x: 17, y: 50 },
  Ngororero: { x: 27, y: 41 },
  Muhanga: { x: 39, y: 56 },
  Rubavu: { x: 13, y: 25 },
  "District to be confirmed": { x: 55, y: 88 },
};

const districts = ["All districts", ...Array.from(new Set(modelSchools.map((school) => school.district))).sort((a, b) => a.localeCompare(b))];

export default function SchoolsPage() {
  const [district, setDistrict] = useState("All districts");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(1);

  const filtered = useMemo(() => modelSchools.filter((school) => {
    const matchesDistrict = district === "All districts" || school.district === district;
    const matchesQuery = `${school.name} ${school.district}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesDistrict && matchesQuery;
  }), [district, query]);

  const selected = modelSchools.find((school) => school.id === selectedId) ?? filtered[0] ?? modelSchools[0];

  return <main>
    <PageHero
      eyebrow="Model Schools"
      title="Our 17 model schools."
      description="Model schools are the primary demonstration schools where residents put what they learned into practice through guided teaching. Each school hosts teachers who learn by doing, with mentors beside them."
      icon={School}
      meta="17 schools · 16 districts · 2 host TTCs"
    >
      <Link href="#school-map" className="button-primary">Explore the network map <ArrowUpRight className="size-4" /></Link>
      <Link href="#school-list" className="button-ghost-light">Browse all schools</Link>
    </PageHero>

    <section id="school-map" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="Interactive map" title="A national network of demonstration schools." body="Select a pin or a school card to see its district and profile note. Pins show approximate district areas; they are not exact school coordinates." />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative min-h-[470px] overflow-hidden border border-[#dce8ed] bg-[#0b2347] p-4 sm:p-6">
            <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)", backgroundSize: "38px 38px" }} />
            <div className="relative h-[400px] sm:h-[430px]">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <path d="M29 7 L45 3 L57 10 L70 7 L92 20 L91 33 L99 45 L95 57 L87 63 L85 78 L74 91 L59 95 L47 89 L36 96 L26 87 L16 91 L9 76 L17 65 L9 51 L16 40 L13 27 Z" fill="rgba(0,152,217,0.12)" stroke="rgba(56,189,248,0.55)" strokeWidth="0.5" />
                <path d="M29 7 L45 3 L57 10 L70 7 L92 20 L91 33 L99 45 L95 57 L87 63 L85 78 L74 91 L59 95 L47 89 L36 96 L26 87 L16 91 L9 76 L17 65 L9 51 L16 40 L13 27 Z" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.16" transform="translate(1.5,1.5)" />
              </svg>
              {modelSchools.map((school) => {
                const position = districtPositions[school.district] ?? { x: 50, y: 50 };
                const isSelected = selected?.id === school.id;
                const isFiltered = filtered.some((item) => item.id === school.id);
                return <button
                  key={school.id}
                  type="button"
                  onClick={() => setSelectedId(school.id)}
                  className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[0.58rem] font-extrabold transition-all ${isSelected ? "size-8 border-white bg-[#38bdf8] text-[#0b2347] shadow-[0_0_0_5px_rgba(56,189,248,0.25)]" : "size-6 border-[#38bdf8]/70 bg-[#0b2347] text-white hover:bg-[#0098d9]"} ${isFiltered ? "opacity-100" : "opacity-25"}`}
                  style={{ left: `${position.x}%`, top: `${position.y}%` }}
                  aria-label={`${school.name}, ${school.district}`}
                  aria-pressed={isSelected}
                >
                  {school.id}
                </button>;
              })}
            </div>
            <div className="relative mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-white/40">
              <span>Illustrative network map · approximate district areas</span>
              <span className="inline-flex items-center gap-2"><span className="size-2 bg-[#38bdf8]" /> Selected school</span>
            </div>
          </div>

          <div className="flex flex-col border border-[#dce8ed] bg-[#f8fbfc] p-6 sm:p-8">
            <p className="eyebrow text-[#0098d9]">School profile</p>
            <div className="mt-5 flex items-start justify-between gap-4"><div><span className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-[#7b8da2]">School {String(selected?.id ?? 1).padStart(2, "0")}</span><h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-[-0.04em] text-[#0b2347]">{selected?.name}</h2></div><span className="flex size-12 shrink-0 items-center justify-center bg-[#e0f2fe] text-[#0098d9]"><School className="size-5" /></span></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="border border-[#e2eef0] bg-white p-4"><p className="text-[0.58rem] font-extrabold uppercase tracking-[0.1em] text-[#7b8da2]">District</p><p className="mt-2 text-sm font-bold text-[#0b2347]">{selected?.district}</p></div>
              <div className="border border-[#e2eef0] bg-white p-4"><p className="text-[0.58rem] font-extrabold uppercase tracking-[0.1em] text-[#7b8da2]">Status</p><p className="mt-2 text-sm font-bold text-[#0b2347]">Model school</p></div>
            </div>
            {selected?.note ? <div className="mt-4 flex items-start gap-3 border border-[#f0d9a8] bg-[#fffaf0] p-4"><AlertCircle className="mt-0.5 size-4 shrink-0 text-[#c88a20]" /><p className="text-sm leading-6 text-[#7a5a1f]">{selected.note}</p></div> : <div className="mt-4 flex items-start gap-3 border border-[#dce8ed] bg-white p-4"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#0098d9]" /><p className="text-sm leading-6 text-[#4b5563]">This school is part of the 17 model schools named for the PTRP network. Additional profile details can be added after verification.</p></div>}
            <div className="mt-auto pt-7"><Link href="/contact" className="inline-flex items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">Suggest a profile update <ArrowUpRight className="size-4" /></Link></div>
          </div>
        </div>
      </div>
    </section>

    <section id="school-list" className="scroll-mt-24 bg-[#f6fafb] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="School directory" title="Find a model school." body="Filter by district or search by school name. Profiles marked for review will be updated as program records are verified." />
        <div className="mt-8 flex flex-col gap-3 border border-[#e2eef0] bg-white p-4 sm:flex-row sm:items-center">
          <label className="flex flex-1 items-center gap-3 border border-[#d1d5db] px-3 py-2.5">
            <Search className="size-4 text-[#0098d9]" />
            <span className="sr-only">Search schools</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by school or district..." className="w-full bg-transparent text-sm text-[#0b2347] outline-none placeholder:text-[#9aabba]" />
          </label>
          <label className="flex items-center gap-3 border border-[#d1d5db] px-3 py-2.5">
            <MapPinned className="size-4 text-[#0098d9]" />
            <span className="sr-only">Filter by district</span>
            <select value={district} onChange={(event) => setDistrict(event.target.value)} className="bg-transparent text-sm font-semibold text-[#0b2347] outline-none">
              {districts.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.1em] text-[#7b8da2]">{filtered.length} of {modelSchools.length} schools</span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((school) => <button key={school.id} type="button" onClick={() => setSelectedId(school.id)} className={`group flex h-full flex-col border bg-white p-5 text-left transition-all hover:border-[#0098d9] hover:shadow-lg ${selected?.id === school.id ? "border-[#0098d9] shadow-md" : "border-[#e2eef0]"}`}>
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-10 items-center justify-center bg-[#e0f2fe] text-[0.7rem] font-extrabold text-[#0098d9]">{String(school.id).padStart(2, "0")}</span>
              <span className="text-[0.58rem] font-extrabold uppercase tracking-[0.1em] text-[#7b8da2]">{school.note ? "Under review" : "Model school"}</span>
            </div>
            <h3 className="mt-5 text-lg font-extrabold leading-tight tracking-[-0.03em] text-[#0b2347] group-hover:text-[#0098d9]">{school.name}</h3>
            <p className="mt-2 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-[#7b8da2]">{school.district}</p>
            {school.note && <p className="mt-4 border-l-2 border-[#e6a24b] pl-3 text-[0.7rem] leading-5 text-[#8a6a2a]">{school.note}</p>}
            <span className="mt-auto pt-5 inline-flex items-center gap-2 text-[0.66rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">View on map <ArrowUpRight className="size-3.5" /></span>
          </button>)}
        </div>
        {filtered.length === 0 && <div className="mt-6 border border-dashed border-[#d1d5db] bg-white p-10 text-center"><School className="mx-auto size-8 text-[#0098d9]" /><p className="mt-4 text-sm font-bold text-[#0b2347]">No schools match that filter.</p><button type="button" onClick={() => { setDistrict("All districts"); setQuery(""); }} className="mt-3 text-[0.7rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">Clear filters</button></div>}
      </div>
    </section>

    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="Our host colleges" title="Where the residency year began." body="The 100 residents were hosted by two Teacher Training Colleges." />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {hostColleges.map((college, index) => <div key={college.name} className="flex flex-col border border-[#dce8ed] bg-[#f8fbfc] p-7 sm:p-9">
            <div className="flex items-start justify-between gap-5"><div><p className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-[#0098d9]">{college.district}</p><h3 className="mt-3 text-2xl font-extrabold tracking-[-0.04em] text-[#0b2347]">{college.name}</h3></div><Building2 className="size-8 shrink-0 text-[#0098d9]" /></div>
            <p className="mt-5 flex-1 text-sm leading-7 text-[#4b5563]">{college.body}</p>
            <div className="mt-7 flex items-center gap-4 border-t border-[#e2eef0] pt-5"><span className="flex size-10 items-center justify-center bg-[#e0f2fe] text-[#0098d9]"><UsersRound className="size-5" /></span><div><p className="text-[0.58rem] font-extrabold uppercase tracking-[0.1em] text-[#7b8da2]">Residents hosted</p><p className="mt-1 text-lg font-extrabold text-[#0b2347]">{index === 0 ? "50" : "50"}</p></div></div>
          </div>)}
        </div>
        <div className="mt-10 flex items-start gap-3 border border-[#f0d9a8] bg-[#fffaf0] p-5 text-sm leading-7 text-[#7a5a1f]"><AlertCircle className="mt-0.5 size-5 shrink-0 text-[#c88a20]" /><p><strong>Verification note:</strong> All 17 school names are listed as provided in the site brief. GS St Jean Paul II is noted as recently called ES Save, and the district for GS Nyarusange is still to be confirmed. We do not publish unverified intake numbers or exact locations.</p></div>
      </div>
    </section>
  </main>;
}

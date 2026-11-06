import { useEffect, useMemo, useState } from "react";
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
import { ModelSchoolsMap } from "@/components/ptrp/ModelSchoolsMap";
import { SectionHeading } from "@/components/ptrp/SectionHeading";
import { hostColleges, modelSchools, type ModelSchool } from "@/data/ptrp";
import { apiRequest } from "@/lib/api";

export default function SchoolsPage() {
  const [district, setDistrict] = useState("All districts");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(1);
  const [apiSchools, setApiSchools] = useState<ModelSchool[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiRequest<any[]>("schools").then((rows) => {
      if (!Array.isArray(rows) || rows.length === 0) throw new Error("The model schools API returned an invalid response.");
      const schools = rows.map((row): ModelSchool => {
        const name = String(row.name ?? "");
        const schoolDistrict = String(row.district ?? "");
        const fallback = modelSchools.find((school) => school.name.toLowerCase() === name.toLowerCase());
        const latitude = Number(row.latitude);
        const longitude = Number(row.longitude);
        if (!name || !schoolDistrict || !Number.isInteger(Number(row.id))) {
          throw new Error("The model schools API returned an invalid record.");
        }
        let position: [number, number];
        if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
          position = [latitude, longitude];
        } else if (fallback) {
          position = fallback.position;
        } else {
          throw new Error(`Missing map coordinates for ${name}.`);
        }
        return {
          id: Number(row.id),
          name,
          district: schoolDistrict,
          position,
          mapQuery: fallback?.mapQuery ?? `${name} ${schoolDistrict} Rwanda`,
          address: fallback?.address ?? schoolDistrict,
          locationIsApproximate: fallback?.locationIsApproximate ?? true,
          ...(fallback?.note ? { note: fallback.note } : {}),
        };
      });
      if (!cancelled) setApiSchools(schools);
    }).catch((error) => {
      console.error("Model schools API error", error);
    });
    return () => { cancelled = true; };
  }, []);

  const schools = apiSchools ?? modelSchools;
  const districts = useMemo(() => ["All districts", ...Array.from(new Set(schools.map((school) => school.district))).sort((a, b) => a.localeCompare(b))], [schools]);
  const filtered = useMemo(() => schools.filter((school) => {
    const matchesDistrict = district === "All districts" || school.district === district;
    const matchesQuery = `${school.name} ${school.district}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesDistrict && matchesQuery;
  }), [schools, district, query]);

  const selected = filtered.find((school) => school.id === selectedId) ?? filtered[0];
  const directionsUrl = selected ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selected.mapQuery)}` : undefined;

  return <main>
    <PageHero
      eyebrow="Model Schools"
      title="Our 17 model schools."
      description="Model schools are the primary demonstration schools where residents put what they learned into practice through guided teaching. Each school hosts teachers who learn by doing, with mentors beside them."
      image="/manus-storage/ptrp-pilot-launch.jpg"
      imageAlt="PTRP model schools - teacher residency demonstration schools"
      imageCredit="Photo: MINEDUC · PTR Alumni Network"
    >
      <Link href="#school-map" className="button-primary">Explore the network map <ArrowUpRight className="size-4" /></Link>
      <Link href="#school-list" className="button-ghost-light">Browse all schools</Link>
    </PageHero>

    <section id="school-map" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="School locations" title="Explore the model school network." body="All 17 model schools are marked on this interactive map. Pan and zoom, select a numbered marker for school details, or choose a district and school below." />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="overflow-hidden border border-[#dce8ed] bg-white">
            <ModelSchoolsMap schools={filtered} selectedSchool={selected} onSelectSchool={setSelectedId} />
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#e2eef0] bg-[#f8fbfc] p-4 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[#526175]">
              <span className="inline-flex items-center gap-2"><span className="size-3 rounded-full bg-[#0098d9]" /> School location</span>
              <span className="inline-flex items-center gap-2"><span className="size-3 rounded-full bg-[#e6a24b]" /> Area-level reference</span>
              <span className="ml-auto">Map data &copy; OpenStreetMap contributors</span>
            </div>
          </div>

          <div className="flex flex-col border border-[#dce8ed] bg-[#f8fbfc] p-6 sm:p-8">
            {selected ? <>
            <p className="eyebrow text-[#0098d9]">School profile</p>
            <div className="mt-5 flex items-start justify-between gap-4"><div><span className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-[#7b8da2]">School {String(selected?.id ?? 1).padStart(2, "0")}</span><h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-[-0.04em] text-[#0b2347]">{selected?.name}</h2></div><span className="flex size-12 shrink-0 items-center justify-center bg-[#e0f2fe] text-[#0098d9]"><School className="size-5" /></span></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="border border-[#e2eef0] bg-white p-4"><p className="text-[0.58rem] font-extrabold uppercase tracking-[0.1em] text-[#7b8da2]">District</p><p className="mt-2 text-sm font-bold text-[#0b2347]">{selected?.district}</p></div>
              <div className="border border-[#e2eef0] bg-white p-4"><p className="text-[0.58rem] font-extrabold uppercase tracking-[0.1em] text-[#7b8da2]">Sector / address</p><p className="mt-2 text-sm font-bold text-[#0b2347]">{selected.address || "Not available"}</p></div>
            </div>
            {selected.note && <div className="mt-4 flex items-start gap-3 border border-[#f0d9a8] bg-[#fffaf0] p-4"><AlertCircle className="mt-0.5 size-4 shrink-0 text-[#c88a20]" /><p className="text-sm leading-6 text-[#7a5a1f]">{selected.note}</p></div>}
            {selected.locationIsApproximate && <div className="mt-4 flex items-start gap-3 border border-[#f0d9a8] bg-[#fffaf0] p-4"><AlertCircle className="mt-0.5 size-4 shrink-0 text-[#c88a20]" /><p className="text-sm leading-6 text-[#7a5a1f]">This marker is an area-level reference from Google Maps search results, not a confirmed school entrance. Please verify directions before travelling.</p></div>}
            {!selected.note && !selected.locationIsApproximate && <div className="mt-4 flex items-start gap-3 border border-[#dce8ed] bg-white p-4"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#0098d9]" /><p className="text-sm leading-6 text-[#4b5563]">Location matched to a Google Maps school listing. Follow the directions link to confirm the destination before travelling.</p></div>}
            <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-7">
              <a href={directionsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">
                Get directions <ArrowUpRight className="size-4" />
              </a>
              <Link href="/contact" className="inline-flex items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">Suggest a profile update <ArrowUpRight className="size-4" /></Link>
            </div>
            </> : <div className="my-auto py-8 text-center"><School className="mx-auto size-8 text-[#0098d9]" /><p className="mt-4 text-sm font-bold text-[#0b2347]">No school matches these filters.</p><p className="mt-2 text-xs text-[#526175]">Clear the filters to see school details and directions.</p></div>}
          </div>
        </div>
      </div>
    </section>

    <section id="school-list" className="scroll-mt-24 bg-[#f6fafb] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="School directory" title="Find a model school." body="Filter by district or search by school name. Selecting a school updates the map and its Google Maps directions link." />
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
        <div className="mt-10 flex items-start gap-3 border border-[#f0d9a8] bg-[#fffaf0] p-5 text-sm leading-7 text-[#7a5a1f]"><AlertCircle className="mt-0.5 size-5 shrink-0 text-[#c88a20]" /><p><strong>Verification note:</strong> All 17 school names are listed as provided in the site brief. GS St Jean Paul II is noted as recently called ES Save. A Google Maps result places GS Nyarusange in Rwamagana, but its district and identity should be confirmed by program administrators. We do not publish unverified intake numbers or exact locations.</p></div>
      </div>
    </section>
  </main>;
}

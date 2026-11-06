import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  Filter,
  GraduationCap,
  MapPinned,
  Search,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Link } from "wouter";
import { PageHero } from "@/components/ptrp/PageHero";
import { PublicImage } from "@/components/ptrp/PublicImage";
import { SectionHeading } from "@/components/ptrp/SectionHeading";
import { apiRequest } from "@/lib/api";
import { alumniFields, featuredHonoreTuyishime, hostColleges, modelSchools, residentTeacherPhotoUrl } from "@/data/ptrp";

type AlumniProfile = {
  id: string;
  email: string | null;
  name: string;
  ttc: string | null;
  school: string;
  district: string;
  year: string | null;
  bio: string;
  photoUrl: string | null;
};

const featuredAlumniFallback: AlumniProfile = {
  id: "featured-honore",
  email: featuredHonoreTuyishime.email,
  name: featuredHonoreTuyishime.fullName,
  ttc: null,
  school: featuredHonoreTuyishime.modelSchool ?? "",
  district: modelSchools.find((school) => school.name === featuredHonoreTuyishime.modelSchool)?.district ?? "",
  year: null,
  bio: featuredHonoreTuyishime.bio ?? "",
  photoUrl: featuredHonoreTuyishime.photoUrl,
};

export default function AlumniPage() {
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState("All districts");
  const [ttc, setTtc] = useState("All host TTCs");
  const [apiProfiles, setApiProfiles] = useState<AlumniProfile[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiRequest<any[]>("alumni").then((rows) => {
      if (!Array.isArray(rows)) throw new Error("The alumni API returned an invalid response.");
      const profiles = rows.map((row): AlumniProfile => {
        const school = String(row.schoolName ?? "Not listed");
        const modelSchool = modelSchools.find((item) => item.name.toLowerCase() === school.toLowerCase());
        return {
          id: String(row.id),
          email: row.email ?? null,
          name: String(row.fullName ?? ""),
          ttc: row.hostTtc ?? null,
          school,
          district: modelSchool?.district ?? "",
          year: row.graduationYear == null ? null : String(row.graduationYear),
          bio: String(row.bio ?? ""),
          photoUrl: row.photoUrl ?? null,
        };
      }).filter((profile) => profile.name);
      if (!cancelled) setApiProfiles(profiles);
    }).catch((error) => {
      console.error("Alumni directory API error", error);
    });
    return () => { cancelled = true; };
  }, []);

  const profiles = apiProfiles ?? [featuredAlumniFallback];
  const districts = useMemo(() => ["All districts", ...Array.from(new Set(profiles.map((profile) => profile.district).filter(Boolean))).sort((a, b) => a.localeCompare(b))], [profiles]);
  const filtered = useMemo(() => profiles.filter((profile) => {
    const matchesQuery = `${profile.name} ${profile.school} ${profile.district} ${profile.ttc}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesDistrict = district === "All districts" || profile.district === district;
    const matchesTtc = ttc === "All host TTCs" || profile.ttc === ttc;
    return matchesQuery && matchesDistrict && matchesTtc;
  }), [profiles, district, query, ttc]);

  return <main>
    <PageHero
      eyebrow="Alumni Directory"
      title="Meet our alumni."
      description="The PTR Alumni Network connects graduates of the Primary Teacher Residency Program across Rwanda. This directory will grow as members complete their profiles and consent to be listed."
      image="/gallery/gallery-02.jpg"
      imageAlt="PTRP alumni directory - graduate teachers across Rwanda"
      imageCredit="Photo: MINEDUC · PTR Alumni Network"
    >
      <Link href="#directory" className="button-primary">Browse the directory <ArrowUpRight className="size-4" /></Link>
      <Link href="/contact" className="button-ghost-light">Create your profile</Link>
    </PageHero>

    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-20">
          <div>
            <SectionHeading eyebrow="Who is in the network" title="A community of trained, practising teachers." />
            <p className="mt-6 text-[1.02rem] leading-[1.9] text-[#4b5563]">The first PTRP cohort was commissioned on 5 August 2024. Alumni now teach in primary schools and continue to learn from one another through peer support, shared resources, and professional gatherings.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {hostColleges.map((college) => <div key={college.name} className="border border-[#e2eef0] bg-[#f8fbfc] p-5">
                <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-[#0098d9]">{college.district}</p>
                <p className="mt-2 text-base font-extrabold leading-tight tracking-[-0.02em] text-[#0b2347]">{college.name}</p>
                <p className="mt-2 text-[0.72rem] font-bold uppercase tracking-[0.06em] text-[#7b8da2]">50 residents hosted</p>
              </div>)}
            </div>
            <div className="mt-6 flex items-start gap-3 border border-[#f0d9a8] bg-[#fffaf0] p-5 text-sm leading-7 text-[#7a5a1f]">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#c88a20]" />
              <p><strong>Directory status:</strong> Only approved member profiles appear here. Contact details are not displayed without consent.</p>
            </div>
          </div>

          <div className="border border-[#dce8ed] bg-[#0b2347] p-7 text-white sm:p-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-[#38bdf8]">Your profile</p>
                <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.04em]">What members can share.</h2>
              </div>
              <BadgeCheck className="size-9 shrink-0 text-[#38bdf8]" />
            </div>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {alumniFields.map((field) => <li key={field} className="flex items-center gap-2.5 border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[0.78rem] font-semibold text-white/70">
                <span className="size-1.5 shrink-0 bg-[#38bdf8]" />{field}
              </li>)}
            </ul>
            <div className="mt-8 border-t border-white/10 pt-5">
              <p className="text-[0.7rem] leading-6 text-white/50">Every profile is reviewed by an administrator before it appears. You can request changes or removal at any time.</p>
              <Link href="/contact" className="mt-5 inline-flex items-center gap-2 border border-[#38bdf8] bg-[#0098d9] px-4 py-2.5 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-white">Join the directory <ArrowUpRight className="size-4" /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="directory" className="scroll-mt-24 bg-[#f6fafb] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="Directory preview" title="Find alumni by name, school, or district." body="Use the filters to explore the network. Published profiles will show verified school and district information." />

        <div className="mt-8 grid gap-3 border border-[#e2eef0] bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <label className="flex items-center gap-3 border border-[#d1d5db] px-3 py-2.5">
            <Search className="size-4 shrink-0 text-[#0098d9]" />
            <span className="sr-only">Search alumni</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, school, or district..." className="w-full bg-transparent text-sm text-[#0b2347] outline-none placeholder:text-[#9aabba]" />
          </label>
          <label className="flex items-center gap-3 border border-[#d1d5db] px-3 py-2.5">
            <MapPinned className="size-4 shrink-0 text-[#0098d9]" />
            <span className="sr-only">Filter by district</span>
            <select value={district} onChange={(event) => setDistrict(event.target.value)} className="w-full bg-transparent text-sm font-semibold text-[#0b2347] outline-none">
              {districts.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-3 border border-[#d1d5db] px-3 py-2.5">
            <Filter className="size-4 shrink-0 text-[#0098d9]" />
            <span className="sr-only">Filter by host TTC</span>
            <select value={ttc} onChange={(event) => setTtc(event.target.value)} className="w-full bg-transparent text-sm font-semibold text-[#0b2347] outline-none">
              {["All host TTCs", ...hostColleges.map((college) => college.name)].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.1em] text-[#7b8da2]">{filtered.length} of {profiles.length} profiles shown</p>
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.08em] text-[#a3b2bf]">Approved alumni profiles</p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((profile) => <article key={profile.id} className="flex h-full flex-col border border-[#e2eef0] bg-white p-6 transition-colors hover:border-[#0098d9]">
            <div className="flex items-start justify-between gap-4">
              {profile.photoUrl ? <PublicImage src={residentTeacherPhotoUrl(profile.photoUrl) ?? ""} alt={`Portrait of ${profile.name}`} className="size-16 rounded-full object-cover" /> : <div className="flex size-16 items-center justify-center rounded-full bg-[#e8f2f6] text-[#0098d9]"><UserRound className="size-7" strokeWidth={1.5} /></div>}
              <span className="inline-flex items-center gap-1.5 border border-[#d6ecdf] bg-[#f1faf4] px-2.5 py-1 text-[0.58rem] font-extrabold uppercase tracking-[0.08em] text-[#25754a]">Verified profile</span>
            </div>
            <h3 className="mt-5 text-lg font-extrabold leading-tight tracking-[-0.03em] text-[#0b2347]">{profile.name}</h3>
            <p className="mt-1 text-[0.66rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">{profile.year ? `Cohort ${profile.year}` : "PTRP Alumni"}</p>
            <p className="mt-4 flex-1 text-sm leading-6 text-[#4b5563]">{profile.bio}</p>
            <dl className="mt-5 grid gap-2 border-t border-[#eef2f5] pt-4 text-[0.74rem]">
              <div className="flex items-start justify-between gap-3"><dt className="font-bold uppercase tracking-[0.06em] text-[#9aabba]">School</dt><dd className="text-right font-semibold text-[#264665]">{profile.school}</dd></div>
              <div className="flex items-start justify-between gap-3"><dt className="font-bold uppercase tracking-[0.06em] text-[#9aabba]">District</dt><dd className="text-right font-semibold text-[#264665]">{profile.district}</dd></div>
              <div className="flex items-start justify-between gap-3"><dt className="font-bold uppercase tracking-[0.06em] text-[#9aabba]">Host TTC</dt><dd className="text-right font-semibold text-[#264665]">{profile.ttc || "Not listed"}</dd></div>
            </dl>
          </article>)}

          {filtered.length === 0 && <div className="sm:col-span-2 lg:col-span-3 border border-dashed border-[#d1d5db] bg-white p-10 text-center">
            <UsersRound className="mx-auto size-8 text-[#0098d9]" />
            <p className="mt-4 text-sm font-bold text-[#0b2347]">{profiles.length ? "No alumni match those filters yet." : "No approved alumni profiles are published yet."}</p>
            {profiles.length > 0 && <button type="button" onClick={() => { setQuery(""); setDistrict("All districts"); setTtc("All host TTCs"); }} className="mt-3 text-[0.7rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">Clear filters</button>}
          </div>}
        </div>
      </div>
    </section>

    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: GraduationCap, title: "Verified training", body: "Every profile is tied to the PTRP cohort and a host Teacher Training College." },
            { icon: MapPinned, title: "National reach", body: "Alumni teach in schools across Rwanda, from Nyagatare to Rusizi." },
            { icon: ShieldCheck, title: "Member-controlled", body: "You choose what appears publicly. Contact details are never shown without consent." },
          ].map((item) => <div key={item.title} className="border border-[#e2eef0] bg-[#f8fbfc] p-6">
            <span className="flex size-11 items-center justify-center bg-[#e0f2fe] text-[#0098d9]"><item.icon className="size-5" /></span>
            <h3 className="mt-6 text-lg font-extrabold tracking-[-0.03em] text-[#0b2347]">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#4b5563]">{item.body}</p>
          </div>)}
        </div>
        <p className="mt-6 text-[0.68rem] leading-6 text-[#7b8da2]">School districts are matched to the published model-school directory. Contact information is kept private unless a member consents to share it.</p>
      </div>
    </section>

    <section className="cta-band py-16 md:py-20">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between md:px-8 lg:px-12">
        <div className="flex items-center gap-4">
          <UsersRound className="size-8 text-[#38bdf8]" />
          <div>
            <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.14em] text-[#38bdf8]">Grow the network</p>
            <p className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-white">Add your profile to the alumni directory.</p>
          </div>
        </div>
        <Link href="/contact" className="button-ghost-light">Join the network <ArrowUpRight className="size-4" /></Link>
      </div>
    </section>
  </main>;
}

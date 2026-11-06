import { useMemo, useState } from "react";
import {
  ArrowUpRight, BadgeCheck, Building2, GraduationCap, Mail, Phone,
  Search, ShieldCheck, UserRound, UsersRound,
} from "lucide-react";
import { Link } from "wouter";
import { useApiQuery } from "@/lib/api";
import {
  featuredHonoreProfileSlug, featuredHonoreTuyishime, ResidentTeacher,
  residentTeacherPhotoUrl, residentTeacherStatusLabels, residentTeacherStatusColors,
} from "@/data/ptrp";
import { PageHero } from "@/components/ptrp/PageHero";
import { SectionHeading } from "@/components/ptrp/SectionHeading";

export default function ResidentsDirectory() {
  const [query, setQuery] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("All schools");
  const [practiceFilter, setPracticeFilter] = useState("All practices");
  const [sortBy, setSortBy] = useState("featured");

  const { data: teacherResponse, isLoading, error, refetch } = useApiQuery<ResidentTeacher[]>(
    ["api", "resident-teachers", "list"],
    "resident-teachers?limit=100"
  );
  const apiTeachers = Array.isArray(teacherResponse) ? teacherResponse : [featuredHonoreTuyishime];
  // Only show approved and published residents publicly
  const teachers = apiTeachers.filter((t) => t.status === 'approved' || t.status === 'published');
  const directoryError = error instanceof Error
    ? error.message
    : teacherResponse !== undefined && !Array.isArray(teacherResponse)
      ? "The full resident directory is unavailable. Showing the featured profile while the API is disconnected."
      : null;

  const allSchools = useMemo(() => [
    "All schools",
    ...Array.from(new Set(teachers.map((t) => t.modelSchool).filter(Boolean))).sort(),
  ], [teachers]);

  const allPractices = useMemo(() => [
    "All practices",
    ...Array.from(new Set(teachers.map((t) => t.bestPractice).filter(Boolean))).sort(),
  ], [teachers]);

  const filtered = useMemo(() => {
    let result = [...teachers];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((t) =>
        `${t.fullName} ${t.modelSchool} ${t.bestPractice} ${t.position}`.toLowerCase().includes(q)
      );
    }
    if (schoolFilter !== "All schools") result = result.filter((t) => t.modelSchool === schoolFilter);
    if (practiceFilter !== "All practices") result = result.filter((t) => t.bestPractice === practiceFilter);
    if (sortBy === "name") result.sort((a, b) => a.fullName.localeCompare(b.fullName));
    else if (sortBy === "school") result.sort((a, b) => (a.modelSchool || "").localeCompare(b.modelSchool || ""));
    else result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || (a.displayOrder || 0) - (b.displayOrder || 0));
    return result;
  }, [teachers, query, schoolFilter, practiceFilter, sortBy]);

  const featured = filtered.filter((t) => t.isFeatured);
  const regular = filtered.filter((t) => !t.isFeatured);

  return (
    <main>
      <PageHero
        eyebrow="Resident Teachers Directory"
        title="Meet our resident teachers."
        description="Discover the resident teachers of the Primary Teacher Residency Program. Each profile showcases professional contributions, best practices, and classroom impact."
        image="/manus-storage/ptrp-residents-2.jpg"
        imageAlt="PTRP resident teachers directory"
        imageCredit="Photo: MINEDUC · PTR Alumni Network"
      >
        <Link href="/register-resident" className="button-primary">Register as a Resident Teacher <ArrowUpRight className="size-4" /></Link>
      </PageHero>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-20">
            <div>
              <SectionHeading eyebrow="Directory overview" title="Resident teachers across Rwanda." body="Approved resident teachers are listed below. Use the filters to explore the network by school, best practice, or professional role." />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="border border-[#e2eef0] bg-[#f8fbfc] p-5">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#e0f2fe] text-[#0098d9] mb-4">
                    <Building2 className="size-5" />
                  </div>
                  <h3 className="text-lg font-extrabold tracking-[-0.03em] text-[#0b2347]">Model Schools</h3>
                  <p className="mt-3 text-sm leading-6 text-[#4b5563]">Teachers placed in demonstration schools nationwide.</p>
                </div>
                <div className="border border-[#e2eef0] bg-[#f8fbfc] p-5">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#e0f2fe] text-[#0098d9] mb-4">
                    <BadgeCheck className="size-5" />
                  </div>
                  <h3 className="text-lg font-extrabold tracking-[-0.03em] text-[#0b2347]">Administrator Reviewed</h3>
                  <p className="mt-3 text-sm leading-6 text-[#4b5563]">Every profile is reviewed before it appears publicly.</p>
                </div>
              </div>
            </div>

            <div className="border border-[#dce8ed] bg-[#0b2347] p-7 text-white sm:p-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-[#38bdf8]">Directory guidelines</p>
                  <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.04em]">What you'll find.</h2>
                </div>
                <ShieldCheck className="size-9 shrink-0 text-[#38bdf8]" />
              </div>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                <li className="flex items-center gap-2.5 border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[0.78rem] font-semibold text-white/70">
                  <span className="size-1.5 shrink-0 bg-[#38bdf8]" /> Public profiles only
                </li>
                <li className="flex items-center gap-2.5 border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[0.78rem] font-semibold text-white/70">
                  <span className="size-1.5 shrink-0 bg-[#38bdf8]" /> Contact with consent
                </li>
                <li className="flex items-center gap-2.5 border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[0.78rem] font-semibold text-white/70">
                  <span className="size-1.5 shrink-0 bg-[#38bdf8]" /> Best practices
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 grid gap-4 border border-[#e2eef0] bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 border border-[#d1d5db] px-3 py-2.5">
              <Search className="size-4 shrink-0 text-[#0098d9]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, school, or practice..."
                className="w-full bg-transparent text-sm text-[#0b2347] outline-none placeholder:text-[#9aabba]"
              />
            </div>
            <div className="flex items-center gap-3 border border-[#d1d5db] px-3 py-2.5">
              <Building2 className="size-4 shrink-0 text-[#0098d9]" />
              <select
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-[#0b2347] outline-none"
              >
                {allSchools.map((s) => (
                  <option key={s} value={s as string}>{s as string}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 border border-[#d1d5db] px-3 py-2.5">
              <GraduationCap className="size-4 shrink-0 text-[#0098d9]" />
              <select
                value={practiceFilter}
                onChange={(e) => setPracticeFilter(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-[#0b2347] outline-none"
              >
                {allPractices.map((p) => (
                  <option key={p} value={p as string}>{p as string}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 border border-[#d1d5db] px-3 py-2.5">
              <UsersRound className="size-4 shrink-0 text-[#0098d9]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-[#0b2347] outline-none"
              >
                <option value="featured">Featured first</option>
                <option value="name">Name (A-Z)</option>
                <option value="school">School (A-Z)</option>
              </select>
            </div>
          </div>

          {directoryError && (
            <div role="status" className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-[#fde68a] bg-[#fffbeb] p-4 text-sm text-[#92400e]">
              <p>{directoryError}</p>
              <button type="button" onClick={() => refetch()} className="font-bold underline underline-offset-2">
                Try again
              </button>
            </div>
          )}

          {isLoading && <p className="mt-8 text-sm text-[#6b7280]">Loading resident teachers…</p>}

          {featured.length > 0 && (
            <section className="mt-12">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="eyebrow text-[#0098d9]">Featured Teachers</p>
                  <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#0b2347]">PTRP Featured Profiles</h3>
                </div>
                <span className="text-xs font-semibold text-[#7b8da2]">{featured.length} featured</span>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} featured />
                ))}
              </div>
            </section>
          )}

          <section className={`mt-12 ${featured.length > 0 ? "border-t border-[#e2eef0] pt-8" : ""}`}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow text-[#0098d9]">Directory</p>
                <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#0b2347]">All Resident Teachers</h3>
              </div>
              <span className="text-xs font-semibold text-[#7b8da2]">{filtered.length} profiles</span>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regular.length > 0 ? (
                regular.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} />
                ))
              ) : filtered.length === 0 ? (
                <div className="sm:col-span-3 border border-dashed border-[#d1d5db] bg-white rounded-xl p-12 text-center">
                  <UserRound className="mx-auto size-10 text-[#0098d9]" />
                  <p className="mt-4 text-sm font-bold text-[#0b2347]">No teachers match those filters.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setSchoolFilter("All schools");
                      setPracticeFilter("All practices");
                      setSortBy("featured");
                    }}
                    className="mt-3 text-[0.7rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]"
                  >
                    Clear filters
                  </button>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function TeacherCard({ teacher, featured }: { teacher: ResidentTeacher; featured?: boolean }) {
  const statusInfo = residentTeacherStatusLabels[teacher.status];
  const statusColor = residentTeacherStatusColors[teacher.status];
  const hasContact = Boolean(teacher.email || teacher.phone);
  const photoUrl = residentTeacherPhotoUrl(teacher.photoUrl);

  return (
    <article className="flex h-full flex-col border border-[#e2eef0] bg-white rounded-xl p-6 transition-colors hover:border-[#0098d9] hover:shadow-md">
      {teacher.isFeatured && (
        <span className="mb-3 inline-flex items-center gap-1 px-2 py-1 rounded text-[0.58rem] font-bold uppercase tracking-[0.08em] text-white bg-[#0098d9]">
          Featured
        </span>
      )}
      <div className="relative mx-auto mb-4 flex h-[360px] w-full max-w-[320px] items-center justify-center overflow-hidden rounded-lg bg-[#f0f4f8]">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`${teacher.fullName} photo`}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#e8f2f6] text-[#0098d9] border border-[#dce8ed]">
            <UserRound className="size-10" strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`${statusColor} inline-flex items-center gap-1 px-2 py-1 rounded text-[0.58rem] font-bold uppercase tracking-[0.08em]`}>
          {statusInfo}
        </span>
        {teacher.isFeatured && (
          <span className="ml-auto text-[0.6rem] font-extrabold text-[#0098d9]">Featured</span>
        )}
      </div>
      <Link href={`/resident-teacher/${teacher.id === 0 ? featuredHonoreProfileSlug : teacher.id}`} className="block">
        <h3 className="mt-1 text-lg font-extrabold leading-tight tracking-[-0.03em] text-[#0b2347] hover:text-[#0098d9] transition-colors">{teacher.fullName}</h3>
      </Link>
      <p className="mt-1 text-[0.66rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">{teacher.modelSchool}</p>
      <p className="mt-2 text-sm text-[#4b5563]">{teacher.position || "Professional role"}</p>
      {teacher.bio && <p className="mt-3 text-[0.72rem] leading-5 text-[#4b5563] line-clamp-3">{teacher.bio}</p>}
      {teacher.bestPractice && (
        <p className="mt-3 text-[0.66rem] font-bold text-[#168d6d]">Best practice: {teacher.bestPractice}</p>
      )}
      {(teacher.contributions || teacher.bestPracticeDescription) && (
        <p className="mt-2 text-[0.68rem] leading-5 text-[#6b7280] line-clamp-3">
          <strong className="text-[#0b2347]">Contribution: </strong>
          {teacher.contributions || teacher.bestPracticeDescription}
        </p>
      )}
      {hasContact && (
        <dl className="mt-4 grid gap-2 border-t border-[#eef2f5] pt-3 text-[0.7rem]">
          {teacher.email && (
            <div className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-[#0098d9]" />
              <a href={`mailto:${teacher.email}`} className="text-[#0b2347] font-semibold hover:text-[#0098d9]">{teacher.email}</a>
            </div>
          )}
          {teacher.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-[#0098d9]" />
              <span className="text-[#0b2347] font-semibold">{teacher.phone}</span>
            </div>
          )}
        </dl>
      )}
      <div className="mt-auto pt-4">
        <Link href={`/resident-teacher/${teacher.id === 0 ? featuredHonoreProfileSlug : teacher.id}`} className="button-ghost-light w-full py-2 text-xs font-bold uppercase tracking-[0.1em]">
          View Profile <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}

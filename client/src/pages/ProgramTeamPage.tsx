import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  Target,
  UserRound,
  UsersRound,
} from "lucide-react";
import { PageHero } from "@/components/ptrp/PageHero";
import { SectionHeading } from "@/components/ptrp/SectionHeading";
import {
  coordinatorsPlaceholder,
  mentorsPlaceholder,
  ProgramTeamMember,
  sectionMeta,
} from "@/data/ptrp";

const organizations = ["All organizations", "De La Salle", "SAVE"];

const memberInitials = (name: string) => {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

const roleBadge = (role: ProgramTeamMember["role"]) =>
  role === "coordinator"
    ? { label: "Program Coordinator", color: "bg-[#0098d9]/10 text-[#0098d9]" }
    : { label: "Program Mentor", color: "bg-[#168d6d]/10 text-[#168d6d]" };

const statusBadge = (status: ProgramTeamMember["status"]) =>
  status === "published"
    ? { label: "Published", color: "bg-[#168d6d]/10 text-[#168d6d]" }
    : { label: "Draft", color: "bg-[#9ca3af]/10 text-[#6b7280]" };

export default function ProgramTeamPage() {
  const [query, setQuery] = useState("");
  const [orgFilter, setOrgFilter] = useState("All organizations");
  const [roleFilter, setRoleFilter] = useState("All");

  const allMembers = [...coordinatorsPlaceholder, ...mentorsPlaceholder];

  const filtered = useMemo(() => {
    return allMembers.filter((member) => {
      const matchesQuery = `${member.fullName} ${member.organization} ${member.bio ?? ""}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      const matchesOrg = orgFilter === "All organizations" || member.organization === orgFilter;
      const matchesRole = roleFilter === "All" || member.role === roleFilter.toLowerCase();
      return matchesQuery && matchesOrg && matchesRole;
    });
  }, [query, orgFilter, roleFilter]);

  const visible = filtered.filter((m) => m.isVisible && m.status === "published");

  return <main>
    <PageHero
      eyebrow="Program Team"
      title="Meet our program coordinators and mentors."
      description="PTRP program coordinators and mentors guide resident teachers through classroom practice, mentorship, and professional growth at De La Salle and SAVE."
      icon={UsersRound}
      meta={`2 coordinators · 4 mentors · 2 organizations`}
    >
      <Link href="/contact" className="button-ghost-light">Contact the program <ArrowUpRight className="size-4" /></Link>
    </PageHero>

    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-20">
          <div>
            <SectionHeading eyebrow="Program leadership" title="Who guides the residency." />
            <p className="mt-6 text-[1.02rem] leading-[1.9] text-[#4b5563]">
              Program coordinators at De La Salle and SAVE oversee resident teacher placement, mentorship pairing, and school partnerships. Program mentors work directly with residents during guided classroom practice.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {organizations.slice(1).map((org) => {
                const count = allMembers.filter((m) => m.organization === org).length;
                return (
                  <div key={org} className="border border-[#e2eef0] bg-[#f8fbfc] p-5">
                    <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-[#0098d9]">{org}</p>
                    <p className="mt-2 text-base font-extrabold leading-tight tracking-[-0.02em] text-[#0b2347]">{count} team member(s)</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex items-start gap-3 border border-[#f0d9a8] bg-[#fffaf0] p-5 text-sm leading-7 text-[#7a5a1f]">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#c88a20]" />
              <p>
                <strong>Profile status:</strong> Coordinator profiles are published. Mentor profiles are drafts awaiting administrator review and completion. Contact details are only shown when provided by an administrator.
              </p>
            </div>
          </div>

          <div className="border border-[#dce8ed] bg-[#0b2347] p-7 text-white sm:p-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-[#38bdf8]">About the program team</p>
                <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.04em]">Roles and responsibilities.</h2>
              </div>
              <Building2 className="size-9 shrink-0 text-[#38bdf8]" />
            </div>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                { title: "Program Coordinator", body: "Coordinates residency activities and school partnerships at their organization.", icon: Target },
                { title: "Program Mentor", body: "Mentors resident teachers during guided classroom practice.", icon: UserRound },
              ].map((item) => (
                <li key={item.title} className="flex items-center gap-2.5 border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[0.78rem] font-semibold text-white/70">
                  <item.icon className="size-1.5 shrink-0 bg-[#38bdf8]" /> {item.title}
                </li>
              ))}
            </ul>
            <div className="mt-8 border-t border-white/10 pt-5">
              <p className="text-[0.7rem] leading-6 text-white/50">Team profiles are managed by administrators in the Admin Portal. Contact a network administrator for updates or additions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="team" className="scroll-mt-24 bg-[#f6fafb] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Program Team Directory"
          title="Coordinators and mentors by organization."
          body="Filter by organization or role to explore the program team. Published profiles are shown below."
        />

        <div className="mt-8 grid gap-3 border border-[#e2eef0] bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <label className="flex items-center gap-3 border border-[#d1d5db] px-3 py-2.5">
            <UsersRound className="size-4 shrink-0 text-[#0098d9]" />
            <span className="sr-only">Search team members</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or organization..."
              className="w-full bg-transparent text-sm text-[#0b2347] outline-none placeholder:text-[#9aabba]"
            />
          </label>
          <label className="flex items-center gap-3 border border-[#d1d5db] px-3 py-2.5">
            <Building2 className="size-4 shrink-0 text-[#0098d9]" />
            <span className="sr-only">Filter by organization</span>
            <select
              value={orgFilter}
              onChange={(event) => setOrgFilter(event.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-[#0b2347] outline-none"
            >
              {organizations.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-3 border border-[#d1d5db] px-3 py-2.5">
            <ShieldCheck className="size-4 shrink-0 text-[#0098d9]" />
            <span className="sr-only">Filter by role</span>
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-[#0b2347] outline-none"
            >
              <option value="All">All roles</option>
              <option value="coordinator">Program Coordinator</option>
              <option value="mentor">Program Mentor</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.1em] text-[#7b8da2]">
            {visible.length} of {filtered.length} team member(s) shown
          </p>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.length > 0 ? (
            visible.map((member) => {
              const roleInfo = roleBadge(member.role);
              const statusInfo = statusBadge(member.status);
              const hasContact = Boolean(member.email || member.phone);
              return (
                <article
                  key={member.id}
                  className="flex h-full flex-col border border-[#e2eef0] bg-white rounded-xl p-6 transition-colors hover:border-[#0098d9] hover:shadow-md"
                >
                  <div className="relative mb-4">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={`${member.fullName} photo`}
                        className="w-full h-48 object-cover rounded-lg bg-[#f0f4f8]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center rounded-lg bg-[#e8f2f6] text-[#0098d9] border border-[#dce8ed]">
                        <UserRound className="size-12" strokeWidth={1.5} />
                      </div>
                    )}
                    {member.status === "draft" && (
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded text-[0.6rem] font-bold uppercase tracking-[0.08em] text-white bg-[#6b7280]">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[0.6rem] font-extrabold uppercase tracking-[0.08em] ${roleInfo.color}`}
                    >
                      {roleInfo.label}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[0.58rem] font-bold uppercase tracking-[0.08em] ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  <h3 className="mt-1 text-lg font-extrabold leading-tight tracking-[-0.03em] text-[#0b2347]">{member.fullName}</h3>
                  <p className="mt-1 text-[0.66rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">{member.organization}</p>
                  {member.responsibilities && (
                    <p className="mt-3 text-sm leading-6 text-[#4b5563]">{member.responsibilities}</p>
                  )}
                  {hasContact && (
                    <dl className="mt-4 grid gap-2 border-t border-[#eef2f5] pt-4 text-[0.72rem]">
                      {member.email && (
                        <div className="flex items-center justify-between gap-3">
                          <dt className="font-bold uppercase tracking-[0.06em] text-[#9aabba]">Email</dt>
                          <dd className="text-right font-semibold text-[#264665]">{member.email}</dd>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center justify-between gap-3">
                          <dt className="font-bold uppercase tracking-[0.06em] text-[#9aabba]">Phone</dt>
                          <dd className="text-right font-semibold text-[#264665]">{member.phone}</dd>
                        </div>
                      )}
                    </dl>
                  )}
                  {!hasContact && (
                    <p className="mt-4 text-[0.68rem] text-[#9aabba] italic">Contact details to be published by an administrator.</p>
                  )}
                  {member.bio && (
                    <p className="mt-4 text-[0.7rem] leading-6 text-[#4b5563]">{member.bio}</p>
                  )}
                </article>
              );
            })
          ) : (
            <div className="sm:col-span-3 border border-dashed border-[#d1d5db] bg-white rounded-xl p-12 text-center">
              <UserRound className="mx-auto size-10 text-[#0098d9]" />
              <p className="mt-4 text-sm font-bold text-[#0b2347]">No published team members match those filters.</p>
              <button
                type="button"
                onClick={() => { setQuery(""); setOrgFilter("All organizations"); setRoleFilter("All"); }}
                className="mt-3 text-[0.7rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>

    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: Building2,
              title: "Two host organizations",
              body: "Coordinators and mentors serve at De La Salle and SAVE, the PTRP host Teacher Training Colleges.",
            },
            {
              icon: UsersRound,
              title: "Mentor-guided practice",
              body: "Resident teachers learn through guided classroom practice alongside trained mentors.",
            },
            {
              icon: ShieldCheck,
              title: "Administrator-managed",
              body: "Team profiles are created, updated, and published by administrators in the Admin Portal.",
            },
          ].map((item) => (
            <div key={item.title} className="border border-[#e2eef0] bg-[#f8fbfc] p-6 rounded-xl">
              <span className="flex size-11 items-center justify-center bg-[#e0f2fe] text-[#0098d9] rounded-lg">
                <item.icon className="size-5" />
              </span>
              <h3 className="mt-6 text-lg font-extrabold tracking-[-0.03em] text-[#0b2347]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#4b5563]">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>;
}

import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  Building2,
  Camera,
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
} from "@/data/ptrp";
import { queryKeys, useApiQuery } from "@/lib/api";

const organizations = ["All organizations", "TTC De La Salle Byumba", "De La Salle", "SAVE"];
const coordinatorOrganizations = ["TTC De La Salle Byumba", "SAVE"];

const roleBadge = (role: ProgramTeamMember["role"]) =>
  role === "coordinator"
    ? { label: "Coordinator of PTRP", color: "bg-[#0098d9]/10 text-[#0098d9]" }
    : { label: "Program Mentor", color: "bg-[#168d6d]/10 text-[#168d6d]" };

export default function ProgramTeamPage() {
  const [query, setQuery] = useState("");
  const [orgFilter, setOrgFilter] = useState("All organizations");
  const [roleFilter, setRoleFilter] = useState("All");

  const coordinatorQuery = useApiQuery<ProgramTeamMember[]>(queryKeys.publicCoordinators, "coordinators");
  const mentorQuery = useApiQuery<ProgramTeamMember[]>(queryKeys.publicMentors, "mentors");
  const coordinators = coordinatorQuery.data ?? coordinatorsPlaceholder;
  const mentors = mentorQuery.data ?? mentorsPlaceholder;
  const allMembers = [...coordinators, ...mentors];

  const filtered = useMemo(() => {
    return allMembers.filter((member) => {
      const matchesQuery = `${member.fullName} ${member.organization} ${member.responsibilities ?? ""}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      const matchesOrg = orgFilter === "All organizations" || member.organization === orgFilter;
      const matchesRole = roleFilter === "All" || member.role === roleFilter.toLowerCase();
      return matchesQuery && matchesOrg && matchesRole;
    });
  }, [allMembers, query, orgFilter, roleFilter]);

  const visibleCoordinators = filtered.filter((member) => member.role === "coordinator" && member.isVisible && member.status === "published");
  const visibleMentors = filtered.filter((member) => member.role === "mentor" && member.isVisible && member.status === "published");

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
              Program coordinators at TTC De La Salle Byumba and SAVE guide the residency. Program mentors work directly with residents during guided classroom practice.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {coordinatorOrganizations.map((org) => {
                const count = coordinators.filter((member) => member.organization === org).length;
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

        {(coordinatorQuery.isError || mentorQuery.isError) && (
          <p role="status" className="mt-5 border border-[#f0d9a8] bg-[#fffaf0] px-4 py-3 text-sm text-[#7a5a1f]">
            The live team directory could not be refreshed. Showing the verified coordinator details and available profile information.
          </p>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.1em] text-[#7b8da2]">
            {visibleCoordinators.length} coordinators · {visibleMentors.length} published mentors
          </p>
        </div>

        <section className="mt-7" aria-labelledby="coordinators-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-[#0098d9]">Program leadership</p>
              <h3 id="coordinators-heading" className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#0b2347]">PTRP Program Coordinators</h3>
            </div>
            <span className="text-xs font-semibold text-[#7b8da2]">{visibleCoordinators.length} profiles</span>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {visibleCoordinators.length ? visibleCoordinators.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            )) : (
              <p className="md:col-span-2 rounded-xl border border-dashed border-[#d1d5db] bg-white p-8 text-center text-sm text-[#7b8da2]">
                No published coordinator profiles match those filters.
              </p>
            )}
          </div>
        </section>

        <section className="mt-12 border-t border-[#e2eef0] pt-8" aria-labelledby="mentors-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-[#168d6d]">Separate directory</p>
              <h3 id="mentors-heading" className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#0b2347]">PTRP Program Mentors</h3>
            </div>
            <span className="text-xs font-semibold text-[#7b8da2]">{visibleMentors.length} published profiles</span>
          </div>
          {visibleMentors.length ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleMentors.map((member) => <TeamMemberCard key={member.id} member={member} />)}
            </div>
          ) : (
            <p className="mt-5 rounded-xl border border-dashed border-[#d1d5db] bg-white p-6 text-sm leading-6 text-[#7b8da2]">
              Mentor profiles remain in their separate administrator-managed section and will appear here when published.
            </p>
          )}
        </section>
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

function TeamMemberCard({ member }: { member: ProgramTeamMember }) {
  const isCoordinator = member.role === "coordinator";
  const roleInfo = roleBadge(member.role);
  const phoneDigits = member.phone?.replace(/\D/g, "");

  return (
    <article className="overflow-hidden rounded-xl border border-[#dce8ed] bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-[16/9] overflow-hidden bg-[#e8f2f6]">
        {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={`Portrait of ${member.fullName}`}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-[#0098d9]">
            <Camera className="size-9" strokeWidth={1.5} />
            <span className="text-xs font-bold">Profile photo not yet provided</span>
          </div>
        )}
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[0.62rem] font-extrabold uppercase tracking-[0.08em] ${roleInfo.color}`}>
          {roleInfo.label}
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <h4 className="text-xl font-extrabold leading-tight tracking-[-0.035em] text-[#0b2347]">{member.fullName}</h4>
        <p className="mt-2 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">{member.organization}</p>
        {!isCoordinator && member.responsibilities && (
          <p className="mt-3 text-sm leading-6 text-[#4b5563]">{member.responsibilities}</p>
        )}
        <div className="mt-5 grid gap-3 border-t border-[#eef2f5] pt-4 text-sm">
          {member.email ? (
            <a href={`mailto:${member.email}`} className="flex min-w-0 items-center gap-2.5 font-semibold text-[#264665] hover:text-[#0098d9]">
              <Mail className="size-4 shrink-0 text-[#0098d9]" />
              <span className="break-all">{member.email}</span>
            </a>
          ) : isCoordinator ? (
            <div className="flex items-center gap-2.5 text-[#7b8da2]">
              <Mail className="size-4 shrink-0 text-[#9aabba]" />
              <span>Email: Not yet provided</span>
            </div>
          ) : null}
          {member.phone && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <a href={`tel:${member.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2.5 font-semibold text-[#264665] hover:text-[#0098d9]">
                <Phone className="size-4 shrink-0 text-[#0098d9]" />
                <span>{member.phone}</span>
              </a>
              {phoneDigits && (
                <a
                  href={`https://wa.me/${phoneDigits}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#168d6d] hover:underline"
                  aria-label={`Message ${member.fullName} on WhatsApp`}
                >
                  WhatsApp
                  <ArrowUpRight className="ml-1 inline size-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

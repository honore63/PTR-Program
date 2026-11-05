import { useState } from "react";
import { useRoute } from "wouter";
import {
  ArrowUpRight, Mail, Phone, Building2, GraduationCap, Briefcase,
  ImagePlus, ExternalLink, ShieldCheck, UsersRound, Link as LinkIcon,
} from "lucide-react";
import { Link } from "wouter";
import { useApiQuery } from "@/lib/api";
import { toast } from "sonner";
import { residentTeacherStatusLabels, residentTeacherStatusColors } from "@/data/ptrp";
import { PageHero } from "@/components/ptrp/PageHero";
import { SectionHeading } from "@/components/ptrp/SectionHeading";

type ResidentTeacherDetailData = {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  gender: string | null;
  modelSchool: string | null;
  position: string | null;
  bestPractice: string | null;
  bestPracticeDescription: string | null;
  subjects: string | null;
  skills: string | null;
  contributions: string | null;
  bio: string | null;
  photoUrl: string | null;
  status: string;
  isFeatured: boolean;
  displayOrder: number;
  submittedAt: string | null;
  publishedAt: string | null;
  bestPractices: Array<{
    id: number;
    title: string;
    category: string;
    description: string;
    mediaUrl: string | null;
    mediaType: string | null;
    publishedAt: string | null;
  }>;
};

export default function ResidentTeacherDetail() {
  const [, params] = useRoute("/resident-teacher/:id");
  const teacherId = parseInt((params as any)?.id, 10);
  const [isSharing, setIsSharing] = useState(false);

  const { data: teacher, isLoading, error } = useApiQuery<ResidentTeacherDetailData>(
    ["api", "resident-teacher", String(teacherId)],
    isNaN(teacherId) ? "" : `resident-teachers/${teacherId}`
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f6fafb] flex items-center justify-center">
        <div className="text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#e0f2fe] text-[#0098d9] mx-auto mb-4">
            <UsersRound className="size-6" />
          </div>
          <p className="text-sm text-[#6b7280]">Loading profile…</p>
        </div>
      </main>
    );
  }

  if (error || !teacher) {
    return (
      <main className="min-h-screen bg-[#f6fafb] flex items-center justify-center">
        <div className="text-center px-6">
          <ShieldCheck className="mx-auto size-12 text-[#9ca3af]" />
          <h2 className="mt-4 text-2xl font-extrabold text-[#0b2347]">Profile not found</h2>
          <p className="mt-2 text-[#6b7280]">The resident teacher profile you're looking for doesn't exist or hasn't been published yet.</p>
          <Link href="/residents" className="mt-4 inline-block button-ghost-light">Browse Directory</Link>
        </div>
      </main>
    );
  }

  const statusInfo = residentTeacherStatusLabels[teacher.status as keyof typeof residentTeacherStatusLabels] || teacher.status;
  const statusColor = residentTeacherStatusColors[teacher.status as keyof typeof residentTeacherStatusColors] || "text-[#6b7280]";

  const shareProfile = () => {
    setIsSharing(true);
    if (navigator.share) {
      navigator.share({
        title: `${teacher.fullName} - PTR Alumni Network`,
        text: `${teacher.fullName} is a resident teacher at ${teacher.modelSchool}.`,
        url: window.location.href,
      }).finally(() => setIsSharing(false));
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setIsSharing(false);
        toast.success("Profile link copied to clipboard.");
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#f6fafb]">
      <PageHero
        eyebrow="Resident Teachers Directory"
        title={`${teacher.fullName} — Resident Teacher`}
        description={teacher.bio || `${teacher.modelSchool ?? "A PTR model school"} · Resident teacher profile currently under review.`}
        image={teacher.photoUrl || "/manus-storage/ptrp-residents-2.jpg"}
        imageAlt={`${teacher.fullName} — PTR resident teacher profile`}
        imageCredit="Photo: MINEDUC · PTR Alumni Network"
      />
      <header className="border-b border-[#e2eef0] bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 h-[78px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="brand-mark bg-[#0098d9] border-2 border-[#0098d9] rounded-full flex items-center justify-center w-8 h-8">
              <GraduationCap className="size-5 text-white" />
            </span>
            <span className="text-[1.25rem] font-extrabold tracking-[-0.02em] text-[#0b2347]">PTR Alumni Network</span>
          </Link>
          <Link href="/residents" className="button-ghost-light">← Back to Directory</Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12 py-8 md:py-12">
        <article className="grid gap-8 lg:grid-cols-[0.6fr_1fr]">
          {/* Photo Column */}
          <div className="space-y-6">
            <div className="relative group">
              {teacher.photoUrl ? (
                <img
                  src={teacher.photoUrl}
                  alt={`${teacher.fullName} - Professional portrait`}
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center rounded-2xl bg-[#e8f2f6] border-2 border-[#dce8ed] text-[#0098d9]">
                  <UsersRound className="size-16" strokeWidth={1.5} />
                </div>
              )}
              <span
                className={`absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-[0.08em] text-white ${statusColor.replace("/10", "")} shadow-lg`}
              >
                {statusInfo}
              </span>
              {teacher.isFeatured && (
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0098d9] text-white text-[0.65rem] font-bold uppercase tracking-[0.08em] shadow-lg">
                  <Star className="size-4 fill-current" /> Featured
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {teacher.email && (
                <button
                  onClick={() => window.location.href = `mailto:${teacher.email}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#e2eef0] bg-white text-left hover:border-[#0098d9] transition-colors group"
                >
                  <Mail className="size-5 text-[#0098d9]" />
                  <div>
                    <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-[#6b7280]">Email</p>
                    <p className="text-sm font-semibold text-[#0b2347]">{teacher.email}</p>
                  </div>
                </button>
              )}
              {teacher.phone && (
                <button
                  onClick={() => window.location.href = `tel:${teacher.phone}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#e2eef0] bg-white text-left hover:border-[#0098d9] transition-colors group"
                >
                  <Phone className="size-5 text-[#0098d9]" />
                  <div>
                    <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-[#6b7280]">Phone</p>
                    <p className="text-sm font-semibold text-[#0b2347]">{teacher.phone}</p>
                  </div>
                </button>
              )}
              {teacher.modelSchool && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#e2eef0] bg-white text-left">
                  <Building2 className="size-5 text-[#0098d9]" />
                  <div>
                    <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-[#6b7280]">Model School</p>
                    <p className="text-sm font-semibold text-[#0b2347]">{teacher.modelSchool}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={shareProfile}
                disabled={isSharing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#e2eef0] bg-white text-sm font-semibold text-[#0b2347] hover:border-[#0098d9] hover:text-[#0098d9] transition-colors disabled:opacity-60"
              >
                <ExternalLink className="size-4" />
                {isSharing ? "Sharing…" : "Share Profile"}
              </button>
              <Link href="/residents" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#e2eef0] bg-white text-sm font-semibold text-[#0b2347] hover:border-[#0098d9] hover:text-[#0098d9] transition-colors">
                <ArrowUpRight className="size-4" /> Directory
              </Link>
            </div>
          </div>

          {/* Details Column */}
          <div className="space-y-8">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[0.6rem] font-bold uppercase tracking-[0.08em] ${statusColor}`}
                  >
                    {statusInfo}
                  </span>
                  {teacher.isFeatured && (
                    <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded text-[0.6rem] font-bold uppercase tracking-[0.08em] text-white bg-[#0098d9]">
                      Featured Profile
                    </span>
                  )}
                </div>
              </div>
              <h1 className="mt-3 text-3xl md:text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-[#0b2347]">{teacher.fullName}</h1>
              <p className="mt-2 text-lg font-semibold uppercase tracking-[0.1em] text-[#0098d9]">{teacher.position || "Professional Role"}</p>
              {teacher.bestPractice && (
                <p className="mt-4 text-sm font-extrabold uppercase tracking-[0.1em] text-[#168d6d]">Best Practice: {teacher.bestPractice}</p>
              )}
              {teacher.bio && (
                <div className="mt-8">
                  <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-[#38bdf8] mb-2">Professional Biography</p>
                  <p className="text-[#4b5563] leading-relaxed text-lg">{teacher.bio}</p>
                </div>
              )}
              {teacher.contributions && (
                <div className="mt-8">
                  <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-[#38bdf8] mb-4">Professional Contributions &amp; Achievements</p>
                  <ul className="space-y-3 text-[#4b5563] leading-relaxed text-lg">
                    {teacher.contributions.split(/[.,;]\s*/).filter(Boolean).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 pl-4 relative">
                        <span className="absolute left-0 top-1.5 size-1.5 rounded-full bg-[#0098d9]" />
                        <span>{item.trim()}.</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {teacher.subjects && (
                <div className="mt-8">
                  <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-[#38bdf8] mb-3">Subjects &amp; Specialization</p>
                  <div className="flex flex-wrap gap-2">
                    {teacher.subjects.split(/[;,]\s*/).filter(Boolean).map((subj) => (
                      <span key={subj} className="px-3 py-1.5 rounded-full border border-[#e2eef0] bg-[#f8fbfc] text-[0.68rem] font-semibold text-[#0b2347]">
                        {subj.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {teacher.skills && (
                <div className="mt-6">
                  <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-[#38bdf8] mb-3">Skills &amp; Professional Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {teacher.skills.split(/[;,]\s*/).filter(Boolean).map((skill) => (
                      <span key={skill} className="px-3 py-1.5 rounded-full border border-[#e2eef0] bg-[#f8fbfc] text-[0.68rem] font-semibold text-[#0b2347]">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {teacher.submittedAt && (
                <div className="mt-8 pt-6 border-t border-[#e2eef0]">
                  <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-[#6b7280]">Profile submitted {new Date(teacher.submittedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {/* Best Practices */}
            {teacher.bestPractices && teacher.bestPractices.length > 0 && (
              <section className="mt-10">
                <SectionHeading eyebrow="Best Practices" title="Areas of educational excellence." />
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {teacher.bestPractices.map((bp) => (
                    <div key={bp.id} className="border border-[#e2eef0] bg-white rounded-xl p-5">
                      <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-[#168d6d]">{bp.category}</span>
                      <h4 className="mt-2 text-lg font-extrabold tracking-[-0.03em] text-[#0b2347]">{bp.title}</h4>
                      <p className="mt-3 text-sm leading-6 text-[#4b5563]">{bp.description}</p>
                      {bp.mediaUrl && (
                        <div className="mt-4">
                          {bp.mediaType === "image" ? (
                            <img src={bp.mediaUrl} alt={bp.title} className="w-full h-32 object-cover rounded-lg" loading="lazy" />
                          ) : bp.mediaType && (
                            <a href={bp.mediaUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[#e2eef0] bg-[#f8fbfc] text-left text-sm font-semibold text-[#0098d9] hover:bg-[#e0f2fe] transition-colors">
                              <LinkIcon className="size-4" /> {bp.mediaType.toUpperCase()} Document
                            </a>
                          )}
                        </div>
                      )}
                      <p className="mt-3 text-[0.65rem] text-[#6b7280]">Published {new Date(bp.publishedAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927a.371.371 0 00-.482 0l-5 1.69a.371.371 0 01-.278.089l-3.5 3.497a.371.371 0 00-.097.58l1.69 5a.371.371 0 01.278.319l4.316-1.178a.371.371 0 00.278-.089l1.69-5a.371.371 0 01.097-.58l3.5-3.497a.371.371 0 00-.097-.58z"
      />
    </svg>
  );
}

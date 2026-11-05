import {
  ArrowUpRight,
  CheckCircle2,
  UsersRound,
  MapPinned,
  Lightbulb,
  Activity,
  School,
  HeartHandshake,
  BookOpen,
  NotebookTabs,
  Globe2,
  Camera,
  MessageCircle,
  Sparkles,
  Mail,
  Phone,
  Clock,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import {
  participatingSchools,
  programOverview,
  sectionMeta,
  copy,
  type Language,
} from "@/data/ptrp";
import { queryKeys, useApiQuery } from "@/lib/api";

type SectionPageProps = { path: string; language: Language };

// Section-specific configurations
const sectionConfigs: Record<string, {
  title: string;
  description: string;
  eyebrow: string;
  icon: typeof UsersRound | typeof MapPinned | typeof Lightbulb | typeof Activity | typeof School | typeof HeartHandshake | typeof BookOpen | typeof Globe2 | typeof Camera | typeof MessageCircle | typeof Sparkles;
}> = {
  "/about": {
    title: "About PTR Alumni Network",
    description: "Program background, mission, vision, core values, and PTR Alumni Network's role in improving education in Rwanda.",
    eyebrow: "About PTR Alumni Network",
    icon: UsersRound,
  },
  "/network": {
    title: "Our Network",
    description: "100 resident teachers, 17 model schools, and one connected national network for collaboration and professional learning.",
    eyebrow: "Connect",
    icon: MapPinned,
  },
  "/activities": {
    title: "Activities & Updates",
    description: "Approved classroom teaching, lesson planning, mentorship, professional development, ICT, STEM, and school events.",
    eyebrow: "Share",
    icon: Activity,
  },
  "/practices": {
    title: "Best Teaching Practices",
    description: "Learner-centred pedagogy, inclusive education, ICT integration, STEM, assessment, and more — made by teachers, for teachers.",
    eyebrow: "Learn together",
    icon: Lightbulb,
  },
  "/impact": {
    title: "Impact on Education",
    description: "Verified statistics, impact stories, testimonials, and visual data showing PTR Alumni Network's contribution to education in Rwanda.",
    eyebrow: "Transform",
    icon: Globe2,
  },
  "/gallery": {
    title: "Gallery",
    description: "Approved photos, videos, and media from classroom moments, professional learning, school events, and network gatherings.",
    eyebrow: "Field notes",
    icon: Camera,
  },
  "/news": {
    title: "News & Success Stories",
    description: "Program announcements, school updates, resident teacher experiences, interviews, recognition, and events.",
    eyebrow: "From the network",
    icon: MessageCircle,
  },
  "/resources": {
    title: "Resources & Publications",
    description: "Lesson plans, teaching materials, videos, reports, research, training documents, and best-practice guides.",
    eyebrow: "Resources",
    icon: BookOpen,
  },
  "/contact": {
    title: "Contact & Partnerships",
    description: "Official contact details, location, email, phone, and partnership channels for PTR Alumni Network.",
    eyebrow: "Contact & partnerships",
    icon: HeartHandshake,
  },
};

export default function SectionPage({ path, language }: SectionPageProps) {
  const meta = sectionMeta[path] ?? sectionMeta["/about"];
  const Config = sectionConfigs[path] ?? sectionConfigs["/about"];
  const Icon = Config.icon;
  const slug = path.replace(/^\//, "");
  const published = useApiQuery<any>([...queryKeys.adminContent, "published", slug], `content/${encodeURIComponent(slug)}`);
  const [activityFilter, setActivityFilter] = useState("All");
  const [resourceFilter, setResourceFilter] = useState("All");

  return (
    <main className="min-h-screen bg-white pt-[78px]">
      {/* Section Hero */}
      <section className="bg-[#0098d9] py-20 md:py-28 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
          <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] lg:gap-16 items-end">
            <div>
              <p className="eyebrow text-[#38bdf8]"><span className="eyebrow-dot" />PTR Alumni Network</p>
              <h1 className="mt-4 text-white text-[3rem] md:text-[4rem] font-extrabold leading-[1.05] tracking-[-0.02em]">
                {Config.title}
              </h1>
              <p className="mt-6 max-w-xl text-[#e0f2fe] text-[1rem] leading-[1.7]">
                {published.data?.summary ?? Config.description}
              </p>
            </div>
            <div className="flex items-center justify-end">
              <div className="relative inline-block">
                <Icon className="size-20 text-white/20 absolute -right-6 -bottom-6" />
                <div className="relative z-10 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/70 mb-3">{meta.demo}</p>
                  <p className="text-white text-sm leading-relaxed">
                    {published.data ? "Published by an authorized PTR Alumni Network administrator." : "Official PTR Alumni Network content. Details appear after verification and approval."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12 py-20 md:py-28 lg:py-32">

        {/* About PTR Alumni Network */}
        {path === "/about" && (
          <>
            <div className="mb-16">
              <p className="eyebrow text-[#0098d9] mb-4">Program Background</p>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111] mb-6">About the Primary Teacher Residency Program</h2>
              <p className="text-[#4b5563] text-lg leading-[1.8]">
                {published.data?.body ?? copy.en.about.intro}
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid gap-8 md:grid-cols-2 mb-16">
              <div className="border-l-4 border-[#0098d9] pl-6 py-6 bg-[#f8fafc] rounded-r-lg">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="size-5 text-[#0098d9]" />
                  <h3 className="text-xl font-extrabold text-[#111]">Our Mission</h3>
                </div>
                <p className="text-[#4b5563] leading-[1.7]">{copy.en.about.mission.body}</p>
              </div>
              <div className="border-l-4 border-[#1e3a5f] pl-6 py-6 bg-[#f0f9ff] rounded-r-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Globe2 className="size-5 text-[#1e3a5f]" />
                  <h3 className="text-xl font-extrabold text-[#111]">Our Vision</h3>
                </div>
                <p className="text-[#4b5563] leading-[1.7]">{copy.en.about.vision.body}</p>
              </div>
            </div>

            {/* Core Values */}
            <div className="mb-16">
              <p className="eyebrow text-[#0098d9] mb-4">Core Values</p>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111] mb-8">Values That Guide Us</h2>
              <div className="grid gap-6 md:grid-cols-4">
                {copy.en.about.values.map((value, index) => (
                  <div key={index} className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-[#0098d9]/10 flex items-center justify-center mb-4">
                      <span className="text-[#0098d9] font-bold text-sm">{index + 1}</span>
                    </div>
                    <h4 className="text-lg font-extrabold text-[#111] mb-3">{value.title}</h4>
                    <p className="text-[#4b5563] text-sm leading-[1.6]">{value.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Role in Rwanda */}
            <div className="mb-16">
              <p className="eyebrow text-[#0098d9] mb-4">Impact on Education</p>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111] mb-6">PTR Alumni Network's Role in Rwanda</h2>
              <div className="bg-[#f8fafc] rounded-xl p-8 border border-[#e2eef0]">
                <p className="text-[#4b5563] leading-[1.8]">{copy.en.about.roleInRwanda.body}</p>
              </div>
            </div>

            {/* Program Overview */}
            <div className="mb-16">
              <p className="eyebrow text-[#0098d9] mb-4">Program Overview</p>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111] mb-6">Primary Teacher Residency Program</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="font-medium text-lg text-[#0098d9] mb-4">Program Aims</h3>
                  <p className="text-[#4b5563] leading-[1.8] mb-6">{programOverview.aims}</p>
                  <h3 className="font-medium text-lg text-[#0098d9] mb-4">How It Operates</h3>
                  <p className="text-[#4b5563] leading-[1.8]">{programOverview.howItOperates}</p>
                </div>
                <div>
                  <h3 className="font-medium text-lg text-[#0098d9] mb-4">Teacher Training</h3>
                  <p className="text-[#4b5563] leading-[1.8] mb-6">{programOverview.teacherTraining}</p>
                  <h3 className="font-medium text-lg text-[#0098d9] mb-4">Mentorship</h3>
                  <p className="text-[#4b5563] leading-[1.8]">{programOverview.mentorship}</p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-[#e2eef0]">
                <h3 className="font-medium text-lg text-[#0098d9] mb-4">Professional Development</h3>
                <p className="text-[#4b5563] leading-[1.8] mb-4">{programOverview.professionalDevelopment}</p>
                <h3 className="font-medium text-lg text-[#0098d9] mb-4">Expected Outcomes</h3>
                <p className="text-[#4b5563] leading-[1.8]">{programOverview.expectedOutcomes}</p>
              </div>
            </div>
          </>
        )}

        {/* Participating Schools */}
        {path === "/network" && (
          <>
            <div className="mb-16">
              <p className="eyebrow text-[#0098d9] mb-4">Resident Teacher Network</p>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111] mb-6">100 Resident Teachers · 17 Model Schools</h2>
              <p className="text-[#4b5563] text-lg leading-[1.8]">
                A growing national network of resident teachers and model schools, designed to make collaboration practical, visible, and focused on learner outcomes. Each resident is placed in one of 17 model schools across Rwanda.
              </p>
            </div>

            <div className="mb-16">
              <p className="eyebrow text-[#0098d9] mb-4">Participating Schools</p>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111] mb-8">17 Model Schools Across Rwanda</h2>
              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                {participatingSchools.map((school, index) => {
                  const verified = !school.name.startsWith("School ");
                  return (
                  <div key={index} className="border rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="h-32 rounded-lg bg-[#f8fbfc] flex items-center justify-center mb-4 overflow-hidden">
                      <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#0098d9] leading-none">
                        {school.name}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#0098d9] mb-2">{verified ? school.location : "Location pending verification"}</p>
                    <p className="text-sm font-medium text-[#111] mb-3">{verified ? school.focus : "School profile pending administrator approval"}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-[#e2eef0]">
                      <span className="text-xs font-bold text-[#6b7280]">{verified ? `${school.intake} residents` : "Profile under review"}</span>
                      <ArrowUpRight className="size-4 text-[#0098d9] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  );
                })}
              </div>
              <p className="mt-6 text-xs text-[#6b7280] italic">
                All 17 model schools are part of the PTR Alumni Network. TTC Save and TTC Gicumbi are named in official launch sources; remaining school names and placement details are placeholders pending administrator verification.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="border rounded-xl bg-[#f8fafc] p-6">
                <h3 className="font-extrabold text-lg text-[#111] mb-3">Collaboration</h3>
                <p className="text-[#4b5563] text-sm leading-[1.7]">
                  Resident teachers work alongside mentor teachers in model schools, sharing practice and learning together.
                </p>
              </div>
              <div className="border rounded-xl bg-[#f8fafc] p-6">
                <h3 className="font-extrabold text-lg text-[#111] mb-3">Professional Learning</h3>
                <p className="text-[#4b5563] text-sm leading-[1.7]">
                  Regular professional learning communities, cross-school visits, and network-wide events support continuous growth.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Activities & Updates */}
        {path === "/activities" && (
          <>
            <div className="mb-16">
              <p className="eyebrow text-[#0098d9] mb-4">Classroom Activities</p>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111] mb-6">Approved Activities from Across the Network</h2>
              <p className="text-[#4b5563] text-lg leading-[1.8]">
                Browse verified classroom teaching activities, lesson plans, mentorship sessions, and professional development updates shared by resident teachers and model schools.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mb-12">
              {["All", "Classroom", "Professional Learning", "Mentorship", "ICT", "STEM"].map((filterLabel) => (
                <button
                  key={filterLabel}
                  onClick={() => setActivityFilter(filterLabel)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                    activityFilter === filterLabel ? "bg-[#0098d9] text-white" : "bg-[#f8fafc] border border-[#e2eef0] text-[#4b5563] hover:bg-[#e0f2fe]"
                  }`}
                >
                  {filterLabel}
                </button>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Learning circles that turn reflection into action",
                  category: "Professional Development",
                  group: "Professional Learning",
                  body: "Resident teachers meet weekly to reflect on lessons, share challenges, and co-plan improvements.",
                  icon: MessageCircle,
                  color: "bg-[#e0f2fe]",
                  iconColor: "text-[#0098d9]",
                },
                {
                  title: "A lesson planned around every learner's voice",
                  category: "Learner-Centred Pedagogy",
                  group: "Classroom",
                  body: "Planning prompts that help more learners enter the lesson with confidence and participate actively.",
                  icon: NotebookTabs,
                  color: "bg-[#e0f2fe]",
                  iconColor: "text-[#0098d9]",
                },
                {
                  title: "Peer coaching across school communities",
                  category: "Mentorship & Collaboration",
                  group: "Mentorship",
                  body: "Experienced mentor teachers provide weekly guidance and model effective classroom practice.",
                  icon: UsersRound,
                  color: "bg-[#e0f2fe]",
                  iconColor: "text-[#0098d9]",
                },
                {
                  title: "ICT integration in primary classrooms",
                  category: "Digital Literacy",
                  group: "ICT",
                  body: "Residents use simple digital tools to enhance literacy and mathematics instruction.",
                  icon: BookOpen,
                  color: "bg-[#e0f2fe]",
                  iconColor: "text-[#0098d9]",
                },
                {
                  title: "STEM teaching with local materials",
                  category: "Science & Math",
                  group: "STEM",
                  body: "Turn everyday materials into invitations to observe, test, and make sense of the world.",
                  icon: Sparkles,
                  color: "bg-[#e0f2fe]",
                  iconColor: "text-[#0098d9]",
                },
                {
                  title: "Assessment for learning workshop",
                  category: "Professional Development",
                  group: "Professional Learning",
                  body: "Formative assessment techniques that help teachers adjust instruction in real time.",
                  icon: Lightbulb,
                  color: "bg-[#e0f2fe]",
                  iconColor: "text-[#0098d9]",
                },
              ].filter((activity) => activityFilter === "All" || activity.group === activityFilter).map((activity, index) => (
                <div key={index} className="border rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${activity.color} mb-4`}>
                    <activity.icon className="size-5" />
                  </div>
                  <p className="text-[0.8rem] font-bold uppercase tracking-wide text-[#0098d9] mb-2">{activity.category}</p>
                  <h3 className="text-lg font-extrabold tracking-[-0.02em] text-[#111] mb-3">{activity.title}</h3>
                  <p className="text-[#4b5563] text-sm leading-[1.7] mb-6">{activity.body}</p>
                  <Link href="/activities" className="text-[0.85rem] font-bold uppercase tracking-wide text-[#0098d9] flex items-center gap-2">
                    Read more <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Best Practices */}
        {path === "/practices" && (
          <>
            <div className="mb-16">
              <p className="eyebrow text-[#0098d9] mb-4">Teaching Practices</p>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111] mb-6">Best Practices by Teachers, for Teachers</h2>
              <p className="text-[#4b5563] text-lg leading-[1.8]">
                Discover proven teaching strategies, classroom routines, and innovative methods that resident teachers use every day across Rwanda's model schools.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Make thinking visible",
                  category: "Learner-centred pedagogy",
                  body: "A practical routine for helping pupils explain, compare, and build on one another's ideas during lessons.",
                  icon: Sparkles,
                },
                {
                  title: "Design for participation",
                  category: "Inclusive education",
                  body: "Simple planning prompts that help more learners enter the lesson with confidence and stay engaged.",
                  icon: HeartHandshake,
                },
                {
                  title: "Teach with what is around you",
                  category: "STEM & practical learning",
                  body: "Turn everyday materials into invitations to observe, test, and make sense of the world — no expensive equipment needed.",
                  icon: BookOpen,
                },
                {
                  title: "Formative assessment in real time",
                  category: "Assessment",
                  body: "Quick checks for understanding that let teachers adjust instruction during the lesson, not after.",
                  icon: Lightbulb,
                },
                {
                  title: "ICT integration basics",
                  category: "Digital literacy",
                  body: "Simple, low-bandwidth digital tools that enhance literacy and mathematics teaching in any classroom.",
                  icon: Activity,
                },
                {
                  title: "Inclusive classroom routines",
                  category: "Inclusive education",
                  body: "Daily routines that ensure every learner, including those with special needs, can participate fully.",
                  icon: UsersRound,
                },
              ].map((practice, index) => (
                <div key={index} className="border rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[0.75rem] font-bold uppercase tracking-wide ${index % 2 === 0 ? "text-[#0098d9]" : "text-[#6b7280]"}`}>
                      {practice.category}
                    </span>
                    <practice.icon className={`size-5 ${index % 2 === 0 ? "text-[#0098d9]" : "text-[#6b7280]"}`} />
                  </div>
                  <h3 className="text-xl font-extrabold tracking-[-0.02em] text-[#111] mb-3">{practice.title}</h3>
                  <p className="text-[#4b5563] text-sm leading-[1.7] mb-6">{practice.body}</p>
                  <Link href="/practices" className="text-[0.85rem] font-bold uppercase tracking-wide text-[#0098d9] flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    Open practice <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Impact */}
        {path === "/impact" && (
          <>
            <div className="mb-16">
              <p className="eyebrow text-[#0098d9] mb-4">Program Impact</p>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111] mb-6">Evidence That Matters</h2>
              <p className="text-[#4b5563] text-lg leading-[1.8]">
                PTR Alumni Network's impact is measured through verified indicators: teacher participation, school engagement, learner outcomes, and documented practice improvements. All figures are reviewed and approved before publication.
              </p>
            </div>

            {/* Key Statistics */}
            <div className="grid gap-6 md:grid-cols-3 mb-16">
              {[
                { label: "Resident Teachers", value: "100", detail: "Active residents in the network", icon: UsersRound },
                { label: "Model Schools", value: "17", detail: "Partner schools across Rwanda", icon: School },
                { label: "Teacher Participation", value: "86%", detail: "Meet or exceed expectations", icon: CheckCircle2 },
                { label: "School Participation", value: "72%", detail: "Schools actively engaged", icon: Globe2 },
                { label: "Practice Sharing", value: "64%", detail: "Documented practices shared", icon: Sparkles },
                { label: "Zero Attrition", value: "0%", detail: "Residents retained in pilot year", icon: Clock },
              ].map((stat, index) => (
                <div key={index} className="border rounded-xl bg-white p-6 shadow-sm text-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 bg-[#e0f2fe]`}>
                    <stat.icon className="size-5 text-[#0098d9]" />
                  </div>
                  <p className="text-2xl font-extrabold text-[#111]">{stat.value}</p>
                  <p className="text-sm font-bold text-[#0098d9] mb-1">{stat.label}</p>
                  <p className="text-xs text-[#6b7280]">{stat.detail}</p>
                </div>
              ))}
            </div>

            {/* Impact Stories */}
            <div className="mb-16">
              <p className="eyebrow text-[#0098d9] mb-4">Impact Stories</p>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111] mb-8">Stories from the Network</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { title: "Resilient classrooms", body: "A resident teacher's first year of mentorship transformed classroom practice — and learner results." },
                  { title: "From observation to leadership", body: "Peer coaching circles helped residents share strategies that work across Rwanda's schools." },
                  { title: "Technology in every lesson", body: "ICT integration training equipped residents to bring digital tools to resource-limited classrooms." },
                ].map((story, index) => (
                  <div key={index} className="border rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-extrabold tracking-[-0.02em] text-[#111] mb-3">{story.title}</h3>
                    <p className="text-[#4b5563] text-sm leading-[1.7]">{story.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Data Note */}
            <div className="bg-[#f8fafc] rounded-xl p-8 border border-[#e2eef0]">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="size-5 text-[#0098d9] mt-0.5" />
                <div>
                  <h3 className="font-extrabold text-lg text-[#111] mb-2">Data Integrity</h3>
                  <p className="text-[#4b5563] text-sm leading-[1.7]">
                    All impact figures are verified by authorized PTR Alumni Network administrators. No fabricated statistics or unsupported causal claims are published.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Gallery */}
        {path === "/gallery" && (
          <>
            <div className="mb-16">
              <p className="eyebrow text-[#0098d9] mb-4">Program Gallery</p>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111] mb-6">A Window Into the Work</h2>
              <p className="text-[#4b5563] text-lg leading-[1.8]">
                Approved photos and videos from classroom moments, professional learning sessions, school events, and network gatherings across PTR Alumni Network's model schools.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Classroom practice", caption: "Learning in motion", gradient: "from-[#0d2b55] via-[#1e5aa3] to-[#7bc2a3]" },
                { label: "Professional learning", caption: "Teachers learning together", gradient: "from-[#122b49] via-[#315f6a] to-[#e0a74e]" },
                { label: "School community", caption: "A network with purpose", gradient: "from-[#0d2b55] via-[#5c3d75] to-[#e7834c]" },
                { label: "Evidence & impact", caption: "From activity to insight", gradient: "from-[#183c55] via-[#1f7c70] to-[#8cc7a6]" },
                { label: "Mentorship circles", caption: "Teachers supporting teachers", gradient: "from-[#0d2b55] via-[#1e5aa3] to-[#7bc2a3]" },
                { label: "School events", caption: "Community gatherings", gradient: "from-[#122b49] via-[#315f6a] to-[#e0a74e]" },
              ].map((item, index) => (
                <Link
                  key={index}
                  href="/gallery"
                  className="block rounded-xl overflow-hidden group"
                >
                  <div className="relative h-48">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="eyebrow text-white/90 text-[0.75rem]">{item.label}</span>
                      <p className="text-white font-extrabold text-lg mt-1">{item.caption}</p>
                    </div>
                    <ArrowUpRight className="absolute top-4 right-4 size-5 text-white/70 group-hover:text-[#38bdf8] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* News */}
        {path === "/news" && (
          <>
            <div className="mb-16">
              <p className="eyebrow text-[#0098d9] mb-4">News & Announcements</p>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111] mb-6">Latest from the PTR Alumni Network</h2>
              <p className="text-[#4b5563] text-lg leading-[1.8]">
                Program announcements, school updates, resident teacher experiences, interviews, recognition, and events from across the network.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "100 Teacher Residents Complete One-Year Pilot",
                  date: "5 August 2024",
                  body: "The commissioning ceremony celebrated 100 Teacher Residents concluding a successful one-year pilot in evidence-based pedagogy and school practice.",
                  category: "Announcement",
                },
                {
                  title: "LSI Reports Encouraging Results",
                  date: "27 June 2024",
                  body: "Florida State University's Learning Systems Institute reports positive outcomes from the Primary Teaching Residency Program in Rwanda.",
                  category: "Research",
                },
                {
                  title: "Resident Teacher Voices from the Network",
                  date: "2 November 2026",
                  body: "Resident teachers share their experiences and reflections from classrooms across Rwanda's model schools.",
                  category: "Story",
                },
              ].map((article, index) => (
                <div key={index} className="border rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <span className={`text-[0.75rem] font-bold uppercase tracking-wide ${index === 0 ? "text-[#0098d9]" : "text-[#6b7280]"}`}>
                    {article.category}
                  </span>
                  <p className="text-[0.8rem] text-[#6b7280] mb-3">{article.date}</p>
                  <h3 className="text-lg font-extrabold tracking-[-0.02em] text-[#111] mb-3">{article.title}</h3>
                  <p className="text-[#4b5563] text-sm leading-[1.7] mb-6">{article.body}</p>
                  <Link href="/news" className="text-[0.85rem] font-bold uppercase tracking-wide text-[#0098d9] flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    Read story <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Resources */}
        {path === "/resources" && (
          <>
            <div className="mb-16">
              <p className="eyebrow text-[#0098d9] mb-4">Teaching Resources</p>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111] mb-6">Materials Ready to Share</h2>
              <p className="text-[#4b5563] text-lg leading-[1.8]">
                A searchable library of lesson plans, teaching materials, videos, reports, research, training documents, and best-practice guides for resident teachers and mentor teachers.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mb-12">
              {["All", "Lesson Plans", "Teaching Materials", "Handbooks"].map((filterLabel) => (
                <button
                  key={filterLabel}
                  onClick={() => setResourceFilter(filterLabel)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                    resourceFilter === filterLabel ? "bg-[#0098d9] text-white" : "bg-[#f8fafc] border border-[#e2eef0] text-[#4b5563] hover:bg-[#e0f2fe]"
                  }`}
                >
                  {filterLabel}
                </button>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                { title: "Learner-Centred Lesson Plan Template", type: "Lesson Plan", category: "Pedagogy", group: "Lesson Plans", file: "PDF · 2 pages" },
                { title: "ICT Integration Quick Start Guide", type: "Guide", category: "Digital Literacy", group: "Teaching Materials", file: "PDF · 5 pages" },
                { title: "Formative Assessment Toolkit", type: "Toolkit", category: "Assessment", group: "Teaching Materials", file: "PDF · 8 pages" },
                { title: "Inclusive Education Strategies", type: "Guide", category: "Inclusion", group: "Teaching Materials", file: "PDF · 6 pages" },
                { title: "STEM Teaching with Local Materials", type: "Activity Book", category: "STEM", group: "Teaching Materials", file: "PDF · 12 pages" },
                { title: "Mentor Teacher Handbook", type: "Handbook", category: "Mentorship", group: "Handbooks", file: "PDF · 20 pages" },
              ].filter((resource) => resourceFilter === "All" || resource.group === resourceFilter).map((resource, index) => (
                <div key={index} className="border rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[0.75rem] font-bold uppercase tracking-wide text-[#6b7280]">{resource.type}</span>
                    <BookOpen className="size-5 text-[#0098d9]" />
                  </div>
                  <h3 className="text-lg font-extrabold tracking-[-0.02em] text-[#111] mb-3">{resource.title}</h3>
                  <p className="text-xs text-[#6b7280] mb-4">{resource.category} · {resource.file}</p>
                  <Link href="/resources" className="text-[0.85rem] font-bold uppercase tracking-wide text-[#0098d9] flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    Download <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Contact */}
        {path === "/contact" && (
          <>
            <div className="grid gap-12 lg:grid-cols-[1fr_0.6fr]">
              {/* Contact Form */}
              <div className="space-y-8">
                <div>
                  <p className="eyebrow text-[#0098d9] mb-4">Send Us a Message</p>
                  <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111] mb-6">{copy.en.contact.title}</h2>
                  <p className="text-[#4b5563] text-lg leading-[1.8] mb-8">{copy.en.contact.intro}</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className="px-4 py-3 border border-[#d1d5db] rounded-lg text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Email Address</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="px-4 py-3 border border-[#d1d5db] rounded-lg text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Subject</label>
                    <input
                      type="text"
                      placeholder="What would you like to discuss?"
                      className="px-4 py-3 border border-[#d1d5db] rounded-lg text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Message</label>
                    <textarea
                      rows={5}
                      placeholder="Tell us about your question, partnership idea, or request..."
                      className="px-4 py-3 border border-[#d1d5db] rounded-lg text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <button type="submit" className="button-primary w-full">
                    {copy.en.contact.cta}
                  </button>
                </form>
              </div>

              {/* Contact Details */}
              <div className="space-y-8">
                <div className="bg-[#f8fafc] rounded-xl p-8 border border-[#e2eef0]">
                  <p className="eyebrow text-[#0098d9] mb-4">Contact PTR Alumni Network</p>
                  <h3 className="text-xl font-extrabold text-[#111] mb-6">Get in Touch</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="size-5 text-[#0098d9] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#6b7280] mb-1">Address</p>
                        <p className="text-[#4b5563] text-sm leading-[1.6]">{copy.en.contact.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Mail className="size-5 text-[#0098d9] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#6b7280] mb-1">Email</p>
                        <p className="text-[#4b5563] text-sm leading-[1.6]"><a href="mailto:info@ptr.rw" className="text-[#0098d9] hover:underline">{copy.en.contact.email}</a></p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Phone className="size-5 text-[#0098d9] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#6b7280] mb-1">Phone</p>
                        <p className="text-[#4b5563] text-sm leading-[1.6]"><a href="tel:+250788123456" className="text-[#0098d9] hover:underline">{copy.en.contact.phone}</a></p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Clock className="size-5 text-[#0098d9] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#6b7280] mb-1">Office Hours</p>
                        <p className="text-[#4b5563] text-sm leading-[1.6]">{copy.en.contact.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f8fafc] rounded-xl p-8 border border-[#e2eef0]">
                  <p className="eyebrow text-[#0098d9] mb-4">Partnerships</p>
                  <h3 className="text-xl font-extrabold text-[#111] mb-6">Partner With PTR Alumni Network</h3>
                  <p className="text-[#4b5563] text-sm leading-[1.7] mb-6">
                    PTR Alumni Network welcomes partnerships with schools, organizations, and education stakeholders who share our commitment to improving teaching practice in Rwanda.
                  </p>
                  <div className="space-y-4">
                    <p className="text-[#4b5563] text-sm leading-[1.6]">• School partnerships and model school placement</p>
                    <p className="text-[#4b5563] text-sm leading-[1.6]">• Mentor teacher training and support</p>
                    <p className="text-[#4b5563] text-sm leading-[1.6]">• Research and impact evaluation collaboration</p>
                    <p className="text-[#4b5563] text-sm leading-[1.6]">• Resource development and sharing</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

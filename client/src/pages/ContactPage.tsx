import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  AtSign,
  CheckCircle2,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Music2,
  Phone,
  Send,
  UsersRound,
  Youtube,
} from "lucide-react";
import { Link } from "wouter";
import { PageHero } from "@/components/ptrp/PageHero";
import { SectionHeading } from "@/components/ptrp/SectionHeading";
import { hostColleges, joinContent, socialLinks } from "@/data/ptrp";

const socialIcons: Record<string, typeof AtSign> = {
  youtube: Youtube,
  tiktok: Music2,
  instagram: Instagram,
  facebook: Facebook,
  threads: Send,
  linkedin: Linkedin,
  x: AtSign,
};

const initialForm = {
  name: "",
  email: "",
  phone: "",
  ttc: "",
  school: "",
  district: "",
  year: "2024",
  bio: "",
  consent: false,
};

type FormState = typeof initialForm;

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const mailtoHref = useMemo(() => {
    const subject = `PTR Alumni Network membership — ${form.name || "New member"}`;
    const body = [
      "PTR Alumni Network membership request",
      "",
      `Full name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || "Not provided"}`,
      `Host TTC: ${form.ttc || "Not provided"}`,
      `Model school: ${form.school || "Not provided"}`,
      `District: ${form.district || "Not provided"}`,
      `Graduation year: ${form.year}`,
      "",
      "Short bio:",
      form.bio || "Not provided",
      "",
      `Consent to appear in the alumni directory: ${form.consent ? "Yes" : "No"}`,
    ].join("\n");
    return `mailto:${joinContent.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [form]);

  const update = (field: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
    setSent(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = "Please enter a valid email address.";
    if (!form.ttc) nextErrors.ttc = "Please select your host TTC.";
    if (!form.consent) nextErrors.consent = "Please confirm consent before sending.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSent(true);
    window.location.href = mailtoHref;
  };

  return <main>
    <PageHero
      eyebrow="Join & Contact"
      title="Join the PTR Alumni Network."
      description="Are you a graduate of the Primary Teacher Residency Program? Join your fellow alumni to share ideas, find support, and be part of the story of improving education in Rwanda."
      image="/storage/ptrp-pilot-launch.jpg"
      imageAlt="PTRP contact - join the alumni network"
      imageCredit="Photo: MINEDUC · PTR Alumni Network"
    >
      <Link href="#join" className="button-primary">Start your membership <ArrowUpRight className="size-4" /></Link>
      <Link href="#contact-details" className="button-ghost-light">Contact details</Link>
    </PageHero>

    <section id="join" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          <div>
            <SectionHeading eyebrow="Membership" title="Be part of the network." />
            <p className="mt-6 text-[1.02rem] leading-[1.9] text-[#4b5563]">{joinContent.intro}</p>
            <div className="mt-8 space-y-3">
              {[
                "Connect with fellow PTRP graduates across Rwanda.",
                "Share lesson ideas, classroom practices, and resources.",
                "Receive invitations to alumni events and professional learning.",
                "Choose whether your profile appears in the public directory.",
              ].map((item) => <div key={item} className="flex items-start gap-3 text-sm leading-6 text-[#4b5563]">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#0098d9]" />{item}
              </div>)}
            </div>
            <div className="mt-8 flex items-start gap-3 border border-[#dce8ed] bg-[#f8fbfc] p-5">
              <Mail className="mt-0.5 size-5 shrink-0 text-[#0098d9]" />
              <div>
                <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-[#7b8da2]">How this form works</p>
                <p className="mt-2 text-sm leading-6 text-[#4b5563]">Submitting opens your email app with your details already filled in. Send the message to <a href={`mailto:${joinContent.contact.email}`} className="font-bold text-[#0098d9] hover:underline">{joinContent.contact.email}</a>. No data is stored on this website.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="border border-[#dce8ed] bg-white p-6 shadow-[0_24px_70px_rgba(11,35,71,0.08)] sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-[#e2eef0] pb-5">
              <div>
                <p className="eyebrow text-[#0098d9]">Alumni registration</p>
                <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-[-0.04em] text-[#0b2347]">Your details</h2>
              </div>
              <span className="border border-[#e2eef0] bg-[#f8fbfc] px-2.5 py-1 text-[0.56rem] font-extrabold uppercase tracking-[0.1em] text-[#60758c]">Reviewed by admin</span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-[#60758c]">Full name *</span>
                <input value={form.name} onChange={(event) => update("name", event.target.value)} type="text" autoComplete="name" placeholder="Your full name" aria-invalid={Boolean(errors.name)} className={`mt-2 w-full border bg-white px-3 py-2.5 text-sm text-[#0b2347] outline-none focus:border-[#0098d9] ${errors.name ? "border-[#c0392b]" : "border-[#d1d5db]"}`} />
                {errors.name && <span className="mt-1.5 block text-[0.68rem] font-semibold text-[#c0392b]">{errors.name}</span>}
              </label>

              <label className="block">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-[#60758c]">Email *</span>
                <input value={form.email} onChange={(event) => update("email", event.target.value)} type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} className={`mt-2 w-full border bg-white px-3 py-2.5 text-sm text-[#0b2347] outline-none focus:border-[#0098d9] ${errors.email ? "border-[#c0392b]" : "border-[#d1d5db]"}`} />
                {errors.email && <span className="mt-1.5 block text-[0.68rem] font-semibold text-[#c0392b]">{errors.email}</span>}
              </label>

              <label className="block">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-[#60758c]">Phone</span>
                <input value={form.phone} onChange={(event) => update("phone", event.target.value)} type="tel" autoComplete="tel" placeholder="Optional" className="mt-2 w-full border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#0b2347] outline-none focus:border-[#0098d9]" />
              </label>

              <label className="block">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-[#60758c]">Host TTC *</span>
                <select value={form.ttc} onChange={(event) => update("ttc", event.target.value)} aria-invalid={Boolean(errors.ttc)} className={`mt-2 w-full border bg-white px-3 py-2.5 text-sm font-semibold text-[#0b2347] outline-none focus:border-[#0098d9] ${errors.ttc ? "border-[#c0392b]" : "border-[#d1d5db]"}`}>
                  <option value="">Select your host college</option>
                  {hostColleges.map((college) => <option key={college.name} value={college.name}>{college.name}</option>)}
                </select>
                {errors.ttc && <span className="mt-1.5 block text-[0.68rem] font-semibold text-[#c0392b]">{errors.ttc}</span>}
              </label>

              <label className="block">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-[#60758c]">Graduation year</span>
                <select value={form.year} onChange={(event) => update("year", event.target.value)} className="mt-2 w-full border border-[#d1d5db] bg-white px-3 py-2.5 text-sm font-semibold text-[#0b2347] outline-none focus:border-[#0098d9]">
                  {["2024", "2025", "2026"].map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-[#60758c]">Model school</span>
                <input value={form.school} onChange={(event) => update("school", event.target.value)} type="text" placeholder="Your model school" className="mt-2 w-full border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#0b2347] outline-none focus:border-[#0098d9]" />
              </label>

              <label className="block">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-[#60758c]">District</span>
                <input value={form.district} onChange={(event) => update("district", event.target.value)} type="text" placeholder="Your district" className="mt-2 w-full border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#0b2347] outline-none focus:border-[#0098d9]" />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-[#60758c]">Short bio</span>
                <textarea value={form.bio} onChange={(event) => update("bio", event.target.value)} rows={4} placeholder="Tell the network about your teaching journey..." className="mt-2 w-full resize-y border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#0b2347] outline-none focus:border-[#0098d9]" />
              </label>
            </div>

            <label className="mt-5 flex items-start gap-3 border border-[#e2eef0] bg-[#f8fbfc] p-4">
              <input checked={form.consent} onChange={(event) => update("consent", event.target.checked)} type="checkbox" className="mt-0.5 size-4 shrink-0 accent-[#0098d9]" aria-invalid={Boolean(errors.consent)} />
              <span className="text-[0.78rem] leading-6 text-[#4b5563]">I consent to my name, school, and district appearing in the alumni directory after review. I understand I can request changes or removal at any time. *</span>
            </label>
            {errors.consent && <p className="mt-1.5 text-[0.68rem] font-semibold text-[#c0392b]">{errors.consent}</p>}

            <button type="submit" className="button-primary mt-6 w-full sm:w-auto">Send membership request <ArrowUpRight className="size-4" /></button>

            {sent && <div role="status" className="mt-5 flex items-start gap-3 border border-[#b7e4cd] bg-[#f0fbf5] p-4">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#168d6d]" />
              <p className="text-sm leading-6 text-[#256b52]">Your email app should open with your details. If it does not, email <a href={mailtoHref} className="font-bold underline">{joinContent.contact.email}</a> directly.</p>
            </div>}

            <p className="mt-5 text-[0.68rem] leading-6 text-[#9aabba]">Fields marked * are required. This site does not store form submissions. Photo uploads and profile publishing are managed by administrators after verification.</p>
          </form>
        </div>
      </div>
    </section>

    <section id="contact-details" className="scroll-mt-24 bg-[#f6fafb] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="Contact" title="Reach the network." body={joinContent.contact.note} />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <div className="border border-[#e2eef0] bg-white p-6">
            <span className="flex size-11 items-center justify-center bg-[#e0f2fe] text-[#0098d9]"><Mail className="size-5" /></span>
            <p className="mt-6 text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-[#7b8da2]">Email</p>
            <a href={`mailto:${joinContent.contact.email}`} className="mt-2 block text-lg font-extrabold tracking-[-0.02em] text-[#0098d9] hover:underline">{joinContent.contact.email}</a>
            <p className="mt-3 text-sm leading-6 text-[#4b5563]">Membership, partnerships, media requests, and corrections.</p>
          </div>
          <div className="border border-[#e2eef0] bg-white p-6">
            <span className="flex size-11 items-center justify-center bg-[#e0f2fe] text-[#0098d9]"><Phone className="size-5" /></span>
            <p className="mt-6 text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-[#7b8da2]">Phone</p>
            <p className="mt-2 text-lg font-extrabold tracking-[-0.02em] text-[#0b2347]">{joinContent.contact.phone}</p>
            <p className="mt-3 text-sm leading-6 text-[#4b5563]">A verified network phone line will be published once confirmed.</p>
          </div>
          <div className="border border-[#e2eef0] bg-white p-6">
            <span className="flex size-11 items-center justify-center bg-[#e0f2fe] text-[#0098d9]"><MapPin className="size-5" /></span>
            <p className="mt-6 text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-[#7b8da2]">Office</p>
            <p className="mt-2 text-sm font-bold leading-6 text-[#0b2347]">{joinContent.contact.address}</p>
            <p className="mt-3 flex items-center gap-2 text-sm leading-6 text-[#4b5563]"><Clock className="size-4 text-[#0098d9]" /> Response times to be confirmed.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6 border border-[#dce8ed] bg-[#0b2347] p-7 text-white sm:p-9 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow text-[#38bdf8]">Follow the network</p>
            <p className="mt-3 text-xl font-extrabold tracking-[-0.03em]">Classroom stories, events, and updates.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((social) => {
              const Icon = socialIcons[social.key] ?? AtSign;
              return <a key={social.key} href={social.href} target="_blank" rel="noreferrer" aria-label={`PTR Alumni Network on ${social.label}`} className="inline-flex items-center gap-2 border border-white/20 px-3 py-2 text-[0.64rem] font-extrabold uppercase tracking-[0.08em] text-white/75 transition-colors hover:border-[#38bdf8] hover:text-white">
                <Icon className="size-3.5" />{social.label}
              </a>;
            })}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="Before you write" title="Quick answers." />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            { question: "Who can join?", answer: "Graduates of the Primary Teacher Residency Program can join. Mentors, school leaders, and partners can contact us about supporting the network." },
            { question: "Does it cost anything?", answer: "Membership is free. The network exists to connect alumni and share practice, not to sell services." },
            { question: "Will my phone number be public?", answer: "No. Contact details are never published without your explicit consent. The directory is reviewed by an administrator." },
            { question: "How do I submit a story or photo?", answer: "Use the form above or email the network. Include a short description, date, school, and confirmation that you have permission to share the media." },
          ].map((item) => <div key={item.question} className="border border-[#e2eef0] bg-[#f8fbfc] p-6">
            <h3 className="text-base font-extrabold tracking-[-0.02em] text-[#0b2347]">{item.question}</h3>
            <p className="mt-2 text-sm leading-7 text-[#4b5563]">{item.answer}</p>
          </div>)}
        </div>
      </div>
    </section>

    <section className="cta-band py-16 md:py-20">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between md:px-8 lg:px-12">
        <div className="flex items-center gap-4">
          <UsersRound className="size-8 text-[#38bdf8]" />
          <div>
            <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.14em] text-[#38bdf8]">100 teachers · one network</p>
            <p className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-white">Inspire, Educate and Empower.</p>
          </div>
        </div>
        <Link href="/alumni" className="button-ghost-light">Meet the alumni <ArrowUpRight className="size-4" /></Link>
      </div>
    </section>
  </main>;
}

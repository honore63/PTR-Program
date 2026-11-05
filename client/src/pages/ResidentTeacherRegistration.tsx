import { useState } from "react";
import {
  Mail, Phone, Building2, GraduationCap, Briefcase, ImagePlus,
  CheckCircle2, AlertTriangle, UsersRound, ArrowUpRight, Image as ImageIcon,
} from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { bestPracticeCategories } from "@/data/ptrp";

export default function ResidentTeacherRegistration() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    modelSchool: "",
    position: "",
    bestPractice: "",
    bestPracticeDescription: "",
    subjects: "",
    skills: "",
    contributions: "",
    bio: "",
    photoUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!form.email.trim()) newErrors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Please enter a valid email address.";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^[\d\s\-\+\(\)]+$/.test(form.phone)) newErrors.phone = "Please enter a valid phone number.";
    if (!form.modelSchool.trim()) newErrors.modelSchool = "Model school is required.";
    if (!form.position.trim()) newErrors.position = "Professional role is required.";
    if (!form.bestPractice.trim()) newErrors.bestPractice = "Best practice area is required.";
    if (!form.bestPracticeDescription.trim()) newErrors.bestPracticeDescription = "Please describe your best practice.";
    if (!form.bio.trim()) newErrors.bio = "Professional biography is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG, and WebP images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(String(reader.result));
      setForm({ ...form, photoUrl: String(reader.result) });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const result = await apiRequest("resident-teachers/register", {
        method: "POST",
        body: { ...form },
      });
      toast.success("Registration submitted successfully! Your profile is pending administrator review.");
      setForm({
        fullName: "", email: "", phone: "", gender: "", modelSchool: "",
        position: "", bestPractice: "", bestPracticeDescription: "", subjects: "",
        skills: "", contributions: "", bio: "", photoUrl: "",
      });
      setPhotoPreview(null);
      setErrors({});
    } catch (err: any) {
      if (err.status === 409) {
        toast.error("A registration with this email already exists.");
      } else {
        toast.error(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6fafb]">
      <header className="border-b border-[#e2eef0] bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 h-[78px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="brand-mark bg-[#0098d9] border-2 border-[#0098d9] rounded-full flex items-center justify-center w-8 h-8">
              <GraduationCap className="size-5 text-white" />
            </span>
            <span className="text-[1.25rem] font-extrabold tracking-[-0.02em] text-[#0b2347]">PTR Alumni Network</span>
          </Link>
          <Link href="/" className="button-ghost-light">← Back to site</Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12 py-12 md:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.6fr] items-start">
          <div>
            <p className="eyebrow text-[#0098d9] mb-4">Join the Resident Teachers Directory</p>
            <h1 className="text-[2.5rem] md:text-[3.5rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#0b2347] mb-6">
              Register Your Profile
            </h1>
            <p className="text-[#4b5563] text-lg leading-[1.8] max-w-xl">
              Share your professional story with the PTR Alumni Network. Your registration will be reviewed by an administrator before it appears publicly.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                { icon: UsersRound, title: "Verified Directory", body: "Your profile will be reviewed and published by program administrators." },
                { icon: Briefcase, title: "Professional Showcase", body: "Highlight your best practice, contributions, and achievements." },
                { icon: ImagePlus, title: "Profile Photo", body: "Upload your professional photograph for your directory card." },
              ].map((item) => (
                <div key={item.title} className="border border-[#e2eef0] bg-white rounded-xl p-6">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#e0f2fe] text-[#0098d9] mb-4">
                    <item.icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-extrabold tracking-[-0.03em] text-[#0b2347]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#4b5563]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 md:p-8 border border-[#e2eef0] shadow-sm">
            <h2 className="mb-6 text-2xl font-extrabold text-[#0b2347]">Registration Form</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Details */}
              <fieldset className="border border-[#e2eef0] rounded-xl p-6">
                <legend className="px-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#0098d9]">Personal Details</legend>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Full Name <span className="text-[#e11d48]">*</span></label>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Honore Tuyishime"
                      className={`px-4 py-2.5 rounded-lg border text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all ${errors.fullName ? "border-red-500" : "border-[#d1d5db]"}`}
                    />
                    {errors.fullName && <p className="text-[0.6rem] text-red-600">{errors.fullName}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Email Address <span className="text-[#e11d48]">*</span></label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="tuyishimehonore63@gmail.com"
                      className={`px-4 py-2.5 rounded-lg border text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all ${errors.email ? "border-red-500" : "border-[#d1d5db]"}`}
                    />
                    {errors.email && <p className="text-[0.6rem] text-red-600">{errors.email}</p>}
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Phone Number <span className="text-[#e11d48]">*</span></label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="0791684429"
                    className={`px-4 py-2.5 rounded-lg border text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all ${errors.phone ? "border-red-500" : "border-[#d1d5db]"}`}
                  />
                  {errors.phone && <p className="text-[0.6rem] text-red-600">{errors.phone}</p>}
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="px-4 py-2.5 rounded-lg border border-[#d1d5db] text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </fieldset>

              {/* Photo Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Profile Photograph</label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile preview" className="w-24 h-24 rounded-full object-cover border-2 border-[#0098d9]" />
                    ) : (
                      <div className="w-24 h-24 rounded-full flex items-center justify-center bg-[#f8fafc] border-2 border-[#cbd5e1] text-[#64748b]">
                        <ImageIcon className="size-8" />
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#0098d9] text-white cursor-pointer hover:bg-[#007ab0] transition-all">
                      <ImagePlus className="size-4" />
                      <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handlePhotoChange} className="hidden" />
                    </label>
                  </div>
                  <p className="text-[0.6rem] text-[#64748b]">JPG, JPEG, PNG, or WebP. Max 5 MB.</p>
                </div>
              </div>

              {/* Professional Information */}
              <fieldset className="border border-[#e2eef0] rounded-xl p-6">
                <legend className="px-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#0098d9]">Professional Information</legend>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Model School <span className="text-[#e11d48]">*</span></label>
                    <input
                      type="text"
                      required
                      value={form.modelSchool}
                      onChange={(e) => setForm({ ...form, modelSchool: e.target.value })}
                      placeholder="Rukara Model School"
                      className={`px-4 py-2.5 rounded-lg border text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all ${errors.modelSchool ? "border-red-500" : "border-[#d1d5db]"}`}
                    />
                    {errors.modelSchool && <p className="text-[0.6rem] text-red-600">{errors.modelSchool}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Professional Role <span className="text-[#e11d48]">*</span></label>
                    <input
                      type="text"
                      required
                      value={form.position}
                      onChange={(e) => setForm({ ...form, position: e.target.value })}
                      placeholder="Program Designer, ICT Practitioner, Website Manager"
                      className={`px-4 py-2.5 rounded-lg border text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all ${errors.position ? "border-red-500" : "border-[#d1d5db]"}`}
                    />
                    {errors.position && <p className="text-[0.6rem] text-red-600">{errors.position}</p>}
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Best Practice Area <span className="text-[#e11d48]">*</span></label>
                  <select
                    required
                    value={form.bestPractice}
                    onChange={(e) => setForm({ ...form, bestPractice: e.target.value })}
                    className={`px-4 py-2.5 rounded-lg border text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all ${errors.bestPractice ? "border-red-500" : "border-[#d1d5db]"}`}
                  >
                    <option value="">Select a category</option>
                    {bestPracticeCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  {errors.bestPractice && <p className="text-[0.6rem] text-red-600">{errors.bestPractice}</p>}
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Best Practice Description <span className="text-[#e11d48]">*</span></label>
                  <textarea
                    required
                    value={form.bestPracticeDescription}
                    onChange={(e) => setForm({ ...form, bestPracticeDescription: e.target.value })}
                    rows={4}
                    placeholder="Describe your best practice in education..."
                    className={`px-4 py-2.5 rounded-lg border text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all ${errors.bestPracticeDescription ? "border-red-500" : "border-[#d1d5db]"}`}
                  />
                  {errors.bestPracticeDescription && <p className="text-[0.6rem] text-red-600">{errors.bestPracticeDescription}</p>}
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Teaching Subjects / Specialization</label>
                  <input
                    type="text"
                    value={form.subjects}
                    onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                    placeholder="ICT, Educational Technology, Digital Literacy"
                    className="px-4 py-2.5 rounded-lg border border-[#d1d5db] text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Skills &amp; Professional Interests</label>
                  <input
                    type="text"
                    value={form.skills}
                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                    placeholder="ICT Integration, Lesson Planning, Web Development"
                    className="px-4 py-2.5 rounded-lg border border-[#d1d5db] text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Program Contributions &amp; Achievements</label>
                  <textarea
                    value={form.contributions}
                    onChange={(e) => setForm({ ...form, contributions: e.target.value })}
                    rows={3}
                    placeholder="Designed the 21st Century Lesson Plan Generator..."
                    className="px-4 py-2.5 rounded-lg border border-[#d1d5db] text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Professional Biography <span className="text-[#e11d48]">*</span></label>
                  <textarea
                    required
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={5}
                    placeholder="Tell us about your work in education..."
                    className={`px-4 py-2.5 rounded-lg border text-sm text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all ${errors.bio ? "border-red-500" : "border-[#d1d5db]"}`}
                  />
                  {errors.bio && <p className="text-[0.6rem] text-red-600">{errors.bio}</p>}
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={submitting}
                className="button-primary w-full py-4 font-bold text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting…" : "Submit Registration"}
              </button>
              <p className="mt-3 text-[0.65rem] text-[#64748b] text-center">
                Your registration will be reviewed by an administrator. You will be notified when your profile is approved and published.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

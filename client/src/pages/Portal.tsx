import { ArrowLeft, ShieldCheck, UsersRound, Instagram, Facebook, Send, Youtube, Linkedin, Music2, AtSign } from "lucide-react";
import { Link } from "wouter";
import { copy, socialLinks, type Language } from "@/data/ptrp";
import { BrandMark } from "@/components/ptrp/BrandMark";

type PortalProps = { language: Language };

export default function Portal({ language }: PortalProps) {
  const t = copy[language];
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#e2eef0] bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 h-[78px] flex items-center justify-between">
          <BrandMark />
          <Link href="/" className="button-primary text-sm px-4 py-2">
            ← Back to site
          </Link>
        </div>
      </header>

      {/* Login Content */}
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12 py-20 md:py-28 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.6fr] items-start">
          
          {/* Left: Info */}
          <div className="space-y-8">
            <div>
              <p className="eyebrow text-[#0098d9] mb-4">Secure program workspace</p>
              <h1 className="text-[3rem] md:text-[4rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#111] mb-6">
                Enter the PTR Alumni Network
              </h1>
              <p className="text-[#4b5563] text-lg leading-[1.8] max-w-xl">
                One trusted space for resident teachers, school coordinators, and administrators
                to share what is happening in classrooms across Rwanda.
              </p>
            </div>

            {/* Network stats */}
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { number: "100", label: "Resident teachers" },
                { number: "17", label: "Model schools" },
                { number: "1", label: "Connected network" },
              ].map((stat, index) => (
                <div key={index} className="bg-[#f8fafc] rounded-xl p-6 border border-[#e2eef0]">
                  <p className="text-2xl font-extrabold text-[#0098d9]">{stat.number}</p>
                  <p className="text-sm font-bold text-[#4b5563] uppercase tracking-wide mt-2">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#f8fafc] rounded-xl p-8 border border-[#e2eef0] mt-8">
              <p className="eyebrow text-[#0098d9] mb-4">Who can access</p>
              <ul className="space-y-4 text-[#4b5563] leading-[1.8]">
                <li className="flex items-start gap-3">
                  <UsersRound className="size-4 text-[#0098d9] mt-0.5 flex-shrink-0" />
                  <span>Resident teachers placed in model schools</span>
                </li>
                <li className="flex items-start gap-3">
                  <UsersRound className="size-4 text-[#0098d9] mt-0.5 flex-shrink-0" />
                  <span>Mentor teachers and school coordinators</span>
                </li>
                <li className="flex items-start gap-3">
                  <UsersRound className="size-4 text-[#0098d9] mt-0.5 flex-shrink-0" />
                  <span>Authorized PTR Alumni Network administrators</span>
                </li>
              </ul>
            </div>

            {/* Alumni Network Platforms */}
            <div className="bg-[#f8fafc] rounded-xl p-8 border border-[#e2eef0] mt-8">
              <p className="eyebrow text-[#0098d9] mb-4">PTR Alumni Network Platforms</p>
              <div className="space-y-4">
                {socialLinks.map((social) => {
                  const IconMap: Record<string, typeof Instagram | typeof Facebook | typeof Send | typeof Youtube | typeof Linkedin | typeof Music2 | typeof AtSign> = {
                    instagram: Instagram,
                    facebook: Facebook,
                    threads: Send,
                    youtube: Youtube,
                    linkedin: Linkedin,
                    tiktok: Music2,
                    x: AtSign,
                  };
                  const Icon = IconMap[social.key];
                  return (
                    <div key={social.key} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#e2eef0] hover:border-[#0098d9] transition-border">
                      <Icon className="size-5 text-[#0098d9]" />
                      <div>
                        <p className="text-sm font-bold text-[#111]">{social.label}</p>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[#0098d9] hover:underline break-all"
                        >
                          {social.href.replace(/https?:\/\/(www\.)?/, "")}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="bg-[#f8fafc] rounded-xl p-8 border border-[#e2eef0] shadow-sm">
            <BrandMark compact />
            <p className="eyebrow text-[#0098d9] mb-4 mt-4">Welcome back</p>
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-[#111] mb-6">Sign in to continue</h2>
            
            <div className="bg-white rounded-lg p-6 border border-[#d1d5db] shadow-sm mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-[#0098d9]" />
                  <span className="text-xs font-bold uppercase tracking-wide text-[#6b7280]">Secure access</span>
                </div>
              </div>
              
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Email address</label>
                  <input
                    type="email"
                    placeholder="name@school.rw"
                    className="px-4 py-3 border border-[#d1d5db] rounded-lg text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-[#4b5563]">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="px-4 py-3 border border-[#d1d5db] rounded-lg text-[#111] focus:ring-2 focus:ring-[#0098d9] focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-[#d1d5db] text-[#0098d9] focus:ring-[#0098d9]" />
                    <span className="text-xs text-[#4b5563]">Remember me</span>
                  </label>
                  <Link href="/" className="text-xs font-bold text-[#0098d9]">Forgot password?</Link>
                </div>
                
                <button type="submit" className="button-primary w-full py-3">
                  Sign in
                </button>
              </form>
            </div>

            <div className="border-t border-[#e2eef0] pt-6">
              <p className="text-xs text-[#6b7280] text-center mb-4">
                Don't have an account? Contact your school coordinator to request access.
              </p>
              <Link href="/" className="block text-center text-xs font-bold text-[#0098d9] hover:underline">
                Return to public site →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

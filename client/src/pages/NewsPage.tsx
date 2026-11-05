import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, CalendarDays, Filter, MessageCircle, Search, Sparkles, Video } from "lucide-react";
import { Link } from "wouter";
import { PageHero } from "@/components/ptrp/PageHero";
import { SectionHeading } from "@/components/ptrp/SectionHeading";
import { apiRequest } from "@/lib/api";
import { newsCategories, newsIdeas, newsPosts } from "@/data/ptrp";

type NewsPost = (typeof newsPosts)[number];

function mapApiPost(post: any): NewsPost {
  return {
    slug: post.slug,
    category: post.category,
    date: post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
      : new Date(post.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }),
    title: post.title,
    excerpt: post.excerpt ?? "",
    body: String(post.body ?? "").split(/\n+/).filter(Boolean),
    hashtags: [],
  } as NewsPost;
}

const categoryIcons: Record<string, typeof MessageCircle> = {
  Events: CalendarDays,
  Training: Sparkles,
  "Success Stories": MessageCircle,
  Announcements: Filter,
  Videos: Video,
};

export default function NewsPage() {
  const [apiPosts, setApiPosts] = useState<any[] | null>(null);

  useEffect(() => {

    let cancelled = false;
    apiRequest<any[]>("news").then((data) => { if (!cancelled) setApiPosts(data); }).catch((e) => { console.error("NEWS fetch error", e); });
    return () => { cancelled = true; };
  }, []);
  const posts: NewsPost[] = (apiPosts && apiPosts.length) ? apiPosts.map(mapApiPost) : newsPosts;
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("");
  const articleRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!selectedSlug && posts.length) setSelectedSlug(posts[0].slug); }, [posts, selectedSlug]);

  const filtered = useMemo(() => posts.filter((post) => {
    const matchesCategory = category === "All" || post.category === category;
    const matchesQuery = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesCategory && matchesQuery;
  }), [posts, category, query]);

  const selected = posts.find((post) => post.slug === selectedSlug) ?? filtered[0] ?? posts[0];

  const choosePost = (slug: string) => {
    setSelectedSlug(slug);
    articleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return <main>
    <PageHero
      eyebrow="News & Activities"
      title="What We Are Doing"
      description="Events, training, success stories, announcements, and videos from the PTR Alumni Network. Follow the work of resident teachers, alumni, mentors, and model schools across Rwanda."
      image="/manus-storage/ptrp-residents-2.jpg"
      imageAlt="PTRP residents during a residency session"
      imageCredit="Photo: MINEDUC"
    >
      <Link href="#updates" className="button-primary">Read the latest <ArrowUpRight className="size-4" /></Link>
      <Link href="/contact" className="button-ghost-light">Share a story</Link>
    </PageHero>

    <section id="updates" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <SectionHeading eyebrow="Latest updates" title="Stories from the network." body="Filter by category or search the archive. Every published update is reviewed before it appears here." />

        <div className="mt-8 flex flex-col gap-4 border border-[#e2eef0] bg-[#f8fbfc] p-4">
          <div className="flex flex-wrap gap-2">
            {newsCategories.map((item) => <button key={item} type="button" onClick={() => { setCategory(item); const first = posts.find((post) => item === "All" || post.category === item); if (first) setSelectedSlug(first.slug); }} className={`border px-3 py-2 text-[0.66rem] font-extrabold uppercase tracking-[0.08em] transition-colors ${category === item ? "border-[#0098d9] bg-[#0098d9] text-white" : "border-[#d1d5db] bg-white text-[#4b5563] hover:border-[#0098d9] hover:text-[#0098d9]"}`}>{item}</button>)}
          </div>
          <label className="flex items-center gap-3 border border-[#d1d5db] bg-white px-3 py-2.5">
            <Search className="size-4 text-[#0098d9]" />
            <span className="sr-only">Search updates</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search news and activities..." className="w-full bg-transparent text-sm text-[#0b2347] outline-none placeholder:text-[#9aabba]" />
          </label>
        </div>

        {selected && <div ref={articleRef} className="mt-8 grid scroll-mt-28 gap-8 border border-[#dce8ed] bg-white p-6 shadow-[0_20px_60px_rgba(11,35,71,0.08)] lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
          <div className="flex flex-col justify-between border border-[#e2eef0] bg-[#0b2347] p-6 text-white sm:p-8">
            <div>
              <p className="eyebrow text-[#38bdf8]">Featured update</p>
              <div className="mt-5 flex items-center gap-3 text-[0.64rem] font-bold uppercase tracking-[0.1em] text-white/45"><CalendarDays className="size-4 text-[#38bdf8]" />{selected.date}</div>
              <h2 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-[-0.045em]">{selected.title}</h2>
              <p className="mt-5 text-sm leading-7 text-white/60">{selected.excerpt}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">{selected.hashtags.map((tag) => <span key={tag} className="border border-white/15 px-2.5 py-1 text-[0.58rem] font-bold text-white/55">{tag}</span>)}</div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3 border-b border-[#e2eef0] pb-5"><span className="bg-[#e0f2fe] px-3 py-1.5 text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-[#007ab0]">{selected.category}</span><span className="text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[#8a9bab]">PTR Alumni Network</span></div>
            <div className="mt-6 space-y-4">{selected.body.map((paragraph) => <p key={paragraph} className="text-[0.98rem] leading-[1.9] text-[#4b5563]">{paragraph}</p>)}</div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#e2eef0] pt-5">
              <span className="text-[0.66rem] font-bold uppercase tracking-[0.08em] text-[#7b8da2]">Published by the PTR Alumni Network</span>
              <Link href="/contact" className="inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">Submit a correction <ArrowUpRight className="size-4" /></Link>
            </div>
          </div>
        </div>}

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {filtered.map((post) => {
            const Icon = categoryIcons[post.category] ?? MessageCircle;
            return <button key={post.slug} type="button" onClick={() => choosePost(post.slug)} className={`group flex h-full flex-col border bg-white p-6 text-left transition-all hover:border-[#0098d9] hover:shadow-lg ${selected?.slug === post.slug ? "border-[#0098d9]" : "border-[#e2eef0]"}`}>
              <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]"><Icon className="size-3.5" />{post.category}</span><span className="text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[#8a9bab]">{post.date}</span></div>
              <h3 className="mt-4 text-xl font-extrabold leading-tight tracking-[-0.03em] text-[#0b2347] group-hover:text-[#0098d9]">{post.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-[#4b5563]">{post.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">{selected?.slug === post.slug ? "Reading now" : "Read update"} <ArrowUpRight className="size-4" /></span>
            </button>;
          })}
        </div>
        {filtered.length === 0 && <div className="mt-10 border border-dashed border-[#d1d5db] bg-[#f8fbfc] p-10 text-center"><MessageCircle className="mx-auto size-8 text-[#0098d9]" /><p className="mt-4 text-sm font-bold text-[#0b2347]">No updates match that search.</p><button type="button" onClick={() => { setCategory("All"); setQuery(""); }} className="mt-3 text-[0.7rem] font-extrabold uppercase tracking-[0.1em] text-[#0098d9]">Clear filters</button></div>}
      </div>
    </section>

    <section className="bg-[#f6fafb] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Coming up" title="What the network is working on next." body="These are the themes the PTR Alumni Network will document as the community grows." />
            <div className="mt-7 flex flex-wrap gap-2">{newsCategories.filter((item) => item !== "All").map((item) => <span key={item} className="border border-[#dce8ed] bg-white px-3 py-2 text-[0.64rem] font-extrabold uppercase tracking-[0.08em] text-[#264665]">{item}</span>)}</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {newsIdeas.map((idea, index) => <div key={idea} className="flex items-start gap-3 border border-[#e2eef0] bg-white p-4"><span className="flex size-7 shrink-0 items-center justify-center bg-[#e0f2fe] text-[0.6rem] font-extrabold text-[#0098d9]">{String(index + 1).padStart(2, "0")}</span><p className="text-sm font-semibold leading-6 text-[#264665]">{idea}</p></div>)}
          </div>
        </div>
      </div>
    </section>

    <section className="cta-band py-16 md:py-20">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between md:px-8 lg:px-12">
        <div className="flex items-center gap-4"><MessageCircle className="size-8 text-[#38bdf8]" /><div><p className="text-[0.64rem] font-extrabold uppercase tracking-[0.14em] text-[#38bdf8]">Your story matters</p><p className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-white">Share a classroom update with the network.</p></div></div>
        <Link href="/contact" className="button-ghost-light">Submit an update <ArrowUpRight className="size-4" /></Link>
      </div>
    </section>
  </main>;
}

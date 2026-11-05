import {
  Activity,
  BookOpen,
  Camera,
  ChartNoAxesCombined,
  Globe2,
  Handshake,
  HeartHandshake,
  Lightbulb,
  MapPinned,
  MessageCircle,
  NotebookTabs,
  School,
  Sparkles,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Language = "en" | "rw" | "fr";

export const languages: Array<{ key: Language; label: string }> = [
  { key: "en", label: "EN" },
  { key: "rw", label: "RW" },
  { key: "fr", label: "FR" },
];

export const brand = {
  name: "PTR Alumni Network",
  shortName: "PTR",
  program: "Primary Teacher Residency Program",
  programShort: "PTRP",
  tagline: "Inspire, Educate and Empower.",
  subtitle: "Connecting Resident Teachers, Inspiring Educational Excellence",
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/network", label: "Model Schools" },
  { href: "/impact", label: "Impact" },
  { href: "/news", label: "News & Activities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/alumni", label: "Alumni" },
  { href: "/resources", label: "Resources" },
  { href: "/partners", label: "Partners" },
  { href: "/contact", label: "Join & Contact" },
];

export const socialLinks = [
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/resident_teachers?rpxt=c2JodHowYnAwM2Rj", icon: "instagram" },
  { key: "facebook", label: "Facebook", href: "https://facebook.com/resident.teachers", icon: "facebook" },
  { key: "threads", label: "Threads", href: "https://www.threads.com/@resident_teachers?invite=0", icon: "threads" },
  { key: "youtube", label: "YouTube", href: "https://youtube.com/@resident_teachers?si=87azMkfJPLWUEH4j", icon: "youtube" },
  { key: "linkedin", label: "LinkedIn", href: "https://shorturl.at/HIfYJ", icon: "linkedin" },
  { key: "x", label: "X", href: "https://x.com/teacheresidents/status/2117248052180500696?a=nhTm0_1GgrXAOnCVb1U&s=46", icon: "x" },
  { key: "tiktok", label: "TikTok", href: "https://vm.tiktok.com/ZS9ysnRnYFJEb-4sRbQ/", icon: "tiktok" },
];

export const officialPilot = {
  title: "Primary Teacher Residency pilot launched in Rwanda",
  date: "Kigali · 4 October 2023",
  body: "The official launch introduced a 12-month post-TTC residency for 100 selected graduates. The pilot focused on evidence-based pedagogy, 21st-century skills including English and digital literacy, and teaching practicum through demonstration schools.",
  partners: "Ministry of Education · REB · Rainwater Charitable Foundation · IEE Rwanda · Florida State University · Bridge 2 Rwanda",
  locations: "TTC Save in Gisagara District and TTC de la Salle Byumba in Gicumbi District, with 50 student teachers hosted at each institution.",
  sourceUrl: "https://www.mineduc.gov.rw/news-detail/primary-teacher-residency-pilot-program-for-ttcs-launched",
  image: "/storage/ptrp-pilot-launch.jpg",
  imageCredit: "Photo: MINEDUC",
};

export const officialSocialVideo = {
  title: "Muri Convention Center-Resident Teachers binjiranye ibyishimo",
  channel: "PTR Alumni Network",
  date: "2 November 2026",
  videoUrl: "https://youtu.be/kDFHWe75e-I",
  embedUrl: "https://www.youtube.com/embed/kDFHWe75e-I?rel=0",
};

export const socialProfileEvidence = {
  displayName: "PTR Alumni Network",
  handle: "resident_teachers",
  tiktokBio: "Founded in 2023 · Led by @rwanda_edu · 100 Resident Teachers · 12-months journey",
  tiktokUrl: "https://www.tiktok.com/@resident_teachers",
  xText: "The first cohort of Primary Teacher Resident Program @NESA_Rwanda @REBRwanda, we are pleasured to build our education system together with everyone",
  xUrl: "https://x.com/teacheresidents/status/2117248052180500696",
  xDate: "2 November 2026",
};

export const homeContent = {
  eyebrow: "PTR Alumni Network · Rwanda",
  headline: "Celebrating Excellence in Teacher Education",
  subheadline: "The alumni network of the Primary Teacher Residency Program (PTRP), working together for quality primary education in Rwanda.",
  intro: "The Primary Teacher Residency Program (PTRP) prepared 100 graduates of Teacher Training Colleges through a 12-month residency of classroom learning and guided practice in model schools. Today, these teachers are part of a growing alumni network that shares experience, supports one another, and shows the impact of investing in teachers.",
  buttons: {
    primary: "Join the Network",
    secondary: "Watch Our Story",
  },
  quote: "A nation that invests in its teachers invests in the future of its children.",
};

export const keyNumbers = [
  { value: 100, suffix: "", label: "Teacher Residents graduated", detail: "Cohort commissioned on 5 August 2024", icon: UsersRound, tone: "blue" },
  { value: 12, suffix: "", label: "Months of residency", detail: "Classroom learning and guided practice", icon: BookOpen, tone: "green" },
  { value: 17, suffix: "", label: "Model schools", detail: "Primary demonstration schools nationwide", icon: School, tone: "orange" },
  { value: 2, suffix: "", label: "Host TTCs", detail: "TTC Save and TTC de la Salle Byumba", icon: MapPinned, tone: "blue" },
  { value: 5, suffix: "", label: "Partner organizations", detail: "Plus the RAINWATER Foundation as supporting partner", icon: Handshake, tone: "green" },
];

export const programOverview = {
  title: "Primary Teacher Residency Program",
  whatIs: "PTRP is a 12-month program for graduates of Teacher Training Colleges (TTCs). It strengthens practical classroom skills and the implementation of Rwanda's Competency-Based Curriculum (CBC). It was launched as a pilot to show the value of investing in teachers and giving them the knowledge, practical skills, and confidence to respond to the diverse learning needs of pupils.",
  howItWorked: [
    { title: "40% classroom instruction", body: "Structured learning on teaching methods and professional skills." },
    { title: "60% guided teaching practice", body: "Hands-on teaching in primary demonstration (model) schools, with support from mentors." },
  ],
  learned: [
    { title: "Evidence-based pedagogy", body: "Student-centred learning, inquiry-based teaching, and differentiation to meet the needs of every pupil." },
    { title: "21st-century skills", body: "A strong focus on English language proficiency and digital literacy." },
    { title: "Intensive teaching practicums", body: "Real classroom experience under guidance." },
  ],
  received: [
    "Mentorship from tutors and mentors",
    "Dedicated laptops",
    "Guided practice in model schools",
  ],
  locations: [
    { name: "TTC Save", district: "Gisagara District", detail: "One of the two colleges that hosted the 100 residents." },
    { name: "TTC de la Salle Byumba", district: "Gicumbi District", detail: "The second host college for the residency year." },
  ],
  launchedBy: "The pilot was launched by the Ministry of Education together with the Rwanda Basic Education Board (REB), Florida State University's Learning Systems Institute (LSI), Inspire, Educate and Empower Rwanda (IEE), and Bridge2Rwanda, with the RAINWATER Foundation as a supporting partner.",
  timeline: [
    { date: "2023", title: "Residents begin the program", body: "The pilot launched in 2023. The exact start date is to be confirmed by program administrators." },
    { date: "12-month residency", title: "Classroom learning and guided practice", body: "Residents learn at TTC Save, TTC de la Salle Byumba, and the 17 model schools." },
    { date: "5 August 2024", title: "100 Primary Teacher Residents graduate", body: "The cohort is commissioned and begins teaching in schools across Rwanda." },
    { date: "Today", title: "Alumni support one another", body: "PTRP graduates teach in schools and continue to grow through the PTR Alumni Network." },
  ],
};

export const visionMission = {
  vision: "Quality education for every child in Rwanda, driven by well-prepared, professional, and passionate teachers.",
  mission: "To unite PTRP alumni so we can share best practices, support one another's professional growth, show the impact of the residency model, and keep improving learning outcomes for pupils.",
  objectives: [
    "Connect PTRP alumni across all districts.",
    "Share teaching practices, lesson ideas, and resources.",
    "Support continuous professional development.",
    "Document and share the story and impact of PTRP.",
    "Work with partners to strengthen teacher education in Rwanda.",
  ],
  values: [
    { title: "Dedication", body: "We commit fully to every learner." },
    { title: "Resilience", body: "We keep going and keep improving." },
    { title: "Professionalism", body: "We teach with skill and integrity." },
    { title: "Passion", body: "We love teaching and what it can change." },
    { title: "Collaboration", body: "We grow stronger together." },
  ],
  motto: "Inspire, Educate and Empower.",
};

export const impactContent = {
  headline: "From Residents to Education Leaders",
  paragraphs: [
    "On 5 August 2024, 100 Primary Teacher Residents graduated from PTRP. The commissioning ceremony was more than a graduation. It recognized dedication, resilience, professional growth, and a shared commitment to transforming the quality of primary education in Rwanda.",
    "The pilot showed why investing in teachers matters: when teachers are equipped with strong professional skills and confidence, they can respond better to the diverse needs of the pupils in their classrooms. For the graduates, this was not the end of a one-year program. It was the beginning of a greater journey toward educational excellence.",
  ],
  focusAreas: [
    { title: "Better teaching practice", body: "Student-centred, inquiry-based lessons and differentiation for pupils with different needs." },
    { title: "Stronger English", body: "Teachers with improved English language proficiency." },
    { title: "Digital skills", body: "Teachers able to use technology in learning." },
    { title: "Professional confidence", body: "Teachers ready for the realities of the classroom." },
  ],
  whereAlumniWork: {
    title: "Where our alumni work now",
    pending: true,
    body: "Schools and districts will be published here as alumni profiles are verified and approved.",
  },
  classroomResults: {
    title: "Results in classrooms",
    pending: true,
    body: "Data, examples, awards, and evidence of pupil progress will be published once verified by program administrators.",
  },
  stories: [
    { label: "Alumni story", title: "A photo and quote will appear here", body: "Each story will include the alumnus's name, school, district, and a short quote or video about how the residency changed their teaching." },
    { label: "Alumni story", title: "A photo and quote will appear here", body: "Alumni can submit their story through the network. The administrator reviews every submission before it is published." },
    { label: "Alumni story", title: "A photo and quote will appear here", body: "Stories will show the human impact of the residency model across Rwanda's primary schools." },
  ],
};

export const modelSchools = [
  { id: 1, name: "GS Matimba", district: "Nyagatare" },
  { id: 2, name: "GS Jean de la Mennais Kirambo", district: "Burera" },
  { id: 3, name: "GS Byumba Catholique", district: "Gicumbi" },
  { id: 4, name: "GS Bihinga", district: "Gatsibo" },
  { id: 5, name: "GS Akanzu", district: "Rwamagana" },
  { id: 6, name: "Rukara Model School", district: "Kayonza" },
  { id: 7, name: "GS Zaza A", district: "Ngoma" },
  { id: 8, name: "GS Mayange A", district: "Bugesera" },
  { id: 9, name: "GS St Jean Paul II", district: "Gisagara", note: "Recently called ES Save · district to confirm" },
  { id: 10, name: "GS St Laurent Cyahinda", district: "Nyaruguru" },
  { id: 11, name: "GS Mururu", district: "Rusizi" },
  { id: 12, name: "GS Uwinkomo", district: "Nyamagabe" },
  { id: 13, name: "GS Rubengera I", district: "Karongi" },
  { id: 14, name: "GS Muramba B", district: "Ngororero" },
  { id: 15, name: "GS St Etienne", district: "Muhanga" },
  { id: 16, name: "G.S Umubano I", district: "Rubavu" },
  { id: 17, name: "GS Nyarusange", district: "District to be confirmed", note: "District to confirm" },
];

export const hostColleges = [
  { name: "TTC Save", district: "Gisagara District", body: "One of the two colleges that hosted the residents." },
  { name: "TTC de la Salle Byumba", district: "Gicumbi District", body: "The second host college for the residency year." },
];

export const partners = [
  { name: "Ministry of Education", shortName: "MINEDUC", role: "Launched the pilot with partners", body: "Provided national leadership and coordination for the PTRP pilot.", url: "https://www.mineduc.gov.rw", logo: "/partners/mineduc.png" },
  { name: "Rwanda Basic Education Board", shortName: "REB", role: "National education partner and co-launcher of the pilot", body: "Supported curriculum alignment, school coordination, and quality assurance.", url: "https://www.reb.gov.rw", logo: "/partners/reb.png" },
  { name: "Florida State University, Learning Systems Institute", shortName: "FSU · LSI", role: "Academic and technical partner", body: "Contributed academic expertise, research, and technical support for the residency model.", url: "https://lsi.fsu.edu", logo: "/partners/fsu.png" },
  { name: "Inspire, Educate and Empower Rwanda", shortName: "IEE", role: "Implementing partner", body: "Supported implementation, training, and school-level delivery of the program.", url: "https://ieerwanda.org", logo: "/partners/iee.png" },
  { name: "Bridge2Rwanda", shortName: "B2R", role: "Program partner", body: "Contributed program development and partnership support.", url: "https://bridge2rwanda.org", logo: "/partners/bridge2rwanda.png" },
  { name: "RAINWATER Foundation", shortName: "RAINWATER", role: "Supporting partner", body: "Provided supporting funding and partnership for the pilot.", url: "https://rainwatercharitablefoundation.org", logo: "/partners/rainwater.png" },
];

export const newsPosts = [
  {
    slug: "celebrating-excellence-in-teacher-education",
    category: "Success Stories",
    date: "5 August 2024",
    title: "Celebrating Excellence in Teacher Education: The Success of the Primary Teacher Residency Program (PTRP)",
    excerpt: "On 5 August 2024, a remarkable milestone was celebrated in Rwanda's education sector as 100 Primary Teacher Residents graduated from the one-year Primary Teacher Residency Program.",
    body: [
      "On 5 August 2024, a remarkable milestone was celebrated in Rwanda's education sector as 100 Primary Teacher Residents graduated from the one-year Primary Teacher Residency Program.",
      "The commissioning ceremony was more than a celebration of graduation. It was a recognition of dedication, resilience, professional growth, and the collective commitment to transforming the quality of primary education in Rwanda.",
      "The successful completion of this pilot showed the importance of investing in teachers, strengthening professional competencies, and equipping educators with the knowledge, practical skills, and confidence to respond effectively to the diverse learning needs of pupils.",
      "Behind this achievement was a strong partnership involving the RAINWATER Foundation, Rwanda Basic Education Board (REB), Inspire, Educate and Empower Rwanda (IEE), Bridge2Rwanda, and Florida State University.",
      "Special recognition goes to the Teacher Residents, tutors, mentors, implementing partners, and all stakeholders. A nation that invests in its teachers invests in the future of its children. Together, let us continue to Inspire, Educate and Empower!",
    ],
    hashtags: ["#PTRP", "#PrimaryTeacherResidencyProgram", "#TeacherEducation", "#QualityEducation", "#TeacherProfessionalDevelopment", "#RwandaEducation", "#InvestInTeachers", "#TeachersMatter"],
  },
  {
    slug: "lsi-encouraging-results",
    category: "Announcements",
    date: "27 June 2024",
    title: "LSI reports encouraging results from the Primary Teacher Residency Program",
    excerpt: "Florida State University's Learning Systems Institute reported positive outcomes from the PTRP pilot, including strong performance in observed lessons and growth in literacy, mathematics, and science.",
    body: [
      "Florida State University's Learning Systems Institute reported encouraging results from the Primary Teacher Residency Program in Rwanda.",
      "More than 80 teacher residents received a performance rating of meets or exceeds expectations in all three observed lessons during term two.",
      "Residents continued to grow in literacy, mathematics, and science knowledge, skills, and attitudes, with increased confidence in teaching, English literacy, and ICT use.",
    ],
    hashtags: ["#PTRP", "#Research", "#TeacherEducation", "#RwandaEducation"],
  },
  {
    slug: "commissioning-ceremony-in-pictures",
    category: "Videos",
    date: "5 August 2024",
    title: "Commissioning ceremony in pictures and video",
    excerpt: "Relive the celebration as 100 Teacher Residents mark the end of their residency year and the beginning of their journey as PTRP alumni.",
    body: [
      "The commissioning ceremony brought together residents, tutors, mentors, partners, and education leaders to celebrate the first PTRP cohort.",
      "Photos and video from the day are being prepared for the gallery. Alumni can contribute approved media through the network.",
    ],
    hashtags: ["#PTRP", "#Commissioning", "#Alumni", "#TeachersMatter"],
  },
];

export const newsCategories = ["All", "Events", "Training", "Success Stories", "Announcements", "Videos"];

export const newsIdeas = [
  "Alumni meetings and regional meet-ups",
  "Classroom success stories",
  "Workshops and professional learning",
  "School visits and peer learning",
  "New members joining the network",
  "Partner news and announcements",
  "Teaching tips and practical resources",
];

export const galleryAlbums = [
  { title: "Graduation and Commissioning", date: "5 August 2024", body: "The first PTRP cohort celebrates the end of the residency year.", image: "/storage/ptrp-pilot-launch.jpg", credit: "Photo: MINEDUC", gradient: "from-[#0d2b55] via-[#1e5aa3] to-[#7bc2a3]" },
  { title: "Residency at TTC Save", date: "Gisagara District", body: "Classroom learning, mentorship, and guided practice at TTC Save.", image: "/storage/ptrp-residents-1.jpg", credit: "Photo: MINEDUC", gradient: "from-[#122b49] via-[#315f6a] to-[#e0a74e]" },
  { title: "Residency at TTC de la Salle Byumba", date: "Gicumbi District", body: "Residents learn and teach alongside mentors in Gicumbi.", image: "/storage/ptrp-residents-2.jpg", credit: "Photo: MINEDUC", gradient: "from-[#0d2b55] via-[#5c3d75] to-[#e7834c]" },
  { title: "Model School Practice", date: "17 model schools", body: "Real classroom experience in primary demonstration schools.", image: "/storage/ptrp-residents-3.jpg", credit: "Photo: MINEDUC", gradient: "from-[#183c55] via-[#1f7c70] to-[#8cc7a6]" },
  { title: "Training and Workshops", date: "Residency year", body: "Professional learning in pedagogy, English, digital literacy, and CBC implementation.", gradient: "from-[#0d2b55] via-[#1e5aa3] to-[#7bc2a3]" },
  { title: "Alumni Events", date: "Ongoing", body: "Meet-ups, peer learning, and network gatherings.", gradient: "from-[#122b49] via-[#315f6a] to-[#e0a74e]" },
  { title: "Video Stories", date: "Ongoing", body: "Alumni voices and classroom stories in their own words.", videoUrl: "https://youtu.be/kDFHWe75e-I", gradient: "from-[#0d2b55] via-[#5c3d75] to-[#e7834c]" },
];

export const galleryRules = [
  "Only upload content you have permission to share.",
  "Get consent before posting photos of pupils.",
  "Include a title, date, and school with every upload.",
  "All submissions are reviewed and approved by an administrator.",
];

export const alumniProfiles = [
  { name: "Alumni Profile 01", ttc: "TTC Save", school: "GS Matimba", district: "Nyagatare", year: "2024", bio: "Profile details will be published after the member completes and approves their profile.", demo: true },
  { name: "Alumni Profile 02", ttc: "TTC de la Salle Byumba", school: "GS Byumba Catholique", district: "Gicumbi", year: "2024", bio: "Profile details will be published after the member completes and approves their profile.", demo: true },
  { name: "Alumni Profile 03", ttc: "TTC Save", school: "GS St Jean Paul II", district: "Gisagara", year: "2024", bio: "Profile details will be published after the member completes and approves their profile.", demo: true },
  { name: "Alumni Profile 04", ttc: "TTC de la Salle Byumba", school: "GS St Etienne", district: "Muhanga", year: "2024", bio: "Profile details will be published after the member completes and approves their profile.", demo: true },
  { name: "Alumni Profile 05", ttc: "TTC Save", school: "GS Mururu", district: "Rusizi", year: "2024", bio: "Profile details will be published after the member completes and approves their profile.", demo: true },
  { name: "Alumni Profile 06", ttc: "TTC de la Salle Byumba", school: "GS Umubano I", district: "Rubavu", year: "2024", bio: "Profile details will be published after the member completes and approves their profile.", demo: true },
];

export const alumniFields = [
  "Name",
  "Photo",
  "Host TTC",
  "Model school",
  "District",
  "Graduation year",
  "Short bio",
  "Optional contact link",
];

export const resourceCategories = [
  "Lesson plans and teaching materials",
  "English language and digital literacy",
  "Student-centred and inquiry-based teaching",
  "Program documents and reports",
  "Alumni newsletters",
];

export const resources = [
  { title: "Learner-Centred Lesson Plan Template", type: "Lesson Plan", category: "Lesson plans and teaching materials", file: "TXT · planning template", href: "/resources/lesson-plan-template.txt" },
  { title: "Competency-Based Curriculum Quick Guide", type: "Guide", category: "Program documents and reports", file: "TXT · quick guide", href: "/resources/cbc-quick-guide.txt" },
  { title: "English Language in the Primary Classroom", type: "Guide", category: "English language and digital literacy", file: "TXT · classroom guide", href: "/resources/english-in-the-classroom.txt" },
  { title: "ICT Integration Quick Start Guide", type: "Guide", category: "English language and digital literacy", file: "TXT · quick start", href: "/resources/ict-quick-start.txt" },
  { title: "Inquiry-Based Teaching Toolkit", type: "Toolkit", category: "Student-centred and inquiry-based teaching", file: "TXT · practical toolkit", href: "/resources/inquiry-based-teaching.txt" },
  { title: "Inclusive Education Strategies", type: "Guide", category: "Student-centred and inquiry-based teaching", file: "TXT · inclusion guide", href: "/resources/inclusive-education.txt" },
  { title: "Mentor Teacher Handbook", type: "Handbook", category: "Program documents and reports", file: "TXT · mentor handbook", href: "/resources/mentor-handbook.txt" },
  { title: "PTR Alumni Network Newsletter · Issue 1", type: "Newsletter", category: "Alumni newsletters", file: "TXT · network newsletter", href: "/resources/alumni-newsletter-1.txt" },
];

export const joinContent = {
  headline: "Join the PTR Alumni Network",
  intro: "Are you a graduate of the Primary Teacher Residency Program? Join your fellow alumni to share ideas, find support, and be part of the story of improving education in Rwanda.",
  fields: [
    "Full name",
    "Phone",
    "Email",
    "Host TTC (Save or de la Salle Byumba)",
    "Model school",
    "District",
    "Graduation year",
    "Short bio",
    "Photo (optional)",
    "Consent to appear in the directory",
  ],
  contact: {
    email: "info@ptr.rw",
    phone: "Phone to be confirmed",
    address: "Kigali, Rwanda · Office location to be confirmed",
    note: "Email is the confirmed contact channel. Phone and office details will be published after verification. Social media links are live below.",
  },
};

export const copy = {
  en: {
    nav: { login: "Portal login", menu: "Open navigation", close: "Close navigation" },
    hero: {
      eyebrow: "PTR Alumni Network · Rwanda",
      title: "Celebrating Excellence in Teacher Education",
      body: "The alumni network of the Primary Teacher Residency Program (PTRP), working together for quality primary education in Rwanda.",
      primary: "Join the Network",
      secondary: "Watch Our Story",
      note: "Inspire, Educate and Empower.",
    },
    footer: {
      description: "The alumni network of the Primary Teacher Residency Program (PTRP), connecting resident teachers and model schools across Rwanda.",
      privacy: "Privacy policy",
      terms: "Terms of use",
      copyright: "© PTR Alumni Network · Inspire, Educate and Empower.",
    },
  },
  rw: {
    nav: { login: "Kwinjira muri portal", menu: "Fungura menu", close: "Funga menu" },
    hero: {
      eyebrow: "PTR Alumni Network · Rwanda",
      title: "Kwizihiza Ubuhanga mu Burezi bw'Abarimu",
      body: "Urusobe rw'abanyeshuri barangije Gahunda y'Abarezi bigisha mu mashuri (PTRP), bakorana mu ntego yo guteza imbere ireme ry'uburezi bw'ibanze mu Rwanda.",
      primary: "Injira mu rusobe",
      secondary: "Reba inkuru yacu",
      note: "Inspire, Educate and Empower.",
    },
    footer: {
      description: "Urusobe rw'abanyeshuri barangije Gahunda y'Abarezi bigisha mu mashuri (PTRP), buhuza abarezi n'amashuri mu Rwanda.",
      privacy: "Amabwiriza y'ibanga",
      terms: "Amategeko yo gukoresha",
      copyright: "© PTR Alumni Network · Inspire, Educate and Empower.",
    },
  },
  fr: {
    nav: { login: "Accéder au portail", menu: "Ouvrir la navigation", close: "Fermer la navigation" },
    hero: {
      eyebrow: "PTR Alumni Network · Rwanda",
      title: "Célébrer l'excellence dans la formation des enseignants",
      body: "Le réseau des anciens du Programme de résidence des enseignants du primaire (PTRP), uni pour une éducation primaire de qualité au Rwanda.",
      primary: "Rejoindre le réseau",
      secondary: "Voir notre histoire",
      note: "Inspire, Educate and Empower.",
    },
    footer: {
      description: "Le réseau des anciens du Programme de résidence des enseignants du primaire (PTRP), reliant les enseignants résidents et les écoles modèles au Rwanda.",
      privacy: "Politique de confidentialité",
      terms: "Conditions d'utilisation",
      copyright: "© PTR Alumni Network · Inspire, Educate and Empower.",
    },
  },
} as const;

export const sectionMeta: Record<string, { eyebrow: string; title: string; description: string; icon: LucideIcon; demo: string }> = {
  "/about": { eyebrow: "About the Program", title: "A 12-month residency that prepared 100 teachers for Rwanda's classrooms.", description: "What PTRP is, how it worked, what residents learned and received, where it took place, who launched it, and the journey from resident to alumnus.", icon: HeartHandshake, demo: "Program facts · Official sources" },
  "/network": { eyebrow: "Model Schools", title: "Our 17 model schools", description: "Primary demonstration schools where residents put what they learned into practice through guided teaching, with mentors beside them.", icon: MapPinned, demo: "School list · Two districts to confirm" },
  "/impact": { eyebrow: "Impact in Education Today", title: "From Residents to Education Leaders", description: "The PTRP pilot showed why investing in teachers matters. Meet the focus areas, results, and alumni stories shaping the next chapter.", icon: ChartNoAxesCombined, demo: "Impact data · Awaiting verified figures" },
  "/news": { eyebrow: "News & Activities", title: "What We Are Doing", description: "Events, training, success stories, announcements, and videos from the PTR Alumni Network.", icon: MessageCircle, demo: "News archive · Updated by administrators" },
  "/gallery": { eyebrow: "Gallery", title: "Our Journey in Pictures and Videos", description: "Albums from graduation, the residency at both host colleges, model school practice, training, and alumni events.", icon: Camera, demo: "Approved media · Consent required" },
  "/alumni": { eyebrow: "Alumni Directory", title: "Meet Our Alumni", description: "Find PTRP alumni by name, district, or model school. Members control what contact information is public.", icon: UsersRound, demo: "Directory preview · Profiles awaiting members" },
  "/resources": { eyebrow: "Resources", title: "Learn, Teach, Share", description: "Lesson plans, teaching materials, English and digital literacy guides, program documents, and alumni newsletters.", icon: BookOpen, demo: "Resource library · Demo files" },
  "/partners": { eyebrow: "Partners", title: "Together, We Make Teachers Matter", description: "PTRP was made possible by a strong partnership of government, universities, and education organizations that share one belief: investing in teachers improves learning for children.", icon: Handshake, demo: "Partner information · Official sources" },
  "/contact": { eyebrow: "Join & Contact", title: "Join the PTR Alumni Network", description: "Are you a PTRP graduate? Join your fellow alumni to share ideas, find support, and be part of the story of improving education in Rwanda.", icon: Globe2, demo: "Membership form · Contact details pending" },
  "/activities": { eyebrow: "Activities & Updates", title: "A living record of practice in motion", description: "Approved classroom teaching, lesson planning, mentorship, professional development, ICT, STEM, and school events.", icon: Activity, demo: "Activities feed · Demo content" },
  "/practices": { eyebrow: "Best Teaching Practices", title: "A field guide made by teachers, for teachers", description: "Discover practices with the context, steps, resources, evidence, and lessons learned needed to make an idea useful beyond one classroom.", icon: Lightbulb, demo: "Knowledge-sharing library · Demo content" },
};

export const stats = keyNumbers;
export const featureTiles = [
  { icon: UsersRound, title: "Alumni directory", body: "Find PTRP graduates across Rwanda.", href: "/alumni", accent: "mint" },
  { icon: School, title: "Model schools", body: "Explore the 17 demonstration schools.", href: "/network", accent: "blue" },
  { icon: BookOpen, title: "Resources", body: "Lesson plans, guides, and reports.", href: "/resources", accent: "gold" },
];

export const activityCards = [
  { type: "FIELD NOTE", title: "Learning circles that turn reflection into action", meta: "Professional development · DEMO DATA", icon: MessageCircle, color: "blue" },
  { type: "CLASSROOM", title: "A lesson planned around every learner's voice", meta: "Learner-centred pedagogy · DEMO DATA", icon: NotebookTabs, color: "green" },
  { type: "NETWORK", title: "Peer coaching across school communities", meta: "Mentorship & collaboration · DEMO DATA", icon: Handshake, color: "orange" },
];

export const practiceCards = [
  { title: "Make thinking visible", category: "Learner-centred pedagogy", body: "A practical routine for helping pupils explain, compare, and build on one another's ideas.", icon: Sparkles },
  { title: "Design for participation", category: "Inclusive education", body: "Simple planning prompts that help more learners enter the lesson with confidence.", icon: HeartHandshake },
  { title: "Teach with what is around you", category: "STEM & practical learning", body: "Turn everyday materials into invitations to observe, test, and make sense of the world.", icon: BookOpen },
];

export const galleryPhotos = [
  { src: "/gallery/gallery-01.jpg", alt: "PTRP community moment 1" },
  { src: "/gallery/gallery-02.jpg", alt: "PTRP community moment 2" },
  { src: "/gallery/gallery-03.jpg", alt: "PTRP community moment 3" },
  { src: "/gallery/gallery-04.jpg", alt: "PTRP community moment 4" },
  { src: "/gallery/gallery-05.jpg", alt: "PTRP community moment 5" },
  { src: "/gallery/gallery-06.jpg", alt: "PTRP community moment 6" },
  { src: "/gallery/gallery-07.jpg", alt: "PTRP community moment 7" },
  { src: "/gallery/gallery-08.jpg", alt: "PTRP community moment 8" },
  { src: "/gallery/gallery-09.jpg", alt: "PTRP community moment 9" },
  { src: "/gallery/gallery-10.jpg", alt: "PTRP community moment 10" },
  { src: "/gallery/gallery-11.jpg", alt: "PTRP community moment 11" },
];

export const galleryItems = galleryAlbums;
export const participatingSchools = modelSchools;

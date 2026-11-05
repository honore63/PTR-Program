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
  Network,
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

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/network", label: "Our Network" },
  { href: "/activities", label: "Activities" },
  { href: "/practices", label: "Best Practices" },
  { href: "/impact", label: "Impact" },
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "News" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
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
  locations: "TTC Save in Gisagara District and TTC Gicumbi in Gicumbi District, with 50 student teachers hosted at each institution.",
  sourceUrl: "https://www.mineduc.gov.rw/news-detail/primary-teacher-residency-pilot-program-for-ttcs-launched",
  image: "/manus-storage/ptrp-pilot-launch_c79bf5cd.jpg",
};

export const officialSocialVideo = {
  title: "Muri Convention Center-Resident Teachers binjiranye ibyishimo",
  channel: "PTR Alumni Network",
  date: "2 November 2026",
  videoUrl: "https://youtu.be/kDFHWe75e-I",
  embedUrl: "https://www.youtube.com/embed/kDFHWe75e-I?rel=0",
};

export const fsuResultsSource = {
  title: "LSI reports encouraging results from the Primary Teaching Residency Program in Rwanda",
  date: "27 June 2024",
  sourceLabel: "Florida State University · Learning Systems Institute",
  sourceUrl: "https://lsi.fsu.edu/article/lsi-reports-encouraging-results-primary-teaching-residency-program-rwanda",
  findings: [
    "More than 80 teacher residents received a performance rating of “meets” or “exceeds” expectations in all three observed lessons during term two.",
    "Residents continued to grow in literacy, mathematics, and science knowledge, skills, and attitudes.",
    "The article reports increased confidence in teaching, English literacy, and ICT use, with 0% attrition during the term.",
  ],
};

export const commissioningPost = {
  title: "100 Teacher Residents completed the one-year pilot",
  date: "5 August 2024",
  body: "The commissioning ceremony celebrated 100 Teacher Residents concluding a successful one-year pilot. The public posts describe a fourth year of extended training in evidence-based pedagogy and school practice at demonstration schools, co-implemented by Florida State University, Bridge2Rwanda, IEE Rwanda, and Rainwater under the coordination of MINEDUC and REB.",
  sourceLabel: "IEE Rwanda Instagram and Facebook posts",
  instagramUrl: "https://www.instagram.com/p/C-TAlcPsdex/",
  facebookUrl: "https://www.facebook.com/Ieerwanda.org/posts/the-primary-teacher-residents-commissioning-ceremony-celebrated-100-teacher-resi/885089093651350/",
  locationNote: "The commissioning posts name TTC de la Salle Byumba and TTC Save. The 2023 launch sources name TTC Gicumbi and TTC Save; the institution difference is flagged for PTR Alumni Network administrator verification.",
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

export const copy = {
  en: {
    nav: { login: "Portal login", menu: "Open navigation", close: "Close navigation" },
    hero: {
      eyebrow: "Rwanda · PTR Alumni Network",
      title: "Teachers connected by practice. Schools strengthened by sharing.",
      body: "PTR Alumni Network is the official digital community for the Primary Teacher Residency Program (PTRP) in Rwanda — connecting resident teachers, alumni, mentors, and model schools to share experiences, showcase best practices, and highlight impact on education.",
      primary: "Discover PTR Alumni Network",
      secondary: "Explore our network",
      note: "Connecting Resident Teachers, Inspiring Educational Excellence",
    },
    stats: { title: "A national network with a clear purpose", label: "Program snapshot" },
    story: { eyebrow: "Why PTR Alumni Network", title: "The classroom is where transformation becomes visible.", body: "From lesson preparation to peer coaching, PTR Alumni Network brings the lived experience of teachers into one connected space — making good practice easier to find, share, and build on.", cta: "Explore the network" },
    network: { eyebrow: "Connect", title: "100 perspectives. 17 school communities. One shared direction.", body: "A growing network of resident teachers and model schools, designed to make collaboration practical and visible.", cta: "Explore our network" },
    activities: { eyebrow: "Share", title: "What teachers are trying, learning, and sharing", body: "Discover approved activities from classrooms, professional learning sessions, mentorship circles, and school communities.", cta: "View activities" },
    practices: { eyebrow: "Learn together", title: "Small shifts in practice can open big possibilities.", body: "A knowledge-sharing space for learner-centred pedagogy, inclusive education, ICT integration, STEM, assessment, and more.", cta: "Browse best practices" },
    impact: { eyebrow: "Transform", title: "Track the work. Understand the evidence. Keep improving.", body: "Impact reporting should distinguish what happened, what was produced, and what has been demonstrated — with verified data at the centre.", cta: "Discover our impact" },
    stories: { eyebrow: "From the network", title: "Stories that keep the work human", body: "The most meaningful progress often starts with a teacher noticing what learners need, trying something new, and sharing what happened next.", cta: "Read success stories" },
    gallery: { eyebrow: "Field notes", title: "A window into the work", body: "A curated gallery of approved classroom moments, professional learning, school events, and network gatherings.", cta: "Visit the gallery" },
    // About page
    about: {
      eyebrow: "About PTR Alumni Network",
      title: "About PTR Alumni Network",
      intro: "PTR Alumni Network is the official digital community for the Primary Teacher Residency Program (PTRP) in Rwanda. PTRP is a 12-month post-training residency program that places newly qualified teachers in 17 model schools across Rwanda, where they work alongside experienced mentor teachers to develop evidence-based teaching skills.",
      mission: {
        title: "Our Mission",
        body: "To improve classroom teaching practice and learner outcomes across Rwanda by supporting newly qualified teachers through a structured, mentored residency year in model schools.",
      },
      vision: {
        title: "Our Vision",
        body: "A Rwanda where every primary school learner is taught by a confident, well-prepared teacher who uses evidence-based practice to help every child succeed.",
      },
      values: [
        { title: "Excellence", body: "We uphold the highest standards of teaching practice and professional conduct." },
        { title: "Collaboration", body: "We learn better together — teachers, mentors, and school communities working as one." },
        { title: "Innovation", body: "We embrace evidence-based approaches, ICT integration, and creative problem-solving." },
        { title: "Impact", body: "We measure what matters — learner engagement, teacher growth, and improved outcomes." },
      ],
      roleInRwanda: {
        title: "PTRP's Role in Improving Education in Rwanda",
        body: "PTRP supports the Ministry of Education's goal of strengthening foundational learning. By placing resident teachers in model schools and connecting them through PTR Alumni Network, the program helps raise teaching standards, reduce attrition, and build a sustainable pipeline of skilled educators for Rwanda's primary schools.",
      },
    },
    // Contact page
    contact: {
      eyebrow: "Contact & Partnerships",
      title: "Get in Touch with PTR Alumni Network",
      intro: "Have a question, partnership idea, or want to learn more about PTR Alumni Network and the Primary Teacher Residency Program (PTRP)? We'd love to hear from you.",
      address: "Ministry of Education, Kigali, Rwanda",
      email: "info@ptr.rw",
      phone: "+250 788 123 456",
      hours: "Monday – Friday, 8:00 AM – 5:00 PM",
      cta: "Send us a message",
    },
    footer: { description: "The official digital community for the Primary Teacher Residency Program (PTRP) in Rwanda — connecting resident teachers, alumni, mentors, and model schools.", privacy: "Privacy policy", terms: "Terms of use", copyright: "PTR Alumni Network · Official digital community for PTRP" },
  },
  rw: {
    nav: { login: "Kwinjira muri portal", menu: "Fungura menu", close: "Funga menu" },
    hero: { eyebrow: "Rwanda · Gahunda y’Abarezi bigisha mu mashuri", title: "Abarezi bahuzwa n’imikorere myiza. Amashuri agakomera binyuze mu gusangira.", body: "PTR Alumni Network ni urubuga ruhuza abarezi, amashuri n’abafatanyabikorwa mu kwiga, gukorana no guteza imbere ireme ry’imyigishirize.", primary: "Menya PTR Alumni Network", secondary: "Reba urusobe rwacu", note: "Urubuga rwo gusangira ibimenyetso, ubunararibonye n’iterambere." },
    stats: { title: "Urusobe rw’igihugu rufite intego isobanutse", label: "Incamake ya gahunda" }, story: { eyebrow: "Impamvu PTR Alumni Network", title: "Mu ishuri ni ho impinduka zigaragarira.", body: "Kuva ku gutegura amasomo kugeza ku gufashanya hagati y’abarezi, PTR Alumni Network ihuza ubunararibonye bw’abarezi mu rubuga rumwe.", cta: "Menya gahunda" }, network: { eyebrow: "Huza", title: "Ibitekerezo 100. Amashuri 17. Icyerekezo kimwe.", body: "Urusobe rw’abarezi n’amashuri rugamije gutuma ubufatanye buba ingirakamaro kandi bugaragara.", cta: "Reba urusobe" }, activities: { eyebrow: "Sangiza", title: "Ibyo abarezi bagerageza, biga kandi basangiza", body: "Menya ibikorwa byemejwe bivuye mu mashuri no mu myigire y’umwuga.", cta: "Reba ibikorwa" }, practices: { eyebrow: "Twige hamwe", title: "Impinduka nto mu myigishirize zishobora gufungura amahirwe menshi.", body: "Urubuga rwo gusangiza uburyo bwiza bwo kwigisha no kwiga.", cta: "Reba imikorere myiza" }, impact: { eyebrow: "Hindura", title: "Kurikirana ibikorwa. Sobanukirwa ibimenyetso. Komeza kunoza.", body: "Raporo y’ingaruka igomba gutandukanya ibyakozwe, ibyavuye mu bikorwa n’ibyagaragajwe n’ibimenyetso.", cta: "Menya ingaruka" }, stories: { eyebrow: "Kuva mu rusobe", title: "Inkuru zituma akazi kagumana ubumuntu", body: "Iterambere rikomeye ritangirira ku murezi ubona icyo abanyeshuri bakeneye, akagerageza ikintu gishya, hanyuma akagisangiza abandi.", cta: "Soma inkuru" }, gallery: { eyebrow: "Ibyabaye mu murima", title: "Idirishya ryerekana ibikorwa", body: "Amafoto n’amashusho byemejwe bigaragaza amasomo, amahugurwa n’ibikorwa by’amashuri.", cta: "Jya ku mafoto" }, footer: { description: "Urubuga ruhuza abarezi n'abafatanyabikorwa mu burezi kugira ngo bamenye, basangire kandi bahindure imikorere.", privacy: "Amabwiriza y'ibanga", terms: "Amategeko yo gukoresha", copyright: "PTR Alumni Network · Urubuga ruhuza gusuzumwa" },
  },
  fr: {
    nav: { login: "Accéder au portail", menu: "Ouvrir la navigation", close: "Fermer la navigation" },
    hero: { eyebrow: "Rwanda · PTR Alumni Network", title: "Des enseignants reliés par la pratique. Des écoles renforcées par le partage.", body: "PTR Alumni Network est la communauté numérique officielle du Programme de Résidence des Enseignants du Primaire (PTRP) au Rwanda — reliant les enseignants résidents, les anciens élèves, les mentors et les écoles modèles pour partager des expériences, mettre en avant les meilleures pratiques et souligner l'impact sur l'éducation.", primary: "Découvrir PTR Alumni Network", secondary: "Explorer notre réseau", note: "Connecter les enseignants résidents · Inspirer l'excellence éducative" },
    stats: { title: "Un réseau national avec une mission claire", label: "Aperçu du programme" }, story: { eyebrow: "Pourquoi PTR Alumni Network", title: "C’est dans la classe que la transformation devient visible.", body: "De la préparation des leçons au coaching entre pairs, PTR Alumni Network rassemble l’expérience des enseignants dans un espace connecté.", cta: "Découvrir le programme" }, network: { eyebrow: "Connecter", title: "100 points de vue. 17 communautés scolaires. Une direction commune.", body: "Un réseau d’enseignants résidents et d’écoles modèles qui rend la collaboration concrète et visible.", cta: "Explorer le réseau" }, activities: { eyebrow: "Partager", title: "Ce que les enseignants essaient, apprennent et partagent", body: "Découvrez des activités approuvées issues des classes, du développement professionnel et des communautés scolaires.", cta: "Voir les activités" }, practices: { eyebrow: "Apprendre ensemble", title: "De petits changements de pratique peuvent ouvrir de grandes possibilités.", body: "Un espace de partage autour de la pédagogie centrée sur l’apprenant, l’inclusion, les TIC, les STEM et l’évaluation.", cta: "Parcourir les pratiques" }, impact: { eyebrow: "Transformer", title: "Suivre le travail. Comprendre les preuves. Continuer à améliorer.", body: "Le suivi de l’impact doit distinguer les actions, les productions et les résultats démontrés.", cta: "Découvrir notre impact" }, stories: { eyebrow: "Dans le réseau", title: "Des histoires qui gardent le travail humain", body: "Les progrès les plus importants commencent souvent lorsqu’un enseignant observe un besoin, essaie une nouvelle approche et partage la suite.", cta: "Lire les récits" }, gallery: { eyebrow: "Carnet de terrain", title: "Une fenêtre sur le travail", body: "Une galerie sélectionnée de moments de classe, de formations et de rencontres du réseau.", cta: "Visiter la galerie" }, footer: { description: "La communauté numérique officielle du Programme de Résidence des Enseignants du Primaire (PTRP) au Rwanda — reliant les enseignants résidents, les anciens élèves, les mentors et les écoles modèles.", privacy: "Politique de confidentialité", terms: "Conditions d’utilisation", copyright: "PTR Alumni Network · Communauté numérique officielle pour PTRP" },
  },
} as const;

export const stats = [
  { value: 100, suffix: "", label: "Resident teachers", detail: "Verified program snapshot", icon: UsersRound, tone: "blue" },
  { value: 17, suffix: "", label: "Model schools", detail: "Verified program snapshot", icon: School, tone: "green" },
  { value: 1, suffix: "", label: "National network", detail: "Connected by practice", icon: Globe2, tone: "orange" },
];

export const featureTiles: Array<{ icon: LucideIcon; title: string; body: string; href: string; accent: string }> = [
  { icon: Network, title: "Our network", body: "Find the people and school communities shaping the conversation.", href: "/network", accent: "mint" },
  { icon: Activity, title: "Activities & updates", body: "Follow approved classroom, mentorship, and professional learning activity.", href: "/activities", accent: "blue" },
  { icon: Lightbulb, title: "Best practices", body: "Make useful teaching ideas easier to discover and build on.", href: "/practices", accent: "gold" },
];

export const activityCards = [
  { type: "FIELD NOTE", title: "Learning circles that turn reflection into action", meta: "Professional development · DEMO DATA", icon: MessageCircle, color: "blue" },
  { type: "CLASSROOM", title: "A lesson planned around every learner’s voice", meta: "Learner-centred pedagogy · DEMO DATA", icon: NotebookTabs, color: "green" },
  { type: "NETWORK", title: "Peer coaching across school communities", meta: "Mentorship & collaboration · DEMO DATA", icon: Handshake, color: "orange" },
];

export const practiceCards = [
  { title: "Make thinking visible", category: "Learner-centred pedagogy", body: "A practical routine for helping pupils explain, compare, and build on one another’s ideas.", icon: Sparkles },
  { title: "Design for participation", category: "Inclusive education", body: "Simple planning prompts that help more learners enter the lesson with confidence.", icon: HeartHandshake },
  { title: "Teach with what is around you", category: "STEM & practical learning", body: "Turn everyday materials into invitations to observe, test, and make sense of the world.", icon: BookOpen },
];

export const galleryItems = [
  { label: "Classroom practice", caption: "Learning in motion", gradient: "from-[#0d2b55] via-[#1e5aa3] to-[#7bc2a3]" },
  { label: "Professional learning", caption: "Teachers learning together", gradient: "from-[#122b49] via-[#315f6a] to-[#e0a74e]" },
  { label: "School community", caption: "A network with purpose", gradient: "from-[#0d2b55] via-[#5c3d75] to-[#e7834c]" },
  { label: "Evidence & impact", caption: "From activity to insight", gradient: "from-[#183c55] via-[#1f7c70] to-[#8cc7a6]" },
];

export const impactBars = [
  { label: "Teacher participation", value: 86, color: "bg-[#1e5aa3]" },
  { label: "School participation", value: 72, color: "bg-[#16a878]" },
  { label: "Practice sharing", value: 64, color: "bg-[#e6a24b]" },
];

export const programOverview = {
  title: "Primary Teacher Residency Program",
  aims: "To improve classroom teaching practice and learner outcomes in Rwanda by providing newly qualified teachers with a structured, supported residency year in model schools.",
  objectives: [
    "Bridge the gap between initial teacher training and effective classroom practice",
    "Embed evidence-based pedagogy and 21st-century skills (English, digital literacy) into daily teaching",
    "Build a national network of reflective, collaborative, and innovative teachers",
    "Strengthen model schools as centers of excellence and professional learning",
  ],
  howItOperates: "Resident teachers are assigned to one of 17 model schools, where they work alongside experienced mentor teachers. The 12-month residency includes guided observation, co-planning, team teaching, and independent practice, with regular feedback cycles and professional learning communities.",
  teacherTraining: "Residents receive ongoing training in learner-centred pedagogy, formative assessment, inclusive education, STEM teaching, and ICT integration. Training is delivered through a mix of face-to-face workshops, online modules, and peer coaching cycles.",
  mentorship: "Each resident is paired with a trained mentor teacher who provides weekly guidance, models effective practice, and engages in reflective dialogue. Mentors receive dedicated training and support throughout the residency year.",
  professionalDevelopment: "Residents participate in regular professional learning communities, cross-school visits, and network-wide events. They document their practice, share findings, and build a portfolio of evidence demonstrating improved learner outcomes.",
  expectedOutcomes: "Improved learner engagement and achievement in literacy and mathematics, increased teacher confidence and effectiveness, strengthened peer collaboration across schools, and a growing network of innovative teaching practices documented and shared across the program.",
};

export const participatingSchools = [
  { name: "TTC Save", location: "Gisagara District", image: "/manus-storage/ptrp-pilot-launch_c79bf5cd.jpg", intake: 50, focus: "Early childhood and primary pedagogy" },
  { name: "TTC Gicumbi", location: "Gicumbi District", image: "/manus-storage/ptrp-pilot-launch_c79bf5cd.jpg", intake: 50, focus: "Subject teaching and curriculum" },
  { name: "School A", location: "Kigali City", image: "/placeholder-school-a.jpg", intake: 30, focus: "Literacy and inclusive education" },
  { name: "School B", location: "East Province", image: "/placeholder-school-b.jpg", intake: 25, focus: "Mathematics and STEM" },
  { name: "School C", location: "West Province", image: "/placeholder-school-c.jpg", intake: 20, focus: "Science and practical learning" },
  { name: "School D", location: "North Province", image: "/placeholder-school-d.jpg", intake: 15, focus: "Inclusive education and SEN" },
  { name: "School E", location: "Kigali Rural", image: "/placeholder-school-e.jpg", intake: 10, focus: "Digital literacy and ICT integration" },
  // Complete list of 17 model schools
  { name: "School F", location: "Kigali Suburbs", image: "/placeholder-school-f.jpg", intake: 8, focus: "Arts and humanities" },
  { name: "School G", location: "Rural Area", image: "/placeholder-school-g.jpg", intake: 6, focus: "Vocational integration" },
  { name: "School H", location: "Urban Center", image: "/placeholder-school-h.jpg", intake: 5, focus: "Gender-responsive pedagogy" },
  { name: "School I", location: "District X", image: "/placeholder-school-i.jpg", intake: 4, focus: "Environmental education" },
  { name: "School J", location: "District Y", image: "/placeholder-school-j.jpg", intake: 4, focus: "Skill-based learning" },
  { name: "School K", location: "District Z", image: "/placeholder-school-k.jpg", intake: 3, focus: "Community engagement" },
  { name: "School L", location: "Remote Area", image: "/placeholder-school-l.jpg", intake: 3, focus: "Multigrade teaching" },
  { name: "School M", location: "Gisagara", image: "/placeholder-school-m.jpg", intake: 2, focus: "Teacher well-being" },
  { name: "School N", location: "Gicumbi", image: "/placeholder-school-n.jpg", intake: 2, focus: "Curriculum innovation" },
  { name: "School O", location: "Huye", image: "/placeholder-school-o.jpg", intake: 1, focus: "Action research" },
];

export const sectionMeta: Record<string, { eyebrow: string; title: string; description: string; icon: LucideIcon; demo: string }> = {
  "/about": { eyebrow: "About PTR Alumni Network", title: "A connected program for stronger teaching practice.", description: "Program background, vision, mission, objectives, core values, implementation approach, and the role of resident teachers and model schools will live here. Official statements are editable and remain placeholders until verified.", icon: HeartHandshake, demo: "Editable program information · DEMO CONTENT" },
  "/network": { eyebrow: "Our network", title: "Find the people and communities behind the work.", description: "The resident teacher directory and model school profiles will make approved experience easier to find, with filters for school, subject, location, and teaching area. Location and profile details appear only when verified and approved. See participating schools below.", icon: MapPinned, demo: "Directory and school profiles · DEMO CONTENT" },
  "/activities": { eyebrow: "Activities & updates", title: "A living record of practice in motion.", description: "Browse approved classroom teaching, lesson planning, mentorship, professional development, ICT, STEM, school events, community engagement, and peer learning updates.", icon: Activity, demo: "Approved activities feed · DEMO CONTENT" },
  "/practices": { eyebrow: "Best teaching practices", title: "A field guide made by teachers, for teachers.", description: "Discover practices with the context, steps, resources, evidence, and lessons learned needed to make an idea useful beyond one classroom.", icon: Lightbulb, demo: "Knowledge-sharing library · DEMO CONTENT" },
  "/impact": { eyebrow: "Impact on education", title: "Evidence that helps the network keep learning.", description: "The impact dashboard will distinguish activities, outputs, and demonstrated outcomes using verified indicators entered by authorized users. No fabricated statistics or causal claims.", icon: ChartNoAxesCombined, demo: "Verified reporting dashboard · DEMO CONTENT" },
  "/gallery": { eyebrow: "Gallery", title: "A window into the work across the network.", description: "Approved photos, videos, albums, captions, and stories will be searchable by school, activity, date, and event, with consent and moderation safeguards.", icon: Camera, demo: "Approved media gallery · DEMO CONTENT" },
  "/news": { eyebrow: "News & success stories", title: "Keep up with the people and moments moving the program forward.", description: "Program announcements, school updates, resident teacher experiences, interviews, recognition, events, and school stories will gather here.", icon: MessageCircle, demo: "News and story archive · DEMO CONTENT" },
  "/resources": { eyebrow: "Resources & publications", title: "Useful materials, ready to be shared.", description: "A searchable library for lesson plans, teaching materials, videos, reports, research, training, and best-practice documents — with file type, category, tag, and download support.", icon: BookOpen, demo: "Resource library · DEMO CONTENT" },
  "/contact": { eyebrow: "Contact & partnerships", title: "Bring a question, an idea, or a collaboration.", description: "Official contact details and partnership channels will be published here once verified. For now, this is a safe, editable placeholder for the contact experience.", icon: Handshake, demo: "Contact details pending verification" },
};

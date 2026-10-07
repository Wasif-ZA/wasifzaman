/*
 * All site copy lives here. Every engineering claim is checked against
 * resume.pdf or, for sprawll and Finarchitect, the project's own README and
 * live site; every URL returned 200 when last verified. Studio pricing comes
 * from the decided price card, not from an estimate.
 */

export type ArchStage = string | string[];
export type ArchSpec = { stages: ArchStage[]; note?: string };

export type Project = {
  title: string;
  blurb: string;
  tech: string[];
  description: string;
  imgSrc?: string;
  imgNote?: string;
  arch?: ArchSpec;
  projectLink?: string;
  projectLabel?: string;
  code?: string;
  altCode?: string;
  altCodeLabel?: string;
};

export const LINKS = {
  email: "wasif.zaman1@gmail.com",
  github: "https://github.com/Wasif-ZA",
  linkedin: "https://www.linkedin.com/in/wasif-zaman-4228b5245/",
  resume: "/resume.pdf",
};

/* ============================ ENGINEER ============================ */

export const TOOLBOX = [
  "TypeScript", "Python", "C++20", "Java", "SQL",
  "React", "Next.js", "Node.js", "three.js", "Tailwind",
  "Prisma", "PostgreSQL", "Supabase", "Azure Functions",
  "Redis", "Docker", "GitHub Actions",
];

export const PROJECTS: Project[] = [
  {
    title: "DynamicFit",
    blurb: "3D bin-packing solver with a browser visualiser",
    tech: ["C++20", "three.js", "JSON Schema", "React"],
    description:
      "NP-hard three-dimensional bin packing solved in C++20 and returned as a real-time three.js scene. I designed the JSON-Schema contract two other teams built against before the solver existed, then pinned it with 11 render fixtures over 7 invariants.",
    imgSrc: "/projects/dynamicfit.jpg",
    imgNote: "Real solver output: a 250-item order packed into 11 cartons.",
    code: "https://github.com/Wasif-ZA/dynamic-fit",
    altCode: "https://github.com/Wasif-ZA/DynamicSolver",
    altCodeLabel: "Solver",
  },
  {
    title: "sprawll",
    blurb: "Research CLI that withholds claims it can't source",
    tech: ["Python", "WARC", "Local LLM"],
    description:
      "Turns a topic into a research pack where every published claim is checked against a byte-for-byte archive of its sources. A span model and a deterministic numeric guard ground each claim; anything unsupported is withheld and named, not shipped.",
    arch: {
      stages: ["Fetch", "WARC archive", "Harvest facts", "Draft", ["Span model", "Numeric guard"]],
      note: "Unsupported claims are withheld",
    },
    projectLink: "https://pypi.org/project/sprawll/",
    projectLabel: "PyPI",
  },
  {
    title: "Finarchitect",
    blurb: "Site for a research and consulting firm",
    tech: ["Next.js", "three.js", "GSAP", "Tailwind"],
    description:
      "Designed and built the website for Finarchitect, a research and consulting firm working on financial risk, sustainable finance and governance: one home page plus seven research-area pages.",
    imgSrc: "/projects/finarchitect.jpg",
    imgNote: "The live site.",
    projectLink: "https://finarchitect-ten.vercel.app",
  },
  {
    title: "Korvo",
    blurb: "Agentic job-outreach platform",
    tech: ["Next.js", "Claude API", "BullMQ", "Redis", "Stripe"],
    description:
      "Four Claude agents run as a BullMQ DAG: a contact finder, an email guesser and a research agent feed a drafter, the two middle agents in parallel. Row-level security per user, Stripe subscriptions, Gmail OAuth so users send from their own inbox.",
    arch: {
      stages: ["Contact Finder", ["Email Guesser", "Research Agent"], "Drafter", "Gmail Send"],
      note: "BullMQ DAG on Redis",
    },
    code: "https://github.com/Wasif-ZA/Korvo",
  },
  {
    title: "UTSBDSOC",
    blurb: "Society platform and the Graamys voting flow",
    tech: ["Next.js", "Supabase", "Prisma"],
    description:
      "Website and internal tooling for roughly 300 members. Shipped the Graamys awards platform in a two-week sprint: nine categories, duplicate-vote prevention, and an audit trail the committee reviews each cycle.",
    imgSrc: "/projects/utsbdsoc.jpg",
    imgNote: "The live site.",
    projectLink: "https://utbdsoc-website.vercel.app/home",
    code: "https://github.com/UTBDSOC/UTBDSOC-website",
  },
  {
    title: "Bridge Opening",
    blurb: "Engineering capstone, scale-model drawbridge",
    tech: ["C++", "ESP32", "Arduino"],
    description:
      "Control logic across two microcontrollers coordinating six sensors and four actuators in real time, plus the safety layer: collision detection, positional limits, load sensing and emergency stop, all inside the response budget.",
    imgSrc: "/projects/bridge-opening.jpg",
    imgNote: "The live control console.",
    projectLink: "https://bridge-opening-project.vercel.app",
    code: "https://github.com/Wasif-ZA/BridgeOpeningProject",
  },
  {
    title: "BladeRunner",
    blurb: "Distributed carriage control system",
    tech: ["Java", "ESP32-S3", "UDP / JSON"],
    description:
      "A Java carriage control program driving ESP32-S3 hardware over a UDP/JSON protocol, coordinated by a master orchestrator and operated from a Next.js console.",
    imgSrc: "/projects/bladerunner.jpg",
    imgNote: "The live operator console.",
    projectLink: "https://blade-runner-flax.vercel.app",
    code: "https://github.com/Wasif-ZA/BladeRunner",
  },
  {
    title: "AutoDocs",
    blurb: "AI documentation pipeline for TypeScript",
    tech: ["TypeScript", "AST", "GitHub Actions"],
    description:
      "Parses TypeScript into an AST, prompts a model from the structure it finds, and validates every response against a JSON schema before it lands, retrying when it does not. Token-aware chunking re-documents only changed files.",
    arch: {
      stages: ["TS Source", "AST Parse", "Model", "Schema Check", "Commit"],
      note: "Retries on schema failure",
    },
    code: "https://github.com/Wasif-ZA/AutoDocs",
  },
];

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  points: string[];
  stack: string[];
};

export const EXPERIENCE: Experience[] = [
  {
    company: "Australian Catholic University",
    role: "Research Software Engineer Intern",
    period: "Apr 2026 - Present",
    location: "Institute for Positive Psychology and Education",
    points: [
      "Build a Python service on Azure Functions rendering participant PDF reports from longitudinal survey data, where thousands must be correct without a human checking each one.",
      "Set requirements with the research team and put a mockup in front of them before writing code, so feedback landed while changes were cheap.",
      "Work under an ethics protocol keeping identifiable data off external services.",
    ],
    stack: ["Python", "Azure Functions", "PDF Rendering"],
  },
  {
    company: "UTS Bangladeshi Society",
    role: "Technical Lead / IT Director",
    period: "May 2025 - Present",
    location: "Sydney",
    points: [
      "Shipped the Graamys awards platform end to end in a two-week sprint: nine categories, duplicate-vote prevention, and an audit trail.",
      "Own the Next.js site and internal tooling for roughly 300 members, with a headless CMS so committee members publish without a developer.",
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "Prisma"],
  },
  {
    company: "Lenovo",
    role: "Desktop Rollout Engineer",
    period: "Apr 2026 - Present",
    location: "Sydney",
    points: [
      "Deploy and configure enterprise desktop hardware on a Sydney CBD client site, scheduling rollouts so the business keeps running through the change.",
      "Provision from standardised images and keep the asset inventory accurate across the fleet.",
    ],
    stack: ["Imaging", "Asset Management"],
  },
  {
    company: "Optus",
    role: "Sales Consultant",
    period: "Jul - Dec 2025",
    location: "Sydney",
    points: [
      "Reviewed each customer's account and combined offers, plans and bundles into something that fit what they actually used.",
      "Grew accounts through consultative upsell on inbound interactions, consistently beating shift targets.",
    ],
    stack: ["Consultative Sales", "CRM"],
  },
];

export const EDUCATION = {
  institution: "Macquarie University",
  degree: "Bachelor of Engineering (Honours), Software Engineering",
  period: "Feb 2022 - Jun 2027",
  detail: "Degree conferred Sep 2027.",
  coursework: [
    "Data Structures & Algorithms", "Distributed Systems", "Operating Systems",
    "Computer Networks", "Database Systems", "Cloud Computing",
    "Embedded Systems", "Honours Research Thesis",
  ],
};

export const CERTIFICATES = [
  { name: "Data Analytics Professional Certificate", issuer: "Google" },
  { name: "Cloud Computing", issuer: "IBM" },
  { name: "Programming with JavaScript", issuer: "Meta" },
];

/* ============================= STUDIO ============================= */

export type Service = {
  name: string;
  price: string;
  priceNote?: string;
  outcome: string;
  includes: string[];
  featured?: boolean;
};

export const SERVICES: Service[] = [
  {
    name: "Website in a Week",
    price: "A$990",
    priceNote: "one-off, full handover",
    outcome:
      "You have strong reviews and steady foot traffic but nothing online to convert it. This plugs the leak in five working days.",
    includes: [
      "Live in 5 working days",
      "Your domain, in your name",
      "Source files handed over",
      "Enquiry form wired up",
      "Google Business Profile linked",
      "14-day warranty after go-live",
    ],
    featured: true,
  },
  {
    name: "Premises",
    price: "A$1,400",
    priceNote: "one-off, full handover",
    outcome:
      "For showrooms, salons and clinics: more rooms to show, bookings to take, and reviews worth putting on the page.",
    includes: [
      "Everything in Website in a Week",
      "Extra pages for services and staff",
      "Booking embed",
      "Review wall",
    ],
  },
  {
    name: "Clips and Highlights",
    price: "Quoted",
    priceNote: "per pipeline, after a look at your VODs",
    outcome:
      "You stream for hours and none of it becomes short-form. This turns the back catalogue into a feed that keeps working between streams.",
    includes: [
      "Long-form cut into shorts",
      "Captions and hooks",
      "Per-platform framing",
      "Consistent posting cadence",
    ],
  },
];

/* ============================== SHOP ============================== */

// buy is a Stripe Payment Link; left empty, the button falls back to an email.
export type Product = {
  name: string;
  price: string;
  priceNote: string;
  blurb: string;
  includes: string[];
  cta: string;
  href?: string;
  buy?: string;
};

export const STORE_URL = "https://store.wasifzaman.tech";

export const PRODUCTS: Product[] = [
  {
    name: "Creator Site",
    price: "Free",
    priceNote: "while in beta",
    blurb:
      "A ready-made site for streamers. Sign in with Twitch, pick a template, and your live status, clips and links are on one page.",
    includes: [
      "21 templates plus 4 variants, switch any time",
      "Live status and clips from Twitch",
      "Your address: store.wasifzaman.tech/you",
      "Edit it yourself, no builder",
    ],
    cta: "Make yours",
    href: STORE_URL,
  },
  {
    name: "Creator Site Pro",
    price: "Add-on",
    priceNote: "price on request during beta",
    blurb: "Everything in Creator Site, on a domain of its own.",
    includes: [
      "Your own domain, or you.wasifzaman.tech",
      "Set up for you, no DNS homework",
      "Same editor, same templates",
    ],
    cta: "Ask about Pro",
  },
];

export const CLIENT_WORK = [
  {
    name: "jelapiii",
    what: "Orchi's Twitch hub, with Segments for viewer submissions",
    href: "https://www.jelapiii.com",
  },
  {
    name: "Jelarp of All Trades",
    what: "Site for Orchi's monthly LARP stream",
    href: "https://jelarp.vercel.app",
  },
];

export const WEEK = [
  { day: "Mon", work: "Kickoff, content form, page map" },
  { day: "Tue", work: "Build: real content in, copy fixed" },
  { day: "Wed", work: "Enquiry form wired, mobile pass" },
  { day: "Thu", work: "One revision round, domain, SSL, deploy" },
  { day: "Fri", work: "Profile linkup, handover kit, ownership transfer" },
];

export const STUDIO_TERMS = [
  { label: "No monthly plans", detail: "One payment. Nothing to cancel." },
  { label: "No hostage domains", detail: "Registered in your name from day one." },
  { label: "You keep the source", detail: "Any developer can pick it up later." },
  { label: "50 / 50", detail: "Half starts the clock, half before handover." },
];

import type { BlockCSSStyles, WebBlock } from './builder-types';
import type { SiteKit, SiteKitPage } from "./site-kits";
import { block, dark, light } from "./site-kits";

// Local id generator so this module does not depend on a `const` binding
// from site-kits.ts — the two modules import each other (enrichKitSite is
// consumed by the SITE_KITS export), and a top-level const in the cycle
// would be in the temporal dead zone during module evaluation.
const uid = () => crypto.randomUUID();

// =====================================================================
// REAL-SITE SECTION LIBRARY
// Every business website, regardless of industry, needs a recognizable
// anatomy: social proof, capabilities, process, proof points (stats),
// testimonials, FAQ, a final CTA, and content sections for inner pages.
// This module generates those sections THEMED to each kit's palette so
// the enrichment never looks like a generic template bolted on.
// =====================================================================

export interface KitTheme {
  accent: string;
  /** Dark section style fn (kit palette aware) */
  dark: (overrides?: Partial<BlockCSSStyles>) => Partial<BlockCSSStyles>;
  /** Light section style fn (kit palette aware) */
  light: (overrides?: Partial<BlockCSSStyles>) => Partial<BlockCSSStyles>;
  maxWidth?: number;
}

export interface KitProfile {
  /** What the kit calls its users — "clients", "students", "customers", "diners" */
  noun: string;
  plural: string;
  /** Social proof line */
  proofLine: string;
  /** Stat block (4 counters) */
  stats: { label: string; val: number; suffix: string }[];
  /** 3 testimonials */
  testimonials: { name: string; role: string; content: string }[];
  /** 4 FAQ entries */
  faqs: { q: string; a: string }[];
  /** 4 process steps */
  steps: { title: string; desc: string }[];
  /** Values / capability cards for about pages */
  values: { title: string; desc: string; icon: string }[];
  /** Gallery imagery for portfolio-ish pages */
  gallery: { url: string; title: string; subtitle: string; aspect: string }[];
  /** Blog article cards */
  articles: { title: string; desc: string; tag: string }[];
}

// --------------------------------------------------------------------
// CATEGORY PROFILES — real, specific copy per industry
// --------------------------------------------------------------------

const educationProfile = (brand: string): KitProfile => ({
  noun: "student",
  plural: "students",
  proofLine: "Outcomes our learners can verify",
  stats: [
    { label: "Learners enrolled", val: 2400, suffix: "+" },
    { label: "Average completion", val: 91, suffix: "%" },
    { label: "Hands-on projects", val: 120, suffix: "+" },
    { label: "Mentor sessions / month", val: 640, suffix: "" },
  ],
  testimonials: [
    { name: "Riya Menon", role: "Working professional · Evening batch", content: "I was skeptical about online learning until this program. The structure, the mentor feedback, and the pace finally matched how I actually learn." },
    { name: "Arjun Bhat", role: "Full-time learner · 2026 cohort", content: "The curriculum is genuinely practical. Every concept maps to something you build, and the review process catches mistakes early." },
    { name: "Sneha Iyer", role: "Career switcher", content: "What sold me was the honesty — no promises of overnight results, just a clear path and people who answer questions properly." },
  ],
  faqs: [
    { q: "Is this suitable for complete beginners?", a: "Yes. The program starts from fundamentals and builds up in short, structured stages with checkpoint reviews at every level." },
    { q: "How much time do I need each week?", a: "Most learners commit 8–10 hours a week across live sessions, self-paced work, and feedback reviews. Evening and weekend options are available." },
    { q: "Do you offer certificates?", a: "Yes, every completed track includes a verified certificate, and mentors write reference notes for learners who complete the full journey." },
    { q: "What happens after I finish?", a: "You keep access to the community and materials, and receive guidance on next steps — further tracks, projects, or placement support where available." },
  ],
  steps: [
    { title: "Diagnose your level", desc: "A short assessment places you in the right starting stage — no wasted weeks on content you already know." },
    { title: "Learn in stages", desc: "Short, structured modules with live guidance, exercises, and checkpoint reviews before moving on." },
    { title: "Build real work", desc: "Every track ends with a portfolio-grade project reviewed by a mentor with actionable feedback." },
    { title: "Keep growing", desc: "Graduate into the alumni community with continued access, resources, and advanced tracks." },
  ],
  values: [
    { title: "Structured curriculum", desc: "Every module has a clear goal, schedule, and measure of progress.", icon: "BookOpen" },
    { title: "Mentor feedback", desc: "Real humans review your work and answer your questions on a regular cadence.", icon: "MessageSquare" },
    { title: "Practical projects", desc: "Theory is applied immediately through work you can show employers or clients.", icon: "Wrench" },
    { title: "Honest guidance", desc: "We tell you what to expect, how long it takes, and what it takes to succeed.", icon: "ShieldCheck" },
  ],
  gallery: [
    { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=85&w=1200", title: "Live learning sessions", subtitle: "Small groups, real questions", aspect: "landscape" },
    { url: "https://images.unsplash.com/photo-1501501825248-7aa84a73f9f9?auto=format&fit=crop&q=85&w=1000", title: "Focused study", subtitle: "Quiet, distraction-free practice", aspect: "square" },
    { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=85&w=1000", title: "Workshops & reviews", subtitle: "Mentors, not videos", aspect: "portrait" },
    { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=85&w=1200", title: "Alumni network", subtitle: "Long after the last class", aspect: "landscape" },
  ],
  articles: [
    { title: "Why structured learning beats endless tutorials", desc: "The research on spaced practice, feedback loops, and why a clear path beats a library of disconnected videos.", tag: "LEARNING SCIENCE" },
    { title: "How to stay consistent when motivation dips", desc: "A practical system of small wins, scheduled reviews, and accountability that survives real life.", tag: "PRODUCTIVITY" },
    { title: "Portfolio projects that actually impress", desc: "What mentors look for — and how to build a project that demonstrates judgment, not just code.", tag: "CAREER" },
  ],
});

const servicesProfile = (brand: string): KitProfile => ({
  noun: "client",
  plural: "clients",
  proofLine: "Results our clients can verify",
  stats: [
    { label: "Engagements delivered", val: 480, suffix: "+" },
    { label: "Client retention", val: 97, suffix: "%" },
    { label: "Average response time", val: 4, suffix: " hrs" },
    { label: "Years in practice", val: 14, suffix: "" },
  ],
  testimonials: [
    { name: "Kavitha Rao", role: "Founder · Retail group", content: "They take the time to understand the actual problem before proposing anything. That discipline saved us from two expensive wrong turns." },
    { name: "Rahul Verma", role: "COO · Manufacturing firm", content: "Professional, precise, and genuinely accountable. Every milestone was clear, every decision documented, and nothing slipped." },
    { name: "Meera Krishnan", role: "Director · Healthcare practice", content: "What impressed me most was how quickly they got to the heart of the matter. Direct communication, no theatre, real progress." },
  ],
  faqs: [
    { q: "How do we start working together?", a: "With a short discovery conversation to understand your goals, timeline, and constraints. You get a clear proposal with scope, process, and cost before any commitment." },
    { q: "How long does a typical engagement take?", a: "It depends on scope — most engagements run four to twelve weeks, with clear milestones and regular reviews throughout." },
    { q: "Who actually does the work?", a: "Senior practitioners. The people you meet in the first conversation are the people delivering the work — no hand-offs to juniors." },
    { q: "What is your pricing model?", a: "Fixed, agreed-upon pricing for a defined scope. You always know the cost before we begin, and any change of scope is discussed first." },
  ],
  steps: [
    { title: "Discovery", desc: "A structured conversation to understand the decision, the constraints, and what success looks like." },
    { title: "Proposal", desc: "A written plan with scope, approach, timeline, and cost — agreed before any work begins." },
    { title: "Execution", desc: "Senior-led delivery with regular check-ins, transparent reporting, and no surprises." },
    { title: "Handover", desc: "Documentation, training, and support so the value continues after the engagement ends." },
  ],
  values: [
    { title: "Senior attention", desc: "Experienced practitioners on every engagement, from first call to final deliverable.", icon: "UserCheck" },
    { title: "Radical clarity", desc: "Scope, cost, and timelines agreed in writing before work begins.", icon: "FileCheck" },
    { title: "Accountability", desc: "Regular reporting and honest updates — including when a plan needs to change.", icon: "ClipboardCheck" },
    { title: "Long-term thinking", desc: "Recommendations are built to hold up beyond the engagement, not just to close it.", icon: "TrendingUp" },
  ],
  gallery: [
    { url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=85&w=1200", title: "Strategy sessions", subtitle: "Decisions made with evidence", aspect: "landscape" },
    { url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=85&w=1000", title: "Client workshops", subtitle: "Hands-on, senior-led", aspect: "square" },
    { url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=85&w=1000", title: "Delivery & review", subtitle: "Transparent reporting", aspect: "portrait" },
    { url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=85&w=1200", title: "Partnership", subtitle: "Beyond the engagement", aspect: "landscape" },
  ],
  articles: [
    { title: "Why scope clarity is the most valuable deliverable", desc: "The single practice that prevents most project failures — and how to get it in writing.", tag: "OPERATIONS" },
    { title: "Making decisions with better evidence", desc: "A practical framework for separating signal from noise when the stakes are high.", tag: "STRATEGY" },
    { title: "What good handover actually looks like", desc: "The difference between a report that gets filed and one that changes how the team works.", tag: "LEADERSHIP" },
  ],
});

const localProfile = (brand: string): KitProfile => ({
  noun: "customer",
  plural: "customers",
  proofLine: "Loved by locals, trusted daily",
  stats: [
    { label: "Happy customers", val: 5200, suffix: "+" },
    { label: "Average rating", val: 4.9, suffix: "★" },
    { label: "Years serving the community", val: 12, suffix: "" },
    { label: "Repeat customers", val: 78, suffix: "%" },
  ],
  testimonials: [
    { name: "Anita Desai", role: "Regular customer", content: "The quality has been consistent since day one. You can tell the team genuinely cares about getting the details right every single time." },
    { name: "Suresh Kumar", role: "Local resident", content: "Friendly, reliable, and honest. This is the kind of place you recommend to family without a second thought." },
    { name: "Priya Nambiar", role: "First-time visitor", content: "Great experience from the moment I walked in. Warm service, fair pricing, and a result that exceeded expectations." },
  ],
  faqs: [
    { q: "Do I need to book in advance?", a: "Walk-ins are welcome, but booking ahead guarantees your slot and helps us prepare — especially on weekends and holidays." },
    { q: "What are your opening hours?", a: "We operate seven days a week, with extended hours on weekends. The contact page shows our current schedule." },
    { q: "Do you take online orders or payments?", a: "Yes — order and pay online through the site, or reach us directly on WhatsApp for a quick response." },
    { q: "Where exactly are you located?", a: "We are located in the heart of the neighbourhood with parking nearby. Directions and a map are on the contact page." },
  ],
  steps: [
    { title: "Reach out", desc: "Book online, message us, or walk in — whichever is easiest for you." },
    { title: "We prepare", desc: "Your request is confirmed and prepared with care and attention to detail." },
    { title: "Enjoy the result", desc: "Pick up, get it delivered, or settle in — and tell us how we did." },
    { title: "Come back", desc: "We reward regulars with offers, updates, and a welcome that feels like home." },
  ],
  values: [
    { title: "Quality first", desc: "We use the best ingredients, materials, and craft — and it shows in the result.", icon: "Award" },
    { title: "Fair pricing", desc: "Honest, transparent pricing with no hidden charges, ever.", icon: "BadgeIndianRupee" },
    { title: "Friendly service", desc: "A team that treats every customer like a neighbour — because you are.", icon: "Heart" },
    { title: "Local commitment", desc: "We are part of this community and proud to serve it every day.", icon: "MapPin" },
  ],
  gallery: [
    { url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=85&w=1200", title: "Inside the space", subtitle: "Designed for comfort", aspect: "landscape" },
    { url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=85&w=1000", title: "Our craft", subtitle: "Attention to detail", aspect: "square" },
    { url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=85&w=1000", title: "Happy customers", subtitle: "Day in, day out", aspect: "portrait" },
    { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=85&w=1200", title: "The neighbourhood", subtitle: "Proud to be local", aspect: "landscape" },
  ],
  articles: [
    { title: "What makes this neighbourhood special", desc: "The people, the stories, and why staying local matters more than ever.", tag: "COMMUNITY" },
    { title: "Behind the scenes: how we keep quality consistent", desc: "The small rituals and standards that make every visit feel the same — and excellent.", tag: "CRAFT" },
    { title: "Seasonal highlights you should try", desc: "Our favourite limited offerings, and when to find them.", tag: "SEASONAL" },
  ],
});

const creativeProfile = (brand: string): KitProfile => ({
  noun: "client",
  plural: "clients",
  proofLine: "Work we're proud to sign",
  stats: [
    { label: "Projects delivered", val: 320, suffix: "+" },
    { label: "Awards & features", val: 24, suffix: "" },
    { label: "Client return rate", val: 68, suffix: "%" },
    { label: "Collaborators", val: 40, suffix: "+" },
  ],
  testimonials: [
    { name: "Nikhil Sharma", role: "Founder · Wellness brand", content: "They understood the feeling we were chasing before we could articulate it. The result gave our brand a voice we finally recognise as our own." },
    { name: "Aisha Khan", role: "Creative director", content: "Rare combination of craft and process. Every deliverable arrived on time, on budget, and above expectation." },
    { name: "Vivek Rao", role: "Restaurateur", content: "The work elevated everything — our identity, our space, our confidence. It paid for itself many times over." },
  ],
  faqs: [
    { q: "How do we begin a project?", a: "Share a few references and a short note about what you need. We reply with honest feedback on fit, scope, and next steps." },
    { q: "What does the process look like?", a: "Discovery, direction, execution, and delivery — with clear milestones, moodboards, and your sign-off at every stage." },
    { q: "How long does a typical project take?", a: "Most projects run two to six weeks depending on scope. Timelines and milestones are agreed before we start." },
    { q: "Can we see work in progress?", a: "Absolutely. We share progress regularly and welcome feedback at every checkpoint — collaboration is part of the craft." },
  ],
  steps: [
    { title: "Listen", desc: "We start with the story, the audience, and the feeling the work needs to carry." },
    { title: "Explore", desc: "Moodboards, directions, and rough ideas — narrowed with your input." },
    { title: "Craft", desc: "Focused execution with regular progress checkpoints and honest feedback." },
    { title: "Deliver", desc: "Final files, guidance, and support so the work lives on beyond the project." },
  ],
  values: [
    { title: "Original thinking", desc: "No templates, no shortcuts — every project gets a point of view.", icon: "Lightbulb" },
    { title: "Craft & care", desc: "The details are the work. Nothing ships until it feels right.", icon: "PenTool" },
    { title: "Clear collaboration", desc: "Honest communication, fair timelines, and your sign-off at every step.", icon: "MessagesSquare" },
    { title: "Made to last", desc: "Work built to hold up across platforms, seasons, and years.", icon: "Infinity" },
  ],
  gallery: [
    { url: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=85&w=1200", title: "Identity systems", subtitle: "Brands with backbone", aspect: "landscape" },
    { url: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&q=85&w=1000", title: "Digital experiences", subtitle: "Useful and memorable", aspect: "square" },
    { url: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&q=85&w=1000", title: "Editorial & campaigns", subtitle: "Stories with staying power", aspect: "portrait" },
    { url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=85&w=1200", title: "Studio life", subtitle: "Where the work happens", aspect: "landscape" },
  ],
  articles: [
    { title: "The discipline of a strong brief", desc: "Why the quality of the question determines the quality of the work.", tag: "PROCESS" },
    { title: "Details people feel but can't name", desc: "On the small choices that separate good work from memorable work.", tag: "CRAFT" },
    { title: "Collaborating with clients the right way", desc: "How to give feedback that improves work instead of flattening it.", tag: "COLLABORATION" },
  ],
});

const premiumProfile = (brand: string): KitProfile => ({
  noun: "client",
  plural: "clients",
  proofLine: "Trusted by teams that expect more",
  stats: [
    { label: "Clients served", val: 860, suffix: "+" },
    { label: "Engagements delivered", val: 1400, suffix: "+" },
    { label: "Average NPS", val: 74, suffix: "" },
    { label: "Years of experience", val: 18, suffix: "" },
  ],
  testimonials: [
    { name: "Deepak Choudhary", role: "CEO · Fintech startup", content: "From first conversation to delivery, the process was impeccable. Senior people, clear milestones, and results that moved real numbers." },
    { name: "Ananya Singh", role: "VP Product · SaaS company", content: "They operate like an extension of our team — direct, accountable, and obsessed with outcomes rather than outputs." },
    { name: "Harish Nair", role: "Managing partner", content: "Rare to find this level of polish and pragmatism in one partner. The engagement exceeded every expectation we had." },
  ],
  faqs: [
    { q: "How do we know if this is the right fit?", a: "Start with a conversation. We are honest about whether we can genuinely help — sometimes the right answer is a different partner or a simpler path." },
    { q: "What makes your approach different?", a: "Senior practitioners, agreed scope, transparent reporting, and a focus on outcomes you can measure — not activity you have to trust blindly." },
    { q: "How are engagements structured?", a: "Most begin with a focused discovery phase, followed by an agreed plan with milestones, checkpoints, and fixed pricing for defined scope." },
    { q: "Do you work with early-stage teams?", a: "Yes. We calibrate scope and pace to the stage of the business, and several long-term relationships began as single focused engagements." },
  ],
  steps: [
    { title: "Understand", desc: "A senior-led conversation about the outcome, the constraints, and what 'done' looks like." },
    { title: "Align", desc: "A written plan with scope, milestones, and cost — signed off by everyone involved." },
    { title: "Deliver", desc: "Focused execution with regular checkpoints and transparent reporting throughout." },
    { title: "Evolve", desc: "Post-delivery review, documentation, and a clear path for what comes next." },
  ],
  values: [
    { title: "Outcome focus", desc: "We measure success by the results you can see, not the hours we log.", icon: "Target" },
    { title: "Senior team", desc: "Experienced practitioners lead every engagement from start to finish.", icon: "UserCheck" },
    { title: "Transparent process", desc: "Clear scope, milestones, and reporting — no surprises, ever.", icon: "Eye" },
    { title: "Built to scale", desc: "Recommendations and systems designed for the long term, not the quick win.", icon: "TrendingUp" },
  ],
  gallery: [
    { url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=85&w=1200", title: "Where ideas begin", subtitle: "Focused, senior-led sessions", aspect: "landscape" },
    { url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=85&w=1000", title: "Collaboration", subtitle: "Partners, not vendors", aspect: "square" },
    { url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=85&w=1000", title: "Execution", subtitle: "Milestones you can verify", aspect: "portrait" },
    { url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=85&w=1200", title: "The team", subtitle: "Experience in the room", aspect: "landscape" },
  ],
  articles: [
    { title: "The compounding value of clear scope", desc: "How written agreements reduce cost, risk, and friction across every engagement.", tag: "STRATEGY" },
    { title: "Outcomes versus outputs", desc: "A practical lens for measuring whether work actually moved the business.", tag: "LEADERSHIP" },
    { title: "Building partnerships that outlast projects", desc: "The practices that turn one engagement into a decade of trust.", tag: "RELATIONSHIPS" },
  ],
});

export function profileForKit(kit: Pick<SiteKit, "category" | "id">, brand: string): KitProfile {
  const category = kit.category || "";
  if (category.includes("Education")) return educationProfile(brand);
  if (category.includes("Professional")) return servicesProfile(brand);
  if (category.includes("Local Business")) return localProfile(brand);
  if (category.includes("Creative")) return creativeProfile(brand);
  return premiumProfile(brand);
}

// --------------------------------------------------------------------
// SECTION BUILDERS — each returns a themed, real-looking block
// --------------------------------------------------------------------

function statsSection(theme: KitTheme, profile: KitProfile): WebBlock {
  return block(
    "Special",
    "stats-grid",
    {
      badge: profile.proofLine.toUpperCase(),
      title: "Numbers that back the story.",
      subtitle: `${profile.proofLine}. Real figures from our day-to-day work — not marketing adjectives.`,
      stats: profile.stats.map((s) => ({ id: uid(), label: s.label, val: s.val, suffix: s.suffix })),
    },
    theme.light({ textAlign: "center", titleSize: 40 }),
  );
}

function processSection(theme: KitTheme, profile: KitProfile, brand: string): WebBlock {
  const how = profile.noun === "customer" || profile.noun === "student" ? "experience" : "engagement";
  return block(
    "Special",
    "steps-path",
    {
      badge: "HOW WE WORK",
      title: `A clear path, from first hello to final result.`,
      subtitle: `No mystery, no surprises — a deliberate process refined over many real ${how}s.`,
      steps: profile.steps.map((s, i) => ({
        id: uid(),
        step: String(i + 1).padStart(2, "0"),
        title: s.title,
        desc: s.desc,
      })),
    },
    theme.dark({ useGradient: false, titleSize: 42 }),
  );
}

function testimonialsSection(theme: KitTheme, profile: KitProfile): WebBlock {
  return block(
    "Testimonials",
    "review-cards",
    {
      badge: "CLIENT STORIES",
      title: "Don't take our word for it.",
      subtitle: "Here's what people say after working with us.",
      testimonials: profile.testimonials.map((t) => ({
        id: uid(),
        name: t.name,
        role: t.role,
        content: t.content,
        avatar: "",
        rating: 5,
      })),
    },
    theme.light({ backgroundColor: "#ffffff", titleSize: 40 }),
  );
}

function faqSection(theme: KitTheme, profile: KitProfile): WebBlock {
  return block(
    "Special",
    "faq-accordions",
    {
      badge: "GOOD QUESTIONS",
      title: "Everything you might want to ask.",
      subtitle: "If your question isn't here, just reach out — we answer everything.",
      btnText: "Ask us anything",
      btnActionType: "link",
      btnActionValue: "contact",
      faqs: profile.faqs.map((f) => ({ id: uid(), q: f.q, a: f.a })),
    },
    theme.dark({ useGradient: false, titleSize: 40 }),
  );
}

function ctaSection(theme: KitTheme, profile: KitProfile, brand: string, ctaSlug = "contact"): WebBlock {
  return block(
    "CTA",
    "gradient-cta",
    {
      badge: "LET'S TALK",
      title: `Ready to get started with ${brand}?`,
      subtitle: "Tell us about your goals and we'll reply within one business day.",
      btnText: "Start the conversation",
      btnActionType: "link",
      btnActionValue: ctaSlug,
    },
    theme.dark({ textAlign: "center", titleSize: 48 }),
  );
}

function valuesSection(theme: KitTheme, profile: KitProfile): WebBlock {
  return block(
    "Features",
    "bento-box",
    {
      badge: "WHY PEOPLE CHOOSE US",
      title: "The standards behind everything we do.",
      subtitle: "These aren't slogans — they're the commitments every engagement starts with.",
      features: profile.values.map((v) => ({ id: uid(), title: v.title, desc: v.desc, icon: v.icon })),
    },
    theme.dark({ useGradient: false, titleSize: 42 }),
  );
}

function gallerySection(theme: KitTheme, profile: KitProfile): WebBlock {
  return block(
    "Gallery",
    "masonry",
    {
      badge: "SELECTED WORK",
      title: "A look at what we've been up to.",
      subtitle: "Moments from recent projects, sessions, and collaborations.",
      galleryImages: profile.gallery.map((g) => ({ id: uid(), ...g })),
    },
    theme.light({ titleSize: 40 }),
  );
}

function newsletterSection(theme: KitTheme, profile: KitProfile): WebBlock {
  return block(
    "Forms",
    "newsletter",
    {
      badge: "STAY IN THE LOOP",
      title: "Get the good stuff, occasionally.",
      subtitle: "Updates, stories, and useful notes — no spam, unsubscribe anytime.",
      btnText: "Subscribe",
      successMessage: "Welcome aboard — we'll be in touch soon.",
      whatsappFollowUp: false,
    },
    theme.light({ textAlign: "center", titleSize: 36 }),
  );
}

function articlesSection(theme: KitTheme, profile: KitProfile): WebBlock {
  return block(
    "Features",
    "feature-grid",
    {
      badge: "LATEST WRITING",
      title: "Notes from the field.",
      subtitle: "Practical thinking on the work we do every day.",
      features: profile.articles.map((a) => ({
        id: uid(),
        title: a.title,
        desc: a.desc,
        icon: "BookOpen",
        eyebrow: a.tag,
      })),
    },
    theme.light({ backgroundColor: "#ffffff", titleSize: 40 }),
  );
}

// --------------------------------------------------------------------
// PAGE ENRICHMENT
// Fills every kit page to real-website depth, skipping section types
// the page already has so nothing duplicates.
// --------------------------------------------------------------------

interface PagePlan {
  /** Allowed section builders to add */
  add: Array<(theme: KitTheme, profile: KitProfile, brand: string) => WebBlock>;
}

function planForSlug(slug: string): PagePlan {
  const home: PagePlan = { add: [statsSection, processSection, testimonialsSection, gallerySection, faqSection, ctaSection] };
  const listing: PagePlan = { add: [processSection, testimonialsSection, faqSection, ctaSection] };
  const about: PagePlan = { add: [valuesSection, gallerySection, testimonialsSection, faqSection, ctaSection] };
  const blog: PagePlan = { add: [articlesSection, newsletterSection, faqSection, ctaSection] };
  const contact: PagePlan = { add: [faqSection, ctaSection] };

  if (slug === "home") return home;
  if (["contact", "apply", "reserve", "booking", "enquiry", "joined-course", "student-portal"].includes(slug)) return contact;
  if (["journal", "insights", "blog", "news"].includes(slug)) return blog;
  if (["about", "studio", "team", "mentors", "trainers"].includes(slug)) return about;
  return listing;
}

function typePresent(page: SiteKitPage, type: string): boolean {
  return page.blocks.some((b) => b.type === type);
}

export function enrichKitSite(
  site: { header: WebBlock; footer: WebBlock; pages: SiteKitPage[]; products?: any[] },
  kit: Pick<SiteKit, "category" | "id">,
): { header: WebBlock; footer: WebBlock; pages: SiteKitPage[]; products?: any[] } {
  const brand = (site.header as any).title || "Our Business";
  const headerStyles = (site.header as any).styles || {};
  const accent: string = headerStyles.accentColor || "#f4c95d";
  const maxWidth: number = headerStyles.maxWidth || 1180;
  const darkBg: string = headerStyles.backgroundColor || "#0a0f1d";

  const theme: KitTheme = {
    accent,
    maxWidth,
    dark: (o = {}) => ({ ...dark(accent), backgroundColor: darkBg, maxWidth, ...o }),
    light: (o = {}) => ({ ...light(accent), maxWidth, ...o }),
  };

  const profile = profileForKit(kit, brand);
  // Find the natural conversion page slug for CTAs
  const conversionSlug =
    site.pages.find((p) => ["contact", "apply", "reserve", "booking", "enquiry"].includes(p.slug))?.slug ||
    site.pages[site.pages.length - 1]?.slug ||
    "contact";

  const pages = site.pages.map((pageItem) => {
    const plan = planForSlug(pageItem.slug);
    const additions: WebBlock[] = [];

    // Only add a section if the page genuinely lacks it (type-level check)
    for (const builder of plan.add) {
      let skip = false;
      // Rough type mapping for dedupe
      const typeHint = builder.name.replace(/Section$/, "");
      if (typeHint === "stats" && (typePresent(pageItem, "Special") && pageItem.blocks.some((b) => ["stats-grid", "premium-proof-rail", "premium-results-metrics"].includes(b.variant)))) skip = true;
      if (typeHint === "process" && (typePresent(pageItem, "Special") && pageItem.blocks.some((b) => ["steps-path", "premium-roadmap", "academy-process"].includes(b.variant)))) skip = true;
      if (typeHint === "faq" && (typePresent(pageItem, "Special") && pageItem.blocks.some((b) => ["faq-accordions", "faq-accordion", "premium-faq", "signature-faq"].includes(b.variant)))) skip = true;
      if (typeHint === "testimonials" && typePresent(pageItem, "Testimonials")) skip = true;
      if (typeHint === "gallery" && typePresent(pageItem, "Gallery")) skip = true;
      if (typeHint === "values" && typePresent(pageItem, "Features")) skip = true;
      if (typeHint === "articles" && typePresent(pageItem, "Features")) skip = true;
      if (typeHint === "newsletter" && (typePresent(pageItem, "Forms") && pageItem.blocks.some((b) => b.variant === "newsletter"))) skip = true;
      if (typeHint === "cta" && typePresent(pageItem, "CTA")) skip = true;
      if (!skip) additions.push(builder(theme, profile, brand));
    }

    // CTA blocks need the conversion slug bound
    const finalBlocks = additions.map((b) => {
      if (b.type === "CTA") {
        return { ...b, btnActionValue: conversionSlug };
      }
      return b;
    });

    return { ...pageItem, blocks: [...pageItem.blocks, ...finalBlocks] };
  });

  return { ...site, pages };
}
import type { BlockCSSStyles, WebBlock } from './builder-types';
import type { SiteKit, SiteKitPage, SiteKitProduct } from "./site-kits";
import { block, page, dark, light, id } from "./site-kits";
import { kitChrome } from "./site-kits-extra";

// =====================================================================
// KIT 9 · ZENITH FITNESS — education & courses
// A premium fitness studio: charcoal + lime, class-led energy.
// =====================================================================
function buildZenithFitness(businessName: string) {
  const brand = businessName || "Zenith Fitness";
  const accent = "#a3e635";
  const pages = [
    { name: "Home", slug: "home" },
    { name: "Classes", slug: "classes" },
    { name: "Trainers", slug: "trainers" },
    { name: "Pricing", slug: "pricing" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = kitChrome(brand, pages, {
    accent,
    navVariant: "nav-academy",
    tagline: "Small-group training and coaching that actually changes how you feel.",
    contactEmail: "hello@zenith.fit",
    contactPhone: "+91 98450 77120",
    contactAddress: "Indiranagar · Bengaluru",
    ctaLabel: "Book a free class",
    ctaSlug: "contact",
  });
  const darkStyle = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...dark(accent),
    backgroundColor: "#101312",
    backgroundGradient: "linear-gradient(135deg, #101312 0%, #1a1f18 58%, #232b1c 100%)",
    maxWidth: 1180,
    titleSize: 58,
    cardBgColor: "#1a2018",
    cardBorderColor: "#333c2c",
    cardBorderRadius: 22,
    buttonBorderRadius: 999,
    ...overrides,
  });
  const lightStyle = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...light("#4d7c0f"),
    backgroundColor: "#f7f9f3",
    maxWidth: 1180,
    titleSize: 44,
    cardBgColor: "#ffffff",
    cardBorderColor: "#e3e9d8",
    cardBorderRadius: 22,
    buttonBorderRadius: 999,
    ...overrides,
  });

  const classes = [
    { id: id(), title: "Strength Foundations", desc: "Barbell and bodyweight work for real strength, coached form by form.", icon: "Dumbbell", eyebrow: "BEGINNER" },
    { id: id(), title: "HIIT 45", desc: "Forty-five minutes of intervals that end before the boredom does.", icon: "Zap", eyebrow: "ALL LEVELS" },
    { id: id(), title: "Mobility & Recovery", desc: "Movement quality, breath, and the work that keeps you training for decades.", icon: "HeartPulse", eyebrow: "ALL LEVELS" },
    { id: id(), title: "Performance Athlete", desc: "Speed, power, and conditioning for competitive sport.", icon: "Trophy", eyebrow: "ADVANCED" },
  ];

  const pagesBuilt: SiteKitPage[] = [
    page(
      "Home",
      "home",
      `${brand} | Premium fitness studio in Bengaluru`,
      `${brand} is a small-group training studio in Indiranagar with coaching-led classes, expert trainers, and clear memberships.`,
      [
        block("Hero", "academy-cinematic", {
          badge: "SMALL-GROUP TRAINING · INDIRANAGAR · FREE FIRST CLASS",
          title: "Stronger is a decision you make here.",
          subtitle: "Coached small-group classes, honest programming, and trainers who watch your form — not their phones.",
          imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=85&w=1600",
          btnText: "Book a free class",
          btnActionType: "link",
          btnActionValue: "contact",
          secondaryBtnText: "See the classes",
          secondaryBtnActionType: "link",
          secondaryBtnActionValue: "classes",
        }, darkStyle({ titleSize: 64 })),
        block("Special", "premium-proof-rail", {
          badge: "THE ZENITH STANDARD",
          title: "Coaching that shows up in numbers.",
          stats: [
            { id: id(), label: "Coached classes weekly", val: 60, suffix: "+" },
            { id: id(), label: "Member retention", val: 92, suffix: "%" },
            { id: id(), label: "Avg. sessions per member", val: 4, suffix: "/wk" },
            { id: id(), label: "Member-to-coach ratio", val: 8, suffix: ":1" },
          ],
        }, darkStyle({ backgroundColor: "#0d100f" })),
        block("Features", "academy-courses", {
          badge: "OUR CLASSES",
          title: "Four formats. One coaching standard.",
          subtitle: "Every class is capped, coached, and programmed around your progress.",
          features: classes,
        }, darkStyle()),
        block("Testimonials", "premium-testimonial-carousel", {
          badge: "MEMBER STORIES",
          title: "People who kept showing up.",
          subtitle: "Real members, real results, no before/after photos needed.",
          testimonials: [
            { id: id(), name: "Ananya Krishnan", role: "Member · 18 months", content: "I had tried gyms for years and quit every time. The coaching here made me understand my own body — I have not missed a week in a year and a half.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Vikram Sethi", role: "Member · Performance track", content: "The programming is the difference. Every session has a purpose, and the coaches adjust on the spot when something does not feel right.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Meera Iyer", role: "Member · Mobility", content: "At 46 I wanted strength, not punishment. The mobility and recovery work has completely changed how my back feels day to day.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=240", rating: 5 },
          ],
        }, lightStyle()),
        block("CTA", "image-bg-cta", {
          badge: "FIRST CLASS FREE",
          title: "Come try one session. Bring your questions.",
          subtitle: "No membership pitch on the first visit — just a proper coached class and honest advice.",
          btnText: "Book your free class",
          btnActionType: "link",
          btnActionValue: "contact",
          imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=85&w=1600",
        }, darkStyle({ textAlign: "center", titleSize: 50 })),
      ],
    ),
    page(
      "Classes",
      "classes",
      `${brand} | Class schedule & formats`,
      `Explore the ${brand} class formats, schedule, and coaching standards.`,
      [
        block("Hero", "editorial-stack", {
          badge: "CLASSES",
          title: "A schedule built for consistency.",
          subtitle: "Sixty-plus coached sessions a week across four formats — mornings, evenings, and weekends.",
          btnText: "Book a class",
          btnActionType: "link",
          btnActionValue: "contact",
        }, lightStyle({ titleSize: 54 })),
        block("Features", "feature-grid", {
          badge: "FORMATS",
          title: "Find your format.",
          subtitle: "Every format is capped at eight members per coach.",
          features: classes,
        }, lightStyle({ backgroundColor: "#f7f9f3" })),
        block("Special", "premium-faq", {
          badge: "GOOD TO KNOW",
          title: "Before your first class.",
          subtitle: "The practical details new members usually ask about.",
          btnText: "Ask the team",
          btnActionType: "link",
          btnActionValue: "contact",
          faqs: [
            { id: id(), q: "What should I bring?", a: "Training shoes, a water bottle, and a towel. Everything else — barbells, kettlebells, mats — is in the studio." },
            { id: id(), q: "I have never trained. Is that ok?", a: "That is exactly who we are built for. The Strength Foundations track starts from absolute zero with coached progressions." },
            { id: id(), q: "Can I pause my membership?", a: "Yes — memberships pause for travel, injury, or life. No awkward conversations." },
          ],
        }, darkStyle()),
      ],
    ),
    page(
      "Trainers",
      "trainers",
      `${brand} | Meet the coaches`,
      `Meet the certified coaching team behind ${brand}.`,
      [
        block("Hero", "academy-cinematic", {
          badge: "THE COACHES",
          title: "Certified, experienced, and on the floor.",
          subtitle: "No salespeople on the gym floor — just coaches who train, teach, and actually coach.",
          imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=85&w=1600",
          btnText: "Train with us",
          btnActionType: "link",
          btnActionValue: "contact",
        }, darkStyle()),
        block("Features", "premium-bento-grid", {
          badge: "TEAM",
          title: "Coaches worth following.",
          subtitle: "Every coach is certified, continuously educated, and coached themselves.",
          features: [
            { id: id(), title: "Rahul Menon", desc: "Head Coach · 12 years coaching, ex-state powerlifter.", icon: "ShieldCheck", eyebrow: "STRENGTH" },
            { id: id(), title: "Sara Fernandes", desc: "HIIT & Conditioning · NSCA-CPT, sports science background.", icon: "Zap", eyebrow: "CONDITIONING" },
            { id: id(), title: "Dev Patel", desc: "Mobility & Recovery · FRC certified, movement specialist.", icon: "HeartPulse", eyebrow: "MOBILITY" },
          ],
        }, darkStyle({ backgroundColor: "#161b14" })),
        block("Business", "premium-story-split", {
          badge: "COACHING PHILOSOPHY",
          title: "Programming over motivation.",
          subtitle: "Motivation gets you to the door. Good programming keeps you coming back. We write every session with a purpose and review every member's progress monthly.",
          imageUrl: "https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&q=85&w=1400",
          btnText: "Book a free class",
          btnActionType: "link",
          btnActionValue: "contact",
          features: [
            { id: id(), title: "Monthly reviews", desc: "Progress checks with your coach, every month.", icon: "CalendarCheck" },
            { id: id(), title: "Auto-regulation", desc: "Sessions adjust to how you feel — not a rigid plan.", icon: "SlidersHorizontal" },
            { id: id(), title: "Community bench", desc: "The people next to you are the retention plan.", icon: "Users" },
          ],
        }, lightStyle()),
      ],
    ),
    page(
      "Pricing",
      "pricing",
      `${brand} | Memberships & pricing`,
      `Clear, honest ${brand} membership pricing with no hidden fees.`,
      [
        block("Hero", "minimal", {
          badge: "PRICING",
          title: "Simple memberships. Zero joining fees.",
          subtitle: "Pick a plan, pause anytime, and your first class is on us.",
          btnText: "Start with a free class",
          btnActionType: "link",
          btnActionValue: "contact",
        }, darkStyle({ textAlign: "center", titleSize: 54 })),
        block("Pricing", "premium-pricing-toggle", {
          badge: "MEMBERSHIPS",
          title: "Choose how often you train.",
          subtitle: "All plans include coached classes, programming, and the community bench.",
          btnActionType: "link",
          btnActionValue: "contact",
          pricing: [
            { id: id(), tier: "Foundation", price: "₹3,999", features: ["6 classes / month", "Group programming", "Monthly review"], btnText: "Start Foundation", popular: false },
            { id: id(), tier: "Unlimited", price: "₹6,999", features: ["Unlimited classes", "All formats", "Monthly review", "Guest passes"], btnText: "Start Unlimited", popular: true },
            { id: id(), tier: "Performance", price: "₹9,999", features: ["Everything in Unlimited", "Performance track", "Quarterly assessments"], btnText: "Talk to coaching", popular: false },
          ],
        }, darkStyle()),
        block("CTA", "gradient-cta", {
          badge: "READY WHEN YOU ARE",
          title: "Your first class is free.",
          subtitle: "Book it, show up, and decide after you have actually trained with us.",
          btnText: "Book now",
          btnActionType: "link",
          btnActionValue: "contact",
        }, lightStyle()),
      ],
    ),
    page(
      "Contact",
      "contact",
      `${brand} | Book a free class`,
      `Book a free class or visit the ${brand} studio in Indiranagar.`,
      [
        block("Map", "signature-map", {
          badge: "THE STUDIO",
          title: "Find us in Indiranagar.",
          subtitle: "Two minutes from the 100 Feet Road metro exit. Free member parking on site.",
          mapAddress: "Indiranagar, Bengaluru, Karnataka, India",
          contactPhone: "+91 98450 77120",
          contactEmail: "hello@zenith.fit",
          contactAddress: "Indiranagar · Bengaluru",
          btnText: "Get directions",
        }, darkStyle()),
        block("Forms", "premium-contact-panel", {
          badge: "BOOK A FREE CLASS",
          title: "Tell us where to start.",
          subtitle: "We will reply within a few hours with class options that fit your schedule.",
          btnText: "Book my free class",
          contactEmail: "hello@zenith.fit",
          contactPhone: "+91 98450 77120",
          contactAddress: "Indiranagar · Bengaluru",
          successMessage: "Thanks — the team will be in touch with class options within a few hours.",
          whatsappFollowUp: true,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Email", name: "email", type: "email", placeholder: "you@example.com", required: true, width: "half" },
            { id: id(), label: "Phone", name: "phone", type: "tel", placeholder: "+91 98765 43210", required: true, width: "half" },
            { id: id(), label: "Interested format", name: "format", type: "select", required: true, width: "half", options: ["Strength Foundations", "HIIT 45", "Mobility & Recovery", "Performance Athlete", "Not sure yet"] },
          ],
        }, lightStyle({ backgroundColor: "#f7f9f3" })),
      ],
    ),
  ];

  const products: SiteKitProduct[] = [
    { title: "Foundation Membership", description: "Six coached classes a month with group programming.", price: 3999, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=85&w=1000", category: "Memberships", tags: ["Monthly"], badge: "Start here" },
    { title: "Unlimited Membership", description: "Unlimited coached classes across every format.", price: 6999, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=85&w=1000", category: "Memberships", tags: ["Monthly"], badge: "Most popular" },
    { title: "Performance Track", description: "Unlimited classes plus performance programming and quarterly assessments.", price: 9999, compareAtPrice: 11999, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=85&w=1000", category: "Memberships", tags: ["Advanced"], badge: "Limited spots" },
  ];

  return { ...chrome, pages: pagesBuilt, products };
}

// =====================================================================
// KIT 10 · MERIDIAN LAW — professional services
// A law firm: deep navy + brass, restrained and authoritative.
// =====================================================================
function buildMeridianLaw(businessName: string) {
  const brand = businessName || "Meridian Law";
  const accent = "#d4af37";
  const pages = [
    { name: "Home", slug: "home" },
    { name: "Practice Areas", slug: "practice-areas" },
    { name: "Team", slug: "team" },
    { name: "Insights", slug: "insights" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = kitChrome(brand, pages, {
    accent,
    tone: "light",
    tagline: "Clear advice, careful advocacy, and counsel you can actually talk to.",
    contactEmail: "counsel@meridianlaw.in",
    contactPhone: "+91 80 4123 4567",
    contactAddress: "MG Road · Bengaluru",
    ctaLabel: "Book a consultation",
    ctaSlug: "contact",
  });
  const navy = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...dark(accent),
    backgroundColor: "#0b1220",
    backgroundGradient: "linear-gradient(135deg, #0b1220 0%, #12203a 60%, #16294a 100%)",
    maxWidth: 1180,
    titleSize: 56,
    cardBgColor: "#101a30",
    cardBorderColor: "#2a3a5c",
    buttonBorderRadius: 4,
    ...overrides,
  });
  const paper = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...light("#8a6d1f"),
    backgroundColor: "#f8f7f3",
    maxWidth: 1180,
    titleSize: 44,
    cardBgColor: "#ffffff",
    cardBorderColor: "#e2ded2",
    buttonBorderRadius: 4,
    ...overrides,
  });

  const practiceAreas = [
    { id: id(), title: "Corporate & Commercial", desc: "Contracts, governance, M&A, and founder counsel for growing businesses.", icon: "Building2" },
    { id: id(), title: "Dispute Resolution", desc: "Litigation and arbitration with a strategy first, papers second approach.", icon: "Scale" },
    { id: id(), title: "Employment Law", desc: "Policies, exits, and difficult conversations handled with care.", icon: "Users" },
    { id: id(), title: "Intellectual Property", desc: "Trademarks, copyright, and the agreements that protect your work.", icon: "Lightbulb" },
    { id: id(), title: "Real Estate", desc: "Acquisition, leasing, and due diligence that closes on time.", icon: "Landmark" },
    { id: id(), title: "Startup & Venture", desc: "Cap tables, term sheets, and the legal plumbing of raising money.", icon: "Rocket" },
  ];

  const pagesBuilt: SiteKitPage[] = [
    page(
      "Home",
      "home",
      `${brand} | Corporate & commercial law firm`,
      `${brand} is a Bengaluru law firm advising founders, companies, and families with clear, practical counsel.`,
      [
        block("Hero", "split", {
          badge: "CORPORATE & COMMERCIAL LAW · BENGALURU",
          title: "Legal advice you can act on.",
          subtitle: "We turn legal complexity into plain choices — so you can make the decision and move on.",
          imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=85&w=1600",
          btnText: "Book a consultation",
          btnActionType: "link",
          btnActionValue: "contact",
          secondaryBtnText: "Practice areas",
          secondaryBtnActionType: "link",
          secondaryBtnActionValue: "practice-areas",
        }, navy({ titleSize: 60 })),
        block("Special", "premium-proof-rail", {
          badge: "THE FIRM",
          title: "The practice in numbers.",
          stats: [
            { id: id(), label: "Matters handled", val: 1800, suffix: "+" },
            { id: id(), label: "Startups advised", val: 300, suffix: "+" },
            { id: id(), label: "Partners", val: 14, suffix: "" },
            { id: id(), label: "Years in practice", val: 22, suffix: "" },
          ],
        }, navy({ backgroundColor: "#0e1626" })),
        block("Features", "signature-bento", {
          badge: "PRACTICE AREAS",
          title: "Six practices, one standard of care.",
          subtitle: "Matters are led by partners and staffed by lawyers who know your business, not just your file.",
          features: practiceAreas,
        }, paper()),
        block("Business", "premium-story-split", {
          badge: "HOW WE WORK",
          title: "The advice before the document.",
          subtitle: "Most legal problems are business problems first. We start by understanding what you are actually trying to achieve — then build the legal structure around it.",
          imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=85&w=1400",
          btnText: "Meet the team",
          btnActionType: "link",
          btnActionValue: "team",
          features: [
            { id: id(), title: "Partner-led", desc: "A partner owns every matter, end to end.", icon: "ShieldCheck" },
            { id: id(), title: "Fixed or capped fees", desc: "Transparent billing agreed before work begins.", icon: "FileCheck" },
            { id: id(), title: "Plain language", desc: "Opinions you can read on one page.", icon: "MessageSquare" },
          ],
        }, navy()),
        block("CTA", "simple-cta", {
          badge: "CONSULTATIONS",
          title: "Bring us the decision you have been avoiding.",
          subtitle: "A 45-minute consultation to understand your position and outline the options.",
          btnText: "Book a consultation",
          btnActionType: "link",
          btnActionValue: "contact",
        }, navy({ textAlign: "center", titleSize: 50 })),
      ],
    ),
    page(
      "Practice Areas",
      "practice-areas",
      `${brand} | Practice areas`,
      `Explore the ${brand} practice areas across corporate, disputes, employment, IP, real estate, and venture.`,
      [
        block("Hero", "editorial-stack", {
          badge: "PRACTICE AREAS",
          title: "Depth where you need it.",
          subtitle: "Focused practices, each led by a partner who has spent years in that field.",
          btnText: "Book a consultation",
          btnActionType: "link",
          btnActionValue: "contact",
        }, paper({ titleSize: 54 })),
        block("Features", "feature-grid", {
          badge: "WHAT WE DO",
          title: "The full spectrum.",
          subtitle: "From the first founder agreement to the dispute you hope never happens.",
          features: practiceAreas,
        }, paper({ backgroundColor: "#f8f7f3" })),
        block("Special", "premium-faq", {
          badge: "COMMON QUESTIONS",
          title: "Practical answers, up front.",
          subtitle: "The questions every client asks in the first meeting.",
          btnText: "Ask us directly",
          btnActionType: "link",
          btnActionValue: "contact",
          faqs: [
            { id: id(), q: "How are your fees structured?", a: "Fixed fees for defined work, capped fees for open-ended matters, and always agreed in writing before we start." },
            { id: id(), q: "Do you work with early-stage companies?", a: "Yes — over half our practice is founders and early-stage teams, often on monthly retainer." },
            { id: id(), q: "Can you act across multiple cities?", a: "We are based in Bengaluru and work across India with a network of counsel for matters elsewhere." },
          ],
        }, navy()),
      ],
    ),
    page(
      "Team",
      "team",
      `${brand} | Our lawyers`,
      `Meet the partners and senior lawyers of ${brand}.`,
      [
        block("Hero", "minimal", {
          badge: "THE TEAM",
          title: "Lawyers you will know by name.",
          subtitle: "Fourteen partners, no rotating cast of unfamiliar associates.",
          btnText: "Book a consultation",
          btnActionType: "link",
          btnActionValue: "contact",
        }, navy({ textAlign: "center", titleSize: 54 })),
        block("Features", "premium-bento-grid", {
          badge: "PARTNERS",
          title: "The partners who lead matters.",
          subtitle: "Each practice area is led by a partner with deep domain experience.",
          features: [
            { id: id(), title: "Arjun Mehta", desc: "Managing Partner · Corporate & M&A, 20 years.", icon: "Briefcase", eyebrow: "CORPORATE" },
            { id: id(), title: "Nisha Rao", desc: "Partner · Dispute Resolution, ex-high court advocate.", icon: "Scale", eyebrow: "DISPUTES" },
            { id: id(), title: "Karan Shah", desc: "Partner · Startup & Venture, works with 100+ funded startups.", icon: "Rocket", eyebrow: "VENTURE" },
          ],
        }, paper()),
        block("Business", "premium-story-split", {
          badge: "HIRING & CAREERS",
          title: "A firm where juniors become partners.",
          subtitle: "We invest in our people deliberately — structured training, real responsibility, and a clear path to partnership.",
          imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=85&w=1400",
          btnText: "Get in touch",
          btnActionType: "link",
          btnActionValue: "contact",
          features: [
            { id: id(), title: "Structured mentorship", desc: "Every junior is paired with a partner.", icon: "GraduationCap" },
            { id: id(), title: "Real responsibility", desc: "Court appearances and client calls from year one.", icon: "Briefcase" },
            { id: id(), title: "Clear path", desc: "Associate to partner, on merit and work product.", icon: "TrendingUp" },
          ],
        }, navy()),
      ],
    ),
    page(
      "Insights",
      "insights",
      `${brand} | Legal insights`,
      `Practical legal notes and commentary from the ${brand} team.`,
      [
        block("Hero", "mono-grid", {
          badge: "INSIGHTS",
          title: "Notes from practice.",
          subtitle: "Short, practical writing on the legal questions founders and companies actually face.",
          btnText: "Book a consultation",
          btnActionType: "link",
          btnActionValue: "contact",
        }, paper({ backgroundColor: "#ffffff", titleSize: 54 })),
        block("Text", "article-body", {
          badge: "FOUNDERS",
          title: "The five clauses that quietly hurt founders.",
          subtitle: "Vesting, board control, information rights, non-compete, and exit mechanics — the clauses founders sign without reading, and regret later. Here is what each one actually does and where the negotiation room really is.",
        }, paper({ maxWidth: 860, titleSize: 42 })),
        block("Special", "faq-accordions", {
          badge: "START HERE",
          title: "Questions every founder asks.",
          subtitle: "Straight answers on common founder legal questions.",
          faqs: [
            { id: id(), q: "When should I incorporate?", a: "As soon as you take money from anyone other than yourself — even a friend or family member. The paperwork is small; the protection is large." },
            { id: id(), q: "Should I use a template contract?", a: "A template is better than nothing, and worse than a lawyer who has seen your specific deal fail before." },
          ],
        }, navy()),
      ],
    ),
    page(
      "Contact",
      "contact",
      `${brand} | Book a consultation`,
      `Book a consultation with ${brand}.`,
      [
        block("Map", "signature-map", {
          badge: "THE OFFICE",
          title: "Counsel begins with a conversation.",
          subtitle: "We meet clients by appointment at our MG Road office, or by video anywhere.",
          mapAddress: "MG Road, Bengaluru, Karnataka, India",
          contactPhone: "+91 80 4123 4567",
          contactEmail: "counsel@meridianlaw.in",
          contactAddress: "MG Road · Bengaluru",
          btnText: "Get directions",
        }, navy()),
        block("Forms", "premium-contact-panel", {
          badge: "CONSULTATION",
          title: "Tell us about the matter.",
          subtitle: "A partner will review your note personally and reply within one business day.",
          btnText: "Request consultation",
          contactEmail: "counsel@meridianlaw.in",
          contactPhone: "+91 80 4123 4567",
          contactAddress: "MG Road · Bengaluru",
          successMessage: "Thank you. A partner will review your matter and reply within one business day.",
          whatsappFollowUp: false,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Email", name: "email", type: "email", placeholder: "you@company.com", required: true, width: "half" },
            { id: id(), label: "Matter type", name: "matter", type: "select", required: true, width: "full", options: ["Corporate & Commercial", "Dispute Resolution", "Employment", "Intellectual Property", "Real Estate", "Startup & Venture", "Other"] },
            { id: id(), label: "Brief summary", name: "message", type: "textarea", placeholder: "A few sentences about the matter", required: true, width: "full" },
          ],
        }, paper({ backgroundColor: "#f8f7f3" })),
      ],
    ),
  ];

  const products: SiteKitProduct[] = [
    { title: "Founder Essentials", description: "Incorporation, founder agreements, and a first set of employment contracts.", price: 85000, image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=85&w=1000", category: "Fixed fee", tags: ["Founders", "Startups"], badge: "Most popular" },
    { title: "Monthly General Counsel", description: "A dedicated lawyer on retainer for the questions that come up monthly.", price: 40000, image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=85&w=1000", category: "Retainer", tags: ["Ongoing"] },
    { title: "Contract Review Pack", description: "Review and redlining of up to ten contracts with a written summary.", price: 30000, compareAtPrice: 36000, image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=85&w=1000", category: "Fixed fee", tags: ["Contracts"] },
  ];

  return { ...chrome, pages: pagesBuilt, products };
}

// =====================================================================
// KIT 11 · VERTEX FINANCE — professional services
// A financial advisory: deep teal + mint, calm and precise.
// =====================================================================
function buildVertexFinance(businessName: string) {
  const brand = businessName || "Vertex Financial";
  const accent = "#2dd4a7";
  const pages = [
    { name: "Home", slug: "home" },
    { name: "Services", slug: "services" },
    { name: "Insights", slug: "insights" },
    { name: "About", slug: "about" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = kitChrome(brand, pages, {
    accent,
    tagline: "Independent financial advice for people and businesses who want clarity.",
    contactEmail: "hello@vertexfinancial.in",
    contactPhone: "+91 80 4455 8899",
    contactAddress: "Koramangala · Bengaluru",
    ctaLabel: "Book a free call",
    ctaSlug: "contact",
  });
  const deep = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...dark(accent),
    backgroundColor: "#06201b",
    backgroundGradient: "linear-gradient(135deg, #06201b 0%, #0a2b24 58%, #10382e 100%)",
    maxWidth: 1180,
    titleSize: 56,
    cardBgColor: "#0a2a23",
    cardBorderColor: "#1d4a3e",
    cardBorderRadius: 18,
    buttonBorderRadius: 999,
    ...overrides,
  });
  const mist = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...light("#0f766e"),
    backgroundColor: "#f2faf7",
    maxWidth: 1180,
    titleSize: 44,
    cardBgColor: "#ffffff",
    cardBorderColor: "#d4e9e1",
    cardBorderRadius: 18,
    buttonBorderRadius: 999,
    ...overrides,
  });

  const services = [
    { id: id(), title: "Personal Financial Planning", desc: "One clear plan for savings, investing, insurance, and goals.", icon: "PiggyBank" },
    { id: id(), title: "Wealth Management", desc: "Portfolio construction and review with no product commissions.", icon: "TrendingUp" },
    { id: id(), title: "Tax Planning", desc: "Structure your year so the tax return is not a surprise.", icon: "Calculator" },
    { id: id(), title: "Retirement Planning", desc: "Know exactly what your retirement looks like on paper.", icon: "Sun" },
    { id: id(), title: "Business Finance", desc: "Cash flow, credit, and capital decisions for founders.", icon: "Briefcase" },
    { id: id(), title: "Estate & Legacy", desc: "Wills, nominations, and passing wealth on without drama.", icon: "Landmark" },
  ];

  const pagesBuilt: SiteKitPage[] = [
    page(
      "Home",
      "home",
      `${brand} | Independent financial advisors`,
      `${brand} provides independent, advice-only financial planning for people and businesses in India.`,
      [
        block("Hero", "gradient-glow", {
          badge: "INDEPENDENT · FEE-ONLY · SEBI-REGISTERED",
          title: "Money, made clear.",
          subtitle: "Independent financial advice with no products to sell and no commissions to hide. Just a plan you can follow.",
          imageUrl: "",
          btnText: "Book a free call",
          btnActionType: "link",
          btnActionValue: "contact",
          secondaryBtnText: "See our services",
          secondaryBtnActionType: "link",
          secondaryBtnActionValue: "services",
        }, deep({ titleSize: 64 })),
        block("Special", "premium-proof-rail", {
          badge: "TRUSTED ADVICE",
          title: "Measured in outcomes.",
          stats: [
            { id: id(), label: "Families advised", val: 900, suffix: "+" },
            { id: id(), label: "Assets under advice", val: 850, suffix: " Cr" },
            { id: id(), label: "Average portfolio return", val: 12.4, suffix: "%" },
            { id: id(), label: "Fee-only, always", val: 100, suffix: "%" },
          ],
        }, deep({ backgroundColor: "#05201a" })),
        block("Features", "bento-box", {
          badge: "SERVICES",
          title: "Every money question, covered.",
          subtitle: "One advisor, one plan, every financial decision in one place.",
          features: services,
        }, deep()),
        block("Business", "premium-story-split", {
          badge: "OUR APPROACH",
          title: "Advice you can take to any bank.",
          subtitle: "We are not tied to any product or provider. Recommendations are made for your benefit and explained so you can verify them yourself.",
          imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=85&w=1400",
          btnText: "How we charge",
          btnActionType: "link",
          btnActionValue: "about",
          features: [
            { id: id(), title: "Fee-only", desc: "A transparent annual fee. Nothing else.", icon: "FileCheck" },
            { id: id(), title: "Fiduciary duty", desc: "Legally bound to act in your interest.", icon: "ShieldCheck" },
            { id: id(), title: "No products", desc: "We never sell mutual funds or insurance.", icon: "XCircle" },
          ],
        }, mist()),
        block("Testimonials", "premium-testimonial-carousel", {
          badge: "CLIENT STORIES",
          title: "What clarity feels like.",
          subtitle: "Clients describe the moment the plan came together.",
          testimonials: [
            { id: id(), name: "Rohit & Sunita", role: "Clients · 4 years", content: "We finally understand our money. One plan, one advisor, and for the first time we are not anxious checking the market.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Lakshmi Menon", role: "Business owner · 2 years", content: "They separated my business finances from my personal goals without judgment and without jargon. Worth every rupee.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Aditya Verma", role: "Client · 6 years", content: "The tax planning alone paid for their fee many times over — and my retirement plan no longer keeps me up at night.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=85&w=240", rating: 5 },
          ],
        }, mist({ backgroundColor: "#f2faf7" })),
        block("CTA", "gradient-cta", {
          badge: "FREE FIRST CALL",
          title: "Bring us your questions.",
          subtitle: "A free 30-minute call to see whether we are the right fit. No obligation, no products.",
          btnText: "Book your free call",
          btnActionType: "link",
          btnActionValue: "contact",
        }, deep({ textAlign: "center", titleSize: 50 })),
      ],
    ),
    page(
      "Services",
      "services",
      `${brand} | Financial services`,
      `Explore the ${brand} services across planning, wealth, tax, retirement, business, and estate.`,
      [
        block("Hero", "editorial-stack", {
          badge: "SERVICES",
          title: "One advisor for the whole picture.",
          subtitle: "Six services, one plan, one relationship that understands your full situation.",
          btnText: "Book a free call",
          btnActionType: "link",
          btnActionValue: "contact",
        }, mist({ titleSize: 54 })),
        block("Features", "feature-grid", {
          badge: "WHAT WE DO",
          title: "The services, in detail.",
          subtitle: "Each service is delivered by the same advisor who did your first plan.",
          features: services,
        }, mist({ backgroundColor: "#f2faf7" })),
        block("Special", "steps-path", {
          badge: "HOW IT WORKS",
          title: "From first call to clear plan.",
          subtitle: "A process designed to produce decisions, not documents.",
          steps: [
            { id: id(), step: "01", title: "Free call", desc: "Understand your situation and whether we fit." },
            { id: id(), step: "02", title: "Deep dive", desc: "A structured review of your money, goals, and risk." },
            { id: id(), step: "03", title: "The plan", desc: "One written plan with decisions, not just options." },
            { id: id(), step: "04", title: "Keep it honest", desc: "Quarterly reviews and ongoing implementation support." },
          ],
        }, deep()),
        block("Special", "premium-faq", {
          badge: "COMMON QUESTIONS",
          title: "What people ask before they start.",
          subtitle: "Honest answers about fees, conflicts, and process.",
          btnText: "Ask us anything",
          btnActionType: "link",
          btnActionValue: "contact",
          faqs: [
            { id: id(), q: "What exactly do you charge?", a: "A transparent annual fee — typically 0.5–1% of assets or a fixed planning fee. No commissions, ever." },
            { id: id(), q: "How is this different from my bank advisor?", a: "Bank advisors earn from products. We earn from advice. That changes every recommendation." },
            { id: id(), q: "Do you manage the money directly?", a: "No. We advise and you execute through your own accounts — so you are never locked to us." },
          ],
        }, mist()),
      ],
    ),
    page(
      "Insights",
      "insights",
      `${brand} | Financial insights`,
      `Practical financial writing from the ${brand} team.`,
      [
        block("Hero", "mono-grid", {
          badge: "INSIGHTS",
          title: "Finance, without the fog.",
          subtitle: "Practical essays on the money decisions that matter.",
          btnText: "Book a free call",
          btnActionType: "link",
          btnActionValue: "contact",
        }, deep({ titleSize: 54 })),
        block("Text", "article-body", {
          badge: "INVESTING",
          title: "The 60/40 portfolio is not dead. It is misunderstood.",
          subtitle: "A balanced portfolio has had a difficult decade — but the argument for diversification was never about any single decade. Here is what the data says, what the critics miss, and what a sensible allocation looks like today.",
        }, mist({ maxWidth: 860, titleSize: 42 })),
        block("Special", "faq-accordions", {
          badge: "START HERE",
          title: "The questions we hear most.",
          subtitle: "Straight answers on starting your financial plan.",
          faqs: [
            { id: id(), q: "I am 30. Do I really need a financial plan?", a: "The best time to build good habits is now. Compounding and tax structuring both reward an early start." },
            { id: id(), q: "Can you help if I have debt?", a: "Yes — debt restructuring is usually the first chapter of the plan, before any investing." },
          ],
        }, deep()),
      ],
    ),
    page(
      "About",
      "about",
      `${brand} | About us`,
      `The people, principles, and fee structure behind ${brand}.`,
      [
        block("Text", "signature-editorial", {
          badge: "OUR STANDING",
          title: "Independence is not a marketing line. It is a structure.",
          subtitle: "Vertex Financial is a SEBI-registered, fee-only advisory. We do not manufacture, distribute, or receive commissions on any financial product.\\n\\nThat structure means our only incentive is the one you care about: your outcomes. It is also why every plan we write can be executed through any bank or broker in India.",
          btnText: "Book a free call",
          btnActionType: "link",
          btnActionValue: "contact",
        }, deep({ titleSize: 60 })),
        block("Pricing", "premium-pricing-toggle", {
          badge: "OUR FEES",
          title: "Transparent, written down.",
          subtitle: "You will see this page before you see our signature.",
          btnActionType: "link",
          btnActionValue: "contact",
          pricing: [
            { id: id(), tier: "Planning", price: "₹35,000", features: ["One-time comprehensive plan", "Tax review", "6 months support"], btnText: "Start planning", popular: false },
            { id: id(), tier: "Ongoing", price: "0.75%", features: ["Everything in Planning", "Quarterly reviews", "Unlimited advice"], btnText: "Become a client", popular: true },
            { id: id(), tier: "Business", price: "₹60,000", features: ["Business & personal plan", "Cash flow setup", "Dedicated advisor"], btnText: "Talk to us", popular: false },
          ],
        }, mist()),
        block("Business", "premium-story-split", {
          badge: "THE TEAM",
          title: "Small team, senior hands.",
          subtitle: "Every client works with a certified advisor — not a call centre and not a phone tree.",
          imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=85&w=1400",
          btnText: "Meet us",
          btnActionType: "link",
          btnActionValue: "contact",
          features: [
            { id: id(), title: "Certified advisors", desc: "CFP and NISM credentialed team.", icon: "GraduationCap" },
            { id: id(), title: "One relationship", desc: "The same advisor across years.", icon: "Users" },
            { id: id(), title: "Ongoing education", desc: "We study so you do not have to.", icon: "BookOpen" },
          ],
        }, deep()),
      ],
    ),
    page(
      "Contact",
      "contact",
      `${brand} | Book a free call`,
      `Book a free call with ${brand}.`,
      [
        block("Forms", "premium-contact-panel", {
          badge: "FREE 30-MINUTE CALL",
          title: "Start with a conversation.",
          subtitle: "Tell us where you are and where you want to be. We will tell you honestly whether we can help.",
          btnText: "Request my free call",
          contactEmail: "hello@vertexfinancial.in",
          contactPhone: "+91 80 4455 8899",
          contactAddress: "Koramangala · Bengaluru",
          successMessage: "Thanks — we will be in touch within one business day to schedule your free call.",
          whatsappFollowUp: true,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Email", name: "email", type: "email", placeholder: "you@example.com", required: true, width: "half" },
            { id: id(), label: "I am a…", name: "segment", type: "select", required: true, width: "full", options: ["Individual", "Family", "Business owner", "Professional (doctor, lawyer, etc.)"] },
            { id: id(), label: "What is on your mind?", name: "message", type: "textarea", placeholder: "Your questions, in your own words", required: false, width: "full" },
          ],
        }, mist({ backgroundColor: "#f2faf7" })),
        block("CTA", "simple-cta", {
          badge: "CLIENT PRIVACY",
          title: "Your data stays yours.",
          subtitle: "Advice-only means no data sharing with product companies. Ever.",
          btnText: "Read our principles",
          btnActionType: "link",
          btnActionValue: "about",
        }, deep({ textAlign: "center", titleSize: 42 })),
      ],
    ),
  ];

  const products: SiteKitProduct[] = [
    { title: "Comprehensive Financial Plan", description: "A full written plan covering savings, investing, tax, and insurance.", price: 35000, image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=85&w=1000", category: "Planning", tags: ["One-time"], badge: "Most popular" },
    { title: "Annual Tax Review", description: "A structured pre-filing review with actionable recommendations.", price: 15000, image: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=85&w=1000", category: "Planning", tags: ["Annual"] },
    { title: "Business Finance Setup", description: "Cash flow systems, credit strategy, and founder financial planning.", price: 60000, compareAtPrice: 70000, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=85&w=1000", category: "Business", tags: ["Founders"] },
  ];

  return { ...chrome, pages: pagesBuilt, products };
}

// =====================================================================
// KIT 12 · COBALT ARCHITECTURE — professional services
// An architecture studio: slate + amber, precise and warm.
// =====================================================================
function buildCobaltArchitecture(businessName: string) {
  const brand = businessName || "Cobalt Architecture";
  const accent = "#f59e0b";
  const pages = [
    { name: "Home", slug: "home" },
    { name: "Projects", slug: "projects" },
    { name: "Services", slug: "services" },
    { name: "Studio", slug: "studio" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = kitChrome(brand, pages, {
    accent,
    tagline: "An architecture practice for buildings that hold up for decades — in every sense.",
    contactEmail: "studio@cobaltarch.in",
    contactPhone: "+91 80 4567 1234",
    contactAddress: "Lavelle Road · Bengaluru",
    ctaLabel: "Start a project",
    ctaSlug: "contact",
  });
  const graphite = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...dark(accent),
    backgroundColor: "#10131a",
    backgroundGradient: "linear-gradient(135deg, #10131a 0%, #1a2029 58%, #232b36 100%)",
    maxWidth: 1200,
    titleSize: 58,
    cardBgColor: "#171c25",
    cardBorderColor: "#313a47",
    buttonBorderRadius: 2,
    ...overrides,
  });
  const plaster = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...light("#b45309"),
    backgroundColor: "#f6f4f0",
    maxWidth: 1200,
    titleSize: 46,
    cardBgColor: "#ffffff",
    cardBorderColor: "#e0dcd4",
    buttonBorderRadius: 2,
    ...overrides,
  });

  const pagesBuilt: SiteKitPage[] = [
    page(
      "Home",
      "home",
      `${brand} | Architecture studio in Bengaluru`,
      `${brand} designs residential, commercial, and institutional buildings across India.`,
      [
        block("Hero", "quiet-luxury", {
          badge: "ARCHITECTURE · INTERIORS · PLANNING",
          title: "Buildings that outlive trends.",
          subtitle: "We design with the site, the climate, and the decades in mind — so the building gets better with age.",
          imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=85&w=1600",
          btnText: "View projects",
          btnActionType: "link",
          btnActionValue: "projects",
          secondaryBtnText: "Start a project",
          secondaryBtnActionType: "link",
          secondaryBtnActionValue: "contact",
        }, graphite({ titleSize: 62 })),
        block("Special", "premium-proof-rail", {
          badge: "THE PRACTICE",
          title: "Built on measured work.",
          stats: [
            { id: id(), label: "Projects completed", val: 240, suffix: "+" },
            { id: id(), label: "Sq. ft. delivered", val: 4.5, suffix: "M+" },
            { id: id(), label: "Design awards", val: 18, suffix: "" },
            { id: id(), label: "Years practicing", val: 19, suffix: "" },
          ],
        }, graphite({ backgroundColor: "#0d1015" })),
        block("Gallery", "masonry", {
          badge: "SELECTED PROJECTS",
          title: "Recent work.",
          subtitle: "Residential, commercial, and institutional — each project is a long conversation with the site.",
          galleryImages: [
            { id: id(), url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=85&w=1200", title: "Corten House", subtitle: "Residence · Whitefield", aspect: "landscape" },
            { id: id(), url: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&q=85&w=1000", title: "Atrium Workspace", subtitle: "Office · Koramangala", aspect: "square" },
            { id: id(), url: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&q=85&w=1000", title: "Lattice School", subtitle: "Education · Hosur Road", aspect: "portrait" },
            { id: id(), url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=85&w=1200", title: "Pavilion House", subtitle: "Residence · Sarjapur", aspect: "landscape" },
          ],
        }, plaster()),
        block("Business", "premium-story-split", {
          badge: "PHILOSOPHY",
          title: "Design from the climate outward.",
          subtitle: "Before we draw a single line, we study the sun, the rain, the breeze, and the way you actually live. Passive comfort and honest materials do more work than technology ever will.",
          imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=85&w=1400",
          btnText: "Meet the studio",
          btnActionType: "link",
          btnActionValue: "studio",
          features: [
            { id: id(), title: "Climate-first", desc: "Design tuned to the site, not the render.", icon: "Sun" },
            { id: id(), title: "Honest materials", desc: "Concrete, brick, timber, and stone — used well.", icon: "Layers" },
            { id: id(), title: "Long view", desc: "Decisions that still look right in 30 years.", icon: "Clock" },
          ],
        }, graphite()),
        block("CTA", "image-bg-cta", {
          badge: "NEW COMMISSIONS",
          title: "Have a site and a question?",
          subtitle: "We take a limited number of new projects each year to protect the quality of the work.",
          btnText: "Start a project",
          btnActionType: "link",
          btnActionValue: "contact",
          imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=85&w=1600",
        }, graphite({ textAlign: "center", titleSize: 50 })),
      ],
    ),
    page(
      "Projects",
      "projects",
      `${brand} | Selected projects`,
      `A selection of completed ${brand} projects across residential, commercial, and institutional work.`,
      [
        block("Hero", "editorial-stack", {
          badge: "PROJECTS",
          title: "A portfolio of considered buildings.",
          subtitle: "Every project begins with the site and ends with the handover — and our work continues in how it ages.",
          btnText: "Start your project",
          btnActionType: "link",
          btnActionValue: "contact",
        }, plaster({ titleSize: 54 })),
        block("Gallery", "premium-gallery-lightbox", {
          badge: "THE PORTFOLIO",
          title: "Selected work, in detail.",
          subtitle: "A representative selection across typologies and scales.",
          galleryImages: [
            { id: id(), url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=85&w=1400", title: "Corten House", subtitle: "Residence · 8,400 sq ft", aspect: "landscape" },
            { id: id(), url: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&q=85&w=1100", title: "Atrium Workspace", subtitle: "Office · 45,000 sq ft", aspect: "square" },
            { id: id(), url: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&q=85&w=1100", title: "Lattice School", subtitle: "Institution · 32 classrooms", aspect: "portrait" },
            { id: id(), url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=85&w=1400", title: "Pavilion House", subtitle: "Residence · 5,200 sq ft", aspect: "landscape" },
            { id: id(), url: "https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&q=85&w=1100", title: "Clerestory Clinic", subtitle: "Healthcare · 12,000 sq ft", aspect: "square" },
          ],
        }, graphite({ backgroundColor: "#0d1015" })),
      ],
    ),
    page(
      "Services",
      "services",
      `${brand} | Services`,
      `Architecture, interiors, and planning services from ${brand}.`,
      [
        block("Hero", "mono-grid", {
          badge: "SERVICES",
          title: "From first sketch to final walkthrough.",
          subtitle: "Full-service architecture under one accountable team.",
          btnText: "Discuss your project",
          btnActionType: "link",
          btnActionValue: "contact",
        }, graphite()),
        block("Features", "feature-grid", {
          badge: "WHAT WE DO",
          title: "The full arc of a building.",
          subtitle: "One team from concept through construction to completion.",
          features: [
            { id: id(), title: "Architecture", desc: "Concept, design development, and construction documents.", icon: "PenTool" },
            { id: id(), title: "Interior design", desc: "Spaces, materials, and furniture that share one language.", icon: "Sofa" },
            { id: id(), title: "Master planning", desc: "Sites, campuses, and neighbourhoods planned for the long term.", icon: "Map" },
            { id: id(), title: "Landscape", desc: "The ground plane as part of the architecture, not an afterthought.", icon: "Trees" },
            { id: id(), title: "Construction supervision", desc: "Site presence through execution — drawings are half the work.", icon: "HardHat" },
            { id: id(), title: "Feasibility studies", desc: "Budget, zoning, and programme reality before you commit.", icon: "ClipboardCheck" },
          ],
        }, plaster({ backgroundColor: "#f6f4f0" })),
        block("Special", "steps-path", {
          badge: "PROCESS",
          title: "A process with clear gates.",
          subtitle: "You will always know what decision comes next.",
          steps: [
            { id: id(), step: "01", title: "Feasibility", desc: "Site, budget, and programme reality check." },
            { id: id(), step: "02", title: "Concept", desc: "The idea, presented honestly with options." },
            { id: id(), step: "03", title: "Design", desc: "Detailed drawings, materials, and specifications." },
            { id: id(), step: "04", title: "Build", desc: "Construction supervision to protect the design." },
          ],
        }, graphite()),
      ],
    ),
    page(
      "Studio",
      "studio",
      `${brand} | The studio`,
      `The people and principles of the ${brand} studio.`,
      [
        block("Text", "signature-editorial", {
          badge: "THE STUDIO",
          title: "A practice of builders who draw.",
          subtitle: "Cobalt was founded on the belief that architecture is judged in the built work, not the published portfolio.\\n\\nOur partners have spent time on actual construction sites — and it shows in drawings that contractors can build without calling us every hour.",
          btnText: "Work with us",
          btnActionType: "link",
          btnActionValue: "contact",
        }, graphite({ titleSize: 60 })),
        block("Features", "premium-bento-grid", {
          badge: "PRINCIPLES",
          title: "What the studio stands on.",
          subtitle: "Four commitments that shape every drawing.",
          features: [
            { id: id(), title: "Buildability", desc: "Every line must be constructible.", icon: "HardHat" },
            { id: id(), title: "Climatic logic", desc: "Comfort from design, not from AC.", icon: "Sun" },
            { id: id(), title: "Material honesty", desc: "Materials used for what they are.", icon: "Layers" },
          ],
        }, plaster()),
        block("Business", "premium-story-split", {
          badge: "THE TEAM",
          title: "A studio of equals.",
          subtitle: "Fourteen architects and designers, led by three partners who still draw by hand.",
          imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=85&w=1400",
          btnText: "Start a project",
          btnActionType: "link",
          btnActionValue: "contact",
          features: [
            { id: id(), title: "Partner-led", desc: "A partner on every project, every week.", icon: "Users" },
            { id: id(), title: "In-house drafting", desc: "No outsourced drawing farms.", icon: "PenTool" },
            { id: id(), title: "Site culture", desc: "Weekly site visits for every active project.", icon: "HardHat" },
          ],
        }, graphite()),
      ],
    ),
    page(
      "Contact",
      "contact",
      `${brand} | Start a project`,
      `Start a project with ${brand}.`,
      [
        block("Map", "signature-map", {
          badge: "THE STUDIO",
          title: "Come see the models.",
          subtitle: "The studio keeps physical models of every project — the best way to start a conversation.",
          mapAddress: "Lavelle Road, Bengaluru, Karnataka, India",
          contactPhone: "+91 80 4567 1234",
          contactEmail: "studio@cobaltarch.in",
          contactAddress: "Lavelle Road · Bengaluru",
          btnText: "Get directions",
        }, graphite()),
        block("Forms", "signature-form", {
          badge: "NEW PROJECT",
          title: "Tell us about the site.",
          subtitle: "Location, programme, budget band, and timing — enough to start a real conversation.",
          btnText: "Send project note",
          contactEmail: "studio@cobaltarch.in",
          contactPhone: "+91 80 4567 1234",
          contactAddress: "Lavelle Road · Bengaluru",
          successMessage: "Thank you. A partner will review your project note and reply within two business days.",
          whatsappFollowUp: false,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Email", name: "email", type: "email", placeholder: "you@company.com", required: true, width: "half" },
            { id: id(), label: "Project type", name: "type", type: "select", required: true, width: "full", options: ["Residential", "Commercial", "Institutional", "Interior", "Master planning", "Other"] },
            { id: id(), label: "About the site & programme", name: "message", type: "textarea", placeholder: "Location, size, budget band, timing", required: true, width: "full" },
          ],
        }, plaster({ backgroundColor: "#f6f4f0" })),
      ],
    ),
  ];

  const products: SiteKitProduct[] = [
    { title: "Feasibility Study", description: "Site, zoning, budget, and programme reality check with a written report.", price: 75000, image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=85&w=1000", category: "Studies", tags: ["Fixed fee"], badge: "Start here" },
    { title: "Concept Design", description: "Concept architecture and design development to a defined decision gate.", price: 250000, image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=85&w=1000", category: "Design", tags: ["Residential"], badge: "Most popular" },
    { title: "Design & Supervision", description: "Full architecture through construction documents and site supervision.", price: 1500000, compareAtPrice: 1800000, image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=85&w=1000", category: "Full service", tags: ["End-to-end"] },
  ];

  return { ...chrome, pages: pagesBuilt, products };
}

// =====================================================================
// KIT 13 · LUMINA DENTAL — local business & e-com
// A modern dental clinic: clean white + sky blue, calm and clinical.
// =====================================================================
function buildLuminaDental(businessName: string) {
  const brand = businessName || "Lumina Dental";
  const accent = "#38bdf8";
  const pages = [
    { name: "Home", slug: "home" },
    { name: "Treatments", slug: "treatments" },
    { name: "Team", slug: "team" },
    { name: "Pricing", slug: "pricing" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = kitChrome(brand, pages, {
    accent,
    tone: "light",
    navVariant: "nav-glass",
    tagline: "Modern, gentle dentistry in a clinic that does not feel like a clinic.",
    contactEmail: "care@luminadental.in",
    contactPhone: "+91 98450 33456",
    contactAddress: "Koramangala 5th Block · Bengaluru",
    ctaLabel: "Book an appointment",
    ctaSlug: "contact",
  });
  const sky = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...dark(accent),
    backgroundColor: "#0a2540",
    backgroundGradient: "linear-gradient(135deg, #0a2540 0%, #103a5e 58%, #164c78 100%)",
    maxWidth: 1180,
    titleSize: 54,
    cardBgColor: "#0e3052",
    cardBorderColor: "#24507a",
    cardBorderRadius: 20,
    buttonBorderRadius: 999,
    ...overrides,
  });
  const clinic = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...light("#0369a1"),
    backgroundColor: "#f5fafd",
    maxWidth: 1180,
    titleSize: 44,
    cardBgColor: "#ffffff",
    cardBorderColor: "#dbe9f3",
    cardBorderRadius: 20,
    buttonBorderRadius: 999,
    ...overrides,
  });

  const treatments = [
    { id: id(), title: "General & Preventive", desc: "Check-ups, cleanings, and the advice that prevents tomorrow's problems.", icon: "HeartPulse" },
    { id: id(), title: "Cosmetic Dentistry", desc: "Whitening, veneers, and smile design built on your face, not a template.", icon: "Sparkles" },
    { id: id(), title: "Root Canals", desc: "Modern, single-visit root canals — most people are surprised how calm it is.", icon: "Activity" },
    { id: id(), title: "Implants", desc: "Permanent replacements planned with 3D imaging and placed in-house.", icon: "Wrench" },
    { id: id(), title: "Orthodontics", desc: "Clear aligners and braces with a team that actually reviews your progress.", icon: "Smile" },
    { id: id(), title: "Kids' Dentistry", desc: "A clinic designed so children stop fearing the chair by the second visit.", icon: "Baby" },
  ];

  const pagesBuilt: SiteKitPage[] = [
    page(
      "Home",
      "home",
      `${brand} | Modern dental clinic in Koramangala`,
      `${brand} is a modern dental clinic in Koramangala with gentle care, transparent pricing, and same-week appointments.`,
      [
        block("Hero", "split", {
          badge: "KORAMANGALA · SAME-WEEK APPOINTMENTS · OPEN SATURDAYS",
          title: "Dentistry without the dread.",
          subtitle: "Gentle, modern, and transparent — from the first check-up to a complete smile makeover.",
          imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=85&w=1600",
          btnText: "Book an appointment",
          btnActionType: "link",
          btnActionValue: "contact",
          secondaryBtnText: "Explore treatments",
          secondaryBtnActionType: "link",
          secondaryBtnActionValue: "treatments",
        }, sky({ titleSize: 58 })),
        block("Special", "premium-proof-rail", {
          badge: "THE LUMINA STANDARD",
          title: "A clinic built around your comfort.",
          stats: [
            { id: id(), label: "Happy patients", val: 15000, suffix: "+" },
            { id: id(), label: "Google rating", val: 4.9, suffix: "/5" },
            { id: id(), label: "Same-week slots", val: 90, suffix: "%" },
            { id: id(), label: "Sterilisation cycles", val: 1200, suffix: "/mo" },
          ],
        }, sky({ backgroundColor: "#0b2a47" })),
        block("Features", "signature-bento", {
          badge: "TREATMENTS",
          title: "Everything under one roof.",
          subtitle: "From routine cleanings to full-mouth rehabilitation — diagnosed and treated in-house.",
          features: treatments,
        }, clinic()),
        block("Testimonials", "premium-testimonial-carousel", {
          badge: "PATIENT STORIES",
          title: "People who stopped dreading the dentist.",
          subtitle: "The words patients use when they describe their first Lumina visit.",
          testimonials: [
            { id: id(), name: "Farah Khan", role: "Patient · 3 years", content: "I had avoided dentists for a decade. The team talked me through every step, and my root canal was genuinely painless.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Suresh Gowda", role: "Patient · 5 years", content: "The pricing is on the website and the bill matches it. That alone made me switch from my old clinic.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Pooja Nair", role: "Patient · 1 year", content: "My six-year-old actually asks when she can go back. That says everything about how they treat kids.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=240", rating: 5 },
          ],
        }, clinic({ backgroundColor: "#f5fafd" })),
        block("CTA", "image-bg-cta", {
          badge: "NEW PATIENTS WELCOME",
          title: "Your first visit, without the anxiety.",
          subtitle: "A gentle examination, honest findings, and a written plan — no pressure, no surprises.",
          btnText: "Book your first visit",
          btnActionType: "link",
          btnActionValue: "contact",
          imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=85&w=1600",
        }, sky({ textAlign: "center", titleSize: 48 })),
      ],
    ),
    page(
      "Treatments",
      "treatments",
      `${brand} | Treatments`,
      `Explore the full range of ${brand} dental treatments.`,
      [
        block("Hero", "editorial-stack", {
          badge: "TREATMENTS",
          title: "Care for every stage of life.",
          subtitle: "Six specialties, one standard of gentle, honest care.",
          btnText: "Book an appointment",
          btnActionType: "link",
          btnActionValue: "contact",
        }, clinic({ titleSize: 52 })),
        block("Features", "feature-grid", {
          badge: "WHAT WE OFFER",
          title: "The treatments, explained plainly.",
          subtitle: "Every treatment starts with the reason, the options, and the honest trade-offs.",
          features: treatments,
        }, clinic({ backgroundColor: "#f5fafd" })),
        block("Special", "premium-faq", {
          badge: "PATIENT QUESTIONS",
          title: "Before you sit in the chair.",
          subtitle: "The questions every new patient asks.",
          btnText: "Ask our team",
          btnActionType: "link",
          btnActionValue: "contact",
          faqs: [
            { id: id(), q: "Does treatment hurt?", a: "Modern anaesthesia and gentle technique make the vast majority of procedures genuinely comfortable. We check in constantly and stop whenever you need." },
            { id: id(), q: "What happens on the first visit?", a: "A full examination, digital X-rays if needed, and a written treatment plan with transparent pricing. No treatment without your approval." },
            { id: id(), q: "Do you take insurance?", a: "Yes — we work with most major insurers and file claims for you wherever possible." },
          ],
        }, sky()),
      ],
    ),
    page(
      "Team",
      "team",
      `${brand} | Our dentists`,
      `Meet the dentists and specialists of ${brand}.`,
      [
        block("Hero", "minimal", {
          badge: "THE TEAM",
          title: "Specialists you can talk to.",
          subtitle: "Every dentist introduces themselves by name — and answers your questions honestly.",
          btnText: "Book an appointment",
          btnActionType: "link",
          btnActionValue: "contact",
        }, sky({ textAlign: "center", titleSize: 52 })),
        block("Features", "premium-bento-grid", {
          badge: "DOCTORS",
          title: "The team who will treat you.",
          subtitle: "Senior dentists and specialists, all in-house.",
          features: [
            { id: id(), title: "Dr. Meera Iyer", desc: "Principal Dentist · 15 years, BDS MDS, cosmetic focus.", icon: "Stethoscope", eyebrow: "COSMETIC" },
            { id: id(), title: "Dr. Arjun Rao", desc: "Implantologist · 12 years, 3,000+ implants placed.", icon: "Wrench", eyebrow: "IMPLANTS" },
            { id: id(), title: "Dr. Kavya Menon", desc: "Pediatric Dentist · 9 years, kids' fear-free specialist.", icon: "Baby", eyebrow: "KIDS" },
          ],
        }, clinic()),
        block("Business", "premium-story-split", {
          badge: "STANDARDS",
          title: "Clinical care you can verify.",
          subtitle: "Hospital-grade sterilisation, digital imaging, and a published pricing policy. We are proud of the boring details.",
          imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=85&w=1400",
          btnText: "See our pricing",
          btnActionType: "link",
          btnActionValue: "pricing",
          features: [
            { id: id(), title: "Class B sterilisation", desc: "Every instrument, every time.", icon: "ShieldCheck" },
            { id: id(), title: "Digital imaging", desc: "Less radiation, better diagnosis.", icon: "Scan" },
            { id: id(), title: "Published prices", desc: "The estimate matches the bill.", icon: "FileCheck" },
          ],
        }, sky()),
      ],
    ),
    page(
      "Pricing",
      "pricing",
      `${brand} | Pricing`,
      `Transparent ${brand} pricing — see the estimate before you book.`,
      [
        block("Hero", "minimal", {
          badge: "PRICING",
          title: "The price before the chair.",
          subtitle: "Every treatment has a published price. The estimate you receive is the bill you pay.",
          btnText: "Get a written estimate",
          btnActionType: "link",
          btnActionValue: "contact",
        }, clinic({ textAlign: "center", titleSize: 52 })),
        block("Pricing", "premium-pricing-toggle", {
          badge: "TREATMENT PRICES",
          title: "Honest rates for honest care.",
          subtitle: "Prices include consultation and follow-up where noted. Insurance claims filed for you.",
          btnActionType: "link",
          btnActionValue: "contact",
          pricing: [
            { id: id(), tier: "Check-up & Cleaning", price: "₹1,200", features: ["Full examination", "Ultrasonic cleaning", "Fluoride application", "Written care plan"], btnText: "Book check-up", popular: false },
            { id: id(), tier: "Root Canal", price: "₹6,500", features: ["Single-visit modern RCT", "Digital X-rays", "Crown fitting", "Painless protocol"], btnText: "Book consultation", popular: true },
            { id: id(), tier: "Smile Makeover", price: "₹45,000", features: ["Digital smile design", "Whitening + veneers", "3D mock-up preview", "2-year warranty"], btnText: "Get a quote", popular: false },
          ],
        }, sky()),
        block("CTA", "gradient-cta", {
          badge: "EMI AVAILABLE",
          title: "Care should not wait for a paycheque.",
          subtitle: "Zero-interest EMI on most treatments, approved in minutes.",
          btnText: "Ask about EMI",
          btnActionType: "link",
          btnActionValue: "contact",
        }, clinic()),
      ],
    ),
    page(
      "Contact",
      "contact",
      `${brand} | Book an appointment`,
      `Book an appointment at ${brand}.`,
      [
        block("Map", "signature-map", {
          badge: "THE CLINIC",
          title: "Easy to reach, easy to park.",
          subtitle: "Ground floor in Koramangala 5th Block, two minutes from the main road.",
          mapAddress: "Koramangala, Bengaluru, Karnataka, India",
          contactPhone: "+91 98450 33456",
          contactEmail: "care@luminadental.in",
          contactAddress: "Koramangala 5th Block · Bengaluru",
          btnText: "Get directions",
        }, sky()),
        block("Forms", "premium-contact-panel", {
          badge: "APPOINTMENT",
          title: "Book your visit.",
          subtitle: "Choose a slot and we will confirm by call or WhatsApp within the hour.",
          btnText: "Request appointment",
          contactEmail: "care@luminadental.in",
          contactPhone: "+91 98450 33456",
          contactAddress: "Koramangala 5th Block · Bengaluru",
          successMessage: "Thanks — we will confirm your appointment within the hour by call or WhatsApp.",
          whatsappFollowUp: true,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Phone", name: "phone", type: "tel", placeholder: "+91 98765 43210", required: true, width: "half" },
            { id: id(), label: "Concern", name: "concern", type: "select", required: true, width: "full", options: ["Check-up & cleaning", "Pain / root canal", "Cosmetic", "Implants", "Braces / aligners", "Kids' dentistry", "Other"] },
            { id: id(), label: "Preferred day & time", name: "message", type: "textarea", placeholder: "e.g. Saturday mornings, or any weekday evening", required: false, width: "full" },
          ],
        }, clinic({ backgroundColor: "#f5fafd" })),
      ],
    ),
  ];

  const products: SiteKitProduct[] = [
    { title: "Check-up & Cleaning", description: "Full examination, cleaning, fluoride, and a written care plan.", price: 1200, image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=85&w=1000", category: "Care plans", tags: ["New patients"], badge: "Start here" },
    { title: "Teeth Whitening", description: "In-clinic whitening with take-home maintenance kit.", price: 12000, image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=85&w=1000", category: "Cosmetic", tags: ["Same day"], badge: "Popular" },
    { title: "Family Care Plan", description: "Annual check-ups for a family of four with priority slots.", price: 4500, compareAtPrice: 5200, image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=85&w=1000", category: "Care plans", tags: ["Annual"] },
  ];

  return { ...chrome, pages: pagesBuilt, products };
}

// =====================================================================
// KIT 14 · NOCTURNE PHOTOGRAPHY — creative portfolio
// A photography studio: black + amber, dramatic and editorial.
// =====================================================================
function buildNocturne(businessName: string) {
  const brand = businessName || "Nocturne";
  const accent = "#fbbf24";
  const pages = [
    { name: "Home", slug: "home" },
    { name: "Portfolio", slug: "portfolio" },
    { name: "Services", slug: "services" },
    { name: "About", slug: "about" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = kitChrome(brand, pages, {
    accent,
    tagline: "Editorial photography for brands and people who want images with atmosphere.",
    contactEmail: "hello@nocturne.studio",
    contactPhone: "+91 98220 88442",
    contactAddress: "Kala Ghoda · Mumbai",
    ctaLabel: "Book a shoot",
    ctaSlug: "contact",
  });
  const noir = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...dark(accent),
    backgroundColor: "#0a0a0b",
    backgroundGradient: "linear-gradient(135deg, #0a0a0b 0%, #141416 58%, #1d1d20 100%)",
    maxWidth: 1200,
    titleSize: 60,
    cardBgColor: "#141416",
    cardBorderColor: "#2e2e32",
    ...overrides,
  });
  const fog = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...light("#92400e"),
    backgroundColor: "#faf7f2",
    maxWidth: 1200,
    titleSize: 46,
    cardBgColor: "#ffffff",
    cardBorderColor: "#e5ded2",
    ...overrides,
  });

  const pagesBuilt: SiteKitPage[] = [
    page(
      "Home",
      "home",
      `${brand} | Editorial photography studio`,
      `${brand} is a Mumbai photography studio creating editorial imagery for brands, restaurants, and people.`,
      [
        block("Hero", "warm-studio", {
          badge: "EDITORIAL PHOTOGRAPHY · MUMBAI",
          title: "Light, framed with intent.",
          subtitle: "Editorial photography for brands and people who want images with atmosphere — not just sharp focus.",
          imageUrl: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&q=85&w=1600",
          btnText: "View portfolio",
          btnActionType: "link",
          btnActionValue: "portfolio",
          secondaryBtnText: "Book a shoot",
          secondaryBtnActionType: "link",
          secondaryBtnActionValue: "contact",
        }, noir({ titleSize: 64 })),
        block("Gallery", "masonry", {
          badge: "SELECTED WORK",
          title: "A recent edit.",
          subtitle: "A mix of campaigns, editorial features, and personal work.",
          galleryImages: [
            { id: id(), url: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&q=85&w=1000", title: "Glasshouse", subtitle: "Product campaign", aspect: "portrait" },
            { id: id(), url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=85&w=1000", title: "Amber Room", subtitle: "Editorial feature", aspect: "square" },
            { id: id(), url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=85&w=1000", title: "Studio Series", subtitle: "Portrait work", aspect: "landscape" },
            { id: id(), url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=85&w=1000", title: "Golden Hour", subtitle: "Personal series", aspect: "landscape" },
          ],
        }, fog()),
        block("Business", "premium-story-split", {
          badge: "THE APPROACH",
          title: "Pre-production is 80% of the image.",
          subtitle: "Concept, location, light, and styling before the shutter opens. The result is fewer shots, better frames, and a set that runs on schedule.",
          imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=85&w=1400",
          btnText: "Meet the studio",
          btnActionType: "link",
          btnActionValue: "about",
          features: [
            { id: id(), title: "Concept first", desc: "Every shoot starts on paper.", icon: "PenTool" },
            { id: id(), title: "Full crew", desc: "Styling, lighting, and art direction in-house.", icon: "Users" },
            { id: id(), title: "48-hour delivery", desc: "Selects delivered within two days.", icon: "Zap" },
          ],
        }, noir()),
        block("CTA", "image-bg-cta", {
          badge: "BOOKING Q3",
          title: "Your story deserves a considered frame.",
          subtitle: "A limited number of shoots each month, so every project gets full attention.",
          btnText: "Book a shoot",
          btnActionType: "link",
          btnActionValue: "contact",
          imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=85&w=1600",
        }, noir({ textAlign: "center", titleSize: 50 })),
      ],
    ),
    page(
      "Portfolio",
      "portfolio",
      `${brand} | Portfolio`,
      `The full ${brand} portfolio across campaigns, editorial, and portraits.`,
      [
        block("Hero", "editorial-stack", {
          badge: "PORTFOLIO",
          title: "The body of work.",
          subtitle: "Campaigns, editorial features, and personal projects selected with intent.",
          btnText: "Book a shoot",
          btnActionType: "link",
          btnActionValue: "contact",
        }, fog({ titleSize: 54 })),
        block("Gallery", "premium-gallery-lightbox", {
          badge: "THE ARCHIVE",
          title: "Selected frames.",
          subtitle: "A representative selection across client work and personal series.",
          galleryImages: [
            { id: id(), url: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&q=85&w=1400", title: "Glasshouse", subtitle: "Product · MCA India", aspect: "portrait" },
            { id: id(), url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=85&w=1200", title: "Amber Room", subtitle: "Editorial · The Review", aspect: "square" },
            { id: id(), url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=85&w=1400", title: "Studio Series", subtitle: "Portraits · Issue 12", aspect: "landscape" },
            { id: id(), url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=85&w=1400", title: "Golden Hour", subtitle: "Personal · Goa series", aspect: "landscape" },
            { id: id(), url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=85&w=1200", title: "Portrait No. 4", subtitle: "Personal · B&W series", aspect: "square" },
          ],
        }, noir({ backgroundColor: "#0d0d0f" })),
      ],
    ),
    page(
      "Services",
      "services",
      `${brand} | Photography services`,
      `Campaign, editorial, and portrait photography from ${brand}.`,
      [
        block("Hero", "mono-grid", {
          badge: "SERVICES",
          title: "Three ways to work together.",
          subtitle: "Clear scopes, full crew, and delivery you can schedule around.",
          btnText: "Get a quote",
          btnActionType: "link",
          btnActionValue: "contact",
        }, noir()),
        block("Features", "feature-grid", {
          badge: "WHAT WE SHOOT",
          title: "The services.",
          subtitle: "Each scope includes pre-production, shoot day, and selected edits.",
          features: [
            { id: id(), title: "Campaign shoots", desc: "Product, fashion, and brand campaigns with art direction.", icon: "Megaphone" },
            { id: id(), title: "Editorial features", desc: "Magazine-style stories for print and digital features.", icon: "Newspaper" },
            { id: id(), title: "Restaurant & food", desc: "Menu, space, and chef photography that makes people hungry.", icon: "UtensilsCrossed" },
            { id: id(), title: "Portraits", desc: "Professional portraits with direction, not just lighting.", icon: "UserRound" },
            { id: id(), title: "Events & launches", desc: "Documentary coverage of the moments that matter.", icon: "PartyPopper" },
            { id: id(), title: "Retouching & post", desc: "Colour and retouching to a consistent brand standard.", icon: "Wand2" },
          ],
        }, fog({ backgroundColor: "#faf7f2" })),
        block("Pricing", "premium-pricing-toggle", {
          badge: "INVESTMENT",
          title: "Clear packages.",
          subtitle: "Half-day to full-production scopes with all rates published.",
          btnActionType: "link",
          btnActionValue: "contact",
          pricing: [
            { id: id(), tier: "Half Day", price: "₹45,000", features: ["4 hours on location", "1 look / concept", "30 selected edits"], btnText: "Book half day", popular: false },
            { id: id(), tier: "Full Day", price: "₹85,000", features: ["8 hours on location", "2 concepts + styling", "60 selected edits", "48-hour delivery"], btnText: "Book full day", popular: true },
            { id: id(), tier: "Editorial", price: "₹1,50,000", features: ["Multi-day production", "Full crew & art direction", "120 selected edits", "Print-ready files"], btnText: "Discuss editorial", popular: false },
          ],
        }, noir()),
      ],
    ),
    page(
      "About",
      "about",
      `${brand} | About the studio`,
      `The photographer and philosophy behind ${brand}.`,
      [
        block("Text", "signature-editorial", {
          badge: "THE STUDIO",
          title: "Every frame is a decision.",
          subtitle: "Nocturne began with a single question: why do so many commercial images look the same?\\n\\nThe answer is that they are made to be safe. We make images with a point of view — informed by twelve years of editorial work, and framed with the patience of film-era habits.",
          btnText: "Work with us",
          btnActionType: "link",
          btnActionValue: "contact",
        }, noir({ titleSize: 60 })),
        block("Business", "premium-story-split", {
          badge: "THE PHOTOGRAPHER",
          title: "Behind the camera.",
          subtitle: "Rohan Kapoor founded Nocturne after a decade shooting for Indian and international publications. Today the studio works with restaurants, brands, and editorial teams who want atmosphere over stock.",
          imageUrl: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&q=85&w=1400",
          btnText: "Book a shoot",
          btnActionType: "link",
          btnActionValue: "contact",
          features: [
            { id: id(), title: "12 years shooting", desc: "Editorial and commercial.", icon: "Camera" },
            { id: id(), title: "Published work", desc: "The Review, MCA India, and more.", icon: "Newspaper" },
            { id: id(), title: "Studio + location", desc: "Full lighting kit, anywhere.", icon: "MapPin" },
          ],
        }, fog()),
      ],
    ),
    page(
      "Contact",
      "contact",
      `${brand} | Book a shoot`,
      `Book a shoot with ${brand}.`,
      [
        block("Forms", "premium-contact-panel", {
          badge: "BOOKING",
          title: "Tell us about the project.",
          subtitle: "Concept, dates, and budget band — we reply within one business day.",
          btnText: "Send project brief",
          contactEmail: "hello@nocturne.studio",
          contactPhone: "+91 98220 88442",
          contactAddress: "Kala Ghoda · Mumbai",
          successMessage: "Thanks — we will reply within one business day with availability and a quote.",
          whatsappFollowUp: false,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Email", name: "email", type: "email", placeholder: "you@company.com", required: true, width: "half" },
            { id: id(), label: "Project type", name: "type", type: "select", required: true, width: "full", options: ["Campaign", "Editorial", "Restaurant & food", "Portrait", "Event", "Other"] },
            { id: id(), label: "About the project", name: "message", type: "textarea", placeholder: "Concept, dates, location, budget band", required: true, width: "full" },
          ],
        }, fog({ backgroundColor: "#faf7f2" })),
        block("CTA", "simple-cta", {
          badge: "SEE THE FULL ARCHIVE",
          title: "Want more than the highlights?",
          subtitle: "Book a portfolio review — a walkthrough of full project galleries, prints included.",
          btnText: "Book a review",
          btnActionType: "link",
          btnActionValue: "contact",
        }, noir({ textAlign: "center", titleSize: 42 })),
      ],
    ),
  ];

  const products: SiteKitProduct[] = [
    { title: "Half-Day Shoot", description: "Four hours on location with one concept and 30 selected edits.", price: 45000, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=85&w=1000", category: "Packages", tags: ["4 hours"], badge: "Start here" },
    { title: "Full-Day Shoot", description: "Eight hours, two concepts, styling, and 60 selected edits.", price: 85000, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=85&w=1000", category: "Packages", tags: ["8 hours"], badge: "Most popular" },
    { title: "Portrait Session", description: "Studio or location portraits with direction and 15 edits.", price: 15000, compareAtPrice: 18000, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=85&w=1000", category: "Portraits", tags: ["Individuals"] },
  ];

  return { ...chrome, pages: pagesBuilt, products };
}

// =====================================================================
// KIT 15 · PIXEL & THREAD — creative portfolio
// A fashion label: cream + terracotta, editorial and tactile.
// =====================================================================
function buildPixelThread(businessName: string) {
  const brand = businessName || "Pixel & Thread";
  const accent = "#c2571f";
  const pages = [
    { name: "Home", slug: "home" },
    { name: "Collections", slug: "collections" },
    { name: "Lookbook", slug: "lookbook" },
    { name: "Studio", slug: "studio" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = kitChrome(brand, pages, {
    accent,
    tone: "light",
    tagline: "Small-batch fashion, designed in Bombay and cut with intent.",
    contactEmail: "studio@pixelandthread.in",
    contactPhone: "+91 98220 99110",
    contactAddress: "Kala Ghoda · Mumbai",
    ctaLabel: "Shop the collection",
    ctaSlug: "collections",
  });
  const clay = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...dark(accent),
    backgroundColor: "#24120b",
    backgroundGradient: "linear-gradient(135deg, #24120b 0%, #3a1c10 58%, #4a2414 100%)",
    maxWidth: 1180,
    titleSize: 56,
    cardBgColor: "#2f1a10",
    cardBorderColor: "#57331f",
    buttonBorderRadius: 2,
    ...overrides,
  });
  const canvas = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...light("#9a3d10"),
    backgroundColor: "#faf3ea",
    maxWidth: 1180,
    titleSize: 46,
    cardBgColor: "#ffffff",
    cardBorderColor: "#e8dccb",
    buttonBorderRadius: 2,
    ...overrides,
  });

  const pagesBuilt: SiteKitPage[] = [
    page(
      "Home",
      "home",
      `${brand} | Small-batch fashion label`,
      `${brand} is a Mumbai fashion label designing small-batch garments with editorial restraint.`,
      [
        block("Hero", "signature-hero", {
          badge: "FW26 COLLECTION · SMALL BATCH · MADE IN BOMBAY",
          title: "Clothes with a point of view.",
          subtitle: "Small-batch fashion, designed in Bombay and cut with intent. No seasons you have to chase.",
          imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=85&w=1600",
          btnText: "Shop the collection",
          btnActionType: "link",
          btnActionValue: "collections",
          secondaryBtnText: "View lookbook",
          secondaryBtnActionType: "link",
          secondaryBtnActionValue: "lookbook",
        }, clay({ titleSize: 66 })),
        block("Business", "signature-story", {
          badge: "THE HOUSE STANDARD",
          title: "Garments that get better with wear.",
          subtitle: "Natural fibres, considered cuts, and hardware that is built to be repaired. We make fewer pieces so every one is worth keeping.",
          imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=85&w=1600",
          btnText: "Read the studio story",
          btnActionType: "link",
          btnActionValue: "studio",
          features: [
            { id: id(), title: "Natural fibres", desc: "Linen, cotton, wool — chosen for hand-feel.", icon: "Leaf" },
            { id: id(), title: "Small batches", desc: "Runs of 50–150, never mass production.", icon: "Layers" },
            { id: id(), title: "Repair promise", desc: "Free repairs for the life of the garment.", icon: "Scissors" },
          ],
        }, canvas()),
        block("Gallery", "masonry", {
          badge: "FROM THE LOOKBOOK",
          title: "FW26, in frames.",
          subtitle: "Shot on film in Bombay, styled by the studio.",
          galleryImages: [
            { id: id(), url: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=85&w=1000", title: "Cotton Drill Coat", subtitle: "FW26", aspect: "portrait" },
            { id: id(), url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=85&w=1000", title: "Linen Overshirt", subtitle: "FW26", aspect: "square" },
            { id: id(), url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=85&w=1000", title: "Wool Trouser", subtitle: "FW26", aspect: "landscape" },
            { id: id(), url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=85&w=1000", title: "Canvas Jacket", subtitle: "FW26", aspect: "portrait" },
          ],
        }, clay({ backgroundColor: "#2a150d" })),
        block("Testimonials", "signature-stories", {
          badge: "FROM CUSTOMERS",
          title: "Worn, washed, and written about.",
          subtitle: "Notes from people who own the pieces.",
          testimonials: [
            { id: id(), name: "Aditi Sharma", role: "Customer · 3 pieces", content: "The quality is immediately obvious in the hand. The cotton drill coat has survived three Bombay monsoons and looks better each year.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Kunal Bose", role: "Customer · 5 pieces", content: "The sizing is honest, the fabrics are honest, and the prices are honest. That is rarer than it should be.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Rhea Kapoor", role: "Customer · FW25", content: "I wore the linen overshirt on the flight, to dinner, and into a meeting. It went everywhere and looked right in all of them.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=240", rating: 5 },
          ],
        }, canvas({ backgroundColor: "#faf3ea" })),
        block("CTA", "signature-cta", {
          badge: "FW26 NOW LIVE",
          title: "Fewer pieces. Better ones.",
          subtitle: "The collection is small and sells out — each run is numbered.",
          btnText: "Shop FW26",
          btnActionType: "link",
          btnActionValue: "collections",
        }, clay({ textAlign: "center", titleSize: 58 })),
      ],
    ),
    page(
      "Collections",
      "collections",
      `${brand} | Shop the collection`,
      `Shop the current ${brand} collection — small-batch garments made in Bombay.`,
      [
        block("EComStore", "signature-store", {
          badge: "THE COLLECTION",
          title: "Shop FW26.",
          subtitle: "Small batches, honest sizing, and free repairs for life.",
          btnText: "Ask about a piece",
          btnActionType: "link",
          btnActionValue: "contact",
        }, canvas()),
      ],
    ),
    page(
      "Lookbook",
      "lookbook",
      `${brand} | Lookbook`,
      `The full FW26 lookbook from ${brand}.`,
      [
        block("Hero", "editorial-stack", {
          badge: "LOOKBOOK · FW26",
          title: "Shot on film, styled in-house.",
          subtitle: "The collection photographed in Bombay — monsoon light, honest fabrics.",
          btnText: "Shop the pieces",
          btnActionType: "link",
          btnActionValue: "collections",
        }, canvas({ titleSize: 54 })),
        block("Gallery", "signature-gallery", {
          badge: "FW26",
          title: "The lookbook.",
          subtitle: "Every look, in order.",
          galleryImages: [
            { id: id(), url: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=85&w=1200", title: "Look 01", subtitle: "Cotton Drill Coat · Linen Shirt", aspect: "portrait" },
            { id: id(), url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=85&w=1200", title: "Look 02", subtitle: "Linen Overshirt · Wool Trouser", aspect: "portrait" },
            { id: id(), url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=85&w=1200", title: "Look 03", subtitle: "Canvas Jacket · Cotton Tee", aspect: "portrait" },
            { id: id(), url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=85&w=1200", title: "Look 04", subtitle: "Wool Overcoat · Merino Knit", aspect: "portrait" },
            { id: id(), url: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&q=85&w=1200", title: "Look 05", subtitle: "Linen Shirt · Cotton Trouser", aspect: "portrait" },
          ],
        }, clay({ backgroundColor: "#2a150d" })),
      ],
    ),
    page(
      "Studio",
      "studio",
      `${brand} | The studio`,
      `The people and process behind ${brand}.`,
      [
        block("Text", "signature-editorial", {
          badge: "THE STUDIO",
          title: "Designed in Bombay. Cut with intent.",
          subtitle: "Pixel & Thread began in a one-room studio in Kala Ghoda with a single belief: most clothing is made to be replaced, and that is a choice we can refuse.\\n\\nEvery piece is designed on the body, sampled three times, and produced in runs small enough to inspect by hand.",
          btnText: "Shop the collection",
          btnActionType: "link",
          btnActionValue: "collections",
        }, clay({ titleSize: 60 })),
        block("Special", "steps-path", {
          badge: "PROCESS",
          title: "From sketch to numbered run.",
          subtitle: "A deliberate process that protects the quality at every step.",
          steps: [
            { id: id(), step: "01", title: "Design", desc: "Sketches and draping on real bodies." },
            { id: id(), step: "02", title: "Sample", desc: "Three rounds of sampling before approval." },
            { id: id(), step: "03", title: "Produce", desc: "Small runs, inspected piece by piece." },
            { id: id(), step: "04", title: "Number", desc: "Each garment carries its run number." },
          ],
        }, canvas()),
        block("Business", "premium-story-split", {
          badge: "THE MAKERS",
          title: "Partners, not vendors.",
          subtitle: "We work with the same three ateliers in Bombay that we started with — and they are credited on every piece.",
          imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=85&w=1400",
          btnText: "Get in touch",
          btnActionType: "link",
          btnActionValue: "contact",
          features: [
            { id: id(), title: "Same ateliers", desc: "Three partners since day one.", icon: "Handshake" },
            { id: id(), title: "Fair margins", desc: "Makers are paid before we are.", icon: "HeartHandshake" },
            { id: id(), title: "Named credit", desc: "Every atelier is credited per run.", icon: "BadgeCheck" },
          ],
        }, clay()),
      ],
    ),
    page(
      "Contact",
      "contact",
      `${brand} | Contact & enquiries`,
      `Wholesale, commissions, and studio visits with ${brand}.`,
      [
        block("Forms", "signature-form", {
          badge: "ENQUIRIES",
          title: "Wholesale, commissions, or hello.",
          subtitle: "Tell us what you need and a human will reply within two business days.",
          btnText: "Send enquiry",
          contactEmail: "studio@pixelandthread.in",
          contactPhone: "+91 98220 99110",
          contactAddress: "Kala Ghoda · Mumbai",
          successMessage: "Thanks — the studio will reply within two business days.",
          whatsappFollowUp: true,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Email", name: "email", type: "email", placeholder: "you@company.com", required: true, width: "half" },
            { id: id(), label: "Enquiry type", name: "type", type: "select", required: true, width: "full", options: ["Order support", "Wholesale", "Commissions", "Studio visit", "Press", "Other"] },
            { id: id(), label: "Message", name: "message", type: "textarea", placeholder: "How can we help?", required: true, width: "full" },
          ],
        }, canvas({ backgroundColor: "#faf3ea" })),
      ],
    ),
  ];

  const products: SiteKitProduct[] = [
    { title: "Linen Overshirt", description: "Mid-weight European linen, relaxed cut, made in Bombay.", price: 8500, image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=85&w=1000", category: "FW26", tags: ["Linen"], badge: "Almost gone" },
    { title: "Cotton Drill Coat", description: "Heavy cotton drill, storm collar, numbered run of 100.", price: 12500, image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=85&w=1000", category: "FW26", tags: ["Outerwear"], badge: "FW26 icon" },
    { title: "Wool Trouser", description: "Wool blend, single pleat, tapered — built for years.", price: 9800, compareAtPrice: 11000, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=85&w=1000", category: "FW26", tags: ["Trousers"] },
  ];

  return { ...chrome, pages: pagesBuilt, products };
}

// =====================================================================
// KIT 16 · MASON & CO — creative portfolio
// A craft workshop: warm brown + forest green, honest and handmade.
// =====================================================================
function buildMasonCo(businessName: string) {
  const brand = businessName || "Mason & Co.";
  const accent = "#84cc16";
  const pages = [
    { name: "Home", slug: "home" },
    { name: "Shop", slug: "shop" },
    { name: "Process", slug: "process" },
    { name: "Journal", slug: "journal" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = kitChrome(brand, pages, {
    accent,
    tagline: "Furniture and objects, made by hand in small runs.",
    contactEmail: "workshop@masonandco.in",
    contactPhone: "+91 98450 55678",
    contactAddress: "Kalakshetra Road · Chennai",
    ctaLabel: "Shop the workshop",
    ctaSlug: "shop",
  });
  const walnut = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...dark(accent),
    backgroundColor: "#1a120a",
    backgroundGradient: "linear-gradient(135deg, #1a120a 0%, #2a1d10 58%, #352510 100%)",
    maxWidth: 1180,
    titleSize: 58,
    cardBgColor: "#251a0e",
    cardBorderColor: "#4a3a22",
    buttonBorderRadius: 2,
    ...overrides,
  });
  const oak = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...light("#4d7c0f"),
    backgroundColor: "#f6f1e7",
    maxWidth: 1180,
    titleSize: 44,
    cardBgColor: "#ffffff",
    cardBorderColor: "#e2d9c6",
    buttonBorderRadius: 2,
    ...overrides,
  });

  const pagesBuilt: SiteKitPage[] = [
    page(
      "Home",
      "home",
      `${brand} | Handmade furniture & objects`,
      `${brand} is a Chennai workshop making furniture and objects by hand in small runs.`,
      [
        block("Hero", "warm-studio", {
          badge: "HANDMADE IN CHENNAI · SMALL RUNS",
          title: "Objects made to outlast the trend.",
          subtitle: "Furniture and everyday objects, shaped by hand from solid wood — and made to be repaired.",
          imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=85&w=1600",
          btnText: "Shop the workshop",
          btnActionType: "link",
          btnActionValue: "shop",
          secondaryBtnText: "See our process",
          secondaryBtnActionType: "link",
          secondaryBtnActionValue: "process",
        }, walnut({ titleSize: 62 })),
        block("Special", "premium-proof-rail", {
          badge: "THE WORKSHOP",
          title: "By the numbers, honestly.",
          stats: [
            { id: id(), label: "Pieces made by hand", val: 3200, suffix: "+" },
            { id: id(), label: "Years in the workshop", val: 14, suffix: "" },
            { id: id(), label: "Repairs honoured", val: 100, suffix: "%" },
            { id: id(), label: "Solid wood, always", val: 100, suffix: "%" },
          ],
        }, walnut({ backgroundColor: "#1c130b" })),
        block("Business", "signature-story", {
          badge: "THE MAKING",
          title: "From tree to table, in our own hands.",
          subtitle: "We source timber, dry it in our own kiln, and cut every joint in-house. Nothing is outsourced, which is why nothing comes back.",
          imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=85&w=1600",
          btnText: "Read the process",
          btnActionType: "link",
          btnActionValue: "process",
          features: [
            { id: id(), title: "Solid wood", desc: "No veneer, no MDF, no shortcuts.", icon: "Trees" },
            { id: id(), title: "Hand joints", desc: "Traditional joinery that outlives glue.", icon: "Hand" },
            { id: id(), title: "Lifetime repairs", desc: "Bring it back, we will fix it.", icon: "Wrench" },
          ],
        }, oak()),
        block("Gallery", "masonry", {
          badge: "RECENT WORK",
          title: "Fresh from the bench.",
          subtitle: "Recent commissions and current small-run pieces.",
          galleryImages: [
            { id: id(), url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=85&w=1000", title: "Valnut Dining Table", subtitle: "Commission · 8-seat", aspect: "landscape" },
            { id: id(), url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=85&w=1000", title: "Bare Oak Sofa", subtitle: "Run of 20", aspect: "square" },
            { id: id(), url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=85&w=1000", title: "Teak Sideboard", subtitle: "Commission · Heritage apt", aspect: "portrait" },
            { id: id(), url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=1000", title: "Workshop Stool", subtitle: "Run of 40", aspect: "landscape" },
          ],
        }, walnut({ backgroundColor: "#20160c" })),
        block("Testimonials", "premium-testimonial-carousel", {
          badge: "CUSTOMER NOTES",
          title: "Kept for decades.",
          subtitle: "People write to us about pieces made years ago. These are the ones that stayed.",
          testimonials: [
            { id: id(), name: "Uma Krishnan", role: "Commission · 2019", content: "The dining table we commissioned in 2019 is still the heart of our home. The kids have done their homework on it for six years now.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Raghav Iyer", role: "Customer · 3 pieces", content: "The honesty is in the details — hand-cut dovetails you can see, wood you can touch. Nothing about it is pretending.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Sara Thomas", role: "Customer · sideboard", content: "I bought a piece of furniture and gained a workshop that repairs it. That relationship is the real product.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=240", rating: 5 },
          ],
        }, oak({ backgroundColor: "#f6f1e7" })),
        block("CTA", "image-bg-cta", {
          badge: "SMALL RUNS SELL OUT",
          title: "Own something made once.",
          subtitle: "Current runs are listed as they leave the bench. Commissions are booked months ahead.",
          btnText: "Shop now",
          btnActionType: "link",
          btnActionValue: "shop",
          imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=85&w=1600",
        }, walnut({ textAlign: "center", titleSize: 50 })),
      ],
    ),
    page(
      "Shop",
      "shop",
      `${brand} | Shop`,
      `Shop the current ${brand} run of handmade furniture and objects.`,
      [
        block("EComStore", "product-grid-filter", {
          badge: "THE SHOP",
          title: "Current runs.",
          subtitle: "Listed as they leave the bench — each piece photographed in the workshop.",
          btnText: "Ask about a piece",
          btnActionType: "link",
          btnActionValue: "contact",
        }, oak()),
      ],
    ),
    page(
      "Process",
      "process",
      `${brand} | Our process`,
      `How ${brand} makes furniture — from timber to the finished piece.`,
      [
        block("Hero", "mono-grid", {
          badge: "THE PROCESS",
          title: "Slow, on purpose.",
          subtitle: "Every piece takes weeks — the drying alone takes months. Here is the whole arc.",
          btnText: "Shop the pieces",
          btnActionType: "link",
          btnActionValue: "shop",
        }, walnut()),
        block("Special", "steps-path", {
          badge: "TIMBER TO TABLE",
          title: "The making of a piece.",
          subtitle: "Four honest stages, each one done in our own workshop.",
          steps: [
            { id: id(), step: "01", title: "Select", desc: "Timber chosen by hand for grain and stability." },
            { id: id(), step: "02", title: "Dry", desc: "Kiln-dried in-house to a stable moisture content." },
            { id: id(), step: "03", title: "Cut", desc: "Hand joints, fitted dry before any glue." },
            { id: id(), step: "04", title: "Finish", desc: "Natural oils and wax — nothing that has to be stripped." },
          ],
        }, oak()),
        block("Business", "premium-story-split", {
          badge: "MATERIALS",
          title: "Wood with a story.",
          subtitle: "Much of our timber comes from local felled trees that would otherwise be firewood — city trees, teak from old homes, plantation eucalyptus.",
          imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=85&w=1400",
          btnText: "Read the journal",
          btnActionType: "link",
          btnActionValue: "journal",
          features: [
            { id: id(), title: "Local timber", desc: "City trees and reclaimed teak.", icon: "Trees" },
            { id: id(), title: "Natural finish", desc: "Oils and waxes only.", icon: "Leaf" },
            { id: id(), title: "Zero waste", desc: "Offcuts become stools and toys.", icon: "Recycle" },
          ],
        }, walnut()),
      ],
    ),
    page(
      "Journal",
      "journal",
      `${brand} | Journal`,
      `Notes on wood, craft, and the workshop from ${brand}.`,
      [
        block("Hero", "editorial-stack", {
          badge: "JOURNAL",
          title: "Notes from the bench.",
          subtitle: "Writing about wood, craft, and the slow work of making things well.",
          btnText: "Shop the workshop",
          btnActionType: "link",
          btnActionValue: "shop",
        }, oak({ titleSize: 52 })),
        block("Text", "article-body", {
          badge: "CRAFT",
          title: "Why hand-cut dovetails still matter.",
          subtitle: "Machines make dovetails perfectly and instantly. We still cut them by hand — not for nostalgia, but because the fit forces the maker to understand the joint, the wood, and the stress it will carry for decades.",
        }, oak({ maxWidth: 860, titleSize: 40 })),
        block("Special", "faq-accordions", {
          badge: "COMMON QUESTIONS",
          title: "Before you commission.",
          subtitle: "Honest answers about timber, timelines, and repairs.",
          faqs: [
            { id: id(), q: "How long does a commission take?", a: "Most commissions take six to ten weeks, depending on the piece and the drying schedule. Larger runs are booked months ahead." },
            { id: id(), q: "Do you deliver outside Chennai?", a: "Yes — pieces are crated and delivered across India, with the maker installing them personally in Chennai and Bengaluru." },
          ],
        }, walnut()),
      ],
    ),
    page(
      "Contact",
      "contact",
      `${brand} | Contact the workshop`,
      `Commission a piece or visit the ${brand} workshop.`,
      [
        block("Map", "signature-map", {
          badge: "THE WORKSHOP",
          title: "Come smell the sawdust.",
          subtitle: "Visits by appointment — bring your measurements and your questions.",
          mapAddress: "Kalakshetra Road, Chennai, Tamil Nadu, India",
          contactPhone: "+91 98450 55678",
          contactEmail: "workshop@masonandco.in",
          contactAddress: "Kalakshetra Road · Chennai",
          btnText: "Get directions",
        }, walnut()),
        block("Forms", "premium-contact-panel", {
          badge: "COMMISSIONS",
          title: "Tell us what you want made.",
          subtitle: "Drawings are welcome. So are vague descriptions — we will help you get specific.",
          btnText: "Send commission brief",
          contactEmail: "workshop@masonandco.in",
          contactPhone: "+91 98450 55678",
          contactAddress: "Kalakshetra Road · Chennai",
          successMessage: "Thanks — the workshop will reply within two business days about your commission.",
          whatsappFollowUp: true,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Email", name: "email", type: "email", placeholder: "you@example.com", required: true, width: "half" },
            { id: id(), label: "Piece type", name: "piece", type: "select", required: true, width: "full", options: ["Dining table", "Bed", "Sofa / seating", "Sideboard / storage", "Desk", "Small objects", "Other"] },
            { id: id(), label: "About the piece", name: "message", type: "textarea", placeholder: "Dimensions, timber preference, timing, references", required: true, width: "full" },
          ],
        }, oak({ backgroundColor: "#f6f1e7" })),
      ],
    ),
  ];

  const products: SiteKitProduct[] = [
    { title: "Workshop Stool", description: "Solid teak, hand-cut joints, numbered run of 40.", price: 4500, image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=85&w=1000", category: "Small objects", tags: ["Run of 40"], badge: "Almost gone" },
    { title: "Bare Oak Sofa", description: "Solid oak frame, hand-woven seat, run of 20.", price: 38000, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=85&w=1000", category: "Seating", tags: ["Run of 20"], badge: "Workshop icon" },
    { title: "Teak Sideboard", description: "Reclaimed city teak, brass hardware, made to commission.", price: 95000, compareAtPrice: 105000, image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=85&w=1000", category: "Storage", tags: ["Commission"], badge: "Booked ahead" },
  ];

  return { ...chrome, pages: pagesBuilt, products };
}

// =====================================================================
// REGISTRY · Extra kits batch 2
// =====================================================================
export const EXTRA_SITE_KITS_2: SiteKit[] = [
  {
    id: "zenith-fitness",
    name: "Zenith Fitness",
    category: "Education & Courses",
    description: "A premium fitness studio with class formats, coaching standards, trainer profiles, honest memberships, and free-class booking.",
    audience: "Fitness studios, gyms, wellness coaches, and class-based training brands",
    palette: ["#101312", "#a3e635", "#f7f9f3"],
    pageCount: 5,
    build: buildZenithFitness,
  },
  {
    id: "meridian-law",
    name: "Meridian Law",
    category: "Professional Services",
    description: "A corporate and commercial law firm with practice areas, partner team, practical insights, and consultation booking.",
    audience: "Law firms, attorneys, and professional advisory practices",
    palette: ["#0b1220", "#d4af37", "#f8f7f3"],
    pageCount: 5,
    build: buildMeridianLaw,
  },
  {
    id: "vertex-finance",
    name: "Vertex Financial",
    category: "Professional Services",
    description: "An independent fee-only financial advisory with planning services, transparent fee tiers, insights, and free-call booking.",
    audience: "Financial advisors, wealth managers, tax planners, and accounting firms",
    palette: ["#06201b", "#2dd4a7", "#f2faf7"],
    pageCount: 5,
    build: buildVertexFinance,
  },
  {
    id: "cobalt-architecture",
    name: "Cobalt Architecture",
    category: "Professional Services",
    description: "An architecture practice with a project portfolio, full-service studio, process pages, and project enquiries.",
    audience: "Architects, interior studios, and design-led building practices",
    palette: ["#10131a", "#f59e0b", "#f6f4f0"],
    pageCount: 5,
    build: buildCobaltArchitecture,
  },
  {
    id: "lumina-dental",
    name: "Lumina Dental",
    category: "Local Business & E-com",
    description: "A modern dental clinic with treatment listings, doctor team, transparent pricing, and same-week appointment booking.",
    audience: "Dental clinics, healthcare practices, and local medical services",
    palette: ["#0a2540", "#38bdf8", "#f5fafd"],
    pageCount: 5,
    build: buildLuminaDental,
  },
  {
    id: "nocturne",
    name: "Nocturne",
    category: "Creative Portfolio",
    description: "An editorial photography studio with a cinematic portfolio, service packages, studio story, and shoot booking.",
    audience: "Photographers, creative studios, and image-led freelance practices",
    palette: ["#0a0a0b", "#fbbf24", "#faf7f2"],
    pageCount: 5,
    build: buildNocturne,
  },
  {
    id: "pixel-thread",
    name: "Pixel & Thread",
    category: "Creative Portfolio",
    description: "A small-batch fashion label with a shoppable collection, film lookbook, studio story, and enquiry flow.",
    audience: "Fashion labels, clothing brands, and design studios",
    palette: ["#24120b", "#c2571f", "#faf3ea"],
    pageCount: 5,
    build: buildPixelThread,
  },
  {
    id: "mason-co",
    name: "Mason & Co.",
    category: "Creative Portfolio",
    description: "A handmade furniture workshop with a shop of current runs, honest process pages, a craft journal, and commission enquiries.",
    audience: "Furniture makers, craft workshops, and handmade goods brands",
    palette: ["#1a120a", "#84cc16", "#f6f1e7"],
    pageCount: 5,
    build: buildMasonCo,
  },
];

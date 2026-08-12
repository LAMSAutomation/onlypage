import type { BlockCSSStyles, WebBlock } from './builder-types';
import type { SiteKit, SiteKitPage, SiteKitProduct } from "./site-kits";
import { block, page, dark, light, id } from "./site-kits";

// =====================================================================
// SHARED CHROME FACTORY
// Builds a connected header + footer for any kit from a simple spec so
// every kit ships with working navigation, real button destinations,
// and on-brand contact details.
// =====================================================================
export function kitChrome(
  brand: string,
  pages: Array<{ name: string; slug: string }>,
  opts: {
    accent: string;
    tone?: "dark" | "light";
    navVariant?: string;
    footerVariant?: string;
    tagline: string;
    copyright?: string;
    contactEmail?: string;
    contactPhone?: string;
    contactAddress?: string;
    ctaLabel?: string;
    ctaSlug?: string;
  },
) {
  const links = pages.map((item) => ({ id: id(), label: item.name, url: item.slug }));
  const conversion =
    pages.find((item) => item.slug === "contact") ||
    pages.find((item) => item.slug === "reserve") ||
    pages[pages.length - 1];
  const primary =
    pages.find((item) =>
      ["menu", "services", "work", "projects", "listings", "programs", "courses", "shop"].includes(item.slug),
    ) ||
    pages[1] ||
    pages[0];
  const theme = opts.tone === "light" ? light(opts.accent) : dark(opts.accent);
  const darkBg = opts.tone === "light" ? "#f7f5ef" : "#080b10";
  const cardBg = opts.tone === "light" ? "#ffffff" : "#0d121b";

  const header = block(
    "Navigation",
    opts.navVariant || "nav-minimal",
    {
      title: brand,
      subtitle: pages.map((item) => item.name).join(" · "),
      btnText: opts.ctaLabel || "Contact us",
      btnActionType: "link",
      btnActionValue: opts.ctaSlug || conversion.slug,
      links,
    },
    {
      ...theme,
      paddingTop: 10,
      paddingBottom: 10,
      titleSize: 18,
      subtitleSize: 12,
      maxWidth: 1240,
      backgroundColor: darkBg,
      cardBgColor: cardBg,
      cardBorderColor: opts.tone === "light" ? "#ded9cb" : "#293244",
    },
  );

  const footer = block(
    "Footer",
    opts.footerVariant || "footer-classic",
    {
      title: brand,
      subtitle: opts.tagline,
      copyright:
        opts.copyright || `© ${new Date().getFullYear()} ${brand}. All rights reserved.`,
      contactEmail: opts.contactEmail,
      contactPhone: opts.contactPhone,
      contactAddress: opts.contactAddress,
      btnText: `View ${primary.name.toLowerCase()}`,
      btnActionType: "link",
      btnActionValue: primary.slug,
      links,
    },
    {
      ...theme,
      useGradient: false,
      paddingTop: 64,
      paddingBottom: 32,
      titleSize: 22,
      maxWidth: 1240,
      backgroundColor: darkBg,
      cardBgColor: cardBg,
      cardBorderColor: opts.tone === "light" ? "#ded9cb" : "#293244",
    },
  );

  return { header, footer };
}

// =====================================================================
// KIT 1 · MONOCHROME AGENCY — premium multi-purpose
// A Swiss-grid B2B agency: black + graphite + white, mono typography.
// =====================================================================
function buildMonochromeAgency(businessName: string) {
  const brand = businessName || "Grey Matter";
  const accent = "#9ca3af";
  const pages = [
    { name: "Home", slug: "home" },
    { name: "Services", slug: "services" },
    { name: "Work", slug: "work" },
    { name: "About", slug: "about" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = kitChrome(brand, pages, {
    accent,
    tagline: "A senior independent agency for strategy, brand, and digital product work.",
    contactEmail: "hello@greymatter.agency",
    contactPhone: "+91 98220 01100",
    contactAddress: "Koramangala · Bengaluru",
    ctaLabel: "Start a project",
    ctaSlug: "contact",
  });
  const ink = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...dark(accent),
    backgroundColor: "#0a0a0a",
    backgroundGradient: "linear-gradient(135deg, #0a0a0a 0%, #171717 60%, #1f1f1f 100%)",
    maxWidth: 1200,
    titleSize: 64,
    cardBgColor: "#141414",
    cardBorderColor: "#2b2b2b",
    ...overrides,
  });
  const paper = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...light(accent),
    backgroundColor: "#ffffff",
    maxWidth: 1200,
    titleSize: 48,
    cardBgColor: "#fafafa",
    cardBorderColor: "#e5e5e5",
    ...overrides,
  });

  const pagesBuilt = [
    page(
      "Home",
      "home",
      `${brand} | Independent strategy & digital agency`,
      `${brand} is a senior independent agency for strategy, brand, and digital product work.`,
      [
        block("Hero", "mono-grid", {
          badge: "STRATEGY · BRAND · DIGITAL",
          title: "Clarity is the product.",
          subtitle: "We help ambitious teams make sharper decisions, stronger brands, and digital products that hold up under pressure.",
          imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=85&w=1600",
          btnText: "See the work",
          btnActionType: "link",
          btnActionValue: "work",
          secondaryBtnText: "Talk to us",
          secondaryBtnActionType: "link",
          secondaryBtnActionValue: "contact",
        }, ink({ paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, maxWidth: 1600, titleSize: 88 })),
        block("Special", "premium-proof-rail", {
          badge: "SELECTED RESULTS",
          title: "Numbers, not noise.",
          stats: [
            { id: id(), label: "Engagements delivered", val: 120, suffix: "+" },
            { id: id(), label: "Industries served", val: 18, suffix: "" },
            { id: id(), label: "Senior-led teams", val: 100, suffix: "%" },
            { id: id(), label: "Avg. NPS from clients", val: 72, suffix: "" },
          ],
        }, ink({ backgroundColor: "#0d0d0d" })),
        block("Features", "comparison", {
          badge: "CAPABILITIES",
          title: "Three disciplines, one accountable team.",
          subtitle: "No account layers, no juniors learning on your budget. Senior partners on every engagement.",
          features: [
            { id: id(), title: "Strategy", desc: "Positioning, market research, and operating plans that survive contact with reality.", icon: "Compass" },
            { id: id(), title: "Brand", desc: "Identity systems, narrative, and design languages with real backbone.", icon: "Sparkles" },
            { id: id(), title: "Digital product", desc: "Research, product design, and engineering for web and mobile.", icon: "Code2" },
          ],
        }, paper()),
        block("Special", "steps-path", {
          badge: "HOW WE WORK",
          title: "A process with no theatre.",
          subtitle: "Four steps, clearly signposted, with decisions at every gate.",
          steps: [
            { id: id(), step: "01", title: "Diagnose", desc: "A short, paid discovery week to define the real problem." },
            { id: id(), step: "02", title: "Decide", desc: "One strategy and one creative direction, presented with options." },
            { id: id(), step: "03", title: "Deliver", desc: "Senior team builds and ships in focused sprints." },
            { id: id(), step: "04", title: "Hand over", desc: "Systems, documentation, and a team that can run with it." },
          ],
        }, ink()),
        block("CTA", "simple-cta", {
          badge: "NOW BOOKING Q3",
          title: "Have a decision that needs sharper thinking?",
          subtitle: "Tell us where you are stuck and we will tell you honestly whether we can help.",
          btnText: "Start the conversation",
          btnActionType: "link",
          btnActionValue: "contact",
        }, ink({ textAlign: "center", titleSize: 56 })),
      ],
    ),
    page(
      "Services",
      "services",
      `${brand} | Services & engagements`,
      `Strategy, brand, and digital product engagements from ${brand}.`,
      [
        block("Hero", "editorial-stack", {
          badge: "SERVICES",
          title: "Engagements with a beginning, middle, and outcome.",
          subtitle: "Clear scopes, senior teams, and defined deliverables for every engagement.",
          btnText: "Request a scoping call",
          btnActionType: "link",
          btnActionValue: "contact",
        }, paper({ titleSize: 56 })),
        block("Features", "feature-grid", {
          badge: "WHAT WE DO",
          title: "Capabilities in detail.",
          subtitle: "Each discipline is led by a partner and staffed by senior practitioners.",
          features: [
            { id: id(), title: "Market intelligence", desc: "Category, customer, and competitor research with a point of view.", icon: "Search" },
            { id: id(), title: "Growth strategy", desc: "Positioning, pricing, channels, and the operating plan to execute.", icon: "TrendingUp" },
            { id: id(), title: "Brand identity", desc: "Naming, visual systems, verbal identity, and guidelines.", icon: "Palette" },
            { id: id(), title: "Product design", desc: "UX research, journeys, interface design, and prototyping.", icon: "PenTool" },
            { id: id(), title: "Engineering", desc: "Production React, web, and mobile builds with clean code.", icon: "Code2" },
            { id: id(), title: "Design systems", desc: "Component libraries and documentation your team can extend.", icon: "Layers" },
          ],
        }, paper({ backgroundColor: "#f7f7f7" })),
        block("CTA", "image-bg-cta", {
          badge: "CLIENT-FIRST",
          title: "Small team, senior hands, no hand-offs.",
          subtitle: "The people who pitch are the people who build.",
          btnText: "Meet the team",
          btnActionType: "link",
          btnActionValue: "about",
          imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=85&w=1600",
        }, ink({ textAlign: "center", titleSize: 48 })),
      ],
    ),
    page(
      "Work",
      "work",
      `${brand} | Selected work`,
      `A selected archive of strategy, brand, and digital work from ${brand}.`,
      [
        block("Hero", "mono-grid", {
          badge: "SELECTED WORK",
          title: "Proof over promises.",
          subtitle: "A restrained archive of engagements where the outcome is measurable.",
          btnText: "Start a project",
          btnActionType: "link",
          btnActionValue: "contact",
        }, ink({ titleSize: 64 })),
        block("Gallery", "masonry", {
          badge: "ARCHIVE 2023–2026",
          title: "Recent engagements.",
          subtitle: "Strategy, brand, and digital product work across industries.",
          galleryImages: [
            { id: id(), url: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=85&w=1000", title: "Northwind", subtitle: "Growth strategy & brand", aspect: "landscape" },
            { id: id(), url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=85&w=1000", title: "Forma", subtitle: "Digital product", aspect: "square" },
            { id: id(), url: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&q=85&w=1000", title: "Atlas", subtitle: "Brand identity", aspect: "portrait" },
            { id: id(), url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=85&w=1200", title: "Kite", subtitle: "Design system", aspect: "landscape" },
          ],
        }, paper()),
      ],
    ),
    page(
      "About",
      "about",
      `${brand} | About the agency`,
      `The partners and principles behind ${brand}.`,
      [
        block("Text", "signature-editorial", {
          badge: "OUR POINT OF VIEW",
          title: "Most organisations are not short on ideas. They are short on decisions.",
          subtitle: "We built ${brand} around a simple belief: clarity compounds. When strategy, brand, and product share one intent, every downstream decision gets easier, faster, and cheaper to make.\n\nThat is why we are deliberately small. A compact senior team, direct communication, and a working relationship with no account-manager telephone game.",
          btnText: "Work with us",
          btnActionType: "link",
          btnActionValue: "contact",
        }, ink({ titleSize: 64 })),
        block("Features", "bento-box", {
          badge: "THE PRINCIPLES",
          title: "How we run engagements.",
          subtitle: "Four commitments every client gets, in writing.",
          features: [
            { id: id(), title: "Senior only", desc: "Partners on every call. No juniors learning on your budget.", icon: "ShieldCheck" },
            { id: id(), title: "Fixed scopes", desc: "Agreed outcomes, timelines, and costs before we begin.", icon: "FileCheck" },
            { id: id(), title: "Direct access", desc: "Talk to the people doing the work, whenever you need to.", icon: "MessageSquare" },
            { id: id(), title: "Clean handover", desc: "Systems and documentation your team can actually use.", icon: "BookOpen" },
          ],
        }, paper()),
      ],
    ),
    page(
      "Contact",
      "contact",
      `${brand} | Start a project`,
      `Start a project with ${brand}.`,
      [
        block("Hero", "minimal", {
          badge: "CONTACT",
          title: "Tell us what is changing.",
          subtitle: "A short brief is enough to begin. We reply within one business day.",
          btnText: "Send the brief",
          btnActionType: "booking",
          btnActionValue: "",
        }, ink({ textAlign: "center", paddingTop: 96, paddingBottom: 72, titleSize: 56 })),
        block("Forms", "contact-complex", {
          badge: "NEW BUSINESS",
          title: "Start the conversation.",
          subtitle: "Share the decision, the deadline, and the people involved.",
          btnText: "Send project note",
          contactEmail: "hello@greymatter.agency",
          contactPhone: "+91 98220 01100",
          contactAddress: "Koramangala · Bengaluru",
          successMessage: "Thanks — a partner will reply within one business day.",
          whatsappFollowUp: false,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Work email", name: "email", type: "email", placeholder: "you@company.com", required: true, width: "half" },
            { id: id(), label: "What is changing?", name: "message", type: "textarea", placeholder: "A few sentences is enough to begin", required: true, width: "full" },
          ],
        }, paper({ backgroundColor: "#f7f7f7", textAlign: "center" })),
      ],
    ),
  ];

  const products: SiteKitProduct[] = [
    { title: "Strategy Sprint", description: "A four-week paid discovery engagement producing a decision-ready strategy.", price: 150000, image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=85&w=1000", category: "Engagements", tags: ["Strategy", "4 weeks"], badge: "Most booked" },
    { title: "Brand Foundation", description: "Positioning, identity system, and verbal identity in eight weeks.", price: 350000, image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=85&w=1000", category: "Engagements", tags: ["Brand", "8 weeks"], badge: "Flagship" },
    { title: "Product Lab", description: "Research, design, and engineering for one focused product in a quarter.", price: 600000, compareAtPrice: 700000, image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&q=85&w=1000", category: "Engagements", tags: ["Product", "Quarter"], badge: "Limited slots" },
  ];

  return { ...chrome, pages: pagesBuilt, products };
}

// =====================================================================
// KIT 2 · SAAS VELOCITY — premium multi-purpose
// A modern SaaS startup: dark gradient hero, bento features, glow CTAs.
// =====================================================================
function buildSaaSVelocity(businessName: string) {
  const brand = businessName || "Velocity";
  const accent = "#818cf8";
  const pages = [
    { name: "Home", slug: "home" },
    { name: "Features", slug: "features" },
    { name: "Pricing", slug: "pricing" },
    { name: "Insights", slug: "insights" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = kitChrome(brand, pages, {
    accent,
    navVariant: "nav-glass",
    tagline: "The analytics platform for product teams that move fast.",
    contactEmail: "hello@velocity.dev",
    contactPhone: "+1 (415) 555-0182",
    contactAddress: "San Francisco · Remote",
    ctaLabel: "Start free trial",
    ctaSlug: "pricing",
  });
  const space = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...dark(accent),
    backgroundColor: "#030712",
    backgroundGradient: "linear-gradient(135deg, #0b0618 0%, #030712 55%, #101836 100%)",
    maxWidth: 1180,
    titleSize: 56,
    cardBgColor: "#0d1226",
    cardBorderColor: "#232b4d",
    cardBorderRadius: 20,
    buttonBorderRadius: 999,
    ...overrides,
  });
  const frost = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...light(accent),
    backgroundColor: "#f8fafc",
    maxWidth: 1180,
    titleSize: 44,
    cardBgColor: "#ffffff",
    cardBorderColor: "#e2e8f0",
    cardBorderRadius: 20,
    buttonBorderRadius: 999,
    ...overrides,
  });

  const features = [
    { id: id(), title: "Real-time dashboards", desc: "Live product metrics with sub-second refresh and shareable views.", icon: "Activity" },
    { id: id(), title: "Funnels & retention", desc: "Understand where users drop off and what keeps them coming back.", icon: "Filter" },
    { id: id(), title: "A/B testing", desc: "Ship experiments with statistical guardrails built in.", icon: "FlaskConical" },
    { id: id(), title: "Session replay", desc: "Watch real sessions to see the story behind every number.", icon: "PlaySquare" },
    { id: id(), title: "Privacy-first", desc: "GDPR-ready, cookieless tracking that respects your users.", icon: "ShieldCheck" },
    { id: id(), title: "200+ integrations", desc: "Connect your stack in minutes with pre-built connectors.", icon: "Plug" },
  ];

  const pagesBuilt = [
    page(
      "Home",
      "home",
      `${brand} | Product analytics for fast teams`,
      `${brand} gives product teams real-time analytics, funnels, and experiments in one platform.`,
      [
        block("Hero", "gradient-glow", {
          badge: "NEW · COOKIELESS TRACKING",
          title: "Know what works. Ship what matters.",
          subtitle: "Real-time product analytics, funnels, and experiments — without the complexity or the cookie banners.",
          imageUrl: "",
          btnText: "Start free trial",
          btnActionType: "link",
          btnActionValue: "pricing",
          secondaryBtnText: "Watch a demo",
          secondaryBtnActionType: "link",
          secondaryBtnActionValue: "features",
        }, space({ titleSize: 68, backgroundColor: "#030712", backgroundGradient: "linear-gradient(135deg, #0b0618 0%, #030712 55%, #101836 100%)" })),
        block("Special", "premium-proof-rail", {
          badge: "TRUSTED BY PRODUCT TEAMS",
          title: "Built for teams that measure twice.",
          stats: [
            { id: id(), label: "Events processed daily", val: 480, suffix: "M+" },
            { id: id(), label: "Product teams", val: 12000, suffix: "+" },
            { id: id(), label: "Uptime", val: 99.99, suffix: "%" },
            { id: id(), label: "Time to first chart", val: 4, suffix: " min" },
          ],
        }, space({ backgroundColor: "#050a18" })),
        block("Features", "bento-box", {
          badge: "FEATURES",
          title: "Everything you need to understand your product.",
          subtitle: "One platform for analytics, experimentation, and user insights.",
          features,
        }, space()),
        block("Business", "premium-story-split", {
          badge: "CUSTOMER STORY",
          title: "How Northwind cut time-to-insight from days to minutes.",
          subtitle: "By replacing a five-tool analytics stack with one connected platform, the team went from waiting on weekly exports to making decisions in the daily stand-up.",
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=85&w=1400",
          btnText: "Read the story",
          btnActionType: "link",
          btnActionValue: "insights",
          features: [
            { id: id(), title: "One source of truth", desc: "Dashboards, funnels, and experiments read the same data.", icon: "Database" },
            { id: id(), title: "Faster decisions", desc: "Insights land in the daily stand-up, not the weekly report.", icon: "Zap" },
            { id: id(), title: "Higher trust", desc: "Engineers verify their own data before it ships.", icon: "ShieldCheck" },
          ],
        }, space()),
        block("Testimonials", "premium-testimonial-carousel", {
          badge: "LOVED BY BUILDERS",
          title: "What product teams say.",
          subtitle: "Real feedback from teams using Velocity every day.",
          testimonials: [
            { id: id(), name: "Elena Petrova", role: "Head of Product · Northwind", content: "Velocity replaced three tools and a weekly export ritual. We make better decisions in the daily stand-up now.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Jonas Weber", role: "Founder · Scalebase", content: "The funnels and session replay combination is unbeatable. We found our biggest activation leak in an afternoon.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Priya Nair", role: "Product Ops · Forma", content: "Finally, analytics my engineers actually trust. Setup took a single afternoon.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=240", rating: 5 },
          ],
        }, frost()),
        block("CTA", "gradient-cta", {
          badge: "FREE 14-DAY TRIAL",
          title: "Start measuring better today.",
          subtitle: "No credit card required. Set up in minutes, see your first chart in four.",
          btnText: "Start free trial",
          btnActionType: "link",
          btnActionValue: "pricing",
        }, space({ textAlign: "center", titleSize: 52 })),
      ],
    ),
    page(
      "Features",
      "features",
      `${brand} | Product analytics features`,
      `Dashboards, funnels, experiments, session replay, and privacy-first tracking from ${brand}.`,
      [
        block("Hero", "saas-modern", {
          badge: "FEATURES",
          title: "A platform, not a puzzle.",
          subtitle: "Six connected capabilities that work together out of the box.",
          imageUrl: "",
          btnText: "See pricing",
          btnActionType: "link",
          btnActionValue: "pricing",
        }, space({ titleSize: 60 })),
        block("Features", "feature-grid", {
          badge: "CORE CAPABILITIES",
          title: "Everything, in one place.",
          subtitle: "Every feature reads the same events, so your metrics always agree.",
          features,
        }, frost()),
        block("Special", "premium-faq", {
          badge: "COMMON QUESTIONS",
          title: "Answers before you ask.",
          subtitle: "The things teams usually want to know before trying Velocity.",
          btnText: "Talk to sales",
          btnActionType: "link",
          btnActionValue: "contact",
          faqs: [
            { id: id(), q: "How long does setup take?", a: "Most teams see their first chart within four minutes of installing the snippet. Full instrumentation of a web app usually takes under a day." },
            { id: id(), q: "Is it privacy compliant?", a: "Yes. Velocity is cookieless by default, GDPR-ready, and offers EU data residency on every paid plan." },
            { id: id(), q: "Can we migrate from another tool?", a: "We provide one-click imports from the major analytics platforms, including historical events." },
          ],
        }, space()),
      ],
    ),
    page(
      "Pricing",
      "pricing",
      `${brand} | Pricing`,
      `Simple, transparent pricing for product analytics from ${brand}.`,
      [
        block("Hero", "minimal", {
          badge: "PRICING",
          title: "Simple pricing that scales with you.",
          subtitle: "Start free. Upgrade when your team needs more. Cancel anytime.",
          btnText: "See all plans",
          btnActionType: "scroll",
          btnActionValue: "",
        }, space({ textAlign: "center", titleSize: 56 })),
        block("Pricing", "premium-pricing-toggle", {
          badge: "PLANS",
          title: "Choose the right plan.",
          subtitle: "Every plan includes unlimited seats and core analytics.",
          btnActionType: "link",
          btnActionValue: "contact",
          pricing: [
            { id: id(), tier: "Starter", price: "$0", features: ["Up to 1M events/mo", "Core dashboards", "Community support"], btnText: "Start free", popular: false },
            { id: id(), tier: "Growth", price: "$49", features: ["Up to 10M events/mo", "Funnels & retention", "A/B testing", "Email support"], btnText: "Start 14-day trial", popular: true },
            { id: id(), tier: "Scale", price: "$199", features: ["Unlimited events", "Session replay", "SSO & audit logs", "Priority support"], btnText: "Talk to sales", popular: false },
          ],
        }, space()),
        block("CTA", "gradient-cta", {
          badge: "SWITCH FROM ANY TOOL",
          title: "Migrate in an afternoon.",
          subtitle: "Free migration support for teams moving from any analytics platform.",
          btnText: "Get started",
          btnActionType: "link",
          btnActionValue: "contact",
        }, frost()),
      ],
    ),
    page(
      "Insights",
      "insights",
      `${brand} | Insights & guides`,
      `Practical guides on product analytics, experimentation, and growth from ${brand}.`,
      [
        block("Hero", "editorial-stack", {
          badge: "INSIGHTS",
          title: "Notes from the product trenches.",
          subtitle: "Short, practical essays on analytics, experimentation, and growth.",
          btnText: "Start a trial",
          btnActionType: "link",
          btnActionValue: "pricing",
        }, frost({ titleSize: 54 })),
        block("Text", "article-body", {
          badge: "EXPERIMENTATION",
          title: "The smallest experiment that changed our pricing.",
          subtitle: "We moved a single pricing button and learned more in a week than in a quarter of surveys. Here is how to run experiments your team will actually trust — sample size, guardrails, and the discipline to stop early.",
        }, space({ maxWidth: 860 })),
        block("Special", "faq-accordions", {
          badge: "START HERE",
          title: "Frequently asked by new teams.",
          subtitle: "The first questions teams ask when adopting Velocity.",
          faqs: [
            { id: id(), q: "Do we need a data team?", a: "No. Velocity is designed for product and growth teams without dedicated data engineers." },
            { id: id(), q: "Does it work for mobile apps?", a: "Yes — iOS, Android, and React Native SDKs are included on every plan." },
          ],
        }, space()),
      ],
    ),
    page(
      "Contact",
      "contact",
      `${brand} | Contact sales`,
      `Contact the ${brand} team about plans, migration, or enterprise needs.`,
      [
        block("Hero", "minimal", {
          badge: "CONTACT",
          title: "Talk to a human.",
          subtitle: "Sales, support, or migration — we reply within one business day.",
          btnText: "Send a message",
          btnActionType: "booking",
          btnActionValue: "",
        }, space({ textAlign: "center", titleSize: 52 })),
        block("Forms", "premium-contact-panel", {
          badge: "GET IN TOUCH",
          title: "How can we help?",
          subtitle: "Tell us what you are building and we will route you to the right person.",
          btnText: "Send message",
          contactEmail: "hello@velocity.dev",
          contactPhone: "+1 (415) 555-0182",
          contactAddress: "San Francisco · Remote",
          successMessage: "Thanks — the team will reply within one business day.",
          whatsappFollowUp: false,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Work email", name: "email", type: "email", placeholder: "you@company.com", required: true, width: "half" },
            { id: id(), label: "Topic", name: "topic", type: "select", required: true, width: "full", options: ["Sales", "Support", "Migration", "Enterprise"] },
            { id: id(), label: "Message", name: "message", type: "textarea", placeholder: "How can we help?", required: true, width: "full" },
          ],
        }, frost({ backgroundColor: "#f8fafc" })),
      ],
    ),
  ];

  const products: SiteKitProduct[] = [
    { title: "Growth", description: "Up to 10M events per month with funnels, retention, and experiments.", price: 49, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=85&w=1000", category: "Plans", tags: ["Monthly"], badge: "Most popular" },
    { title: "Scale", description: "Unlimited events with session replay, SSO, and priority support.", price: 199, compareAtPrice: 249, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=85&w=1000", category: "Plans", tags: ["Monthly"] },
    { title: "Enterprise", description: "Custom limits, EU residency, dedicated support, and onboarding.", price: 999, image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=85&w=1000", category: "Plans", tags: ["Annual"], badge: "Custom" },
  ];

  return { ...chrome, pages: pagesBuilt, products };
}

// =====================================================================
// KIT 3 · PRESTIGE REALTY — premium multi-purpose
// Luxury real estate: deep green + gold, gallery-led listings.
// =====================================================================
function buildPrestigeRealty(businessName: string) {
  const brand = businessName || "Prestige Estates";
  const accent = "#c8a24a";
  const pages = [
    { name: "Home", slug: "home" },
    { name: "Listings", slug: "listings" },
    { name: "Services", slug: "services" },
    { name: "About", slug: "about" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = kitChrome(brand, pages, {
    accent,
    tone: "light",
    tagline: "Bespoke property advisory for distinguished homes and landmark investments.",
    contactEmail: "advisory@prestige-estates.com",
    contactPhone: "+91 98450 22000",
    contactAddress: "Lavelle Road · Bengaluru",
    ctaLabel: "Book a viewing",
    ctaSlug: "contact",
  });
  const emerald = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...dark(accent),
    backgroundColor: "#0c1a14",
    backgroundGradient: "linear-gradient(135deg, #0c1a14 0%, #14281d 60%, #1c3525 100%)",
    maxWidth: 1240,
    titleSize: 58,
    cardBgColor: "#12211a",
    cardBorderColor: "#2a4232",
    buttonBorderRadius: 4,
    ...overrides,
  });
  const cream = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...light(accent),
    backgroundColor: "#f7f4ec",
    maxWidth: 1240,
    titleSize: 46,
    cardBgColor: "#ffffff",
    cardBorderColor: "#e3dcc9",
    buttonBorderRadius: 4,
    ...overrides,
  });

  const pagesBuilt = [
    page(
      "Home",
      "home",
      `${brand} | Luxury real estate advisory`,
      `${brand} curates distinguished residences and landmark investment properties.`,
      [
        block("Hero", "split", {
          badge: "LUXURY PROPERTY ADVISORY · EST. 1998",
          title: "Homes that outlast the market.",
          subtitle: "From heritage bungalows to skyline penthouses — a private advisory for buyers who expect more than a listing.",
          imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=85&w=1600",
          btnText: "Explore listings",
          btnActionType: "link",
          btnActionValue: "listings",
          secondaryBtnText: "Book a private viewing",
          secondaryBtnActionType: "link",
          secondaryBtnActionValue: "contact",
        }, emerald({ titleSize: 60 })),
        block("Special", "premium-proof-rail", {
          badge: "THE PRESTIGE STANDARD",
          title: "A practice built on discretion.",
          stats: [
            { id: id(), label: "Properties sold", val: 2400, suffix: "+" },
            { id: id(), label: "Years of advisory", val: 28, suffix: "" },
            { id: id(), label: "Private client relationships", val: 900, suffix: "+" },
            { id: id(), label: "Avg. transaction value", val: 8.2, suffix: "Cr" },
          ],
        }, emerald({ backgroundColor: "#0e2017" })),
        block("Features", "signature-bento", {
          badge: "SIGNATURE HOMES",
          title: "A curated portfolio, not a catalogue.",
          subtitle: "Every residence is personally vetted for architecture, provenance, and long-term value.",
          features: [
            { id: id(), title: "Garden villas", desc: "Private residences in Bangalore's leafy enclaves, from 6,000 sq. ft.", icon: "Home", eyebrow: "VILLAS", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=85&w=1200", linkText: "View villas", linkActionType: "link", linkActionValue: "listings" },
            { id: id(), title: "Skyline apartments", desc: "Full-floor penthouses with uninterrupted views and private terraces.", icon: "Building2", eyebrow: "RESIDENCES", imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=85&w=1200", linkText: "View residences", linkActionType: "link", linkActionValue: "listings" },
            { id: id(), title: "Heritage bungalows", desc: "Period architecture with verified provenance and careful restoration.", icon: "Landmark", eyebrow: "HERITAGE", imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=85&w=1200", linkText: "View heritage", linkActionType: "link", linkActionValue: "listings" },
            { id: id(), title: "Investment parcels", desc: "Land and commercial assets positioned for long-term appreciation.", icon: "TrendingUp", eyebrow: "INVESTMENT", imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=85&w=1200", linkText: "Talk to advisory", linkActionType: "link", linkActionValue: "contact" },
          ],
        }, cream()),
        block("CTA", "image-bg-cta", {
          badge: "PRIVATE ADVISORY",
          title: "Some addresses are not advertised.",
          subtitle: "Unlisted off-market properties are available to clients by referral and relationship.",
          btnText: "Request an introduction",
          btnActionType: "link",
          btnActionValue: "contact",
          imageUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=85&w=1600",
        }, emerald({ textAlign: "center", titleSize: 52 })),
      ],
    ),
    page(
      "Listings",
      "listings",
      `${brand} | Featured listings`,
      `A curated selection of villas, residences, and heritage homes from ${brand}.`,
      [
        block("Hero", "editorial-stack", {
          badge: "FEATURED LISTINGS",
          title: "The collection.",
          subtitle: "A hand-picked selection of the finest residences currently available.",
          btnText: "Arrange a viewing",
          btnActionType: "link",
          btnActionValue: "contact",
        }, cream({ titleSize: 54 })),
        block("Gallery", "premium-gallery-lightbox", {
          badge: "THE COLLECTION",
          title: "Properties of the month.",
          subtitle: "Each residence is verified, photographed, and priced with complete transparency.",
          galleryImages: [
            { id: id(), url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=85&w=1200", title: "The Palm Grove Villa", subtitle: "6,200 sq. ft · ₹12.5 Cr", aspect: "landscape" },
            { id: id(), url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=85&w=1000", title: "Skyline Penthouse", subtitle: "4,100 sq. ft · ₹9.8 Cr", aspect: "square" },
            { id: id(), url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=85&w=1000", title: "The Ivory Bungalow", subtitle: "Heritage · On request", aspect: "portrait" },
            { id: id(), url: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=85&w=1200", title: "Lakeside Court", subtitle: "3,800 sq. ft · ₹7.2 Cr", aspect: "landscape" },
          ],
        }, emerald({ backgroundColor: "#0e2017" })),
        block("Special", "premium-faq", {
          badge: "BUYER'S GUIDE",
          title: "What serious buyers ask.",
          subtitle: "Transparent answers about process, provenance, and pricing.",
          btnText: "Ask our advisory",
          btnActionType: "link",
          btnActionValue: "contact",
          faqs: [
            { id: id(), q: "Are all listings exclusive to you?", a: "Most are. A portion of our portfolio is off-market and shown only to pre-qualified buyers." },
            { id: id(), q: "Do you handle legal due diligence?", a: "Yes. Every transaction includes title verification, encumbrance checks, and independent legal counsel." },
            { id: id(), q: "Can you help with financing?", a: "We coordinate with partner lenders for pre-approved home loans and structured purchase plans." },
          ],
        }, cream()),
      ],
    ),
    page(
      "Services",
      "services",
      `${brand} | Services`,
      `Buying, selling, valuation, and portfolio services from ${brand}.`,
      [
        block("Hero", "quiet-luxury", {
          badge: "SERVICES",
          title: "Advisory beyond the transaction.",
          subtitle: "A full-service practice for acquiring, holding, and divesting premium property.",
          imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=85&w=1400",
          btnText: "Discuss your goals",
          btnActionType: "link",
          btnActionValue: "contact",
        }, emerald({ titleSize: 56 })),
        block("Features", "feature-grid", {
          badge: "WHAT WE OFFER",
          title: "Every stage, one advisor.",
          subtitle: "Senior guidance from first conversation to handover of keys.",
          features: [
            { id: id(), title: "Buyer representation", desc: "Off-market access and negotiation on your behalf, not the seller's.", icon: "KeyRound" },
            { id: id(), title: "Discreet sales", desc: "Confidential marketing and qualified-buyer matching for sellers.", icon: "Handshake" },
            { id: id(), title: "Valuation", desc: "Independent, evidence-based valuation for purchase or portfolio.", icon: "Scale" },
            { id: id(), title: "Portfolio advisory", desc: "Long-term planning for owners holding multiple properties.", icon: "PieChart" },
            { id: id(), title: "Legal & escrow", desc: "Title verification, agreements, and escrow through partner counsel.", icon: "ShieldCheck" },
            { id: id(), title: "Interior concierge", desc: "Designers, architects, and fit-out partners for turnkey homes.", icon: "Sparkles" },
          ],
        }, cream({ backgroundColor: "#f7f4ec" })),
      ],
    ),
    page(
      "About",
      "about",
      `${brand} | About`,
      `The people and principles behind ${brand}.`,
      [
        block("Text", "signature-editorial", {
          badge: "OUR STORY",
          title: "Twenty-eight years of quiet transactions.",
          subtitle: "Prestige Estates began with a single family office and a simple rule: never show a client a property we would not buy ourselves.\n\nToday the practice advises a private network of families, founders, and institutions — still deliberately small, still on first-name terms with our clients.",
          btnText: "Meet the team",
          btnActionType: "link",
          btnActionValue: "contact",
        }, emerald({ titleSize: 60 })),
        block("Special", "premium-roadmap", {
          badge: "HOW WE WORK",
          title: "A considered process.",
          subtitle: "From first conversation to keys in hand.",
          steps: [
            { id: id(), step: "01", title: "Discovery", desc: "A private meeting to understand your goals, timeline, and criteria." },
            { id: id(), step: "02", title: "Curation", desc: "A shortlist of verified properties, including off-market options." },
            { id: id(), step: "03", title: "Viewings", desc: "Chauffeur-led private viewings at your convenience." },
            { id: id(), step: "04", title: "Closing", desc: "Negotiation, legal review, escrow, and handover." },
          ],
        }, cream()),
      ],
    ),
    page(
      "Contact",
      "contact",
      `${brand} | Contact`,
      `Book a viewing or start a private conversation with ${brand}.`,
      [
        block("Map", "signature-map", {
          badge: "THE OFFICE",
          title: "Conversations begin here.",
          subtitle: "By appointment on Lavelle Road, or anywhere your schedule takes us.",
          mapAddress: "Lavelle Road, Bengaluru, Karnataka, India",
          contactPhone: "+91 98450 22000",
          contactEmail: "advisory@prestige-estates.com",
          contactAddress: "Lavelle Road · Bengaluru",
          btnText: "Get directions",
        }, emerald()),
        block("Forms", "signature-form", {
          badge: "PRIVATE VIEWING",
          title: "Request an appointment.",
          subtitle: "Tell us what you are looking for and our advisory will be in touch.",
          btnText: "Request viewing",
          contactEmail: "advisory@prestige-estates.com",
          contactPhone: "+91 98450 22000",
          contactAddress: "Lavelle Road · Bengaluru",
          successMessage: "Thank you. Our advisory team will contact you to arrange a private conversation.",
          whatsappFollowUp: false,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Email", name: "email", type: "email", placeholder: "you@email.com", required: true, width: "half" },
            { id: id(), label: "Property interest", name: "interest", type: "select", required: true, width: "full", options: ["Villas", "Residences", "Heritage", "Investment"] },
            { id: id(), label: "Message", name: "message", type: "textarea", placeholder: "Your criteria and timing", required: false, width: "full" },
          ],
        }, cream({ backgroundColor: "#f7f4ec" })),
      ],
    ),
  ];

  const products: SiteKitProduct[] = [
    { title: "The Palm Grove Villa", description: "6,200 sq. ft garden villa with pool, home office, and staff quarters.", price: 125000000, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=85&w=1200", category: "Villas", tags: ["For sale"], badge: "Featured" },
    { title: "Skyline Penthouse", description: "Full-floor residence with 360° views and private terrace.", price: 98000000, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=85&w=1000", category: "Residences", tags: ["For sale"], badge: "New" },
    { title: "The Ivory Bungalow", description: "1920s heritage bungalow, restored to original detail.", price: 150000000, compareAtPrice: 160000000, image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=85&w=1000", category: "Heritage", tags: ["On request"] },
  ];

  return { ...chrome, pages: pagesBuilt, products };
}

// =====================================================================
// KIT 4 · CODECRAFT BOOTCAMP — education & courses
// A coding bootcamp: dark indigo, neon accents, curriculum-led.
// =====================================================================
function buildCodecraftBootcamp(businessName: string) {
  const brand = businessName || "CodeCraft";
  const accent = "#a78bfa";
  const pages = [
    { name: "Home", slug: "home" },
    { name: "Curriculum", slug: "curriculum" },
    { name: "Mentors", slug: "mentors" },
    { name: "Admissions", slug: "apply" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = kitChrome(brand, pages, {
    accent,
    tagline: "A 16-week immersive bootcamp that turns beginners into hire-ready developers.",
    contactEmail: "admissions@codecraft.dev",
    contactPhone: "+91 99010 44550",
    contactAddress: "HSR Layout · Bengaluru",
    ctaLabel: "Apply now",
    ctaSlug: "apply",
  });
  const nebula = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...dark(accent),
    backgroundColor: "#0b0918",
    backgroundGradient: "linear-gradient(135deg, #0b0918 0%, #151129 55%, #1d1440 100%)",
    maxWidth: 1180,
    titleSize: 58,
    cardBgColor: "#161232",
    cardBorderColor: "#2e2560",
    cardBorderRadius: 18,
    buttonBorderRadius: 10,
    ...overrides,
  });
  const cloud = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...light(accent),
    backgroundColor: "#f8f7ff",
    maxWidth: 1180,
    titleSize: 44,
    cardBgColor: "#ffffff",
    cardBorderColor: "#e4e0f5",
    cardBorderRadius: 18,
    buttonBorderRadius: 10,
    ...overrides,
  });

  const tracks = [
    { id: id(), title: "Frontend Foundations", desc: "HTML, CSS, JavaScript, and the browser platform — mastered, not memorised.", icon: "Layout", eyebrow: "WEEK 1–4" },
    { id: id(), title: "React & Modern Web", desc: "Components, state, hooks, and building real products from day one.", icon: "Atom", eyebrow: "WEEK 5–8" },
    { id: id(), title: "Backend & Databases", desc: "Node.js, PostgreSQL, and APIs that scale beyond the tutorial.", icon: "Server", eyebrow: "WEEK 9–12" },
    { id: id(), title: "Portfolio & Interviews", desc: "Two production projects, system design, and mock interviews with hiring partners.", icon: "Briefcase", eyebrow: "WEEK 13–16" },
  ];

  const pagesBuilt = [
    page(
      "Home",
      "home",
      `${brand} | Learn to code in 16 weeks`,
      `${brand} is a 16-week immersive coding bootcamp in Bengaluru that turns beginners into hire-ready developers.`,
      [
        block("Hero", "academy-cinematic", {
          badge: "IMMERSIVE BOOTCAMP · BENGALURU · NEXT COHORT IN 6 WEEKS",
          title: "Become a developer in 16 weeks.",
          subtitle: "A structured, project-driven bootcamp with live instruction, real-world builds, and direct hiring partnerships.",
          imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=85&w=1600",
          btnText: "Apply now",
          btnActionType: "link",
          btnActionValue: "apply",
          secondaryBtnText: "View curriculum",
          secondaryBtnActionType: "link",
          secondaryBtnActionValue: "curriculum",
        }, nebula({ titleSize: 66 })),
        block("Special", "premium-proof-rail", {
          badge: "OUTCOMES",
          title: "Results our students can verify.",
          stats: [
            { id: id(), label: "Graduates hired", val: 94, suffix: "%" },
            { id: id(), label: "Hiring partners", val: 120, suffix: "+" },
            { id: id(), label: "Average salary uplift", val: 2.4, suffix: "x" },
            { id: id(), label: "Cohort size", val: 28, suffix: "" },
          ],
        }, nebula({ backgroundColor: "#0e0b20" })),
        block("Features", "premium-bento-grid", {
          badge: "CURRICULUM",
          title: "Four tracks, one clear path to hire.",
          subtitle: "Every track ends with a portfolio-grade project reviewed by hiring partners.",
          features: tracks,
        }, nebula()),
        block("Special", "academy-process", {
          badge: "YOUR WEEK AT CODECRAFT",
          title: "A rhythm built for deep work.",
          subtitle: "Live instruction, guided labs, and time to build.",
          steps: [
            { id: id(), step: "09:00", title: "Live lecture", desc: "New concepts with working examples, questions encouraged." },
            { id: id(), step: "11:00", title: "Guided lab", desc: "Pair programming on structured exercises with mentors." },
            { id: id(), step: "14:00", title: "Build time", desc: "Apply the day's learning to your own project." },
            { id: id(), step: "17:00", title: "Code review", desc: "Daily feedback on your pull requests, every day." },
          ],
        }, nebula({ backgroundColor: "#1a1533" })),
        block("Testimonials", "premium-testimonial-carousel", {
          badge: "STUDENT STORIES",
          title: "From first line of code to first offer.",
          subtitle: "Graduates who started exactly where you are.",
          testimonials: [
            { id: id(), name: "Rohan Mehta", role: "Frontend Engineer · FinScale", content: "I had zero coding experience in March. By August I had two job offers. The structure and daily code reviews made all the difference.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Divya Sharma", role: "Developer · Lumen", content: "The hiring-partner network is real. My final project was reviewed by the team that later hired me.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Arjun Nair", role: "Full-stack Developer · Atlas", content: "Worth every rupee. The mentors treat you like a colleague from week one, not a student.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=240", rating: 5 },
          ],
        }, cloud()),
        block("CTA", "academy-spotlight", {
          title: "Your next cohort starts in six weeks.",
          subtitle: "Applications close early. Seats are limited to 28 per cohort to protect quality.",
          btnText: "Start your application",
          btnActionType: "link",
          btnActionValue: "apply",
        }, nebula()),
      ],
    ),
    page(
      "Curriculum",
      "curriculum",
      `${brand} | Curriculum`,
      `The full 16-week ${brand} curriculum, track by track.`,
      [
        block("Hero", "academy-cinematic", {
          badge: "CURRICULUM",
          title: "16 weeks. Four tracks. Zero filler.",
          subtitle: "Every week has a learning goal, a build, and a review.",
          imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=85&w=1600",
          btnText: "Apply for the next cohort",
          btnActionType: "link",
          btnActionValue: "apply",
        }, nebula()),
        block("Features", "academy-courses", {
          badge: "THE TRACKS",
          title: "Choose your path or complete the full stack.",
          subtitle: "Most students complete all four tracks in the immersive program.",
          features: tracks,
        }, nebula()),
        block("Special", "premium-roadmap", {
          badge: "PROJECT PIPELINE",
          title: "Two portfolio projects, built in public.",
          subtitle: "Projects are reviewed by hiring partners at demo day.",
          steps: [
            { id: id(), step: "01", title: "Project One", desc: "A full frontend product — data fetching, state, and polish." },
            { id: id(), step: "02", title: "Project Two", desc: "A full-stack app with database, auth, and deployment." },
            { id: id(), step: "03", title: "Demo Day", desc: "Present to 120+ hiring partners and alumni network." },
          ],
        }, cloud()),
      ],
    ),
    page(
      "Mentors",
      "mentors",
      `${brand} | Mentors`,
      `The senior engineers and mentors behind ${brand}.`,
      [
        block("Hero", "academy-cinematic", {
          badge: "MENTORS",
          title: "Learn from people who ship.",
          subtitle: "Every mentor is a working senior engineer at a product company.",
          imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=85&w=1600",
          btnText: "Meet us at open house",
          btnActionType: "link",
          btnActionValue: "contact",
        }, nebula()),
        block("Business", "premium-story-split", {
          badge: "MENTORING STANDARD",
          title: "Small ratios, serious feedback.",
          subtitle: "One mentor per six students, with daily code review and weekly 1:1s. No pre-recorded videos, no teaching assistants in the dark.",
          imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=85&w=1400",
          btnText: "See what students say",
          btnActionType: "link",
          btnActionValue: "home",
          features: [
            { id: id(), title: "Daily code review", desc: "Pull requests reviewed every single day.", icon: "GitPullRequest" },
            { id: id(), title: "Weekly 1:1s", desc: "Progress, blockers, and career direction.", icon: "MessageSquare" },
            { id: id(), title: "Live debugging", desc: "Mentors work through problems on your screen.", icon: "Bug" },
          ],
        }, cloud()),
      ],
    ),
    page(
      "Admissions",
      "apply",
      `${brand} | Admissions`,
      `Apply to the next ${brand} cohort.`,
      [
        block("Hero", "minimal", {
          badge: "ADMISSIONS",
          title: "No experience required. Grit is.",
          subtitle: "Our admissions process finds motivated learners, not prior coders.",
          btnText: "Start the application",
          btnActionType: "booking",
          btnActionValue: "",
        }, nebula({ textAlign: "center", titleSize: 54 })),
        block("Forms", "academy-registration", {
          badge: "APPLICATION",
          title: "Apply in five minutes.",
          subtitle: "We review every application personally and reply within three days.",
          btnText: "Submit application",
          successMessage: "Application received. The admissions team will contact you within three days.",
          whatsappFollowUp: true,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your full name", required: true, width: "full" },
            { id: id(), label: "Email", name: "email", type: "email", placeholder: "you@example.com", required: true, width: "half" },
            { id: id(), label: "Phone", name: "phone", type: "tel", placeholder: "+91 98765 43210", required: true, width: "half" },
            { id: id(), label: "Cohort preference", name: "cohort", type: "select", required: true, width: "full", options: ["Full-stack immersive", "Frontend track", "Backend track"] },
            { id: id(), label: "Tell us your story", name: "message", type: "textarea", placeholder: "Why do you want to learn to code?", required: true, width: "full" },
          ],
        }, nebula()),
      ],
    ),
    page(
      "Contact",
      "contact",
      `${brand} | Contact`,
      `Contact ${brand} admissions about cohorts, financing, or hiring graduates.`,
      [
        block("Hero", "academy-cinematic", {
          badge: "GET IN TOUCH",
          title: "Ask us anything.",
          subtitle: "Admissions, financing plans, or hiring our graduates — real humans reply.",
          imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=85&w=1400",
          btnText: "Send an enquiry",
          btnActionType: "booking",
          btnActionValue: "",
        }, nebula()),
        block("Forms", "premium-contact-panel", {
          badge: "ENQUIRY",
          title: "We reply within one business day.",
          subtitle: "Tell us where you are in your journey.",
          btnText: "Send enquiry",
          contactEmail: "admissions@codecraft.dev",
          contactPhone: "+91 99010 44550",
          contactAddress: "HSR Layout · Bengaluru",
          successMessage: "Thanks — admissions will reply within one business day.",
          whatsappFollowUp: false,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Email", name: "email", type: "email", placeholder: "you@example.com", required: true, width: "half" },
            { id: id(), label: "Topic", name: "topic", type: "select", required: true, width: "full", options: ["Admissions", "Financing", "Hiring graduates", "Partnerships"] },
            { id: id(), label: "Message", name: "message", type: "textarea", placeholder: "How can we help?", required: true, width: "full" },
          ],
        }, cloud({ backgroundColor: "#f8f7ff" })),
      ],
    ),
  ];

  const products: SiteKitProduct[] = [
    { title: "Full-stack Immersive", description: "The complete 16-week program with all four tracks and demo day.", price: 185000, compareAtPrice: 210000, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=85&w=1000", category: "Programs", tags: ["16 weeks"], badge: "Most popular" },
    { title: "Frontend Track", description: "Eight weeks focused on React, modern web, and frontend portfolio.", price: 95000, image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=85&w=1000", category: "Programs", tags: ["8 weeks"] },
    { title: "Backend Track", description: "Eight weeks on Node.js, databases, and production APIs.", price: 95000, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=85&w=1000", category: "Programs", tags: ["8 weeks"], badge: "New" },
  ];

  return { ...chrome, pages: pagesBuilt, products };
}

// =====================================================================
// KIT 5 · BLOOM LANGUAGE — education & courses
// A warm language studio: coral + cream, friendly and human.
// =====================================================================
function buildBloomLanguage(businessName: string) {
  const brand = businessName || "Bloom Language Studio";
  const accent = "#f4714f";
  const pages = [
    { name: "Home", slug: "home" },
    { name: "Programs", slug: "programs" },
    { name: "Teachers", slug: "teachers" },
    { name: "Stories", slug: "journal" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = kitChrome(brand, pages, {
    accent,
    tone: "light",
    tagline: "Small-group language classes that make you want to keep speaking.",
    contactEmail: "hello@bloomlanguage.com",
    contactPhone: "+91 99080 33110",
    contactAddress: "Indiranagar · Bengaluru",
    ctaLabel: "Book a trial class",
    ctaSlug: "contact",
  });
  const sunset = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...dark(accent),
    backgroundColor: "#2a1410",
    backgroundGradient: "linear-gradient(135deg, #2a1410 0%, #3b1e14 55%, #4d2718 100%)",
    maxWidth: 1120,
    titleSize: 54,
    cardBgColor: "#331a12",
    cardBorderColor: "#5a3423",
    cardBorderRadius: 20,
    buttonBorderRadius: 999,
    ...overrides,
  });
  const bloom = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...light(accent),
    backgroundColor: "#fff8f4",
    maxWidth: 1120,
    titleSize: 42,
    cardBgColor: "#ffffff",
    cardBorderColor: "#f3ddd2",
    cardBorderRadius: 20,
    buttonBorderRadius: 999,
    ...overrides,
  });

  const programs = [
    { id: id(), title: "Everyday English", desc: "Conversation, confidence, and the phrases real life needs.", icon: "MessagesSquare", eyebrow: "BEGINNER → INTERMEDIATE" },
    { id: id(), title: "Business French", desc: "Presentations, negotiations, and emails that sound fluent.", icon: "Briefcase", eyebrow: "INTERMEDIATE+" },
    { id: id(), title: "Travel Spanish", desc: "From hola to a whole trip planned and booked in Spanish.", icon: "Plane", eyebrow: "ALL LEVELS" },
    { id: id(), title: "Academic German", desc: "Test prep and university readiness with native speakers.", icon: "GraduationCap", eyebrow: "ADVANCED" },
  ];

  const pagesBuilt = [
    page(
      "Home",
      "home",
      `${brand} | Learn languages in small groups`,
      `${brand} teaches English, French, Spanish, and German in small, warm group classes.`,
      [
        block("Hero", "warm-studio", {
          badge: "SMALL CLASSES · REAL CONVERSATION",
          title: "Languages grow when you enjoy them.",
          subtitle: "Four languages, six students per class, and teachers who remember your name.",
          imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=85&w=1600",
          btnText: "Book a free trial class",
          btnActionType: "link",
          btnActionValue: "contact",
          secondaryBtnText: "See the programs",
          secondaryBtnActionType: "link",
          secondaryBtnActionValue: "programs",
        }, sunset({ titleSize: 58 })),
        block("Special", "premium-proof-rail", {
          badge: "BLOOM COMMUNITY",
          title: "A studio people stay with.",
          stats: [
            { id: id(), label: "Students learning", val: 1400, suffix: "+" },
            { id: id(), label: "Languages taught", val: 4, suffix: "" },
            { id: id(), label: "Avg. class size", val: 6, suffix: "" },
            { id: id(), label: "Student retention", val: 88, suffix: "%" },
          ],
        }, sunset({ backgroundColor: "#31180f" })),
        block("Features", "academy-courses", {
          badge: "PROGRAMS",
          title: "Find your language.",
          subtitle: "Every program is built around speaking from the very first class.",
          features: programs,
        }, bloom()),
        block("Special", "steps-path", {
          badge: "YOUR FIRST MONTH",
          title: "From hello to conversation.",
          subtitle: "A gentle on-ramp designed for busy adults.",
          steps: [
            { id: id(), step: "01", title: "Trial class", desc: "Meet your teacher and try the language, free." },
            { id: id(), step: "02", title: "Placement", desc: "We find the level that is challenging but not overwhelming." },
            { id: id(), step: "03", title: "Weekly rhythm", desc: "Two classes a week, homework that is actually useful." },
            { id: id(), step: "04", title: "Review", desc: "A check-in every month with your teacher on progress." },
          ],
        }, sunset()),
        block("CTA", "simple-cta", {
          badge: "TRIAL CLASSES THIS WEEK",
          title: "Try a language before you commit.",
          subtitle: "One free session. No pressure, no sales pitch.",
          btnText: "Book my trial",
          btnActionType: "link",
          btnActionValue: "contact",
        }, bloom()),
      ],
    ),
    page(
      "Programs",
      "programs",
      `${brand} | Language programs`,
      `English, French, Spanish, and German programs at ${brand}.`,
      [
        block("Hero", "editorial-stack", {
          badge: "PROGRAMS",
          title: "Four languages, one method: speak early, speak often.",
          subtitle: "Every program is level-tested and capped at six students.",
          btnText: "Book a placement",
          btnActionType: "link",
          btnActionValue: "contact",
        }, bloom({ titleSize: 50 })),
        block("Features", "feature-grid", {
          badge: "COURSES",
          title: "Levels for every learner.",
          subtitle: "From complete beginner to exam-ready advanced.",
          features: [
            { id: id(), title: "English", desc: "Everyday, business, and exam prep (IELTS/TOEFL).", icon: "MessagesSquare" },
            { id: id(), title: "French", desc: "From first phrases to DELF exam preparation.", icon: "Languages" },
            { id: id(), title: "Spanish", desc: "Conversation-first classes for travel and work.", icon: "Sun" },
            { id: id(), title: "German", desc: "Structured courses with Goethe test readiness.", icon: "Landmark" },
            { id: id(), title: "Kids & Teens", desc: "Play-based classes that build real confidence.", icon: "Smile" },
            { id: id(), title: "Corporate", desc: "On-site team programs with progress reporting.", icon: "Building2" },
          ],
        }, sunset({ backgroundColor: "#3b1e14" })),
      ],
    ),
    page(
      "Teachers",
      "teachers",
      `${brand} | Our teachers`,
      `The native and near-native teachers behind ${brand}.`,
      [
        block("Hero", "warm-studio", {
          badge: "OUR TEACHERS",
          title: "People who love teaching, not just languages.",
          subtitle: "Every teacher is certified, experienced, and carefully matched to your goals.",
          imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=85&w=1400",
          btnText: "Meet us in a trial class",
          btnActionType: "link",
          btnActionValue: "contact",
        }, sunset({ titleSize: 52 })),
        block("Business", "premium-story-split", {
          badge: "TEACHING PHILOSOPHY",
          title: "The class you look forward to.",
          subtitle: "We hire for warmth first and certification second. Fluency follows enjoyment — that is the whole method.",
          imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=85&w=1400",
          btnText: "See student stories",
          btnActionType: "link",
          btnActionValue: "journal",
          features: [
            { id: id(), title: "Native fluency", desc: "Every program taught by native or near-native speakers.", icon: "Languages" },
            { id: id(), title: "Certified teachers", desc: "CELTA, DELF, DELE, or equivalent qualifications.", icon: "Award" },
            { id: id(), title: "Warm, not intimidating", desc: "Mistakes are how we learn — we celebrate them.", icon: "Heart" },
          ],
        }, bloom()),
      ],
    ),
    page(
      "Stories",
      "journal",
      `${brand} | Student stories`,
      `Stories and tips from the ${brand} community.`,
      [
        block("Hero", "editorial-stack", {
          badge: "STORIES",
          title: "From the Bloom community.",
          subtitle: "Student journeys, teacher tips, and language learning notes.",
          btnText: "Book a trial",
          btnActionType: "link",
          btnActionValue: "contact",
        }, bloom({ titleSize: 48 })),
        block("Testimonials", "review-cards", {
          badge: "STUDENT VOICES",
          title: "Why students stay.",
          subtitle: "Real words from real learners.",
          testimonials: [
            { id: id(), name: "Ananya Iyer", role: "English · Intermediate", content: "I dreaded speaking English for years. Now I look forward to class every week — my teacher makes mistakes feel safe.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Tom Okafor", role: "French · Beginner", content: "Six months ago I could not say bonjour. I just ordered dinner in French in Paris.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Sneha Reddy", role: "Spanish · Travel", content: "The small classes mean you actually speak every single session. Worth every rupee.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=240", rating: 5 },
          ],
        }, sunset({ backgroundColor: "#31180f" })),
      ],
    ),
    page(
      "Contact",
      "contact",
      `${brand} | Book a trial`,
      `Book a free trial class or placement at ${brand}.`,
      [
        block("Hero", "warm-studio", {
          badge: "FREE TRIAL CLASS",
          title: "Come try a language.",
          subtitle: "One free session with a real teacher. If you love it, we will build your plan.",
          imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=85&w=1400",
          btnText: "Send the form",
          btnActionType: "booking",
          btnActionValue: "",
        }, sunset({ titleSize: 52 })),
        block("Forms", "premium-contact-panel", {
          badge: "BOOK YOUR TRIAL",
          title: "Tell us which language calls to you.",
          subtitle: "We reply within one business day to schedule your free session.",
          btnText: "Book my trial",
          contactEmail: "hello@bloomlanguage.com",
          contactPhone: "+91 99080 33110",
          contactAddress: "Indiranagar · Bengaluru",
          successMessage: "Thank you! We will contact you to schedule your free trial class.",
          whatsappFollowUp: false,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Email", name: "email", type: "email", placeholder: "you@example.com", required: true, width: "half" },
            { id: id(), label: "Language", name: "language", type: "select", required: true, width: "full", options: ["English", "French", "Spanish", "German", "Not sure yet"] },
            { id: id(), label: "Your level", name: "level", type: "select", required: true, width: "full", options: ["Beginner", "Intermediate", "Advanced", "Not sure"] },
            { id: id(), label: "Message", name: "message", type: "textarea", placeholder: "Anything else we should know?", required: false, width: "full" },
          ],
        }, bloom({ backgroundColor: "#fff8f4" })),
      ],
    ),
  ];

  return { ...chrome, pages: pagesBuilt };
}

// =====================================================================
// KIT 6 · SAFFRON KITCHEN — local business & e-com
// An upscale Indian restaurant: deep maroon + gold, menu-led.
// =====================================================================
function buildSaffronKitchen(businessName: string) {
  const brand = businessName || "Saffron";
  const accent = "#e0b82f";
  const pages = [
    { name: "Home", slug: "home" },
    { name: "Menu", slug: "menu" },
    { name: "Our Story", slug: "story" },
    { name: "Reservations", slug: "reserve" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = kitChrome(brand, pages, {
    accent,
    tagline: "Modern Indian fine dining — small plates, big flavour, honest hospitality.",
    contactEmail: "table@saffron.kitchen",
    contactPhone: "+91 98450 11220",
    contactAddress: "12 Lavelle Road · Bengaluru",
    ctaLabel: "Reserve a table",
    ctaSlug: "reserve",
  });
  const spice = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...dark(accent),
    backgroundColor: "#1c0d0a",
    backgroundGradient: "linear-gradient(135deg, #1c0d0a 0%, #2a1208 55%, #3d1a0c 100%)",
    maxWidth: 1180,
    titleSize: 56,
    cardBgColor: "#24110c",
    cardBorderColor: "#4a2516",
    cardBorderRadius: 16,
    buttonBorderRadius: 999,
    ...overrides,
  });
  const cream = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...light(accent),
    backgroundColor: "#fdf6ec",
    maxWidth: 1180,
    titleSize: 44,
    cardBgColor: "#ffffff",
    cardBorderColor: "#eeddc0",
    cardBorderRadius: 16,
    buttonBorderRadius: 999,
    ...overrides,
  });

  const signatures = [
    { id: id(), title: "Dum Biryani of the Day", desc: "Slow-cooked basmati, saffron, and a secret family spice blend.", icon: "ChefHat" },
    { id: id(), title: "Coastal Crab Curry", desc: "Fresh crab in a coconut-tamarind gravy from the Malabar coast.", icon: "Waves" },
    { id: id(), title: "Smoked Lamb Shank", desc: "24-hour braised lamb, smoked over charcoal, mint yoghurt.", icon: "Flame" },
  ];

  const pagesBuilt = [
    page(
      "Home",
      "home",
      `${brand} | Modern Indian fine dining in Bengaluru`,
      `${brand} serves modern Indian fine dining on Lavelle Road — small plates, big flavour, honest hospitality.`,
      [
        block("Hero", "split", {
          badge: "MODERN INDIAN KITCHEN · LAVELLE ROAD",
          title: "Small plates. Big flavour.",
          subtitle: "A modern Indian kitchen where family recipes meet fire, smoke, and serious technique.",
          imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=85&w=1600",
          btnText: "Reserve a table",
          btnActionType: "link",
          btnActionValue: "reserve",
          secondaryBtnText: "View the menu",
          secondaryBtnActionType: "link",
          secondaryBtnActionValue: "menu",
        }, spice({ titleSize: 60 })),
        block("Business", "treatment-list", {
          badge: "SIGNATURES",
          title: "Three dishes people cross town for.",
          subtitle: "Seasonal, regional, and never on the menu more than once a week.",
          features: signatures,
        }, cream()),
        block("Special", "premium-proof-rail", {
          badge: "IN GOOD COMPANY",
          title: "A kitchen that takes praise seriously.",
          stats: [
            { id: id(), label: "Cover turn a night", val: 240, suffix: "+" },
            { id: id(), label: "Rating on delivery apps", val: 4.8, suffix: "" },
            { id: id(), label: "Regional recipes", val: 60, suffix: "+" },
            { id: id(), label: "Years on Lavelle Road", val: 9, suffix: "" },
          ],
        }, spice({ backgroundColor: "#22100b" })),
        block("Testimonials", "premium-testimonial-carousel", {
          badge: "WORD OF MOUTH",
          title: "What the room is saying.",
          subtitle: "Unedited notes from recent guests.",
          testimonials: [
            { id: id(), name: "Kavya Menon", role: "Regular guest", content: "The crab curry is worth the drive from anywhere in the city. Service that remembers your name too.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "David Fernandes", role: "Food writer", content: "The most confident Indian cooking in Bengaluru right now. Fire, restraint, and generosity in equal measure.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Meera Joshi", role: "First-time guest", content: "Booked for an anniversary, stayed for the biryani. We are already planning our next visit.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=240", rating: 5 },
          ],
        }, cream()),
        block("CTA", "simple-cta", {
          badge: "DINNER · TUES–SUN",
          title: "Tonight's tables are going fast.",
          subtitle: "Walk-ins welcome, reservations encouraged. Private dining for up to 24.",
          btnText: "Reserve a table",
          btnActionType: "link",
          btnActionValue: "reserve",
        }, spice({ textAlign: "center", titleSize: 50 })),
      ],
    ),
    page(
      "Menu",
      "menu",
      `${brand} | Menu`,
      `The seasonal menu at ${brand}.`,
      [
        block("Hero", "editorial-stack", {
          badge: "THE MENU",
          title: "Seasonal, regional, and honest.",
          subtitle: "Our menu changes with the market. Here is a taste of what to expect.",
          btnText: "Reserve a table",
          btnActionType: "link",
          btnActionValue: "reserve",
        }, cream({ titleSize: 48 })),
        block("Pricing", "service-tier", {
          badge: "PRIX FIXE",
          title: "The tasting journey.",
          subtitle: "One sitting, six courses, zero decisions required.",
          btnActionType: "link",
          btnActionValue: "reserve",
          pricing: [
            { id: id(), tier: "Two Course", price: "₹1,200", features: ["Starter + main", "Regional breads", "Filter coffee"], btnText: "Reserve", popular: false },
            { id: id(), tier: "The Saffron Journey", price: "₹2,400", features: ["Six courses", "Chef's selection", "Pairing option", "Specialty coffee"], btnText: "Book the journey", popular: true },
            { id: id(), tier: "Chef's Table", price: "₹3,600", features: ["Eight courses", "Kitchen-side seats", "Sommelier pairing", "Signed menu"], btnText: "Enquire", popular: false },
          ],
        }, spice()),
        block("Special", "premium-faq", {
          badge: "GOOD TO KNOW",
          title: "Before you come.",
          subtitle: "Allergies, timing, and dress code — the useful details.",
          btnText: "Ask us anything",
          btnActionType: "link",
          btnActionValue: "contact",
          faqs: [
            { id: id(), q: "Do you cater for allergies?", a: "Yes — tell us when you book and the kitchen will adapt dishes around any allergy or dietary requirement." },
            { id: id(), q: "Is there a dress code?", a: "Smart casual. Come as you are, but leave the sportswear at home." },
            { id: id(), q: "Do you have vegetarian options?", a: "More than half the menu is vegetarian or vegan-friendly at every course." },
          ],
        }, cream({ backgroundColor: "#fdf6ec" })),
      ],
    ),
    page(
      "Story",
      "story",
      `${brand} | Our story`,
      `The family and kitchen behind ${brand}.`,
      [
        block("Text", "signature-editorial", {
          badge: "OUR STORY",
          title: "Recipes that survived three generations.",
          subtitle: "Saffron began with a grandmother's recipe book, a coal-fired tandoor, and a stubborn belief that Indian food deserved the same patience as any great cuisine.\n\nNine years on Lavelle Road later, the kitchen still writes the menu by hand, still walks the market at dawn, and still refuses to compromise on the things that made the first service memorable.",
          btnText: "Reserve a table",
          btnActionType: "link",
          btnActionValue: "reserve",
        }, spice({ titleSize: 56 })),
        block("Gallery", "masonry", {
          badge: "THE KITCHEN",
          title: "Fire, spice, and serious people.",
          subtitle: "A look inside the room and the pass.",
          galleryImages: [
            { id: id(), url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=85&w=1000", title: "The tandoor", subtitle: "Charcoal, every night", aspect: "landscape" },
            { id: id(), url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=85&w=1000", title: "The dining room", subtitle: "Warm, unhurried", aspect: "square" },
            { id: id(), url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=85&w=1000", title: "Family recipes", subtitle: "Three generations", aspect: "portrait" },
          ],
        }, cream()),
      ],
    ),
    page(
      "Reservations",
      "reserve",
      `${brand} | Reservations`,
      `Reserve a table at ${brand}.`,
      [
        block("Hero", "quiet-luxury", {
          badge: "RESERVATIONS",
          title: "Your table is waiting.",
          subtitle: "Dinner service Tuesday to Sunday. Private dining for up to 24 guests.",
          imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=85&w=1400",
          btnText: "Book now",
          btnActionType: "booking",
          btnActionValue: "",
        }, spice({ titleSize: 52 })),
        block("Forms", "appointment", {
          badge: "BOOK A TABLE",
          title: "Reserve in under a minute.",
          subtitle: "We confirm every booking personally by phone or WhatsApp.",
          btnText: "Confirm reservation",
          successMessage: "Reservation requested! We will confirm by WhatsApp shortly.",
          whatsappFollowUp: true,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Phone", name: "phone", type: "tel", placeholder: "+91 98765 43210", required: true, width: "half" },
            { id: id(), label: "Guests", name: "guests", type: "select", required: true, width: "half", options: ["1", "2", "3", "4", "5", "6+"] },
            { id: id(), label: "Occasion", name: "occasion", type: "select", required: false, width: "half", options: ["Dinner", "Birthday", "Anniversary", "Business", "Other"] },
            { id: id(), label: "Notes", name: "message", type: "textarea", placeholder: "Allergies, seating preferences, or anything else", required: false, width: "full" },
          ],
        }, cream({ backgroundColor: "#fdf6ec" })),
      ],
    ),
    page(
      "Contact",
      "contact",
      `${brand} | Contact`,
      `Contact ${brand} for reservations, events, and private dining.`,
      [
        block("Map", "signature-map", {
          badge: "FIND US",
          title: "Twelve, Lavelle Road.",
          subtitle: "Two minutes from Cubbon Park, valet available from 6pm.",
          mapAddress: "12 Lavelle Road, Bengaluru, Karnataka, India",
          contactPhone: "+91 98450 11220",
          contactEmail: "table@saffron.kitchen",
          contactAddress: "12 Lavelle Road · Bengaluru",
          btnText: "Get directions",
        }, spice()),
        block("Forms", "premium-contact-panel", {
          badge: "GET IN TOUCH",
          title: "Questions, events, or a private room?",
          subtitle: "We reply within one business day.",
          btnText: "Send message",
          contactEmail: "table@saffron.kitchen",
          contactPhone: "+91 98450 11220",
          contactAddress: "12 Lavelle Road · Bengaluru",
          successMessage: "Thanks — the team will reply within one business day.",
          whatsappFollowUp: false,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Email", name: "email", type: "email", placeholder: "you@example.com", required: true, width: "half" },
            { id: id(), label: "Topic", name: "topic", type: "select", required: true, width: "full", options: ["Reservations", "Private dining", "Events", "Press", "Other"] },
            { id: id(), label: "Message", name: "message", type: "textarea", placeholder: "How can we help?", required: true, width: "full" },
          ],
        }, cream({ backgroundColor: "#fdf6ec" })),
      ],
    ),
  ];

  const products: SiteKitProduct[] = [
    { title: "The Saffron Journey", description: "Six-course chef's tasting menu for two, with pairings.", price: 4800, compareAtPrice: 5200, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=85&w=1000", category: "Dining", tags: ["Tasting menu"], badge: "Chef's pick" },
    { title: "Spice Box Gift Set", description: "Six small-batch spice blends, hand-labelled by the kitchen.", price: 1450, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=85&w=1000", category: "Pantry", tags: ["Gift"] },
    { title: "Sunday Family Table", description: "Four-course family-style lunch for up to six guests.", price: 5500, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=85&w=1000", category: "Dining", tags: ["Sunday"], badge: "New" },
  ];

  return { ...chrome, pages: pagesBuilt, products };
}

// =====================================================================
// KIT 7 · BLOOM & PETAL — local business & e-com
// A flower boutique: rose + blush, shop-led.
// =====================================================================
function buildBloomPetal(businessName: string) {
  const brand = businessName || "Bloom & Petal";
  const accent = "#f9a8d4";
  const pages = [
    { name: "Home", slug: "home" },
    { name: "Shop", slug: "shop" },
    { name: "Occasions", slug: "occasions" },
    { name: "About", slug: "about" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = kitChrome(brand, pages, {
    accent,
    tone: "light",
    tagline: "Fresh flowers, hand-tied daily, delivered same-day across the city.",
    contactEmail: "hello@bloomandpetal.com",
    contactPhone: "+91 98100 22330",
    contactAddress: "Brigade Road · Bengaluru",
    ctaLabel: "Order flowers",
    ctaSlug: "shop",
  });
  const rose = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...dark(accent),
    backgroundColor: "#2a0f1f",
    backgroundGradient: "linear-gradient(135deg, #2a0f1f 0%, #3a1630 55%, #4a1d3d 100%)",
    maxWidth: 1120,
    titleSize: 54,
    cardBgColor: "#331429",
    cardBorderColor: "#5a2450",
    cardBorderRadius: 18,
    buttonBorderRadius: 999,
    ...overrides,
  });
  const blush = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...light(accent),
    backgroundColor: "#fff7fa",
    maxWidth: 1120,
    titleSize: 42,
    cardBgColor: "#ffffff",
    cardBorderColor: "#f7d7e6",
    cardBorderRadius: 18,
    buttonBorderRadius: 999,
    ...overrides,
  });

  const pagesBuilt = [
    page(
      "Home",
      "home",
      `${brand} | Flower boutique in Bengaluru`,
      `${brand} is a flower boutique on Brigade Road with same-day delivery and hand-tied bouquets.`,
      [
        block("Hero", "warm-studio", {
          badge: "HAND-TIED DAILY · SAME-DAY DELIVERY",
          title: "Say it with something fresh.",
          subtitle: "Bouquets tied by hand every morning, delivered across the city by evening.",
          imageUrl: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&q=85&w=1600",
          btnText: "Shop bouquets",
          btnActionType: "link",
          btnActionValue: "shop",
          secondaryBtnText: "Plan an occasion",
          secondaryBtnActionType: "link",
          secondaryBtnActionValue: "occasions",
        }, rose({ titleSize: 56 })),
        block("EComStore", "product-grid-filter", {
          badge: "BEST SELLERS",
          title: "This week's favourites.",
          subtitle: "Fresh arrivals from the market, tied to order.",
          btnText: "Browse the shop",
        }, blush()),
        block("Special", "premium-proof-rail", {
          badge: "BLOOM PROMISE",
          title: "Freshness, guaranteed in writing.",
          stats: [
            { id: id(), label: "Bouquets delivered", val: 48000, suffix: "+" },
            { id: id(), label: "Same-day delivery", val: 100, suffix: "%" },
            { id: id(), label: "Days freshness guaranteed", val: 7, suffix: "" },
            { id: id(), label: "Rating", val: 4.9, suffix: "/5" },
          ],
        }, rose({ backgroundColor: "#301123" })),
        block("Forms", "newsletter", {
          badge: "FLOWER NOTES",
          title: "Seasonal blooms, weekly.",
          subtitle: "A short letter about what is in season, plus subscriber-only offers.",
          btnText: "Subscribe",
        }, blush({ backgroundColor: "#fff7fa" })),
        block("CTA", "simple-cta", {
          badge: "SPECIAL ORDERS",
          title: "Dreaming of something specific?",
          subtitle: "Weddings, proposals, and corporate flowers — we design to brief.",
          btnText: "Plan with us",
          btnActionType: "link",
          btnActionValue: "contact",
        }, rose({ textAlign: "center", titleSize: 48 })),
      ],
    ),
    page(
      "Shop",
      "shop",
      `${brand} | Shop bouquets & arrangements`,
      `Shop hand-tied bouquets and arrangements from ${brand}.`,
      [
        block("Hero", "editorial-stack", {
          badge: "THE SHOP",
          title: "Fresh, tied daily, delivered today.",
          subtitle: "Every bouquet is made to order from the morning market run.",
          btnText: "View occasions",
          btnActionType: "link",
          btnActionValue: "occasions",
        }, blush({ titleSize: 46 })),
        block("EComStore", "product-grid-filter", {
          badge: "BOUQUETS",
          title: "Best sellers.",
          subtitle: "The arrangements people order again and again.",
          btnText: "Add to order",
        }, blush({ backgroundColor: "#fff7fa" })),
        block("Gallery", "masonry", {
          badge: "RECENT ARRANGEMENTS",
          title: "Fresh from the studio.",
          subtitle: "A snapshot of what left the bench this week.",
          galleryImages: [
            { id: id(), url: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&q=85&w=1000", title: "Roses", subtitle: "Classic dozen", aspect: "landscape" },
            { id: id(), url: "https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&q=85&w=1000", title: "Wild garden", subtitle: "Seasonal mix", aspect: "square" },
            { id: id(), url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=85&w=1000", title: "Sunflowers", subtitle: "Five stems", aspect: "portrait" },
          ],
        }, rose({ backgroundColor: "#301123" })),
      ],
    ),
    page(
      "Occasions",
      "occasions",
      `${brand} | Occasions`,
      `Flowers for every occasion from ${brand}.`,
      [
        block("Hero", "warm-studio", {
          badge: "OCCASIONS",
          title: "For every moment worth marking.",
          subtitle: "Birthdays, proposals, weddings, and everything in between.",
          imageUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=85&w=1400",
          btnText: "Order flowers",
          btnActionType: "link",
          btnActionValue: "shop",
        }, rose({ titleSize: 50 })),
        block("Features", "feature-grid", {
          badge: "THE COLLECTIONS",
          title: "Designed for the moment.",
          subtitle: "Every collection is seasonally styled and sized for its occasion.",
          features: [
            { id: id(), title: "Birthdays", desc: "Bright, joyful arrangements with balloons and add-ons.", icon: "Cake" },
            { id: id(), title: "Proposals", desc: "Rose-led designs with a discreet timing service.", icon: "Heart" },
            { id: id(), title: "Weddings", desc: "Bridal bouquets, mandaps, and venue styling.", icon: "Gem" },
            { id: id(), title: "Sympathy", desc: "Gentle, understated tributes delivered with care.", icon: "Dove" },
            { id: id(), title: "Corporate", desc: "Desk flowers and weekly office subscriptions.", icon: "Building2" },
            { id: id(), title: "Just because", desc: "The best reason to send flowers is no reason at all.", icon: "Sparkles" },
          ],
        }, blush()),
      ],
    ),
    page(
      "About",
      "about",
      `${brand} | About the studio`,
      `The florists behind ${brand}.`,
      [
        block("Text", "signature-editorial", {
          badge: "OUR STUDIO",
          title: "We buy flowers the way cooks buy produce.",
          subtitle: "Every morning one of us walks the market at dawn and buys what actually looks beautiful that day — not what a catalogue promised.\n\nThat is the whole secret. Fresh stems, honest colour, and arrangements tied by hand in a studio that smells like a garden in the rain.",
          btnText: "Visit the studio",
          btnActionType: "link",
          btnActionValue: "contact",
        }, rose({ titleSize: 52 })),
        block("Special", "premium-roadmap", {
          badge: "A DAY AT THE STUDIO",
          title: "From market to doorstep.",
          subtitle: "The journey of every bouquet.",
          steps: [
            { id: id(), step: "06:00", title: "Market run", desc: "Buying what is at its peak, by hand." },
            { id: id(), step: "09:00", title: "Tying", desc: "Arrangements built to order, never in advance." },
            { id: id(), step: "13:00", title: "Delivery", desc: "Fleet on the road, temperature-controlled." },
            { id: id(), step: "18:00", title: "Follow-up", desc: "A photo and care note for every order." },
          ],
        }, blush()),
      ],
    ),
    page(
      "Contact",
      "contact",
      `${brand} | Contact`,
      `Contact ${brand} for orders, weddings, and corporate flowers.`,
      [
        block("Map", "signature-map", {
          badge: "THE STUDIO",
          title: "Find us on Brigade Road.",
          subtitle: "Walk-ins welcome 10am–8pm, daily.",
          mapAddress: "Brigade Road, Bengaluru, Karnataka, India",
          contactPhone: "+91 98100 22330",
          contactEmail: "hello@bloomandpetal.com",
          contactAddress: "Brigade Road · Bengaluru",
          btnText: "Get directions",
        }, rose()),
        block("Forms", "premium-contact-panel", {
          badge: "GET IN TOUCH",
          title: "We reply within the hour.",
          subtitle: "Orders, weddings, or just flower advice — we love the chat.",
          btnText: "Send message",
          contactEmail: "hello@bloomandpetal.com",
          contactPhone: "+91 98100 22330",
          contactAddress: "Brigade Road · Bengaluru",
          successMessage: "Thanks! We will reply within the hour.",
          whatsappFollowUp: true,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Phone", name: "phone", type: "tel", placeholder: "+91 98765 43210", required: true, width: "half" },
            { id: id(), label: "Topic", name: "topic", type: "select", required: true, width: "full", options: ["Order enquiry", "Wedding", "Corporate", "Other"] },
            { id: id(), label: "Message", name: "message", type: "textarea", placeholder: "How can we help?", required: true, width: "full" },
          ],
        }, blush({ backgroundColor: "#fff7fa" })),
      ],
    ),
  ];

  const products: SiteKitProduct[] = [
    { title: "Classic Dozen Roses", description: "Twelve premium stems, hand-tied with eucalyptus.", price: 1899, image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=85&w=1000", category: "Bouquets", tags: ["Roses"], badge: "Best seller" },
    { title: "Wild Garden Mix", description: "A generous seasonal mix in a reusable ceramic vase.", price: 2499, compareAtPrice: 2799, image: "https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&q=85&w=1000", category: "Arrangements", tags: ["Seasonal"] },
    { title: "Sunflower Smile", description: "Five sunflowers with fresh greens — instant joy.", price: 999, image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=85&w=1000", category: "Bouquets", tags: ["Sunflowers"], badge: "New" },
  ];

  return { ...chrome, pages: pagesBuilt, products };
}

// =====================================================================
// KIT 8 · GOLDEN SCISSORS — local business & e-com
// A premium salon & spa: charcoal + gold, booking-led.
// =====================================================================
function buildGoldenScissors(businessName: string) {
  const brand = businessName || "Golden Scissors";
  const accent = "#d4af37";
  const pages = [
    { name: "Home", slug: "home" },
    { name: "Services", slug: "services" },
    { name: "Gallery", slug: "gallery" },
    { name: "Booking", slug: "booking" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = kitChrome(brand, pages, {
    accent,
    tagline: "A premium salon and spa for hair, skin, and unhurried self-care.",
    contactEmail: "hello@goldenscissors.com",
    contactPhone: "+91 98450 66770",
    contactAddress: "Jayanagar 4th Block · Bengaluru",
    ctaLabel: "Book appointment",
    ctaSlug: "booking",
  });
  const charcoal = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...dark(accent),
    backgroundColor: "#111111",
    backgroundGradient: "linear-gradient(135deg, #111111 0%, #1a1a1a 55%, #242013 100%)",
    maxWidth: 1160,
    titleSize: 54,
    cardBgColor: "#1a1a1a",
    cardBorderColor: "#333333",
    cardBorderRadius: 14,
    buttonBorderRadius: 999,
    ...overrides,
  });
  const marble = (overrides: Partial<BlockCSSStyles> = {}): Partial<BlockCSSStyles> => ({
    ...light(accent),
    backgroundColor: "#faf8f2",
    maxWidth: 1160,
    titleSize: 42,
    cardBgColor: "#ffffff",
    cardBorderColor: "#e7e0c8",
    cardBorderRadius: 14,
    buttonBorderRadius: 999,
    ...overrides,
  });

  const services = [
    { id: id(), title: "Signature Haircut", desc: "Consultation, precision cut, and finish — 60 min.", icon: "Scissors" },
    { id: id(), title: "Colour & Balayage", desc: "Bespoke colour mapped to your skin tone — 2.5 hrs.", icon: "Palette" },
    { id: id(), title: "Spa Ritual", desc: "Head, neck, and shoulder massage with steam — 45 min.", icon: "Flower2" },
    { id: id(), title: "Skin Therapy", desc: "Deep-cleansing facial with LED therapy — 60 min.", icon: "Sparkles" },
  ];

  const pagesBuilt = [
    page(
      "Home",
      "home",
      `${brand} | Premium salon & spa in Jayanagar`,
      `${brand} is a premium salon and spa in Jayanagar, Bengaluru — hair, skin, and unhurried self-care.`,
      [
        block("Hero", "quiet-luxury", {
          badge: "PREMIUM SALON & SPA · JAYANAGAR",
          title: "Look after the details. They notice.",
          subtitle: "Hair, skin, and ritual care by stylists who treat every appointment like a craft.",
          imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=85&w=1600",
          btnText: "Book an appointment",
          btnActionType: "link",
          btnActionValue: "booking",
          secondaryBtnText: "View services",
          secondaryBtnActionType: "link",
          secondaryBtnActionValue: "services",
        }, charcoal({ titleSize: 58 })),
        block("Business", "treatment-list", {
          badge: "SIGNATURE SERVICES",
          title: "Four rituals, done properly.",
          subtitle: "No upsells, no rushed chairs. Time is the ingredient.",
          features: services,
        }, marble()),
        block("Special", "premium-proof-rail", {
          badge: "THE GOLDEN STANDARD",
          title: "A studio measured in repeat visits.",
          stats: [
            { id: id(), label: "Years in Jayanagar", val: 15, suffix: "" },
            { id: id(), label: "Stylists on the floor", val: 12, suffix: "" },
            { id: id(), label: "Repeat clients", val: 86, suffix: "%" },
            { id: id(), label: "Rating", val: 4.9, suffix: "/5" },
          ],
        }, charcoal({ backgroundColor: "#16130c" })),
        block("Testimonials", "premium-testimonial-carousel", {
          badge: "CLIENT NOTES",
          title: "What our regulars say.",
          subtitle: "Notes from the chairs.",
          testimonials: [
            { id: id(), name: "Ritu Kapoor", role: "Client for 6 years", content: "They know my hair better than I do. I would not trust a scissors-and-comb elsewhere.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Vikram Shah", role: "Client for 3 years", content: "The first salon that actually listens before it cuts. Booking online takes ten seconds.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=85&w=240", rating: 5 },
            { id: id(), name: "Neha Rao", role: "Spa regular", content: "The spa ritual is the best hour of my week. It is a habit now.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=85&w=240", rating: 5 },
          ],
        }, marble()),
        block("CTA", "simple-cta", {
          badge: "WALK-INS WELCOME",
          title: "Your chair is waiting.",
          subtitle: "Book online in under a minute, or drop in — we will fit you in.",
          btnText: "Book appointment",
          btnActionType: "link",
          btnActionValue: "booking",
        }, charcoal({ textAlign: "center", titleSize: 48 })),
      ],
    ),
    page(
      "Services",
      "services",
      `${brand} | Services & pricing`,
      `Hair, skin, and spa services at ${brand}.`,
      [
        block("Hero", "editorial-stack", {
          badge: "SERVICES",
          title: "Everything, with the time it deserves.",
          subtitle: "Transparent pricing, no surprises at the till.",
          btnText: "Book appointment",
          btnActionType: "link",
          btnActionValue: "booking",
        }, marble({ titleSize: 46 })),
        block("Features", "feature-grid", {
          badge: "THE MENU",
          title: "Hair, skin, and ritual care.",
          subtitle: "Every service includes a consultation and aftercare notes.",
          features: [
            { id: id(), title: "Precision cuts", desc: "From ₹600 · 60 min", icon: "Scissors" },
            { id: id(), title: "Colour & balayage", desc: "From ₹2,800 · 2.5 hrs", icon: "Palette" },
            { id: id(), title: "Keratin smoothing", desc: "From ₹4,500 · 3 hrs", icon: "Wand2" },
            { id: id(), title: "Spa rituals", desc: "From ₹1,200 · 45 min", icon: "Flower2" },
            { id: id(), title: "Facials & LED", desc: "From ₹1,800 · 60 min", icon: "Sparkles" },
            { id: id(), title: "Bridal & events", desc: "Custom quote · by team", icon: "Gem" },
          ],
        }, charcoal({ backgroundColor: "#1a1712" })),
        block("Pricing", "service-tier", {
          badge: "MEMBERSHIPS",
          title: "The Golden Card.",
          subtitle: "One monthly fee, priority booking and member pricing.",
          btnActionType: "link",
          btnActionValue: "booking",
          pricing: [
            { id: id(), tier: "The Cut", price: "₹1,499", features: ["2 haircuts / month", "Priority slots", "10% off colour"], btnText: "Join", popular: false },
            { id: id(), tier: "The Ritual", price: "₹3,499", features: ["Cut + spa monthly", "Priority slots", "15% off everything", "Birthday treat"], btnText: "Join the Ritual", popular: true },
            { id: id(), tier: "The Salon", price: "₹6,999", features: ["Unlimited cuts", "Monthly spa", "20% off all services", "Guest passes"], btnText: "Enquire", popular: false },
          ],
        }, marble({ backgroundColor: "#faf8f2" })),
      ],
    ),
    page(
      "Gallery",
      "gallery",
      `${brand} | Gallery`,
      `Recent work from the ${brand} studio.`,
      [
        block("Hero", "quiet-luxury", {
          badge: "GALLERY",
          title: "The proof is in the chair.",
          subtitle: "Recent cuts, colours, and transformations from the studio floor.",
          imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=85&w=1400",
          btnText: "Book your transformation",
          btnActionType: "link",
          btnActionValue: "booking",
        }, charcoal({ titleSize: 48 })),
        block("Gallery", "premium-gallery-lightbox", {
          badge: "THE FLOOR",
          title: "Selected transformations.",
          subtitle: "Colour work, precision cuts, and ritual care.",
          galleryImages: [
            { id: id(), url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=85&w=1000", title: "Balayage", subtitle: "2.5 hr session", aspect: "landscape" },
            { id: id(), url: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=85&w=1000", title: "Signature cut", subtitle: "Precision finish", aspect: "square" },
            { id: id(), url: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=85&w=1000", title: "Bridal", subtitle: "Event team", aspect: "portrait" },
            { id: id(), url: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=85&w=1000", title: "Spa ritual", subtitle: "45 min reset", aspect: "landscape" },
          ],
        }, marble()),
      ],
    ),
    page(
      "Booking",
      "booking",
      `${brand} | Book an appointment`,
      `Book your appointment at ${brand}.`,
      [
        block("Hero", "quiet-luxury", {
          badge: "BOOKING",
          title: "Ten seconds to book. An hour of calm.",
          subtitle: "Choose your service, pick a slot, we confirm by WhatsApp.",
          imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=85&w=1400",
          btnText: "Book now",
          btnActionType: "booking",
          btnActionValue: "",
        }, charcoal({ titleSize: 50 })),
        block("Forms", "appointment", {
          badge: "APPOINTMENT",
          title: "Reserve your chair.",
          subtitle: "We confirm every booking personally.",
          btnText: "Confirm booking",
          successMessage: "Booking requested! We will confirm by WhatsApp.",
          whatsappFollowUp: true,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Phone", name: "phone", type: "tel", placeholder: "+91 98765 43210", required: true, width: "half" },
            { id: id(), label: "Service", name: "service", type: "select", required: true, width: "full", options: ["Signature Haircut", "Colour & Balayage", "Keratin", "Spa Ritual", "Facial", "Bridal"] },
            { id: id(), label: "Notes", name: "message", type: "textarea", placeholder: "Stylist preference, allergies, or anything else", required: false, width: "full" },
          ],
        }, marble({ backgroundColor: "#faf8f2" })),
      ],
    ),
    page(
      "Contact",
      "contact",
      `${brand} | Contact`,
      `Contact ${brand} for bookings, memberships, and enquiries.`,
      [
        block("Map", "signature-map", {
          badge: "THE STUDIO",
          title: "Jayanagar, four blocks in.",
          subtitle: "Parking on-site. Open 10am–8pm, closed Mondays.",
          mapAddress: "Jayanagar 4th Block, Bengaluru, Karnataka, India",
          contactPhone: "+91 98450 66770",
          contactEmail: "hello@goldenscissors.com",
          contactAddress: "Jayanagar 4th Block · Bengaluru",
          btnText: "Get directions",
        }, charcoal()),
        block("Forms", "premium-contact-panel", {
          badge: "GET IN TOUCH",
          title: "Questions? We reply fast.",
          subtitle: "Bookings, memberships, or bridal enquiries.",
          btnText: "Send message",
          contactEmail: "hello@goldenscissors.com",
          contactPhone: "+91 98450 66770",
          contactAddress: "Jayanagar 4th Block · Bengaluru",
          successMessage: "Thanks — we will reply within the hour.",
          whatsappFollowUp: true,
          formFields: [
            { id: id(), label: "Full name", name: "name", type: "text", placeholder: "Your name", required: true, width: "half" },
            { id: id(), label: "Email", name: "email", type: "email", placeholder: "you@example.com", required: true, width: "half" },
            { id: id(), label: "Topic", name: "topic", type: "select", required: true, width: "full", options: ["Bookings", "Memberships", "Bridal", "Careers", "Other"] },
            { id: id(), label: "Message", name: "message", type: "textarea", placeholder: "How can we help?", required: true, width: "full" },
          ],
        }, marble({ backgroundColor: "#faf8f2" })),
      ],
    ),
  ];

  const products: SiteKitProduct[] = [
    { title: "The Cut Membership", description: "Two signature haircuts a month with priority slots.", price: 1499, image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=85&w=1000", category: "Memberships", tags: ["Monthly"], badge: "Popular" },
    { title: "The Ritual Membership", description: "Cut plus spa monthly, with 15% off all services.", price: 3499, compareAtPrice: 3900, image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=85&w=1000", category: "Memberships", tags: ["Monthly"] },
    { title: "Bridal Package", description: "Trial, day-of styling for the whole family, and aftercare.", price: 15000, image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=85&w=1000", category: "Events", tags: ["Bridal"], badge: "By team" },
  ];

  return { ...chrome, pages: pagesBuilt, products };
}

// =====================================================================
// REGISTRY
// =====================================================================
export const EXTRA_SITE_KITS: SiteKit[] = [
  {
    id: "monochrome-agency",
    name: "Monochrome Agency",
    category: "Premium Multi-Purpose",
    description: "A Swiss-grid B2B agency system in black, graphite, and white — strategy, brand, and digital product pages with a process section and lead capture.",
    audience: "Agencies, consultancies, studios, and B2B service firms",
    palette: ["#0a0a0a", "#9ca3af", "#ffffff"],
    pageCount: 5,
    build: buildMonochromeAgency,
  },
  {
    id: "saas-velocity",
    name: "SaaS Velocity",
    category: "Premium Multi-Purpose",
    description: "A modern SaaS platform with a gradient hero, bento features, plan pricing, insights, and a sales-ready contact flow.",
    audience: "SaaS startups, product teams, and tech companies",
    palette: ["#0b0618", "#818cf8", "#f8fafc"],
    pageCount: 5,
    build: buildSaaSVelocity,
  },
  {
    id: "prestige-realty",
    name: "Prestige Realty",
    category: "Premium Multi-Purpose",
    description: "A luxury property advisory with a curated listing gallery, buyer services, and private-viewing lead capture.",
    audience: "Real estate advisors, luxury property brands, boutique brokerages",
    palette: ["#0c1a14", "#c8a24a", "#f7f4ec"],
    pageCount: 5,
    build: buildPrestigeRealty,
  },
  {
    id: "codecraft-bootcamp",
    name: "CodeCraft Bootcamp",
    category: "Education & Courses",
    description: "A 16-week coding bootcamp with a curriculum track system, mentor standards, admissions form, and outcome stats.",
    audience: "Bootcamps, coding schools, and technical academies",
    palette: ["#0b0918", "#a78bfa", "#f8f7ff"],
    pageCount: 5,
    build: buildCodecraftBootcamp,
  },
  {
    id: "bloom-language",
    name: "Bloom Language Studio",
    category: "Education & Courses",
    description: "A warm language school with program cards, teacher philosophy, student stories, and a free-trial booking flow.",
    audience: "Language schools, tutors, and coaching studios",
    palette: ["#2a1410", "#f4714f", "#fff8f4"],
    pageCount: 5,
    build: buildBloomLanguage,
  },
  {
    id: "saffron-kitchen",
    name: "Saffron Kitchen",
    category: "Local Business & E-com",
    description: "An upscale Indian restaurant with a signature-dish menu, tasting journeys, reservations, and contact pages.",
    audience: "Restaurants, cafes, and hospitality brands",
    palette: ["#1c0d0a", "#e0b82f", "#fdf6ec"],
    pageCount: 5,
    build: buildSaffronKitchen,
  },
  {
    id: "bloom-petal",
    name: "Bloom & Petal",
    category: "Local Business & E-com",
    description: "A flower boutique with a product-grid shop, occasion collections, studio story, and same-day delivery promise.",
    audience: "Florists, boutiques, and local retail brands",
    palette: ["#2a0f1f", "#f9a8d4", "#fff7fa"],
    pageCount: 5,
    build: buildBloomPetal,
  },
  {
    id: "golden-scissors",
    name: "Golden Scissors",
    category: "Local Business & E-com",
    description: "A premium salon and spa with a service menu, transformation gallery, memberships, and online booking.",
    audience: "Salons, spas, and beauty studios",
    palette: ["#111111", "#d4af37", "#faf8f2"],
    pageCount: 5,
    build: buildGoldenScissors,
  },
];

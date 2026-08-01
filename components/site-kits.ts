import type { BlockCSSStyles, WebBlock } from "./website-builder-editor";

export interface SiteKitPage {
  name: string;
  slug: string;
  seoTitle: string;
  seoDesc: string;
  blocks: WebBlock[];
}

export interface SiteKitProduct {
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  category: string;
  tags: string[];
  badge?: string;
}

export interface SiteKit {
  id: string;
  name: string;
  category: string;
  description: string;
  audience: string;
  palette: string[];
  pageCount: number;
  build: (businessName: string) => {
    header: WebBlock;
    footer: WebBlock;
    pages: SiteKitPage[];
    products?: SiteKitProduct[];
  };
}

const baseStyles: BlockCSSStyles = {
  paddingTop: 88,
  paddingBottom: 88,
  paddingLeft: 24,
  paddingRight: 24,
  gapSize: 24,
  maxWidth: 1180,
  textAlign: "left",
  backgroundColor: "#ffffff",
  backgroundGradient: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  useGradient: false,
  textColor: "#0f172a",
  subtitleColor: "#64748b",
  accentColor: "#2563eb",
  badgeBgColor: "#dbeafe",
  badgeTextColor: "#1d4ed8",
  fontFamily: "Inter",
  titleSize: 52,
  titleWeight: "bold",
  subtitleSize: 18,
  bodySize: 15,
  lineHeight: 1.5,
  cardBgColor: "#ffffff",
  cardTextColor: "#0f172a",
  cardBorderRadius: 18,
  cardShadow: "sm",
  cardBorderWidth: 1,
  cardBorderColor: "#e2e8f0",
  borderRadius: 0,
  borderWidth: 0,
  borderColor: "#e2e8f0",
  borderStyle: "solid",
  boxShadow: "none",
  buttonBgColor: "#0f172a",
  buttonTextColor: "#ffffff",
  buttonBorderRadius: 10,
  buttonHoverScale: true,
  hoverEffect: "none",
  clickResponse: "scale-down",
};

const id = () => crypto.randomUUID();

const block = (
  type: WebBlock["type"],
  variant: string,
  content: Partial<WebBlock>,
  style: Partial<BlockCSSStyles> = {},
): WebBlock => ({
  id: id(),
  type,
  variant,
  title: content.title || "",
  subtitle: content.subtitle || "",
  ...content,
  styles: { ...baseStyles, ...style },
});

const dark = (accent = "#f4c95d"): Partial<BlockCSSStyles> => ({
  backgroundColor: "#080b10",
  backgroundGradient: "linear-gradient(135deg, #080b10 0%, #111827 58%, #172033 100%)",
  useGradient: true,
  textColor: "#f8fafc",
  subtitleColor: "#a8b2c3",
  accentColor: accent,
  badgeBgColor: "#f4c95d1a",
  badgeTextColor: accent,
  buttonBgColor: accent,
  buttonTextColor: "#080b10",
  cardBgColor: "#121823",
  cardTextColor: "#f8fafc",
  cardBorderColor: "#293244",
  fontFamily: "Space Grotesk",
});

const light = (accent = "#b88716"): Partial<BlockCSSStyles> => ({
  backgroundColor: "#f7f5ef",
  textColor: "#111827",
  subtitleColor: "#586173",
  accentColor: accent,
  badgeBgColor: "#f4c95d26",
  badgeTextColor: "#76580d",
  buttonBgColor: "#111827",
  buttonTextColor: "#ffffff",
  cardBgColor: "#ffffff",
  cardTextColor: "#111827",
  cardBorderColor: "#ded9cb",
  fontFamily: "Space Grotesk",
});

const page = (
  name: string,
  slug: string,
  seoTitle: string,
  seoDesc: string,
  blocks: WebBlock[],
): SiteKitPage => ({ name, slug, seoTitle, seoDesc, blocks });

function sharedChrome(
  businessName: string,
  pages: Array<{ name: string; slug: string }>,
  accent = "#f4c95d",
) {
  const links = pages.map((item) => ({ id: id(), label: item.name, url: item.slug }));
  const conversionPage =
    pages.find((item) => item.slug === "apply") ||
    pages.find((item) => item.slug === "contact") ||
    pages[pages.length - 1];
  const primaryContentPage =
    pages.find((item) => item.slug === "programs") ||
    pages.find((item) => item.slug === "services") ||
    pages.find((item) => item.slug === "projects") ||
    pages[1] || pages[0];
  const header = block(
    "Navigation",
    "nav-minimal",
    {
      title: businessName,
      subtitle: pages.map((item) => item.name).join(" · "),
      btnText: conversionPage.slug === "apply" ? "Apply now" : "Contact us",
      btnActionType: "link",
      btnActionValue: conversionPage.slug,
      links,
    },
    {
      ...dark(accent),
      paddingTop: 10,
      paddingBottom: 10,
      titleSize: 18,
      subtitleSize: 12,
      maxWidth: 1240,
      cardBorderRadius: 12,
      cardBgColor: "#0d121b",
    },
  );

  const footer = block(
    "Footer",
    "footer-classic",
    {
      title: businessName,
      subtitle:
        "Structured education for independent traders. Build a process, manage risk, and make decisions with discipline.",
      copyright: `© ${new Date().getFullYear()} ${businessName}. Educational content only. Trading involves risk.`,
      contactPhone: "Admissions · Mon–Fri",
      contactEmail: "hello@primestrikes.academy",
      contactAddress: "Online programs · India",
      btnText: `View ${primaryContentPage.name.toLowerCase()}`,
      btnActionType: "link",
      btnActionValue: primaryContentPage.slug,
      links,
    },
    {
      ...dark(accent),
      useGradient: false,
      paddingTop: 64,
      paddingBottom: 32,
      titleSize: 22,
      maxWidth: 1240,
      backgroundColor: "#080b10",
      cardBgColor: "#0d121b",
    },
  );

  return { header, footer };
}

function buildPrimeStrikes(businessName: string) {
  const brand = businessName || "Prime Strikes";
  const pageLinks = [
    { name: "Home", slug: "home" },
    { name: "Programs", slug: "programs" },
    { name: "Mentors", slug: "mentors" },
    { name: "Insights", slug: "insights" },
    { name: "Apply", slug: "apply" },
  ];
  const chrome = sharedChrome(brand, pageLinks);

  const pages = [
    page(
      "Home",
      "home",
      `${brand} | Professional Trading Education`,
      "Build a repeatable trading process with structured education, risk management, and live market practice.",
      [
        block(
          "Hero",
          "split",
          {
            badge: "PROFESSIONAL TRADING EDUCATION",
            title: "Build a trading process you can trust.",
            subtitle:
              "Learn market structure, risk management, and execution through a clear curriculum built for serious independent traders.",
            imageUrl:
              "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=85&w=1400",
            btnText: "Explore programs",
            btnActionType: "link",
            btnActionValue: "programs",
          },
          { ...dark(), paddingTop: 112, paddingBottom: 112, titleSize: 64 },
        ),
        block(
          "Special",
          "stats-grid",
          {
            badge: "THE PRIME METHOD",
            title: "A curriculum measured by process, not promises.",
            subtitle:
              "Every program is designed around repeatable decisions and documented risk controls.",
            stats: [
              { id: id(), label: "Flagship curriculum", val: 10, suffix: " weeks" },
              { id: id(), label: "Live practice sessions", val: 24, suffix: "" },
              { id: id(), label: "Core risk framework", val: 1, suffix: "" },
            ],
          },
          { ...light(), textAlign: "center", titleSize: 42 },
        ),
        block(
          "Features",
          "bento-box",
          {
            badge: "WHAT YOU WILL BUILD",
            title: "Learn the process behind the trade.",
            subtitle:
              "Move from scattered information to a disciplined operating system for analysis, execution, and review.",
            features: [
              {
                id: id(),
                title: "Market structure",
                desc: "Read trend, range, liquidity, and context before looking for an entry.",
                icon: "BarChart3",
              },
              {
                id: id(),
                title: "Risk architecture",
                desc: "Define invalidation, position size, and daily loss limits before the trade begins.",
                icon: "ShieldCheck",
              },
              {
                id: id(),
                title: "Execution journal",
                desc: "Turn every trade into reviewable data and improve one decision at a time.",
                icon: "FileText",
              },
            ],
          },
          { ...dark(), useGradient: false, titleSize: 46 },
        ),
        block(
          "CTA",
          "image-bg-cta",
          {
            badge: "NEXT COHORT",
            title: "Trade less impulsively. Review more intelligently.",
            subtitle:
              "Apply for the next cohort and receive the full syllabus before you decide.",
            btnText: "Request the syllabus",
            btnActionType: "link",
            btnActionValue: "apply",
            imageUrl:
              "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=85&w=1400",
          },
          { ...dark(), textAlign: "center", titleSize: 48 },
        ),
      ],
    ),
    page(
      "Programs",
      "programs",
      `${brand} Programs | Trading Courses and Cohorts`,
      "Compare Prime Strikes trading programs, workshops, and mentored cohorts.",
      [
        block(
          "Hero",
          "editorial-stack",
          {
            badge: "PROGRAMS",
            title: "Choose the depth that matches your stage.",
            subtitle:
              "Start with foundations, sharpen a specific skill, or join a mentored cohort with live practice and review.",
            btnText: "Talk to admissions",
            btnActionType: "link",
            btnActionValue: "apply",
          },
          { ...light(), paddingTop: 96, paddingBottom: 72, titleSize: 58 },
        ),
        block(
          "EComStore",
          "product-grid-filter",
          {
            badge: "COURSE CATALOG",
            title: "Practical programs. Clear outcomes.",
            subtitle:
              "Review the curriculum and choose a learning format. No profit claims, signals, or shortcuts.",
            btnText: "View program",
          },
          { ...light(), backgroundColor: "#ffffff", maxWidth: 1240, titleSize: 40 },
        ),
        block(
          "Special",
          "steps-path",
          {
            badge: "HOW ENROLMENT WORKS",
            title: "A deliberate start, in three steps.",
            subtitle: "We make sure the program fits your experience and expectations.",
            steps: [
              { id: id(), step: "01", title: "Review", desc: "Compare the syllabus, schedule, and support included." },
              { id: id(), step: "02", title: "Apply", desc: "Tell us your experience, goals, and preferred cohort." },
              { id: id(), step: "03", title: "Onboard", desc: "Receive access, preparation material, and the live calendar." },
            ],
          },
          { ...dark(), useGradient: false, titleSize: 42 },
        ),
      ],
    ),
    page(
      "Mentors",
      "mentors",
      `${brand} Mentors | Learn the Trading Process`,
      "Meet the mentor standards and teaching principles behind Prime Strikes programs.",
      [
        block(
          "Hero",
          "quiet-luxury",
          {
            badge: "MENTORSHIP",
            title: "Clarity before confidence.",
            subtitle:
              "Our teaching standard is simple: explain the reasoning, document the risk, and make every decision reviewable.",
            btnText: "See our programs",
            btnActionType: "link",
            btnActionValue: "programs",
            imageUrl:
              "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=85&w=1400",
          },
          { ...dark(), textAlign: "center", titleSize: 60 },
        ),
        block(
          "Business",
          "mono-grid",
          {
            badge: "TEACHING STANDARD",
            title: "What to expect from a Prime Strikes mentor.",
            subtitle:
              "Mentorship is built around feedback and accountability—not copy trading or undisclosed calls.",
            features: [
              { id: id(), title: "Reasoning in public", desc: "Setups are explained with context, invalidation, and alternatives.", icon: "MessageSquare" },
              { id: id(), title: "Risk first", desc: "Every lesson separates a good process from a fortunate outcome.", icon: "ShieldCheck" },
              { id: id(), title: "Evidence over ego", desc: "Journals, review notes, and sample size guide improvement.", icon: "Database" },
            ],
          },
          { ...light(), backgroundColor: "#ffffff", titleSize: 44 },
        ),
        block(
          "CTA",
          "mono-grid",
          {
            badge: "MEET THE TEAM",
            title: "Ask about the curriculum before you enrol.",
            subtitle: "Speak with admissions and get a straight answer about fit, schedule, and prerequisites.",
            btnText: "Book a curriculum call",
            btnActionType: "link",
            btnActionValue: "apply",
          },
          { ...dark(), useGradient: false, textAlign: "center" },
        ),
      ],
    ),
    page(
      "Insights",
      "insights",
      `${brand} Insights | Trading Education and Risk`,
      "Practical notes on trading process, risk management, execution, and review.",
      [
        block(
          "Hero",
          "mono-grid",
          {
            badge: "FIELD NOTES",
            title: "Better questions create better decisions.",
            subtitle:
              "Short, practical lessons on market context, risk, execution, and the work of reviewing your own behavior.",
            btnText: "Start with risk",
            btnActionType: "scroll",
            btnActionValue: "",
          },
          { ...light(), backgroundColor: "#ffffff", titleSize: 58 },
        ),
        block(
          "Text",
          "article-body",
          {
            badge: "RISK MANAGEMENT",
            title: "A stop loss is not a complete risk plan.",
            subtitle:
              "A complete plan defines position size, maximum daily loss, correlated exposure, and what happens after a losing sequence. The goal is not to avoid losses; it is to keep one decision from compromising the next.",
          },
          { ...light(), maxWidth: 860, titleSize: 42, backgroundColor: "#f7f5ef" },
        ),
        block(
          "Special",
          "faq-accordion",
          {
            badge: "START HERE",
            title: "Common questions from developing traders.",
            subtitle: "Clear expectations make education more useful.",
            faqs: [
              { id: id(), q: "Do you provide trading calls?", a: "No. Prime Strikes teaches analysis, risk, execution, and review. Students remain responsible for their own decisions." },
              { id: id(), q: "Is profitability guaranteed?", a: "No. Trading involves substantial risk, and education cannot guarantee performance or prevent losses." },
              { id: id(), q: "Do I need prior experience?", a: "The Foundation Sprint starts at first principles. Advanced cohorts require a working knowledge of charts and order execution." },
            ],
          },
          { ...dark(), useGradient: false, titleSize: 42 },
        ),
      ],
    ),
    page(
      "Apply",
      "apply",
      `${brand} | Apply for a Trading Program`,
      "Request the Prime Strikes syllabus and speak with admissions about the right trading education program.",
      [
        block(
          "Hero",
          "minimal",
          {
            badge: "ADMISSIONS",
            title: "Find the right starting point.",
            subtitle:
              "Tell us what you trade, where you feel stuck, and how much time you can commit. We will recommend a program—or tell you when self-study is the better option.",
            btnText: "Complete the form",
            btnActionType: "booking",
            btnActionValue: "",
          },
          { ...dark(), textAlign: "center", paddingTop: 100, paddingBottom: 84, titleSize: 56 },
        ),
        block(
          "Forms",
          "contact-complex",
          {
            badge: "REQUEST THE SYLLABUS",
            title: "Start with a curriculum conversation.",
            subtitle:
              "Share your details and our admissions team will send the syllabus and next cohort dates.",
            btnText: "Send my request",
            successMessage: "Thanks—our admissions team will send the syllabus shortly.",
            whatsappFollowUp: false,
          },
          { ...light(), backgroundColor: "#f7f5ef", maxWidth: 900, textAlign: "center", titleSize: 40 },
        ),
        block(
          "CTA",
          "simple-cta",
          {
            badge: "IMPORTANT",
            title: "Education, not investment advice.",
            subtitle:
              "Prime Strikes does not promise returns, manage funds, or provide personalized investment recommendations. Trading involves risk of loss.",
            btnText: "Read the insights",
            btnActionType: "link",
            btnActionValue: "insights",
          },
          { ...dark(), useGradient: false, textAlign: "center", titleSize: 36 },
        ),
      ],
    ),
  ];

  const products: SiteKitProduct[] = [
    {
      title: "Foundation Sprint",
      description: "A four-week introduction to market structure, order types, risk, and journaling.",
      price: 4999,
      image: "https://images.unsplash.com/photo-1642790551116-18e150f248e5?auto=format&fit=crop&q=85&w=1000",
      category: "Self-paced",
      tags: ["Foundation", "Beginner"],
      badge: "Start here",
    },
    {
      title: "Price Action Lab",
      description: "Six weeks of guided chart work focused on context, invalidation, and execution quality.",
      price: 12999,
      compareAtPrice: 14999,
      image: "https://images.unsplash.com/photo-1612010167101-8810ec3bf0d7?auto=format&fit=crop&q=85&w=1000",
      category: "Workshop",
      tags: ["Intermediate", "Live practice"],
      badge: "Most popular",
    },
    {
      title: "Live Trading Cohort",
      description: "A ten-week mentored program with live preparation, structured review, and accountability.",
      price: 24999,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=85&w=1000",
      category: "Mentored cohort",
      tags: ["Advanced", "Mentorship"],
      badge: "Limited seats",
    },
  ];

  return { ...chrome, pages, products };
}

function buildNorthstar(businessName: string) {
  const brand = businessName || "Northstar Advisory";
  const links = [
    { name: "Home", slug: "home" },
    { name: "Services", slug: "services" },
    { name: "Work", slug: "work" },
    { name: "About", slug: "about" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = sharedChrome(brand, links, "#a3e635");
  const pages = links.map((item, index) =>
    page(
      item.name,
      item.slug,
      `${brand} | ${item.name}`,
      `${item.name} at ${brand}, an independent strategy and operations practice.`,
      index === 0
        ? [
            block("Hero", "mono-grid", { badge: "INDEPENDENT ADVISORY", title: "Strategy that survives contact with reality.", subtitle: "Focused research, operating plans, and senior support for teams navigating consequential growth decisions.", btnText: "Start a conversation", btnActionType: "link", btnActionValue: "contact" }, { ...dark("#a3e635"), titleSize: 62 }),
            block("Features", "mono-grid", { badge: "CAPABILITIES", title: "From ambiguity to an executable plan.", subtitle: "A compact senior team across strategy, product, and operating design.", features: [
              { id: id(), title: "Market intelligence", desc: "Evidence-led category, customer, and competitor research.", icon: "Search" },
              { id: id(), title: "Growth strategy", desc: "Clear choices across positioning, channels, and resource allocation.", icon: "TrendingUp" },
              { id: id(), title: "Operating design", desc: "Decision rights, rhythms, and metrics teams can actually use.", icon: "Workflow" },
            ] }, { ...light("#4d7c0f"), backgroundColor: "#ffffff", titleSize: 44 }),
          ]
        : [
            block("Hero", "editorial-stack", { badge: item.name.toUpperCase(), title: item.name === "Contact" ? "Bring us the difficult decision." : `${item.name}, without the theatre.`, subtitle: "Senior attention, direct communication, and work designed to move a real decision forward.", btnText: item.name === "Contact" ? "Send an enquiry" : "Talk to the team", btnActionType: item.name === "Contact" ? "booking" : "link", btnActionValue: "contact" }, { ...light("#4d7c0f"), titleSize: 54 }),
            ...(item.name === "Contact" ? [block("Forms", "contact-complex", { badge: "NEW PROJECT", title: "Tell us what is changing.", subtitle: "Share the decision, deadline, and people involved. We will reply with a useful next step.", btnText: "Send project note", whatsappFollowUp: false }, { ...dark("#a3e635"), useGradient: false, textAlign: "center" })] : []),
          ],
    ),
  );
  return { ...chrome, pages };
}

function buildFieldNotes(businessName: string) {
  const brand = businessName || "Field Notes Studio";
  const links = [
    { name: "Home", slug: "home" },
    { name: "Projects", slug: "projects" },
    { name: "Journal", slug: "journal" },
    { name: "Studio", slug: "studio" },
    { name: "Contact", slug: "contact" },
  ];
  const chrome = sharedChrome(brand, links, "#fb923c");
  const warm = { ...light("#c2410c"), backgroundColor: "#fff7ed", fontFamily: "Lora" };
  const pages = links.map((item, index) =>
    page(
      item.name,
      item.slug,
      `${brand} | ${item.name}`,
      `${item.name} from ${brand}, a thoughtful independent creative practice.`,
      index === 0
        ? [
            block("Hero", "warm-studio", { badge: "INDEPENDENT CREATIVE PRACTICE", title: "Identity, digital, and stories with staying power.", subtitle: "We help ambitious small brands find a clear voice and turn it into a useful, memorable experience.", btnText: "View selected work", btnActionType: "link", btnActionValue: "projects", imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=85&w=1400" }, { ...warm, titleSize: 62 }),
            block("Gallery", "masonry", { badge: "SELECTED WORK", title: "A practice built around attention.", subtitle: "A restrained collection of identity, editorial, and digital work.", galleryImages: [
              { id: id(), url: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=85&w=1000", title: "Morrow identity", subtitle: "Brand system", aspect: "square" },
              { id: id(), url: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&q=85&w=1000", title: "Common Ground", subtitle: "Digital experience", aspect: "square" },
              { id: id(), url: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&q=85&w=1000", title: "Soft Objects", subtitle: "Campaign direction", aspect: "square" },
            ] }, { ...dark("#fb923c"), useGradient: false, titleSize: 44 }),
          ]
        : [
            block("Hero", "editorial-stack", { badge: item.name.toUpperCase(), title: item.name === "Contact" ? "Let’s make the next thing useful." : `${item.name}, carefully considered.`, subtitle: "Thoughtful work, explained clearly and presented without filler.", btnText: item.name === "Contact" ? "Start a project" : "Contact the studio", btnActionType: item.name === "Contact" ? "booking" : "link", btnActionValue: "contact" }, { ...warm, titleSize: 54 }),
            ...(item.name === "Contact" ? [block("Forms", "contact-complex", { badge: "PROJECT ENQUIRY", title: "Share the shape of the project.", subtitle: "A short note about scope, timing, and ambition is enough to begin.", btnText: "Send enquiry", whatsappFollowUp: false }, { ...dark("#fb923c"), useGradient: false, textAlign: "center" })] : []),
          ],
    ),
  );
  return { ...chrome, pages };
}

export const SITE_KITS: SiteKit[] = [
  {
    id: "prime-strikes",
    name: "Prime Strikes Academy",
    category: "Education & courses",
    description: "A five-page trading school with programs, mentors, editorial content, admissions, and a live course catalog.",
    audience: "Trading educators, cohort courses, professional academies",
    palette: ["#080b10", "#f4c95d", "#f7f5ef"],
    pageCount: 5,
    build: buildPrimeStrikes,
  },
  {
    id: "northstar-advisory",
    name: "Northstar Advisory",
    category: "Professional services",
    description: "A rigorous five-page consulting site with restrained typography, capabilities, work, and lead capture.",
    audience: "Consultants, studios, B2B services",
    palette: ["#080b10", "#a3e635", "#ffffff"],
    pageCount: 5,
    build: buildNorthstar,
  },
  {
    id: "field-notes-studio",
    name: "Field Notes Studio",
    category: "Creative portfolio",
    description: "A warm editorial portfolio with selected work, a journal, a studio profile, and project enquiries.",
    audience: "Designers, photographers, creative practices",
    palette: ["#111827", "#fb923c", "#fff7ed"],
    pageCount: 5,
    build: buildFieldNotes,
  },
];

export const getSiteKit = (kitId: string) => SITE_KITS.find((kit) => kit.id === kitId);

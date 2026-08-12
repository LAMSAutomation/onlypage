import type { BlockCSSStyles, WebBlock } from "./builder-types";
import type { SiteRecord } from "./ui/onboarding-wizard";



export const defaultStyles: BlockCSSStyles = {
  paddingTop: 88,
  paddingBottom: 88,
  paddingLeft: 24,
  paddingRight: 24,
  gapSize: 24,
  maxWidth: 1180,
  textAlign: "left",
  backgroundColor: "#ffffff",
  backgroundGradient: "linear-gradient(135deg, #f7fee7 0%, #ffffff 60%)",
  useGradient: false,
  textColor: "#17201c",
  subtitleColor: "#64748b",
  accentColor: "#65a30d",
  badgeBgColor: "#ecfccb",
  badgeTextColor: "#3f6212",
  fontFamily: "Inter",
  titleSize: 48,
  titleWeight: "bold",
  subtitleSize: 18,
  bodySize: 15,
  lineHeight: 1.45,
  cardBgColor: "#ffffff",
  cardTextColor: "#17201c",
  cardBorderRadius: 16,
  cardShadow: "sm",
  cardBorderWidth: 1,
  cardBorderColor: "#e2e8f0",
  borderRadius: 0,
  borderWidth: 0,
  borderColor: "#e2e8f0",
  borderStyle: "solid",
  boxShadow: "none",
  buttonBgColor: "#17201c",
  buttonTextColor: "#ffffff",
  buttonBorderRadius: 10,
  buttonHoverScale: true,
};

const academyStylePatch: Partial<BlockCSSStyles> = {
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  maxWidth: 1600,
  backgroundColor: "#080808",
  textColor: "#ffffff",
  subtitleColor: "#9a9a9a",
  accentColor: "#e0b82f",
  badgeBgColor: "transparent",
  badgeTextColor: "#e0b82f",
  buttonBgColor: "#e0b82f",
  buttonTextColor: "#090909",
  buttonBorderRadius: 999,
  cardBgColor: "#151515",
  cardTextColor: "#ffffff",
  cardBorderColor: "#2a2a2a",
  cardBorderRadius: 20,
  fontFamily: "Inter",
  textAlign: "left",
  useGradient: false,
};

export const variantStylePatches: Record<string, Partial<BlockCSSStyles>> = {
  "signature-editorial": academyStylePatch,
  "nav-signature": academyStylePatch,
  "signature-hero": academyStylePatch,
  "signature-bento": academyStylePatch,
  "signature-cta": academyStylePatch,
  "signature-gallery": academyStylePatch,
  "signature-story": academyStylePatch,
  "signature-pricing": academyStylePatch,
  "signature-stories": academyStylePatch,
  "signature-form": academyStylePatch,
  "signature-store": academyStylePatch,
  "signature-map": academyStylePatch,
  "signature-faq": academyStylePatch,
  "footer-signature": { ...academyStylePatch, backgroundColor: "#f7f7f5", textColor: "#121212" },
  "premium-proof-rail": academyStylePatch,
  "premium-bento-grid": academyStylePatch,
  "premium-story-split": academyStylePatch,
  "premium-results-metrics": academyStylePatch,
  "premium-roadmap": academyStylePatch,
  "premium-testimonial-carousel": academyStylePatch,
  "premium-pricing-toggle": academyStylePatch,
  "premium-gallery-lightbox": academyStylePatch,
  "premium-faq": academyStylePatch,
  "premium-contact-panel": academyStylePatch,
  "academy-cinematic": academyStylePatch,
  "academy-courses": academyStylePatch,
  "academy-session": academyStylePatch,
  "academy-stories": academyStylePatch,
  "academy-process": academyStylePatch,
  "academy-spotlight": academyStylePatch,
  "academy-enquiry": academyStylePatch,
  "academy-registration": academyStylePatch,
  "academy-portal": academyStylePatch,
  "nav-academy": academyStylePatch,
  "footer-academy": {
    ...academyStylePatch,
    backgroundColor: "#f7f7f5",
    textColor: "#121212",
  },
  "editorial-stack": {
    backgroundColor: "#f5f0e8",
    textColor: "#211c18",
    subtitleColor: "#6f6259",
    accentColor: "#9a3412",
    buttonBgColor: "#211c18",
    fontFamily: "Playfair Display",
    textAlign: "left",
    useGradient: false,
  },
  "local-conversion": {
    backgroundColor: "#f7fee7",
    textColor: "#1a2e05",
    subtitleColor: "#4d7c0f",
    accentColor: "#65a30d",
    buttonBgColor: "#3f6212",
    fontFamily: "Outfit",
    textAlign: "left",
    useGradient: false,
  },
  "quiet-luxury": {
    backgroundColor: "#18181b",
    textColor: "#fafafa",
    subtitleColor: "#a1a1aa",
    accentColor: "#d6b66b",
    buttonBgColor: "#d6b66b",
    buttonTextColor: "#18181b",
    fontFamily: "Playfair Display",
    textAlign: "center",
    useGradient: false,
  },
  "bold-poster": {
    backgroundColor: "#facc15",
    textColor: "#111827",
    subtitleColor: "#374151",
    accentColor: "#111827",
    buttonBgColor: "#111827",
    fontFamily: "Space Grotesk",
    titleWeight: "black",
    titleSize: 72,
    textAlign: "left",
    useGradient: false,
  },
  "soft-gradient": {
    backgroundColor: "#faf5ff",
    backgroundGradient:
      "linear-gradient(135deg, #faf5ff 0%, #eef2ff 48%, #ecfeff 100%)",
    textColor: "#312e81",
    subtitleColor: "#6366f1",
    accentColor: "#7c3aed",
    buttonBgColor: "#7c3aed",
    fontFamily: "Outfit",
    useGradient: true,
  },
  "mono-grid": {
    backgroundColor: "#fafafa",
    textColor: "#09090b",
    subtitleColor: "#52525b",
    accentColor: "#09090b",
    buttonBgColor: "#09090b",
    fontFamily: "JetBrains Mono",
    textAlign: "left",
    cardBorderRadius: 0,
    buttonBorderRadius: 0,
    useGradient: false,
  },
  "warm-studio": {
    backgroundColor: "#fff7ed",
    textColor: "#431407",
    subtitleColor: "#9a3412",
    accentColor: "#ea580c",
    buttonBgColor: "#ea580c",
    fontFamily: "Lora",
    cardBorderRadius: 24,
    useGradient: false,
  },
  "glass-panel": {
    backgroundColor: "#0f172a",
    backgroundGradient:
      "linear-gradient(135deg, #0f172a 0%, #312e81 55%, #581c87 100%)",
    textColor: "#f8fafc",
    subtitleColor: "#cbd5e1",
    accentColor: "#c4b5fd",
    buttonBgColor: "#ffffff",
    buttonTextColor: "#312e81",
    fontFamily: "Space Grotesk",
    cardBgColor: "#ffffff1a",
    cardBorderColor: "#ffffff33",
    useGradient: true,
  },
};

const starterGalleryImages = () => [
  {
    id: crypto.randomUUID(),
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=900",
    title: "Signature experience",
    subtitle: "Show customers the quality they can expect.",
    aspect: "square",
  },
  {
    id: crypto.randomUUID(),
    url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=900",
    title: "Thoughtful details",
    subtitle: "Highlight your process, environment, or finished work.",
    aspect: "square",
  },
  {
    id: crypto.randomUUID(),
    url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=900",
    title: "Customer results",
    subtitle: "Use authentic images that build trust.",
    aspect: "square",
  },
];

const starterFaqs = () => [
  {
    id: crypto.randomUUID(),
    q: "How do I make a booking?",
    a: "Choose a suitable time on this page and share your contact details. We will confirm the appointment shortly.",
  },
  {
    id: crypto.randomUUID(),
    q: "Can I contact you on WhatsApp?",
    a: "Yes. Use the WhatsApp button and our team will respond during business hours.",
  },
];

const starterStats = () => [
  { id: crypto.randomUUID(), label: "Happy customers", val: 250, suffix: "+" },
  { id: crypto.randomUUID(), label: "Average rating", val: 4.9, suffix: "/5" },
  { id: crypto.randomUUID(), label: "Years of experience", val: 8, suffix: "+" },
];

const starterSteps = () => [
  {
    id: crypto.randomUUID(),
    step: "01",
    title: "Choose a service",
    desc: "Select the option that best matches what you need.",
  },
  {
    id: crypto.randomUUID(),
    step: "02",
    title: "Pick a time",
    desc: "Choose from the available appointment slots.",
  },
  {
    id: crypto.randomUUID(),
    step: "03",
    title: "Get confirmation",
    desc: "Receive the final details through WhatsApp.",
  },
];

const contentFor = (type: string, variant?: string) => {
  const base = {
    badge: "YOUR BUSINESS",
    title: "A website that earns its place in your day.",
    subtitle:
      "Tell customers what you do, make the next step clear, and keep every enquiry moving.",
    btnText: "Get started",
  };
  if (type === "Text" && variant === "signature-editorial")
    return {
      ...base,
      badge: "OUR POINT OF VIEW",
      title: "The best work feels inevitable, not excessive.",
      subtitle:
        "We begin by finding the one idea the experience needs to communicate. Then every word, image, and interaction earns its place.\n\nThe result is confident, useful, and unmistakably yours — a digital presence built to stay relevant after launch day.",
      btnText: "Read our approach",
      btnActionType: "link",
      btnActionValue: "about",
    };
  if (type === "Hero" && variant === "signature-hero")
    return {
      ...base,
      badge: "SIGNATURE EXPERIENCE",
      title: "Build a brand people remember.",
      subtitle:
        "A cinematic first impression, a precise promise, and a clear path from interest to action.",
      imageUrl:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=88&w=1800",
      btnText: "Explore our work",
      btnActionType: "link",
      btnActionValue: "services",
      secondaryBtnText: "Start a project",
      secondaryBtnActionType: "link",
      secondaryBtnActionValue: "contact",
    };
  if (type === "Hero" && variant === "academy-cinematic")
    return {
      ...base,
      badge: "PREMIUM ACADEMY",
      title: "Teach with authority. Help people act with clarity.",
      subtitle:
        "Combine a cinematic visual, a precise promise, and two clear paths for new and returning students.",
      imageUrl:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=85&w=1800",
      btnText: "Start learning",
      btnActionType: "booking",
      btnActionValue: "",
      secondaryBtnText: "Explore courses",
      secondaryBtnActionType: "link",
      secondaryBtnActionValue: "services",
    };
  if (type === "Features" && variant === "academy-courses")
    return {
      ...base,
      badge: "CURRICULUM",
      title: "A structured learning path",
      subtitle: "Present each course with real imagery, a clear outcome, and a connected next step.",
      features: [
        {
          id: crypto.randomUUID(),
          title: "Foundation Program",
          desc: "Build the core knowledge students need before advancing.",
          icon: "BookOpen",
          eyebrow: "Start here",
          imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=85&w=1000",
          linkText: "View program",
          linkActionType: "link",
          linkActionValue: "services",
        },
        {
          id: crypto.randomUUID(),
          title: "Advanced Program",
          desc: "Apply the framework through guided practice and review.",
          icon: "ChartNoAxesCombined",
          eyebrow: "Go deeper",
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=85&w=1000",
          linkText: "View program",
          linkActionType: "link",
          linkActionValue: "services",
        },
      ],
    };
  if (type === "Features" && ["premium-bento-grid", "signature-bento"].includes(variant || ""))
    return {
      ...base,
      badge: "BUILT AROUND OUTCOMES",
      title: "A premium bento system for your strongest capabilities",
      subtitle: "Combine real imagery, focused customer outcomes, and direct next steps in an art-directed responsive grid.",
      features: [
        { id: crypto.randomUUID(), title: "Signature experience", desc: "Lead with the outcome that makes your business genuinely different.", icon: "Sparkles", eyebrow: "Flagship", imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=85&w=1400", linkText: "Explore the experience", linkActionType: "link", linkActionValue: "services" },
        { id: crypto.randomUUID(), title: "Expert guidance", desc: "Explain the human expertise behind the service.", icon: "Users", eyebrow: "Personal", imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=85&w=900", linkText: "Meet the team", linkActionType: "link", linkActionValue: "contact" },
        { id: crypto.randomUUID(), title: "A clear process", desc: "Show customers what happens next and remove uncertainty.", icon: "Route", eyebrow: "Structured", imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=85&w=1000", linkText: "See the process", linkActionType: "link", linkActionValue: "services" },
        { id: crypto.randomUUID(), title: "Measurable progress", desc: "Use credible signals and honest evidence to build trust.", icon: "ChartNoAxesCombined", eyebrow: "Evidence", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=85&w=1000", linkText: "View results", linkActionType: "link", linkActionValue: "services" },
      ],
    };
  if (type === "Forms")
    return {
      ...base,
      badge: "BOOK NOW",
      title: "Choose a time that works for you",
      subtitle:
        "Share your preferred service and we will confirm your booking.",
      btnText: "Request booking",
      ...(["premium-contact-panel", "signature-form"].includes(variant || "")
        ? {
            badge: "START A CONVERSATION",
            title: "Tell us what you want to build",
            subtitle: "A polished, configurable lead workflow with direct contact options and secure submission handling.",
            btnText: "Send enquiry",
            contactEmail: "hello@yourbusiness.in",
            contactPhone: "+91 98765 43210",
            contactAddress: "Bengaluru, India",
            successMessage: "Thank you. The team will review your enquiry and contact you shortly.",
            formFields: [
              { id: crypto.randomUUID(), label: "First name", name: "first_name", type: "text" as const, placeholder: "Your first name", required: true, width: "half" as const },
              { id: crypto.randomUUID(), label: "Last name", name: "last_name", type: "text" as const, placeholder: "Your last name", required: true, width: "half" as const },
              { id: crypto.randomUUID(), label: "Email", name: "email", type: "email" as const, placeholder: "you@example.com", required: true, width: "half" as const },
              { id: crypto.randomUUID(), label: "Phone", name: "phone", type: "tel" as const, placeholder: "+91 98765 43210", required: false, width: "half" as const },
              { id: crypto.randomUUID(), label: "How can we help?", name: "message", type: "textarea" as const, placeholder: "Tell us about your goals", required: true, width: "full" as const },
            ],
          }
        : variant?.startsWith("academy-")
        ? {
            badge: variant === "academy-portal" ? "STUDENT PORTAL" : "COURSE ENQUIRY",
            title: variant === "academy-portal" ? "Welcome back" : "Tell us about your learning goals",
            subtitle:
              variant === "academy-portal"
                ? "Sign in or request access after your enrollment is verified."
                : "Share the details your team needs to recommend the right next step.",
            btnText: variant === "academy-portal" ? "Sign in" : "Send enquiry",
            formFields: [
              { id: crypto.randomUUID(), label: "Full name", name: "name", type: "text" as const, placeholder: "Your name", required: variant !== "academy-portal", width: "full" as const },
              { id: crypto.randomUUID(), label: "Email", name: "email", type: "email" as const, placeholder: "you@example.com", required: true, width: "full" as const },
              ...(variant === "academy-portal"
                ? [{ id: crypto.randomUUID(), label: "Password", name: "password", type: "password" as const, placeholder: "Enter your password", required: true, width: "full" as const }]
                : [{ id: crypto.randomUUID(), label: "Learning goals", name: "message", type: "textarea" as const, placeholder: "What would you like to learn?", required: false, width: "full" as const }]),
            ],
          }
        : {}),
    };
  if (type === "Pricing")
    if (["premium-pricing-toggle", "signature-pricing"].includes(variant || ""))
      return {
        ...base,
        badge: "SIMPLE, TRANSPARENT PRICING",
        title: "Choose the level of support you need",
        subtitle: "A premium comparison with a working billing switch and a clear recommended option.",
        btnText: "Start a conversation",
        btnActionType: "booking",
        pricing: [
          { id: crypto.randomUUID(), tier: "Essential", price: "₹4,999", features: ["Core service or program", "Guided onboarding", "Email support"], btnText: "Choose Essential", popular: false },
          { id: crypto.randomUUID(), tier: "Professional", price: "₹9,999", features: ["Everything in Essential", "Priority guidance", "Monthly review", "Premium resources"], btnText: "Choose Professional", popular: true },
          { id: crypto.randomUUID(), tier: "Private", price: "₹19,999", features: ["Everything in Professional", "1:1 strategy sessions", "Custom implementation", "Priority access"], btnText: "Contact us", popular: false },
        ],
      };
    else
    return {
      ...base,
      badge: "SERVICES",
      title: "Simple, clear packages",
      subtitle:
        "Help customers choose the right service without a long back-and-forth.",
      btnText: "Choose this",
      pricing: [
        {
          id: crypto.randomUUID(),
          tier: "Essential",
          price: "₹999",
          features: ["What is included", "Clear next step"],
          btnText: "Enquire now",
          popular: true,
        },
      ],
    };
  if (type === "Business" && variant === "academy-session")
    return {
      ...base,
      badge: "FEATURED SESSION",
      title: "Show the work behind the result",
      subtitle:
        "Use a real session, project, or case study to explain how your teaching works in practice.",
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=85&w=1400",
      stats: starterStats(),
      btnText: "Explore courses",
      btnActionType: "link",
      btnActionValue: "services",
    };
  if (type === "Business" && ["premium-story-split", "signature-story"].includes(variant || ""))
    return {
      ...base,
      badge: "HOW THE WORK HAPPENS",
      title: "Turn your process into a compelling case study",
      subtitle: "Pair real imagery with the decisions, methods, and proof that make the final result credible.",
      imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=85&w=1400",
      btnText: "Explore the full process",
      btnActionType: "link",
      btnActionValue: "services",
      features: [
        { id: crypto.randomUUID(), title: "Diagnose the real need", desc: "Start with context instead of forcing a standard solution.", icon: "ScanSearch" },
        { id: crypto.randomUUID(), title: "Build the right system", desc: "Connect the work to a repeatable process customers can understand.", icon: "Workflow" },
        { id: crypto.randomUUID(), title: "Review the result", desc: "Use evidence and feedback to improve the next decision.", icon: "ChartNoAxesCombined" },
      ],
    };
  if (type === "Business" || type === "Features")
    return {
      ...base,
      badge: "WHAT WE OFFER",
      title: "Services customers understand at a glance",
      subtitle: "Show your most important services and help customers choose.",
      features: [
        {
          id: crypto.randomUUID(),
          title: "Signature service",
          desc: "A clear description of the result your customer receives.",
          icon: "Sparkles",
        },
      ],
    };
  if (type === "Testimonials" && variant === "academy-stories")
    return {
      ...base,
      badge: "STUDENT STORIES",
      title: "What learners say",
      subtitle: "Replace these prompts with verified student feedback before publishing.",
      testimonials: [
        { id: crypto.randomUUID(), name: "Student name", role: "Program · Cohort", content: "Add a genuine, specific student experience here.", avatar: "", rating: 5 },
        { id: crypto.randomUUID(), name: "Student name", role: "Program · Cohort", content: "Explain what changed in the learner's process or understanding.", avatar: "", rating: 5 },
        { id: crypto.randomUUID(), name: "Student name", role: "Program · Cohort", content: "Keep the review concrete and avoid invented performance claims.", avatar: "", rating: 5 },
      ],
    };
  if (type === "Testimonials" && ["premium-testimonial-carousel", "signature-stories"].includes(variant || ""))
    return {
      ...base,
      badge: "CUSTOMER STORIES",
      title: "The experience, in their own words",
      subtitle: "A focused, interactive story carousel for specific and credible customer feedback.",
      testimonials: [
        { id: crypto.randomUUID(), name: "Aarav Mehta", role: "Founder · Bengaluru", content: "The process was clear from the first conversation. Every decision had a reason, and the final result felt distinctly ours.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200", rating: 5 },
        { id: crypto.randomUUID(), name: "Maya Rao", role: "Creative Director · Chennai", content: "What stood out was the level of restraint. The team simplified the experience without removing the personality that customers remember.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", rating: 5 },
        { id: crypto.randomUUID(), name: "Kabir Singh", role: "Operations Lead · Mumbai", content: "We finally have a system the team can use confidently. It looks premium, but more importantly, every part does useful work.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", rating: 5 },
      ],
    };
  if (type === "Testimonials")
    return {
      ...base,
      badge: "REVIEWS",
      title: "Let real customer experiences do the talking",
      subtitle: "Request reviews after completed bookings—never invent them.",
      testimonials: [],
    };
  if (type === "Gallery")
    if (["premium-gallery-lightbox", "signature-gallery"].includes(variant || ""))
      return {
        ...base,
        badge: "SELECTED WORK",
        title: "An editorial gallery people can explore",
        subtitle: "Use a responsive visual mosaic and let visitors open every image in a focused fullscreen view.",
        galleryImages: starterGalleryImages().concat([
          { id: crypto.randomUUID(), url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=85&w=1200", title: "Designed environment", subtitle: "Show the space, context, or final experience.", aspect: "landscape" },
          { id: crypto.randomUUID(), url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=85&w=1200", title: "Work in progress", subtitle: "Make the process visible and credible.", aspect: "landscape" },
        ]),
      };
    else
    return {
      ...base,
      badge: "OUR WORK",
      title: "A closer look at what we create",
      subtitle:
        "Replace these images with real work, your space, products, or customer results.",
      galleryImages: starterGalleryImages(),
    };
  if (type === "Special") {
    if (variant === "premium-proof-rail")
      return { ...base, badge: "TRUSTED EXPERIENCE", title: "Proof that stays concise", subtitle: "", stats: [
        { id: crypto.randomUUID(), label: "Customers supported", val: 1200, suffix: "+" },
        { id: crypto.randomUUID(), label: "Average response", val: 2, suffix: " hrs" },
        { id: crypto.randomUUID(), label: "Customer rating", val: 4.9, suffix: "/5" },
        { id: crypto.randomUUID(), label: "Years of practice", val: 8, suffix: "+" },
      ] };
    if (variant === "premium-results-metrics")
      return { ...base, badge: "RESULTS THAT MATTER", title: "Make the evidence impossible to miss", subtitle: "Use honest, current numbers and give each metric enough space to communicate its meaning.", stats: [
        { id: crypto.randomUUID(), label: "Projects delivered", val: 240, suffix: "+" },
        { id: crypto.randomUUID(), label: "Repeat customers", val: 68, suffix: "%" },
        { id: crypto.randomUUID(), label: "Average rating", val: 4.9, suffix: "/5" },
        { id: crypto.randomUUID(), label: "Cities served", val: 18, suffix: "" },
      ] };
    if (variant === "premium-roadmap")
      return { ...base, badge: "A CLEAR WAY FORWARD", title: "Show customers exactly what happens next", subtitle: "A connected journey makes a complex service easier to understand and easier to choose.", steps: [
        { id: crypto.randomUUID(), step: "01", title: "Discover", desc: "Understand the customer, the context, and the real outcome required." },
        { id: crypto.randomUUID(), step: "02", title: "Design", desc: "Shape the right approach and agree on the decisions that matter." },
        { id: crypto.randomUUID(), step: "03", title: "Deliver", desc: "Build the work with visible milestones and clear communication." },
        { id: crypto.randomUUID(), step: "04", title: "Improve", desc: "Review evidence, collect feedback, and strengthen the next iteration." },
      ] };
    if (["premium-faq", "signature-faq"].includes(variant || ""))
      return { ...base, badge: "QUESTIONS, ANSWERED", title: "Remove uncertainty before people ask", subtitle: "Clear answers reduce friction and help the right customers take the next step.", btnText: "Talk to our team", btnActionType: "booking", faqs: [
        { id: crypto.randomUUID(), q: "What does the process look like?", a: "We begin with a focused discovery conversation, define the required outcome, agree on the scope, and keep each delivery milestone visible." },
        { id: crypto.randomUUID(), q: "How long does it usually take?", a: "Timing depends on the scope. After discovery, we provide a clear schedule with review points instead of an open-ended estimate." },
        { id: crypto.randomUUID(), q: "Can the service be customised?", a: "Yes. The structure is repeatable, but the content, priorities, integrations, and level of support can be adapted to the business." },
        { id: crypto.randomUUID(), q: "What happens after launch?", a: "You receive a clear handover and can choose ongoing support for optimisation, updates, training, or new requirements." },
      ] };
    if (variant === "stats-grid")
      return {
        ...base,
        badge: "BY THE NUMBERS",
        title: "Results customers can understand",
        subtitle: "Use real numbers and update them as your business grows.",
        stats: starterStats(),
      };
    if (variant === "steps-path" || variant === "academy-process")
      return {
        ...base,
        badge: "HOW IT WORKS",
        title: "A simple path from interest to action",
        subtitle: "Explain the process so customers know what happens next.",
        steps: starterSteps(),
      };
    return {
      ...base,
      badge: "QUESTIONS",
      title: "Everything customers ask before choosing",
      subtitle: "Remove uncertainty with clear, honest answers.",
      faqs: starterFaqs(),
    };
  }
  if (type === "Contact")
    return {
      ...base,
      badge: "CONTACT",
      title: "Talk to our team",
      subtitle: "Share what you need and we will get back to you shortly.",
      btnText: "Send enquiry",
      contactEmail: "hello@yourbusiness.in",
      contactPhone: "+91 98765 43210",
      contactAddress: "Bengaluru, India",
    };
  if (type === "CTA" && variant === "signature-cta")
    return {
      ...base,
      badge: "READY WHEN YOU ARE",
      title: "Make the next move feel obvious.",
      subtitle:
        "Bring us the ambition, the constraints, and the question you cannot quite resolve. We will turn it into a useful next step.",
      btnText: "Start a conversation",
      btnActionType: "link",
      btnActionValue: "contact",
    };
  if (type === "EComStore" && variant === "signature-store")
    return {
      ...base,
      badge: "THE SIGNATURE EDIT",
      title: "Products chosen with intention.",
      subtitle:
        "A considered collection presented with editorial imagery, useful product detail, and a direct path to purchase.",
      btnText: "View all products",
      btnActionType: "link",
      btnActionValue: "shop",
      contactPhone: "+91 98765 43210",
    };
  if (type === "Map" && variant === "signature-map")
    return {
      ...base,
      badge: "VISIT THE STUDIO",
      title: "Come see where the work happens.",
      subtitle:
        "Visit by appointment, call the studio, or send a note. We will make sure you reach the right person.",
      mapAddress: "Indiranagar, Bengaluru, Karnataka, India",
      contactPhone: "+91 98765 43210",
      contactEmail: "hello@yourbusiness.in",
      contactAddress: "Indiranagar · Bengaluru · India",
      btnText: "Get directions",
    };
  if (type === "Map")
    return {
      ...base,
      badge: "VISIT US",
      title: "Find us easily",
      subtitle: "Add your complete business address and nearby landmark.",
      mapAddress: "Bengaluru, India",
    };
  return base;
};

export const createBlock = (type: string, variant: string): WebBlock =>
  withDefaultAction({
    id: crypto.randomUUID(),
    type: type as WebBlock["type"],
    variant,
    ...contentFor(type, variant),
    styles: {
      ...structuredClone(defaultStyles),
      ...(variantStylePatches[variant] || {}),
    },
  } as WebBlock);

export const createGlobalHeader = (site: SiteRecord): WebBlock =>
  ({
    ...createBlock("Navigation", "nav-minimal"),
    title: site.business_name,
    subtitle: "Home · Services · About · Contact",
    btnText: "Book now",
    btnActionType: "booking",
    btnActionValue: "",
    links: [],
    styles: {
      ...defaultStyles,
      paddingTop: 12,
      paddingBottom: 12,
      maxWidth: 1180,
      titleSize: 20,
      subtitleSize: 13,
      borderWidth: 0,
      cardBorderRadius: 14,
    },
  }) as WebBlock;

export const createGlobalFooter = (site: SiteRecord): WebBlock =>
  ({
    ...createBlock("Footer", "footer-classic"),
    title: site.business_name,
    subtitle:
      "Helpful service, clear next steps, and a simple way to stay in touch.",
    copyright: `© ${new Date().getFullYear()} ${site.business_name}. All rights reserved.`,
    btnText: "Contact us",
    btnActionType: "booking",
    btnActionValue: "",
    links: [
      { id: crypto.randomUUID(), label: "Home", url: "home" },
      { id: crypto.randomUUID(), label: "Services", url: "services" },
      { id: crypto.randomUUID(), label: "Contact", url: "contact" },
      { id: crypto.randomUUID(), label: "Privacy", url: "privacy" },
    ],
    styles: {
      ...defaultStyles,
      paddingTop: 56,
      paddingBottom: 32,
      backgroundColor: "#111713",
      textColor: "#f8fafc",
      subtitleColor: "#94a3b8",
      accentColor: "#a3e635",
      buttonBgColor: "#a3e635",
      buttonTextColor: "#17201c",
      cardBgColor: "#19211c",
      cardTextColor: "#f8fafc",
      cardBorderColor: "#2b352e",
    },
  }) as WebBlock;

export const specialContentMode = (
  variant?: string,
): "faq" | "stats" | "steps" => {
  if (["stats-grid", "mono-grid", "glass-panel", "premium-proof-rail", "premium-results-metrics"].includes(variant || ""))
    return "stats";
  if (["steps-path", "editorial-stack", "quiet-luxury", "academy-process", "premium-roadmap"].includes(variant || ""))
    return "steps";
  return "faq";
};

export const ensureStructuredContent = (block: WebBlock): WebBlock => {
  if (block.type === "Gallery" && !block.galleryImages?.length) {
    return { ...block, galleryImages: starterGalleryImages() };
  }
  if (block.type === "Special") {
    const mode = specialContentMode(block.variant);
    if (mode === "stats" && !block.stats?.length) {
      return { ...block, stats: starterStats() };
    }
    if (mode === "steps" && !block.steps?.length) {
      return { ...block, steps: starterSteps() };
    }
    if (mode === "faq" && !block.faqs?.length) {
      return { ...block, faqs: starterFaqs() };
    }
  }
  return block;
};

const withDefaultAction = (block: WebBlock): WebBlock => {
  const actionTypes = ["Hero", "Business", "Pricing", "CTA", "Navigation"];
  if (
    actionTypes.includes(block.type) &&
    (!block.btnActionType || block.btnActionType === "none")
  ) {
    return { ...block, btnActionType: "booking", btnActionValue: "" };
  }
  return block;
};

export const fromRow = (row: any): WebBlock =>
  withDefaultAction(ensureStructuredContent({
    id: row.id,
    type: row.type,
    ...(row.config || {}),
    styles: { ...defaultStyles, ...(row.config?.styles || {}) },
  } as WebBlock));

export const fromThemeBlock = (block: any): WebBlock | null =>
  block
    ? withDefaultAction(ensureStructuredContent({
        ...block,
        id: block.id || crypto.randomUUID(),
        styles: { ...defaultStyles, ...(block.styles || {}) },
      } as WebBlock))
    : null;

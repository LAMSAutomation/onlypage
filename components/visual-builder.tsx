import React, { useEffect, useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowDownToLine,
  BarChart3,
  CircleAlert,
  Check,
  ChevronDown,
  ChevronRight,
  Command as CommandIcon,
  Copy,
  Database,
  Eye,
  ExternalLink,
  FormInput,
  Globe2,
  HelpCircle,
  Image as ImageIcon,
  Layers3,
  Link2,
  LayoutPanelTop,
  LockKeyhole,
  MessageCircle,
  ListOrdered,
  Mail,
  MapPin,
  Monitor,
  MoreHorizontal,
  MousePointer2,
  Palette,
  PanelRight,
  Plus,
  Phone,
  Save,
  Settings2,
  ShoppingBag,
  Sparkles,
  Smartphone,
  Tablet,
  Trash2,
  Type,
  Users,
  Star,
  WandSparkles,
} from "lucide-react";
import { BLOCK_CATEGORIES, BLOCK_VARIANTS_MAP } from "./builder-data";
import { BuilderRenderer } from "./builder-renderer";
import type { BlockCSSStyles, WebBlock } from "./website-builder-editor";
import { supabase } from "@/lib/supabase";
import { fetchProducts } from "@/lib/ecom-queries";
import type { SiteRecord } from "./ui/onboarding-wizard";

type Viewport = "desktop" | "tablet" | "mobile";
type Page = { id: string; name: string; slug: string };

const defaultStyles: BlockCSSStyles = {
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

const stylePresets = [
  {
    name: "Clean",
    swatches: ["#ffffff", "#17201c", "#65a30d"],
    styles: {
      backgroundColor: "#ffffff",
      textColor: "#17201c",
      subtitleColor: "#64748b",
      accentColor: "#65a30d",
      buttonBgColor: "#17201c",
      buttonTextColor: "#ffffff",
      fontFamily: "Inter",
      useGradient: false,
      cardBorderRadius: 16,
      buttonBorderRadius: 10,
    },
  },
  {
    name: "Editorial",
    swatches: ["#f4efe5", "#201a17", "#9a3412"],
    styles: {
      backgroundColor: "#f4efe5",
      textColor: "#201a17",
      subtitleColor: "#6b5d54",
      accentColor: "#9a3412",
      buttonBgColor: "#201a17",
      buttonTextColor: "#ffffff",
      fontFamily: "Playfair Display",
      useGradient: false,
      cardBorderRadius: 4,
      buttonBorderRadius: 4,
    },
  },
  {
    name: "Midnight",
    swatches: ["#09090b", "#fafafa", "#a3e635"],
    styles: {
      backgroundColor: "#09090b",
      textColor: "#fafafa",
      subtitleColor: "#a1a1aa",
      accentColor: "#a3e635",
      buttonBgColor: "#a3e635",
      buttonTextColor: "#17201c",
      fontFamily: "Space Grotesk",
      useGradient: false,
      cardBgColor: "#18181b",
      cardTextColor: "#fafafa",
      cardBorderColor: "#27272a",
    },
  },
  {
    name: "Aurora",
    swatches: ["#101827", "#f8fafc", "#8b5cf6"],
    styles: {
      backgroundColor: "#101827",
      textColor: "#f8fafc",
      subtitleColor: "#cbd5e1",
      accentColor: "#8b5cf6",
      buttonBgColor: "#8b5cf6",
      buttonTextColor: "#ffffff",
      fontFamily: "Outfit",
      useGradient: true,
      backgroundGradient:
        "linear-gradient(135deg, #101827 0%, #312e81 52%, #581c87 100%)",
      cardBgColor: "#1e293b",
      cardTextColor: "#f8fafc",
      cardBorderColor: "#475569",
    },
  },
  {
    name: "Dopamine",
    swatches: ["#fff7ed", "#431407", "#f97316"],
    styles: {
      backgroundColor: "#fff7ed",
      textColor: "#431407",
      subtitleColor: "#9a3412",
      accentColor: "#f97316",
      buttonBgColor: "#f97316",
      buttonTextColor: "#ffffff",
      fontFamily: "Outfit",
      useGradient: true,
      backgroundGradient:
        "linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fce7f3 100%)",
      cardBorderRadius: 24,
      buttonBorderRadius: 9999,
    },
  },
];

const variantStylePatches: Record<string, Partial<BlockCSSStyles>> = {
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
  if (type === "Forms")
    return {
      ...base,
      badge: "BOOK NOW",
      title: "Choose a time that works for you",
      subtitle:
        "Share your preferred service and we will confirm your booking.",
      btnText: "Request booking",
    };
  if (type === "Pricing")
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
  if (type === "Testimonials")
    return {
      ...base,
      badge: "REVIEWS",
      title: "Let real customer experiences do the talking",
      subtitle: "Request reviews after completed bookings—never invent them.",
      testimonials: [],
    };
  if (type === "Gallery")
    return {
      ...base,
      badge: "OUR WORK",
      title: "A closer look at what we create",
      subtitle:
        "Replace these images with real work, your space, products, or customer results.",
      galleryImages: starterGalleryImages(),
    };
  if (type === "Special") {
    if (variant === "stats-grid")
      return {
        ...base,
        badge: "BY THE NUMBERS",
        title: "Results customers can understand",
        subtitle: "Use real numbers and update them as your business grows.",
        stats: starterStats(),
      };
    if (variant === "steps-path")
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

const createBlock = (type: string, variant: string): WebBlock =>
  withDefaultAction({
    id: crypto.randomUUID(),
    type: type as WebBlock["type"],
    variant,
    ...contentFor(type, variant),
    styles: structuredClone(defaultStyles),
  } as WebBlock);

const createGlobalHeader = (site: SiteRecord): WebBlock =>
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

const createGlobalFooter = (site: SiteRecord): WebBlock =>
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

const specialContentMode = (
  variant?: string,
): "faq" | "stats" | "steps" => {
  if (["stats-grid", "mono-grid", "glass-panel"].includes(variant || ""))
    return "stats";
  if (["steps-path", "editorial-stack", "quiet-luxury"].includes(variant || ""))
    return "steps";
  return "faq";
};

const ensureStructuredContent = (block: WebBlock): WebBlock => {
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

const fromRow = (row: any): WebBlock =>
  withDefaultAction(ensureStructuredContent({
    id: row.id,
    type: row.type,
    ...(row.config || {}),
    styles: { ...defaultStyles, ...(row.config?.styles || {}) },
  } as WebBlock));

const fromThemeBlock = (block: any): WebBlock | null =>
  block
    ? withDefaultAction(ensureStructuredContent({
        ...block,
        id: block.id || crypto.randomUUID(),
        styles: { ...defaultStyles, ...(block.styles || {}) },
      } as WebBlock))
    : null;

export function VisualBuilder({
  site,
  onUpdateSite,
  onNavigateModule,
  onExit,
}: {
  site: SiteRecord;
  onUpdateSite?: (site: SiteRecord) => void;
  onNavigateModule?: (moduleId: string) => void;
  onExit: () => void;
}) {
  const [pages, setPages] = useState<Page[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<WebBlock[]>([]);
  const [globalHeader, setGlobalHeader] = useState<WebBlock | null>(null);
  const [globalFooter, setGlobalFooter] = useState<WebBlock | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSubElement, setSelectedSubElement] = useState<string | null>(null);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [ecomProducts, setEcomProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setProductsLoading(true);
    fetchProducts(site.id)
      .then((products) => {
        if (cancelled) return;
        setEcomProducts(
          products.map((product: any) => ({
            id: product.id,
            title: product.title,
            description: product.description,
            price: String(product.price),
            compare_at: product.compare_at_price
              ? String(product.compare_at_price)
              : "",
            stock: product.stock,
            category: product.category || "General",
            tags: product.tags || [],
            offer_badge: product.offer_badge || "",
            status:
              product.status === "active"
                ? "Active"
                : product.status === "draft"
                  ? "Draft"
                  : product.status || "Active",
            image: product.images?.[0]?.url || "",
          })),
        );
      })
      .finally(() => {
        if (!cancelled) setProductsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [site.id]);

  const activeProducts = ecomProducts.filter(
    (product) => String(product.status).toLowerCase() === "active",
  );

  const selected =
    [globalHeader, ...blocks, globalFooter].find(
      (block) => block?.id === selectedId,
    ) || null;
  const activePage = pages.find((page) => page.id === activePageId) || null;
  const pageBlocks = blocks.filter(
    (block) => block.type !== "Navigation" && block.type !== "Footer",
  );
  const renderedBlocks = [
    ...(globalHeader ? [globalHeader] : []),
    ...pageBlocks,
    ...(globalFooter ? [globalFooter] : []),
  ];
  const isGlobalSelected =
    selected?.id === globalHeader?.id || selected?.id === globalFooter?.id;

  useEffect(() => {
    const load = async () => {
      setLoaded(false);
      const { data: pageRows } = await supabase
        .from("pages")
        .select("id, name, slug")
        .eq("site_id", site.id)
        .order("position");
      let nextPages = (pageRows || []) as Page[];
      if (nextPages.length === 0) {
        const { data: created } = await supabase
          .from("pages")
          .insert({
            site_id: site.id,
            name: "Home",
            slug: "home",
            position: 0,
            seo_title: site.business_name,
            seo_desc: `Welcome to ${site.business_name}.`,
          })
          .select("id, name, slug")
          .single();
        if (created) nextPages = [created as Page];
      }
      setPages(nextPages);
      const page = nextPages[0];
      if (!page) {
        setLoaded(true);
        return;
      }
      setActivePageId(page.id);
      const { data: blockRows } = await supabase
        .from("blocks")
        .select("*")
        .eq("page_id", page.id)
        .order("position");
      const loadedBlocks = (blockRows || []).map(fromRow);
      const legacyHeader =
        loadedBlocks.find((block) => block.type === "Navigation") || null;
      const legacyFooter =
        loadedBlocks.find((block) => block.type === "Footer") || null;
      let nextHeader =
        fromThemeBlock(site.theme?.globalHeader) ||
        legacyHeader ||
        createGlobalHeader(site);
      let nextFooter =
        fromThemeBlock(site.theme?.globalFooter) ||
        legacyFooter ||
        createGlobalFooter(site);
      const conversionPage =
        nextPages.find((candidate) =>
          /book|appointment|contact|enquir/i.test(
            `${candidate.name} ${candidate.slug}`,
          ),
        ) || null;
      if (!nextHeader.links?.length) {
        nextHeader = {
          ...nextHeader,
          links: nextPages.map((candidate) => ({
            id: crypto.randomUUID(),
            label: candidate.name,
            url: candidate.slug,
          })),
        };
      }
      if (
        conversionPage &&
        (!nextHeader.btnActionType || nextHeader.btnActionType === "booking")
      ) {
        nextHeader = {
          ...nextHeader,
          btnActionType: "link",
          btnActionValue: conversionPage.slug,
        };
      }
      if (
        conversionPage &&
        (!nextFooter.btnActionType || nextFooter.btnActionType === "booking")
      ) {
        nextFooter = {
          ...nextFooter,
          btnActionType: "link",
          btnActionValue: conversionPage.slug,
        };
      }
      const nextBlocks = loadedBlocks.filter(
        (block) => block.type !== "Navigation" && block.type !== "Footer",
      );
      setGlobalHeader(nextHeader);
      setGlobalFooter(nextFooter);
      setBlocks(nextBlocks);
      setSelectedId(nextBlocks[0]?.id || nextHeader.id);
      setLoaded(true);
    };
    load();
  }, [site.id]);

  const persistPageBlocks = async (
    pageId: string,
    nextBlocks: WebBlock[],
  ) => {
    const localBlocks = nextBlocks.filter(
      (block) => block.type !== "Navigation" && block.type !== "Footer",
    );
    await supabase.from("blocks").delete().eq("page_id", pageId);
    if (localBlocks.length) {
      await supabase.from("blocks").insert(
        localBlocks.map((block, position) => ({
          id: block.id,
          page_id: pageId,
          type: block.type,
          position,
          config: { ...block, id: undefined },
        })),
      );
    }
  };

  useEffect(() => {
    if (!loaded || !activePageId) return;
    const timer = window.setTimeout(async () => {
      setSaving(true);
      await persistPageBlocks(activePageId, blocks);
      setSaving(false);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [blocks, activePageId, loaded]);

  useEffect(() => {
    if (!loaded || !globalHeader || !globalFooter) return;
    const timer = window.setTimeout(async () => {
      setSaving(true);
      const nextTheme = {
        ...(site.theme || {}),
        globalHeader,
        globalFooter,
      };
      await supabase
        .from("sites")
        .update({ theme: nextTheme })
        .eq("id", site.id);
      onUpdateSite?.({ ...site, theme: nextTheme });
      setSaving(false);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [globalHeader, globalFooter, loaded]);

  const switchPage = async (pageId: string) => {
    if (pageId === activePageId || !pageId) return;
    setSaving(true);
    if (activePageId) {
      await persistPageBlocks(activePageId, blocks);
    }
    const { data: blockRows } = await supabase
      .from("blocks")
      .select("*")
      .eq("page_id", pageId)
      .order("position");
    const nextBlocks = (blockRows || [])
      .map(fromRow)
      .filter(
        (block) => block.type !== "Navigation" && block.type !== "Footer",
      );
    setActivePageId(pageId);
    setBlocks(nextBlocks);
    setSelectedId(nextBlocks[0]?.id || globalHeader?.id || null);
    setSaving(false);
  };

  const navigateToPage = (slug: string) => {
    const target = pages.find(
      (page) => page.slug === slug.replace(/^\//, "") || page.id === slug,
    );
    if (target) {
      switchPage(target.id);
      setPreviewOpen(false);
    }
  };

  useEffect(() => {
    const openCommand = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", openCommand);
    return () => window.removeEventListener("keydown", openCommand);
  }, []);

  const updateSelected = (patch: Partial<WebBlock>) => {
    if (!selected) return;
    if (selected.id === globalHeader?.id) {
      setGlobalHeader((current) =>
        current ? ({ ...current, ...patch } as WebBlock) : current,
      );
      return;
    }
    if (selected.id === globalFooter?.id) {
      setGlobalFooter((current) =>
        current ? ({ ...current, ...patch } as WebBlock) : current,
      );
      return;
    }
    setBlocks((current) =>
      current.map((block) =>
        block.id === selected.id ? { ...block, ...patch } : block,
      ),
    );
  };
  const updateStyle = (patch: Partial<BlockCSSStyles>) =>
    updateSelected({
      styles: { ...selected?.styles, ...patch } as BlockCSSStyles,
    });
  const addBlock = (
    type: string,
    variant = BLOCK_VARIANTS_MAP[type]?.[0]?.id || "minimal",
  ) => {
    const block = createBlock(type, variant);
    setBlocks((current) => [...current, block]);
    setSelectedId(block.id);
    setCommandOpen(false);
  };
  const duplicate = () => {
    if (!selected || isGlobalSelected) return;
    const next = { ...structuredClone(selected), id: crypto.randomUUID() };
    setBlocks((current) => {
      const at = current.findIndex((block) => block.id === selected.id);
      return [...current.slice(0, at + 1), next, ...current.slice(at + 1)];
    });
    setSelectedId(next.id);
  };
  const remove = () => {
    if (!selected || isGlobalSelected) return;
    setBlocks((current) => current.filter((block) => block.id !== selected.id));
    setSelectedId(blocks.find((block) => block.id !== selected.id)?.id || null);
  };
  const replaceVariant = (variant: string) => {
    if (!selected) return;
    const previousPatch = variantStylePatches[selected?.variant || ""] || {};
    const preservedStyles = Object.fromEntries(
      Object.entries(selected?.styles || {}).filter(
        ([key]) => !(key in previousPatch),
      ),
    ) as Partial<BlockCSSStyles>;
    updateSelected(ensureStructuredContent({
      ...selected,
      variant,
      styles: {
        ...preservedStyles,
        ...(variantStylePatches[variant] || {}),
      } as BlockCSSStyles,
    }));
  };
  const maxWidth =
    viewport === "mobile" ? "390px" : viewport === "tablet" ? "760px" : "100%";
  const actionCapable = Boolean(
    selected &&
      (selected.btnText !== undefined ||
        ["Hero", "Business", "Pricing", "CTA", "Navigation"].includes(
          selected.type,
        )),
  );

  const commands = useMemo(
    () => [
      ...BLOCK_CATEGORIES.filter(
        (category) => category.id !== "Navigation" && category.id !== "Footer",
      ).map((category) => ({
        label: `Add ${category.name}`,
        keywords: `${category.id} ${category.description}`,
        action: () => addBlock(category.id),
      })),
      {
        label: "Open page settings",
        keywords: "seo domain page",
        action: () => {},
      },
      {
        label: "Preview website",
        keywords: "view live preview",
        action: () => setPreviewOpen(true),
      },
    ],
    [blocks],
  );

  return (
    <div className="h-screen overflow-hidden bg-[#f3f5f4] text-[#1c2521]">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <button
            onClick={onExit}
            className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={17} />
          </button>
          <span className="hidden h-5 w-px bg-slate-200 sm:block" />
          <div className="min-w-0">
            <p className="truncate text-sm font-black tracking-[-0.03em]">
              {site.business_name}
            </p>
            <p className="hidden text-[10px] font-semibold text-slate-400 sm:block">
              Visual Builder
            </p>
          </div>
          <span className="hidden rounded-md bg-lime-100 px-2 py-1 text-[10px] font-black text-lime-800 md:block">
            {saving ? "SAVING" : "SAVED"}
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          {(
            [
              { id: "desktop", icon: Monitor },
              { id: "tablet", icon: Tablet },
              { id: "mobile", icon: Smartphone },
            ] as const
          ).map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setViewport(id)}
              className={`grid size-7 place-items-center rounded-md ${viewport === id ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-700"}`}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCommandOpen(true)}
            className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:border-slate-300 sm:flex"
          >
            <CommandIcon size={14} /> Add{" "}
            <kbd className="rounded border border-slate-200 px-1 text-[9px] text-slate-400">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={() => setPreviewOpen(true)}
            className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            aria-label="Preview"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={async () => {
              setSaving(true);
              if (activePageId) {
                await persistPageBlocks(activePageId, blocks);
              }
              const nextTheme = {
                ...(site.theme || {}),
                globalHeader,
                globalFooter,
              };
              const { data } = await supabase
                .from("sites")
                .update({ published: true, theme: nextTheme })
                .eq("id", site.id)
                .select()
                .single();
              onUpdateSite?.(
                (data as SiteRecord) || {
                  ...site,
                  published: true,
                  theme: nextTheme,
                },
              );
              setSaving(false);
            }}
            className="rounded-lg bg-[#1c2521] px-3 py-2 text-xs font-black text-white hover:bg-[#354139]"
          >
            Publish
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        <aside className="relative hidden w-[250px] shrink-0 overflow-hidden border-r border-slate-200 bg-white lg:block">
          <div className="border-b border-slate-100 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
              Page
            </p>
            <div className="relative mt-2">
              <select
                value={activePageId || ""}
                onChange={(event) => switchPage(event.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-left text-xs font-bold outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-100"
              >
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
          <div className="h-[calc(100%-154px)] overflow-y-auto p-3 pb-20">
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Site-wide
                </p>
                <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                  <LockKeyhole size={10} /> Every page
                </span>
              </div>
              {[globalHeader, globalFooter].filter(Boolean).map((block) => (
                <button
                  key={block!.id}
                  onClick={() => setSelectedId(block!.id)}
                  className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${selectedId === block!.id ? "bg-lime-100 text-lime-950" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <span className="grid size-6 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 shadow-sm">
                    {block!.type === "Navigation" ? (
                      <LayoutPanelTop size={13} />
                    ) : (
                      <ArrowDownToLine size={13} />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold">
                      {block!.type === "Navigation"
                        ? "Global header"
                        : "Global footer"}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Shared across {pages.length || 1} page
                      {pages.length === 1 ? "" : "s"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                {activePage?.name || "Page"} sections
              </p>
              <button
                onClick={() => setCommandOpen(true)}
                className="text-lime-700"
              >
                <Plus size={15} />
              </button>
            </div>
            {pageBlocks.map((block, index) => (
              <button
                key={block.id}
                onClick={() => setSelectedId(block.id)}
                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${selectedId === block.id ? "bg-lime-100 text-lime-950" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <span className="grid size-5 place-items-center rounded bg-white text-[9px] font-black shadow-sm">
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-bold">
                    {block.title || block.type}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {block.type}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div className="absolute bottom-0 w-[250px] border-t border-slate-100 bg-white p-3">
            <button
              onClick={() => setCommandOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-xs font-bold text-slate-600 hover:border-lime-500 hover:text-lime-700"
            >
              <Plus size={14} /> Add section
            </button>
          </div>
        </aside>

        <main className="relative flex min-w-0 flex-1 flex-col overflow-auto bg-[radial-gradient(#cbd5d0_1px,transparent_1px)] [background-size:18px_18px]">
          <div className="sticky top-0 z-10 flex items-center justify-between bg-[#f3f5f4]/80 px-4 py-3 backdrop-blur">
            <span className="rounded-md bg-white px-2 py-1 text-[10px] font-bold text-slate-500 shadow-sm">
              {viewport === "desktop"
                ? "Responsive desktop"
                : `${viewport === "tablet" ? "760" : "390"}px preview`}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              Click any section to edit
            </span>
          </div>
          <div className="mx-auto w-full px-4 pb-20" style={{ maxWidth }}>
            <div
              className={`overflow-hidden bg-white shadow-[0_20px_60px_rgba(28,37,33,0.12)] ${viewport === "mobile" ? "rounded-[28px] border-[8px] border-slate-950" : "rounded-xl border border-slate-200"}`}
            >
              {globalHeader && (
                <motion.div
                  key={globalHeader.id}
                  id={globalHeader.id}
                  data-block-type="Navigation"
                  layout
                  onClick={() => setSelectedId(globalHeader.id)}
                  className={`group relative cursor-pointer transition ${selectedId === globalHeader.id ? "z-[1] ring-2 ring-inset ring-lime-500" : "hover:ring-2 hover:ring-inset hover:ring-lime-300/70"}`}
                >
                  <BuilderRenderer
                    block={globalHeader}
                    isActive={selectedId === globalHeader.id}
                    onSelect={() => setSelectedId(globalHeader.id)}
                    selectedSubElement={selectedId === globalHeader.id ? selectedSubElement : null}
                    onSelectSubElement={(subId) => {
                      setSelectedId(globalHeader.id);
                      setSelectedSubElement(subId);
                    }}
                    site={site}
                    siteId={site.id}
                    pages={pages}
                    activePageId={activePageId}
                    onNavigatePage={navigateToPage}
                    ecomProducts={activeProducts}
                  />
                  <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-[#1c2521] px-2 py-1 text-[10px] font-black text-white opacity-0 shadow transition group-hover:opacity-100">
                    Global header · every page
                  </div>
                </motion.div>
              )}
              {pageBlocks.length === 0 ? (
                <div className="grid min-h-[480px] place-items-center p-8 text-center">
                  <div>
                    <LayoutPanelTop
                      className="mx-auto text-slate-300"
                      size={32}
                    />
                    <h2 className="mt-4 text-lg font-black">
                      Start with a useful section
                    </h2>
                    <p className="mt-2 max-w-xs text-sm text-slate-500">
                      Add a hero, booking form, services, or pricing from the
                      command menu.
                    </p>
                    <button
                      onClick={() => setCommandOpen(true)}
                      className="mt-5 rounded-lg bg-[#1c2521] px-4 py-2.5 text-xs font-black text-white"
                    >
                      Add your first section
                    </button>
                  </div>
                </div>
              ) : (
                pageBlocks.map((block) => (
                  <motion.div
                    key={block.id}
                    id={block.id}
                    data-block-type={block.type}
                    layout
                    onClick={() => setSelectedId(block.id)}
                    className={`group relative cursor-pointer transition ${selectedId === block.id ? "z-[1] ring-2 ring-inset ring-lime-500" : "hover:ring-2 hover:ring-inset hover:ring-lime-300/70"}`}
                  >
                    <BuilderRenderer
                      block={block}
                      isActive={selectedId === block.id}
                      onSelect={() => setSelectedId(block.id)}
                      selectedSubElement={selectedId === block.id ? selectedSubElement : null}
                      onSelectSubElement={(subId) => {
                        setSelectedId(block.id);
                        setSelectedSubElement(subId);
                      }}
                      site={site}
                      siteId={site.id}
                      pages={pages}
                      activePageId={activePageId}
                      onNavigatePage={navigateToPage}
                      ecomProducts={activeProducts}
                    />
                    <div
                      className={`pointer-events-none absolute left-3 top-3 rounded-md bg-[#1c2521] px-2 py-1 text-[10px] font-black text-white shadow transition ${selectedId === block.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    >
                      {block.type}
                    </div>
                  </motion.div>
                ))
              )}
              {globalFooter && (
                <motion.div
                  key={globalFooter.id}
                  id={globalFooter.id}
                  data-block-type="Footer"
                  layout
                  onClick={() => setSelectedId(globalFooter.id)}
                  className={`group relative cursor-pointer transition ${selectedId === globalFooter.id ? "z-[1] ring-2 ring-inset ring-lime-500" : "hover:ring-2 hover:ring-inset hover:ring-lime-300/70"}`}
                >
                  <BuilderRenderer
                    block={globalFooter}
                    isActive={selectedId === globalFooter.id}
                    onSelect={() => setSelectedId(globalFooter.id)}
                    selectedSubElement={selectedId === globalFooter.id ? selectedSubElement : null}
                    onSelectSubElement={(subId) => {
                      setSelectedId(globalFooter.id);
                      setSelectedSubElement(subId);
                    }}
                    site={site}
                    siteId={site.id}
                    pages={pages}
                    activePageId={activePageId}
                    onNavigatePage={navigateToPage}
                    ecomProducts={activeProducts}
                  />
                  <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-[#1c2521] px-2 py-1 text-[10px] font-black text-white opacity-0 shadow transition group-hover:opacity-100">
                    Global footer · every page
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </main>

        <aside className="hidden w-[360px] shrink-0 border-l border-slate-200 bg-white xl:block">
          {selected ? (
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Editing section
                  </p>
                  <p className="mt-1 text-sm font-black">{selected.type}</p>
                </div>
                {isGlobalSelected ? (
                  <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-black text-slate-500">
                    <LockKeyhole size={12} /> Every page
                  </span>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={duplicate}
                      className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
                      title="Duplicate"
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      onClick={remove}
                      className="rounded-md p-2 text-rose-500 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
              <Tabs.Root
                defaultValue="content"
                className="flex min-h-0 flex-1 flex-col"
              >
                <Tabs.List className="grid grid-cols-3 border-b border-slate-100 px-3 pt-2">
                  <Tabs.Trigger
                    value="content"
                    className="border-b-2 border-transparent px-2 py-2.5 text-[11px] font-black text-slate-400 data-[state=active]:border-lime-600 data-[state=active]:text-slate-900"
                  >
                    Content
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="design"
                    className="border-b-2 border-transparent px-2 py-2.5 text-[11px] font-black text-slate-400 data-[state=active]:border-lime-600 data-[state=active]:text-slate-900"
                  >
                    Style
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="effects"
                    className="border-b-2 border-transparent px-2 py-2.5 text-[11px] font-black text-slate-400 data-[state=active]:border-lime-600 data-[state=active]:text-slate-900"
                  >
                    Effects
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content
                  value="content"
                  className="min-h-0 flex-1 overflow-y-auto p-4"
                >
                  <Field
                    label="Eyebrow"
                    value={selected.badge || ""}
                    onChange={(value) => updateSelected({ badge: value })}
                  />
                  <Field
                    label="Heading"
                    value={selected.title || ""}
                    onChange={(value) => updateSelected({ title: value })}
                    multiline
                  />
                  <Field
                    label="Supporting copy"
                    value={selected.subtitle || ""}
                    onChange={(value) => updateSelected({ subtitle: value })}
                    multiline
                  />
                  <Field
                    label="Button label"
                    value={selected.btnText || ""}
                    onChange={(value) => updateSelected({ btnText: value })}
                  />
                  {actionCapable && (
                    <ActionPanel
                      block={selected}
                      pages={pages}
                      sections={pageBlocks}
                      site={site}
                      onChange={updateSelected}
                    />
                  )}
                  {(selected.type === "Forms" ||
                    selected.type === "Contact") && (
                    <LeadRoutingPanel
                      block={selected}
                      onChange={updateSelected}
                    />
                  )}
                  {selected.type !== "Gallery" && (
                    <Field
                      label={
                        selected.type === "Navigation"
                          ? "Logo image URL"
                          : "Primary image URL"
                      }
                      value={selected.imageUrl || ""}
                      onChange={(value) => updateSelected({ imageUrl: value })}
                    />
                  )}
                  <div className="mt-5">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Layout variant
                    </p>
                    <VariantPicker
                      type={selected.type}
                      value={selected.variant || ""}
                      onChange={replaceVariant}
                    />
                  </div>
                  <BuilderDataConnections
                    block={selected}
                    site={site}
                    products={ecomProducts}
                    productsLoading={productsLoading}
                    onChange={updateSelected}
                    onNavigateModule={onNavigateModule}
                  />
                  <BlockContentEditor
                    block={selected}
                    selectedSubElement={selectedSubElement}
                    onChange={updateSelected}
                  />
                </Tabs.Content>
                <Tabs.Content
                  value="design"
                  className="min-h-0 flex-1 overflow-y-auto"
                >
                  <StylePanel
                    styles={selected.styles}
                    onChange={updateStyle}
                  />
                </Tabs.Content>
                <Tabs.Content
                  value="effects"
                  className="min-h-0 flex-1 overflow-y-auto p-4"
                >
                  <p className="text-xs leading-5 text-slate-500">
                    Use interaction sparingly: it should make an action clearer,
                    not compete with your customer’s decision.
                  </p>
                  <div className="mt-5">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Hover interaction
                    </p>
                    <select
                      value={selected.styles.hoverEffect || "none"}
                      onChange={(event) =>
                        updateStyle({ hoverEffect: event.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-bold outline-none"
                    >
                      <option value="none">None</option>
                      <option value="lift">Lift</option>
                      <option value="glow">Soft glow</option>
                      <option value="scale">Gentle scale</option>
                      <option value="tilt">Pointer tilt</option>
                    </select>
                  </div>
                  <div className="mt-5">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      On-click feedback
                    </p>
                    <select
                      value={selected.styles.clickResponse || "none"}
                      onChange={(event) =>
                        updateStyle({ clickResponse: event.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-bold outline-none"
                    >
                      <option value="none">None</option>
                      <option value="scale-down">Press</option>
                      <option value="bounce">Bounce</option>
                      <option value="pulse">Pulse</option>
                    </select>
                  </div>
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <button className="mt-5 flex w-full items-center justify-between rounded-lg bg-lime-100 px-3 py-3 text-left text-xs font-black text-lime-950">
                        <span className="flex items-center gap-2">
                          <WandSparkles size={14} /> Interaction guidance
                        </span>
                        <MoreHorizontal size={14} />
                      </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
                        side="top"
                        sideOffset={8}
                        className="z-[90] w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl"
                      >
                        <p className="text-xs font-black">
                          Use an effect only when it helps.
                        </p>
                        <p className="mt-2 text-[11px] leading-5 text-slate-500">
                          Lift works well for service cards. Keep booking and
                          payment actions calm so they feel trustworthy.
                        </p>
                        <Popover.Arrow className="fill-white" />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </Tabs.Content>
              </Tabs.Root>
            </div>
          ) : (
            <div className="grid h-full place-items-center p-8 text-center">
              <MousePointer2 className="text-slate-300" />
              <p className="mt-3 text-sm font-black">Select a section</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Its real content, styling and interactions will appear here.
              </p>
            </div>
          )}
        </aside>
      </div>

      <Command.Dialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
        label="Add or change a website section"
        className="fixed inset-0 z-[100] bg-slate-950/45 p-4 pt-[12vh] backdrop-blur-sm"
      >
        <Command className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4">
            <CommandIcon size={17} className="text-lime-700" />
            <Command.Input
              autoFocus
              placeholder="Add booking, pricing, services…"
              className="h-14 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-slate-400"
            />
          </div>
          <Command.List className="max-h-[380px] overflow-y-auto p-2">
            <Command.Empty className="p-6 text-center text-sm text-slate-400">
              No matching section.
            </Command.Empty>
            {commands.map((command) => (
              <Command.Item
                key={command.label}
                value={`${command.label} ${command.keywords}`}
                onSelect={command.action}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 data-[selected=true]:bg-lime-100"
              >
                <span>
                  <span className="block text-sm font-black">
                    {command.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-medium text-slate-500">
                    {command.keywords}
                  </span>
                </span>
                <Plus size={15} className="text-lime-700" />
              </Command.Item>
            ))}
          </Command.List>
          <div className="border-t border-slate-100 px-4 py-3 text-[10px] font-medium text-slate-400">
            Add a section, then edit its actual content from the right panel.
          </div>
        </Command>
      </Command.Dialog>

      {previewOpen && (
        <div className="fixed inset-0 z-[95] overflow-auto bg-slate-950/75 p-4">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-3">
              <span className="text-xs font-black">
                Preview — {site.business_name}
              </span>
              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-md px-3 py-1.5 text-xs font-bold hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            {renderedBlocks.map((block) => (
              <div
                key={block.id}
                id={block.id}
                data-block-type={block.type}
              >
                <BuilderRenderer
                  block={block}
                  isActive={false}
                  onSelect={() => {}}
                  site={site}
                  siteId={site.id}
                  pages={pages}
                  activePageId={activePageId}
                  onNavigatePage={navigateToPage}
                  ecomProducts={activeProducts}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="mt-4 block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-20 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-xs leading-5 outline-none focus:border-lime-600"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-medium outline-none focus:border-lime-600"
        />
      )}
    </label>
  );
}

function ActionPanel({
  block,
  pages,
  sections,
  site,
  onChange,
}: {
  block: WebBlock;
  pages: Page[];
  sections: WebBlock[];
  site: SiteRecord;
  onChange: (patch: Partial<WebBlock>) => void;
}) {
  const actionType = block.btnActionType || "none";
  const actions = [
    { id: "booking", label: "Booking", icon: FormInput },
    { id: "scroll", label: "Section", icon: ArrowDownToLine },
    { id: "link", label: "Page", icon: Layers3 },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { id: "external", label: "Website", icon: ExternalLink },
    { id: "phone", label: "Call", icon: Link2 },
  ];

  const setAction = (type: string) =>
    onChange({ btnActionType: type, btnActionValue: "" });

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
            Button destination
          </p>
          <p className="mt-1 text-[11px] leading-4 text-slate-500">
            Choose what happens after a customer clicks.
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-[9px] font-black ${actionType === "none" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
        >
          {actionType === "none" ? "NOT CONNECTED" : "CONNECTED"}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {actions.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setAction(id)}
            className={`flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-xl border text-[10px] font-black transition ${
              actionType === id
                ? "border-lime-500 bg-white text-lime-800 shadow-sm ring-2 ring-lime-100"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {actionType === "none" && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="flex items-center gap-2 text-[10px] font-black text-amber-800">
            <CircleAlert size={13} /> This button currently does nothing
          </p>
          <button
            type="button"
            onClick={() => setAction("booking")}
            className="mt-2 flex items-center gap-1 text-[10px] font-black text-amber-900 underline underline-offset-2"
          >
            Connect it to the booking form <ChevronRight size={12} />
          </button>
        </div>
      )}

      {actionType === "booking" && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-emerald-800">
          <FormInput size={15} className="mt-0.5 shrink-0" />
          <p className="text-[10px] font-semibold leading-4">
            Scrolls to the first booking or enquiry form on the current page.
            This is the recommended action for service cards and header CTAs.
          </p>
        </div>
      )}

      {actionType === "scroll" && (
        <label className="mt-3 block">
          <span className="mb-1.5 block text-[9px] font-black uppercase tracking-wider text-slate-400">
            Target section
          </span>
          <select
            value={block.btnActionValue || ""}
            onChange={(event) =>
              onChange({ btnActionValue: event.target.value })
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold outline-none focus:border-lime-500"
          >
            <option value="">Choose a section…</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.title || section.type}
              </option>
            ))}
          </select>
        </label>
      )}

      {actionType === "link" && (
        <label className="mt-3 block">
          <span className="mb-1.5 block text-[9px] font-black uppercase tracking-wider text-slate-400">
            Destination page
          </span>
          <select
            value={block.btnActionValue || ""}
            onChange={(event) =>
              onChange({ btnActionValue: event.target.value })
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold outline-none focus:border-lime-500"
          >
            <option value="">Choose a page…</option>
            {pages.map((page) => (
              <option key={page.id} value={page.slug}>
                {page.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {["whatsapp", "phone", "external"].includes(actionType) && (
        <label className="mt-3 block">
          <span className="mb-1.5 block text-[9px] font-black uppercase tracking-wider text-slate-400">
            {actionType === "external"
              ? "Website URL"
              : actionType === "phone"
                ? "Phone number"
                : "WhatsApp number"}
          </span>
          <input
            value={block.btnActionValue || ""}
            onChange={(event) =>
              onChange({ btnActionValue: event.target.value })
            }
            placeholder={
              actionType === "external"
                ? "https://example.com"
                : (site.theme?.phone as string) || "+91 98765 43210"
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold outline-none focus:border-lime-500"
          />
          {actionType === "whatsapp" && (
            <span className="mt-1.5 block text-[9px] leading-4 text-slate-400">
              Opens a customer chat. Automated follow-ups still run securely
              through your Evolution API connection.
            </span>
          )}
        </label>
      )}
    </div>
  );
}

function LeadRoutingPanel({
  block,
  onChange,
}: {
  block: WebBlock;
  onChange: (patch: Partial<WebBlock>) => void;
}) {
  const appointment = block.variant === "appointment";
  const newsletter = block.variant === "newsletter";
  const followUpEnabled = (block as any).whatsappFollowUp !== false;
  const capturedFields = appointment
    ? ["Name", "WhatsApp", "Date", "Time"]
    : newsletter
      ? ["Email"]
      : ["Name", "Email", "Phone", "Message"];

  return (
    <div className="mt-5 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-3.5">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-xl bg-indigo-600 text-white">
          <Users size={15} />
        </span>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-indigo-900">
            Where submissions go
          </p>
          <p className="mt-0.5 text-[10px] text-indigo-700/70">
            One submission creates one customer record.
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-white px-3 py-2.5">
          <span className="flex items-center gap-2 text-[10px] font-black text-slate-700">
            <Users size={13} className="text-indigo-600" /> CRM → Leads
          </span>
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-[8px] font-black text-emerald-700">
            ALWAYS
          </span>
        </div>
        {appointment && (
          <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-white px-3 py-2.5">
            <span className="flex items-center gap-2 text-[10px] font-black text-slate-700">
              <FormInput size={13} className="text-indigo-600" /> Operations →
              Bookings
            </span>
            <span className="rounded-full bg-indigo-100 px-2 py-1 text-[8px] font-black text-indigo-700">
              ALSO SAVED
            </span>
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-[9px] font-black uppercase tracking-wider text-indigo-900/50">
          Information collected
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {capturedFields.map((field) => (
            <span
              key={field}
              className="rounded-lg border border-indigo-100 bg-white px-2 py-1 text-[9px] font-bold text-slate-600"
            >
              {field}
            </span>
          ))}
        </div>
      </div>

      <label className="mt-3 flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-indigo-100 bg-white p-3">
        <span>
          <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-700">
            <MessageCircle size={13} className="text-emerald-600" />
            Evolution API follow-up
          </span>
          <span className="mt-1 block text-[9px] leading-4 text-slate-400">
            Queue new leads for your configured WhatsApp automation.
          </span>
        </span>
        <input
          type="checkbox"
          checked={followUpEnabled}
          onChange={(event) =>
            onChange({ whatsappFollowUp: event.target.checked } as any)
          }
          className="mt-0.5 size-4 accent-emerald-600"
        />
      </label>

      <label className="mt-3 block">
        <span className="mb-1.5 block text-[9px] font-black uppercase tracking-wider text-indigo-900/50">
          Success message
        </span>
        <textarea
          value={(block as any).successMessage || ""}
          onChange={(event) =>
            onChange({ successMessage: event.target.value } as any)
          }
          placeholder="Thanks — we’ll contact you shortly."
          className="min-h-16 w-full resize-y rounded-xl border border-indigo-100 bg-white px-3 py-2.5 text-[11px] leading-5 outline-none focus:border-indigo-500"
        />
      </label>
    </div>
  );
}

type BuilderModuleLink = {
  id: string;
  label: string;
  detail: string;
  icon: React.ElementType;
};

function getConnectionLinks(block: WebBlock): BuilderModuleLink[] {
  if (block.type === "Forms" || block.type === "Contact") {
    return [
      {
        id: "forms",
        label: "Forms Center",
        detail: "Fields and submissions",
        icon: FormInput,
      },
      {
        id: "crm",
        label: "Contacts CRM",
        detail: "New leads and follow-ups",
        icon: Users,
      },
      {
        id: "inbox",
        label: "Inbox",
        detail: "Customer conversations",
        icon: Mail,
      },
      {
        id: "whatsapp",
        label: "WhatsApp automation",
        detail: "Evolution API follow-up",
        icon: MessageCircle,
      },
      ...(block.variant === "appointment"
        ? [
            {
              id: "bookings",
              label: "Bookings",
              detail: "Appointments and status",
              icon: FormInput,
            },
          ]
        : []),
    ];
  }
  if (block.type === "EComStore") {
    return [
      {
        id: "store",
        label: "Store & Products",
        detail: "Catalog, stock and orders",
        icon: ShoppingBag,
      },
      {
        id: "analytics",
        label: "Analytics",
        detail: "Traffic and conversions",
        icon: BarChart3,
      },
    ];
  }
  if (block.type === "Testimonials") {
    return [
      {
        id: "reviews",
        label: "Reviews",
        detail: "Requests and approvals",
        icon: Star,
      },
      {
        id: "cms",
        label: "CMS",
        detail: "Connected review records",
        icon: Database,
      },
    ];
  }
  if (
    block.type === "Features" ||
    block.type === "Business" ||
    block.type === "Pricing"
  ) {
    return [
      {
        id: "cms",
        label: "CMS",
        detail: "Edit connected records",
        icon: Database,
      },
      {
        id: "analytics",
        label: "Analytics",
        detail: "Section performance",
        icon: BarChart3,
      },
    ];
  }
  if (block.type === "Navigation" || block.type === "Footer") {
    return [
      {
        id: "pages",
        label: "Pages",
        detail: "Navigation and page structure",
        icon: Layers3,
      },
      {
        id: "seo",
        label: "SEO Manager",
        detail: "Titles and search visibility",
        icon: Globe2,
      },
    ];
  }
  return [
    {
      id: "seo",
      label: "SEO Manager",
      detail: "Search and sharing settings",
      icon: Globe2,
    },
    {
      id: "analytics",
      label: "Analytics",
      detail: "Traffic and conversion data",
      icon: BarChart3,
    },
  ];
}

export function BuilderDataConnections({
  block,
  site,
  products,
  productsLoading,
  onChange,
  onNavigateModule,
}: {
  block: WebBlock;
  site: SiteRecord;
  products: any[];
  productsLoading: boolean;
  onChange: (patch: Partial<WebBlock>) => void;
  onNavigateModule?: (moduleId: string) => void;
}) {
  const collections = (site.theme?.customCollections || []) as any[];
  const cmsBindable = [
    "Features",
    "Business",
    "Pricing",
    "Testimonials",
    "Forms",
    "Contact",
  ].includes(block.type);
  const selectedCollection = collections.find(
    (collection) =>
      String(collection.name).toLowerCase() ===
      String(block.bindCollectionName || "").toLowerCase(),
  );
  const columnNames = (selectedCollection?.columns || [])
    .map((column: any) =>
      typeof column === "string" ? column : column?.name,
    )
    .filter(Boolean) as string[];

  const connectCollection = (name: string) => {
    if (!name) {
      onChange({ bindCollectionName: undefined, bindFields: undefined });
      return;
    }
    const collection = collections.find(
      (candidate) =>
        String(candidate.name).toLowerCase() === name.toLowerCase(),
    );
    const names = (collection?.columns || [])
      .map((column: any) =>
        typeof column === "string" ? column : column?.name,
      )
      .filter(Boolean) as string[];
    const infer = (needles: string[], fallback = "") =>
      names.find((column) =>
        needles.some((needle) => column.toLowerCase().includes(needle)),
      ) || fallback;
    let bindFields: Record<string, string> | undefined;
    if (block.type === "Features" || block.type === "Business") {
      bindFields = {
        title: infer(["title", "name", "service"], names[0] || "title"),
        desc: infer(["desc", "body", "detail"], names[1] || "desc"),
        icon: infer(["icon"], ""),
      };
    } else if (block.type === "Pricing") {
      bindFields = {
        tier: infer(["tier", "plan", "name"], names[0] || "tier"),
        price: infer(["price", "amount", "cost"], names[1] || "price"),
        features: infer(["feature", "include", "benefit"], "features"),
        btnText: infer(["button", "cta"], "btnText"),
        popular: infer(["popular", "featured"], "popular"),
      };
    } else if (block.type === "Testimonials") {
      bindFields = {
        name: infer(["name", "author", "customer"], names[0] || "name"),
        role: infer(["role", "title", "company"], names[1] || "role"),
        content: infer(
          ["content", "review", "body", "text", "description"],
          names[2] || "content",
        ),
        avatar: infer(["avatar", "image", "photo"], ""),
        rating: infer(["rating", "stars"], "rating"),
      };
    }
    onChange({ bindCollectionName: name, bindFields });
  };

  const mappingFields =
    block.type === "Features" || block.type === "Business"
      ? [
          ["title", "Card title"],
          ["desc", "Description"],
          ["icon", "Icon"],
        ]
      : block.type === "Pricing"
        ? [
            ["tier", "Plan name"],
            ["price", "Price"],
            ["features", "Benefits"],
            ["btnText", "Button"],
            ["popular", "Featured"],
          ]
        : block.type === "Testimonials"
          ? [
              ["name", "Customer"],
              ["role", "Role"],
              ["content", "Review"],
              ["avatar", "Photo"],
              ["rating", "Rating"],
            ]
          : [];
  const links = getConnectionLinks(block);
  const activeCount = products.filter(
    (product) => String(product.status).toLowerCase() === "active",
  ).length;

  return (
    <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
      {cmsBindable && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
                <Database size={15} />
              </span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-950">
                  {block.type === "Forms" || block.type === "Contact"
                    ? "Save to CMS"
                    : "Live CMS content"}
                </p>
                <p className="mt-1 text-[9px] leading-4 text-emerald-800/70">
                  {block.type === "Forms" || block.type === "Contact"
                    ? "Optionally copy every submission into a collection."
                    : "Changes in CMS update this section automatically."}
                </p>
              </div>
            </div>
            {block.bindCollectionName && (
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-[8px] font-black text-emerald-700">
                LIVE
              </span>
            )}
          </div>

          <label className="mt-3 block">
            <span className="mb-1.5 block text-[9px] font-black uppercase tracking-wider text-emerald-950/50">
              Collection
            </span>
            <div className="relative">
              <select
                value={block.bindCollectionName || ""}
                onChange={(event) => connectCollection(event.target.value)}
                className="w-full appearance-none rounded-xl border border-emerald-200 bg-white px-3 py-2.5 pr-9 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="">Use content entered here</option>
                {collections.map((collection) => (
                  <option key={collection.name} value={collection.name}>
                    {collection.name} ({collection.rows?.length || 0})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </label>

          {collections.length === 0 && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[9px] leading-4 text-amber-800">
              No collection exists yet. Create one in CMS, then return here to
              connect it.
            </div>
          )}

          {selectedCollection && mappingFields.length > 0 && (
            <div className="mt-3 border-t border-emerald-100 pt-3">
              <p className="mb-2 text-[9px] font-black uppercase tracking-wider text-emerald-950/50">
                Match CMS columns
              </p>
              <div className="grid grid-cols-2 gap-2">
                {mappingFields.map(([field, label]) => (
                  <label key={field} className="block">
                    <span className="mb-1 block text-[8px] font-bold text-slate-500">
                      {label}
                    </span>
                    <select
                      value={block.bindFields?.[field] || ""}
                      onChange={(event) =>
                        onChange({
                          bindFields: {
                            ...(block.bindFields || {}),
                            [field]: event.target.value,
                          },
                        })
                      }
                      className="w-full rounded-lg border border-emerald-100 bg-white px-2 py-2 text-[10px] font-bold text-slate-700 outline-none focus:border-emerald-500"
                    >
                      <option value="">Automatic</option>
                      {columnNames.map((column) => (
                        <option key={column} value={column}>
                          {column}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => onNavigateModule?.("cms")}
            className="mt-3 flex w-full items-center justify-between rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-left text-[10px] font-black text-emerald-800 transition hover:border-emerald-400"
          >
            <span>{collections.length ? "Manage CMS records" : "Create a collection"}</span>
            <ChevronRight size={13} />
          </button>
        </div>
      )}

      {block.type === "EComStore" && (
        <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-3.5">
          <div className="flex items-start gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-violet-600 text-white">
              <ShoppingBag size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-violet-950">
                  Live product catalog
                </p>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[8px] font-black text-emerald-700">
                  SYNCED
                </span>
              </div>
              <p className="mt-1 text-[9px] leading-4 text-violet-800/70">
                {productsLoading
                  ? "Checking your store…"
                  : `${activeCount} active of ${products.length} products will appear on the site.`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateModule?.("store")}
            className="mt-3 flex w-full items-center justify-between rounded-xl border border-violet-200 bg-white px-3 py-2.5 text-left text-[10px] font-black text-violet-800 transition hover:border-violet-400"
          >
            <span>Manage products and orders</span>
            <ChevronRight size={13} />
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
            Connected tools
          </p>
          <span className="text-[8px] font-bold text-slate-400">
            Open dashboard
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {links.map(({ id, label, detail, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => onNavigateModule?.(id)}
              className="group rounded-xl border border-slate-200 bg-white p-2.5 text-left transition hover:border-lime-400 hover:shadow-sm"
            >
              <span className="flex items-center justify-between">
                <Icon size={14} className="text-slate-500 group-hover:text-lime-700" />
                <ExternalLink size={10} className="text-slate-300" />
              </span>
              <span className="mt-2 block text-[10px] font-black text-slate-700">
                {label}
              </span>
              <span className="mt-0.5 block text-[8px] leading-3 text-slate-400">
                {detail}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BlockContentEditor({
  block,
  selectedSubElement,
  onChange,
}: {
  block: WebBlock;
  selectedSubElement?: string | null;
  onChange: (patch: Partial<WebBlock>) => void;
}) {
  const selectedIndex =
    selectedSubElement && selectedSubElement.includes(":")
      ? Number(selectedSubElement.split(":")[1])
      : -1;

  const setItems = (key: keyof WebBlock, items: any[]) =>
    onChange({ [key]: items } as Partial<WebBlock>);
  const updateItem = (
    key: keyof WebBlock,
    items: any[],
    index: number,
    patch: Record<string, unknown>,
  ) =>
    setItems(
      key,
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  const removeItem = (key: keyof WebBlock, items: any[], index: number) =>
    setItems(
      key,
      items.filter((_, itemIndex) => itemIndex !== index),
    );
  const duplicateItem = (key: keyof WebBlock, items: any[], index: number) =>
    setItems(key, [
      ...items.slice(0, index + 1),
      { ...structuredClone(items[index]), id: crypto.randomUUID() },
      ...items.slice(index + 1),
    ]);

  if (block.type === "Gallery") {
    const images = block.galleryImages || [];
    return (
      <InspectorCollection
        icon={ImageIcon}
        title="Gallery images"
        count={images.length}
        addLabel="Add image"
        onAdd={() =>
          setItems("galleryImages", [
            ...images,
            {
              id: crypto.randomUUID(),
              url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=900",
              title: "New gallery image",
              subtitle: "Describe what customers should notice.",
              aspect: "square",
            },
          ])
        }
      >
        {images.map((image, index) => (
          <InspectorItem
            key={image.id}
            index={index}
            label={image.title || `Image ${index + 1}`}
            isSelected={index === selectedIndex}
            onDuplicate={() =>
              duplicateItem("galleryImages", images, index)
            }
            onDelete={() => removeItem("galleryImages", images, index)}
          >
            <div className="mb-3 aspect-[16/10] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {image.url ? (
                <img
                  src={image.url}
                  alt=""
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="grid h-full place-items-center text-slate-300">
                  <ImageIcon size={22} />
                </div>
              )}
            </div>
            <MiniField
              label="Image URL"
              value={image.url}
              onChange={(value) =>
                updateItem("galleryImages", images, index, { url: value })
              }
              placeholder="https://…"
            />
            <MiniField
              label="Title"
              value={image.title}
              onChange={(value) =>
                updateItem("galleryImages", images, index, { title: value })
              }
            />
            <MiniField
              label="Caption"
              value={image.subtitle}
              onChange={(value) =>
                updateItem("galleryImages", images, index, {
                  subtitle: value,
                })
              }
              multiline
            />
            <label className="mt-3 block">
              <span className="mb-1.5 block text-[9px] font-black uppercase tracking-wider text-slate-400">
                Image shape
              </span>
              <select
                value={image.aspect || "square"}
                onChange={(event) =>
                  updateItem("galleryImages", images, index, {
                    aspect: event.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-bold outline-none focus:border-lime-500"
              >
                <option value="square">Square</option>
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
              </select>
            </label>
          </InspectorItem>
        ))}
      </InspectorCollection>
    );
  }

  if (
    block.type === "Features" ||
    block.type === "Business" ||
    Boolean(block.features)
  ) {
    const items = block.features || [];
    return (
      <InspectorCollection
        icon={ListOrdered}
        title={block.type === "Business" ? "Services" : "Feature cards"}
        count={items.length}
        addLabel={block.type === "Business" ? "Add service" : "Add card"}
        onAdd={() =>
          setItems("features", [
            ...items,
            {
              id: crypto.randomUUID(),
              title: "New item",
              desc: "Describe the customer outcome clearly.",
              icon: "Sparkles",
            },
          ])
        }
      >
        {items.map((item, index) => (
          <InspectorItem
            key={item.id}
            index={index}
            label={item.title}
            isSelected={index === selectedIndex}
            onDuplicate={() => duplicateItem("features", items, index)}
            onDelete={() => removeItem("features", items, index)}
          >
            <MiniField
              label="Title"
              value={item.title}
              onChange={(value) =>
                updateItem("features", items, index, { title: value })
              }
            />
            <MiniField
              label="Description"
              value={item.desc}
              onChange={(value) =>
                updateItem("features", items, index, { desc: value })
              }
              multiline
            />
            <MiniField
              label="Icon name"
              value={item.icon || ""}
              onChange={(value) =>
                updateItem("features", items, index, { icon: value })
              }
              placeholder="Sparkles, Heart, Check…"
            />
          </InspectorItem>
        ))}
      </InspectorCollection>
    );
  }

  if (block.type === "Pricing" || Boolean(block.pricing)) {
    const items = block.pricing || [];
    return (
      <InspectorCollection
        icon={BarChart3}
        title="Pricing plans"
        count={items.length}
        addLabel="Add plan"
        onAdd={() =>
          setItems("pricing", [
            ...items,
            {
              id: crypto.randomUUID(),
              tier: "New plan",
              price: "₹999",
              features: ["First benefit", "Second benefit"],
              btnText: "Choose plan",
              popular: false,
            },
          ])
        }
      >
        {items.map((item, index) => (
          <InspectorItem
            key={item.id}
            index={index}
            label={item.tier}
            isSelected={index === selectedIndex}
            onDuplicate={() => duplicateItem("pricing", items, index)}
            onDelete={() => removeItem("pricing", items, index)}
          >
            <div className="grid grid-cols-2 gap-2">
              <MiniField
                label="Plan name"
                value={item.tier}
                onChange={(value) =>
                  updateItem("pricing", items, index, { tier: value })
                }
              />
              <MiniField
                label="Price"
                value={item.price}
                onChange={(value) =>
                  updateItem("pricing", items, index, { price: value })
                }
              />
            </div>
            <MiniField
              label="Included items"
              value={(item.features || []).join("\n")}
              onChange={(value) =>
                updateItem("pricing", items, index, {
                  features: value
                    .split("\n")
                    .map((entry) => entry.trim())
                    .filter(Boolean),
                })
              }
              placeholder="One benefit per line"
              multiline
            />
            <MiniField
              label="Plan button"
              value={item.btnText}
              onChange={(value) =>
                updateItem("pricing", items, index, { btnText: value })
              }
            />
            <label className="mt-3 flex items-center gap-2 text-[10px] font-bold text-slate-600">
              <input
                type="checkbox"
                checked={Boolean(item.popular)}
                onChange={(event) =>
                  updateItem("pricing", items, index, {
                    popular: event.target.checked,
                  })
                }
                className="size-4 accent-lime-600"
              />
              Highlight as recommended
            </label>
          </InspectorItem>
        ))}
      </InspectorCollection>
    );
  }

  if (block.type === "Testimonials" || Boolean(block.testimonials)) {
    const items = block.testimonials || [];
    return (
      <InspectorCollection
        icon={Star}
        title="Customer reviews"
        count={items.length}
        addLabel="Add review"
        onAdd={() =>
          setItems("testimonials", [
            ...items,
            {
              id: crypto.randomUUID(),
              name: "Customer name",
              role: "Verified customer",
              content: "Add a genuine customer review here.",
              avatar:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
              rating: 5,
            },
          ])
        }
      >
        {items.map((item, index) => (
          <InspectorItem
            key={item.id}
            index={index}
            label={item.name}
            onDuplicate={() => duplicateItem("testimonials", items, index)}
            onDelete={() => removeItem("testimonials", items, index)}
          >
            <div className="grid grid-cols-2 gap-2">
              <MiniField
                label="Customer"
                value={item.name}
                onChange={(value) =>
                  updateItem("testimonials", items, index, { name: value })
                }
              />
              <MiniField
                label="Role"
                value={item.role}
                onChange={(value) =>
                  updateItem("testimonials", items, index, { role: value })
                }
              />
            </div>
            <MiniField
              label="Review"
              value={item.content}
              onChange={(value) =>
                updateItem("testimonials", items, index, { content: value })
              }
              multiline
            />
            <MiniField
              label="Avatar URL"
              value={item.avatar}
              onChange={(value) =>
                updateItem("testimonials", items, index, { avatar: value })
              }
            />
            <label className="mt-3 block">
              <span className="mb-1.5 block text-[9px] font-black uppercase tracking-wider text-slate-400">
                Rating
              </span>
              <select
                value={item.rating}
                onChange={(event) =>
                  updateItem("testimonials", items, index, {
                    rating: Number(event.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-bold outline-none"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} star{rating === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            </label>
          </InspectorItem>
        ))}
      </InspectorCollection>
    );
  }

  if (
    block.type === "Special" &&
    specialContentMode(block.variant) === "stats"
  ) {
    const items = block.stats || [];
    return (
      <InspectorCollection
        icon={BarChart3}
        title="Statistics"
        count={items.length}
        addLabel="Add statistic"
        onAdd={() =>
          setItems("stats", [
            ...items,
            {
              id: crypto.randomUUID(),
              label: "New statistic",
              val: 100,
              suffix: "+",
            },
          ])
        }
      >
        {items.map((item, index) => (
          <InspectorItem
            key={item.id}
            index={index}
            label={item.label}
            onDuplicate={() => duplicateItem("stats", items, index)}
            onDelete={() => removeItem("stats", items, index)}
          >
            <MiniField
              label="Label"
              value={item.label}
              onChange={(value) =>
                updateItem("stats", items, index, { label: value })
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <MiniField
                label="Number"
                value={String(item.val)}
                onChange={(value) =>
                  updateItem("stats", items, index, {
                    val: Number(value) || 0,
                  })
                }
              />
              <MiniField
                label="Suffix"
                value={item.suffix}
                onChange={(value) =>
                  updateItem("stats", items, index, { suffix: value })
                }
                placeholder="+, %, /5"
              />
            </div>
          </InspectorItem>
        ))}
      </InspectorCollection>
    );
  }

  if (
    block.type === "Special" &&
    specialContentMode(block.variant) === "steps"
  ) {
    const items = block.steps || [];
    return (
      <InspectorCollection
        icon={ListOrdered}
        title="Process steps"
        count={items.length}
        addLabel="Add step"
        onAdd={() =>
          setItems("steps", [
            ...items,
            {
              id: crypto.randomUUID(),
              step: String(items.length + 1).padStart(2, "0"),
              title: "New step",
              desc: "Explain what happens at this stage.",
            },
          ])
        }
      >
        {items.map((item, index) => (
          <InspectorItem
            key={item.id}
            index={index}
            label={item.title}
            onDuplicate={() => duplicateItem("steps", items, index)}
            onDelete={() => removeItem("steps", items, index)}
          >
            <MiniField
              label="Step number"
              value={item.step}
              onChange={(value) =>
                updateItem("steps", items, index, { step: value })
              }
            />
            <MiniField
              label="Title"
              value={item.title}
              onChange={(value) =>
                updateItem("steps", items, index, { title: value })
              }
            />
            <MiniField
              label="Description"
              value={item.desc}
              onChange={(value) =>
                updateItem("steps", items, index, { desc: value })
              }
              multiline
            />
          </InspectorItem>
        ))}
      </InspectorCollection>
    );
  }

  if (block.type === "Special") {
    const items = block.faqs || [];
    return (
      <InspectorCollection
        icon={HelpCircle}
        title="Questions and answers"
        count={items.length}
        addLabel="Add question"
        onAdd={() =>
          setItems("faqs", [
            ...items,
            {
              id: crypto.randomUUID(),
              q: "New question",
              a: "Write a clear answer.",
            },
          ])
        }
      >
        {items.map((item, index) => (
          <InspectorItem
            key={item.id}
            index={index}
            label={item.q}
            onDuplicate={() => duplicateItem("faqs", items, index)}
            onDelete={() => removeItem("faqs", items, index)}
          >
            <MiniField
              label="Question"
              value={item.q}
              onChange={(value) =>
                updateItem("faqs", items, index, { q: value })
              }
            />
            <MiniField
              label="Answer"
              value={item.a}
              onChange={(value) =>
                updateItem("faqs", items, index, { a: value })
              }
              multiline
            />
          </InspectorItem>
        ))}
      </InspectorCollection>
    );
  }

  if (block.type === "Contact") {
    return (
      <InspectorDetails icon={Mail} title="Contact details">
        <MiniField
          label="Email"
          value={block.contactEmail || ""}
          onChange={(value) => onChange({ contactEmail: value })}
          placeholder="hello@business.in"
        />
        <MiniField
          label="Phone"
          value={block.contactPhone || ""}
          onChange={(value) => onChange({ contactPhone: value })}
          placeholder="+91 98765 43210"
        />
        <MiniField
          label="Address"
          value={block.contactAddress || ""}
          onChange={(value) => onChange({ contactAddress: value })}
          multiline
        />
      </InspectorDetails>
    );
  }

  if (block.type === "Map") {
    return (
      <InspectorDetails icon={MapPin} title="Map location">
        <MiniField
          label="Business address"
          value={block.mapAddress || ""}
          onChange={(value) => onChange({ mapAddress: value })}
          placeholder="Street, area, city, PIN code"
          multiline
        />
        <p className="mt-2 text-[9px] leading-4 text-slate-400">
          The published map searches this exact address. Include a landmark and
          PIN code for better accuracy.
        </p>
      </InspectorDetails>
    );
  }

  if (block.type === "Navigation" || block.type === "Footer") {
    const links = block.links || [];
    return (
      <>
        {block.type === "Footer" && (
          <InspectorDetails icon={Type} title="Footer details">
            <MiniField
              label="Copyright"
              value={block.copyright || ""}
              onChange={(value) => onChange({ copyright: value })}
            />
            <MiniField
              label="Phone"
              value={block.contactPhone || ""}
              onChange={(value) => onChange({ contactPhone: value })}
              placeholder="+91 98765 43210"
            />
            <MiniField
              label="Email"
              value={block.contactEmail || ""}
              onChange={(value) => onChange({ contactEmail: value })}
              placeholder="hello@business.in"
            />
            <MiniField
              label="Address"
              value={block.contactAddress || ""}
              onChange={(value) => onChange({ contactAddress: value })}
            />
          </InspectorDetails>
        )}
        <InspectorCollection
          icon={Link2}
          title={block.type === "Navigation" ? "Navigation links" : "Footer links"}
          count={links.length}
          addLabel="Add link"
          onAdd={() =>
            setItems("links", [
              ...links,
              {
                id: crypto.randomUUID(),
                label: "New link",
                url: "home",
              },
            ])
          }
        >
          {links.map((link, index) => (
            <InspectorItem
              key={link.id}
              index={index}
              label={link.label}
              onDuplicate={() => duplicateItem("links", links, index)}
              onDelete={() => removeItem("links", links, index)}
            >
              <MiniField
                label="Label"
                value={link.label}
                onChange={(value) =>
                  updateItem("links", links, index, { label: value })
                }
              />
              <MiniField
                label="Page slug or URL"
                value={link.url}
                onChange={(value) =>
                  updateItem("links", links, index, { url: value })
                }
                placeholder="services or https://…"
              />
            </InspectorItem>
          ))}
        </InspectorCollection>
      </>
    );
  }

  if (block.type === "EComStore") {
    return (
      <InspectorDetails icon={Phone} title="Store contact">
        <MiniField
          label="WhatsApp number"
          value={block.contactPhone || ""}
          onChange={(value) => onChange({ contactPhone: value })}
          placeholder="919876543210"
        />
        <p className="mt-2 text-[9px] leading-4 text-slate-400">
          Products, prices, inventory, and offers are edited in Store → Product
          catalog. This section controls how that catalog is presented.
        </p>
      </InspectorDetails>
    );
  }

  return null;
}

function InspectorCollection({
  icon: Icon,
  title,
  count,
  addLabel,
  onAdd,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  count: number;
  addLabel: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 border-t border-slate-100 pt-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
            <Icon size={13} /> {title}
          </p>
          <p className="mt-1 text-[9px] text-slate-400">
            {count} item{count === 1 ? "" : "s"} · changes update the canvas
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 rounded-lg bg-lime-100 px-2.5 py-2 text-[10px] font-black text-lime-800 transition hover:bg-lime-200"
        >
          <Plus size={12} /> {addLabel}
        </button>
      </div>
      {count === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center">
          <p className="text-[11px] font-bold text-slate-500">
            No items yet
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="mt-2 text-[10px] font-black text-lime-700"
          >
            Add the first one
          </button>
        </div>
      )}
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InspectorDetails({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">
      <p className="mb-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
        <Icon size={13} /> {title}
      </p>
      {children}
    </div>
  );
}

function InspectorItem({
  index,
  label,
  isSelected = false,
  onDuplicate,
  onDelete,
  children,
}: {
  key?: React.Key;
  index: number;
  label: string;
  isSelected?: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(index === 0 || isSelected);

  useEffect(() => {
    if (isSelected) {
      setOpen(true);
    }
  }, [isSelected]);

  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className={`group overflow-hidden rounded-xl border transition-all ${
        isSelected
          ? "border-lime-500 ring-2 ring-lime-200 bg-white shadow-sm"
          : "border-slate-200 bg-white"
      }`}
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-3">
        <span className={`grid size-5 shrink-0 place-items-center rounded-md text-[9px] font-black ${
          isSelected ? "bg-lime-600 text-white" : "bg-slate-100 text-slate-500"
        }`}>
          {index + 1}
        </span>
        <span className={`min-w-0 flex-1 truncate text-[11px] font-black ${
          isSelected ? "text-lime-950" : "text-slate-700"
        }`}>
          {label || `Item ${index + 1}`}
        </span>
        <ChevronDown
          size={13}
          className="text-slate-400 transition group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-slate-100 p-3">
        {children}
        <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onDuplicate}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2 text-[9px] font-black text-slate-500 hover:bg-slate-50"
          >
            <Copy size={11} /> Duplicate
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-rose-200 px-2 py-2 text-[9px] font-black text-rose-600 hover:bg-rose-50"
          >
            <Trash2 size={11} /> Delete
          </button>
        </div>
      </div>
    </details>
  );
}

function MiniField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const className =
    "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-medium leading-5 outline-none transition focus:border-lime-500 focus:ring-3 focus:ring-lime-100";
  return (
    <label className="mt-3 block first:mt-0">
      <span className="mb-1.5 block text-[9px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`${className} min-h-16 resize-y`}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={className}
        />
      )}
    </label>
  );
}

function VariantPicker({
  type,
  value,
  onChange,
}: {
  type: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const variants = BLOCK_VARIANTS_MAP[type] || [];
  const selectedVariant =
    variants.find((variant) => variant.id === value) || variants[0];
  const previewPalettes = [
    ["#f8fafc", "#0f172a", "#84cc16"],
    ["#18181b", "#fafafa", "#d6b66b"],
    ["#eef2ff", "#312e81", "#8b5cf6"],
    ["#fff7ed", "#431407", "#f97316"],
    ["#ecfeff", "#164e63", "#06b6d4"],
    ["#fdf4ff", "#701a75", "#d946ef"],
  ];
  const selectedIndex = Math.max(
    0,
    variants.findIndex((variant) => variant.id === selectedVariant?.id),
  );
  const selectedPalette =
    previewPalettes[selectedIndex % previewPalettes.length];

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 text-left transition hover:border-slate-300 hover:shadow-sm data-[state=open]:border-lime-500 data-[state=open]:ring-2 data-[state=open]:ring-lime-100"
        >
          <span
            className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-black/10"
            style={{ backgroundColor: selectedPalette[0] }}
          >
            <i
              className="absolute inset-x-2 top-2 h-1.5 rounded-full"
              style={{ backgroundColor: selectedPalette[1] }}
            />
            <i
              className="absolute left-2 right-5 top-5 h-1 rounded-full opacity-30"
              style={{ backgroundColor: selectedPalette[1] }}
            />
            <i
              className="absolute bottom-2 left-2 h-1.5 w-5 rounded-full"
              style={{ backgroundColor: selectedPalette[2] }}
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-black">
              {selectedVariant?.name || "Choose a layout"}
            </span>
            <span className="mt-0.5 block truncate text-[10px] text-slate-400">
              {variants.length} layouts available
            </span>
          </span>
          <ChevronDown
            size={15}
            className="text-slate-400 transition group-data-[state=open]:rotate-180"
          />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className="z-[110] w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
        >
          <Command>
            <div className="flex items-center gap-2 border-b border-slate-100 px-3">
              <CommandIcon size={14} className="text-slate-400" />
              <Command.Input
                placeholder={`Search ${type.toLowerCase()} layouts…`}
                className="h-12 flex-1 bg-transparent text-xs font-semibold outline-none placeholder:text-slate-400"
              />
            </div>
            <Command.List className="max-h-[410px] overflow-y-auto p-2">
              <Command.Empty className="p-6 text-center text-xs text-slate-400">
                No matching layout.
              </Command.Empty>
              {variants.map((variant, index) => {
                const palette = previewPalettes[index % previewPalettes.length];
                const active = variant.id === value;
                return (
                  <Popover.Close asChild key={variant.id}>
                    <Command.Item
                      value={`${variant.name} ${variant.description} ${variant.tags.join(" ")}`}
                      onSelect={() => onChange(variant.id)}
                      className={`group flex cursor-pointer items-center gap-3 rounded-xl p-2.5 outline-none data-[selected=true]:bg-slate-50 ${
                        active ? "bg-lime-50" : ""
                      }`}
                    >
                      <span
                        className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-black/10"
                        style={{ backgroundColor: palette[0] }}
                      >
                        <i
                          className="absolute left-2 right-2 top-2 h-2 rounded-sm"
                          style={{ backgroundColor: palette[1] }}
                        />
                        <i
                          className="absolute left-2 right-6 top-6 h-1 rounded-full opacity-40"
                          style={{ backgroundColor: palette[1] }}
                        />
                        <i
                          className="absolute left-2 right-10 top-9 h-1 rounded-full opacity-25"
                          style={{ backgroundColor: palette[1] }}
                        />
                        <i
                          className="absolute bottom-2 left-2 h-2 w-7 rounded-sm"
                          style={{ backgroundColor: palette[2] }}
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-xs font-black text-slate-800">
                            {variant.name}
                          </span>
                          {active && (
                            <span className="grid size-4 place-items-center rounded-full bg-lime-600 text-white">
                              <Check size={10} strokeWidth={3} />
                            </span>
                          )}
                        </span>
                        <span className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-400">
                          {variant.description}
                        </span>
                      </span>
                    </Command.Item>
                  </Popover.Close>
                );
              })}
            </Command.List>
            <div className="border-t border-slate-100 px-3 py-2.5 text-[10px] font-medium text-slate-400">
              Search by layout name, style, or use case.
            </div>
          </Command>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function StylePanel({
  styles,
  onChange,
}: {
  styles: BlockCSSStyles;
  onChange: (patch: Partial<BlockCSSStyles>) => void;
}) {
  const fillMode =
    styles.bgType === "image"
      ? "image"
      : styles.useGradient
        ? "gradient"
        : "solid";

  return (
    <div className="divide-y divide-slate-100">
      <section className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
              Style presets
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Apply a complete visual direction, then refine it below.
            </p>
          </div>
          <button
            onClick={() => onChange(structuredClone(defaultStyles))}
            className="text-[10px] font-black text-slate-500 hover:text-slate-900"
          >
            Reset
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {stylePresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() =>
                onChange(preset.styles as Partial<BlockCSSStyles>)
              }
              className="rounded-xl border border-slate-200 p-3 text-left transition hover:-translate-y-0.5 hover:border-lime-500 hover:shadow-sm"
            >
              <span className="flex -space-x-1">
                {preset.swatches.map((swatch) => (
                  <i
                    key={swatch}
                    className="size-5 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: swatch }}
                  />
                ))}
              </span>
              <span className="mt-2 block text-[11px] font-black">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
          Background
        </p>
        <div className="mt-3 grid grid-cols-3 rounded-lg bg-slate-100 p-1">
          {(["solid", "gradient", "image"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() =>
                onChange({
                  bgType: mode === "solid" ? "color" : mode,
                  useGradient: mode === "gradient",
                })
              }
              className={`rounded-md px-2 py-2 text-[10px] font-black capitalize ${
                fillMode === mode
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        {fillMode === "gradient" && (
          <label className="mt-3 block">
            <span className="mb-2 block text-[10px] font-bold text-slate-500">
              Gradient CSS
            </span>
            <textarea
              value={styles.backgroundGradient}
              onChange={(event) =>
                onChange({ backgroundGradient: event.target.value })
              }
              className="min-h-16 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 font-mono text-[10px] leading-5 outline-none focus:border-lime-600"
            />
          </label>
        )}
        {fillMode === "image" && (
          <label className="mt-3 block">
            <span className="mb-2 block text-[10px] font-bold text-slate-500">
              Background image URL
            </span>
            <input
              value={styles.bgImageUrl || ""}
              onChange={(event) => onChange({ bgImageUrl: event.target.value })}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-lime-600"
            />
          </label>
        )}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <ColorField
            label="Background"
            value={styles.backgroundColor}
            onChange={(value) => onChange({ backgroundColor: value })}
          />
          <ColorField
            label="Text"
            value={styles.textColor}
            onChange={(value) => onChange({ textColor: value })}
          />
          <ColorField
            label="Accent"
            value={styles.accentColor}
            onChange={(value) => onChange({ accentColor: value })}
          />
          <ColorField
            label="Muted text"
            value={styles.subtitleColor}
            onChange={(value) => onChange({ subtitleColor: value })}
          />
        </div>
      </section>

      <section className="p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
          Typography
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label>
            <span className="mb-2 block text-[10px] font-bold text-slate-500">
              Font family
            </span>
            <select
              value={styles.fontFamily}
              onChange={(event) => onChange({ fontFamily: event.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-bold outline-none focus:border-lime-600"
            >
              <option>Inter</option>
              <option>Outfit</option>
              <option>Space Grotesk</option>
              <option>Playfair Display</option>
              <option>Merriweather</option>
              <option>Lora</option>
              <option>Oswald</option>
              <option>JetBrains Mono</option>
            </select>
          </label>
          <label>
            <span className="mb-2 block text-[10px] font-bold text-slate-500">
              Heading weight
            </span>
            <select
              value={styles.titleWeight}
              onChange={(event) =>
                onChange({
                  titleWeight: event.target
                    .value as BlockCSSStyles["titleWeight"],
                })
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-bold outline-none focus:border-lime-600"
            >
              <option value="light">Light</option>
              <option value="normal">Regular</option>
              <option value="semibold">Semibold</option>
              <option value="bold">Bold</option>
              <option value="black">Black</option>
            </select>
          </label>
        </div>
        <RangeField
          label="Heading size"
          value={styles.titleSize}
          min={24}
          max={96}
          suffix="px"
          onChange={(value) => onChange({ titleSize: value })}
        />
        <RangeField
          label="Body size"
          value={styles.bodySize}
          min={12}
          max={24}
          suffix="px"
          onChange={(value) => onChange({ bodySize: value })}
        />
        <div className="mt-4 grid grid-cols-3 rounded-lg bg-slate-100 p-1">
          {(["left", "center", "right"] as const).map((align) => (
            <button
              key={align}
              onClick={() => onChange({ textAlign: align })}
              className={`rounded-md px-2 py-2 text-[10px] font-black capitalize ${
                styles.textAlign === align
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </section>

      <section className="p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
          Layout and spacing
        </p>
        <RangeField
          label="Section spacing"
          value={styles.paddingTop}
          min={24}
          max={200}
          suffix="px"
          onChange={(value) =>
            onChange({ paddingTop: value, paddingBottom: value })
          }
        />
        <RangeField
          label="Content width"
          value={styles.maxWidth}
          min={640}
          max={1440}
          suffix="px"
          onChange={(value) => onChange({ maxWidth: value })}
        />
        <RangeField
          label="Card corners"
          value={styles.cardBorderRadius}
          min={0}
          max={40}
          suffix="px"
          onChange={(value) => onChange({ cardBorderRadius: value })}
        />
        <label className="mt-4 block">
          <span className="mb-2 block text-[10px] font-bold text-slate-500">
            Section shadow
          </span>
          <select
            value={styles.boxShadow}
            onChange={(event) =>
              onChange({
                boxShadow: event.target
                  .value as BlockCSSStyles["boxShadow"],
              })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-bold outline-none focus:border-lime-600"
          >
            <option value="none">None</option>
            <option value="sm">Soft</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">Extra large</option>
            <option value="2xl">Dramatic</option>
          </select>
        </label>
      </section>

      <section className="p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
          Buttons
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <ColorField
            label="Button"
            value={styles.buttonBgColor}
            onChange={(value) => onChange({ buttonBgColor: value })}
          />
          <ColorField
            label="Button text"
            value={styles.buttonTextColor}
            onChange={(value) => onChange({ buttonTextColor: value })}
          />
        </div>
        <RangeField
          label="Button corners"
          value={styles.buttonBorderRadius}
          min={0}
          max={40}
          suffix="px"
          onChange={(value) => onChange({ buttonBorderRadius: value })}
        />
      </section>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </span>
      <span className="flex items-center gap-2 rounded-lg border border-slate-200 p-2">
        <input
          type="color"
          value={value || "#ffffff"}
          onChange={(event) => onChange(event.target.value)}
          className="size-6 cursor-pointer border-0 bg-transparent p-0"
        />
        <input
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 text-[10px] font-bold uppercase outline-none"
        />
      </span>
    </label>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mt-5 block">
      <span className="mb-2 flex justify-between text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
        <span>{label}</span>
        <span className="text-lime-700">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-lime-600"
      />
    </label>
  );
}

export default VisualBuilder;

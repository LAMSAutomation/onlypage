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
  UploadCloud,
  Loader2,
  Users,
  Star,
  WandSparkles,
  Tag,
  Crop,
  RotateCw,
  ZoomIn,
  ZoomOut,
  X,
  Sliders,
  Maximize2,
  LayoutTemplate,
  Pencil,
  Redo2,
  Undo2,
} from "lucide-react";
import { BLOCK_CATEGORIES, BLOCK_VARIANTS_MAP } from "./builder-data";
import { VariantMiniPreview } from "./ui/variant-preview";
import { BuilderRenderer } from "./builder-renderer";
import type { BlockCSSStyles, WebBlock } from "./website-builder-editor";
import { supabase } from "@/lib/supabase";
import { fetchProducts, upsertProduct } from "@/lib/ecom-queries";
import type { SiteRecord } from "./ui/onboarding-wizard";
import { SITE_KITS, getSiteKit } from "./site-kits";
import { useUndoRedo } from "@/hooks/use-undo-redo";

type Viewport = "desktop" | "tablet" | "mobile";
type Page = {
  id: string;
  name: string;
  slug: string;
  seo_title?: string;
  seo_desc?: string;
  position?: number;
};

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
  const {
    state: blocks,
    setState: setBlocks,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetBlocks,
  } = useUndoRedo<WebBlock[]>([], { maxHistory: 60 });
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
  const [pageManagerOpen, setPageManagerOpen] = useState(false);
  const [siteKitsOpen, setSiteKitsOpen] = useState(false);
  const [applyingKitId, setApplyingKitId] = useState<string | null>(null);
  const [newPageName, setNewPageName] = useState("");
  const [editorNotice, setEditorNotice] = useState<{
    tone: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const notify = (
    message: string,
    tone: "success" | "error" | "info" = "success",
  ) => {
    setEditorNotice({ message, tone });
    window.setTimeout(() => setEditorNotice(null), 4200);
  };

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
        .select("id, name, slug, seo_title, seo_desc, position")
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
          .select("id, name, slug, seo_title, seo_desc, position")
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
        fromThemeBlock(site.theme?.header) ||
        legacyHeader ||
        createGlobalHeader(site);
      let nextFooter =
        fromThemeBlock(site.theme?.globalFooter) ||
        fromThemeBlock(site.theme?.footer) ||
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
      resetBlocks(nextBlocks);
      setSelectedId(nextBlocks[0]?.id || nextHeader.id);
      setLoaded(true);
    };
    load();
  }, [site.id, resetBlocks]);

  const persistPageBlocks = async (
    pageId: string,
    nextBlocks: WebBlock[],
  ) => {
    const localBlocks = nextBlocks.filter(
      (block) => block.type !== "Navigation" && block.type !== "Footer",
    );
    const { error: deleteError } = await supabase
      .from("blocks")
      .delete()
      .eq("page_id", pageId);
    if (deleteError) throw deleteError;
    if (localBlocks.length) {
      const { error: insertError } = await supabase.from("blocks").insert(
        localBlocks.map((block, position) => ({
          id: block.id,
          page_id: pageId,
          type: block.type,
          position,
          config: { ...block, id: undefined },
        })),
      );
      if (insertError) throw insertError;
    }
  };

  useEffect(() => {
    if (!loaded || !activePageId) return;
    const timer = window.setTimeout(async () => {
      setSaving(true);
      try {
        await persistPageBlocks(activePageId, blocks);
      } catch (error: any) {
        notify(`Could not save this page: ${error?.message || "Unknown error"}`, "error");
      } finally {
        setSaving(false);
      }
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
        // Keep legacy aliases during the transition so older production
        // renderers and cached deployments display the exact same chrome.
        header: globalHeader,
        footer: globalFooter,
      };
      try {
        const { error } = await supabase
          .from("sites")
          .update({ theme: nextTheme })
          .eq("id", site.id);
        if (error) throw error;
        onUpdateSite?.({ ...site, theme: nextTheme });
      } catch (error: any) {
        notify(`Could not save the global header/footer: ${error?.message || "Unknown error"}`, "error");
      } finally {
        setSaving(false);
      }
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
    resetBlocks(nextBlocks);
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
        return;
      }
      const target = event.target as HTMLElement | null;
      const editingText =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (!editingText && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if (
        !editingText &&
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "y"
      ) {
        event.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", openCommand);
    return () => window.removeEventListener("keydown", openCommand);
  }, [redo, undo]);

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
  const moveBlock = (blockId: string, direction: -1 | 1) => {
    setBlocks((current) => {
      const index = current.findIndex((item) => item.id === blockId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const slugify = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "page";

  const createPage = async () => {
    const name = newPageName.trim();
    if (!name) return;
    const slug = slugify(name);
    if (pages.some((candidate) => candidate.slug === slug)) {
      notify("A page with that URL already exists.", "error");
      return;
    }
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("pages")
        .insert({
          site_id: site.id,
          name,
          slug,
          seo_title: `${name} | ${site.business_name}`,
          seo_desc: `Learn more about ${name.toLowerCase()} at ${site.business_name}.`,
          position: pages.length,
        })
        .select("id, name, slug, seo_title, seo_desc, position")
        .single();
      if (error) throw error;
      const nextPage = data as Page;
      setPages((current) => [...current, nextPage]);
      setNewPageName("");
      setPageManagerOpen(false);
      setActivePageId(nextPage.id);
      resetBlocks([]);
      setSelectedId(globalHeader?.id || null);
      notify(`${name} page created.`);
    } catch (error: any) {
      notify(`Could not create the page: ${error?.message || "Unknown error"}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const updatePage = async (pageId: string, patch: Partial<Page>) => {
    const nextPatch = { ...patch };
    if (typeof nextPatch.slug === "string") nextPatch.slug = slugify(nextPatch.slug);
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("pages")
        .update(nextPatch)
        .eq("id", pageId)
        .select("id, name, slug, seo_title, seo_desc, position")
        .single();
      if (error) throw error;
      setPages((current) =>
        current.map((candidate) => (candidate.id === pageId ? (data as Page) : candidate)),
      );
      notify("Page settings saved.");
    } catch (error: any) {
      notify(`Could not update the page: ${error?.message || "Unknown error"}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const deletePage = async (pageToDelete: Page) => {
    if (pages.length <= 1 || pageToDelete.slug === "home") {
      notify("The Home page cannot be deleted.", "error");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("pages").delete().eq("id", pageToDelete.id);
      if (error) throw error;
      const nextPages = pages.filter((candidate) => candidate.id !== pageToDelete.id);
      setPages(nextPages);
      if (activePageId === pageToDelete.id) {
        const nextPage = nextPages[0];
        const { data: rows, error: blockError } = await supabase
          .from("blocks")
          .select("*")
          .eq("page_id", nextPage.id)
          .order("position");
        if (blockError) throw blockError;
        const nextBlocks = (rows || [])
          .map(fromRow)
          .filter((item) => item.type !== "Navigation" && item.type !== "Footer");
        setActivePageId(nextPage.id);
        resetBlocks(nextBlocks);
        setSelectedId(nextBlocks[0]?.id || globalHeader?.id || null);
      }
      notify(`${pageToDelete.name} page deleted.`, "info");
    } catch (error: any) {
      notify(`Could not delete the page: ${error?.message || "Unknown error"}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const applySiteKit = async (kitId: string) => {
    const kit = getSiteKit(kitId);
    if (!kit) return;
    setApplyingKitId(kitId);
    setSaving(true);
    try {
      const materialized = kit.build(site.business_name);
      const { data: existingBlockRows } = await supabase
        .from("blocks")
        .select("*, pages!inner(site_id)")
        .eq("pages.site_id", site.id);
      await supabase.from("site_history").insert({
        site_id: site.id,
        page_id: null,
        blocks: existingBlockRows || [],
        header: globalHeader,
        footer: globalFooter,
        seo_title: `Before applying ${kit.name}`,
        seo_desc: "Automatic backup created by the site-kit installer.",
      });

      const nextPages: Page[] = [];
      for (let position = 0; position < materialized.pages.length; position += 1) {
        const kitPage = materialized.pages[position];
        const existing = pages.find((candidate) => candidate.slug === kitPage.slug);
        const payload = {
          site_id: site.id,
          name: kitPage.name,
          slug: kitPage.slug,
          seo_title: kitPage.seoTitle,
          seo_desc: kitPage.seoDesc,
          position,
        };
        const query = existing
          ? supabase
              .from("pages")
              .update(payload)
              .eq("id", existing.id)
              .select("id, name, slug, seo_title, seo_desc, position")
              .single()
          : supabase
              .from("pages")
              .insert(payload)
              .select("id, name, slug, seo_title, seo_desc, position")
              .single();
        const { data: savedPage, error: pageError } = await query;
        if (pageError || !savedPage) throw pageError || new Error("Page creation failed");
        await persistPageBlocks(savedPage.id, kitPage.blocks);
        nextPages.push(savedPage as Page);
      }

      const retainedIds = new Set(nextPages.map((item) => item.id));
      const obsoleteIds = pages
        .filter((candidate) => !retainedIds.has(candidate.id))
        .map((candidate) => candidate.id);
      if (obsoleteIds.length) {
        const { error: deleteError } = await supabase
          .from("pages")
          .delete()
          .in("id", obsoleteIds);
        if (deleteError) throw deleteError;
      }

      const nextTheme = {
        ...(site.theme || {}),
        globalHeader: materialized.header,
        globalFooter: materialized.footer,
        header: materialized.header,
        footer: materialized.footer,
        activeSiteKit: kit.id,
      };
      const { data: updatedSite, error: siteError } = await supabase
        .from("sites")
        .update({ theme: nextTheme })
        .eq("id", site.id)
        .select()
        .single();
      if (siteError) throw siteError;

      if (materialized.products?.length) {
        const { error: productDeleteError } = await supabase
          .from("ecom_products")
          .delete()
          .eq("site_id", site.id);
        if (productDeleteError) throw productDeleteError;
        const { error: productInsertError } = await supabase
          .from("ecom_products")
          .insert(
            materialized.products.map((product) => ({
              site_id: site.id,
              title: product.title,
              description: product.description,
              price: product.price,
              compare_at_price: product.compareAtPrice || null,
              images: [{ url: product.image, alt: product.title }],
              stock: 50,
              category: product.category,
              tags: product.tags,
              offer_badge: product.badge || null,
              status: "active",
              seo_title: `${product.title} | ${site.business_name}`,
              seo_desc: product.description,
            })),
          );
        if (productInsertError) throw productInsertError;
      }

      const firstPage = nextPages[0];
      setPages(nextPages);
      setActivePageId(firstPage.id);
      resetBlocks(materialized.pages[0].blocks);
      setGlobalHeader(materialized.header);
      setGlobalFooter(materialized.footer);
      setSelectedId(materialized.pages[0].blocks[0]?.id || materialized.header.id);
      setSiteKitsOpen(false);
      onUpdateSite?.((updatedSite as SiteRecord) || { ...site, theme: nextTheme });
      const products = await fetchProducts(site.id);
      setEcomProducts(
        products.map((product: any) => ({
          id: product.id,
          title: product.title,
          description: product.description,
          price: String(product.price),
          compare_at: product.compare_at_price ? String(product.compare_at_price) : "",
          stock: product.stock,
          category: product.category || "General",
          tags: product.tags || [],
          offer_badge: product.offer_badge || "",
          status: product.status === "active" ? "Active" : "Draft",
          image: product.images?.[0]?.url || "",
        })),
      );
      notify(`${kit.name} installed across ${nextPages.length} pages.`);
    } catch (error: any) {
      notify(`Could not apply the site kit: ${error?.message || "Unknown error"}`, "error");
    } finally {
      setApplyingKitId(null);
      setSaving(false);
    }
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
        <div className="hidden items-center gap-2 md:flex">
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="grid size-7 place-items-center rounded-md text-slate-500 hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
              title="Undo (Ctrl/Cmd + Z)"
            >
              <Undo2 size={14} />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="grid size-7 place-items-center rounded-md text-slate-500 hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
              title="Redo (Ctrl/Cmd + Shift + Z)"
            >
              <Redo2 size={14} />
            </button>
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
                title={`${id[0].toUpperCase()}${id.slice(1)} preview`}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSiteKitsOpen(true)}
            className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:border-lime-500 hover:text-lime-800 sm:flex"
          >
            <LayoutTemplate size={14} /> Site kits
          </button>
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
                 header: globalHeader,
                 footer: globalFooter,
               };
               const { data, error } = await supabase
                 .from("sites")
                .update({ published: true, theme: nextTheme })
                .eq("id", site.id)
                .select()
                 .single();
               if (error) {
                 notify(`Publish failed: ${error.message}`, "error");
                 setSaving(false);
                 return;
               }
              onUpdateSite?.(
                (data as SiteRecord) || {
                  ...site,
                  published: true,
                  theme: nextTheme,
                },
               );
               setSaving(false);
               notify("Website published with the latest header, footer, and page content.");
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
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Page
              </p>
              <button
                type="button"
                onClick={() => setPageManagerOpen(true)}
                className="flex items-center gap-1 text-[10px] font-black text-lime-700 hover:text-lime-900"
              >
                <Pencil size={11} /> Manage
              </button>
            </div>
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
              <div
                key={block.id}
                className={`group/layer mb-1 flex items-center rounded-lg transition ${selectedId === block.id ? "bg-lime-100 text-lime-950" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <button
                  onClick={() => setSelectedId(block.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left"
                >
                  <span className="grid size-5 shrink-0 place-items-center rounded bg-white text-[9px] font-black shadow-sm">
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
                <div className="mr-1 hidden items-center gap-0.5 group-hover/layer:flex">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveBlock(block.id, -1)}
                    className="grid size-6 place-items-center rounded text-slate-400 hover:bg-white hover:text-slate-800 disabled:opacity-25"
                    title="Move section up"
                  >
                    <ChevronDown size={12} className="rotate-180" />
                  </button>
                  <button
                    type="button"
                    disabled={index === pageBlocks.length - 1}
                    onClick={() => moveBlock(block.id, 1)}
                    className="grid size-6 place-items-center rounded text-slate-400 hover:bg-white hover:text-slate-800 disabled:opacity-25"
                    title="Move section down"
                  >
                    <ChevronDown size={12} />
                  </button>
                </div>
              </div>
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
                  <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 flex items-center gap-1.5 select-none">
                        <Tag size={12} className="text-lime-600" />
                        <span>Badge / Eyebrow</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const isBadgeActive = selected.showBadge !== false && Boolean(selected.badge);
                          if (isBadgeActive) {
                            updateSelected({ showBadge: false });
                          } else {
                            const updates: Record<string, any> = { showBadge: true };
                            if (!selected.badge) {
                              updates.badge = "WELCOME BADGE";
                            }
                            updateSelected(updates);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer select-none ${
                          selected.showBadge !== false && Boolean(selected.badge)
                            ? "bg-lime-500/15 text-lime-700 border border-lime-500/30 hover:bg-lime-500/25"
                            : "bg-slate-200/80 text-slate-500 border border-slate-300 hover:bg-slate-200"
                        }`}
                        title={selected.showBadge !== false && Boolean(selected.badge) ? "Click to turn off badge" : "Click to turn on badge"}
                      >
                        <span className={`size-1.5 rounded-full ${
                          selected.showBadge !== false && Boolean(selected.badge)
                            ? "bg-lime-600 animate-pulse"
                            : "bg-slate-400"
                        }`} />
                        <span>{selected.showBadge !== false && Boolean(selected.badge) ? "Badge On" : "Badge Off"}</span>
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={selected.badge || ""}
                        placeholder="e.g. AMBIENT LUXURY WELLNESS"
                        onChange={(event) => {
                          const val = event.target.value;
                          updateSelected({
                            badge: val,
                            ...(val && selected.showBadge === false ? { showBadge: true } : {})
                          });
                        }}
                        className={`w-full rounded-lg border px-3 py-2 text-xs font-bold outline-none transition ${
                          selected.showBadge === false
                            ? "border-slate-200 bg-slate-100/70 text-slate-400 opacity-70"
                            : "border-slate-200 bg-white text-slate-900 focus:border-lime-600 focus:ring-1 focus:ring-lime-600"
                        }`}
                      />
                    </div>
                    <p className="mt-1.5 text-[9px] font-medium text-slate-400 leading-tight">
                      {selected.showBadge === false
                        ? "Badge is turned off and hidden from section header."
                        : "Badge pill displayed above the section title."}
                    </p>
                  </div>
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

      {pageManagerOpen && (
        <PageManagerModal
          pages={pages}
          activePageId={activePageId}
          newPageName={newPageName}
          saving={saving}
          onNewPageNameChange={setNewPageName}
          onCreate={createPage}
          onSelect={switchPage}
          onUpdate={updatePage}
          onDelete={deletePage}
          onClose={() => setPageManagerOpen(false)}
        />
      )}

      {siteKitsOpen && (
        <SiteKitsModal
          currentKitId={site.theme?.activeSiteKit}
          applyingKitId={applyingKitId}
          onApply={applySiteKit}
          onClose={() => setSiteKitsOpen(false)}
        />
      )}

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

      {editorNotice && (
        <div
          role="status"
          className={`fixed bottom-5 left-1/2 z-[120] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border px-4 py-3 text-xs font-bold shadow-2xl ${
            editorNotice.tone === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : editorNotice.tone === "info"
                ? "border-blue-200 bg-blue-50 text-blue-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {editorNotice.message}
        </div>
      )}
    </div>
  );
}

function PageManagerModal({
  pages,
  activePageId,
  newPageName,
  saving,
  onNewPageNameChange,
  onCreate,
  onSelect,
  onUpdate,
  onDelete,
  onClose,
}: {
  pages: Page[];
  activePageId: string | null;
  newPageName: string;
  saving: boolean;
  onNewPageNameChange: (value: string) => void;
  onCreate: () => void;
  onSelect: (pageId: string) => void;
  onUpdate: (pageId: string, patch: Partial<Page>) => void;
  onDelete: (page: Page) => void;
  onClose: () => void;
}) {
  const active = pages.find((item) => item.id === activePageId) || pages[0];
  const [draft, setDraft] = useState({
    name: active?.name || "",
    slug: active?.slug || "",
    seo_title: active?.seo_title || "",
    seo_desc: active?.seo_desc || "",
  });

  useEffect(() => {
    setDraft({
      name: active?.name || "",
      slug: active?.slug || "",
      seo_title: active?.seo_title || "",
      seo_desc: active?.seo_desc || "",
    });
  }, [active?.id]);

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="mx-auto mt-[6vh] grid max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl md:grid-cols-[280px_1fr]">
        <aside className="border-b border-slate-200 bg-slate-50 p-4 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Structure</p>
              <h2 className="mt-1 text-lg font-black">Pages</h2>
            </div>
            <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-lg hover:bg-slate-200">
              <X size={16} />
            </button>
          </div>
          <div className="mt-4 space-y-1">
            {pages.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left ${item.id === activePageId ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-white"}`}
              >
                <span>
                  <span className="block text-xs font-black">{item.name}</span>
                  <span className={`mt-0.5 block text-[10px] ${item.id === activePageId ? "text-slate-400" : "text-slate-400"}`}>/{item.slug === "home" ? "" : item.slug}</span>
                </span>
                {item.slug === "home" && <span className="text-[8px] font-black uppercase text-lime-500">Home</span>}
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3">
            <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">New page</label>
            <div className="mt-2 flex gap-2">
              <input
                value={newPageName}
                onChange={(event) => onNewPageNameChange(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && onCreate()}
                placeholder="e.g. Case Studies"
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-bold outline-none focus:border-lime-500"
              />
              <button type="button" onClick={onCreate} disabled={saving || !newPageName.trim()} className="grid size-9 place-items-center rounded-lg bg-lime-400 text-slate-950 disabled:opacity-40">
                <Plus size={15} />
              </button>
            </div>
          </div>
        </aside>
        <section className="p-5 sm:p-7">
          {active && (
            <>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Page settings</p>
              <h3 className="mt-1 text-xl font-black">{active.name}</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Page name" value={draft.name} onChange={(name) => setDraft((current) => ({ ...current, name }))} />
                <Field label="URL slug" value={draft.slug} onChange={(slug) => setDraft((current) => ({ ...current, slug }))} />
              </div>
              <Field label="SEO title" value={draft.seo_title} onChange={(seo_title) => setDraft((current) => ({ ...current, seo_title }))} />
              <Field label="Meta description" value={draft.seo_desc} multiline onChange={(seo_desc) => setDraft((current) => ({ ...current, seo_desc }))} />
              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => onDelete(active)}
                  disabled={active.slug === "home" || pages.length <= 1 || saving}
                  className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-black text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Trash2 size={14} /> Delete page
                </button>
                <button
                  type="button"
                  disabled={saving || !draft.name.trim() || !draft.slug.trim()}
                  onClick={() => onUpdate(active.id, draft)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-xs font-black text-white disabled:opacity-40"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save page settings
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function SiteKitsModal({
  currentKitId,
  applyingKitId,
  onApply,
  onClose,
}: {
  currentKitId?: string;
  applyingKitId: string | null;
  onApply: (kitId: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="mx-auto my-[5vh] max-w-5xl rounded-3xl border border-slate-200 bg-[#f6f7f4] p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-200 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-lime-950">
              <LayoutTemplate size={12} /> Professional site kits
            </span>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">Start from a complete website.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Each kit installs five connected pages, a shared header and footer, responsive section variants, SEO copy, and real button destinations.</p>
          </div>
          <button type="button" onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-slate-500 shadow-sm hover:text-slate-950">
            <X size={17} />
          </button>
        </div>
        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {SITE_KITS.map((kit) => (
            <article key={kit.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-36 overflow-hidden p-5" style={{ background: `linear-gradient(135deg, ${kit.palette[0]}, ${kit.palette[1]} 65%, ${kit.palette[2]})` }}>
                <div className="absolute inset-x-5 top-5 h-6 rounded-md border border-white/15 bg-black/25" />
                <div className="absolute bottom-5 left-5 right-16 h-14 rounded-xl border border-white/15 bg-white/10 backdrop-blur" />
                <span className="absolute bottom-5 right-5 rounded-full bg-white px-2 py-1 text-[9px] font-black text-slate-950">{kit.pageCount} pages</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">{kit.category}</p>
                <h3 className="mt-1.5 text-lg font-black text-slate-950">{kit.name}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">{kit.description}</p>
                <p className="mt-4 text-[10px] font-bold text-slate-400">Best for: {kit.audience}</p>
                <button
                  type="button"
                  disabled={Boolean(applyingKitId)}
                  onClick={() => onApply(kit.id)}
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-black text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {applyingKitId === kit.id ? <Loader2 size={14} className="animate-spin" /> : <LayoutTemplate size={14} />}
                  {applyingKitId === kit.id ? "Installing…" : currentKitId === kit.id ? "Reinstall kit" : "Use this site kit"}
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-5 text-amber-900">
          <CircleAlert size={14} className="mt-0.5 shrink-0" />
          <span>Applying a kit replaces page content with the selected structure. OnlyPage creates an automatic revision backup first; your site identity and account are not changed.</span>
        </div>
      </div>
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

  if (block.type === "Text") {
    return (
      <InspectorDetails icon={Type} title="Text Block Content">
        <MiniField
          label="Heading / Title"
          value={block.title || ""}
          onChange={(value) => onChange({ title: value })}
          placeholder="Section Heading"
        />
        <MiniField
          label="Body Text / Article Content"
          value={block.subtitle || ""}
          onChange={(value) => onChange({ subtitle: value })}
          placeholder="Write paragraphs or article content here..."
          multiline
        />
      </InspectorDetails>
    );
  }

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
                <option value="square">Square (1:1)</option>
                <option value="landscape">Landscape (16:9)</option>
                <option value="portrait">Portrait (3:4)</option>
                <option value="circle">Circle (Round Mask)</option>
              </select>
            </label>

            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Resolution Size
                </span>
                <select
                  value={(image as any).resolution || "auto"}
                  onChange={(event) => {
                    const res = event.target.value;
                    let newUrl = image.url;
                    if (res !== "auto" && newUrl && newUrl.includes("unsplash.com")) {
                      try {
                        const u = new URL(newUrl);
                        u.searchParams.set("w", res);
                        u.searchParams.set("q", "80");
                        newUrl = u.toString();
                      } catch {}
                    }
                    updateItem("galleryImages", images, index, {
                      resolution: res,
                      url: newUrl,
                    });
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-bold outline-none focus:border-lime-500"
                >
                  <option value="auto">Auto / Original</option>
                  <option value="1920">Full HD (1920px)</option>
                  <option value="1200">Standard (1200px)</option>
                  <option value="800">Medium (800px)</option>
                  <option value="400">Thumbnail (400px)</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Auto Crop Focus
                </span>
                <select
                  value={(image as any).objectPosition || "center"}
                  onChange={(event) =>
                    updateItem("galleryImages", images, index, {
                      objectPosition: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-bold outline-none focus:border-lime-500"
                >
                  <option value="center">Center Focus</option>
                  <option value="top">Top Focus</option>
                  <option value="bottom">Bottom Focus</option>
                  <option value="left">Left Focus</option>
                  <option value="right">Right Focus</option>
                </select>
              </label>
            </div>
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
      <div className="space-y-4">
        <InspectorDetails icon={ShoppingBag} title="Store settings">
          <MiniField
            label="Section Title"
            value={block.title || ""}
            onChange={(value) => onChange({ title: value })}
            placeholder="Featured Collection"
          />
          <MiniField
            label="Section Subtitle"
            value={block.subtitle || ""}
            onChange={(value) => onChange({ subtitle: value })}
            placeholder="Explore our latest arrivals"
          />
          <MiniField
            label="WhatsApp Ordering Phone"
            value={block.contactPhone || ""}
            onChange={(value) => onChange({ contactPhone: value })}
            placeholder="919876543210"
          />
          {block.variant === "single-product-hero" && (
            <MiniField
              label="Product Showcase Image"
              value={(block as any).mediaUrl || ""}
              onChange={(value) => onChange({ mediaUrl: value } as any)}
              placeholder="https://..."
              allowUpload
            />
          )}
        </InspectorDetails>

        <div className="rounded-2xl border border-lime-200 bg-lime-50/70 p-3.5 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-lime-600 text-white">
              <Database size={14} />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-lime-950">
                Store Catalog Quick Tools
              </p>
              <p className="text-[9px] text-lime-800/80">
                Import CSV or seed 5 sample products into your Supabase database.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={async () => {
                const sampleProducts = [
                  {
                    title: "Wireless ANC Headphones",
                    description: "Active noise-canceling headphones with 40h battery.",
                    price: 2499,
                    category: "Electronics",
                    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"],
                    stock: 50,
                    status: "active"
                  },
                  {
                    title: "Minimalist Smart Watch",
                    description: "Sleek AMOLED fitness watch with heart-rate sensor.",
                    price: 3499,
                    category: "Electronics",
                    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"],
                    stock: 25,
                    status: "active"
                  },
                  {
                    title: "Organic Artisan Coffee Beans",
                    description: "100% Arabica single-origin roasted coffee.",
                    price: 599,
                    category: "Food & Beverage",
                    images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800"],
                    stock: 100,
                    status: "active"
                  },
                  {
                    title: "Handcrafted Leather Wallet",
                    description: "Genuine full-grain bifold leather wallet.",
                    price: 1299,
                    category: "Accessories",
                    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800"],
                    stock: 40,
                    status: "active"
                  },
                  {
                    title: "Canvas Everyday Tote Bag",
                    description: "Durable eco-friendly cotton canvas bag.",
                    price: 899,
                    category: "Fashion",
                    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800"],
                    stock: 75,
                    status: "active"
                  }
                ];

                for (const p of sampleProducts) {
                  await upsertProduct({
                    site_id: (block as any).siteId || "default",
                    ...p
                  });
                }
                alert("✓ 5 Sample E-Commerce products imported successfully into Supabase!");
              }}
              className="rounded-xl border border-lime-300 bg-white px-2.5 py-2 text-center text-[10px] font-black text-lime-900 transition hover:bg-lime-100 cursor-pointer"
            >
              ⚡ Add Sample Items
            </button>

            <label className="rounded-xl border border-lime-300 bg-white px-2.5 py-2 text-center text-[10px] font-black text-lime-900 transition hover:bg-lime-100 cursor-pointer block">
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const text = await file.text();
                  const lines = text.split("\n").filter(Boolean);
                  let imported = 0;
                  for (let i = 1; i < lines.length; i++) {
                    const parts = lines[i].split(",");
                    if (parts.length >= 2) {
                      const title = parts[0]?.trim();
                      const price = Number(parts[1]?.trim()) || 0;
                      const description = parts[2]?.trim() || "";
                      const category = parts[3]?.trim() || "General";
                      const image = parts[4]?.trim() || "";
                      if (title && price) {
                        await upsertProduct({
                          site_id: (block as any).siteId || "default",
                          title,
                          price,
                          description,
                          category,
                          images: image ? [image] : [],
                          stock: 10,
                          status: "active"
                        });
                        imported++;
                      }
                    }
                  }
                  alert(`✓ ${imported} CSV Products imported into store catalog!`);
                }}
              />
              <span>📁 Import CSV File</span>
            </label>
          </div>
        </div>
      </div>
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

function ImageCropModal({
  imageUrl,
  onSave,
  onClose,
}: {
  imageUrl: string;
  onSave: (newUrl: string) => void;
  onClose: () => void;
}) {
  const [aspect, setAspect] = useState<string>("1:1");
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(100);
  const [targetWidth, setTargetWidth] = useState<number>(1200);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setLoading(true);
    setImageError(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setLoading(false);
    };
    img.onerror = () => {
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        imgRef.current = fallbackImg;
        setLoading(false);
      };
      fallbackImg.onerror = () => {
        setLoading(false);
        setImageError(true);
      };
      fallbackImg.src = imageUrl;
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const drawPreview = React.useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const containerWidth = 440;
    const containerHeight = 300;
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    ctx.clearRect(0, 0, containerWidth, containerHeight);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, containerWidth, containerHeight);

    ctx.save();
    ctx.translate(containerWidth / 2 + position.x, containerHeight / 2 + position.y);
    ctx.rotate((rotation * Math.PI) / 180);
    const scale = (zoom / 100) * Math.min(containerWidth / img.width, containerHeight / img.height);
    ctx.scale(scale, scale);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    let cropW = 240;
    let cropH = 240;
    if (aspect === "16:9") { cropW = 340; cropH = 191; }
    else if (aspect === "4:3") { cropW = 300; cropH = 225; }
    else if (aspect === "3:4") { cropW = 195; cropH = 260; }
    else if (aspect === "21:9") { cropW = 360; cropH = 154; }
    else if (aspect === "free") { cropW = 320; cropH = 220; }

    const cropX = (containerWidth - cropW) / 2;
    const cropY = (containerHeight - cropH) / 2;

    ctx.fillStyle = "rgba(15, 23, 42, 0.65)";
    ctx.fillRect(0, 0, containerWidth, cropY);
    ctx.fillRect(0, cropY + cropH, containerWidth, containerHeight - (cropY + cropH));
    ctx.fillRect(0, cropY, cropX, cropH);
    ctx.fillRect(cropX + cropW, cropY, containerWidth - (cropX + cropW), cropH);

    ctx.strokeStyle = "#84cc16";
    ctx.lineWidth = 2.5;

    if (aspect === "circle") {
      ctx.beginPath();
      ctx.arc(containerWidth / 2, containerHeight / 2, cropW / 2, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.strokeRect(cropX, cropY, cropW, cropH);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cropX + cropW / 3, cropY);
      ctx.lineTo(cropX + cropW / 3, cropY + cropH);
      ctx.moveTo(cropX + (2 * cropW) / 3, cropY);
      ctx.lineTo(cropX + (2 * cropW) / 3, cropY + cropH);
      ctx.moveTo(cropX, cropY + cropH / 3);
      ctx.lineTo(cropX + cropW, cropY + cropH / 3);
      ctx.moveTo(cropX, cropY + (2 * cropH) / 3);
      ctx.lineTo(cropX + cropW, cropY + (2 * cropH) / 3);
      ctx.stroke();
    }
  }, [aspect, rotation, zoom, position]);

  useEffect(() => {
    if (!loading && !imageError) {
      drawPreview();
    }
  }, [loading, imageError, drawPreview]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleSave = async () => {
    const img = imgRef.current;
    if (!img) return;

    setSaving(true);
    try {
      let cropAspectVal = 1;
      if (aspect === "16:9") cropAspectVal = 16 / 9;
      else if (aspect === "4:3") cropAspectVal = 4 / 3;
      else if (aspect === "3:4") cropAspectVal = 3 / 4;
      else if (aspect === "21:9") cropAspectVal = 21 / 9;
      else if (aspect === "free") cropAspectVal = img.width / img.height;

      const outW = targetWidth || 1200;
      const outH = Math.round(outW / cropAspectVal);

      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = outW;
      exportCanvas.height = outH;
      const ctx = exportCanvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, outW, outH);

        ctx.save();
        ctx.translate(outW / 2, outH / 2);
        ctx.rotate((rotation * Math.PI) / 180);

        const containerW = 440;
        const containerH = 300;
        let guideW = 240;
        let guideH = 240;
        if (aspect === "16:9") { guideW = 340; guideH = 191; }
        else if (aspect === "4:3") { guideW = 300; guideH = 225; }
        else if (aspect === "3:4") { guideW = 195; guideH = 260; }
        else if (aspect === "21:9") { guideW = 360; guideH = 154; }
        else if (aspect === "free") { guideW = 320; guideH = 220; }

        const previewScale = (zoom / 100) * Math.min(containerW / img.width, containerH / img.height);
        const scaleFactor = outW / guideW;

        const drawX = position.x * scaleFactor;
        const drawY = position.y * scaleFactor;
        const drawW = img.width * previewScale * scaleFactor;
        const drawH = img.height * previewScale * scaleFactor;

        ctx.drawImage(img, -drawW / 2 + drawX, -drawH / 2 + drawY, drawW, drawH);
        ctx.restore();

        const croppedDataUrl = exportCanvas.toDataURL("image/jpeg", 0.88);

        try {
          const res = await fetch(croppedDataUrl);
          const blob = await res.blob();
          const fileName = `crops/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.jpg`;
          const { error } = await supabase.storage.from("site-assets").upload(fileName, blob, { contentType: "image/jpeg", upsert: true });
          if (!error) {
            const { data: publicUrlData } = supabase.storage.from("site-assets").getPublicUrl(fileName);
            if (publicUrlData?.publicUrl) {
              onSave(publicUrlData.publicUrl);
              onClose();
              return;
            }
          }
        } catch (e) {
          console.warn("Storage upload fallback:", e);
        }

        onSave(croppedDataUrl);
        onClose();
      }
    } catch (err) {
      console.error("Crop save error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl text-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-lime-500/10 p-2 text-lime-400">
              <Crop size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Crop & Resize Image</h3>
              <p className="text-[11px] text-slate-400">Drag image to adjust framing and select output resolution</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center">
          <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 cursor-grab active:cursor-grabbing shadow-inner">
            {loading ? (
              <div className="grid h-[300px] w-[440px] place-items-center text-slate-400">
                <Loader2 size={24} className="animate-spin text-lime-400" />
              </div>
            ) : imageError ? (
              <div className="grid h-[300px] w-[440px] place-items-center text-rose-400 text-xs font-semibold">
                Failed to load image for cropping
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="block select-none"
              />
            )}
            <div className="absolute bottom-2 left-2 rounded-md bg-slate-900/80 px-2 py-0.5 text-[9px] font-bold text-slate-300 backdrop-blur">
              ↔ Drag to Reposition
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Aspect Ratio
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "1:1", label: "1:1 Square" },
                { id: "16:9", label: "16:9 Landscape" },
                { id: "4:3", label: "4:3 Standard" },
                { id: "3:4", label: "3:4 Portrait" },
                { id: "21:9", label: "21:9 Ultrawide" },
                { id: "circle", label: "Circle" },
                { id: "free", label: "Freeform" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAspect(item.id)}
                  className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition ${
                    aspect === item.id
                      ? "bg-lime-500 text-slate-950 shadow"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <div className="mb-1 flex justify-between text-[10px] font-bold text-slate-400">
                <span className="flex items-center gap-1"><ZoomIn size={12} /> Zoom Scale</span>
                <span className="text-lime-400">{zoom}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lime-400"
              />
            </div>

            <div>
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Export Resolution
              </span>
              <select
                value={targetWidth}
                onChange={(e) => setTargetWidth(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-bold text-slate-200 outline-none focus:border-lime-500"
              >
                <option value={1920}>Full HD (1920px width)</option>
                <option value={1200}>Standard Web (1200px width)</option>
                <option value={800}>Medium (800px width)</option>
                <option value={400}>Thumbnail (400px width)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setRotation((prev) => (prev + 90) % 360);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
            >
              <RotateCw size={14} />
              <span>Rotate 90°</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving || loading || imageError}
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 rounded-lg bg-lime-500 px-4 py-1.5 text-xs font-black text-slate-950 hover:bg-lime-400 disabled:opacity-50 transition shadow-lg shadow-lime-500/20"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving Crop…</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Save Cropped Image</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  allowUpload,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  allowUpload?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const shouldShowUpload =
    allowUpload ?? /url|image|photo|avatar|logo|src/i.test(label);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatusMessage(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("site-assets")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (error) {
        console.warn("Supabase storage bucket upload notice:", error.message);
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onChange(event.target.result as string);
            setStatusMessage("Uploaded locally");
            setTimeout(() => setStatusMessage(null), 3000);
          }
        };
        reader.readAsDataURL(file);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("site-assets")
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        onChange(publicUrlData.publicUrl);
        setStatusMessage("Uploaded to Supabase");
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatusMessage("Upload error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const className =
    "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-medium leading-5 outline-none transition focus:border-lime-500 focus:ring-3 focus:ring-lime-100";

  return (
    <label className="mt-3 block first:mt-0">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {shouldShowUpload && (
          <div className="flex items-center gap-1.5">
            {statusMessage && (
              <span className="text-[8px] font-bold text-lime-700">
                {statusMessage}
              </span>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            {value && (
              <button
                type="button"
                onClick={() => setShowCropModal(true)}
                className="inline-flex cursor-pointer items-center gap-1 rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-700 transition hover:border-slate-300 hover:bg-slate-200"
                title="Crop & Resize Image"
              >
                <Crop size={10} className="text-slate-600" />
                <span>Crop</span>
              </button>
            )}
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex cursor-pointer items-center gap-1 rounded border border-lime-200 bg-lime-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-lime-700 transition hover:border-lime-300 hover:bg-lime-100 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 size={10} className="animate-spin text-lime-700" />
                  <span>Uploading…</span>
                </>
              ) : (
                <>
                  <UploadCloud size={10} className="text-lime-700" />
                  <span>Upload Image</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
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

      {showCropModal && (
        <ImageCropModal
          imageUrl={value}
          onSave={(newUrl) => {
            onChange(newUrl);
            setStatusMessage("Cropped");
            setTimeout(() => setStatusMessage(null), 3000);
          }}
          onClose={() => setShowCropModal(false)}
        />
      )}
    </label>
  );
}

// Describes what the layout variant shows — uses type+variantId compound keys to avoid duplicates
function getLayoutDescription(type: string, variantId: string): string {
  const key = `${type}_${variantId}`;
  const layoutMap: Record<string, string> = {
    'Hero_minimal': 'Centered heading + subtitle + CTA button',
    'Hero_split': 'Split: image on left, text content on right',
    'Hero_saas-modern': 'Split with feature highlights on right pane',
    'Hero_video-simulate': 'Video showcase area with text overlay',
    'Hero_editorial-stack': 'Stacked editorial layout, text blocks',
    'Hero_local-conversion': 'Left-aligned text with trust badges',
    'Hero_quiet-luxury': 'Dark minimal hero with elegant serif type',
    'Hero_bold-poster': 'Large bold typography as visual focal point',
    'Hero_soft-gradient': 'Soft gradient background, centered stack',
    'Hero_mono-grid': 'Monospace font, sharp grid-aligned layout',
    'Hero_warm-studio': 'Warm earthy tones, curved card elements',
    'Hero_glass-panel': 'Glassmorphism cards on dark gradient',
    'Hero_3d-mesh': '3D mesh wireframe background effect',
    'Hero_aurora-sky': 'Aurora animated gradient background',
    'Hero_gradient-glow': 'Glowing gradient backdrop with particles',
    // Features / Business
    'Features_3-col-grid': '3-column feature cards with icons',
    'Features_4-col-grid': '4-column compact feature cards',
    'Features_bento-box': 'Bento grid with mixed card sizes',
    'Features_alternating': 'Alternating image-text rows',
    'Features_icon-cards': 'Icon + text stacked card layout',
    'Features_comparison': 'Side-by-side comparison table',
    'Business_3-col-grid': '3-column business feature cards',
    'Business_4-col-grid': '4-column business feature cards',
    'Business_bento-box': 'Bento grid for service highlights',
    'Business_alternating': 'Alternating rows for services',
    'Business_icon-cards': 'Service cards with icon + description',
    'Business_comparison': 'Service comparison table',
    // CTA
    'CTA_gradient-cta': 'Full-width gradient CTA banner',
    'CTA_soft-gradient': 'Soft gradient CTA with text',
    'CTA_image-bg': 'Image background CTA overlay',
    'CTA_split-cta': 'Split: image half, text + button half',
    // Pricing
    'Pricing_3-tier': '3-column pricing tier cards',
    'Pricing_4-tier': '4-column pricing tier cards',
    'Pricing_matrix': 'Feature comparison matrix table',
    'Pricing_glass-panel': 'Glassmorphism pricing cards',
    'Pricing_mono-grid': 'Monospace grid pricing layout',
    // Testimonials
    'Testimonials_carousel': 'Carousel slider with customer cards',
    'Testimonials_wall-of-love': 'Wall of customer quote cards',
    'Testimonials_featured': 'Single featured testimonial card',
    'Testimonials_editorial-stack': 'Stacked editorial review layout',
    // Gallery
    'Gallery_grid': '2×2 image grid with thumbnails',
    'Gallery_masonry': 'Pinterest-style masonry waterfall',
    'Gallery_marquee-logos': 'Auto-scrolling logo marquee bar',
    'Gallery_carousel': 'Image carousel with navigation',
    // Forms
    'Forms_whatsapp': 'WhatsApp chat widget bubble',
    'Forms_contact-complex': 'Full contact form with fields',
    'Forms_booking': 'Appointment booking form',
    'Forms_newsletter': 'Minimal email signup form',
    'Forms_quiet-luxury': 'Dark elegant inquiry form',
    'Forms_local-conversion': 'Local business inquiry form',
    // Navigation
    'Navigation_nav-minimal': 'Logo + nav links + CTA button',
    'Navigation_nav-glass': 'Glass blurred translucent navbar',
    'Navigation_nav-pill': 'Pill/capsule shaped navigation',
    'Navigation_nav-mega': 'Mega menu with dropdown columns',
    'Navigation_nav-3d': '3D tilted perspective navbar',
    'Navigation_nav-aurora': 'Aurora gradient animated navbar',
    // Footer
    'Footer_footer-classic': 'Logo + link columns + copyright',
    'Footer_footer-minimal': 'Centered copyright line only',
    'Footer_footer-bento': 'Bento grid footer layout',
    'Footer_footer-map': 'Footer with embedded map',
    'Footer_footer-glass': 'Glass translucent footer',
    'Footer_footer-3d': '3D perspective footer design',
    'Footer_footer-aurora': 'Aurora gradient footer',
    // Special
    'Special_faq-accordions': 'Collapsible Q&A accordion list',
    'Special_stats-grid': 'Animated stat counters grid',
    'Special_steps-path': 'Step-by-step numbered guide',
    'Special_editorial-stack': 'Stacked content accordion',
    // Map
    'Map_minimal': 'Map with pin marker',
    // Text
    'Text_minimal': 'Heading + paragraph text block',
    'Text_quote-callout': 'Pull quote with vertical accent bar',
    // EComStore
    'EComStore_single-product-hero': 'Product image + details + CTA',
    'EComStore_product-grid': 'Product grid with thumbnails',
    'EComStore_whatsapp-store': 'WhatsApp catalog store view',
  };
  return layoutMap[key] || `${type} · ${variantId}`;
}

function VariantPreview({ type, variantId, index }: { type: string; variantId?: string; index: number }) {
  const s = 'w-12 h-9';
  return (
    <span className={`${s} rounded-md overflow-hidden border border-slate-200 flex-shrink-0`}>
      <VariantMiniPreview type={type} variantId={variantId} index={index} />
    </span>
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
  const [hoveredVariant, setHoveredVariant] = useState<typeof variants[0] | null>(null);
  const selectedVariant =
    variants.find((variant) => variant.id === value) || variants[0];
  const selectedIndex = Math.max(
    0,
    variants.findIndex((variant) => variant.id === selectedVariant?.id),
  );

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 text-left transition hover:border-slate-300 hover:shadow-sm data-[state=open]:border-lime-500 data-[state=open]:ring-2 data-[state=open]:ring-lime-100"
        >
          <VariantPreview type={type} variantId={selectedVariant?.id} index={selectedIndex} />
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
          className="z-[110] w-[500px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
        >
          <Command>
            <div className="flex items-center gap-2 border-b border-slate-100 px-3">
              <CommandIcon size={14} className="text-slate-400" />
              <Command.Input
                placeholder={`Search ${type.toLowerCase()} layouts…`}
                className="h-12 flex-1 bg-transparent text-xs font-semibold outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="flex min-h-0 flex-1">
              <Command.List className="flex-1 overflow-y-auto p-2 max-h-[320px]">
                <Command.Empty className="p-6 text-center text-xs text-slate-400">
                  No matching layout.
                </Command.Empty>
                {variants.map((variant, index) => {
                  const active = variant.id === value;
                  const isHovered = hoveredVariant?.id === variant.id;
                  return (
                    <Popover.Close asChild key={variant.id}>
                      <Command.Item
                        value={`${variant.name} ${variant.description} ${variant.tags.join(" ")}`}
                        onSelect={() => onChange(variant.id)}
                        onMouseEnter={() => setHoveredVariant(variant)}
                        onMouseLeave={() => setHoveredVariant(null)}
                        className={`group flex cursor-pointer items-center gap-3 rounded-xl p-2.5 outline-none transition-colors data-[selected=true]:bg-slate-50 ${
                          active ? 'bg-lime-50' : isHovered ? 'bg-slate-50' : ''
                        }`}
                      >
                        <VariantPreview type={type} variantId={variant.id} index={index} />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-xs font-black text-slate-800">
                              {variant.name}
                            </span>
                            {active && (
                              <span className="grid size-4 place-items-center rounded-full bg-lime-600 text-white shrink-0">
                                <Check size={10} strokeWidth={3} />
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-slate-400">
                            {variant.description}
                          </span>
                        </span>
                      </Command.Item>
                    </Popover.Close>
                  );
                })}
              </Command.List>
              {/* Hover preview panel — LARGER with layout annotations */}
              {hoveredVariant && (
                <div className="w-60 shrink-0 border-l border-slate-100 p-3 flex flex-col gap-2 bg-slate-50/50 overflow-y-auto">
                  {/* BIG preview mockup — shows the actual layout structure */}
                  <div className="w-full rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm">
                    <VariantMiniPreview type={type} variantId={hoveredVariant.id} index={variants.findIndex(v => v.id === hoveredVariant.id)} size="lg" />
                  </div>
                  {/* Layout details */}
                  <div>
                    <p className="text-xs font-black text-slate-800 leading-tight">{hoveredVariant.name}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-lime-100 text-lime-800">
                        {type}
                      </span>
                      <span className="text-[8px] text-slate-400">●</span>
                      <span className="text-[9px] font-semibold text-slate-500">
                        {getLayoutDescription(type, hoveredVariant.id)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[10px] text-slate-500 leading-relaxed line-clamp-2">{hoveredVariant.description}</p>
                    {hoveredVariant.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {hoveredVariant.tags.slice(0, 5).map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase tracking-wide bg-slate-100 text-slate-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Mini visual legend showing what each element represents */}
                  <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 rounded-lg bg-white p-2 border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-0.5 rounded-sm bg-slate-800" />
                      <span className="text-[7px] text-slate-400">Heading</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-0.5 rounded-sm bg-slate-300" />
                      <span className="text-[7px] text-slate-400">Text</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-1 rounded-sm" style={{ backgroundColor: '#65a30d' }} />
                      <span className="text-[7px] text-slate-400">Button</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: '#e2e8f0' }} />
                      <span className="text-[7px] text-slate-400">Card</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-slate-100 px-3 py-2.5 text-[10px] font-medium text-slate-400">
              {variants.length} layouts · Hover right panel for preview
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
          <MiniField
            label="Background image URL"
            value={styles.bgImageUrl || ""}
            onChange={(value) => onChange({ bgImageUrl: value })}
            placeholder="https://..."
            allowUpload
          />
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

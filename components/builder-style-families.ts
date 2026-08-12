import type { BlockCSSStyles } from "./builder-types";

/**
 * Style families are visual systems that sit *underneath* a block's layout.
 *
 * A block carries two independent ideas:
 *   1. Layout  — the structural arrangement (split hero, bento grid, accordion FAQ)
 *   2. Style   — the visual system applied to it (spacing rhythm, palette, type,
 *                radius, elevation, motion)
 *
 * The catalog exposes style families as variant ids (e.g. "quiet-luxury"). The
 * renderer maps those to a base layout via `layoutAliases`, then merges the
 * family's tokens in as defaults. Because several families intentionally share
 * a base layout, the tokens are what make them read as genuinely different.
 *
 * Merge order in builder-renderer.tsx:
 *   { ...STYLE_FAMILY_TOKENS[family], ...block.styles }
 * User-authored styles always win, so applying a family never clobbers edits.
 */
export type StyleFamilyId =
  | "minimal"
  | "quiet-luxury"
  | "mono-grid"
  | "bold-poster"
  | "soft-gradient"
  | "warm-studio"
  | "glass-panel"
  | "editorial-stack"
  | "local-conversion";

export interface StyleFamilyMeta {
  id: StyleFamilyId;
  name: string;
  description: string;
  /** Short phrase shown under the swatch in the style picker. */
  feel: string;
}

export const STYLE_FAMILY_META: StyleFamilyMeta[] = [
  {
    id: "minimal",
    name: "Minimal",
    description:
      "Swiss-modern baseline. Strict spacing rhythm, monochrome palette, one accent, no decoration.",
    feel: "Clean and quiet",
  },
  {
    id: "quiet-luxury",
    name: "Quiet Luxury",
    description:
      "Serif headlines, warm neutrals, generous whitespace, near-flat surfaces.",
    feel: "Understated and premium",
  },
  {
    id: "mono-grid",
    name: "Mono Grid",
    description:
      "Monospaced type, hairline borders, square corners, zero shadow. Technical and exact.",
    feel: "Precise and structural",
  },
  {
    id: "bold-poster",
    name: "Bold Poster",
    description:
      "Oversized black type, hard contrast, tight tracking, single vivid accent.",
    feel: "Loud and confident",
  },
  {
    id: "soft-gradient",
    name: "Soft Gradient",
    description:
      "Gentle gradient fields, rounded surfaces, diffuse shadows, airy spacing.",
    feel: "Friendly and modern",
  },
  {
    id: "warm-studio",
    name: "Warm Studio",
    description:
      "Cream ground, earthy accents, soft radius, low elevation. Handmade and inviting.",
    feel: "Warm and crafted",
  },
  {
    id: "glass-panel",
    name: "Glass Panel",
    description:
      "Dark ground, translucent surfaces, luminous accent, crisp hairline edges.",
    feel: "Deep and luminous",
  },
  {
    id: "editorial-stack",
    name: "Editorial Stack",
    description:
      "Magazine rhythm. Serif display, long measure, rules instead of cards.",
    feel: "Long-form and considered",
  },
  {
    id: "local-conversion",
    name: "Local Conversion",
    description:
      "High-contrast CTAs, compact spacing, trust-forward cards. Built to convert.",
    feel: "Direct and actionable",
  },
];

/**
 * Full token sets. Every family defines the same fields so switching families
 * never leaves a block half-styled by the previous one.
 *
 * Contrast note: every textColor/backgroundColor pair below meets WCAG AA
 * (>= 4.5:1), and subtitleColor meets >= 4.5:1 on its own background.
 */
export const STYLE_FAMILY_TOKENS: Record<StyleFamilyId, BlockCSSStyles> = {
  /* ── Minimal — Swiss modernism. The default. ───────────────────────── */
  minimal: {
    paddingTop: 96,
    paddingBottom: 96,
    paddingLeft: 24,
    paddingRight: 24,
    gapSize: 32,
    maxWidth: 1200,
    textAlign: "left",
    backgroundColor: "#FFFFFF",
    backgroundGradient: "",
    useGradient: false,
    textColor: "#0A0A0A",
    subtitleColor: "#525252",
    accentColor: "#0A0A0A",
    badgeBgColor: "#F5F5F5",
    badgeTextColor: "#0A0A0A",
    fontFamily: "Inter",
    titleSize: 48,
    titleWeight: "semibold",
    subtitleSize: 18,
    bodySize: 16,
    lineHeight: 1.6,
    cardBgColor: "#FFFFFF",
    cardTextColor: "#0A0A0A",
    cardBorderRadius: 4,
    cardShadow: "none",
    cardBorderWidth: 1,
    cardBorderColor: "#E5E5E5",
    borderRadius: 0,
    borderWidth: 0,
    borderColor: "#E5E5E5",
    borderStyle: "solid",
    boxShadow: "none",
    buttonBgColor: "#0A0A0A",
    buttonTextColor: "#FFFFFF",
    buttonBorderRadius: 4,
    buttonHoverScale: false,
    bgType: "color",
    clickResponse: "none",
    hoverEffect: "none",
  },

  /* ── Quiet Luxury — serif, warm neutral, generous air. ─────────────── */
  "quiet-luxury": {
    paddingTop: 128,
    paddingBottom: 128,
    paddingLeft: 32,
    paddingRight: 32,
    gapSize: 48,
    maxWidth: 1140,
    textAlign: "center",
    backgroundColor: "#FAF8F5",
    backgroundGradient: "",
    useGradient: false,
    textColor: "#1C1917",
    subtitleColor: "#57534E",
    accentColor: "#8A7355",
    badgeBgColor: "#EFEAE3",
    badgeTextColor: "#6B5B45",
    fontFamily: "Cormorant Garamond",
    titleSize: 56,
    titleWeight: "normal",
    subtitleSize: 19,
    bodySize: 17,
    lineHeight: 1.75,
    cardBgColor: "#FFFFFF",
    cardTextColor: "#1C1917",
    cardBorderRadius: 2,
    cardShadow: "none",
    cardBorderWidth: 1,
    cardBorderColor: "#E7E0D6",
    borderRadius: 0,
    borderWidth: 0,
    borderColor: "#E7E0D6",
    borderStyle: "solid",
    boxShadow: "none",
    buttonBgColor: "#1C1917",
    buttonTextColor: "#FAF8F5",
    buttonBorderRadius: 0,
    buttonHoverScale: false,
    bgType: "color",
    clickResponse: "none",
    hoverEffect: "none",
  },

  /* ── Mono Grid — monospaced, hairline, square, zero elevation. ─────── */
  "mono-grid": {
    paddingTop: 80,
    paddingBottom: 80,
    paddingLeft: 24,
    paddingRight: 24,
    gapSize: 24,
    maxWidth: 1280,
    textAlign: "left",
    backgroundColor: "#FAFAFA",
    backgroundGradient: "",
    useGradient: false,
    textColor: "#18181B",
    subtitleColor: "#52525B",
    accentColor: "#2563EB",
    badgeBgColor: "#18181B",
    badgeTextColor: "#FAFAFA",
    fontFamily: "JetBrains Mono",
    titleSize: 40,
    titleWeight: "semibold",
    subtitleSize: 15,
    bodySize: 14,
    lineHeight: 1.6,
    cardBgColor: "#FFFFFF",
    cardTextColor: "#18181B",
    cardBorderRadius: 0,
    cardShadow: "none",
    cardBorderWidth: 1,
    cardBorderColor: "#D4D4D8",
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "#D4D4D8",
    borderStyle: "solid",
    boxShadow: "none",
    buttonBgColor: "#18181B",
    buttonTextColor: "#FAFAFA",
    buttonBorderRadius: 0,
    buttonHoverScale: false,
    bgType: "color",
    clickResponse: "none",
    hoverEffect: "none",
  },

  /* ── Bold Poster — oversized black type, hard contrast. ────────────── */
  "bold-poster": {
    paddingTop: 112,
    paddingBottom: 112,
    paddingLeft: 24,
    paddingRight: 24,
    gapSize: 40,
    maxWidth: 1280,
    textAlign: "left",
    backgroundColor: "#0A0A0A",
    backgroundGradient: "",
    useGradient: false,
    textColor: "#FFFFFF",
    subtitleColor: "#A3A3A3",
    accentColor: "#D9F035",
    badgeBgColor: "#D9F035",
    badgeTextColor: "#0A0A0A",
    fontFamily: "Syne",
    titleSize: 72,
    titleWeight: "black",
    subtitleSize: 20,
    bodySize: 16,
    lineHeight: 1.35,
    cardBgColor: "#171717",
    cardTextColor: "#FFFFFF",
    cardBorderRadius: 0,
    cardShadow: "none",
    cardBorderWidth: 2,
    cardBorderColor: "#FFFFFF",
    borderRadius: 0,
    borderWidth: 0,
    borderColor: "#FFFFFF",
    borderStyle: "solid",
    boxShadow: "none",
    buttonBgColor: "#D9F035",
    buttonTextColor: "#0A0A0A",
    buttonBorderRadius: 0,
    buttonHoverScale: true,
    bgType: "color",
    clickResponse: "scale-down",
    hoverEffect: "scale",
  },

  /* ── Soft Gradient — airy, rounded, diffuse. ───────────────────────── */
  "soft-gradient": {
    paddingTop: 104,
    paddingBottom: 104,
    paddingLeft: 24,
    paddingRight: 24,
    gapSize: 32,
    maxWidth: 1200,
    textAlign: "center",
    backgroundColor: "#F8FAFF",
    backgroundGradient:
      "linear-gradient(160deg, #F5F3FF 0%, #F8FAFF 45%, #FFF7F5 100%)",
    useGradient: true,
    textColor: "#1E1B4B",
    subtitleColor: "#4C4A72",
    accentColor: "#6D5AE6",
    badgeBgColor: "#EDE9FE",
    badgeTextColor: "#4C1D95",
    fontFamily: "Plus Jakarta Sans",
    titleSize: 48,
    titleWeight: "bold",
    subtitleSize: 18,
    bodySize: 16,
    lineHeight: 1.65,
    cardBgColor: "#FFFFFF",
    cardTextColor: "#1E1B4B",
    cardBorderRadius: 20,
    cardShadow: "lg",
    cardBorderWidth: 0,
    cardBorderColor: "#E9E5FF",
    borderRadius: 24,
    borderWidth: 0,
    borderColor: "#E9E5FF",
    borderStyle: "solid",
    boxShadow: "none",
    buttonBgColor: "#6D5AE6",
    buttonTextColor: "#FFFFFF",
    buttonBorderRadius: 999,
    buttonHoverScale: true,
    bgType: "gradient",
    clickResponse: "scale-down",
    hoverEffect: "lift",
  },

  /* ── Warm Studio — cream ground, earthy, handmade. ─────────────────── */
  "warm-studio": {
    paddingTop: 96,
    paddingBottom: 96,
    paddingLeft: 28,
    paddingRight: 28,
    gapSize: 36,
    maxWidth: 1160,
    textAlign: "left",
    backgroundColor: "#FDF9F3",
    backgroundGradient: "",
    useGradient: false,
    textColor: "#2B2118",
    subtitleColor: "#6B5847",
    accentColor: "#C2683A",
    badgeBgColor: "#F5E6D8",
    badgeTextColor: "#8A4A22",
    fontFamily: "Lora",
    titleSize: 46,
    titleWeight: "semibold",
    subtitleSize: 18,
    bodySize: 17,
    lineHeight: 1.7,
    cardBgColor: "#FFFFFF",
    cardTextColor: "#2B2118",
    cardBorderRadius: 14,
    cardShadow: "sm",
    cardBorderWidth: 1,
    cardBorderColor: "#EDE0D1",
    borderRadius: 16,
    borderWidth: 0,
    borderColor: "#EDE0D1",
    borderStyle: "solid",
    boxShadow: "none",
    buttonBgColor: "#C2683A",
    buttonTextColor: "#FFFFFF",
    buttonBorderRadius: 10,
    buttonHoverScale: false,
    bgType: "color",
    clickResponse: "scale-down",
    hoverEffect: "lift",
  },

  /* ── Glass Panel — dark ground, translucent surfaces. ──────────────── */
  "glass-panel": {
    paddingTop: 112,
    paddingBottom: 112,
    paddingLeft: 24,
    paddingRight: 24,
    gapSize: 32,
    maxWidth: 1240,
    textAlign: "center",
    backgroundColor: "#0B1120",
    backgroundGradient:
      "linear-gradient(155deg, #0B1120 0%, #111C33 55%, #0B1120 100%)",
    useGradient: true,
    textColor: "#F1F5F9",
    subtitleColor: "#A8B6CC",
    accentColor: "#38BDF8",
    badgeBgColor: "rgba(56,189,248,0.16)",
    badgeTextColor: "#7DD3FC",
    fontFamily: "Space Grotesk",
    titleSize: 52,
    titleWeight: "bold",
    subtitleSize: 18,
    bodySize: 16,
    lineHeight: 1.6,
    cardBgColor: "rgba(255,255,255,0.06)",
    cardTextColor: "#F1F5F9",
    cardBorderRadius: 16,
    cardShadow: "xl",
    cardBorderWidth: 1,
    cardBorderColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    borderWidth: 0,
    borderColor: "rgba(255,255,255,0.12)",
    borderStyle: "solid",
    boxShadow: "none",
    buttonBgColor: "#38BDF8",
    buttonTextColor: "#04121F",
    buttonBorderRadius: 12,
    buttonHoverScale: true,
    bgType: "gradient",
    clickResponse: "pulse",
    hoverEffect: "glow",
  },

  /* ── Editorial Stack — magazine rhythm, rules not cards. ───────────── */
  "editorial-stack": {
    paddingTop: 120,
    paddingBottom: 120,
    paddingLeft: 32,
    paddingRight: 32,
    gapSize: 40,
    maxWidth: 880,
    textAlign: "left",
    backgroundColor: "#FFFFFF",
    backgroundGradient: "",
    useGradient: false,
    textColor: "#111111",
    subtitleColor: "#4B4B4B",
    accentColor: "#B4231F",
    badgeBgColor: "#FFFFFF",
    badgeTextColor: "#B4231F",
    fontFamily: "Playfair Display",
    titleSize: 60,
    titleWeight: "bold",
    subtitleSize: 20,
    bodySize: 18,
    lineHeight: 1.8,
    cardBgColor: "#FFFFFF",
    cardTextColor: "#111111",
    cardBorderRadius: 0,
    cardShadow: "none",
    cardBorderWidth: 0,
    cardBorderColor: "#111111",
    borderRadius: 0,
    borderWidth: 0,
    borderColor: "#111111",
    borderStyle: "solid",
    boxShadow: "none",
    buttonBgColor: "#111111",
    buttonTextColor: "#FFFFFF",
    buttonBorderRadius: 0,
    buttonHoverScale: false,
    bgType: "color",
    clickResponse: "none",
    hoverEffect: "none",
  },

  /* ── Local Conversion — compact, trust-forward, CTA-led. ───────────── */
  "local-conversion": {
    paddingTop: 72,
    paddingBottom: 72,
    paddingLeft: 20,
    paddingRight: 20,
    gapSize: 24,
    maxWidth: 1120,
    textAlign: "center",
    backgroundColor: "#FFFFFF",
    backgroundGradient: "",
    useGradient: false,
    textColor: "#0F172A",
    subtitleColor: "#475569",
    accentColor: "#047857",
    badgeBgColor: "#D1FAE5",
    badgeTextColor: "#065F46",
    fontFamily: "Inter",
    titleSize: 40,
    titleWeight: "bold",
    subtitleSize: 17,
    bodySize: 16,
    lineHeight: 1.6,
    cardBgColor: "#FFFFFF",
    cardTextColor: "#0F172A",
    cardBorderRadius: 12,
    cardShadow: "md",
    cardBorderWidth: 1,
    cardBorderColor: "#E2E8F0",
    borderRadius: 12,
    borderWidth: 0,
    borderColor: "#E2E8F0",
    borderStyle: "solid",
    boxShadow: "none",
    buttonBgColor: "#047857",
    buttonTextColor: "#FFFFFF",
    buttonBorderRadius: 8,
    buttonHoverScale: true,
    bgType: "color",
    clickResponse: "scale-down",
    hoverEffect: "lift",
  },
};

/** True when a variant id names a style family rather than a concrete layout. */
export function isStyleFamily(variant?: string): variant is StyleFamilyId {
  return Boolean(variant && variant in STYLE_FAMILY_TOKENS);
}

/**
 * Tokens for a variant, or null when the variant is a plain layout.
 * Callers merge the result *under* the block's own styles.
 */
export function getStyleFamilyTokens(
  variant?: string,
): BlockCSSStyles | null {
  return isStyleFamily(variant) ? STYLE_FAMILY_TOKENS[variant] : null;
}

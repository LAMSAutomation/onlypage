// ==========================================
// SHARED BUILDER TYPES & CONSTANTS
// Formerly exported from website-builder-editor.tsx;
// that dead component was deleted in the editor UI audit.
// ==========================================

export interface BlockCSSStyles {
  // Spacing & Layout
  paddingTop: number;       // in px
  paddingBottom: number;    // in px
  paddingLeft: number;      // in px
  paddingRight: number;     // in px
  gapSize: number;          // in px
  maxWidth: number;         // in px (content constraint)
  textAlign: 'left' | 'center' | 'right';

  // Theme & Colors (Hex values)
  backgroundColor: string;
  backgroundGradient: string; // e.g. "linear-gradient(...)"
  useGradient: boolean;
  textColor: string;
  subtitleColor: string;
  accentColor: string;
  badgeBgColor: string;
  badgeTextColor: string;

  // Typography
  fontFamily: string;
  titleSize: number;        // in px
  titleWeight: 'light' | 'normal' | 'semibold' | 'bold' | 'black';
  subtitleSize: number;     // in px
  bodySize: number;         // in px
  lineHeight: number;       // standard line height scale (e.g. 1.2, 1.5, 1.6)

  // Card Styling (For sub-items in Features/Pricing/Testimonials)
  cardBgColor: string;
  cardTextColor: string;
  cardBorderRadius: number; // in px
  cardShadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  cardBorderWidth: number;  // in px
  cardBorderColor: string;

  // Global Section Borders & Shadow
  borderRadius: number;     // in px (outer section container if any)
  borderWidth: number;      // in px
  borderColor: string;
  borderStyle: 'solid' | 'dashed' | 'dotted';
  boxShadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  // Interactive Buttons
  buttonBgColor: string;
  buttonTextColor: string;
  buttonBorderRadius: number; // in px
  buttonHoverScale: boolean;

  // Interactive Backgrounds & Animations
  bgType?: 'color' | 'gradient' | 'image' | string;
  bgImageUrl?: string;
  bgImageOpacity?: number;
  bgImageSize?: 'cover' | 'contain' | 'auto' | string;
  bgImageAttachment?: 'scroll' | 'fixed' | string;
  clickResponse?: 'none' | 'scale-down' | 'scale-up' | 'bounce' | 'pulse' | 'flash' | 'ripple' | string;
  hoverEffect?: 'none' | 'lift' | 'glow' | 'tilt' | 'scale' | string;
}

export interface WebBlock {
  id: string;
  type: 'Text' | 'Hero' | 'Features' | 'Pricing' | 'Testimonials' | 'Contact' | 'Footer' | 'Gallery' | 'Business' | 'Forms' | 'Special' | 'CTA' | 'Navigation' | 'Map' | 'EComStore';
  title: string;
  subtitle: string;
  badge?: string;
  showBadge?: boolean;
  imageUrl?: string;
  btnText?: string;
  secondaryBtnText?: string;
  variant?: string;
  // Button Actions
  btnActionType?: 'scroll' | 'link' | 'external' | 'none' | string;
  btnActionValue?: string;
  secondaryBtnActionType?: 'scroll' | 'link' | 'external' | 'none' | string;
  secondaryBtnActionValue?: string;
  // Lead routing
  whatsappFollowUp?: boolean;
  successMessage?: string;
  // Live data connections
  bindCollectionName?: string;
  bindFields?: Record<string, string>;
  // Map configuration
  mapAddress?: string;
  // Gallery Slide Images
  galleryImages?: { id: string; url: string; title: string; subtitle: string; aspect?: string }[];
  // Features lists
  features?: {
    id: string;
    title: string;
    desc: string;
    icon: string;
    imageUrl?: string;
    eyebrow?: string;
    linkText?: string;
    linkActionType?: string;
    linkActionValue?: string;
  }[];
  // Pricing plans
  pricing?: { id: string; tier: string; price: string; features: string[]; btnText: string; popular?: boolean }[];
  // Testimonial list
  testimonials?: { id: string; name: string; role: string; content: string; avatar: string; rating: number }[];
  // Contact details
  contactEmail?: string;
  // ...
  contactPhone?: string;
  contactAddress?: string;
  showMap?: boolean;
  // Footer content
  copyright?: string;
  links?: { id: string; label: string; url: string }[];
  linkColumns?: { id: string; heading: string; links: { id: string; label: string; url: string }[] }[];
  // FAQ, Stats, Steps
  faqs?: { id: string; q: string; a: string }[];
  stats?: { id: string; label: string; val: number; suffix: string }[];
  steps?: { id: string; step: string; title: string; desc: string }[];
  formFields?: {
    id: string;
    label: string;
    name: string;
    type: 'text' | 'email' | 'tel' | 'date' | 'number' | 'password' | 'textarea' | 'select';
    placeholder?: string;
    required?: boolean;
    width?: 'full' | 'half';
    options?: string[];
  }[];
  styles: BlockCSSStyles;
}

export interface WebPage {
  id: string;
  name: string;
  slug: string;
  seoTitle: string;
  seoDesc: string;
}

export const GOOGLE_FONTS_LIST = [
  "Inter", "Plus Jakarta Sans", "Poppins", "Montserrat", "Open Sans", "Roboto", "Lato", "Raleway", "DM Sans", "Nunito", "Albert Sans",
  "Playfair Display", "Merriweather", "Lora", "Cormorant Garamond", "EB Garamond", "Georgia",
  "Space Grotesk", "Outfit", "Syne", "Oswald", "Bebas Neue", "Cinzel", "Lexend",
  "JetBrains Mono", "Fira Code", "Space Mono", "Source Code Pro",
  "Caveat", "Pacifico", "Shadows Into Light", "Great Vibes", "Architects Daughter", "Dancing Script"
];

export type Viewport = "desktop" | "tablet" | "mobile";

export type Page = {
  id: string;
  name: string;
  slug: string;
  seo_title?: string;
  seo_desc?: string;
  position?: number;
};

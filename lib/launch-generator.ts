import { INDUSTRY_PRESETS } from '@/components/builder-data';
import { getLegalPagesForBusiness, launchTypeToCategory } from '@/lib/legal-templates';

export type LaunchBusinessType = 'local-service' | 'salon' | 'clinic' | 'creator' | 'real-estate';
export type LaunchStyle = 'Modern' | 'Warm' | 'Bold';

export interface LaunchKitConfig {
  businessType: LaunchBusinessType;
  goal: string;
  locale: string;
  services: string[];
  style: LaunchStyle;
  tools: string[];
}

export interface LaunchBlock {
  type: string;
  variant?: string;
  [key: string]: any;
}

export interface LaunchPageSeed {
  name: string;
  slug: string;
  seoTitle: string;
  seoDesc: string;
  blocks: LaunchBlock[];
}

const PRESET_BY_BUSINESS: Record<LaunchBusinessType, keyof typeof INDUSTRY_PRESETS> = {
  'local-service': 'salon',
  salon: 'salon',
  clinic: 'doctor',
  creator: 'portfolio',
  'real-estate': 'realestate',
};

const DEFAULT_SERVICES: Record<LaunchBusinessType, string[]> = {
  'local-service': ['Personal consultation', 'Tailored service', 'WhatsApp support'],
  salon: ['Hair and beauty', 'Wellness treatments', 'Book a consultation'],
  clinic: ['Consultations', 'Preventive care', 'Follow-up support'],
  creator: ['Portfolio projects', 'Creative services', 'Start a collaboration'],
  'real-estate': ['Property discovery', 'Site visits', 'Buyer consultation'],
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

function applyStyle(block: LaunchBlock, style: LaunchStyle) {
  if (!block.styles) return block;
  if (style === 'Warm') {
    block.styles.accentColor = '#c2410c';
    block.styles.buttonBgColor = '#c2410c';
    block.styles.badgeBgColor = '#fff7ed';
    block.styles.badgeTextColor = '#c2410c';
    block.styles.fontFamily = 'DM Sans';
  }
  if (style === 'Bold') {
    block.styles.backgroundColor = '#0f172a';
    block.styles.textColor = '#f8fafc';
    block.styles.subtitleColor = '#cbd5e1';
    block.styles.cardBgColor = '#1e293b';
    block.styles.cardTextColor = '#f8fafc';
    block.styles.accentColor = '#22c55e';
    block.styles.buttonBgColor = '#22c55e';
    block.styles.buttonTextColor = '#052e16';
    block.styles.fontFamily = 'Outfit';
    block.styles.useGradient = false;
  }
  return block;
}

function formBlock(title: string, subtitle: string, button: string, variant = 'contact-complex'): LaunchBlock {
  return {
    type: 'Forms', variant, badge: 'NEXT STEP', title, subtitle, btnText: button,
    styles: {
      backgroundColor: '#f8fafc', textColor: '#0f172a', subtitleColor: '#475569', accentColor: '#4f46e5',
      badgeBgColor: '#eef2ff', badgeTextColor: '#4f46e5', fontFamily: 'Inter', titleSize: 34, titleWeight: 'bold',
      subtitleSize: 15, bodySize: 13, paddingTop: 80, paddingBottom: 80, paddingLeft: 24, paddingRight: 24,
      gapSize: 20, maxWidth: 900, textAlign: 'center', useGradient: false, backgroundGradient: '',
      cardBgColor: '#ffffff', cardTextColor: '#0f172a', cardBorderRadius: 12, cardShadow: 'lg', cardBorderWidth: 1,
      cardBorderColor: '#e2e8f0', borderRadius: 0, borderWidth: 0, borderColor: '', borderStyle: 'solid', boxShadow: 'none',
      buttonBgColor: '#4f46e5', buttonTextColor: '#ffffff', buttonBorderRadius: 10, buttonHoverScale: true,
    },
  };
}

export function createLaunchPages(businessName: string, kit: LaunchKitConfig): LaunchPageSeed[] {
  const services = kit.services.length ? kit.services : DEFAULT_SERVICES[kit.businessType];
  const preset = clone(INDUSTRY_PRESETS[PRESET_BY_BUSINESS[kit.businessType]].blocks) as LaunchBlock[];
  const homeBlocks = preset.map((block) => applyStyle(block, kit.style));
  const hero = homeBlocks.find((block) => block.type === 'Hero');
  if (hero) {
    hero.badge = `${kit.locale.toUpperCase()} • LOCAL BUSINESS`;
    hero.title = kit.goal === 'Take bookings'
      ? `Book your next visit with ${businessName}`
      : kit.goal === 'Sell products'
        ? `Shop directly from ${businessName}`
        : `A better way to reach ${businessName}`;
    hero.subtitle = `${services.slice(0, 2).join(' and ')} — with a simple way for customers to get in touch.`;
    hero.btnText = kit.tools.includes('bookings') ? 'Book now' : kit.tools.includes('leads') ? 'Send enquiry' : 'Get in touch';
  }

  const serviceBlock = homeBlocks.find((block) => ['Business', 'Features', 'Gallery'].includes(block.type));
  if (serviceBlock) {
    serviceBlock.badge = 'WHAT WE OFFER';
    serviceBlock.title = `Services from ${businessName}`;
    serviceBlock.subtitle = 'Clear choices for customers, with a quick next step.';
    serviceBlock.features = services.slice(0, 3).map((service, index) => ({
      id: `service-${index + 1}`, title: service, desc: 'Ask for details or get a quick response from our team.', icon: index === 0 ? 'Sparkles' : index === 1 ? 'Check' : 'MessageSquare',
    }));
  }

  if (kit.tools.includes('leads') && !homeBlocks.some((block) => block.type === 'Forms')) {
    homeBlocks.push(formBlock('Tell us what you need', 'Share a few details and we will follow up with the right next step.', 'Send enquiry'));
  }
  if (kit.tools.includes('bookings')) {
    homeBlocks.push(formBlock('Choose a time that works for you', 'Request a booking and we will confirm your preferred slot.', 'Request booking', 'appointment'));
  }
  if (kit.tools.includes('payments')) {
    homeBlocks.push({
      type: 'EComStore', variant: 'product-grid-filter', badge: 'SHOP & PAY', title: `Shop ${businessName}`,
      subtitle: 'Add products and connect your payment settings before accepting orders.', btnText: 'Browse products',
      styles: clone(formBlock('', '', '').styles),
    });
  }
  if (kit.tools.includes('offers')) {
    homeBlocks.push({
      type: 'Pricing', variant: 'pricing-cards', badge: 'LOCAL OFFER', title: `A simple offer from ${businessName}`,
      subtitle: 'Add your final price, validity, and terms before sharing this offer with customers.',
      pricing: [{ id: 'offer-1', tier: 'Launch offer', price: '₹ —', features: ['Set a clear expiry date', 'Share on WhatsApp', 'Track enquiries'], btnText: 'Ask about this offer', popular: true }],
      styles: clone(formBlock('', '', '').styles),
    });
  }
  if (kit.tools.includes('reviews')) {
    homeBlocks.push({
      type: 'CTA', variant: 'gradient-cta', badge: 'CUSTOMER TRUST', title: 'Turn completed jobs into trusted reviews',
      subtitle: 'Connect your review-request workflow, then add only verified customer feedback to your site.', btnText: 'Set up review requests',
      styles: clone(formBlock('', '', '').styles),
    });
  }

  const pages: LaunchPageSeed[] = [{
    name: 'Home', slug: 'home', seoTitle: `${businessName} | ${services[0] || 'Local business'}`,
    seoDesc: `${businessName}: ${services.slice(0, 3).join(', ')}. ${kit.goal}.`, blocks: homeBlocks,
  }];

  pages.push({
    name: 'Services', slug: 'services', seoTitle: `${businessName} Services`, seoDesc: `Explore services from ${businessName}.`,
    blocks: [serviceBlock ? clone(serviceBlock) : formBlock(`Services from ${businessName}`, 'Contact us to learn more.', 'Send enquiry')],
  });
  pages.push({
    name: 'Contact', slug: 'contact', seoTitle: `Contact ${businessName}`, seoDesc: `Contact ${businessName} for an enquiry.`,
    blocks: [formBlock(`Contact ${businessName}`, 'Tell us what you are looking for and we will get back to you.', 'Send enquiry')],
  });
  if (kit.tools.includes('bookings')) pages.push({ name: 'Bookings', slug: 'bookings', seoTitle: `Book ${businessName}`, seoDesc: `Request a booking with ${businessName}.`, blocks: [formBlock('Request a booking', 'Choose your preferred service and time. We will confirm shortly.', 'Request booking', 'appointment')] });
  if (kit.tools.includes('payments')) pages.push({ name: 'Shop', slug: 'shop', seoTitle: `${businessName} Shop`, seoDesc: `Shop products from ${businessName}.`, blocks: [clone(homeBlocks.find((block) => block.type === 'EComStore') || formBlock(`Shop ${businessName}`, 'Products will appear here after you add them.', 'Open products'))] });

  // Add legal pages (pre-built templates, no AI needed)
  const bizCategory = launchTypeToCategory(kit.businessType);
  const legalTemplates = getLegalPagesForBusiness(businessName, bizCategory);
  for (const lp of legalTemplates) {
    // Only add if not already present
    if (!pages.some(p => p.slug === lp.slug)) {
      pages.push({
        name: lp.title,
        slug: lp.slug,
        seoTitle: lp.seoTitle,
        seoDesc: lp.seoDesc,
        blocks: [{
          type: 'Text',
          variant: 'article-body',
          badge: 'LEGAL',
          title: lp.title,
          content: lp.content,
          styles: {
            backgroundColor: '#ffffff',
            textColor: '#0f172a',
            subtitleColor: '#475569',
            fontFamily: 'Inter',
            titleSize: 32,
            bodySize: 14,
            paddingTop: 60,
            paddingBottom: 60,
          },
        }],
      });
    }
  }

  return pages;
}

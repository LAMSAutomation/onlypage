/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Persona, Template, PricingPlan, FeatureCard, Addon } from './types';

export const PERSONAS: Persona[] = [
  {
    id: 'salon',
    name: 'Glow Studio & Spa',
    role: 'Salon & Wellness',
    emoji: '✨',
    bgGradient: 'from-pink-500/10 to-rose-500/10',
    accentColor: 'text-rose-600 border-rose-200 bg-rose-50',
    mockHeadline: 'Timeless Beauty, Crafted For You',
    mockSub: 'Experience premium haircare and holistic facial treatments in the heart of the city.',
    features: ['Service Menu', 'Online Booking', 'Loyalty Cards', 'Before/After Showcase'],
    mockTheme: 'warm'
  },
  {
    id: 'doctor',
    name: 'Apex Dental Care',
    role: 'Medical & Dental Clinic',
    emoji: '🩺',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
    accentColor: 'text-blue-600 border-blue-200 bg-blue-50',
    mockHeadline: 'Your Smile is Our Priority',
    mockSub: 'State-of-the-art dental procedures with a gentle, patient-focused approach.',
    features: ['Doctor Profiles', 'Book Consultation', 'Patient Forms', 'Interactive FAQs'],
    mockTheme: 'clean'
  },
  {
    id: 'student',
    name: 'Nikhil Sen',
    role: 'Graduate Student & Developer',
    emoji: '🎓',
    bgGradient: 'from-purple-500/10 to-indigo-500/10',
    accentColor: 'text-purple-600 border-purple-200 bg-purple-50',
    mockHeadline: 'Engineering the Web of Tomorrow',
    mockSub: 'Computer Science student at IIT Delhi, specializing in robust full-stack applications and AI.',
    features: ['Interactive Resume', 'Project Grid', 'Contact Form', 'Medium Blog Feed'],
    mockTheme: 'modern'
  },
  {
    id: 'creator',
    name: 'Fable Studios',
    role: 'YouTube Creator & Designer',
    emoji: '🎨',
    bgGradient: 'from-orange-500/10 to-amber-500/10',
    accentColor: 'text-orange-600 border-orange-200 bg-orange-50',
    mockHeadline: 'Stories that Move Hearts',
    mockSub: 'High-production video guides on tech, design, and slow living. Merch store open now!',
    features: ['Video Portfolio', 'Shop Integration', 'Sponsorship Kits', 'Newsletter Signup'],
    mockTheme: 'modern'
  },
  {
    id: 'business',
    name: 'Peak Ventures',
    role: 'Consulting & Growth Advisory',
    emoji: '💼',
    bgGradient: 'from-slate-500/10 to-zinc-500/10',
    accentColor: 'text-slate-800 border-slate-300 bg-slate-100',
    mockHeadline: 'Scale Your Business Faster',
    mockSub: 'We provide specialized CFO consulting, operational audits, and hyper-growth strategies.',
    features: ['Service Tiers', 'Client Testimonials', 'Resource Center', 'Discovery Call Bookings'],
    mockTheme: 'serif'
  },
  {
    id: 'realestate',
    name: 'Vanguard Realty',
    role: 'Real Estate & Properties',
    emoji: '🏡',
    bgGradient: 'from-emerald-500/10 to-teal-500/10',
    accentColor: 'text-emerald-600 border-emerald-200 bg-emerald-50',
    mockHeadline: 'Find Your Perfect Haven',
    mockSub: 'Discover exclusive luxury apartments and premium family estates in prime urban locations.',
    features: ['Active Listings', 'Virtual Tour Booking', 'Agent Contact', 'Mortgage Calculator'],
    mockTheme: 'serif'
  }
];

export const TEMPLATES: Template[] = [
  {
    id: 'temp-1',
    name: 'Apex Professional',
    category: 'Corporate & Consulting',
    color: 'bg-blue-600',
    image: 'bg-gradient-to-tr from-slate-100 to-blue-50/40',
    rating: 4.9
  },
  {
    id: 'temp-2',
    name: 'Lumina Creative',
    category: 'Portfolio & Studios',
    color: 'bg-amber-500',
    image: 'bg-gradient-to-tr from-stone-100 to-amber-50/40',
    rating: 4.8
  },
  {
    id: 'temp-3',
    name: 'Elysian Boutique',
    category: 'E-commerce & Spa',
    color: 'bg-rose-500',
    image: 'bg-gradient-to-tr from-pink-50 to-rose-100/30',
    rating: 5.0
  },
  {
    id: 'temp-4',
    name: 'Vanguard Minimalist',
    category: 'Tech & Modern Startup',
    color: 'bg-indigo-600',
    image: 'bg-gradient-to-tr from-zinc-100 to-indigo-50/40',
    rating: 4.9
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Free',
    price: '₹0',
    priceAnnual: '₹0',
    description: 'Try OnlyPage risk-free. Build one page, see how it works — upgrade when you\'re ready for real results.',
    features: [
      '1 page only (yourname.onlypage.in)',
      'Basic template designs',
      'Simple page editor',
      '10 leads captured total (lifetime)',
      'Lead details blurred — upgrade to view',
      'Basic analytics (visitor count only)',
      'Standard hosting',
      'OnlyPage branding shown'
    ],
    cta: 'Get Started for Free',
    popular: false
  },
  {
    name: 'Starter',
    price: '₹399',
    priceAnnual: '₹299',
    description: 'Unlock everything your business needs — view leads, add pages, connect WhatsApp, and start converting.',
    features: [
      'Unlimited pages',
      'Remove OnlyPage branding',
      'Connect custom domain (yourname.com)',
      'Full lead view — see names, phone, email',
      'Up to 1,000 leads per month',
      'Full analytics dashboard',
      'WhatsApp Chat button & auto-reply',
      'Booking enquiry form',
      'AI Copywriter & Assistant (50 uses/mo)',
      'Basic CRM (view & tag contacts)',
      'SEO audit tools & optimization',
      'SSL security included'
    ],
    cta: 'Start 7-Day Free Trial',
    popular: true
  },
  {
    name: 'Business',
    price: '₹799',
    priceAnnual: '₹599',
    description: 'For growing businesses needing automation, online payments, ecommerce, and a full CRM suite.',
    features: [
      'Everything in Starter plan',
      'Free .in domain (1 year)',
      'Unlimited leads & page views',
      'Online Booking Engine with payments (Razorpay/UPI)',
      'AI-Powered WhatsApp auto-responder',
      'Full CRM dashboard & lead tagging',
      'Ecommerce storefront (up to 10 products)',
      'Custom forms & database CMS',
      'Team accounts (3 users)',
      'Priority email & WhatsApp support'
    ],
    cta: 'Go Business Pro',
    popular: false
  }
];

export const ADDONS: Addon[] = [
  {
    name: 'Custom Domain',
    price: '₹199/mo',
    description: 'Connect your own domain (yourbusiness.com) to your OnlyPage site.',
    availableOn: ['Free', 'Starter']
  },
  {
    name: 'WhatsApp Automation Pack',
    price: '₹199/mo',
    description: '1,000 AI auto-replies per month for customer enquiries via WhatsApp.',
    availableOn: ['Starter', 'Business']
  },
  {
    name: 'Ecommerce Boost',
    price: '₹299/mo',
    description: 'Unlimited products, inventory management, and order tracking.',
    availableOn: ['Business']
  },
  {
    name: 'Booking + Payments',
    price: '₹249/mo',
    description: 'Online payments with deposit support via Razorpay/UPI for bookings.',
    availableOn: ['Starter', 'Business']
  },
  {
    name: 'AI Content Credits (100 extra)',
    price: '₹99/mo',
    description: 'Additional AI copywriting generations beyond your plan limit.',
    availableOn: ['Free', 'Starter', 'Business']
  },
  {
    name: 'Extra Team Member',
    price: '₹149/mo/user',
    description: 'Add more team accounts beyond the 3 included in Business plan.',
    availableOn: ['Business']
  },
  {
    name: 'Priority Support',
    price: '₹99/mo',
    description: 'WhatsApp and chat response within 1 hour during business hours.',
    availableOn: ['Free', 'Starter', 'Business']
  },
  {
    name: 'Weekly Backup & Restore',
    price: '₹49/mo',
    description: 'Automated weekly backups of your site and customer data.',
    availableOn: ['Starter', 'Business']
  }
];

export const BENTO_FEATURES: FeatureCard[] = [
  {
    id: 'feat-1',
    title: 'Visual Page Builder',
    description: 'Drag, click, and customize stunning components with ease. Fully responsive layout engine designed to look pixel-perfect on every viewport.',
    iconName: 'LayoutTemplate',
    size: 'large',
    badge: 'No-Code',
    demoType: 'builder'
  },
  {
    id: 'feat-2',
    title: 'Visual CMS',
    description: 'Structure blogs, projects, services, or catalog menus in simple tables, and watch them populate beautifully.',
    iconName: 'Database',
    size: 'small',
    demoType: 'cms'
  },
  {
    id: 'feat-3',
    title: 'Smart Web Forms',
    description: 'Capture emails, surveys, and quote requests with customizable logic, spam filters, and elegant submit effects.',
    iconName: 'CheckSquare',
    size: 'small',
    demoType: 'forms'
  },
  {
    id: 'feat-4',
    title: 'AI Smart Copywriter',
    description: 'Enter your business category, and let our AI engine generate headlines, sales pitches, and custom images in seconds.',
    iconName: 'Sparkles',
    size: 'medium',
    badge: 'Popular',
    demoType: 'ai'
  },
  {
    id: 'feat-5',
    title: 'WhatsApp Assistant Bot',
    description: 'Connect your WhatsApp. Our AI reads your page data and answers customer queries about booking, hours, and prices automatically.',
    iconName: 'MessageSquareShare',
    size: 'large',
    badge: 'Automated AI',
    demoType: 'whatsapp'
  },
  {
    id: 'feat-6',
    title: 'Integrated CRM Dashboard',
    description: 'A centralized portal to view leads, tag clients, schedule follow-ups, and send direct emails or WhatsApp follow-ups.',
    iconName: 'Users',
    size: 'medium',
    demoType: 'crm'
  },
  {
    id: 'feat-7',
    title: 'Analytics & SEO',
    description: 'No Google Analytics complex setup required. Get intuitive reports on visits, conversions, bounce rates, and automated SEO tags.',
    iconName: 'TrendingUp',
    size: 'small',
    demoType: 'analytics'
  }
];

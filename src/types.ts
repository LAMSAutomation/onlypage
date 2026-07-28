/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Persona {
  id: string;
  name: string;
  role: string;
  emoji: string;
  bgGradient: string;
  accentColor: string;
  mockHeadline: string;
  mockSub: string;
  features: string[];
  mockTheme: 'modern' | 'warm' | 'serif' | 'clean';
}

export interface Template {
  id: string;
  name: string;
  category: string;
  image: string; // Will use nice inline visual mock layouts with Tailwind
  color: string;
  rating: number;
}

export interface PricingPlan {
  name: string;
  price: string;
  priceAnnual: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export interface Addon {
  name: string;
  price: string;
  description: string;
  availableOn: string[];
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  iconName: string;
  size: 'small' | 'large' | 'medium';
  badge?: string;
  demoType: 'builder' | 'cms' | 'forms' | 'crm' | 'analytics' | 'seo' | 'whatsapp' | 'ai';
}

/**
 * OnlyPage legal page templates — pre-built boilerplate for Indian businesses.
 *
 * These templates comply with:
 * - Information Technology Act, 2000 (India)
 * - Consumer Protection (E-Commerce) Rules, 2020
 * - GDPR (if serving EU customers)
 *
 * Each function receives the business name and returns HTML-like content
 * that can be stored as a page block / rendered in the CMS.
 */

export interface LegalPageTemplate {
  title: string;
  slug: string;
  seoTitle: string;
  seoDesc: string;
  content: string; // HTML-safe content string
}

// ---------------------------------------------------------------------------
// Individual templates
// ---------------------------------------------------------------------------

export function termsAndConditions(businessName: string): LegalPageTemplate {
  return {
    title: 'Terms & Conditions',
    slug: 'terms',
    seoTitle: `Terms & Conditions | ${businessName}`,
    seoDesc: `Read the terms and conditions for using ${businessName}.`,
    content: `
## Terms & Conditions

*Last updated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}*

### 1. Introduction

Welcome to ${businessName}. By accessing or using our website and services, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.

### 2. Services

${businessName} provides [describe your services]. We reserve the right to modify, suspend, or discontinue any part of our services at any time with reasonable notice.

### 3. User Obligations

You agree to:
- Provide accurate and complete information when using our services
- Use our services only for lawful purposes
- Not misuse or attempt to manipulate our booking, enquiry, or payment systems
- Respect intellectual property rights

### 4. Booking & Cancellation

- Appointments or bookings can be made through our website or WhatsApp
- Cancellations must be made at least [X] hours in advance
- Late cancellations or no-shows may be subject to a fee
- ${businessName} reserves the right to cancel or reschedule bookings due to unforeseen circumstances

### 5. Payments & Pricing

- All prices are in Indian Rupees (INR) and inclusive of applicable taxes unless stated otherwise
- Payments are processed securely through Razorpay or UPI
- We do not store your full payment card details
- Receipts and invoices are sent to the email/phone you provide

### 6. Limitation of Liability

${businessName} shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or services, to the maximum extent permitted by Indian law.

### 7. Governing Law

These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in [Your City, State].

### 8. Changes to Terms

We may update these terms from time to time. We will notify you of significant changes via email or WhatsApp.

### 9. Contact

For questions about these terms, contact us at:
- Phone: [Your Phone Number]
- Website: [Your Website URL]
    `.trim(),
  };
}

export function privacyPolicy(businessName: string): LegalPageTemplate {
  return {
    title: 'Privacy Policy',
    slug: 'privacy',
    seoTitle: `Privacy Policy | ${businessName}`,
    seoDesc: `How ${businessName} collects, uses, and protects your personal information.`,
    content: `
## Privacy Policy

*Last updated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}*

### 1. Information We Collect

When you use ${businessName}, we may collect:
- **Personal Information**: Name, phone number, email address, and address
- **Booking Information**: Service preferences, appointment dates, special requests
- **Payment Information**: Payment method and transaction ID (processed securely via Razorpay/UPI — we do not store full card details)
- **Technical Data**: IP address, browser type, pages visited, and time of visit

### 2. How We Use Your Information

We use your information to:
- Provide and manage our services, bookings, and enquiries
- Communicate with you via WhatsApp, email, or phone
- Process payments and send receipts
- Improve our website and customer experience
- Comply with legal obligations

### 3. Data Sharing

We do not sell your personal information. We may share data with:
- **Payment processors** (Razorpay) to process transactions
- **Service providers** who help us operate our website and communications
- **Legal authorities** when required by law

### 4. Data Retention

We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time.

### 5. Your Rights

You have the right to:
- Access the personal data we hold about you
- Request correction or deletion of your data
- Withdraw consent for communications at any time
- File a complaint with the relevant data protection authority

### 6. Security

We implement reasonable security measures to protect your information, including SSL encryption, secure payment gateways, and restricted data access.

### 7. Contact

For privacy-related inquiries, contact us at [Your Phone Number] or through our website.
    `.trim(),
  };
}

export function shippingPolicy(businessName: string): LegalPageTemplate {
  return {
    title: 'Shipping Policy',
    slug: 'shipping',
    seoTitle: `Shipping Policy | ${businessName}`,
    seoDesc: `${businessName} shipping timelines, costs, and delivery areas.`,
    content: `
## Shipping Policy

*Last updated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}*

### 1. Delivery Areas

${businessName} currently ships to [list your serviceable areas]. We aim to expand our delivery coverage over time.

### 2. Processing Time

Orders are processed within [X] business days after payment confirmation. You will receive a confirmation message once your order is dispatched.

### 3. Shipping Charges

- Orders above ₹[amount]: Free shipping
- Orders below ₹[amount]: Shipping charges of ₹[amount] apply
- Shipping charges are displayed at checkout before payment

### 4. Delivery Timeline

- Local delivery: [X] to [Y] business days
- Outstation delivery: [X] to [Y] business days
- Timelines may vary during festivals or unforeseen circumstances

### 5. Tracking

Once your order is dispatched, you will receive tracking details via WhatsApp or SMS where available.

### 6. Failed Delivery

If delivery fails due to an incorrect address or repeated non-availability, we will contact you to reschedule. Additional shipping charges may apply for re-delivery.

### 7. Contact

For shipping-related queries, contact us at [Your Phone Number].
    `.trim(),
  };
}

export function refundPolicy(businessName: string): LegalPageTemplate {
  return {
    title: 'Refund & Cancellation Policy',
    slug: 'refund',
    seoTitle: `Refund Policy | ${businessName}`,
    seoDesc: `${businessName} refund, return, and cancellation terms.`,
    content: `
## Refund & Cancellation Policy

*Last updated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}*

### 1. Cancellation Policy

- Orders can be cancelled within [X] hours of placement for a full refund
- To cancel, contact us via WhatsApp or phone with your order number
- Once an order has been shipped/dispatched, cancellation may not be possible

### 2. Refund Policy

Refunds are processed under the following conditions:
- **Defective/Damaged Products**: Full refund or replacement within [X] days of delivery
- **Wrong Item Delivered**: Full refund or exchange at no extra cost
- **Service Not Rendered**: Full refund for bookings cancelled by ${businessName}
- **Change of Mind**: Refund may not apply. Store credit may be offered at our discretion

### 3. Refund Timeline

- Refunds are processed within [X] to [Y] business days after approval
- Amount is credited to the original payment method (Razorpay/UPI)
- You will receive a confirmation message once the refund is initiated

### 4. Non-Refundable Items

The following are not eligible for refund:
- Gift cards and vouchers
- Services already rendered
- Digital products or downloads
- Items marked as "Final Sale"

### 5. Return Process

To initiate a return or refund:
1. Contact us within [X] days of receiving your order
2. Provide your order number and reason
3. We will guide you through the next steps
4. Return shipping may be covered or charged depending on the reason

### 6. Contact

For refund and cancellation requests, contact us:
- Phone: [Your Phone Number]
- WhatsApp: [Your WhatsApp Number]
    `.trim(),
  };
}

// ---------------------------------------------------------------------------
// Helper: get the right set of legal pages for a business type
// ---------------------------------------------------------------------------

export type BusinessCategory = 'ecommerce' | 'service' | 'salon' | 'creator' | 'student';

/** Map a dashboard mode (PROJECT_TYPE id) to a BusinessCategory. */
export function dashboardModeToCategory(mode: string): BusinessCategory {
  const map: Record<string, BusinessCategory> = {
    store: 'ecommerce',
    business: 'service',
    salon: 'salon',
    creator: 'creator',
    student: 'student',
  };
  return map[mode] ?? 'service';
}

/** Map a launch business type to a BusinessCategory. */
export function launchTypeToCategory(bizType: string): BusinessCategory {
  const map: Record<string, BusinessCategory> = {
    'local-service': 'service',
    salon: 'salon',
    clinic: 'service',
    creator: 'creator',
    'real-estate': 'service',
  };
  return map[bizType] ?? 'service';
}

/** Returns the legal pages that should be auto-created for a given business type. */
export function getLegalPagesForBusiness(
  businessName: string,
  category: BusinessCategory,
): LegalPageTemplate[] {
  const pages: LegalPageTemplate[] = [
    termsAndConditions(businessName),
    privacyPolicy(businessName),
  ];

  // Ecommerce needs shipping + refund policies (legal mandate in India)
  if (category === 'ecommerce') {
    pages.push(shippingPolicy(businessName));
    pages.push(refundPolicy(businessName));
  }

  // Service businesses should also have a refund/cancellation policy
  if (category === 'service' || category === 'salon') {
    pages.push(refundPolicy(businessName));
  }

  return pages;
}

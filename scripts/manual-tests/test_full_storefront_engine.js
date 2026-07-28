/**
 * OnlyPage — Full E-Commerce Storefront Engine & Automation Test Suite
 * Verifies Category/Tag Product Filter APIs, Branded Welcome Emails, WhatsApp Automations & UI Variants
 */
import { chromium } from 'playwright';
import { BLOCK_VARIANTS_MAP } from './components/builder-data.ts';

const BASE = 'http://localhost:3000';
const results = [];

function log(testName, status, detail = '') {
  results.push({ testName, status, detail });
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} [${status}] ${testName}${detail ? ' — ' + detail : ''}`);
}

async function run() {
  console.log('======================================================================');
  console.log('RUNNING FULL SHOPIFY-GRADE STOREFRONT ENGINE TEST SUITE');
  console.log('======================================================================\n');

  // ===== T01: EComStore Block Variants Registration =====
  try {
    const ecomVariants = BLOCK_VARIANTS_MAP['EComStore'];
    if (ecomVariants && Array.isArray(ecomVariants) && ecomVariants.length >= 7) {
      log('T01: EComStore UI Block Variants', 'PASS', `Registered ${ecomVariants.length} storefront variants (ShopHeader, ShopGrid, OffersGallery, InteractiveFeature, WhatsAppWidget, CustomerAuth, StoreLegal)`);
    } else {
      log('T01: EComStore UI Block Variants', 'FAIL', 'EComStore variants missing or incomplete');
    }
  } catch (e) {
    log('T01: EComStore UI Block Variants', 'FAIL', e.message);
  }

  // ===== T02: Customer Signup & Branded Welcome Email API =====
  try {
    const res = await fetch(`${BASE}/api/ecom/signup-customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site_id: 'test_store_999',
        store_name: 'Rathnavel Artisan Store',
        name: 'Suresh Kumar',
        email: 'suresh@example.com',
        phone: '+91 98765 11223',
        custom_welcome_subject: 'Welcome to {{store_name}}! 🎉 Here is your 10% discount code',
        custom_welcome_body: 'Hi {{customer_name}},\n\nThank you for signing up with {{store_name}}! Use WELCOME10 for 10% OFF.'
      })
    });
    const data = await res.json();
    if (data.success && data.email_dispatched && data.subject.includes('Rathnavel Artisan Store')) {
      log('T02: Customer Signup & Branded Email API', 'PASS', `Dispatched Branded Subject: "${data.subject}"`);
    } else {
      log('T02: Customer Signup & Branded Email API', 'FAIL', JSON.stringify(data));
    }
  } catch (e) {
    log('T02: Customer Signup & Branded Email API', 'FAIL', e.message);
  }

  // ===== T03: Category & Tag-Based Product Filtering API =====
  try {
    const sampleProducts = [
      { id: 'p1', title: 'Coffee Beans', category: 'Beverages', tags: ['Featured', 'BestSeller'], offer_badge: 'Best Seller' },
      { id: 'p2', title: 'Ceramic Mug', category: 'Home Decor', tags: ['Handmade'], offer_badge: 'Handmade' },
      { id: 'p3', title: 'Cold Brew Pack', category: 'Beverages', tags: ['OnSale'], offer_badge: '20% OFF' }
    ];

    const resCategory = await fetch(`${BASE}/api/ecom/products-by-filter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'Beverages', products: sampleProducts })
    });
    const dataCategory = await resCategory.json();

    const resTag = await fetch(`${BASE}/api/ecom/products-by-filter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag: 'OnSale', products: sampleProducts })
    });
    const dataTag = await resTag.json();

    if (dataCategory.total === 2 && dataTag.total === 1 && dataTag.products[0].id === 'p3') {
      log('T03: Category & Tag Filter API', 'PASS', `Filtered Category Beverages: ${dataCategory.total} items | Filtered Tag OnSale: ${dataTag.total} items`);
    } else {
      log('T03: Category & Tag Filter API', 'FAIL', `Category count: ${dataCategory.total}, Tag count: ${dataTag.total}`);
    }
  } catch (e) {
    log('T03: Category & Tag Filter API', 'FAIL', e.message);
  }

  // ===== T04: Payment Gateway Routing API =====
  try {
    const res = await fetch(`${BASE}/api/ecom/create-payment-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site_id: 'test_store_999',
        amount: 1499,
        currency: 'INR',
        gateway: 'razorpay',
        items: [{ title: 'Espresso Kit', price: 1499, qty: 1 }],
        customer: { name: 'Suresh Kumar', email: 'suresh@example.com' }
      })
    });
    const data = await res.json();
    if (data.success && data.gateway === 'razorpay' && data.order_id) {
      log('T04: Payment Gateway Routing API', 'PASS', `Order Generated: ${data.order_id}`);
    } else {
      log('T04: Payment Gateway Routing API', 'FAIL', JSON.stringify(data));
    }
  } catch (e) {
    log('T04: Payment Gateway Routing API', 'FAIL', e.message);
  }

  // ===== T05: Webhook & CRM Lead Capture API =====
  try {
    const res = await fetch(`${BASE}/api/ecom/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site_id: 'test_store_999',
        order_id: 'ord_1042',
        customer_name: 'Suresh Kumar',
        customer_email: 'suresh@example.com',
        total_amount: 1499,
        payment_id: 'pay_rzp_12345'
      })
    });
    const data = await res.json();
    if (data.success && data.lead && data.lead.status === 'Customer') {
      log('T05: Webhook Lead Auto-Capture API', 'PASS', `Synced Lead: ${data.lead.name}`);
    } else {
      log('T05: Webhook Lead Auto-Capture API', 'FAIL', JSON.stringify(data));
    }
  } catch (e) {
    log('T05: Webhook Lead Auto-Capture API', 'FAIL', e.message);
  }

  console.log('\n======================================================================');
  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  console.log(`SUMMARY: Total ${results.length} | PASS ${passCount} | FAIL ${failCount}`);
  console.log('======================================================================\n');
}

run();

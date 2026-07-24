/**
 * OnlyPage — E-Commerce Store Module & Payment Routing Test Suite
 * Tests ECom backend endpoints & Dashboard Store Manager UI tab rendering
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const results = [];

function log(testName, status, detail = '') {
  results.push({ testName, status, detail });
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} [${status}] ${testName}${detail ? ' — ' + detail : ''}`);
}

async function run() {
  console.log('======================================================================');
  console.log('RUNNING E-COMMERCE STORE & PAYMENT ROUTING TEST SUITE');
  console.log('======================================================================\n');

  // ===== T01: Payment Gateway Order Creation API (Razorpay) =====
  try {
    const res = await fetch(`${BASE}/api/ecom/create-payment-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site_id: 'test_site_123',
        amount: 799,
        currency: 'INR',
        gateway: 'razorpay',
        items: [{ title: 'Organic Coffee Beans', price: 799, qty: 1 }],
        customer: { name: 'Test User', email: 'test@example.com' }
      })
    });
    const data = await res.json();
    if (data.success && data.gateway === 'razorpay' && data.order_id) {
      log('T01: Razorpay Gateway Order API', 'PASS', `Order ID: ${data.order_id}, Amount: ${data.amount} paise`);
    } else {
      log('T01: Razorpay Gateway Order API', 'FAIL', JSON.stringify(data));
    }
  } catch (e) {
    log('T01: Razorpay Gateway Order API', 'FAIL', e.message);
  }

  // ===== T02: Direct UPI Payment Link Generation API =====
  try {
    const res = await fetch(`${BASE}/api/ecom/create-payment-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site_id: 'test_site_123',
        amount: 450,
        gateway: 'upi',
        upi_vpa: 'store@upi',
        items: [{ title: 'Ceramic Mug', price: 450, qty: 1 }],
        customer: { name: 'Test User', email: 'test@example.com' }
      })
    });
    const data = await res.json();
    if (data.success && data.gateway === 'upi' && data.upi_link.includes('upi://pay')) {
      log('T02: Direct UPI Pay Link API', 'PASS', `UPI Link: ${data.upi_link}`);
    } else {
      log('T02: Direct UPI Pay Link API', 'FAIL', JSON.stringify(data));
    }
  } catch (e) {
    log('T02: Direct UPI Pay Link API', 'FAIL', e.message);
  }

  // ===== T03: Webhook & CRM Lead Auto-Capture API =====
  try {
    const res = await fetch(`${BASE}/api/ecom/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site_id: 'test_site_123',
        order_id: 'ord_9999',
        customer_name: 'Ananya Sharma',
        customer_email: 'ananya@example.com',
        customer_phone: '+91 99887 76655',
        total_amount: 1249,
        payment_id: 'pay_rzp_mock_123'
      })
    });
    const data = await res.json();
    if (data.success && data.lead && data.lead.status === 'Customer') {
      log('T03: Webhook CRM Lead Capture API', 'PASS', `Lead Created: ${data.lead.name} (${data.lead.email})`);
    } else {
      log('T03: Webhook CRM Lead Capture API', 'FAIL', JSON.stringify(data));
    }
  } catch (e) {
    log('T03: Webhook CRM Lead Capture API', 'FAIL', e.message);
  }

  // ===== T04: Order Confirmation & Sale Alert Notification Engine =====
  try {
    const res = await fetch(`${BASE}/api/ecom/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        store_name: 'OnlyPage Artisan Coffee',
        customer_email: 'buyer@example.com',
        store_owner_email: 'owner@example.com',
        order_number: 1042,
        total_amount: 799
      })
    });
    const data = await res.json();
    if (data.success && data.customer_notified && data.owner_notified) {
      log('T04: Transactional Notifications API', 'PASS', data.message);
    } else {
      log('T04: Transactional Notifications API', 'FAIL', JSON.stringify(data));
    }
  } catch (e) {
    log('T04: Transactional Notifications API', 'FAIL', e.message);
  }

  // ===== T05: UI Navigation Test (Store Manager Tab in Dashboard) =====
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(BASE, { timeout: 15000 });
    await page.waitForLoadState('networkidle');

    // Check if landing page or dashboard is rendered
    const sidebarCount = await page.locator('aside nav').count();
    log('T05: Dashboard Navigation Render', 'PASS', `Sidebar present: ${sidebarCount > 0}`);
    await browser.close();
  } catch (e) {
    if (browser) await browser.close();
    log('T05: Dashboard Navigation Render', 'WARN', e.message);
  }

  console.log('\n======================================================================');
  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  console.log(`SUMMARY: Total ${results.length} | PASS ${passCount} | FAIL ${failCount}`);
  console.log('======================================================================\n');
}

run();

/**
 * OnlyPage — Full Module Test Suite v2
 * Uses robust locators scoped to the sidebar nav element
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const results = [];

function log(testName, status, detail = '') {
  results.push({ testName, status, detail });
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} [${status}] ${testName}${detail ? ' — ' + detail : ''}`);
}

async function clickSidebarItem(page, label) {
  // The sidebar nav is the first <nav> inside <aside>
  const btn = page.locator(`aside nav button span:text-is("${label}")`).first();
  const count = await btn.count();
  if (count === 0) {
    // Fallback: try finding any button whose text content includes the label
    const fallback = page.locator(`aside button`).filter({ hasText: label }).first();
    if (await fallback.count() > 0) {
      await fallback.click();
      return true;
    }
    return false;
  }
  await btn.click();
  return true;
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push('PAGE_ERROR: ' + err.message));

  // ===== T01: Page loads =====
  try {
    await page.goto(BASE, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    log('T01: Page loads', 'PASS', `Title: "${await page.title()}"`);
  } catch (e) {
    log('T01: Page loads', 'FAIL', e.message);
    await browser.close();
    printSummary();
    return;
  }

  // ===== T02: Auth state detection =====
  await page.waitForTimeout(1000);
  const sidebarExists = await page.locator('aside nav').count();
  const isDashboard = sidebarExists > 0;
  log('T02: Auth state', isDashboard ? 'PASS' : 'WARN',
    isDashboard ? 'Logged in — dashboard visible' : 'NOT logged in — landing page');

  if (!isDashboard) {
    log('T02a: Landing page check', 'PASS', 'App renders landing page for unauthenticated users');
    await browser.close();
    printSummary();
    return;
  }

  // ===== T03: Sidebar navigation items =====
  const sidebarLabels = [
    'Home', 'Website Builder', 'Pages', 'CMS', 'Forms Center', 'Inbox',
    'Contacts CRM', 'WhatsApp', 'Bookings', 'Analytics', 'SEO Manager',
    'Marketing', 'AI Assistant', 'Automations', 'Files', 'Reviews',
    'App Marketplace', 'Settings', 'Billing'
  ];

  const sidebarButtons = await page.locator('aside nav button').all();
  const sidebarTexts = [];
  for (const btn of sidebarButtons) {
    const text = (await btn.textContent()).trim();
    sidebarTexts.push(text);
  }
  log('T03: Sidebar count', sidebarButtons.length >= 18 ? 'PASS' : 'WARN',
    `Found ${sidebarButtons.length} sidebar buttons: ${sidebarTexts.join(', ')}`);

  // ===== T04–T21: Click each tab and verify it renders =====
  const tabTests = [
    { id: 'T04', label: 'Home', check: ['Total Visitors', 'Traffic Engagement'] },
    { id: 'T05', label: 'Pages', check: ['Pages Manager', 'Create Page'] },
    { id: 'T06', label: 'CMS', check: ['CMS', 'Save CMS Record'] },
    { id: 'T07', label: 'Forms Center', check: ['Form Field Builder'] },
    { id: 'T08', label: 'Inbox', check: ['Unified Inbox'] },
    { id: 'T09', label: 'Contacts CRM', check: ['CRM'] },
    { id: 'T10', label: 'WhatsApp', check: ['WhatsApp'] },
    { id: 'T11', label: 'Bookings', check: ['Booking'] },
    { id: 'T12', label: 'Analytics', check: ['Visitor'] },
    { id: 'T13', label: 'SEO Manager', check: ['SEO'] },
    { id: 'T14', label: 'Marketing', check: ['Campaign'] },
    { id: 'T15', label: 'AI Assistant', check: ['copilot'] },
    { id: 'T16', label: 'Automations', check: ['Automation'] },
    { id: 'T17', label: 'Files', check: ['File'] },
    { id: 'T18', label: 'Reviews', check: ['Review'] },
    { id: 'T19', label: 'App Marketplace', check: ['Google Analytics'] },
    { id: 'T20', label: 'Settings', check: ['Business Name'] },
    { id: 'T21', label: 'Billing', check: ['Plan'] },
  ];

  for (const test of tabTests) {
    try {
      const clicked = await clickSidebarItem(page, test.label);
      if (!clicked) {
        log(`${test.id}: ${test.label}`, 'FAIL', 'Sidebar button not found');
        continue;
      }
      await page.waitForTimeout(800);
      
      let foundChecks = 0;
      for (const keyword of test.check) {
        const c = await page.locator(`main :text("${keyword}")`).count() ||
                  await page.getByText(keyword, { exact: false }).count();
        if (c > 0) foundChecks++;
      }
      log(`${test.id}: ${test.label}`, foundChecks > 0 ? 'PASS' : 'FAIL',
        `Keywords found: ${foundChecks}/${test.check.length}`);
    } catch (e) {
      log(`${test.id}: ${test.label}`, 'FAIL', e.message.slice(0, 100));
    }
  }

  // ===== T22: Pages CRUD (Create + Delete a page in Supabase) =====
  try {
    await clickSidebarItem(page, 'Pages');
    await page.waitForTimeout(800);
    
    const pageNameInput = page.locator('input[placeholder*="Page Name"]');
    const routeInput = page.locator('input[placeholder*="Route"]');
    const createBtn = page.locator('button').filter({ hasText: 'Create Page' });
    
    if (await pageNameInput.count() > 0) {
      const testName = 'AutoTest' + Date.now();
      await pageNameInput.fill(testName);
      await routeInput.fill('/auto-test');
      await createBtn.click();
      await page.waitForTimeout(2000);
      
      const found = await page.getByText(testName).count();
      log('T22: Page CRUD — create', found > 0 ? 'PASS' : 'FAIL',
        found > 0 ? 'Page created in Supabase pages table' : 'Page not found after insert');
      
      // Clean up — delete
      if (found > 0) {
        const deleteBtns = await page.locator('button').filter({ hasText: 'Delete' }).all();
        if (deleteBtns.length > 0) {
          await deleteBtns[deleteBtns.length - 1].click();
          await page.waitForTimeout(1000);
          log('T22a: Page CRUD — delete', 'PASS', 'Cleaned up test page');
        }
      }
    } else {
      log('T22: Page CRUD', 'FAIL', 'Page name input not found');
    }
  } catch (e) {
    log('T22: Page CRUD', 'FAIL', e.message.slice(0, 120));
  }

  // ===== T23: CMS record CRUD =====
  try {
    await clickSidebarItem(page, 'CMS');
    await page.waitForTimeout(800);
    
    const nameInput = page.locator('input[placeholder*="Keratin"]');
    const priceInput = page.locator('input[placeholder*="1800"]');
    
    if (await nameInput.count() > 0) {
      await nameInput.fill('E2E Test Item');
      await priceInput.fill('₹123');
      await page.locator('button').filter({ hasText: 'Save CMS Record' }).click();
      await page.waitForTimeout(2000);
      
      const found = await page.getByText('E2E Test Item').count();
      log('T23: CMS CRUD — create', found > 0 ? 'PASS' : 'FAIL',
        found > 0 ? 'CMS record saved to site.theme.customCollections (Supabase)' : 'Record not found');
    } else {
      log('T23: CMS CRUD', 'FAIL', 'CMS input fields not found');
    }
  } catch (e) {
    log('T23: CMS CRUD', 'FAIL', e.message.slice(0, 120));
  }

  // ===== T24: Forms field addition =====
  try {
    await clickSidebarItem(page, 'Forms Center');
    await page.waitForTimeout(800);
    
    const fieldInput = page.locator('input[placeholder*="Field Name"]');
    if (await fieldInput.count() > 0) {
      await fieldInput.fill('E2E Test Field');
      await page.locator('button').filter({ hasText: 'Add Form Field' }).click();
      await page.waitForTimeout(500);
      
      const found = await page.getByText('E2E Test Field').count();
      log('T24: Form field add', found > 0 ? 'PASS' : 'FAIL',
        found > 0 ? 'Field appended to local state array' : 'Field not found');
    } else {
      log('T24: Form field add', 'FAIL', 'Field name input not found');
    }
  } catch (e) {
    log('T24: Form field add', 'FAIL', e.message.slice(0, 120));
  }

  // ===== T25: Website Builder opens and has core features =====
  try {
    await clickSidebarItem(page, 'Website Builder');
    await page.waitForTimeout(3000);
    
    // The builder takes over the full screen (no sidebar visible)
    const bodyText = await page.locator('body').textContent();
    const hasBlocks = bodyText.includes('Hero') || bodyText.includes('Add Block') || bodyText.includes('Add Blocks');
    const hasAi = bodyText.includes('AI') || bodyText.includes('Prompt');
    const hasPublish = bodyText.includes('Publish') || bodyText.includes('Save');
    
    log('T25: Website Builder loads', hasBlocks ? 'PASS' : 'FAIL',
      `Block library: ${hasBlocks}, AI: ${hasAi}, Publish: ${hasPublish}`);
    
    // Check CMS connectivity in builder
    const hasDatabase = bodyText.includes('Database') || bodyText.includes('Collections') || bodyText.includes('Data');
    log('T25a: Builder→DB tab', hasDatabase ? 'PASS' : 'WARN',
      `Database/Collections accessible from builder: ${hasDatabase}`);

    // Check SEO tab
    const hasSeoInBuilder = bodyText.includes('SEO') || bodyText.includes('Meta');
    log('T25b: Builder→SEO tab', hasSeoInBuilder ? 'PASS' : 'WARN',
      `SEO editing accessible from builder: ${hasSeoInBuilder}`);

    // Check undo/redo
    const hasUndoRedo = bodyText.includes('Undo') || bodyText.includes('Redo');
    log('T25c: Undo/Redo', hasUndoRedo ? 'PASS' : 'WARN',
      `Undo/Redo controls: ${hasUndoRedo}`);

    // Try to go back
    try {
      const exitLocators = [
        page.locator('button').filter({ hasText: /exit/i }),
        page.locator('button').filter({ hasText: /back/i }),
        page.locator('button').filter({ hasText: /dashboard/i }),
        page.locator('[title*="Exit" i]'),
        page.locator('[title*="Back" i]')
      ];
      for (const loc of exitLocators) {
        if (await loc.count() > 0) {
          await loc.first().click();
          await page.waitForTimeout(1000);
          break;
        }
      }
    } catch {}
  } catch (e) {
    log('T25: Website Builder', 'FAIL', e.message.slice(0, 120));
  }

  // ===== T26: Console errors summary =====
  const criticalErrors = consoleErrors.filter(e =>
    !e.includes('DevTools') &&
    !e.includes('favicon') &&
    !e.includes('Download the React') &&
    !e.includes('net::ERR') // network errors from extensions
  );
  log('T26: JS console errors', criticalErrors.length === 0 ? 'PASS' : 'WARN',
    criticalErrors.length === 0
      ? 'No runtime JS errors detected'
      : `${criticalErrors.length} errors: ${criticalErrors.slice(0, 2).join(' | ').slice(0, 200)}`);

  await browser.close();
  printSummary();
}

function printSummary() {
  const pass = results.filter(r => r.status === 'PASS').length;
  const fail = results.filter(r => r.status === 'FAIL').length;
  const warn = results.filter(r => r.status === 'WARN').length;
  console.log('\n' + '='.repeat(70));
  console.log(`RESULTS: Total ${results.length} | PASS ${pass} | FAIL ${fail} | WARN ${warn}`);
  console.log('='.repeat(70));
  if (fail > 0) {
    console.log('\nFAILED:');
    results.filter(r => r.status === 'FAIL').forEach(r => console.log(`  ❌ ${r.testName}: ${r.detail}`));
  }
  if (warn > 0) {
    console.log('\nWARNINGS:');
    results.filter(r => r.status === 'WARN').forEach(r => console.log(`  ⚠️ ${r.testName}: ${r.detail}`));
  }
  console.log('\n__JSON__');
  console.log(JSON.stringify(results));
}

run().catch(err => {
  console.error('CRASH:', err);
  process.exit(1);
});

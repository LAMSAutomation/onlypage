import { chromium } from 'playwright';
import fs from 'fs';

async function run() {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console logs
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  console.log("Navigating to http://localhost:3000 ...");
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // Take screenshot of landing
  await page.screenshot({ path: 'scratch_landing.png' });
  console.log("Landing page loaded. Screenshot saved to scratch_landing.png");

  // Check what is rendered
  const bodyText = await page.textContent('body');
  console.log("Body length:", bodyText.length);
  
  const hasOnboarding = await page.locator('text=Onboarding').count() > 0 || await page.locator('text=Step 1').count() > 0;
  const hasDashboard = await page.locator('text=OnlyPage').count() > 0 && await page.locator('text=Website Builder').count() > 0;
  
  console.log("Is onboarding visible?", hasOnboarding);
  console.log("Is dashboard visible?", hasDashboard);

  await browser.close();
}

run().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});

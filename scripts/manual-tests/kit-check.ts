/**
 * Kit validation script — runs every site kit builder and verifies the output shape.
 * Run: npx tsx scripts/manual-tests/kit-check.ts
 */
import { SITE_KITS, getSiteKit } from "../../components/site-kits";

const CATEGORIES = [
  "Premium Multi-Purpose",
  "Education & Courses",
  "Professional Services",
  "Local Business & E-com",
  "Creative Portfolio",
];

let failed = 0;

console.log(`\n${SITE_KITS.length} kits registered\n`);

// 1. Category distribution — exactly 4 per category
for (const cat of CATEGORIES) {
  const count = SITE_KITS.filter((k) => k.category === cat).length;
  const status = count === 4 ? "OK " : "FAIL";
  if (count !== 4) failed++;
  console.log(`${status} ${cat.padEnd(28)} ${count}/4`);
}
const unknown = SITE_KITS.filter((k) => !CATEGORIES.includes(k.category));
if (unknown.length) {
  failed++;
  console.log(`FAIL unknown categories: ${unknown.map((k) => `${k.id}->${k.category}`).join(", ")}`);
}

// 2. Unique ids
const ids = SITE_KITS.map((k) => k.id);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length) {
  failed++;
  console.log(`FAIL duplicate kit ids: ${dupes.join(", ")}`);
}

// 3. Every builder returns a valid 5-page site with header/footer and valid blocks
console.log("\n--- building every kit ---");
for (const kit of SITE_KITS) {
  try {
    const site = kit.build("My Business");
    const issues: string[] = [];
    if (!site.header || !site.footer) issues.push("missing header/footer");
    if (!Array.isArray(site.pages) || site.pages.length !== 5) issues.push(`pages=${site.pages?.length}`);
    for (const p of site.pages) {
      if (!p.name || !p.slug) issues.push(`page missing name/slug (${p.name}/${p.slug})`);
      if (!Array.isArray(p.blocks) || p.blocks.length === 0) issues.push(`page ${p.slug} has no blocks`);
      for (const b of p.blocks) {
        if (!b.type || !b.variant) issues.push(`block missing type/variant on ${p.slug}`);
        if (!b.styles) issues.push(`block missing styles on ${p.slug}`);
      }
    }
    if (site.products && site.products.some((pr) => !pr.title || !pr.price)) issues.push("product missing title/price");
    if (issues.length) {
      failed++;
      console.log(`FAIL ${kit.id.padEnd(24)} ${issues.join("; ")}`);
    } else {
      const total = site.pages.reduce((n, p) => n + p.blocks.length, 0);
      const perPage = site.pages.map((p) => `${p.slug}:${p.blocks.length}`).join(" ");
      console.log(`OK  ${kit.id.padEnd(24)} ${String(total).padStart(3)} blocks [${perPage}]${site.products ? ` · ${site.products.length} products` : ""}`);
    }
  } catch (err) {
    failed++;
    console.log(`FAIL ${kit.id} threw: ${err instanceof Error ? err.message : err}`);
  }
}

// 4. getSiteKit works for every id
const missing = SITE_KITS.filter((k) => !getSiteKit(k.id));
if (missing.length) {
  failed++;
  console.log(`FAIL getSiteKit misses: ${missing.map((k) => k.id).join(", ")}`);
}

console.log(`\n${failed === 0 ? "✅ ALL CHECKS PASSED" : `❌ ${failed} checks failed`}\n`);
process.exit(failed === 0 ? 0 : 1);

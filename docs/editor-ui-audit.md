# Website Editor UI Audit — `components/visual-builder.tsx`

**Audited:** 2026-08-06
**Target:** `components/visual-builder.tsx` (5,775 lines) — the live editor, mounted via `components/ui/efferd-dashboard-2.tsx`
**Dead code:** `components/website-builder-editor.tsx` (5,086 lines) — component unused; only its `WebBlock` / `BlockCSSStyles` types are imported by 10 files
**Stack:** React 19 + Tailwind v4 (CSS-first, no `tailwind.config`), Radix Tabs, Framer Motion, Lucide

---

## Verdict

The editor does not look bad because of any single ugly element. It looks bad because **there is no design system**. Every panel, over 5,775 lines, invented its own font size, radius, spacing, and label treatment. That accumulated inconsistency is exactly what reads as "AI slop."

Four root causes, in severity order:

1. **Micro-typography** — 147 instances of text below 12px, 55 of them also low-contrast
2. **No token layer** — 307 raw `slate-*` refs, 5 radius variants, 12 spacing steps
3. **Broken keyboard accessibility** — 29 `outline-none`, 0 `focus-visible`
4. **Dead-feeling controls** — 43 of 48 buttons unlabeled, 30 of 49 clickables lack `cursor-pointer`

---

## 1. Micro-typography (CRITICAL — the #1 "slop" signal)

| Size | Count | Verdict |
|------|-------|---------|
| `text-[10px]` | 75 | Below the 12px readability floor |
| `text-[9px]` | 37 | Unreadable at normal viewing distance |
| `text-[11px]` | 18 | Borderline; acceptable only for dense inspector labels |
| `text-[8px]` | 12 | Not text — decoration |
| `text-[7px]` | 5 | Not text — decoration |
| **Total sub-12px** | **147** | |

**Compounding factor:** 55 of these pair a sub-11px size with `text-slate-400` or `text-slate-300`.
`slate-400` (#94A3B8) on white = **2.8:1 contrast**. WCAG AA requires 4.5:1. These fail by a wide margin.

**Where it concentrates** (occurrences of sub-11px text per component):

```
19  VisualBuilder          (main chrome — header, canvas, panels)
17  BuilderDataConnections
15  BlockContentEditor
13  StylePanel
12  VariantPicker
11  LeadRoutingPanel
10  ActionPanel
 6  SiteKitsModal
 5  PageManagerModal / ImageCropModal
 4  MiniField / InspectorCollection
```

**Also:** 23 instances of `text-[10px] uppercase tracking-[0.14em] font-black`. Uppercase + wide tracking + 10px + black weight is the single most recognizable "AI generated dashboard" tell. Figma, Webflow, and Framer all use 11–12px sentence-case or small-caps at `font-medium` for section labels.

**Concrete examples:**
- `visual-builder.tsx:1667` — `text-[10px] font-semibold text-slate-400` — "Visual Builder" subtitle
- `visual-builder.tsx:1727` — `text-[9px] text-slate-400` — the `⌘K` kbd hint
- `visual-builder.tsx:1783` — `text-[10px] font-black uppercase tracking-[0.14em] text-slate-400` — "Active Page"
- `visual-builder.tsx:1850` — `text-[10px] font-semibold text-slate-400` — "Click any section to edit"
- `visual-builder.tsx:2022` — `text-[10px] font-black uppercase tracking-[0.14em] text-slate-400` — "Editing section"

---

## 2. No token layer

`src/index.css` has an `@theme` block but it only defines fonts and four fluid heading clamps. Zero color, radius, or spacing tokens. Result:

| Dimension | Variants found | Should be |
|-----------|----------------|-----------|
| Border radius | `md`, `lg`, `xl`, `2xl`, `3xl`, `[28px]` — 6 kinds | 3 (control / panel / modal) |
| Padding | `p-1 1.5 2 2.5 3 3.5 4 5 6 7 8` — 12 steps | 4–5 on a 4px rhythm |
| Font weight | `black` ×105, `bold` ×47, `semibold` ×7, `medium` ×6 | Inverted — `black` should be rarest |
| Color refs | 307 raw `slate-*` + hardcoded `#1c2521`, `#f3f5f4` | Semantic tokens |

**Font weight is backwards.** 105 uses of `font-black` (900) against 6 of `font-medium` (500) means hierarchy is expressed by *nothing* — when everything is heaviest weight, weight carries no information. Professional editors invert this: `font-medium` is the default, `font-semibold` marks emphasis, `font-bold` is rare.

**Hardcoded brand colors:** `#1c2521` (dark green) and `#f3f5f4` (canvas) appear inline at `1652`, `1772`, `1896`, `1917`, `1963`, `2008`. Not tokenized, so no dark mode path and no single point of change.

---

## 3. Keyboard accessibility is broken

| Check | Found | Required |
|-------|-------|----------|
| `focus-visible:` rings | **0** | Every interactive element |
| `outline-none` | 29 | Only when paired with a replacement ring |
| `aria-label` | 5 | ~48 (one per icon-only button) |

29 elements strip the native focus outline and **nothing replaces it**. Tab through the editor and the focus position is invisible. This is a WCAG 2.4.7 failure and it also makes the tool feel unfinished to sighted power users who expect keyboard flow.

43 of 48 `<button>` elements have no accessible name. Several use `title=` (22 instances), which is a tooltip, not an accessible name, and never appears on touch devices.

**Also missing:**
- `prefers-reduced-motion` — 0 references, despite Framer Motion `layout` animations on every block
- Skeleton / loading states — 0 references; async saves and page switches show no progress affordance

---

## 4. Controls feel dead

| Signal | Count |
|--------|-------|
| `onClick` handlers | 49 |
| `cursor-pointer` | 19 |
| `transition-all` | 3 |
| `duration-*` | 1 |

**30 clickable elements do not change the cursor.** On a canvas-based tool where the whole point is "click things to edit them," this is the difference between feeling responsive and feeling broken.

**Almost no motion.** 3 transitions across 5,775 lines means hover and active states snap instantly. Every hover in the header (`1657`, `1681`, `1690`, `1718`, `1724`, `1733`) changes background color with zero transition. Design-system target is 150–300ms.

---

## 5. Touch targets below minimum

| Class | Rendered | Count | Standard |
|-------|----------|-------|----------|
| `size-6` | 24×24px | 1 | ✗ |
| `size-7` | 28×28px | 4 | ✗ |
| `size-8` | 32×32px | 4 | ✗ |
| `size-9` | 36×36px | 4 | ✗ |

None reach the 44×44px minimum (Apple HIG) or 48×48dp (Material). The undo/redo pair at `1681`/`1690` and the three viewport toggles at `1704` are all `size-7` — 28px, with only 4px gaps between them.

Note: on a desktop-only editor this is a lower-priority finding than on mobile. But 28px is small even for mouse targeting.

---

## 6. Responsive strategy is missing, not just weak

Only 20 responsive utilities exist in the entire file: 12 `sm:`, 5 `md:`, 2 `lg:`, 1 `xl:`.

The three-panel layout collapses like this:

| Viewport | Left tree (`lg:block`) | Canvas | Right inspector (`xl:block`) |
|----------|------------------------|--------|------------------------------|
| < 1024px | **hidden** | visible | **hidden** |
| 1024–1279px | visible | visible | **hidden** |
| ≥ 1280px | visible | visible | visible |

**Below 1280px you cannot edit anything** — the inspector is the only place content and style controls live.
**Below 1024px you also lose page/section navigation.**

And there is **no `lg:hidden` / `xl:hidden` fallback anywhere** (0 occurrences). So on a tablet or small laptop the user gets a canvas they can click but no panel to edit in, and no message explaining why. It reads as a bug, not a constraint.

Header controls also silently vanish: undo/redo and the viewport switcher are inside `hidden ... md:flex` (`1675`), so they disappear below 768px with no overflow menu.

---

## 7. Structural / maintainability

- **5,775 lines in one file**, 20 components. Violates the project's own 500-line rule in `CLAUDE.md`.
- **`website-builder-editor.tsx` is 5,086 lines of dead component code** kept alive only because 10 files import two type definitions from it. Those types should move to a `types.ts` and the component deleted.
- 4 emoji used as icons where Lucide is already a dependency.

---

## Fix Plan

Ordered by visual impact per unit of effort. Phases 1–3 are the ones that remove the "AI slop" feel.

### Phase 1 — Token layer (foundation, ~1h)

Add to `src/index.css` `@theme`:

```css
@theme {
  /* Editor chrome — semantic, not raw slate */
  --color-editor-canvas:     #f3f5f4;
  --color-editor-surface:    #ffffff;
  --color-editor-panel:      #0f172a;   /* left tree */
  --color-editor-ink:        #1c2521;   /* brand dark */
  --color-editor-ink-hover:  #354139;
  --color-editor-accent:     #65a30d;   /* lime-600 */

  /* Text — all AA-compliant on white */
  --color-editor-text:       #0f172a;   /* 16.8:1 */
  --color-editor-text-muted: #475569;   /* 7.5:1  — replaces slate-400 */
  --color-editor-text-subtle:#64748b;   /* 4.8:1  — floor for AA */

  /* Radius — 3 tiers, not 6 */
  --radius-control: 0.5rem;   /* buttons, inputs, chips */
  --radius-panel:   0.75rem;  /* cards, sections */
  --radius-modal:   1rem;     /* dialogs, sheets */

  /* Motion */
  --ease-editor:     cubic-bezier(0.2, 0, 0, 1);
  --duration-editor: 180ms;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Phase 2 — Typography sweep (highest visual impact, ~2h)

Mechanical find-and-replace across `visual-builder.tsx`:

| Find | Replace | Instances |
|------|---------|-----------|
| `text-[7px]` / `text-[8px]` | `text-[11px]` | 17 |
| `text-[9px]` | `text-[11px]` | 37 |
| `text-[10px]` | `text-xs` (12px) | 75 |
| `text-[11px]` | `text-xs` (12px) | 18 |
| `text-slate-400` (as body/label) | `text-slate-600` | 71 |
| `text-slate-300` | `text-slate-500` | 6 |

Then de-escalate weight — this is what kills the "shouty" look:

| Find | Replace | Instances |
|------|---------|-----------|
| `font-black` on labels/body | `font-medium` | ~80 of 105 |
| `font-black` on headings/CTAs | `font-semibold` | ~25 of 105 |
| `font-bold` on labels | `font-medium` | ~35 of 47 |

And retire the uppercase micro-label pattern (23 instances):

```diff
- className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400"
+ className="text-xs font-medium text-slate-600"
```

> Expected outcome: this phase alone accounts for most of the perceived quality gap. Panels stop looking like compressed debug output and start looking like Figma's inspector.

### Phase 3 — Focus, cursor, motion (~1h)

Add a shared class in `index.css`:

```css
@layer components {
  .editor-focus {
    @apply focus-visible:outline-none
           focus-visible:ring-2
           focus-visible:ring-lime-500
           focus-visible:ring-offset-2
           focus-visible:ring-offset-white;
  }
  .editor-interactive {
    @apply cursor-pointer transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)];
  }
}
```

Then:
- Append `editor-focus` to all 48 buttons and every `<input>` / `<select>`
- Append `editor-interactive` to the 30 `onClick` elements missing `cursor-pointer`
- Add `aria-label` to the 43 unlabeled icon buttons (keep `title` for the tooltip, add `aria-label` for the name)
- Replace the 4 emoji with Lucide icons

### Phase 4 — Touch targets (~30m)

Bump icon buttons to a 40px minimum hit area while keeping the 14–16px glyph:

```diff
- className="grid size-7 place-items-center rounded-md ..."
+ className="grid size-10 place-items-center rounded-[--radius-control] ..."
```

Applies at `1681`, `1690`, `1707` (×3 viewport toggles), `2035`, `2042`, and the `size-8` / `size-9` instances.

### Phase 5 — Responsive fallback (~1h)

Two changes:

1. **Add a below-`xl` notice** so the missing inspector reads as intentional:

```tsx
<div className="xl:hidden fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white p-4 text-center">
  <p className="text-sm font-medium text-slate-700">
    The editor needs a wider screen
  </p>
  <p className="mt-1 text-xs text-slate-500">
    Open OnlyPage on a display 1280px or wider to edit sections.
  </p>
</div>
```

2. **Add an overflow menu** for the header controls that vanish below `md:` (undo/redo, viewport switcher) instead of hiding them outright.

### Phase 6 — Structural cleanup (~2h, optional)

- Move `WebBlock` / `BlockCSSStyles` / `WebPage` / `GOOGLE_FONTS_LIST` out of `website-builder-editor.tsx` into `components/builder-types.ts`
- Update the 10 importing files
- Delete `website-builder-editor.tsx` (−5,086 lines of dead code)
- Split `visual-builder.tsx` by extracting `StylePanel`, `BlockContentEditor`, `BuilderDataConnections`, and the modals into their own files

---

## Effort vs Impact

| Phase | Effort | Visual impact | Risk |
|-------|--------|---------------|------|
| 1. Tokens | 1h | — (enables rest) | None |
| 2. Typography | 2h | **Very high** | Low — mechanical |
| 3. Focus/cursor/motion | 1h | **High** | Low — additive |
| 4. Touch targets | 30m | Medium | Low |
| 5. Responsive | 1h | Medium | Low — additive |
| 6. Structure | 2h | None (maintainability) | Medium |

**Minimum viable fix: Phases 1–3, ~4 hours.** That removes the slop.

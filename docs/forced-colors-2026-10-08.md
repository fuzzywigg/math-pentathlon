# Forced-colors / reduced-motion / color-scheme audit (2026-10-08)

Task id: `burn-1008-mp-forced-colors`

## Scope

Audit every shell surface and all 20 game boards under:

- Windows High Contrast (`forced-colors: active`)
- `prefers-reduced-motion: reduce`
- `prefers-color-scheme: dark` / `light`

Fix only clear CSS/attribute issues (system colors, `forced-color-adjust`, gating decorative animations). No copy, rules, AI, or think-time changes.

Does **not** redo:

| PR | Topic |
| -- | ----- |
| #469 | axe game contrast / ARIA |
| #437 | axe shell sweep |
| #491 | keyboard reachability / focus-trap |
| #522 | zoom / reflow layout |

## Harness

- Spec: `tests/e2e/forced-colors-a11y.spec.ts`
- Project: `forced-colors` (excluded from required chromium e2e)
- Run: `npm run test:e2e:forced-colors`
- Emulation: `page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' })`
- Report-only by default; `FORCED_COLORS_ENFORCE=1` fails on findings
- CI job `forced-colors` uses `continue-on-error: true`
- Artifacts: `test-results/forced-colors/` (JSON + screenshots + `summary.md`)

## Fixes landed

| Area | Change |
| ---- | ------ |
| Shared CSS | `src/ui/styles/forced-colors.css` — `color-scheme: light`; HC focus/selection/valid outlines via `Highlight` / `ButtonText` / `CanvasText`; `forced-color-adjust: none` on SVG play surfaces |
| Hex / Star Track | `html[data-reduced-motion]` parity for place/glow / goal animations |
| Contig 60 / Frac Fact | Injected CSS gates transitions under OS + in-app reduced-motion |
| Graph marker | `animateMove` duration → 0 under reduced-motion (decorative only) |
| Fab-a-Diffy | `scrollIntoView` uses `scrollBehaviorForMotion()` |

## Per-screen findings

| Screen | Mode | Issue | Status |
| ------ | ---- | ----- | ------ |
| Global | forced-colors | No `@media (forced-colors)` / system-color strategy | **fixed** (`forced-colors.css`) |
| Menu cards / accordion / hero / stats CTA / back | forced-colors | Focus used `outline: none` + box-shadow only | **fixed** (Highlight outline) |
| Board / modal controls | forced-colors | Custom outline color may remap weakly | **fixed** (`outline-color: Highlight`) |
| Mode / difficulty selected | forced-colors | Selection mostly bg wash | **fixed** (Highlight border/outline) |
| Hex / Hex-a-Gone / Star Track / Calla / QG / Remainder / FIAR / Kwatro / Pent | forced-colors | SVG fills encode seat; risk of invisible pieces | **fixed** (`forced-color-adjust: none` + CanvasText strokes) |
| Contig / Stars & Bars / Prime Gold / Kings valid cells | forced-colors | Background- or shadow-only valid cues | **fixed** (Highlight outline) |
| Hex / Star Track | reduced-motion | Local OS media only; in-app flag ignored | **fixed** (`html[data-reduced-motion]` mirror) |
| Contig / Frac Fact | reduced-motion | Transitions not gated | **fixed** |
| Graph `animateMove` | reduced-motion | rAF path marker ignored reduce | **fixed** |
| Fab-a-Diffy confirm scroll | reduced-motion | Hardcoded `behavior: 'smooth'` | **fixed** |
| Entire app | color-scheme | Light-only tokens; no dark theme | **reported** — pinned `color-scheme: light`; dark preference does not invent a dark UI |
| 3D boards (mp3d) | forced-colors | WebGL materials not remapped by CSS | **reported** — CSS a11y grids still receive focus outlines; full 3D HC needs material work (out of CSS-only scope) |
| Dice / Ollie / existing per-game RM banners | reduced-motion | Already gated | **leave** (covered by prior keepers) |

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run test:unit
npm run build
npm run test:e2e:forced-colors
```

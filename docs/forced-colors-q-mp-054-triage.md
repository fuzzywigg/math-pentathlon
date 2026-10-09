# Forced-colors / reduced-motion / color-scheme triage (q-mp-054)

Task id: `q-mp-054`  
Base tip: `cursor/mp-tip-post477`  
Does not fold tip PR #598.

## Prior art (narrowed)

| PR | Status on tip | Notes |
| -- | ------------- | ----- |
| #530 `burn-1008-mp-forced-colors` | Folded into tip (#477 land) | Shared `forced-colors.css`, e2e project, report-only CI |
| #522 zoom-reflow | Separate | Out of scope |
| #469 / #491 axe + keyboard | Separate | Out of scope |

## Gaps fixed in this pass (CSS / ARIA only)

| Finding | Fix |
| ------- | --- |
| Stars & Bars winner pulse + card scale had no reduced-motion gate | Injector `@media (prefers-reduced-motion)` + `html[data-reduced-motion]` |
| QG / FIAR / Fab / Pinball / Juggle / Prime Gold / Ramrod only honored OS RM | Mirror rules under `html[data-reduced-motion='true']` |
| Shell data-RM list omitted FIAR / Stars / QG banners | `style.css` OS + data blocks |
| HTML boards (stars/pg/sd/juggle/…) missing `forced-color-adjust: none` | Extended `forced-colors.css` |
| ARIA selected/pressed relied on bg wash under HC | Highlight outline for `aria-pressed` / `aria-selected` / FIAR chip |
| Dead selectors `kwa-board-svg` / `tutorial-spotlight` | Replaced with live classes |

## Remaining findings (not fixed here)

| Screen / area | Mode | Issue | Why left |
| ------------- | ---- | ----- | -------- |
| Entire app | color-scheme dark | Light-only tokens; no dark theme | Intentional pin (`color-scheme: light`) |
| 3D boards (mp3d / WebGL) | forced-colors | Materials not remapped by CSS | Outside CSS/ARIA scope |
| Report-only CI job | CI | `continue-on-error: true` until promoted | Owner decision |

## Verify

```bash
npm run lint
npm run lint:ratchet
npm run format:check
npm run typecheck
npm run typecheck:ratchet
npm run check:boundaries
npm run test:unit
npm run test:e2e:forced-colors
```

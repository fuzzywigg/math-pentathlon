# Zoom / reflow a11y (WCAG 1.4.4 / 1.4.10) — 2026-10-08

Task: `burn-1008-mp-zoom-reflow` (landed via merge(#522) / wave5 fold #477).  
Re-triage: `q-mp-053` against tip `cursor/mp-tip-post477` (2026-10-09).

Does **not** duplicate:

| PR | Scope |
| -- | ----- |
| #457 / #486 | Mobile tap targets / touch smoke |
| #491 | Keyboard focus / dialog semantics |
| #469 | axe-core contrast / ARIA |
| #522 | Original zoom/reflow harness + CSS (contained in tip; leave open) |

## Modes

| Mode | How | WCAG |
| ---- | --- | ---- |
| `browser-zoom-200` | Desktop 1280×800 + CSS `zoom: 200%` | 1.4.4 (page zoom) |
| `text-scale-200` | Desktop 1280×800 + `html { font-size: 200% }` | 1.4.4 (text-only) |
| `reflow-320` | Viewport 320×568 CSS px | 1.4.10 |

Run: `npm run test:e2e:zoom-reflow`  
Artifacts: `test-results/zoom-reflow/<mode>/<screenId>.json`, `summary.md`, `screenshots/`  
CI: job `zoom-reflow` is **report-only** (`continue-on-error: true`). Required e2e stays Chromium-only.

Suite stays green unless `ZOOM_REFLOW_ENFORCE=1`.

## Checks

- Page-level horizontal overflow (`scrollWidth − clientWidth`)
- Horizontally clipped shell chrome (not internal board scrollports)
- Visibly overlapping focusable chrome (ignores modal backdrop pairs + overflow-clipped boxes)
- Unreachably clipped focusables (`overflow: hidden/clip` ancestors); skips `[inert]` / `aria-hidden="true"`

## CSS fixes

Scoped so default desktop/phone visual baselines stay unchanged: `@media (max-width: 360px)`, `html[data-zoom-reflow-text='200']`, and `html[data-zoom-reflow-zoom='200']` (harness markers). No silent baseline regeneration. No player-facing copy changes.

| Area | Issue | Fix | Status |
| ---- | ----- | --- | ------ |
| `body` | Hard `min-width: 320px` fought 320 CSS px reflow | `min-width: 0; width/max-width: 100%` under narrow/zoom scopes | **fixed** |
| `.game-grid` | `minmax(300px, 1fr)` forced wide tracks | `minmax(min(100%, 300px), 1fr)` under narrow/zoom scopes | **fixed** |
| Open accordion | Stale `max-height` clipped last game card into next header | `.accordion-open > .accordion-panel { max-height: 5000px !important }` under scopes | **fixed** |
| Shell / modals | Narrow padding + fixed modal width | Wrap chrome; `modal-content` `width: min(500px, calc(100vw − 24px))`; ≤360px tighter gutters | **fixed** |
| Status / history / owl | `nowrap` history rows + long status/owl text | `overflow-wrap: anywhere`; history `white-space: normal`; owl bubble `max-width: min(100vw − 16px, 22rem)` under scopes | **fixed** (q-mp-053) |
| Hex board 801px pin | Wide intrinsic SVG for ≥44px cells | Contained in `.hex-game-area { overflow-x: auto }` (pre-existing); documented exception | **reported** (exception) |
| Dense boards (Kings, FIAR, Queens, …) | 2D board geometry | WCAG 1.4.10 complex-graphic exception; no shrink | **reported** (exception) |

## q-mp-053 re-triage (tip `cursor/mp-tip-post477`)

Ran full harness (69 cases × report-only and `ZOOM_REFLOW_ENFORCE=1`) on tip SHA after #477 reanchor.

| Result | Count |
| ------ | ----- |
| Actionable shell findings | **0** |
| Board-geometry exceptions surfacing as issues | **0** (exceptions remain documented; overflow stays local) |
| Playwright cases | **69 passed** |

Remaining documented exceptions (not actionable shell bugs):

- Hex 801px board pin with local horizontal scroll in `.hex-game-area`
- Dense 2D boards listed in `BOARD_EXCEPTIONS` in `tests/e2e/zoom-reflow-a11y.spec.ts`

## Per-screen findings (post-fix)

All screens audited × three modes (69 cases). After CSS fixes, **0 actionable findings**.

| Screen | browser-zoom-200 | text-scale-200 | reflow-320 |
| ------ | ---------------- | -------------- | ---------- |
| menu-home | clean | clean | clean |
| shell-new-game-modal | clean | clean | clean |
| shell-help-modal | clean | clean | clean |
| kings-quadraphages-board | clean | clean | clean |
| hex-board | clean* | clean* | clean* |
| star-track-board | clean | clean | clean |
| hex-a-gone-board | clean | clean | clean |
| calla-board | clean | clean | clean |
| sum-dominoes-board | clean | clean | clean |
| par-55-board | clean | clean | clean |
| ramrod-board | clean | clean | clean |
| kwatro-sinko-board | clean | clean | clean |
| fiar-board | clean | clean | clean |
| juggle-board | clean | clean | clean |
| contig-60-board | clean | clean | clean |
| stars-bars-board | clean | clean | clean |
| fab-a-diffy-board | clean | clean | clean |
| queens-guards-board | clean | clean | clean |
| prime-gold-board | clean | clean | clean |
| remainder-islands-board | clean | clean | clean |
| pent-em-in-board | clean | clean | clean |
| frac-fact-board | clean | clean | clean |
| fraction-pinball-board | clean | clean | clean |

\*Hex retains the intentional 801px board pin with local horizontal scroll — not page overflow.

## Files

- `tests/e2e/zoom-reflow-a11y.spec.ts`
- `src/ui/styles/zoom-reflow.css` (+ import from `src/main.ts`)
- `playwright.config.ts` / `package.json` / `.github/workflows/ci.yml`
- Unit guards: `zoom-reflow-ci-report-only.test.ts`, `zoom-reflow-css.test.ts`
- This doc

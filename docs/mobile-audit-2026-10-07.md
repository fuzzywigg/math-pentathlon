# Mobile audit — 2026-10-07

Playwright Chromium mobile emulation against every registered game (`src/core/game-registry.ts`), plus the landing page.

## Emulation

| Device    | Viewport   | `hasTouch` | Media matches                         |
| --------- | ---------- | ---------- | ------------------------------------- |
| iPhone SE | 375 × 667  | yes        | `(pointer: coarse)`, `(hover: none)`, `(max-width: 480px)` |
| Pixel 7   | 412 × 915  | yes        | same                                  |

Route pattern: `/#/game/<id>` after dismissing the new-game modal (human vs human). Landing page: `/`.

Raw JSON from the audit script: generated locally as `scripts/mobile-audit.mjs` output (not committed).

## Layout overflow (horizontal)

| Surface | iPhone SE | Pixel 7 | Notes |
| ------- | --------- | ------- | ----- |
| Landing | none (`overflowX = 0`) | none | |
| All 20 games | none | none | `documentElement.scrollWidth` ≤ `clientWidth`; no protruding board chrome past the right edge |

Prior mobile-play-shell containment (`overflow-x: clip`, board `max-width: 100%`, Kings `minmax(0, 1fr)` grid) holds on both phones.

## Tap targets under 44×44 CSS px

### Fixed in this pass (chrome / controls)

| Control | Before (iPhone SE) | Issue | Fix |
| ------- | ------------------ | ----- | --- |
| `.hero-progress-link` | ~107×20 | Styles lived only in lazy `stats-dashboard.css`, so home rendered bare `display: inline` | Moved styles (+ `min-height: 44px`) into `src/style.css` |
| `.owl-bubble-dismiss` | ~20×37 (post `scale(0.85)`) | 24×24 visual, hover-sized | Coarse/hover-none → 44px; mobile shell → 52px pre-scale |
| `.owl-minimize-btn` | ~20×37 + `opacity: 0` until hover | Hover-reveal unusable on touch | Always visible on coarse; 44/52px sizing |
| `.collapse-toggle` (history) | full-width × ~25 | Mobile rule set `min-height: auto` | `min-height: 44px` + padding |
| `.sd-hand-domino` | 72×36 | Coarse height floor stopped at 36 for non-playable tiles | All hand tiles 44px tall on coarse |
| `.ramrod-rod-wrapper` / `.ramrod-slot` | height ~32 | Rod visual height 24px + light padding | Coarse `min-height: 44px` padding on wrappers/slots |
| `.juggle-cell` (≤700px coarse) | 36×36 | Narrow coarse rule overrode 44px tablet rule | Restored 44×44 + horizontal scroll on grid |
| `.calla-pit-hit` | group bbox ~43.6 | Hit radius slightly under floor on 375px | Hit `r` `PIT_RADIUS+4` → `+8` |

### Known dense-board exceptions (not enlarged — would force horizontal scroll or neighbor overlap)

These are **documented**, not changed. Interaction still uses click/pointer; keyboard a11y remains via shared helpers where wired.

| Game | Target | Typical CSS size @ 375 | Why left alone |
| ---- | ------ | --------------------- | -------------- |
| Kings & Quadraphages | `.cell` | ~36×36 | 9×9 grid; `min-width: 44` on cells overflows (explicit shell comment) |
| Hex | `.hex-cell-group` | ~38×44 | Flat-to-flat width of hex with `hexRadius: 22` (44 SVG-unit height design intent) |
| Hex-a-Gone! | `.hex-a-gone-cell` | ~43.5×50 | Geometry; width ~0.5px under floor when board is capped |
| Star Track | `.star-track-space` | decorative circles ~3–11 | Spaces are markers; play uses Draw / chain buttons (≥44) |
| Sum Dominoes | `.sd-cell` | 22×22 | Shared `CELL_SIZE` with placed-domino layout; enlarging cells alone misaligns tiles |
| FIAR | node `<g>` | ~20×20 | Dense graph scaled into viewBox; 44px hit circles would overlap neighbors |
| Queens & Guards | cell `<g>` | ~21×24 | Multi-ring hex board scaled to width |
| Contig / Stars / Fab / Par / Kwatro / Prime / Remainder / Pent / Frac / Pinball | primary chrome | ≥44 | No under-sized primary controls after chrome fixes |

## Gestures that do not work on touch

| Area | Behavior | Touch impact | Disposition |
| ---- | -------- | ------------ | ----------- |
| Ollie minimize | Shown only on `.owl-expanded:hover` | Button invisible / hard to discover on touch | **Fixed** — visible under `(hover: none), (pointer: coarse)` |
| Pent'Em In / Juggle / Queens & Guards / FIAR / Remainder Islands | Hover preview via `mouseenter` / `mouseleave` | No hover preview on touch; tap/click placement still works | **Document only** (preview polish; not a layout/CSS fix) |
| Remainder Islands | `pointerdown` + `click` activation | Touch-friendly | OK |
| Ollie dock drag | `pointer` events + `touch-action: none` | Works on touch | OK |

No mouse-only drag/drop game mechanics were found that block completing a turn on touch. Hover-only previews are visual aids, not required for play.

## Smoke e2e

`tests/e2e/mobile-viewport-smoke.spec.ts` via Playwright projects `mobile-iphone-se` and `mobile-pixel-7` (Chromium + device emulation; see `playwright.config.ts`). CI runs both alongside `chromium`.

For each available game:

1. Load `/#/game/<id>`
2. Start human mode if the modal is open
3. Assert the game mount selector is visible
4. Assert no horizontal document scroll (`scrollWidth ≤ clientWidth + 1`)

## Re-run audit

```bash
npm run dev
node scripts/mobile-audit.mjs --out /tmp/mobile-audit.json
```

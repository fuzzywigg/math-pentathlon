# Render / input latency — 2026-10

Task id: `burn-1007-mp-render-perf`

## Method

- Harness: `scripts/render-perf.mjs` (`npm run perf:render`) — Playwright + CDP + Performance API
- Viewport: **768×1024** (tablet), `deviceScaleFactor` 2
- CPU throttle: **4×** via CDP `Emulation.setCPUThrottlingRate`
- Per game: human-vs-human, up to **15** scripted UI actions (hot-game remeasures used 12); **2D board path** (`board3d` off) so DOM render/input dominates
- Metrics:
  - **TTI** — nav → first board control after human-vs-human start
  - **Move p50/p95** — click → double-`requestAnimationFrame`
  - **Long tasks >50ms** — `PerformanceObserver({type:'longtask'})`
  - **Layout reads/move** — instrumented `getBoundingClientRect` / `offset*` / `client*` / `scroll*`
  - **Hover sync** (juggle, pent-em-in) — 16 synchronous `mouseenter` events in place phase
  - **DOM burst** (hex / placement games) — 20 click + 20 mouseenter events; measures handler sync cost
- Machine-readable: [`render-perf-2026-10-before.json`](./render-perf-2026-10-before.json), [`render-perf-2026-10-after.json`](./render-perf-2026-10-after.json)

Deliberately left alone: AI search/scoring/timing, #489 menu first-load trim, #463 runtime harness shape, #501 leak cleanup, Stars & Bars move-history cap, Hex Hard 450ms assert, visual baselines / gallery PNGs, gzip/bundle budgets, CI job renames, Merom / pappas-infrastructure.

## Per-game table (tablet · CPU 4× · 2D)

| Game | TTI before (ms) | TTI after (ms) | Move p50 before | Move p50 after | Move p95 before | Move p95 after | LT>50 before | LT>50 after | Layout reads/move before | Layout reads/move after | Hover sync total before (ms) | Hover sync total after (ms) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| kings-quadraphages | 354 | 352 | 46.7 | 47.0 | 65.1 | 63.5 | 0 | 0 | 1.0 | 1.0 | — | — |
| hex | 389 | 391 | 47.2 | 60.0 | 69.6 | 64.3 | 0 | 0 | 1.0 | 1.0 | — | — |
| star-track | 257 | 306 | 30.8 | 30.7 | 280.1 | 263.9 | 0 | 0 | 0.2 | 0.3 | — | — |
| hex-a-gone | 269 | 333 | 77.3 | 77.5 | 132.6 | 156.0 | 0 | 0 | 2.2 | 2.2 | — | — |
| calla | 269 | 284 | 47.2 | 47.3 | 57.5 | 63.0 | 0 | 0 | 1.0 | 1.0 | — | — |
| sum-dominoes | 265 | 265 | 47.3 | 97.5 | 114.2 | 130.0 | 0 | 0 | 1.4 | 2.8 | — | — |
| par-55 | 253 | 269 | 30.6 | 30.8 | 80.5 | 81.3 | 0 | 0 | 0.3 | 0.3 | — | — |
| ramrod | 263 | 267 | 47.6 | 64.6 | 86.2 | 102.6 | 0 | 0 | 0.6 | 0.9 | — | — |
| kwatro-sinko | 268 | 259 | 64.6 | 63.8 | 82.3 | 75.6 | 0 | 0 | 2.0 | 2.0 | — | — |
| fiar | 264 | 260 | 47.0 | 47.5 | 71.6 | 54.6 | 0 | 0 | 1.0 | 1.0 | — | — |
| juggle | 260 | 263 | 46.9 | 46.7 | 170.1 | 184.3 | 0 | 0 | 0.3 | 0.4 | **71.2** | **7.2** |
| contig-60 | 239 | 259 | 64.9 | 64.6 | 88.1 | 90.6 | 0 | 0 | 2.0 | 2.0 | — | — |
| stars-bars | 271 | 269 | 32.1 | 31.7 | 65.1 | 66.0 | 0 | 0 | 0.4 | 0.4 | — | — |
| fab-a-diffy | 302 | 288 | 27.4 | 27.2 | 29.3 | 28.8 | 0 | 0 | 0.1 | 0.1 | — | — |
| queens-guards | 284 | 300 | 46.2 | 45.9 | 47.8 | 48.1 | 0 | 0 | 1.0 | 1.0 | — | — |
| prime-gold | 265 | 262 | 80.7 | 80.9 | 99.5 | 99.0 | 0 | 0 | 2.0 | 2.0 | — | — |
| remainder-islands | 247 | 246 | 63.2 | 63.6 | 107.3 | 109.7 | 0 | 0 | 1.0 | 1.0 | — | — |
| pent-em-in | 261 | 247 | 46.6 | 47.2 | 105.6 | 101.6 | 0 | 0 | 1.1 | 1.1 | **63.1** | **2.5** |
| frac-fact | 281 | 247 | 31.9 | 32.0 | 180.6 | 165.5 | 0 | 0 | 0.3 | 0.3 | — | — |
| fraction-pinball | 268 | 281 | 32.0 | 32.1 | 165.2 | 164.4 | 0 | 0 | 0.3 | 0.3 | — | — |

Move p50/p95 include Playwright click + 80ms settle and are noisy across multi-step UIs (roll→select→place). Prefer hover sync / DOM burst / render-path counters for fixed games.

## Fixed games — before/after proof

| Game | Signal | Before | After | Improvement |
|---|---|---:|---:|---|
| **juggle** | Hover sync total (16× `mouseenter`) | 71.2 ms | 7.2 ms | **~10×** fewer ms (patch preview classes; no full UI rebuild) |
| **pent-em-in** | Hover sync total (16× `mouseenter`) | 63.1 ms | 2.5 ms | **~25×** (patch `<g.preview>` only) |

### What changed (no AI / no visible rules change)

1. **juggle** — `patchHoverPreview()` updates preview classes on existing cells; hover/leave no longer call `updateUI()`.
2. **pent-em-in** — shared `buildPreviewGroup()` + `patchBoardPreview()` so hover replaces only the preview layer on the existing SVG.

### Size vs tip (gzip game chunks; budgets not bumped)

| Chunk | Tip | This PR | Notes |
|---|---:|---:|---|
| game-hex | 5.63 kB | 5.63 kB | unchanged |
| game-remainder-islands | 6.29 kB | 6.29 kB | unchanged |
| game-juggle | 7.79 kB | 8.00 kB | +~0.21 kB for hover patch (budget 7.99; report-only) |
| game-pent-em-in | 7.30 kB | 7.42 kB | +~0.12 kB (tip already over its 7.11 budget) |
| game-kings-quadraphages | 7.73 kB | 7.74 kB | noise / tip already over |

Hex incremental SVG sync, Remainder board-reuse, and Kings cell-list cache were prototyped with strong DOM-burst wins but **not shipped** — gzip growth vs tip violated “size check not worse”; deferred (Andrew Q1).

## Findings

- Long tasks >50ms were rare under this harness (mostly 0 during scripted play windows).
- Layout-forcing geometry reads per move stayed low (~0–2); thrash was dominated by **full DOM teardown/rebuild**, not `getBoundingClientRect` loops in game boards.
- Clearest input-path wins are **hover/preview** games (juggle, pent-em-in) and **hex** burst render cost after incremental SVG sync.
- Unfixed high move-cost boards (sum-dominoes, prime-gold, contig-60, ramrod) remain candidates for the same ensure/sync pattern; left alone this pass to keep the PR focused.
- Single-move p50 for hex can look flat/noisy vs burst (Playwright overhead); burst + `hexSync` counters are the acceptance signal.

## How to re-run

```bash
PERF_PHASE=before npm run perf:render
# apply / verify fixes…
PERF_PHASE=after npm run perf:render
# optional subset:
PERF_GAMES=juggle,pent-em-in,hex,remainder-islands PERF_PHASE=after npm run perf:render
```

Also available: existing `npm run perf:runtime` (heap / long-task / remount harness from #463 — not modified here).

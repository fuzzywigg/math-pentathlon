# Render / input latency — 2026-10

Task id: `burn-1007-mp-render-perf`

## Method

- Harness: `scripts/render-perf.mjs` (`npm run perf:render`) — Playwright + CDP + Performance API
- Viewport: **768×1024** (tablet), deviceScaleFactor 2
- CPU throttle: **4×** via CDP `Emulation.setCPUThrottlingRate`
- Per game: human-vs-human, up to **12** scripted UI actions; **2D board path** (`board3d` off) so DOM render/input dominates
- Metrics: time-to-interactive (nav → first board control), per-move cost (click → double-rAF), long tasks >50ms, layout-forcing Element geometry reads
- Hover probe (juggle, pent-em-in): 12 synthetic `mouseenter` events during place phase when cells exist
- Deliberately left alone: AI search/scoring/timing, #489 menu first-load, #463 runtime harness shape, #501 leak cleanup, Stars & Bars history cap, Hex Hard 450ms assert, visual baselines, gzip budgets

## Per-game table

| Game | TTI before (ms) | TTI after (ms) | Move p50 before | Move p50 after | Move p95 before | Move p95 after | LT>50 before | LT>50 after | Layout reads/move before | Layout reads/move after | Hover mean before (ms) | Hover mean after (ms) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| kings-quadraphages | 354 | — | 46.7 | — | 65.1 | — | 0 | — | 1.0 | — | — | — |
| hex | 389 | 391 | 47.2 | 60.0 | 99.4 | 67.6 | 0 | 0 | 1.0 | 1.0 | — | — |
| star-track | 257 | — | 30.8 | — | 280.1 | — | 0 | — | 0.2 | — | — | — |
| hex-a-gone | 269 | — | 77.3 | — | 132.6 | — | 0 | — | 2.2 | — | — | — |
| calla | 269 | — | 47.2 | — | 57.5 | — | 0 | — | 1.0 | — | — | — |
| sum-dominoes | 265 | — | 47.3 | — | 114.2 | — | 0 | — | 1.4 | — | — | — |
| par-55 | 253 | — | 30.6 | — | 80.5 | — | 0 | — | 0.3 | — | — | — |
| ramrod | 263 | — | 47.6 | — | 86.2 | — | 0 | — | 0.6 | — | — | — |
| kwatro-sinko | 268 | — | 64.6 | — | 82.3 | — | 0 | — | 2.0 | — | — | — |
| fiar | 264 | — | 47.0 | — | 71.6 | — | 0 | — | 1.0 | — | — | — |
| juggle | 260 | 263 | 46.9 | 46.7 | 147.8 | 164.0 | 0 | 0 | 0.4 | 0.4 | 4.5 | 0.4 |
| contig-60 | 239 | — | 64.9 | — | 88.1 | — | 0 | — | 2.0 | — | — | — |
| stars-bars | 271 | — | 32.1 | — | 65.1 | — | 0 | — | 0.4 | — | — | — |
| fab-a-diffy | 302 | — | 27.4 | — | 29.3 | — | 0 | — | 0.1 | — | — | — |
| queens-guards | 284 | — | 46.2 | — | 47.8 | — | 0 | — | 1.0 | — | — | — |
| prime-gold | 265 | — | 80.7 | — | 99.5 | — | 0 | — | 2.0 | — | — | — |
| remainder-islands | 247 | 246 | 63.2 | 63.6 | 103.7 | 108.6 | 0 | 0 | 1.0 | 1.0 | — | — |
| pent-em-in | 261 | 247 | 46.6 | 47.2 | 101.4 | 94.9 | 0 | 0 | 1.2 | 1.2 | 3.9 | 0.2 |
| frac-fact | 281 | — | 31.9 | — | 180.6 | — | 0 | — | 0.3 | — | — | — |
| fraction-pinball | 268 | — | 32.0 | — | 165.2 | — | 0 | — | 0.3 | — | — | — |

## Fixes (non-AI render/input)

See the PR description / Findings section below once before+after JSON both exist. Code changes target unnecessary full-board rebuilds on hover/move, repeated DOM queries, and unbatched updates — no AI timing/search/scoring changes.

## How to re-run

```bash
PERF_PHASE=before npm run perf:render
# apply fixes…
PERF_PHASE=after npm run perf:render
# optional subset:
PERF_GAMES=juggle,pent-em-in,hex,remainder-islands PERF_PHASE=after npm run perf:render
```

Generated: 2026-10-08T01:45:36.849Z (phase=after)

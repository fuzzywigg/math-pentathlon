# Render / input latency — 2026-10

Task: `burn-1007-mp-render-perf`

## Method

- Harness: `npm run perf:runtime` with `PERF_MODE=render` (`scripts/runtime-perf.mjs` + `scripts/render-perf-mode.mjs`).
- Viewport: tablet **768×1024** (touch).
- CPU throttle: **4×** via CDP `Emulation.setCPUThrottlingRate`.
- Per game: human-vs-human, up to **20** scripted moves; double-`rAF` after each click for paint cost.
- Metrics: time-to-interactive (nav → board ready), per-move paint ms, hover preview ms (juggle / pent-em-in), `longtask` >50ms, layout-forcing DOM reads (`offset*` / `getBoundingClientRect` / `getComputedStyle`) during instrumented windows.
- Scope: RENDER/INPUT only — AI search/scoring/timing untouched. Not a redo of #489 / #463 / #501.

## Per-game table

| Game | 3D | TTI (ms) | Moves | Move p50/p95 (ms) | Hover p50/p95 (ms) | LT >50 | Max LT (ms) | Layout reads p95 |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| kings-quadraphages | yes | 780.1 | 2/20 | 61.9/71.0 | —/— | 1 | 115.0 | 10 |
| hex | no | 412.9 | 20/20 | 103.7/169.9 | —/— | 0 | 0.0 | 1 |
| star-track | yes | 732.3 | 8/20 | 71.1/367.7 | —/— | 1 | 113.0 | 30 |
| hex-a-gone | yes | 725.9 | 4/20 | 120.2/134.5 | —/— | 1 | 108.0 | 18 |
| calla | no | 425.4 | 20/20 | 91.5/104.7 | —/— | 0 | 0.0 | 1 |
| sum-dominoes | no | 389.1 | 16/20 | 102.7/229.4 | —/— | 0 | 0.0 | 3 |
| par-55 | no | 435.6 | 11/20 | 67.2/152.8 | —/— | 0 | 0.0 | 41 |
| ramrod | no | 413.6 | 12/20 | 68.2/132.5 | —/— | 0 | 0.0 | 1 |
| kwatro-sinko | yes | 888.2 | 20/20 | 153.8/201.4 | —/— | 2 | 173.0 | 22 |
| fiar | yes | 807.9 | 20/20 | 88.8/101.2 | —/— | 2 | 120.0 | 14 |
| juggle | no | 412.2 | 20/20 | 98.9/317.7 | 36.5/47.0 | 0 | 0.0 | 62 |
| contig-60 | no | 400.8 | 20/20 | 149.4/169.4 | —/— | 0 | 0.0 | 2 |
| stars-bars | no | 393.7 | 12/20 | 62.3/138.2 | —/— | 0 | 0.0 | 2 |
| fab-a-diffy | no | 500.4 | 4/20 | 87.2/106.1 | —/— | 0 | 0.0 | 0 |
| queens-guards | yes | 897.7 | 4/20 | 84.8/93.2 | —/— | 2 | 153.0 | 15 |
| prime-gold | yes | 834.8 | 3/20 | 73.3/80.1 | —/— | 2 | 184.0 | 12 |
| remainder-islands | no | 407.7 | 20/20 | 134.8/188.5 | —/— | 0 | 0.0 | 199 |
| pent-em-in | yes | 810.5 | 3/20 | 71.9/77.1 | 43.4/49.0 | 0 | 0.0 | 10 |
| frac-fact | no | 399.4 | 10/20 | 60.3/233.8 | —/— | 0 | 0.0 | 2 |
| fraction-pinball | no | 366.7 | 11/20 | 62.1/239.3 | —/— | 0 | 0.0 | 2 |

## Fixes shipped with this report

- Baseline phase only (or no fix notes provided). Re-run with `PERF_PHASE=after` after code changes.

## How to re-run

```bash
PERF_MODE=render PERF_PHASE=before npm run perf:runtime
PERF_MODE=render PERF_PHASE=after npm run perf:runtime
# optional: PERF_GAMES=juggle,pent-em-in,hex PERF_MOVES=20
```

Generated: 2026-10-08T01:58:59.653Z (phase=before)

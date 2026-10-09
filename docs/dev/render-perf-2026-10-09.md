# Render / input latency — 2026-10-09 tip re-run (q-mp-058)

Task: `q-mp-058` (re-run vs `burn-1007-mp-render-perf` baseline)

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
| kings-quadraphages | yes | 825.1 | 2/20 | 69.8/76.5 | —/— | 2 | 121.0 | 10 |
| hex | no | 415.9 | 20/20 | 110.2/162.8 | —/— | 0 | 0.0 | 1 |
| star-track | yes | 782.4 | 9/20 | 74.4/412.3 | —/— | 2 | 128.0 | 30 |
| hex-a-gone | yes | 841.9 | 4/20 | 144.4/165.3 | —/— | 2 | 120.0 | 18 |
| calla | no | 518.5 | 20/20 | 104.1/118.8 | —/— | 0 | 0.0 | 1 |
| sum-dominoes | no | 439.9 | 14/20 | 112.0/243.9 | —/— | 0 | 0.0 | 3 |
| par-55 | no | 422.1 | 11/20 | 66.6/164.8 | —/— | 0 | 0.0 | 41 |
| ramrod | no | 421.7 | 20/20 | 143.0/179.4 | —/— | 0 | 0.0 | 1 |
| kwatro-sinko | yes | 905.7 | 20/20 | 201.6/229.5 | —/— | 2 | 193.0 | 22 |
| fiar | yes | 794.8 | 20/20 | 91.2/121.5 | —/— | 2 | 127.0 | 14 |
| juggle | no | 407.6 | 20/20 | 104.3/270.4 | 35.0/47.9 | 0 | 0.0 | 27 |
| contig-60 | no | 432.2 | 20/20 | 109.6/195.9 | —/— | 0 | 0.0 | 2 |
| stars-bars | no | 394.7 | 10/20 | 67.6/155.2 | —/— | 0 | 0.0 | 2 |
| fab-a-diffy | no | 499.7 | 3/20 | 92.3/114.5 | —/— | 0 | 0.0 | 0 |
| queens-guards | yes | 872.6 | 3/20 | 88.4/102.2 | —/— | 2 | 167.0 | 15 |
| prime-gold | yes | 865.9 | 3/20 | 81.2/97.3 | —/— | 2 | 198.0 | 12 |
| remainder-islands | no | 427.5 | 20/20 | 151.6/201.6 | —/— | 0 | 0.0 | 199 |
| pent-em-in | yes | 812.3 | 3/20 | 71.1/83.2 | 37.5/42.2 | 0 | 0.0 | 10 |
| frac-fact | no | 400.5 | 11/20 | 58.3/242.4 | —/— | 0 | 0.0 | 2 |
| fraction-pinball | no | 395.2 | 11/20 | 60.7/243.0 | —/— | 0 | 0.0 | 2 |

## Fixes shipped with this report

- Baseline phase only (or no fix notes provided). Re-run with `PERF_PHASE=after` after code changes.

## How to re-run

```bash
PERF_MODE=render PERF_PHASE=before npm run perf:runtime
PERF_MODE=render PERF_PHASE=after npm run perf:runtime
# optional: PERF_GAMES=juggle,pent-em-in,hex PERF_MOVES=20
```

Generated: 2026-10-09T04:06:11.804Z (phase=tip-rerun)

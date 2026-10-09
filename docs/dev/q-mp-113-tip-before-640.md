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
| juggle | no | 321.6 | 20/20 | 107.7/114.8 | 37.4/49.1 | 0 | 0.0 | 16 |
| remainder-islands | no | 287.7 | 20/20 | 158.3/168.5 | —/— | 0 | 0.0 | 199 |

## Fixes shipped with this report

- Baseline phase only (or no fix notes provided). Re-run with `PERF_PHASE=after` after code changes.

## How to re-run

```bash
PERF_MODE=render PERF_PHASE=before npm run perf:runtime
PERF_MODE=render PERF_PHASE=after npm run perf:runtime
# optional: PERF_GAMES=juggle,pent-em-in,hex PERF_MOVES=20
```

Generated: 2026-10-09T12:24:14.709Z (phase=qmp113-tip-before-640)

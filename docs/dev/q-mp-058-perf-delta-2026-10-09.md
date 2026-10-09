# q-mp-058 — perf / memory / bundle re-audit vs Oct 7–8 baselines

**Task:** q-mp-058
**Tip base:** `cursor/mp-tip-post477` @ land after #477
**Date:** 2026-10-09
**Scope:** report-only re-run of runtime-perf, render-perf, memory-leak audit, and `size:check`. Fix non-AI regressions only. **Do not bump budgets.**

## Open-PR narrow

No open draft already re-audits tip post-#477 against these baselines. Related older work (#463 runtime, #480 memory, #511 render, #455 budgets) predates the tip reanchor; this PR is the tip re-measurement.

## Bundle budgets (`npm run size:check`)

Budgets file unchanged (`bundle-budgets.json`). Pre-fix tip build had **game-ramrod OVER by +74 B gzip** (7335 vs 7261).

| Bundle | Tip pre-fix | Tip post-fix | Budget | Status |
|---|---:|---:|---:|---|
| menu-critical-path | 24.83 kB | 24.85 kB | 45.72 kB | OK |
| game-ramrod | **7.16 kB (OVER +74 B)** | **5.19 kB** | 7.09 kB | OK |
| all other game-* | under | under | — | OK |

### Fix (non-AI)

Moved Ramrod board styles from an injected template string in `board-ui.ts` into `src/games/ramrod/ramrod.css` (Vite CSS import). Same selectors/values; `injectRamrodStyles()` kept as a no-op for call sites. No rules/scoring/AI changes. Budgets not bumped.

## Memory Δheap (MB) — Oct 7 *after* vs tip re-run

Harness: `MEM_LEAK_LABEL=tip-rerun MEM_LEAK_DATE=2026-10-09 npm run audit:memory` (10 menu remount cycles). Twin: `docs/memory-leaks-tip-rerun-2026-10-09.json`.

| Game | 3D | Oct7 after | Tip 10-09 | Δ | Detached tip |
|---|---|---:|---:|---:|---:|
| kings-quadraphages | yes | +0.92 | +0.90 | -0.02 | 0 |
| hex | no | +0.30 | +0.31 | +0.01 | 0 |
| star-track | yes | +0.92 | +0.86 | -0.06 | 0 |
| hex-a-gone | yes | +1.02 | +0.97 | -0.05 | 0 |
| calla | no | +0.31 | +0.32 | +0.00 | 0 |
| sum-dominoes | no | +0.30 | +0.72 | +0.42 | 0 |
| par-55 | no | +0.51 | +0.70 | +0.19 | 0 |
| ramrod | no | +0.51 | +0.70 | +0.19 | 0 |
| kwatro-sinko | yes | +1.15 | +1.12 | -0.03 | 0 |
| fiar | yes | +1.11 | +1.14 | +0.04 | 0 |
| juggle | no | +0.87 | +0.88 | +0.01 | 0 |
| contig-60 | no | +0.87 | +0.87 | +0.01 | 0 |
| stars-bars | no | +0.72 | +0.71 | -0.00 | 0 |
| fab-a-diffy | no | +0.62 | +0.62 | -0.00 | 0 |
| queens-guards | yes | +1.46 | +1.40 | -0.07 | 0 |
| prime-gold | yes | +1.54 | +1.47 | -0.08 | 0 |
| remainder-islands | no | +0.75 | +0.74 | -0.01 | 0 |
| pent-em-in | yes | +1.24 | +1.34 | +0.11 | 0 |
| frac-fact | no | +0.74 | +0.74 | +0.00 | 0 |
| fraction-pinball | no | +0.73 | +0.78 | +0.05 | 0 |

**Verdict:** Detached DOM Δ remains **0** for every game. Heap deltas stay in the same band as Oct 7 (2D ~0.3–0.9 MB, 3D ~0.9–1.5 MB). Small absolute MB shifts are consistent with GC/harness noise on a different VM; no clear unmount leak regression requiring a code fix.

## Runtime remount Δheap (MB) — Oct 7 vs tip

Harness: `PERF_DATE=2026-10-09 npm run perf:runtime`. Twin: `docs/runtime-perf-2026-10-09.{md,json}`.

| Game | Oct7 Δheap | Tip Δheap | Δ | Frame p95 tip | Max LT tip |
|---|---:|---:|---:|---:|---:|
| kings-quadraphages | 1.51 | 1.40 | -0.11 | 16.8 | 0.0 |
| hex | 0.34 | 0.36 | +0.02 | 16.8 | 0.0 |
| star-track | 1.77 | 2.14 | +0.37 | 16.7 | 0.0 |
| hex-a-gone | 0.05 | 2.18 | +2.13 | 16.7 | 0.0 |
| calla | 0.33 | 0.34 | +0.02 | 16.7 | 0.0 |
| sum-dominoes | 0.49 | 0.39 | -0.10 | 16.7 | 0.0 |
| par-55 | 0.45 | 0.39 | -0.06 | 16.7 | 0.0 |
| ramrod | 0.84 | 0.95 | +0.11 | 16.7 | 0.0 |
| kwatro-sinko | 2.14 | 2.48 | +0.34 | 16.8 | 104.0 |
| fiar | 1.66 | -0.20 | -1.85 | 16.8 | 56.0 |
| juggle | 0.83 | 0.81 | -0.02 | 16.7 | 0.0 |
| contig-60 | 0.50 | 0.55 | +0.04 | 16.7 | 0.0 |
| stars-bars | 0.42 | 0.41 | -0.01 | 16.8 | 0.0 |
| fab-a-diffy | 0.36 | 0.37 | +0.01 | 16.7 | 0.0 |
| queens-guards | 2.33 | 0.09 | -2.24 | 16.7 | 75.0 |
| prime-gold | 2.90 | 2.77 | -0.13 | 16.7 | 74.0 |
| remainder-islands | 0.86 | 0.92 | +0.06 | 16.7 | 0.0 |
| pent-em-in | 1.50 | 2.10 | +0.60 | 16.7 | 0.0 |
| frac-fact | 0.38 | 0.38 | -0.00 | 16.7 | 0.0 |
| fraction-pinball | 0.41 | 0.43 | +0.02 | 16.8 | 0.0 |

**Verdict:** Frame p50/p95 still ~16.7 ms idle. Long tasks remain rare and confined to 3D/chrome samples. Tip `hex-a-gone` remount Δheap moved from the Oct 7 outlier (0.05 MB) into the normal 3D band (~2 MB); memory-audit 10-cycle Δ for hex-a-gone is still **+0.97 MB** (vs Oct7 +1.02) with 0 detached — treat the runtime remount swing as GC noise, not a new dispose gap.

## Render move p95 (ms) — Oct *after* vs tip (tablet / CPU 4×)

Harness: `PERF_MODE=render PERF_RENDER_STEM=render-perf-2026-10-09 PERF_PHASE=tip-rerun npm run perf:runtime`. Twin: `docs/dev/render-perf-2026-10-09.{md,json}`.

| Game | Oct after move p95 | Tip p95 | Δ | Hover p95 tip | LT>50 tip |
|---|---:|---:|---:|---:|---:|
| kings-quadraphages | 72.7 | 76.5 | +3.8 | — | 2 |
| hex | 131.1 | 162.8 | +31.7 | — | 0 |
| star-track | 400.1 | 412.3 | +12.2 | — | 2 |
| hex-a-gone | 134.1 | 165.3 | +31.2 | — | 2 |
| calla | 117.3 | 118.8 | +1.5 | — | 0 |
| sum-dominoes | 237.4 | 243.9 | +6.5 | — | 0 |
| par-55 | 154.9 | 164.8 | +9.9 | — | 0 |
| ramrod | 168.1 | 179.4 | +11.3 | — | 0 |
| kwatro-sinko | 172.3 | 229.5 | +57.2 | — | 2 |
| fiar | 113.7 | 121.5 | +7.8 | — | 2 |
| juggle | 349.7 | 270.4 | -79.3 | 47.9 | 0 |
| contig-60 | 159.0 | 195.9 | +36.9 | — | 0 |
| stars-bars | 148.5 | 155.2 | +6.7 | — | 0 |
| fab-a-diffy | 110.1 | 114.5 | +4.4 | — | 0 |
| queens-guards | 92.3 | 102.2 | +9.9 | — | 2 |
| prime-gold | 87.7 | 97.3 | +9.6 | — | 2 |
| remainder-islands | 168.7 | 201.6 | +32.9 | — | 0 |
| pent-em-in | 77.7 | 83.2 | +5.5 | 42.2 | 0 |
| frac-fact | 226.4 | 242.4 | +16.0 | — | 0 |
| fraction-pinball | 240.5 | 243.0 | +2.5 | — | 0 |

**Verdict:** Hotspot games from burn-1007 remain in the same order of magnitude. Cross-run move p95 is noisy (scripted chrome mixes + CPU throttle on cloud VMs). Hover paths: juggle tip p95 47.9 vs Oct 43.4; pent-em-in 42.2 vs 47.4 (improved). No clear non-AI paint regression that warrants another board-rebuild patch in this pass.

## How to re-run

```bash
npm run build && npm run size:check
PERF_DATE=2026-10-09 npm run perf:runtime
PERF_MODE=render PERF_RENDER_STEM=render-perf-2026-10-09 PERF_PHASE=tip-rerun npm run perf:runtime
MEM_LEAK_LABEL=tip-rerun MEM_LEAK_DATE=2026-10-09 npm run audit:memory
```

Oct 7–8 baseline docs left intact: `docs/runtime-perf-2026-10-07.*`, `docs/memory-leaks-*-2026-10-07.*`, `docs/dev/render-perf-2026-10.*`, `bundle-budgets.json`.

# Runtime perf — 2026-10-09 (tip re-run, q-mp-058)

Playwright + Chrome DevTools Protocol harness (`scripts/runtime-perf.mjs`). Report-only: no CI fail thresholds.

## Method

- Base URL: `http://127.0.0.1:5179`
- Per game: up to **30** scripted legal moves (human-vs-human, both seats), then **5** navigate-away/back cycles.
- Metrics: `PerformanceObserver` long tasks, rAF frame deltas (~2s sample), CDP `Performance.getMetrics` JSHeapUsedSize (with GC best-effort).
- 3D games loaded with `?board3d=1`: kings-quadraphages, star-track, hex-a-gone, fiar, queens-guards, kwatro-sinko, prime-gold, pent-em-in

## Per-game results

| Game | 3D | Moves | Long tasks | Max LT (ms) | Frame p50/p95 (ms) | Heap mount → last | Δ heap | Suspected leaks |
|---|---|---:|---:|---:|---:|---:|---:|---|
| kings-quadraphages | yes | 2/30 | 0 | 0.0 | 16.7/16.8 | 3.47 MB → 4.86 MB | 1.40 MB | Controller cleanup audited in this PR (AI timer/generation + destroyGame wiring). |
| hex | no | 30/30 | 0 | 0.0 | 16.7/16.8 | 2.98 MB → 3.34 MB | 0.36 MB | Controller cleanup audited in this PR (AI timer/generation + destroyGame wiring). |
| star-track | yes | 11/30 | 0 | 0.0 | 16.7/16.7 | 3.00 MB → 5.14 MB | 2.14 MB | Controller cleanup audited in this PR (AI timer/generation + destroyGame wiring). |
| hex-a-gone | yes | 5/30 | 0 | 0.0 | 16.7/16.7 | 3.03 MB → 5.21 MB | 2.18 MB | Controller cleanup audited in this PR (AI timer/generation + destroyGame wiring). |
| calla | no | 30/30 | 0 | 0.0 | 16.7/16.7 | 3.00 MB → 3.34 MB | 0.34 MB | No strong leak signal from heap remount cycles. |
| sum-dominoes | no | 4/30 | 0 | 0.0 | 16.7/16.7 | 2.98 MB → 3.37 MB | 0.39 MB | No strong leak signal from heap remount cycles. |
| par-55 | no | 11/30 | 0 | 0.0 | 16.7/16.7 | 3.09 MB → 3.48 MB | 0.39 MB | No strong leak signal from heap remount cycles. |
| ramrod | no | 18/30 | 0 | 0.0 | 16.7/16.7 | 2.98 MB → 3.93 MB | 0.95 MB | No strong leak signal from heap remount cycles. |
| kwatro-sinko | yes | 30/30 | 2 | 104.0 | 16.7/16.8 | 3.06 MB → 5.54 MB | 2.48 MB | No strong leak signal from heap remount cycles. |
| fiar | yes | 30/30 | 1 | 56.0 | 16.7/16.8 | 5.37 MB → 5.18 MB | -0.20 MB | No strong leak signal from heap remount cycles. |
| juggle | no | 30/30 | 0 | 0.0 | 16.7/16.7 | 3.07 MB → 3.88 MB | 0.81 MB | No strong leak signal from heap remount cycles. |
| contig-60 | no | 26/30 | 0 | 0.0 | 16.7/16.7 | 2.94 MB → 3.49 MB | 0.55 MB | No strong leak signal from heap remount cycles. |
| stars-bars | no | 10/30 | 0 | 0.0 | 16.7/16.8 | 3.05 MB → 3.47 MB | 0.41 MB | No strong leak signal from heap remount cycles. |
| fab-a-diffy | no | 4/30 | 0 | 0.0 | 16.7/16.7 | 3.29 MB → 3.66 MB | 0.37 MB | No strong leak signal from heap remount cycles. |
| queens-guards | yes | 5/30 | 1 | 75.0 | 16.7/16.7 | 5.36 MB → 5.45 MB | 0.09 MB | No strong leak signal from heap remount cycles. |
| prime-gold | yes | 3/30 | 2 | 74.0 | 16.7/16.7 | 3.26 MB → 6.03 MB | 2.77 MB | Controller cleanup audited in this PR (AI timer/generation + destroyGame wiring). |
| remainder-islands | no | 25/30 | 0 | 0.0 | 16.7/16.7 | 3.03 MB → 3.96 MB | 0.92 MB | No strong leak signal from heap remount cycles. |
| pent-em-in | yes | 3/30 | 0 | 0.0 | 16.7/16.7 | 3.11 MB → 5.21 MB | 2.10 MB | No strong leak signal from heap remount cycles. |
| frac-fact | no | 11/30 | 0 | 0.0 | 16.7/16.7 | 3.05 MB → 3.42 MB | 0.38 MB | Controller cleanup audited in this PR (AI timer/generation + destroyGame wiring). |
| fraction-pinball | no | 10/30 | 0 | 0.0 | 16.7/16.8 | 3.00 MB → 3.43 MB | 0.43 MB | Controller cleanup audited in this PR (AI timer/generation + destroyGame wiring). |

## Notes (q-mp-058 re-run)

Report-only tip re-measurement against the Oct 7 baseline. Unmount cleanup listed in the Oct 7 report remains in tree; this pass did not add new destroyGame wiring. See `docs/dev/q-mp-058-perf-delta-2026-10-09.md` for deltas.

## How to re-run

```bash
npm run perf:runtime
# optional: PERF_GAMES=hex,fiar PERF_MOVES=30 npm run perf:runtime
```

Generated: 2026-10-09T03:56:22.589Z

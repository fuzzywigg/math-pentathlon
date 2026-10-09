# Runtime perf — 2026-10-07

Playwright + Chrome DevTools Protocol harness (`scripts/runtime-perf.mjs`). Report-only: no CI fail thresholds.

## Method

- Base URL: `http://127.0.0.1:5179` (Vite middleware-mode server started by the script)
- Per game: up to **30** scripted legal moves (human-vs-human, both seats — product has no AI-vs-AI mode), then **5** navigate-away/back cycles
- Metrics: `PerformanceObserver` long tasks, rAF frame deltas (~2s sample after play), CDP `Performance.getMetrics` → `JSHeapUsedSize` (best-effort `HeapProfiler.collectGarbage` before samples)
- 3D games loaded with `?board3d=1`: kings-quadraphages, star-track, hex-a-gone, fiar, queens-guards, kwatro-sinko, prime-gold, pent-em-in
- Machine-readable twin: [`runtime-perf-2026-10-07.json`](./runtime-perf-2026-10-07.json)

## Per-game results

| Game | 3D | Moves | Long tasks | Max LT (ms) | Frame p50/p95 (ms) | Heap mount → last | Δ heap |
|---|---|---:|---:|---:|---:|---:|---:|
| kings-quadraphages | yes | 3/30 | 0 | 0.0 | 16.7/16.7 | 3.01 → 4.51 MB | 1.51 MB |
| hex | no | 30/30 | 0 | 0.0 | 16.7/16.7 | 2.69 → 3.03 MB | 0.34 MB |
| star-track | yes | 9/30 | 0 | 0.0 | 16.7/16.7 | 3.03 → 4.80 MB | 1.77 MB |
| hex-a-gone | yes | 4/30 | 0 | 0.0 | 16.7/16.7 | 4.64 → 4.69 MB | 0.05 MB |
| calla | no | 30/30 | 0 | 0.0 | 16.7/16.7 | 2.72 → 3.04 MB | 0.33 MB |
| sum-dominoes | no | 17/30 | 0 | 0.0 | 16.7/16.7 | 2.63 → 3.12 MB | 0.49 MB |
| par-55 | no | 10/30 | 0 | 0.0 | 16.7/16.8 | 2.77 → 3.22 MB | 0.45 MB |
| ramrod | no | 19/30 | 0 | 0.0 | 16.7/16.7 | 2.62 → 3.46 MB | 0.84 MB |
| kwatro-sinko | yes | 30/30 | 1 | 62.0 | 16.7/16.7 | 2.98 → 5.12 MB | 2.14 MB |
| fiar | yes | 30/30 | 0 | 0.0 | 16.7/16.8 | 3.03 → 4.69 MB | 1.66 MB |
| juggle | no | 30/30 | 0 | 0.0 | 16.7/16.7 | 2.75 → 3.58 MB | 0.83 MB |
| contig-60 | no | 23/30 | 0 | 0.0 | 16.7/16.7 | 2.59 → 3.09 MB | 0.50 MB |
| stars-bars | no | 12/30 | 0 | 0.0 | 16.7/16.7 | 2.75 → 3.16 MB | 0.42 MB |
| fab-a-diffy | no | 4/30 | 0 | 0.0 | 16.7/16.7 | 2.92 → 3.28 MB | 0.36 MB |
| queens-guards | yes | 4/30 | 0 | 0.0 | 16.7/16.8 | 2.72 → 5.05 MB | 2.33 MB |
| prime-gold | yes | 3/30 | 1 | 52.0 | 16.7/16.8 | 2.68 → 5.58 MB | 2.90 MB |
| remainder-islands | no | 25/30 | 0 | 0.0 | 16.7/16.7 | 2.73 → 3.59 MB | 0.86 MB |
| pent-em-in | yes | 3/30 | 0 | 0.0 | 16.7/16.7 | 3.29 → 4.79 MB | 1.50 MB |
| frac-fact | no | 11/30 | 0 | 0.0 | 16.7/16.7 | 2.74 → 3.12 MB | 0.38 MB |
| fraction-pinball | no | 11/30 | 0 | 0.0 | 16.7/16.7 | 2.69 → 3.10 MB | 0.41 MB |

Moves &lt; 30 usually means the scripted UI path stalled on multi-step chrome (selection → place) or the game ended early; remount heap cycles still ran.

## Findings

### Frame times / long tasks

- Frame p50/p95 stayed at ~16.7 ms across all games (idle rAF while the board was quiescent after scripted play).
- Long tasks were rare: **kwatro-sinko** (1 × 62 ms) and **prime-gold** (1 × 52 ms) during the sample window. No other game recorded a long task ≥ 50 ms.

### Heap growth after 5× navigate-away/back

- **2D games:** Δheap typically **0.3–0.9 MB** — no strong leak signal.
- **3D games:** Δheap typically **1.5–2.9 MB** (prime-gold 2.90, queens-guards 2.33, kwatro-sinko 2.14). Consistent with WebGL context + module retention across remounts; not a runaway leak, but higher than 2D.
- **hex-a-gone** remount Δ was near-zero (0.05 MB) despite 3D — dispose path looks healthy under this harness.

### Suspected leaks (code audit + metrics)

| Area | Evidence | Status |
|---|---|---|
| prime-gold AI timer after unmount | `destroyGame` omitted `clearAiTimer()` | **Fixed** — `clearAiTimer()` in `destroyGame` |
| star-track / hex-a-gone nested AI `setTimeout` | No generation token; timers could fire after route leave | **Fixed** — `aiGeneration` + invalidate in `destroyGame` |
| kings async AI `delay()` chain | In-flight `executeAITurn` continued after unmount | **Fixed** — generation checks after each `await` |
| hex worker AI on route leave | `aiGeneration` / `cancelHexAiRequests` only on new game | **Fixed** — `destroyGame` + `main.ts` wire-up |
| frac-fact AI/result timers | `clearAiTimer` / `clearResultTimer` never called on leave | **Fixed** — `destroyGame` + `main.ts` |
| fraction-pinball AI timeouts | `aiGeneration` bumped on new game only | **Fixed** — `destroyGame` + `main.ts` |
| three.js geometries / listeners | Board `unmount` already disposes geos/mats/renderer and removes pointer/resize/contextlost | No clear missing dispose found; 3D Δheap still elevated vs 2D |
| Remaining 2D games without `destroyGame` (calla, juggle, contig-60, fab-a-diffy, sum-dominoes, par-55, ramrod, stars-bars, remainder-islands) | Pending AI `setTimeout`s can still fire after leave if mid-think | Not changed this PR (no existing clear helper / incomplete destroy); remount Δheap stayed &lt; 1 MB |

## Cleanup shipped with this report

No rules or scoring changes. Unmount-only:

1. **prime-gold** — `destroyGame()` calls `clearAiTimer()`
2. **star-track / hex-a-gone / kings-quadraphages** — AI turn chains guarded with `aiGeneration`; `destroyGame()` invalidates in-flight work
3. **hex** — new `destroyGame()` (generation + cancel worker requests); wired in `main.ts`
4. **frac-fact** — new `destroyGame()` clears AI + result timers; wired in `main.ts`
5. **fraction-pinball** — new `destroyGame()` bumps `aiGeneration`; wired in `main.ts`

## How to re-run

```bash
npm run perf:runtime
# optional subset:
PERF_GAMES=hex,fiar PERF_MOVES=30 npm run perf:runtime
```

Generated: 2026-10-07T15:20:08.155Z

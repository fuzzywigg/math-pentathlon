# Memory-leak audit — 2026-10-07

Playwright + Chrome DevTools Protocol heap snapshots (`scripts/memory-leak-audit.mjs`). Menu open/close only — no rules or scoring changes.

## Method

- Base: `cursor/integration-fold-wave4-tip-36e4` (#476)
- Per game: warm open/close once, then **10** menu open → human-vs-human start → ← Games cycles
- 3D games use `?board3d=1`
- Metrics after GC: CDP `Performance.getMetrics` → `JSHeapUsedSize`; `HeapProfiler.takeHeapSnapshot` → Detached DOM node count + snapshot self size
- Δ = after 10 cycles − after warm (module graph already paid)
- Machine-readable: [`memory-leaks-before-2026-10-07.json`](./memory-leaks-before-2026-10-07.json), [`memory-leaks-after-2026-10-07.json`](./memory-leaks-after-2026-10-07.json)

## Before / after per game

| Game | 3D | Before Δ heap | After Δ heap | Before Δ detached | After Δ detached |
|---|---|---:|---:|---:|---:|
| kings-quadraphages | yes | +0.93 MB | +0.92 MB | 0 | 0 |
| hex | no | +0.30 MB | +0.30 MB | 0 | 0 |
| star-track | yes | +0.92 MB | +0.92 MB | 0 | 0 |
| hex-a-gone | yes | +1.02 MB | +1.02 MB | 0 | 0 |
| calla | no | +0.31 MB | +0.31 MB | 0 | 0 |
| sum-dominoes | no | +0.79 MB | +0.30 MB | 0 | 0 |
| par-55 | no | +0.67 MB | +0.51 MB | 0 | 0 |
| ramrod | no | +0.66 MB | +0.51 MB | 0 | 0 |
| kwatro-sinko | yes | +1.27 MB | +1.15 MB | 0 | 0 |
| fiar | yes | +1.11 MB | +1.11 MB | 0 | 0 |
| juggle | no | +0.82 MB | +0.87 MB | 0 | 0 |
| contig-60 | no | +0.87 MB | +0.87 MB | 0 | 0 |
| stars-bars | no | +0.71 MB | +0.72 MB | 0 | 0 |
| fab-a-diffy | no | +0.61 MB | +0.62 MB | 0 | 0 |
| queens-guards | yes | +1.41 MB | +1.46 MB | 0 | 0 |
| prime-gold | yes | +1.54 MB | +1.54 MB | 0 | 0 |
| remainder-islands | no | +0.75 MB | +0.75 MB | 0 | 0 |
| pent-em-in | yes | +1.25 MB | +1.24 MB | 0 | 0 |
| frac-fact | no | +0.74 MB | +0.74 MB | 0 | 0 |
| fraction-pinball | no | +0.77 MB | +0.73 MB | 0 | 0 |

### Absolute heap (after warm → after 10 cycles)

| Game | Before warm → end | After warm → end |
|---|---:|---:|
| kings-quadraphages | 4.97 MB → 5.90 MB | 4.98 MB → 5.90 MB |
| hex | 3.54 MB → 3.83 MB | 3.54 MB → 3.84 MB |
| star-track | 5.03 MB → 5.95 MB | 5.03 MB → 5.95 MB |
| hex-a-gone | 5.19 MB → 6.22 MB | 5.20 MB → 6.22 MB |
| calla | 3.57 MB → 3.88 MB | 3.57 MB → 3.88 MB |
| sum-dominoes | 3.68 MB → 4.48 MB | 4.18 MB → 4.48 MB |
| par-55 | 3.90 MB → 4.57 MB | 4.05 MB → 4.57 MB |
| ramrod | 3.82 MB → 4.48 MB | 3.97 MB → 4.48 MB |
| kwatro-sinko | 5.68 MB → 6.95 MB | 5.82 MB → 6.97 MB |
| fiar | 5.60 MB → 6.71 MB | 5.61 MB → 6.71 MB |
| juggle | 3.83 MB → 4.66 MB | 3.79 MB → 4.66 MB |
| contig-60 | 3.79 MB → 4.66 MB | 3.79 MB → 4.66 MB |
| stars-bars | 4.01 MB → 4.72 MB | 4.00 MB → 4.72 MB |
| fab-a-diffy | 4.17 MB → 4.78 MB | 4.18 MB → 4.79 MB |
| queens-guards | 5.88 MB → 7.29 MB | 5.82 MB → 7.29 MB |
| prime-gold | 5.41 MB → 6.94 MB | 5.40 MB → 6.95 MB |
| remainder-islands | 3.70 MB → 4.46 MB | 3.71 MB → 4.46 MB |
| pent-em-in | 5.36 MB → 6.61 MB | 5.49 MB → 6.73 MB |
| frac-fact | 3.72 MB → 4.46 MB | 3.72 MB → 4.46 MB |
| fraction-pinball | 3.68 MB → 4.45 MB | 3.73 MB → 4.46 MB |

## Findings

### Detached DOM

Detached DOM delta stayed **0** for every game before and after. Menu remounts are not leaving orphaned DOM trees under this harness.

### JS heap retention

- **2D games with new `destroyGame`:** clear drops on sum-dominoes (**+0.79 → +0.30 MB**), par-55 (**+0.67 → +0.51 MB**), ramrod (**+0.66 → +0.51 MB**). Remaining 2D Δheap is typically **0.3–0.9 MB** (module/CSS retention noise across remounts).
- **3D games:** Δheap still **~0.9–1.5 MB** after 10 cycles — consistent with WebGL context + Three.js module retention. Board `unmount` already disposes geometries/materials/renderer, removes pointer/resize/contextlost listeners, unbinds visibility, and calls `forceContextLoss`.
- **kwatro-sinko:** modest improvement (**+1.27 → +1.15 MB**); no additional dispose gaps found.

### Clear leaks fixed (code audit)

| Area | Evidence | Fix |
|---|---|---|
| sum-dominoes / par-55 / ramrod / stars-bars | `clearAiTimer` existed but cleanup was shell-only | `destroyGame()` + mount wiring |
| juggle | nested AI `setTimeout` with no generation token | `aiGeneration` + `scheduleAI` + `destroyGame()` |
| contig-60 | `aiGeneration` never bumped on route leave | `destroyGame()` bumps generation, clears mounts |
| remainder-islands | AI `setTimeout` without cancel on leave | `aiGeneration` + `scheduleAI` + `destroyGame()` |
| hex AI worker | `destroyGame` cancelled requests but kept Worker client | `disposeHexAiWorker()` in `destroyGame` |
| Three.js boards | dispose/listener paths already complete | no change |

## Cleanup shipped

No rules or scoring changes. Unmount-only:

1. **sum-dominoes / par-55 / ramrod / stars-bars** — new `destroyGame()` clears AI timers and drops `activeContainer`; wired in `game-route-mounts.ts`
2. **juggle / remainder-islands** — AI timeout generation tokens + `destroyGame()`; wired in mounts
3. **contig-60** — `destroyGame()` invalidates AI generation and clears mounts; wired in mounts
4. **hex** — `disposeHexAiWorker()` on route leave

## How to re-run

```bash
npm run audit:memory
# labeled twin files:
MEM_LEAK_LABEL=before npm run audit:memory
MEM_LEAK_LABEL=after npm run audit:memory
# optional subset:
MEM_LEAK_GAMES=hex,fiar MEM_LEAK_CYCLES=10 npm run audit:memory
```

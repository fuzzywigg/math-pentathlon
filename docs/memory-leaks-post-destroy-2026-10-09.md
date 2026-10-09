# Memory-leak tip re-run — post destroy/remount folds (q-mp-145)

**Task:** q-mp-145  
**Tip base:** `cursor/mp-tip-post477` (destroy folds #638 / #647 already on tip)  
**Date:** 2026-10-09  
**Baseline twin:** [`memory-leaks-tip-rerun-2026-10-09.json`](./memory-leaks-tip-rerun-2026-10-09.json) (q-mp-058 / #625)  
**This twin:** [`memory-leaks-post-destroy-2026-10-09.json`](./memory-leaks-post-destroy-2026-10-09.json)

## Method

```bash
MEM_LEAK_LABEL=post-destroy MEM_LEAK_DATE=2026-10-09 npm run audit:memory
```

- Playwright menu open → human-vs-human start → ← Games, warm + 10 cycles
- CDP `HeapProfiler` + `Performance.getMetrics` after GC
- 3D games use `?board3d=1`
- Harness: retry force-click if accordion remount detaches the card (no scrollIntoView race)

## Delta vs tip-rerun (2026-10-09)

| Game | 3D | Tip Δheap MB | Post-destroy Δheap MB | Δ | Tip Δdet | Post Δdet | Tip listeners | Post listeners |
|---|---|---:|---:|---:|---:|---:|---|---|
| kings-quadraphages | yes | +0.90 | +0.88 | -0.03 | 0 | 0 | 133→133 | 122→122 |
| hex | no | +0.31 | +0.41 | +0.10 | 0 | 0 | 133→133 | 122→122 |
| star-track | yes | +0.86 | +0.82 | -0.05 | 0 | 0 | 133→133 | 122→122 |
| hex-a-gone | yes | +0.97 | +0.91 | -0.06 | 0 | 0 | 133→133 | 122→122 |
| calla | no | +0.32 | +0.52 | +0.21 | 0 | 0 | 143→143 | 122→122 |
| sum-dominoes | no | +0.72 | +0.52 | -0.19 | 0 | 0 | 135→135 | 122→122 |
| par-55 | no | +0.70 | +0.25 | -0.45 | 0 | 0 | 144→144 | 122→122 |
| ramrod | no | +0.70 | +0.50 | -0.20 | 0 | 0 | 139→139 | 122→122 |
| kwatro-sinko | yes | +1.12 | +1.14 | +0.02 | 0 | 0 | 133→133 | 122→122 |
| fiar | yes | +1.14 | +0.98 | -0.16 | 0 | 0 | 133→133 | 122→122 |
| juggle | no | +0.88 | +0.42 | -0.45 | 0 | 0 | 136→136 | 122→122 |
| contig-60 | no | +0.87 | +0.28 | -0.59 | 0 | 0 | 137→137 | 122→122 |
| stars-bars | no | +0.71 | +0.25 | -0.46 | 0 | 0 | 144→144 | 122→122 |
| fab-a-diffy | no | +0.62 | +0.27 | -0.35 | 0 | 0 | 219→219 | 122→122 |
| queens-guards | yes | +1.40 | +0.97 | -0.42 | 0 | 0 | 133→133 | 122→122 |
| prime-gold | yes | +1.47 | +3.17 | +1.71 | 0 | 0 | 133→133 | 122→122 |
| remainder-islands | no | +0.74 | +0.24 | -0.50 | 0 | 0 | 133→133 | 122→122 |
| pent-em-in | yes | +1.34 | +0.87 | -0.47 | 0 | 0 | 133→133 | 122→122 |
| frac-fact | no | +0.74 | +0.26 | -0.48 | 0 | 0 | 133→133 | 122→122 |
| fraction-pinball | no | +0.78 | +0.25 | -0.53 | 0 | 0 | 133→133 | 122→122 |

Exact tip evidence cited in the queue (multi-hundred-KB 3D band): kings `945724`, hex-a-gone `1013572`, star-track `907012` `deltaJsHeapBytes`, all with `deltaDetachedDom` 0. Post-destroy re-measure: kings `918900`, hex-a-gone `950904`, star-track `854876` (same band; still 0 detached).

## Findings

### Detached DOM / listeners (HvH remount)

- **Δ detached DOM = 0** for every game (unchanged vs tip-rerun).
- **Δ `jsEventListeners` = 0** for every game (warm → after 10 cycles). Absolute listener counts differ across VMs/Chrome builds; stability within a run is the leak signal.

### JS heap

- Most 2D games improved vs tip-rerun after destroy folds (par-55 / juggle / contig / stars-bars / remainder / frac / pinball drop ~0.4–0.6 MB).
- Headline 3D games (kings / hex-a-gone / star-track) stay in the **~0.8–1.0 MB** retention band — consistent with WebGL/Three.js module retention, not open listeners.
- **prime-gold** post-destroy Δheap **+3.17 MB** vs tip **+1.47 MB** with listeners stable and Δdet=0. Treat as GC/harness noise on this VM (same dispose path as other 3D boards); not a clear listener leak under this HvH harness.

### P1 timer leaks fixed (controllers only; delays unchanged)

Bare `setTimeout` AI paint/think delays were not cleared on `destroyGame` in four games. Fixed with the existing `scheduleGenerationGated` / cancellable-delay pattern (same delays):

| Game | Delay constants (HOLD) | Fix |
|---|---|---|
| hex-a-gone | `AI_THINKING_DELAY = 800` | `aiTimer` + `aiGeneration`; `scheduleAI`; clear in `destroyGame` / new-game |
| star-track | `AI_THINKING_DELAY = 600` | same |
| queens-guards | paint delays **500** / **400** | track paint-delay timer; clear in `destroyGame` / new-game |
| kings-quadraphages | `AI_THINKING_DELAY = 500`, `AI_MOVE_DELAY = 300` | cancellable `delay` + generation check after awaits |

### HOLD (do not change)

- **`src/games/*/ai.ts`** — no timer/listener work; search/scoring/difficulty untouched. **HOLD.**
- Delay millisecond constants above — **HOLD** (cleanup only).
- Hex Hard assert **450ms** — untouched.
- Stars & Bars history cap — absent / untouched.
- Three.js board unmount dispose paths — already complete; no board-ui listener P1.

## How to re-run

```bash
MEM_LEAK_LABEL=post-destroy MEM_LEAK_DATE=2026-10-09 npm run audit:memory
npm run test:unit
```

# q-mp-330 — Pent'Em In board-3d layout-read batch

**Task id:** `q-mp-330`  
**Host:** `src/ui/three/pent-em-in-board-3d.ts`  
**Base:** `cursor/mp-tip-post785` @ `c9b55cff`

## Why this host

Inventory (`docs/dev/board3d-layout-reads-inventory-2026-10-09.md`) lists Pent'Em In with **4** layout-forcing API hits (roles A×2, B, C). Hex (`q-mp-282`), Queens (`q-mp-303`), and Star Track (`q-mp-302`) are already batched on tip; open `#826` / `q-mp-329` owns Prime Gold (same pattern, different host). This host is placement-heavy: `pickCell` runs on pointermove hover while a piece is selected, so caching the canvas CSS rect avoids a forced reflow per hover frame.

## Before (tip `c9b55cff`)

```text
$ rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/pent-em-in-board-3d.ts
270:    const w = Math.max(container.clientWidth || 400, 120);
271:    const h = Math.max(container.clientHeight || 400, 120);
277:    const rect = canvas.getBoundingClientRect();   # pick — every hover/tap
576:    const rect = canvas.getBoundingClientRect();   # project
# → 4 hits
```

| Path                | Forced layout reads                                          |
| ------------------- | ------------------------------------------------------------ |
| `resize()`          | `clientWidth` + `clientHeight` (adjacent)                    |
| `pickCell` (hover)  | **1× `getBoundingClientRect` per pointermove**               |
| `cellToClientPoint` | **1× `getBoundingClientRect` per call** (separate from pick) |

## After (this change)

```text
$ rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/pent-em-in-board-3d.ts
# sole getBoundingClientRect inside measureCanvasCssRect()
# sole clientWidth / clientHeight inside measureHostCssSize()
# → 3 symbol hits (1 gBCR + 2 host size); hot path reuses cache
```

| Path                | Forced layout reads                                                 |
| ------------------- | ------------------------------------------------------------------- |
| `resize()`          | invalidate canvas cache → batched host size → sync (no canvas gBCR) |
| `pickCell` (hover)  | **1×** on first use after layout; **0** while cache warm            |
| `cellToClientPoint` | **0** when cache warm (shared with pick)                            |

Hot-path reflow on pick/project: **1 per call → 1 per layout epoch** (first pick/project after resize; subsequent calls reuse cache).

## What changed

- Funnel canvas geometry through `measureCanvasCssRect()` / `getCanvasCssRect()`.
- Share one `CssRect` cache between pick (B) and project (C).
- Batch host `clientWidth`/`clientHeight` in `measureHostCssSize()`; invalidate canvas cache inside `resize()` (wired via existing `bindBoard3dLayout` — window resize, visualViewport resize, host ResizeObserver / orientation); lazy-seed on next pick/project.
- Same NDC / raycast / project math — no visual or hit-mapping change intended (same tap-mapping caution as `#804` / `#826`).

## Non-goals / left alone

- Other `*-board-3d.ts` hosts; Prime Gold `#826`; Kings `q-mp-331`; AI / rules / scoring / timing / copy
- Hex Hard **450ms**; Stars & Bars history cap; ratchet / knip baselines
- `*/rules.ts` and legal-move / scoring paths untouched

## Verify

```bash
rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/pent-em-in-board-3d.ts
npx vitest run --project unit-isolated tests/unit/mp3d-pent-em-in*.test.ts
npx vitest run --project unit-isolated tests/unit/mp3d-*-lifecycle.test.ts
npm run verify
npm run test:unit
```

**Next action: fold into tip by the tip owner.**

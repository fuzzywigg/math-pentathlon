# q-mp-303 — Queens & Guards board-3d layout-read batch

**Task id:** `q-mp-303`  
**Host:** `src/ui/three/queens-guards-board-3d.ts`  
**Base:** `cursor/mp-tip-post755` @ `89e40ad7`

## Why this host

Inventory (`docs/dev/board3d-layout-reads-inventory-2026-10-09.md`) lists Queens & Guards with **4** layout-forcing API hits (roles A×2, B, C). Open `#784` / `q-mp-282` owns Hex-a-Gone; `q-mp-302` owns Star Track — this host is disjoint. Tutorial already batched (`#769` / `q-mp-255`). Docs inventory `#757` is report-only.

## Before (tip `89e40ad7`)

```text
$ rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/queens-guards-board-3d.ts
350:    const w = Math.max(container.clientWidth || 480, 120);
351:    const h = Math.max(container.clientHeight || 480, 120);
358:    const rect = canvas.getBoundingClientRect();   # pick — every tap
723:    const rect = canvas.getBoundingClientRect();   # project
# → 4 hits
```

| Path                | Forced layout reads                                          |
| ------------------- | ------------------------------------------------------------ |
| `resize()`          | `clientWidth` + `clientHeight` (adjacent)                    |
| `pickCoord` (tap)   | **1× `getBoundingClientRect` per call**                      |
| `cellToClientPoint` | **1× `getBoundingClientRect` per call** (separate from pick) |

## After (this change)

```text
$ rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/queens-guards-board-3d.ts
# sole getBoundingClientRect inside measureCanvasCssRect()
# sole clientWidth / clientHeight inside measureHostCssSize()
# → 3 symbol hits (1 gBCR + 2 host size); hot path reuses cache
```

| Path                | Forced layout reads                                                 |
| ------------------- | ------------------------------------------------------------------- |
| `resize()`          | invalidate canvas cache → batched host size → sync (no canvas gBCR) |
| `pickCoord` (tap)   | **1×** on first use after layout; **0** while cache warm            |
| `cellToClientPoint` | **0** when cache warm (shared with pick)                            |

Hot-path reflow on tap/project: **1 per call → 1 per layout epoch** (first pick/project after resize; subsequent calls reuse cache).

## What changed

- Funnel canvas geometry through `measureCanvasCssRect()` / `getCanvasCssRect()`.
- Share one `CssRect` cache between pick (B) and project (C).
- Batch host `clientWidth`/`clientHeight` in `measureHostCssSize()`; invalidate canvas cache inside `resize()` (wired via existing `bindBoard3dLayout`); lazy-seed on next pick/project.
- Same NDC / raycast / project math — no visual or pick behavior change intended.

## Non-goals / left alone

- Other `*-board-3d.ts` hosts; Hex `#784`; Star Track `q-mp-302` / `#687`; AI / rules / scoring / timing / copy
- Hex Hard **450ms**; Stars & Bars history cap; ratchet / knip baselines

## Verify

```bash
rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/queens-guards-board-3d.ts
npx vitest run --project unit-isolated tests/unit/mp3d-queens-guards-*.test.ts
npx vitest run --project unit-isolated tests/unit/mp3d-*-lifecycle.test.ts
npm run lint
npm run typecheck
```

**Next action: fold into tip by the tip owner.**

# q-mp-282 — Hex-a-Gone board-3d layout-read batch

**Task id:** `q-mp-282`  
**Host:** `src/ui/three/hex-a-gone-board-3d.ts`  
**Base:** `cursor/mp-tip-post755` @ `74a1596f`

## Why this host

Inventory (`docs/dev/board3d-layout-reads-inventory-2026-10-09.md`) marks Hex-a-Gone as a densest interaction path: role **B** (`canvas` geometry) runs on **pointermove** hover ghost. Peers still show **4** layout-forcing API hits each. Star Track left alone (open `#687` HOLD). Tutorial already batched (`#769` / `q-mp-255`). Docs inventory `#757` is report-only.

## Before (tip `74a1596f`)

```text
$ rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/hex-a-gone-board-3d.ts
252:    const w = Math.max(container.clientWidth || 480, 120);
253:    const h = Math.max(container.clientHeight || 480, 120);
281:    const rect = canvas.getBoundingClientRect();   # pick — every pointermove
561:    const rect = canvas.getBoundingClientRect();   # project
# → 4 hits
```

| Path                                    | Forced layout reads                                          |
| --------------------------------------- | ------------------------------------------------------------ |
| `resize()`                              | `clientWidth` + `clientHeight` (adjacent)                    |
| `pickCellFromEvent` (pointermove / tap) | **1× `getBoundingClientRect` per call**                      |
| `cellToClientPoint`                     | **1× `getBoundingClientRect` per call** (separate from pick) |

## After (this change)

```text
$ rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/hex-a-gone-board-3d.ts
# sole getBoundingClientRect inside measureCanvasCssRect()
# sole clientWidth / clientHeight inside measureHostCssSize()
# → 3 symbol hits (1 gBCR + 2 host size); hot path reuses cache
```

| Path                                    | Forced layout reads                                                        |
| --------------------------------------- | -------------------------------------------------------------------------- |
| `resize()`                              | invalidate → batched host size → sync → **1×** canvas measure (seed cache) |
| `pickCellFromEvent` (pointermove / tap) | **0** when cache warm (shared with project)                                |
| `cellToClientPoint`                     | **0** when cache warm                                                      |

Hot-path reflow on hover: **1 → 0** per pointermove after the first layout seed.

## What changed

- Funnel canvas geometry through `measureCanvasCssRect()` / `getCanvasCssRect()`.
- Share one `CssRect` cache between pick (B) and project (C).
- Batch host `clientWidth`/`clientHeight` in `measureHostCssSize()`; invalidate + re-seed canvas cache inside `resize()` (wired via existing `bindBoard3dLayout`).
- Same NDC / raycast / project math — no visual or pick behavior change intended.

## Non-goals / left alone

- Other `*-board-3d.ts` hosts; Star Track `#687`; AI / rules / scoring / timing / copy
- Hex Hard **450ms**; Stars & Bars history cap; ratchet / knip baselines

## Verify

```bash
rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/hex-a-gone-board-3d.ts
npx vitest run --project unit-isolated tests/unit/mp3d-hex-a-gone-*.test.ts
npx vitest run --project unit-isolated tests/unit/mp3d-*-lifecycle.test.ts
npm run lint
npm run typecheck
```

**Next action: fold into tip by the tip owner.**

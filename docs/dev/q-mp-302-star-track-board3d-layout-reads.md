# q-mp-302 — Star Track board-3d layout-read batch

**Task id:** `q-mp-302`  
**Host:** `src/ui/three/star-track-board-3d.ts`  
**Base:** `cursor/mp-tip-post755` @ `89e40ad7`

## Why this host

Inventory (`docs/dev/board3d-layout-reads-inventory-2026-10-09.md`) lists Star Track with **4** layout-forcing reads: role **D** (layout top for viewport fit), role **A** (`clientWidth`/`clientHeight` after fit), role **C** (canvas project). No canvas pick (B) — interaction stays on DOM chain controls. Open `#784` owns hex-a-gone; this PR picks the disjoint star-track host. Open `#687` Star Track p95 HOLD left alone (no harness / timing edits).

## Before (tip `89e40ad7`)

```text
$ rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/star-track-board-3d.ts
360:    const top = layout.getBoundingClientRect().top;   # fitHostToViewport
377:    const w = Math.max(canvasHost.clientWidth || 360, 120);
378:    const h = Math.max(canvasHost.clientHeight || 360, 120);
572:    const rect = canvas.getBoundingClientRect();       # spaceToClientPoint
# → 4 hits
```

| Path                               | Forced layout reads                                     |
| ---------------------------------- | ------------------------------------------------------- |
| `resize()` → `fitHostToViewport()` | **1×** layout `getBoundingClientRect`                   |
| `resize()` after style writes      | **2×** `clientWidth` / `clientHeight` (write-then-read) |
| `spaceToClientPoint`               | **1×** canvas `getBoundingClientRect` per call          |

## After (this change)

```text
$ rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/star-track-board-3d.ts
# sole layout getBoundingClientRect inside measureLayoutCssTop()
# sole canvas getBoundingClientRect inside measureCanvasCssRect()
# clientWidth / clientHeight removed (renderer sync uses authored fit side)
# → 2 symbol hits
```

| Path                               | Forced layout reads                                                                             |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| `resize()` → `fitHostToViewport()` | **1×** layout top via `measureLayoutCssTop()`; sync uses returned `side` (no host size re-read) |
| `spaceToClientPoint`               | **1×** on first use after layout; **0** while cache warm                                        |

Hot-path reflow on project hooks: **1 per call → 1 per layout epoch**. Resize path drops the post-write `clientWidth`/`clientHeight` pair (**−2** forced reads per resize).

## What changed

- Funnel canvas geometry through `measureCanvasCssRect()` / `getCanvasCssRect()`.
- Funnel layout top through `measureLayoutCssTop()`.
- `fitHostToViewport()` returns the authored CSS `side`; `resize()` syncs the renderer from that value (same px as the inline width/height/maxHeight writes) instead of re-reading host box after dirtying layout.
- Invalidate canvas cache inside `resize()` (wired via existing `bindBoard3dLayout`); lazy-seed on next project.
- Same fit math / project math — no visual or timing change intended. `#687` harness untouched.

## Non-goals / left alone

- Other `*-board-3d.ts` hosts; hex `#784`; queens `q-mp-303`; AI / rules / scoring / timing / copy
- Star Track move p95 HOLD `#687`; Hex Hard **450ms**; Stars & Bars history cap; ratchet / knip baselines

## Verify

```bash
rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/star-track-board-3d.ts
npx vitest run --project unit-shared tests/unit/mp3d-star-track-*.test.ts
npx vitest run --project unit-shared tests/unit/mp3d-*-lifecycle.test.ts
npm run lint
npm run typecheck
npm run lint:ratchet
```

**Next action: fold into tip by the tip owner.**

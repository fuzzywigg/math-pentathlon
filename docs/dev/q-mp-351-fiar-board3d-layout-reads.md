# q-mp-351 — FIAR board-3d layout-read batch

**Task id:** `q-mp-351`  
**Host:** `src/ui/three/fiar-board-3d.ts`  
**Base:** `cursor/mp-tip-post785` @ `c9b55cff`

## Why this host

Inventory and backlog (`docs/dev/backlog-2026-10-10a.md` / `q-mp-351`) list FIAR with **4** layout-forcing API hits (roles A×2, B, C). Hex (`q-mp-282` / `#784`), Queens (`q-mp-303` / `#804`), and Star Track (`q-mp-302` / `#807`) are already batched on tip; open `#826` / `q-mp-329` owns Prime Gold — this host is disjoint.

## Before (tip `c9b55cff`)

```text
$ rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/fiar-board-3d.ts
237:    const w = Math.max(container.clientWidth || 480, 120);
238:    const h = Math.max(container.clientHeight || 360, 120);
247:    const rect = canvas.getBoundingClientRect();   # pick — every tap
475:    const rect = canvas.getBoundingClientRect();   # project
# → 4 hits
```

| Path                 | Forced layout reads                                          |
| -------------------- | ------------------------------------------------------------ |
| `resize()`           | `clientWidth` + `clientHeight` (adjacent)                    |
| `pickFromEvent` (tap)| **1× `getBoundingClientRect` per call**                      |
| `nodeToClientPoint`  | **1× `getBoundingClientRect` per call** (separate from pick) |

## After (this change)

```text
$ rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/fiar-board-3d.ts
# sole getBoundingClientRect inside measureCanvasCssRect()
# sole clientWidth / clientHeight inside measureHostCssSize()
# → 3 symbol hits (1 gBCR + 2 host size); hot path reuses cache
```

| Path                 | Forced layout reads                                                 |
| -------------------- | ------------------------------------------------------------------- |
| `resize()`           | invalidate canvas cache → batched host size → sync (no canvas gBCR) |
| `pickFromEvent` (tap)| **1×** on first use after layout; **0** while cache warm            |
| `nodeToClientPoint`  | **0** when cache warm (shared with pick)                            |

Hot-path reflow on tap/project: **1 per call → 1 per layout epoch** (first pick/project after resize; subsequent calls reuse cache). Cache invalidates via `resize()` on window / visualViewport / ResizeObserver layout (existing `bindBoard3dLayout`).

## What changed

- Funnel canvas geometry through `measureCanvasCssRect()` / `getCanvasCssRect()`.
- Share one `CssRect` cache between pick (B) and project (C).
- Batch host `clientWidth`/`clientHeight` in `measureHostCssSize()`; invalidate canvas cache inside `resize()` (wired via existing `bindBoard3dLayout`); lazy-seed on next pick/project.
- Same NDC / raycast / project math — no visual or pick behavior change intended (same tap-mapping caution as `#804` / `#826`).

## Non-goals / left alone

- Other `*-board-3d.ts` hosts; Prime Gold `#826`; AI / rules / scoring / timing / copy
- Hex Hard **450ms**; Stars & Bars history cap; ratchet / knip baselines
- `*/rules.ts` and legal-move / scoring paths untouched

## Verify

```bash
rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/fiar-board-3d.ts
npx vitest run --project unit-isolated tests/unit/mp3d-fiar-*.test.ts
npx vitest run --project unit-isolated tests/unit/mp3d-*-lifecycle.test.ts
npm run verify
npm run test:unit
```

**Next action: fold into tip by the tip owner.**

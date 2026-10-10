# q-mp-329 — Prime Gold board-3d layout-read batch

**Task id:** `q-mp-329`  
**Host:** `src/ui/three/prime-gold-board-3d.ts`  
**Base:** `cursor/mp-tip-post785` @ `21719062`

## Why this host

Inventory (`docs/dev/board3d-layout-reads-inventory-2026-10-09.md`) lists Prime Gold with **4** layout-forcing API hits (roles A×2, B, C). Hex (`q-mp-282`), Queens (`q-mp-303`), and Star Track (`q-mp-302`) are already batched on tip; this host is the next disjoint board-3d. Open `#816` owns prime-gold UI cov r18 (tests-only) — no product overlap.

## Before (tip `21719062`)

```text
$ rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/prime-gold-board-3d.ts
323:    const w = Math.max(container.clientWidth || 420, 120);
324:    const h = Math.max(container.clientHeight || 420, 120);
577:    const rect = canvas.getBoundingClientRect();   # pick — every tap
633:    const rect = canvas.getBoundingClientRect();   # project
# → 4 hits
```

| Path                | Forced layout reads                                          |
| ------------------- | ------------------------------------------------------------ |
| `resize()`          | `clientWidth` + `clientHeight` (adjacent)                    |
| `onPointer` (tap)   | **1× `getBoundingClientRect` per call**                      |
| `cellToClientPoint` | **1× `getBoundingClientRect` per call** (separate from pick) |

## After (this change)

```text
$ rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/prime-gold-board-3d.ts
# sole getBoundingClientRect inside measureCanvasCssRect()
# sole clientWidth / clientHeight inside measureHostCssSize()
# → 3 symbol hits (1 gBCR + 2 host size); hot path reuses cache
```

| Path                | Forced layout reads                                                 |
| ------------------- | ------------------------------------------------------------------- |
| `resize()`          | invalidate canvas cache → batched host size → sync (no canvas gBCR) |
| `onPointer` (tap)   | **1×** on first use after layout; **0** while cache warm            |
| `cellToClientPoint` | **0** when cache warm (shared with pick)                            |

Hot-path reflow on tap/project: **1 per call → 1 per layout epoch** (first pick/project after resize; subsequent calls reuse cache).

## What changed

- Funnel canvas geometry through `measureCanvasCssRect()` / `getCanvasCssRect()`.
- Share one `CssRect` cache between pick (B) and project (C).
- Batch host `clientWidth`/`clientHeight` in `measureHostCssSize()`; invalidate canvas cache inside `resize()` (wired via existing `bindBoard3dLayout`); lazy-seed on next pick/project.
- Same NDC / raycast / project math — no visual or pick behavior change intended (same tap-mapping caution as `#804`).

## Non-goals / left alone

- Other `*-board-3d.ts` hosts; Hex / Queens / Star Track already batched; AI / rules / scoring / timing / copy
- Hex Hard **450ms**; Stars & Bars history cap; ratchet / knip baselines
- `*/rules.ts` and legal-move / scoring paths untouched

## Verify

```bash
rg -n 'getBoundingClientRect|clientWidth|clientHeight' src/ui/three/prime-gold-board-3d.ts
npx vitest run --project unit-isolated tests/unit/mp3d-prime-gold*.test.ts
npx vitest run --project unit-isolated tests/unit/mp3d-*-lifecycle.test.ts
npm run verify
npm run test:unit
```

**Next action: fold into tip by the tip owner.**

# Canvas / SVG / WebGL DPR + resize audit (2026-10)

Task: `burn-1008-mp-canvas-dpr-resize`

Checked against tip `cursor/integration-fold-wave5-tip-4af0`. Related open drafts
reviewed and **not** duplicated: #511 (render perf hover), #486 (mobile touch),
#490 (mp3d canvas-ready), #457 (mobile viewport).

## Per-game table

| Game               | 2D/3D                   | DPR ok                             | Resize ok                        | Hit-test ok                 | Fixed / reported                               |
| ------------------ | ----------------------- | ---------------------------------- | -------------------------------- | --------------------------- | ---------------------------------------------- |
| calla              | 2D SVG                  | N/A (SVG)                          | OK (element hits)                | OK                          | reported OK                                    |
| contig-60          | 2D DOM                  | N/A                                | OK                               | OK                          | reported OK                                    |
| fab-a-diffy        | 2D DOM+SVG              | N/A                                | OK                               | OK                          | reported OK                                    |
| fiar               | 2D SVG + 3D             | 3D capped 1.5; refreshed on layout | 3D: window + visualViewport + RO | 3D NDC via `clientToNdc`    | **fixed** 3D DPR/layout                        |
| frac-fact          | 2D SVG/DOM              | N/A                                | OK                               | OK                          | reported OK                                    |
| fraction-pinball   | 2D SVG (decorative)     | N/A                                | OK                               | OK (buttons)                | reported OK                                    |
| hex                | 2D SVG                  | N/A                                | OK                               | OK (element)                | reported OK                                    |
| hex-a-gone         | 2D SVG + 3D             | 3D capped; refreshed               | layout binder                    | NDC helper                  | **fixed** 3D DPR/layout + context-lost cleanup |
| juggle             | 2D DOM + canvas preview | preview was 1×                     | N/A for preview                  | board OK (DOM)              | **fixed** HiDPI preview (cap 2)                |
| kings-quadraphages | 2D DOM + 3D             | 3D capped; refreshed               | layout binder                    | NDC helper                  | **fixed** 3D DPR/layout                        |
| kwatro-sinko       | 2D SVG + 3D             | 3D capped; refreshed               | layout binder                    | NDC helper                  | **fixed** 3D DPR/layout                        |
| par-55             | 2D SVG                  | N/A                                | OK                               | OK                          | reported OK                                    |
| pent-em-in         | 2D SVG + 3D             | 3D capped; refreshed               | layout binder                    | NDC helper                  | **fixed** 3D DPR/layout                        |
| prime-gold         | 2D DOM + 3D             | 3D capped; refreshed               | layout binder                    | NDC helper                  | **fixed** 3D DPR/layout                        |
| queens-guards      | 2D SVG + 3D             | 3D capped; refreshed               | layout binder                    | NDC helper                  | **fixed** 3D DPR/layout                        |
| ramrod             | 2D DOM                  | N/A                                | OK                               | OK                          | reported OK                                    |
| remainder-islands  | 2D SVG                  | N/A                                | OK                               | OK                          | reported OK                                    |
| stars-bars         | 2D DOM                  | N/A                                | OK                               | OK                          | reported OK                                    |
| star-track         | 2D SVG + 3D             | 3D capped; refreshed               | visualViewport host fit + binder | DOM chain (not canvas pick) | **fixed** 3D DPR/layout + VV sizing            |
| sum-dominoes       | 2D DOM                  | N/A                                | OK                               | OK                          | reported OK                                    |

## Shared helpers

| Module                               | Issue                                 | Fix                                                                      |
| ------------------------------------ | ------------------------------------- | ------------------------------------------------------------------------ |
| `src/ui/coord-map.ts`                | (new)                                 | CSS↔SVG scale, NDC, capped 2D DPR                                        |
| `src/core/polyomino/polyomino-ui.ts` | hover/mouse helpers ignored CSS scale | use `clientToSvgUser` + `svgUserToGridCell`                              |
| `src/ui/three/tablet-gl.ts`          | DPR set once; only `window.resize`    | `syncBoard3dRendererSize`, `bindBoard3dLayout`, `resolveCssViewportSize` |

## Non-goals / left alone

- AI, scoring, rules, timing, player-facing copy
- Stars & Bars history cap; Hex Hard 450ms assert
- #511 hover rebuild, #486/#457 touch targets, #490 canvas-ready signaling

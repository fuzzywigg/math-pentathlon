# Pointer / touch edge-case audit (2026-10)

Task id: `burn-1008-mp-pointer-edge-cases`

## Overlap (skipped / not redone)

| Draft | Topic | Relation |
| --- | --- | --- |
| #457 | Mobile tap targets / viewport | Layout hit boxes only |
| #486 | Touch/mobile smoke + chrome `touch-action` | Shell buttons; not board gesture SM |
| #517 | Input race / double-submit | Re-entrancy / AI timers (merged) |
| #529 | Canvas DPR / resize hit-test | Coordinate mapping, not pointer lifecycle |

## Shared fixes

- `src/ui/pointer-hygiene.ts` — tap/drag state machine (`createPointerTapController`), canvas binder, primary activate + contextmenu suppress
- `src/ui/styles/game-play.css` — board `touch-action: manipulation`, `user-select` / `-webkit-touch-callout`
- `src/ui/components/game-shell.ts` — `#board` contextmenu preventDefault
- All interactive 3D canvases — `bindCanvasPointerTap` (primary pointerId, cancel, capture)
- Remainder Islands — activate on completed primary tap (not raw pointerdown)
- Ollie — reject `isPrimary === false` / second drag start

## Per-game findings

| Game | Surface | pointercancel | multi-touch | contextmenu / select | touch-action | capture / leave | hybrid mouse+touch | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| calla | 2D SVG click | N/A (no drag) | N/A | shell `#board` | CSS board rule | click | click | OK |
| contig-60 | 2D DOM click | N/A | N/A | shell | CSS | click | click | OK |
| fab-a-diffy | 2D click | N/A | N/A | shell | CSS | click | click | OK |
| fiar | 2D + 3D | **fixed** 3D tap SM | **fixed** 3D isPrimary | shell + CSS | 2D CSS; 3D `none` | **fixed** capture | pointer tap | was pointerup-only |
| frac-fact | buttons | N/A | N/A | shell | CSS | click | click | OK |
| fraction-pinball | buttons | N/A | N/A | shell | CSS (+ prior btn) | click | click | OK |
| hex | 2D SVG click | N/A | N/A | shell | CSS | click | click | OK |
| hex-a-gone | 2D + 3D | **fixed** 3D + hover clear | **fixed** | shell | CSS / 3D none | **fixed** | pointer tap | hover gated |
| juggle | 2D click | N/A | N/A | shell | CSS | click | click | OK |
| kings-quadraphages | 2D + 3D | **fixed** 3D | **fixed** | shell | prior cells + CSS | **fixed** | pointer tap | OK |
| kwatro-sinko | 2D + 3D | **fixed** 3D | **fixed** | shell | CSS / 3D none | **fixed** | pointer tap | OK |
| par-55 | 2D click | N/A | N/A | shell | CSS | click | click | OK |
| pent-em-in | 2D + 3D | **fixed** 3D + hover clear | **fixed** | shell | CSS / 3D none | **fixed** | pointer tap | hover gated |
| prime-gold | 2D + 3D | **fixed** 3D | **fixed** | shell | CSS / 3D none | **fixed** | pointer tap | OK |
| queens-guards | 2D + 3D | **fixed** 3D | **fixed** | shell | CSS / 3D none | **fixed** | pointer tap | OK |
| ramrod | 2D click | N/A | N/A | shell | CSS | click | click | OK |
| remainder-islands | 2D SVG pointer | **fixed** cancel | **fixed** isPrimary | shell | CSS | tap slop | **fixed** claim-once | was activate-on-down |
| star-track | 2D buttons (+ 3D visual) | N/A board drag | N/A | shell | CSS | click | click | 3D display-only |
| stars-bars | 2D click | N/A | N/A | shell | CSS | click | click | OK |
| sum-dominoes | 2D click | N/A | N/A | shell | prior + CSS | click | click | OK |
| Ollie (shell) | pointer drag | existing + multi-touch guard | **fixed** isPrimary | N/A | `none` (prior) | capture (prior) | pointerId | only live piece drag |

## Interaction model note

No registered game uses piece drag-and-drop on the board. Boards are click / select-then-click. The live pointer-drag state machine is Ollie; 3D boards use a down→up tap state machine for raycast activation.

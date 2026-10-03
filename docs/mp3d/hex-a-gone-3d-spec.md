# Hex-a-Gone! 3D board (board3d flag)

Optional Three.js tilted-tabletop view of **Hex-a-Gone!** (Math Pentathlon Division I, grades K–1), gated by `board3d` (off by default).

## Flag

- `?board3d=1`, hash query `#/game/hex-a-gone?board3d=1`, or `localStorage mp-board3d=1`
- `?board3d=0` forces off
- With the flag off, `three` must never load

## View contract

- Module: `src/ui/three/hex-a-gone-board-3d.ts` (lazy via `board-3d-loader.ts`)
- Pattern-block pieces: short extruded shapes (`hex-a-gone-pieces.ts`), original solid colors
- Legal targets from `getValidPlacements` (engine), not duplicated in the view
- Ghost preview of the selected block on hover/focus
- Bank + Confirm stay as DOM controls beside the canvas
- Visually-hidden a11y grid keeps PR #353 keyboard / Space behaviour
- WebGL failure → controller keeps the 2D SVG board
- Perf: `antialias: false`, pixel ratio ≤ 1.5, render-on-demand (no RAF loop)

## Out of scope

- Rules / scoring changes
- Shared hex-mesh extraction (proposed as follow-up; game-prefixed mesh stays here)

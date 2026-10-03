# Pent'Em In 3D board (board3d flag)

Task: TMX-20261002-W2-3D-PENT-EM-IN

## Behaviour
- Behind `isBoard3dEnabled()` (`?board3d=1`, hash query, or `localStorage mp-board3d=1`).
- Lazy-loads `src/ui/three/pent-em-in-board-3d.ts` via `board-3d-loader.ts`.
- Flag off: unchanged 2D SVG; three.js never loads.
- WebGL unavailable / renderer throw / context lost: fall back to 2D SVG.

## Look
- Tilted tabletop 10×10 grid, seat colors from `getPlayerSeatColors()`.
- Pentominoes as extruded blocks with a slight top bevel; ghost preview legal (seat tint) vs illegal (red).
- Highlights: valid anchors, focused/preview cell, last move, winner pieces at game over.
- Piece bank / rotate / flip stay in the status DOM.

## Perf
- `antialias: false`, `powerPreference: 'low-power'`, pixel ratio ≤ 1.5.
- Render on demand (update / resize / hover), no continuous RAF.

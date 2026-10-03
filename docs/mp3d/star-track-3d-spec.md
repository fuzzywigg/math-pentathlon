# Star Track 3D board (board3d flag)

Task id: `TMX-20261002-W2-3D-STAR-TRACK`. Behind `isBoard3dEnabled()`; 2D SVG remains the default and WebGL fallback.

## Behaviour
- Lazy-loads `src/ui/three/star-track-board-3d.ts` via `board-3d-loader.ts`.
- Render-on-demand (`renderer.render` on update/resize/hover); no continuous RAF.
- `antialias: false`, `devicePixelRatio` capped at **1.5**, `powerPreference: 'low-power'`.
- Draw → choose-chain → move stays on DOM controls under the canvas; landing highlights come from `getChainLandingSpace()` in the engine.
- Visually-hidden `.star-track-a11y-track` mirrors spaces for keyboard focus highlighting.
- WebGL mount failure or `webglcontextlost` falls back to the playable 2D board.

## Layout
Tilted tabletop with two rails into a raised center star, seat colors from `getPlayerSeatColors()`, movers as short cylinders. Fits phone 390×844, tablet portrait 800×1280, tablet landscape 1024×768 with chain controls visible.

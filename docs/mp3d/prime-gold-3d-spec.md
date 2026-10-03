# Prime Gold — 3D tilted-tabletop board (board3d flag)

Task id: `TMX-20261002-W2-3D-PRIME-GOLD`. Behind `isBoard3dEnabled()`; 2D remains the default and WebGL fallback.

## View
- 7×7 spiral number board as raised tiles with original procedural canvas number textures
- Seat-colored chips (`getPlayerSeatColors()`)
- Valid placement highlights from `getValidPlacements()` (engine)
- Diagonal prime “veins” from `getPrimeVeinSegments()` when they form
- Last-move and keyboard-focus highlights
- Dice roll + expression list stay as DOM controls (no timers)

## Perf
- Lazy `loadThree()` only when the flag is on
- `antialias: false`, `devicePixelRatio` capped at 1.5
- Render-on-demand (no continuous `requestAnimationFrame`)

## Files
- `src/ui/three/prime-gold-board-3d.ts`
- `src/games/prime-gold/board-3d-loader.ts`
- Controller wiring in `src/games/prime-gold/game-controller.ts`

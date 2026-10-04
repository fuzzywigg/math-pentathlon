# Kwatro-Sinko 3D board (mp3d)

Optional Three.js tilted-tabletop view of **Kwatro-Sinko** (Math Pentathlon Division III), gated by `board3d` (off by default).

## Rules source

- Official MP Div III Highlights (Kwatro-Sinko), cross-checked in `docs/mp3d-step0-specs` (`spec-kwatro-sinko.md` / `.gemini.md`).
- Repo engine: `src/games/kwatro-sinko/{rules,types,board-ui,game-controller,ai}.ts`.

## Rules judgment calls (this PR)

1. **Diagonal connectivity:** Official Highlights say chips may move to any adjacent empty square (horizontally, vertically, or diagonally). The engine (`createBoard`) only adds diagonal links in the central 3×3. This 3D board draws and plays the **engine** graph so 2D/3D stay identical. Changing topology is a scoring/mechanic change and was not done here.
2. **Win equation order:** Official allows any variable order for `a + b - c = 4 or 5`. The engine already checks the relevant permutations in `checkLineForWin`.
3. **Alternative win:** Official and engine agree — all five of a player's chips on the three middle (non-numbered) rows wins.

## Grid

- 5×5 pathway nodes `n{row}-{col}` with `row,col ∈ 0..4`.
- Numbered start rows: `row=0` (Blue/even) and `row=4` (Red/odd).
- World layout: `nodeToWorld` centers the grid; row 4 is closer to the camera.

## Pieces & geometry

- **Chip:** flat beveled cylinder, seat-colored body, printed number on the top face (`CanvasTexture`).
- **Nodes:** short cylinders; numbered rows use a slightly darker pad tint.
- **Pathways:** `LineSegments` for each undirected engine connection.
- **Tabletop:** warm wood slab (procedural grain `CanvasTexture`, tint `#8b6239`) — not slate.

## Highlights (from engine)

- Selected chip (orange), legal destinations via `getValidMoves` (green), winning alignment nodes muted static gold (`0xd4b45a`).
- No pulsing / no continuous RAF animation.

## Perf

- Lazy `loadThree()` only when `isBoard3dEnabled()`.
- `antialias: false`, `pixelRatio ≤ 1.5`, `powerPreference: 'low-power'`.
- Render-on-demand (no continuous `requestAnimationFrame`).

## Interactions

- Raycast picks pad/chip → chip select or destination move (same callbacks as 2D).
- Nearest-node screen-space fallback for tablet tilt misses.
- Visually-hidden `.kwa-a11y-grid` for keyboard/screen reader.
- Hook: `window.__mp3dKwatroSinko.nodeToClientPoint(nodeId)`.

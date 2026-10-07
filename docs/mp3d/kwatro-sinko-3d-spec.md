# Kwatro-Sinko 3D board (mp3d)

Optional Three.js tilted-tabletop view of **Kwatro-Sinko** (Math Pentathlon Division II), gated by `board3d` (off by default).

## Rules source

- Official MP Div II Highlights (Kwatro-Sinko): https://www.mathpentath.org/wp-content/uploads/2026/01/Highlights-Division-2.pdf
- Repo engine: `src/games/kwatro-sinko/{rules,types,board-ui,game-controller,ai}.ts`.

## Rules judgment calls

1. **Diagonal connectivity:** Open for Andrew (#355). Div II Highlights PDF does **not** specify movement diagonals. The engine (`createBoard`) only adds diagonal links from the central 3×3 (rim↔interior diagonals are one-way from the interior). Tutorial/help copy now matches that graph. This 3D board draws and plays the **engine** graph so 2D/3D stay identical.
2. **Win condition (conjunctive):** Div II Highlights — all 5 of the player's chips must be on non-numbered spaces **and** the player must identify a straight path of exactly 3 chips (two of one color, one of the opposite) where like + like − opposite totals 4 or 5. A win cannot be declared until all 5 chips are off all numbered spaces. There is no standalone "territory" win. Locked by `#375` / `#391` and `tests/unit/kwatro-sinko-end-rules-375.test.ts`.
3. **Contiguous vs non-contiguous + yellow middle:** Official GOAL (quoted): *"The path of 3 chips does not need to be contiguous but cannot cross the middle (yellow) area of the board."* Live engine walks contiguous grid lines only (stops at empty) and has **no** yellow-center filter on the 5×5 model. Locked by `tests/unit/kwatro-sinko-rules-lock-div2.test.ts`. Needs Andrew: allow gapped paths? What maps to "yellow" on this simplified board?
4. **"Only 3 chips on the winning path":** Engine currently accepts a winning trio that is a subset of a longer contiguous occupied run. Confirm whether longer runs should invalidate the path.

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
- Shared tablet profile via `tablet-gl.ts`: `antialias: false`, `pixelRatio ≤ TABLET_PIXEL_RATIO_CAP` (1.5), `powerPreference: 'low-power'`.
- Render-on-demand (no continuous `requestAnimationFrame`); skip paints while `document.hidden`, repaint on `visibilitychange`.
- `preserveDrawingBuffer` gated by `shouldPreserveDrawingBuffer()` (Playwright / opt-in only).
- `webglcontextlost` tears down the board and dispatches `mp3d-context-lost` so the controller falls back to 2D SVG.

## Interactions

- Raycast picks pad/chip → chip select or destination move (same callbacks as 2D).
- Nearest-node screen-space fallback for tablet tilt misses.
- Opacity-0 full-size `.kwa-a11y-grid` hit layer for keyboard/screen reader and smoke:
  - `.kwa-selectable-chip` / `.kwa-valid-node` (pointer-events on interactive cells)
  - `.kwa-chip-p2` markers for AI-reply fingerprinting
- Host keeps `.kwa-board`; chrome still mounts `.kwa-history li` beside the 3D slot.
- Hook: `window.__mp3dKwatroSinko.nodeToClientPoint(nodeId)`.

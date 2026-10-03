# Kings & Quadraphages 3D board (mp3d)

Optional Three.js preview of **Kings & Quadraphages** (Math Pentathlon Division I), gated by `board3d` (off by default).

## Rules source

- Official MP Div I Highlights (Kings & Quadraphages / “K’s and Q’s”).
- Repo engine (read-only for this view): `src/games/kings-quadraphages/{rules,game-state,pieces,board-ui}.ts`.

## Grid

- 9×9, 1-based. Columns A–I (col 1–9), rows 1–9.
- Crest (throne) start squares: **E1** (Blue, row 1 col 5) and **E9** (Red, row 9 col 5).

## Pieces & geometry (cell units, 1 cell = 1.0)

- **King:** chess-king silhouette shared by both seats.
  - Body: `LatheGeometry` profile in `kings-quadraphages-pieces.ts` (`KING_LATHE_PROFILE`).
  - Cross finial: vertical `BoxGeometry(0.06×0.18×0.06)` at y=0.89; horizontal `BoxGeometry(0.15×0.05×0.06)` at y=0.92.
  - Group stands on tile top (y ≈ 0.11). Same geometry for Blue and Red; color only differs.
- **Quadraphage:** flat chip `CylinderGeometry(0.36, 0.36, 0.08, 32)` at y = 0.11 + 0.04.
- **Crest rings:** gold `RingGeometry(0.30, 0.40, 32)` on E1/E9 (view-only).

## Colors

- Seat colors from `getPlayerSeatColors()` so vs-AI purple matches 2D.
- King: seat color × 0.85; chip: seat color.

## Camera & lights

- Perspective camera ≈ `(0, 10, 11.5)`, looking at origin; full 9×9 + both kings in frame.
- Ambient + HemisphereLight + key DirectionalLight.

## Interactions

- Pointer picks tile/piece via raycast; walks parents for `{row,col}` `userData`.
- Forwards to the same controller path as 2D: `onCellClick(row, col)` → `handleCellClick`.
- DEV-only: `window.__mp3dKingsQuadraphages.cellToClientPoint(row, col)` for Playwright (not in production builds).

## Out of scope (next PR)

- Accessible DOM/keyboard grid while 3D is on; tutorial auto-fallback; WebGL failure fallback; trapped-king highlight; deduping `isKingMoveTarget`.

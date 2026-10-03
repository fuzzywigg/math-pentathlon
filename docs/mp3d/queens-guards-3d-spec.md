# Queens & Guards 3D board (mp3d)

Optional Three.js tilted-tabletop view of **Queens & Guards** (Math Pentathlon Division III, grades 4–5), gated by `board3d` (off by default).

## Rules source

- Official MP Div III Highlights (Queens & Guards / Agon-style).
- Repo engine (read-only for this view): `src/games/queens-guards/{rules,types,board-ui}.ts`.
- No rules changes in this PR.

## Grid

- Hex rings `0..5` (`CONFIG.NUM_RINGS = 6`): center throne + 5 outer rings (91 cells).
- Cell key: `` `${ring}-${position}` ``.
- World layout matches 2D SVG polar mapping (`ringPosToWorld` in `queens-guards-board-3d.ts`).

## Pieces & geometry

- **Queen:** lathe body + cross crown finial (`queens-guards-pieces.ts`), gold base disc, seat-colored.
- **Guard:** shorter lathe + sphere cap, seat-colored.
- **Hex tiles:** shared flat-top `ExtrudeGeometry` with slight bevel (game-prefixed; shared hex-mesh module is a follow-up).

## Highlights (from engine)

- Selected piece, legal targets via `getValidMoves`, last move, capture cells (`capturedPieces` / `wasCapture`), keyboard focus, winner throne + ring-1 formation.

## Perf

- Lazy `loadThree()` only when `isBoard3dEnabled()`.
- `antialias: false`, `pixelRatio ≤ 1.5`, `powerPreference: 'low-power'`.
- Render-on-demand (no continuous `requestAnimationFrame`).

## Interactions

- Raycast picks tile/piece → `handleCellClick({ ring, position })`.
- Visually-hidden `.qg-a11y-grid` for keyboard/screen reader.
- Hook: `window.__mp3dQueensGuards.cellToClientPoint(ring, position)`.

# Contig 60 — 3D board spec
Sources read: `src/core/game-registry.ts`, `src/games/contig-60/types.ts`, `src/games/contig-60/rules.ts`, `src/games/contig-60/tutorial.ts`, `src/games/contig-60/board-ui.ts`. Official Highlights PDF for Division III page numbers left for Gemini cross-check.
Official vs engine discrepancies: UNVERIFIED. The engine implements a "5 in a row" instant win and a "3 consecutive passes" elimination rule, which need to be checked against the official rules.

Grid/topology: 6×10 square grid. Each tile is marked with a unique number from the `BOARD_NUMBERS` constant in `types.ts`.

Coordinates shown to players: The number printed on the tile (e.g., "1", "12", "180"). This matches the `coord` property in the 2D `buildCellAriaLabel` function.

Players & colors: Player 1 is Blue (`#2196f3`), Player 2 is Red (`#f44336`), taken from `board-ui.ts` and provided by `getPlayerSeatColors()`.

Starting position: The board starts completely empty of any chips, as defined by `createInitialState()`.

Special squares: None.

Pieces (one row each):
| Piece | Count/player | Physical form (official kit) | 3D geometry (exact) | Size (cells) |
| :--- | :--- | :--- | :--- | :--- |
| Chip | Up to 60 (shared pool) | Flat, circular colored chip | Thin `CylinderGeometry` | 1 cell |
| Die | 3 (shared) | Standard 6-sided die | `BoxGeometry` with pips via textures, or `RoundedBoxGeometry` | N/A (not on board) |

Interactions: The game flow is Roll → Calculate → Place. The 3D board is only involved in the "Place" step.
1. Player is in the `calculating` phase after a dice roll.
2. The engine computes valid placements via `getValidPlacements()`. The 3D view should highlight these valid target cells.
3. Player clicks a valid target cell on the 3D board.
4. The click handler calls the controller, which invokes the engine's `placeChip(state, value, expression)` function with the number value of the clicked cell.

Win/end condition (verbatim from engine/tutorial, UNVERIFIED vs official):
From tutorial: "<strong>5 in a row:</strong> First to get 5 chips in a line wins! <strong>By points:</strong> When board is full, highest score wins".
From engine: A player who passes their turn three consecutive times is eliminated, and their opponent wins.

Camera & framing: A single, static `PerspectiveCamera` at a 3/4 angle, positioned to frame the entire 6×10 board. The orientation should be landscape, with the 10-cell side being wider.

Out of scope: animations, a11y (Step 4), engine rule changes, the dice rolling UI, and the expression selection list UI (these are separate DOM components outside the 3D canvas).

Open questions for Andrew:
1. The 2D UI allows players to click either a highlighted board cell or an item in an "expression list" to make a move. For 3D, can we simplify this to *only* clicking the target cell on the board?
2. The playbook ranks this game as adding a "dice UI". Should the three dice be rendered in 3D (e.g., in a corner of the canvas), or should we continue to use the 2D DOM-based dice display from `board-ui.ts`?
3. For the numbers on the board tiles, are textures preferred over extruded `TextGeometry` for performance?

Gemini cross-check: DISAGREE 2 items (math-pentathlon-div-3-highlights.pdf)

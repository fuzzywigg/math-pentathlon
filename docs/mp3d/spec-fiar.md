# FIAR — 3D board spec
Sources read: `src/core/game-registry.ts`, `src/games/fiar/types.ts`, `src/games/fiar/rules.ts`, `src/games/fiar/tutorial.ts`, `src/games/fiar/board-ui.ts`; Highlights PDF Division II (page number pending Gemini cross-check)
Official vs engine discrepancies: None identified from engine sources; verification against official PDF is pending.

Grid/topology: A 5×5 grid of 25 nodes. Nodes are connected by pathway edges to adjacent nodes horizontally, vertically, and diagonally.

Coordinates shown to players: `row,col` (e.g., `0,0` for top-left, `4,4` for bottom-right), matching the 2D aria-labels generated from `nodeId.replace('-', ',')`.

Players & colors: Player 1 is Blue, Player 2 is Red. Colors are sourced from `getPlayerSeatColors()`.

Starting position: The board starts empty. The game begins in the 'placement' phase, where each player takes turns placing their 4 chips on any empty node.

Special squares: None. All nodes are identical.

Pieces (one row each):
| Piece | Count/player | Physical form (official kit) | 3D geometry (exact) | Size (cells) |
| :--- | :--- | :--- | :--- | :--- |
| Chip | 4 | Flat, circular chip (like a checker) | Flat cylinder (`CylinderGeometry`) | 1 node |

Interactions:
The game has two phases, both using a single `onNodeClick(nodeId)` callback.
1.  **Placement Phase:** Player clicks an empty node. The controller calls `placeChip(state, nodeId)`.
2.  **Movement Phase:**
    *   Player clicks their own chip → `selectChip(state, nodeId)` is called to select it.
    *   Player clicks a valid empty destination node → `moveChip(state, fromId, toId)` is called to move the selected chip.
    *   Clicking the selected chip again deselects it via `selectChip(state, nodeId)`.

Win/end condition (verbatim from engine/tutorial and mark UNVERIFIED vs official): "Form 4 chips in a row along connected pathways. Rows can be horizontal, vertical, or diagonal. **Blocking:** An opponent chip adjacent to your 4-in-a-row prevents the win!" (UNVERIFIED vs official)

Camera & framing: A static 3/4 perspective camera (e.g., position `[4, 5, 6]`, looking at `[0, 0, 0]`, with `fov: 50`). The entire 5×5 board and all pathways must be clearly visible. Player 1's "home row" (row 4) should be closer to the camera.

Out of scope: animations, a11y (Step 4), engine rule changes.

Open questions for Andrew:
1.  Please confirm the "blocking" rule from the official Division II Highlights PDF. The engine rule (`isPathBlocked`) states that if *any* opponent chip is adjacent to *any* chip in the 4-in-a-row path, the win is nullified. Is this correct?
2.  What is the physical appearance of the official game kit? Is it a wooden board with inscribed pathways? Are the chips simple flat discs?

Gemini cross-check: UNVERIFIED vs official (no PDF)

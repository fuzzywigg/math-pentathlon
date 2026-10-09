# Kwatro-Sinko — 3D board spec
Sources read: `src/core/game-registry.ts`, `src/games/kwatro-sinko/types.ts`, `src/games/kwatro-sinko/rules.ts`, `src/games/kwatro-sinko/board-ui.ts`, `src/games/kwatro-sinko/tutorial.ts`. Official Highlights PDF page numbers left for Gemini cross-check.
Official vs engine discrepancies:
- The tutorial (`tutorial.ts`) states "Diagonal connections exist on numbered spaces". The engine (`rules.ts`, `createBoard`) implements diagonal connections only for the central 3x3 non-numbered area.
- The engine (`rules.ts`, `moveChip`) includes an alternative win condition: a player wins if all 5 of their chips are on non-numbered spaces. This is not mentioned in the tutorial.

Grid/topology: 5×5 pathway grid. Nodes are connected horizontally, vertically, and (in the central 3x3 area) diagonally.
Coordinates shown to players: `row,col` from `0-4, 0-4`. The 2D `aria-label` is `row,col`, e.g., "0,0".
Players & colors: Player 1 is Blue (uses `getPlayerSeatColors()`), starts on row 0 with even-numbered chips (0, 2, 4, 6, 8). Player 2 is Red, starts on row 4 with odd-numbered chips (1, 3, 5, 7, 9).
Starting position: Player 1's chips (0, 2, 4, 6, 8) are on nodes `n0-0` through `n0-4`. Player 2's chips (1, 3, 5, 7, 9) are on nodes `n4-0` through `n4-4`.
Special squares: The top and bottom rows (`row=0` and `row=4`) are "numbered" start rows (`isNumbered: true` in `BoardNode`). They are rendered with a different background color in 2D.

Pieces (one row each):
| Piece | Count/player | Physical form (official kit) | 3D geometry (exact) | Size (cells) |
| :--- | :--- | :--- | :--- | :--- |
| Chip | 5 | Flat, numbered, circular chips | Flat cylinder with beveled edge. Number rendered as a texture on the top face. | 1 |

Interactions:
1.  **Select chip:** Player clicks one of their own chips. This hits `onChipClick(chipId)` in the UI, which calls the controller to execute `selectChip(state, chipId)`. The game enters the `selectingDest` phase.
2.  **Select destination:** Player clicks a valid, empty, connected node (highlighted green). This hits `onNodeClick(nodeId)` in the UI, which calls the controller to execute `moveChip(state, toNodeId)`.
3.  **Deselect:** Clicking the selected chip again, or an invalid space, should call `clearSelection(state)`.

Win/end condition (verbatim from engine/tutorial and mark UNVERIFIED vs official):
- **Primary win:** "Create an alignment of three chips where **a + b - c = 4 or 5**" (from `tutorial.ts`). The three chips must be in a straight line (horizontally, vertically, or diagonally). (UNVERIFIED)
- **Alternative win:** "A player also wins if all 5 of their chips are moved off the starting/ending numbered rows onto the 15 non-numbered spaces." (from `rules.ts` logic, UNVERIFIED)

Camera & framing: 3D perspective camera, angled to show the full 5x5 board. Player 2's starting row (row 4) should be closer to the camera, and Player 1's starting row (row 0) should be further away, matching the 2D perspective.
Out of scope: animations, a11y (Step 4), engine rule changes.
Open questions for Andrew:
- The tutorial says diagonal connections are on numbered spaces, but the engine puts them in the center 3x3 grid. Which is correct for the 3D board?
- Is the alternative win condition (all chips on non-numbered spaces) an official rule? It is implemented in the engine but not mentioned in the tutorial.

Gemini cross-check: DISAGREE 2 items (mathpentath-highlights-div3-2021-22.pdf)

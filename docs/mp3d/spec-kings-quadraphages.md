# Kings & Quadraphages — 3D board spec
Sources read: `src/core/game-registry.ts`, `src/games/kings-quadraphages/board.ts`, `src/games/kings-quadraphages/game-state.ts`, `src/games/kings-quadraphages/rules.ts`, `src/games/kings-quadraphages/tutorial.ts`, `src/ui/board/kings-quadraphages/board-ui.ts`; Official Highlights PDF for Division I (page numbers left for Gemini cross-check).
Official vs engine discrepancies: This is a corrective spec for PR #352. The engine rules are correct, but the 3D implementation in #352 was not. It must be changed as follows:
- The game name must be "Kings & Quadraphages" in all user-facing text, not "Kings".
- King pieces must be lathe-profile chess kings, not cylinders.
- Quadraphage pieces must be flat chips/discs, not spheres.

Grid/topology: 9×9 square grid with a checkerboard pattern of light and dark cells.
Coordinates shown to players: A1–I9. Columns are A-I (left to right), rows are 1-9 (top to bottom from Player 1's perspective). This matches the 2D `aria-label`s.
Players & colors: Player 1 is Blue, Player 2 is Red. The `vs-AI` seat uses `getPlayerSeatColors()`.
Starting position: Player 1's King starts on E1. Player 2's King starts on E9.
Special squares: The starting squares E1 and E9 are "crest squares" and should be visually distinct from other cells of the same color (e.g., with a decal).

Pieces (one row each):
| Piece | Count/player | Physical form (official kit) | 3D geometry (exact) | Size (cells) |
| :--- | :--- | :--- | :--- | :--- |
| King | 1 | Chess-style king | `LatheGeometry` from a profile matching a standard chess king. | 1 |
| Quadraphage | 30 | Flat circular chip/disc | `CylinderGeometry` (flat disc, height << radius). | 1 |

Interactions: A turn consists of two required actions, handled by `handleCellClick` in `board-ui.ts`.
1.  **Select King**: In the `moveKing` phase, clicking the current player's King calls `selectKing(state)`.
2.  **Move King**: With a King selected, clicking a valid empty adjacent square calls `moveKing(state, destination)`. The game transitions to the `placeQuadraphage` phase.
3.  **Place Quadraphage**: In the `placeQuadraphage` phase, clicking any empty square on the board calls `placeQuadraphage(state, position)`. This ends the turn.

Win/end condition (verbatim from engine/tutorial, UNVERIFIED vs official): "Your goal is to **trap your opponent's King** so it cannot move to any adjacent cell. The player who traps the other's King wins!" This is implemented in `rules.ts:checkWinCondition` by checking if `getValidKingMoves` returns an empty list for the opponent.

Camera & framing: A single static 3/4 perspective camera. Position should be approximately `(x=0, y=10, z=10)` relative to the board center, looking down at a ~45-degree angle. FOV should be ~55 degrees. The entire 9×9 board and all pieces must be in frame at all times. Player 1's side (row 1) is at the top of the screen, furthest from the camera.

Out of scope: animations, a11y (Step 4), engine rule changes.

Open questions for Andrew:
1.  Are the starting squares E1 and E9 officially called "crest squares"? Should they have a specific decal/texture?
2.  What are the canonical hex color codes for Player 1 (Blue) and Player 2 (Red) materials?
3.  Is the list of discrepancies for PR #352 sufficient, or is more detail needed on the required geometry?

Gemini cross-check: UNVERIFIED vs official (no PDF)

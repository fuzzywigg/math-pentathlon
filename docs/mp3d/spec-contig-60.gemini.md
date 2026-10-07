| item | spec says | official says (pdf p.) | verdict |
| :--- | :--- | :--- | :--- |
| Grid/topology | 6×10 square grid. Each tile is marked with a unique number. | The CONTIG® Gameboard has 60 squares that are numbered with a unique value. (p. 3) | AGREE |
| Starting position | The board starts completely empty of any chips. | To Start: Place the gameboard between the two players. (p. 3) | AGREE |
| Piece count (Chips) | Up to 60 (shared pool). | Each player selects a different color of chips. (p. 3) | AGREE |
| Piece count (Dice) | 3 (shared). | 3 dice. (p. 3) | AGREE |
| Win condition (5 in a row) | "First to get 5 chips in a line wins!" | "The first player to get 5 of their chips in a row (orthogonally or diagonally) is the winner." (p. 3) | AGREE |
| Win condition (board full) | "When board is full, highest score wins". | "If the board is filled and no one has 5 in a row, the player with the greater number of chips that make up a 'Contig' of 4 in a row is the winner. If still a tie, the player with the greater number of chips that make up a 'Contig' of 3 in a row is the winner. If still a tie, the game is a draw." (p. 3) | DISAGREE |
| Win condition (3 passes) | A player who passes their turn three consecutive times is eliminated, and their opponent wins. | The rules state a player loses their turn if unable to make a move, but do not mention a 3-pass elimination rule. (p. 3) | NOT-IN-PDF |

### Open questions
*   The spec's end-game condition ("highest score wins") disagrees with the official rules, which specify a tie-breaking procedure based on counting the number of 4-in-a-rows, then 3-in-a-rows. Should the engine be updated to match the official tie-breaking logic?
*   The engine implements a "3 consecutive passes leads to elimination" rule which is not found in the official Highlights PDF. Should this rule be removed?

Gemini cross-check: DISAGREE 2 items (math-pentathlon-div-3-highlights.pdf)
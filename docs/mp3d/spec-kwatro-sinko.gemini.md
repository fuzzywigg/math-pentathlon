| item | spec says | official says (pdf p.) | verdict |
| :--- | :--- | :--- | :--- |
| Game Name | Kwatro-Sinko | Kwatro-Sinko | AGREE |
| Grid/topology | 5×5 pathway grid. Nodes are connected horizontally, vertically, and (in the central 3x3 area) diagonally. | The gameboard is a 5 x 5 grid of squares. Chips may be moved one square at a time to any adjacent empty square (horizontally, vertically, or diagonally). (mathpentath-highlights-div3-2021-22.pdf p. 11) | DISAGREE |
| Players & colors | Player 1 is Blue... Player 2 is Red... | Each player selects 5 chips of one color. (mathpentath-highlights-div3-2021-22.pdf p. 11) | NOT-IN-PDF |
| Chip assignment | Player 1... even-numbered chips (0, 2, 4, 6, 8). Player 2... odd-numbered chips (1, 3, 5, 7, 9). | One player takes the even-numbered chips (0, 2, 4, 6, 8) and the other player takes the odd-numbered chips (1, 3, 5, 7, 9). (mathpentath-highlights-div3-2021-22.pdf p. 11) | AGREE |
| Starting position | P1 chips (0,2,4,6,8) on row 0. P2 chips (1,3,5,7,9) on row 4. | The player with the even-numbered chips places them on the squares in the top row. The player with the odd-numbered chips places them on the squares in the bottom row. (mathpentath-highlights-div3-2021-22.pdf p. 11) | AGREE |
| Special squares | The top and bottom rows (`row=0` and `row=4`) are "numbered" start rows. | The diagram shows the top and bottom rows are shaded differently and are the starting rows. (mathpentath-highlights-div3-2021-22.pdf p. 11) | AGREE |
| Pieces | 5 flat, numbered, circular chips per player. | Each player selects 5 chips of one color... even-numbered chips (0, 2, 4, 6, 8)... odd-numbered chips (1, 3, 5, 7, 9). (mathpentath-highlights-div3-2021-22.pdf p. 11) | AGREE |
| Primary win condition | "Create an alignment of three chips where **a + b - c = 4 or 5**". The three chips must be in a straight line. | Let a, b, and c be the numbers on any 3 chips in a row. If a + b - c = 4 or 5, a Kwatro-Sinko has been made. The chips may be used in any order for the variables in the equation. (mathpentath-highlights-div3-2021-22.pdf p. 11) | DISAGREE |
| Alternative win condition | "A player also wins if all 5 of their chips are moved off the starting/ending numbered rows onto the 15 non-numbered spaces." | A player also wins if all 5 of their chips are on the 3 middle rows. (mathpentath-highlights-div3-2021-22.pdf p. 11) | AGREE |

### Open questions
1.  **Grid/topology:** The spec (and engine) limits diagonal moves to the central 3x3 area. The official rules (p. 11) state chips can move to *any* adjacent empty square (horizontally, vertically, or diagonally), implying diagonal moves are allowed everywhere on the board. Which is correct?
2.  **Primary win condition:** The spec's win condition is `a + b - c = 4 or 5`. The official rules (p. 11) state "The chips may be used in any order for the variables in the equation." This implies for three chips X, Y, Z in a line, the engine must check if `X+Y-Z`, `X+Z-Y`, or `Y+Z-X` equals 4 or 5. Should the engine be updated to check all permutations?

Gemini cross-check: DISAGREE 2 items (mathpentath-highlights-div3-2021-22.pdf)
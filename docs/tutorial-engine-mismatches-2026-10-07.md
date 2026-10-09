# Tutorial / help vs engine mismatches

Date: 2026-10-07  
Scope: `src/games/*/tutorial.ts`, related help/status strings in `board-ui.ts` / `game-controller.ts`, and How-to copy in `src/main.ts` where it repeats the same claims.  
Compared against win / target / pass / end / scoring logic in each game’s `rules.ts` (and `game-state.ts` / `types.ts` where that is the source of truth).

**Policy for this pass:** mismatches are documented only. Tutorial wording was edited for typos, grammar, and K–5 clarity without changing any described rule. Engine rules, scoring, and end conditions were not changed.

---

## Summary

| Game | Mismatches? |
|------|-------------|
| calla | Yes |
| contig-60 | None |
| fab-a-diffy | Yes |
| fiar | Yes (omitted end) |
| frac-fact | Yes |
| fraction-pinball | Yes |
| hex | None |
| hex-a-gone | Yes |
| juggle | Yes |
| kings-quadraphages | Yes |
| kwatro-sinko | Yes |
| par-55 | Yes |
| pent-em-in | None |
| prime-gold | Yes |
| queens-guards | Yes (omitted end) |
| ramrod | Yes (omitted end) |
| remainder-islands | None |
| stars-bars | Yes |
| star-track | Yes |
| sum-dominoes | Yes (narrow) |

---

## calla

### 1. End condition

- **Tutorial** (`src/games/calla/tutorial.ts` ~goal step): “The game ends when all cubes are collected.”
- **Engine** (`src/games/calla/rules.ts` ~160–185): Game ends when **either side’s pits are all empty**; remaining cubes on the other side go into that side’s Calla; then highest Calla wins (or tie).
- **Help note:** How-to in `src/main.ts` matches the engine (one side empty), not the tutorial line above.

### 2. Board colors / Calla placement

- **Tutorial** (`tutorial.ts` ~board-intro): Blue pits on top; Red pits on bottom; each Calla “on their right side.”
- **Engine/UI** (`src/games/calla/board-ui.ts` ~59–116): Red (player2) pits on **top**, Blue (player1) pits on **bottom**; player2 Calla on the **left**, player1 Calla on the **right**.

### 3. Capture contents

- **Tutorial** (`tutorial.ts` ~capture): Captures “ALL those cubes” referring to the opposite pit only.
- **Engine** (`rules.ts` ~125–134): Captures opposite-pit cubes **plus** the landing cube (`captured = opponentPits[oppositeIndex] + 1`).
- **Help note:** How-to in `src/main.ts` matches the engine.

---

## contig-60

**None.** Tutorial win (5-in-a-row, else most 4s then 3s / draw), pass (mutual pass ends with alignment settle), expression (all three dice, two ops, whole-number division), and placement scoring match `src/games/contig-60/rules.ts` and `types.ts`.

---

## fab-a-diffy

### 1. “Your pool” vs shared pool

- **Tutorial** (`src/games/fab-a-diffy/tutorial.ts` ~turn-sequence): “Choose two fraction bars from your pool.”
- **Engine** (`src/games/fab-a-diffy/rules.ts` setup; `board-ui.ts` pool label): One **shared** pool of unused bars (`owner: null`).

### 2. End condition understated

- **Tutorial** (`tutorial.ts` ~winning): Wins “when all bars are used.”
- **Engine** (`rules.ts` ~373–391, pass path ~331–347): Can also end when all **answer** bars are claimed, when ≤1 fraction bar remains unused, or when both seats have no valid move after a pass.

### 3. Tied claim count when all answers claimed

- **Tutorial:** Implies “most answer bars” wins.
- **Engine** (`rules.ts` ~375–376): If every answer is claimed and scores are equal, returns `'player2'` (no draw).

---

## fiar

### 1. Draw / stuck end omitted

- **Tutorial** (`src/games/fiar/tutorial.ts` ~winning): Only describes 4-in-a-row wins.
- **Engine** (`src/games/fiar/rules.ts` ~410–413; `game-controller.ts` ~173–177): In movement phase, if the current player has no legal moves, the game ends in a **draw**.

(Other placement / marked-chip / path / win-with-either-color claims match the engine.)

---

## frac-fact

### 1. Problem count

- **Tutorial** (`src/games/frac-fact/tutorial.ts` ~winning): “After **10 problems each**…”
- **How-to** (`src/main.ts` Frac Fact help): Same “10 problems each” wording.
- **Engine** (`src/games/frac-fact/types.ts` `DEFAULT_MAX_PROBLEMS = 10`; `rules.ts` ~309–331): Ends after **10 problems total** (alternating seats → about 5 each). UI shows “Problem N of maxProblems” (`board-ui.ts`).

### 2. Streak bonus shape

- **Tutorial** (`tutorial.ts` ~scoring): “+5 points per consecutive correct answer” (reads as a flat +5 each streak hit).
- **Engine** (`rules.ts` ~274–278): Score adds `POINTS_PER_CORRECT + currentStreak * STREAK_BONUS` using the streak count **before** this answer (1st correct +10; 2nd +15; 3rd +20; …).

---

## fraction-pinball

### 1. End condition

- **Tutorial** (`src/games/fraction-pinball/tutorial.ts` ~winning): “after all rounds.”
- **Engine** (`src/games/fraction-pinball/rules.ts` ~336–338): Also ends early when **both** players have `ballsRemaining <= 0` (`INITIAL_BALLS` / `MAX_ROUNDS` in `types.ts`).

### 2. Draws

- **Tutorial:** Implies a sole winner via most points.
- **Engine** (`rules.ts` ~341–343; `board-ui.ts` ~301–305): Equal scores → `winner = null` / “It's a Draw!”

---

## hex

**None.** Connect opposite sides, Blue top–bottom / Red left–right, Blue first, place-only, no draws — matches `src/games/hex/rules.ts` and UI legend.

---

## hex-a-gone

### 1. Confirm required before place

- **Tutorial** (`src/games/hex-a-gone/tutorial.ts` ~place-shapes): “After selecting, click on the board to place each shape.”
- **Engine/UI** (`game-controller.ts` ~175–186; `board-ui.ts` ~257–261; `rules.ts` ~56–68): Board placement is only allowed after **Confirm** moves the phase to `placeBlocks`.

### 2. Multi-cell “fit” vs one-cell shapes

- **Tutorial** (`tutorial.ts` ~place-shapes / strategy): “Shapes must fit in empty spaces!” / “Big shapes are hard to fit later!”
- **Engine** (`src/games/hex-a-gone/types.ts` `getShapeCells` ~194–199; `rules.ts` place / `canPlayerMove`): Every shape footprint is **exactly one hex cell**; size does not affect fitting.

---

## juggle

### 1. Rotate / flip not universal

- **Tutorial** (`src/games/juggle/tutorial.ts` ~placement-rules): “Shapes can be rotated and flipped.”
- **Engine** (`src/games/juggle/rules.ts` ~121–144; shape flags in `core/polyomino/types.ts`): Rotate only if `canRotate`; flip only if `canFlip` (UI hides unavailable controls).

(Win = first full 9×9 board; die→category map matches.)

---

## kings-quadraphages

### 1. Must place every turn

- **Tutorial** (`src/games/kings-quadraphages/tutorial.ts` ~turn-structure): “You must complete both actions every turn!”
- **Help** (`src/main.ts` How-to): Same “both actions each turn” claim.
- **Engine** (`src/games/kings-quadraphages/game-state.ts` ~208–212): If Quadraphage supply is 0 after the King move, **placement is skipped** and the turn ends.

### 2. Tie / exhaustion end omitted

- **Tutorial** (~winning): Only trap-the-King win.
- **Engine** (`rules.ts` ~174–188; `game-state.ts` ~292–310; UI “Tie!”): Game can also end in a **tie** when supplies are exhausted / no chips remain in some settle paths.

---

## kwatro-sinko

### 1. Diagonal connections location

- **Tutorial** (`src/games/kwatro-sinko/tutorial.ts` ~movement-rules): “Diagonal connections exist on numbered spaces.”
- **Engine** (`src/games/kwatro-sinko/rules.ts` ~36, ~66–73): Numbered = top/bottom start rows (`row === 0 || row === SIZE - 1`). Diagonals are only for the **center 3×3** (non-numbered interior cells).

### 2. Welcome / objective understates full win

- **Tutorial** welcome/objective (`tutorial.ts` ~15, ~23) and help chrome (`game-controller.ts` ~243–244): Win described only as `a + b - c = 4 or 5`.
- **Engine** (`rules.ts` ~208–221, ~275–285, ~416–447): Also requires **all 5** of the current player’s chips off numbered rows and a 2+1 color mix in the three-chip line.
- **Note:** The Winning tutorial step (~69–73) matches the engine; welcome/objective/help strip do not.

---

## par-55

### 1. Tie rule

- **Tutorial** (`src/games/par-55/tutorial.ts` ~winning): “In case of a tie, the player who reaches 55 first wins.”
- **Engine** (`src/games/par-55/rules.ts` ~303–353): Hitting ≥55 on your turn can win immediately; equal scores at/above 55 can continue or leave `winner = null`; empty-hand equal scores are a tie. There is **no** stored “who hit 55 first” tiebreak.

### 2. Hands-empty end omitted

- **Tutorial:** Only “first to 55.”
- **Engine** (`rules.ts` ~338–353): If both hands are empty without a 55 winner, higher score wins or draw.

### 3. Hand size implication

- **Tutorial** (~turn-sequence): “Choose a block from your hand (5 blocks)” every turn.
- **Engine** (`rules.ts` ~104–105, ~274–283): Deals 5 once; hand shrinks with no refill (comment about drawing is not implemented).

---

## pent-em-in

**None.** 10×10, 12 pieces each, rotate/flip/place, win when opponent cannot place — matches `src/games/pent-em-in/rules.ts` / `types.ts`.

---

## prime-gold

### 1. Alternate end / tie omitted

- **Tutorial** (`src/games/prime-gold/tutorial.ts`): “First to 4 veins wins!” only.
- **Engine** (`rules.ts` ~231–248; `game-controller.ts` ~218–220): If both players exhaust chips without 4 veins, higher vein count wins or **tie**.

### 2. Factorial tip vs board range

- **Tutorial** (~strategy): “Factorials give big numbers: 5!=120” (spacing may vary).
- **Engine** (`types.ts` ~96–101): Expression results must be integers in **1..49**; 120 can never be placed.

---

## queens-guards

### 1. Stalemate win omitted

- **Tutorial** (`src/games/queens-guards/tutorial.ts` ~winning): Only throne + 6 Guards formation.
- **Engine** (`game-controller.ts` ~129–138, ~176): If the current player has no legal moves (and is not mid-restore), the **opponent wins**.

(Formation win and inward/sideways movement otherwise match `rules.ts`.)

---

## ramrod

### 1. Exclusive “first to 24 cm” vs rod exhaustion

- **Tutorial** (`src/games/ramrod/tutorial.ts` ~welcome / winning): Only first to 24 cm wins.
- **Engine** (`rules.ts` ~277–300): Also ends when both players have no rods left; higher cm wins or **tie** (`game-controller.ts` tie banner).

---

## remainder-islands

**None.** Remainder scoring, ownership blocking, and end after turns (with chip-empty settle) match `src/games/remainder-islands/rules.ts` / `types.ts`.

---

## stars-bars

### 1. First placement adjacency

- **Tutorial** (`src/games/stars-bars/tutorial.ts` ~turn-sequence): “Must place adjacent to existing cards.”
- **Engine** (`rules.ts` ~187–197): On an **empty** board, every cell is valid; adjacency is required only afterward.

### 2. Hands-empty end / tie omitted

- **Tutorial:** Only “Score 30 points.”
- **Engine** (`rules.ts` ~367–381; `game-controller.ts` tie handling): Also ends when both hands are empty; higher score wins or tie.

---

## star-track

### 1. Bucket-exhaustion end omitted

- **Tutorial** (`src/games/star-track/tutorial.ts` ~goal): Only “reach the star in the center first.”
- **Engine** (`rules.ts` ~22–28, ~12–15): If the bucket has fewer than 2 chains on draw, game over; farther player wins (or draw) **without** reaching the star.

### 2. Winner banner vs engine

- **Help UI** (`board-ui.ts` ~279–285): On any `gameOver`, banner says “`Blue|Red` reaches the star!” even for bucket exhaustion or when `winner` is null (draw path still picks a name via ternary).

---

## sum-dominoes

### 1. Mutual-pass always names a winner

- **Tutorial** (`src/games/sum-dominoes/tutorial.ts` ~passing): “Player with fewer total pips on remaining dominoes wins.”
- **Engine** (`rules.ts` ~435–447): If pip totals are equal, `winner = null` (draw).

(Empty-hand win, 7-tile setup, dice-sum matching, consecutive-pass end otherwise match.)

---

## Games with no rule mismatches

- **contig-60** — win / pass / expression / scoring text align with engine.
- **hex** — path win, colors, place-only, no draws align.
- **pent-em-in** — trap / placement rules align.
- **remainder-islands** — remainder scoring and turn-based end align.

---

## Out of scope for this PR

- Changing tutorial or How-to **rule claims** to match the engine (listed above only).
- Changing engine win / scoring / pass / end logic.
- New automated tests asserting tutorial–engine parity (recommended follow-up).

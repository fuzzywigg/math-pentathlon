# Engine edge cases — 2026-10-07

Tests-only audit of boundary situations that random play rarely hits.
Suite: `tests/unit/engine-edge-cases-2026-10-07.test.ts`.
Base: `cursor/integration-fold-wave4-tip-36e4` (#476).

**Rules/scoring were not changed.** Suspected mismatches below are questions for a human — do not treat this doc as approval to alter mechanics.

## Illegal-move rejection convention

Across all 20 engines, illegal moves are rejected by **identity return** (mutator returns the same state object) and/or validators returning `false`. There are **no thrown `Error` messages** with user-facing text from rules mutators (FIAR’s `forceChip` throw is a test forge helper only).

**Q0 (product/UX):** Should rules expose structured rejection reasons (e.g. `{ ok: false, reason: 'occupied' }`) for UI/a11y messaging, or is identity + validator-false enough?

---

## Human questions (possible rules bugs)

### Kings Quadraphages

**Q1 — Simultaneous trap vs draw:** If both kings have zero legal moves, `checkWinCondition` returns `player1` (p2 checked first for “is trapped”). `endTurn` consults `checkWinCondition` **before** `isDrawCondition`, so a mutual trap awards **player1** even though `isDrawCondition` would return `true`. Is mutual trap meant to be a draw?

### Fab-a-Diffy

**Q2 — Equal claims:** When all answers are claimed and claim counts are equal, `checkWinner` uses `player1Claims > player2Claims ? 'player1' : 'player2'`, so **player2 wins ties**. The bars-used path allows `null` (tie). Should equal answer claims be a draw?

**Q3 — Pass settle wording:** `passTurn` comment says “both players pass,” but the implementation ends after **one** pass when the opponent then has no valid pairs. Intentional?

### Hex-a-Gone

**Q4 — Coarse `canPlayerMove`:** Returns true if the bank is non-empty and any empty cell exists — it does **not** check whether remaining shapes actually fit. A player can be stuck with unplaceable shapes while `canPlayerMove` stays true, so the last-move-wins pass path may never fire. Should fit-checking be part of “can move”?

### Remainder Islands

**Q5 — Skip-roll at last turn:** `performRoll` with zero valid islands decrements `turnsRemaining` and flips the seat but **does not** set `phase: 'gameOver'` when `turnsRemaining` hits 0. Only `selectIsland` settles. Can the game soft-lock in `rolling` with `turnsRemaining === 0`?

### Queens & Guards

**Q6 — Winner without phase:** Setting `winner` does not introduce a `gameOver` phase (state has no phase field). Callers must gate on `winner`. Should post-win `makeMove` be identity-rejected inside rules?

### Hex

**Q7 — Full board without connection:** A filled board with no connecting path leaves `winner: null` and empty `getValidMoves`, with no draw/gameOver phase. Should full-board non-connection be an explicit draw?

### FIAR

**Q8 — Observational draw:** `isDraw` reports movement stalemate but does **not** set `phase: 'gameOver'`. Controllers must apply it. Should rules auto-end on no-selectable movement?

### Contig 60

**Q9 — Simultaneous 5-in-a-row:** `checkWinner` checks player1’s five before player2’s. If both somehow have a 5, player1 wins. Is that the intended tie-break, or should that be impossible / a draw?

**Q10 — Roll into empty placements:** `doRollDice` always enters `calculating` even when `hasValidMoves` will be false (pass is the recovery). Confirm intentional.

### Par 55 / Ramrod / Stars & Bars / Kwatro Sinko

**Q11 — Ungated pass:** Several `passTurn` helpers flip the seat without requiring “no legal moves” (Stars, Kwatro, Par, Ramrod, Fab). Stars/`gameOver` is blocked; Kwatro never auto-settles stuck seats. Are voluntary passes allowed under official rules, or should pass be legal only when `hasValidMoves` is false?

### Par 55

**Q12 — TARGET_SCORE reply:** Comments in rules note a simplified “no reply turn” when player1 hits the target. Confirm vs official scoring.

### Kings Quadraphages (extra)

**Q13 — Dual initializers:** Both `board.ts` and `game-state.ts` export `createInitialGameState`. Live play uses game-state. Should board’s copy be removed or re-exported from one source?

### Pent'Em In

**Q14 — Last-move-wins when current also stuck:** After a place that leaves the opponent with no moves, current wins even if current would also be unable to place next. Confirm vs official “last player who placed” wording.

### Juggle

**Q15 — Simultaneous fill:** `checkWinner` checks player1’s board before player2’s. In a single `placeShape` only the mover’s board changes, so simultaneous fill is unlikely — but if forged, p1 wins. Confirm OK.

---

## Coverage matrix (this suite)

| Engine | Board-full / no-move | Simultaneous / tie | Last-move-wins | Pass | Illegal identity |
| --- | :---: | :---: | :---: | :---: | :---: |
| calla | settle empty pits | calla count tie | side-empty settle | n/a (settle) | empty/wrong/OOB |
| contig-60 | full → tiebreak | dual 5 → p1 | 5-in-row | both-pass settle | wrong phase place |
| fab-a-diffy | no pairs → pass end | equal claims | — | pass clears | wrong answer |
| fiar | isDraw observational | — | path win (existing) | n/a | place/move |
| frac-fact | max problems | score tie null | last problem | n/a | wrong phase |
| fraction-pinball | balls 0 | score tie null | — | n/a | wrong phase |
| hex | full no path | — | path complete | n/a | occupied/post-win |
| hex-a-gone | coarse canMove | — | pass → last placer | gated pass | wrong phase place |
| juggle | cramped canMove | checkWinner order | fill board | abandon | wrong phase |
| kings-quadraphages | supply 0 draw | mutual trap | trap win | n/a | phase/coords |
| kwatro-sinko | hasValidMoves | — | alignment (existing) | ungated | bad dest |
| par-55 | hasValidMoves | — | TARGET_SCORE | ungated | bad base |
| pent-em-in | opponent no move | — | trap opponent | n/a | OOB place |
| prime-gold | empty valids | vein/chip settle | veins win | pass clears | owned value |
| queens-guards | hasValidMoves | — | formation | n/a | bad dest |
| ramrod | hasValidMoves | — | TARGET_SCORE | ungated | bad slot |
| remainder-islands | skip roll | score tie | last turn select | auto-skip | bad island |
| stars-bars | hasValidMoves | — | TARGET_SCORE | ungated | occupied/adj |
| star-track | bucket &lt; 2 | position settle | TRACK_LENGTH | n/a | wrong phase |
| sum-dominoes | empty hand / pass | equal pips null | empty hand | double-pass | wrong phase |

## How to run

```bash
npx vitest run tests/unit/engine-edge-cases-2026-10-07.test.ts
npm run lint
npx tsc --noEmit
npm run test:unit
```

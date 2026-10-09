# Engine branch coverage — next 5 modules (2026-10-07)

Hand-built-state unit tests for the five lowest-branch engine/rules modules
**excluding** kwatro-sinko, kings-quadraphages, and fiar (covered in #456).
No engine code, rules, or scoring changes.

## Method

- Baseline and after: `vitest run --coverage` with `coverage.include` limited to
  the modules below.
- Selection: lowest branch % among `src/games/*/rules.ts`, `game-state.ts`,
  `board.ts`, and `types.ts`, excluding the three games from #456.
- New suites (tests only):
  - `tests/unit/engine-coverage-ramrod-targeted.test.ts`
  - `tests/unit/engine-coverage-queens-guards-targeted.test.ts`
  - `tests/unit/engine-coverage-par-55-targeted.test.ts`
  - `tests/unit/engine-coverage-calla-targeted.test.ts`
  - `tests/unit/engine-coverage-fraction-pinball-targeted.test.ts`

## Before / after (branch %)

| Module | Before branches | After branches | Δ covered arms |
| --- | --- | --- | --- |
| `src/games/ramrod/rules.ts` | 74/83 (**89.15%**) | 81/83 (**97.59%**) | +7 |
| `src/games/queens-guards/types.ts` | 36/40 (**90.00%**) | 36/40 (**90.00%**) | 0 (remaining unreachable) |
| `src/games/par-55/rules.ts` | 74/82 (**90.24%**) | 77/82 (**93.90%**) | +3 |
| `src/games/calla/rules.ts` | 85/92 (**92.39%**) | 91/92 (**98.91%**) | +6 |
| `src/games/fraction-pinball/rules.ts` | 50/53 (**94.33%**) | 50/53 (**94.33%**) | 0 (RNG private fill) |
| **Combined (these files)** | **319/350 (91.14%)** | **335/350 (95.71%)** | **+16** |

## Branches newly covered (by theme)

### Ramrod

- Edge/corner box rejection when rod length exceeds `targetSum`.
- Illegal select/place: wrong phase, missing rod, occupied slot, completed box, bad pair sum.
- `player2` win when a completing place crosses `TARGET_SCORE` (no seat handoff).
- Both hands empty settle: p1 win / p2 win / draw by score compare.
- Legal non-winning place → seat handoff; `clearSelection` / `passTurn`.

### Queens & Guards (`types.ts`)

- Center fan-out; ring-1 ↔ center; outermost ring has no outer neighbors.
- Mid-ring inner/outer adjacency samples; `normalizePosition` wrap; board seat check.
- Outward move rejected by `isMoveValid` (illegal for normal play).

### Par 55

- Missing / occupied / non-adjacent / wrong-phase rejection.
- `player2` solo target win; equal-at-target continue; p2-ahead win; else-cascade when
  only opponent is already at target.
- Both hands empty settle by score (including draw).
- Last block while opponent still holds cards (no empty-hands settle); normal handoff.

### Calla

- Illegal select: wrong phase/seat, OOB, empty pit.
- Free-turn keeps seat; normal sow hands off.
- `settleNoValidMoves` early returns (already over / valids remain).
- Settle from empty P2 seat (P1 wins), empty P1 seat (P2 wins), both-empty tie.
- `makeMove` side-empty → gameOver.

### Fraction Pinball

- `submitAnswer` rejects missing challenge / wrong phase.
- Wrong answer decrements balls; correct → `showResult`.
- `nextChallenge` seat handoff; maxRounds / dual-balls-exhausted settle (p1 / p2 / draw).

## Unreachable branches (documented, not forced)

These arms remain uncovered under the current public API without changing engine code.
They are defensive, geometrically impossible, or private-RNG-only.

### `ramrod/rules.ts`

| Line | Arm | Why unreachable |
| --- | --- | --- |
| 200 | `if (!rod \|\| !box) return state` true | `isValidPlacement` already requires both to exist; same `state` is used. |
| 221 | `sum === box.targetSum` false | Second-slot placement is rejected unless the pair sums to `targetSum`, so a completed box never has a mismatched sum. |

### `queens-guards/types.ts`

| Line | Arm | Why unreachable |
| --- | --- | --- |
| 123 | `if (!adjacent.some(...))` false | For all ring≥2 cells, `nextInnerPos` is never already present in `adjacent` before the check (probed exhaustively). |
| 131 | ratio geometry `if` false | When the `some` guard passes, the ratio condition is always true for every `(ring, position)` on the board. |
| 135 | `else if (ring === 1)` false | In the `ring !== 0` branch, if `ring > 1` is false then `ring === 1` is always true. |
| 150 | `outerPos2 !== outerPos1` false | `Math.floor` / `Math.ceil` pairing never yields equal outer indices for any in-range cell. |

### `par-55/rules.ts`

| Line | Arm | Why unreachable |
| --- | --- | --- |
| 114 | `centerBase && startingBlock` false | Board always contains the center id; block set always supplies a seed block under `CONFIG`. |
| 265 | `if (!base) return state` true | `isValidPlacement` already proved the base exists. |
| 326 | inner `else if (p2 >= TARGET)` false | Nested under `currentPlayer === 'player2' && newScores.player2 >= TARGET`, so the inner check is always true. |
| 328 | equal-scores → `winner = null` | If scores are equal and p2 ≥ TARGET then p1 ≥ TARGET too, so the prior tie-continue arm runs instead. |
| 333 | equal-scores → `winner = null` in final else | Equal scores with either ≥ TARGET are handled by the p1-win or p2-tie branches above; the else only runs when scores differ. |

### `calla/rules.ts`

| Line | Arm | Why unreachable |
| --- | --- | --- |
| 97 | `position < PITS_PER_SIDE * 2 + 1` false | After sowing at position 10, `position++` yields 11 then the wrap `if (position > PITS_PER_SIDE * 2)` resets to 0 before the next iteration, so position ≥ 11 never enters the `if`/`else if` chain. |

### `fraction-pinball/rules.ts`

| Line | Arm | Why unreachable |
| --- | --- | --- |
| 100–103 | wrong-decimal fill `while` / `seen` arms | Private `generateWrongDecimals` strategies always supply 3 unique wrongs within 30 attempts for convertible fractions; the random fill loop never runs via the public API. Forcing it needs brittle `Math.random` sequences and risks an infinite loop if the fill RNG is constant. |
| 136 | `correct.numerator \|\| 1` false (`\|\| 1`) | `generateWrongFractions` is only fed `COMMON_FRACTIONS` with positive numerators; the `\|\| 1` zero-numerator guard never fires. |

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run test:unit
npm run test:unit:coverage -- \
  --coverage.include='src/games/ramrod/rules.ts' \
  --coverage.include='src/games/queens-guards/types.ts' \
  --coverage.include='src/games/par-55/rules.ts' \
  --coverage.include='src/games/calla/rules.ts' \
  --coverage.include='src/games/fraction-pinball/rules.ts'
```

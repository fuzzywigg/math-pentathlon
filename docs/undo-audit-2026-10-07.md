# Undo / redo / move-log consistency audit — 2026-10-07

Base branch: `cursor/overnight-polish-integration-0494`.

## Scope

For every game (or demo) that offers **undo** or a **move log** (`moveHistory` / placements log):

1. Random legal play followed by N undos returns exactly to the earlier state.
2. Redo replays identically.
3. Move-log entries match the moves applied.

Product undo/redo APIs are almost absent; where games only expose a move log, tests implement undo/redo as **deterministic reapply of the recorded action prefix/suffix** (history-complete replay). That is the strongest property the current APIs support without inventing player-facing undo UI.

## Inventory

| Surface | Undo API | Redo API | Move log | Property tests |
|---------|----------|----------|----------|----------------|
| Polyomino board + demo (`removeLastPolyomino`) | Yes | No (re-place in tests) | `board.placements` | `undo-audit-polyomino-props.test.ts` |
| hex, calla, kings, fiar | No | No | `moveHistory` | `undo-audit-core-games-props.test.ts` |
| queens-guards | No | No | `moveHistory` (moves only) | core file (restores handled) |
| prime-gold, stars-bars, par-55, ramrod, kwatro-sinko, fab-a-diffy, sum-dominoes, contig-60, star-track, hex-a-gone, juggle, remainder-islands, pent-em-in | No | No | `moveHistory` | `undo-audit-log-games-props.test.ts` |
| frac-fact | No | No | `problemHistory` (quiz, not move log) | Out of scope |
| fraction-pinball | No | No | None | Out of scope |

Shared harness: `tests/unit/undo-audit-helpers.ts`.

## Clear bug fixed

### Juggle `chosenDie` always logged die index 0

`placeShape` recorded `chosenDie: state.currentDice[0]` regardless of which die the player selected via `selectDie`. That made the move log disagree with the applied choice whenever die 1 was used (including when faces 5 vs 6 both map to pentomino).

**Fix:** store `selectedDieValue` on `JuggleState` in `selectDie`, and log that value from `placeShape`. No scoring or placement-rule change.

## Ambiguous / deferred (no product change)

1. **No game offers player-facing undo/redo.** Only the polyomino demo has an Undo button. Adding game undo would be a feature, not a clear log bug.
2. **Queens & Guards `restoreCapturedPiece` is not appended to `moveHistory`.** Forced restores after captures change the board but are absent from the log. Logging them would change move counts in the status chrome (`moveHistory.length / 2`). Documented; property tests assert restores leave history unchanged and still round-trip via an applied-action stack.
3. **Passes / skips often omit history:** contig-60 `passTurn`, par-55/ramrod/fab `passTurn`, sum-dominoes passes, remainder-islands empty-roll skips, hex-a-gone `passTurn`. Undo-via-history alone cannot reconstruct those seats without side channels. Tests reapply logged places plus an explicit pass action list where needed. Sum Dominoes double-pass gameOver also retains `currentDice` from the failed roll (not cleared on terminal pass) — left as-is.
4. **Hex-a-gone logs once per completed turn**, and `blocksPlaced` is taken from `turnSelection.blocks` at the *final* `placeBlock` call. Because each placement filters the selection down, multi-block turns currently log only the last remaining shape(s), not the original committed selection. Wave 42/47 unit tests encode this as the contract; changing it would be a log-semantics change — left untouched. Mid-turn board state is not history-addressable.
5. **Ramrod UI “Move History” is capture-only** (`renderMoveHistory` filters `capturedBox`). State still records every placement; UI is a filtered view, not a missing append.
6. **History UI caps** (kings 15, par/kwatro/ramrod 6, fab/prime 10) truncate display only; underlying `moveHistory` remains complete.
7. **Frac Fact `problemHistory` / Fraction Pinball** are quiz ledgers, not competitive move logs — excluded from this audit’s property suite.

## How to run

```bash
npx vitest run \
  tests/unit/undo-audit-polyomino-props.test.ts \
  tests/unit/undo-audit-core-games-props.test.ts \
  tests/unit/undo-audit-log-games-props.test.ts
```

(`tests/unit/undo-audit-helpers.ts` is a helper module, not a Vitest test file.)

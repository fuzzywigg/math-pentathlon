# Engine coverage round 5 — clear round-1/2 `it.todo` arms (`q-mp-201`)

Task id: `q-mp-201`

Base: `cursor/mp-tip-post709`. **TEST-ONLY** — no `src/` edits. Draft only;
tip owner folds.

## Goal

Convert remaining `it.todo` placeholders in
`tests/unit/engine-coverage-round-burn-1008.test.ts` and
`tests/unit/engine-coverage-round-2-burn-1008.test.ts` into real characterization
pins **or** documented unreachable/dead arms. Leave only geometric
impossibilities as annotated `it.todo`. No AI / scoring / difficulty / timing /
copy / rules.ts logic changes. Hex Hard assert remains **450ms**. Stars & Bars
history cap untouched.

## Overlap check

| PR / topic                                | Action                                                                                                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| #667 `q-mp-143` (round-4 / round-3 todos) | **Contained on tip** — suite + `engine-coverage-round-4.md` identical at `cdd2f8b1`; round-3 `it.todo` count already 0 (comment-only) |
| Open tip drafts                           | No other `q-mp-201` / engine-coverage-round-5 draft                                                                                   |
| Round 3 suite                             | Out of scope (r4-owned; already cleared on tip)                                                                                       |

## Round-5 disposition — round 1 (`engine-coverage-round-burn-1008.test.ts`)

|   # | Prior `it.todo`                                        | Disposition                | How                                                                                      |
| --: | ------------------------------------------------------ | -------------------------- | ---------------------------------------------------------------------------------------- |
|   1 | `isValidKingMove` stay-in-place                        | **Pinned**                 | Spy `board.isEmpty` → true on king cell so `rowDiff===0&&colDiff===0` runs               |
|   2 | `isDrawCondition` board-full-both-kings-mobile         | **Annotated todo**         | Geometric impossibility: `emptyCount===0` ⇒ no legal king moves                          |
|   3 | `getCurrentPhaseMessage` default never                 | **Pinned**                 | Forge `turnPhase: 'notAPhase'`                                                           |
|   4 | par-55 centerBase/`!base`/nested equal-score           | **Pinned + documented**    | `!base` via missing id; short `createBlockSet` forge; equal-score cascade invariant `it` |
|   5 | kwatro `createBoard !node` + `moveChip !chip/!newNode` | **Pinned + documented**    | Spy `isValidMove` for `!chip`/`!newNode`; dense 5×5 Map invariant for `!node`            |
|   6 | `checkTrioForWin !likes\|\|!opposite`                  | **Documented unreachable** | Invariant `it`: size===2 / 3-chip ⇒ only 2+1 partition                                   |
|   7 | `generateWrongDecimals` fill-while                     | **Pinned**                 | Strategy-starved `Math.random` stub (same pattern as round 2/3)                          |

**`it.todo` count in round-1 suite: 1** (geometric only). Was 7 call-sites (+1 header comment).

## Round-5 disposition — round 2 (`engine-coverage-round-2-burn-1008.test.ts`)

|   # | Prior `it.todo`                                | Disposition                | How                                                               |
| --: | ---------------------------------------------- | -------------------------- | ----------------------------------------------------------------- |
|   1 | fab `hasAnyValidMove` hole continue            | **Pinned**                 | Forge `Array.from`→`.filter()` length-2 holes                     |
|   2 | `calculateResult` catch                        | **Pinned**                 | Proxy operand that throws                                         |
|   3 | pent `canPlayerMove !pieceShape` continue      | **Pinned**                 | Known first shape + bogus mid-list on jammed board                |
|   4 | calla sow `<PITS*2+1` false arm                | **Documented unreachable** | Long sow wrap invariant                                           |
|   5 | juggle `orientSelectedShapeToFit` early return | **Pinned**                 | Forge `selectShape(..., null)`                                    |
|   6 | pinball `correct.numerator \|\| 1`             | **Pinned**                 | Inject zero-numerator into `COMMON_FRACTIONS`                     |
|   7 | stars `!adjCell.card` continue                 | **Pinned**                 | Adjacent cell with `card: undefined` (survives `!== null` filter) |
|   8 | frac-fact divide `operand2.numerator===0`      | **Pinned**                 | Inject zero-numerator + RNG force divide                          |
|   9 | fiar `subsetUnblocked` short-length            | **Documented unreachable** | `flush` only calls when `≥ WIN_LENGTH`                            |

**`it.todo` count in round-2 suite: 0** (header comment only). Was 9 call-sites.

## Files changed

- `tests/unit/engine-coverage-round-burn-1008.test.ts`
- `tests/unit/engine-coverage-round-2-burn-1008.test.ts`
- `docs/dev/engine-coverage-round-5.md` (this file)

## Verification

```bash
rg -c 'it\.todo' tests/unit/engine-coverage-round*.test.ts
npx vitest run --project unit-shared tests/unit/engine-coverage-round*.test.ts
```

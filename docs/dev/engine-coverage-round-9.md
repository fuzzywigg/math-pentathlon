# Engine coverage round 9 — post-r8 residual characterization (`q-mp-297`)

Task id: `q-mp-297`

Base: `cursor/mp-tip-post755`. **TEST-ONLY** — no `src/` edits. Draft only;
tip owner folds.

## Goal

After round 8 characterized residual `fractions` / `graph` / `polyomino` helpers,
add `engine-coverage-round-9-*.test.ts` for the next-coldest **non-rules** core
helpers — prefer `src/core/alignment` (+ `expressions/evaluator` leftovers).
No AI / scoring / difficulty / timing / copy / `rules.ts` logic changes. Hex Hard
assert remains **450ms**. Stars & Bars history cap untouched.

## Overlap check

| PR / topic                          | Action                                                       |
| ----------------------------------- | ------------------------------------------------------------ |
| #779 `q-mp-281` (round-8)           | **Already on tip** (fold #785); leave open with `contained`  |
| #773 `q-mp-252` (round-7)           | Already on tip; no shared-file edits                         |
| Open drafts `#796`–`#814`           | UI cov / mutation / backlog / ratchet — no alignment overlap |
| Open UI cov r16/r17 (`#808`/`#813`) | UI-only hosts; no `src/core/alignment` / evaluator overlap   |

## Live tip re-measure (before)

```text
$ git rev-parse HEAD
  2887ab91…  (cursor/mp-tip-post755)

$ rg -c 'it\.todo' tests/unit/engine-coverage-round*.test.ts
# header comments only; call-sites via git grep '^\s*it\.todo' → (none)

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  21:  hard: 450,

$ npm run test:unit -- --coverage \
    --coverage.reportsDirectory=coverage-engine-r9-align-full \
    --coverage.include='src/core/alignment/**' \
    --coverage.include='src/core/expressions/evaluator.ts'

Coldest NON-UI core helpers by branch % (post-r8 tip):
  1 alignment/compat.ts         91.42% (96/105)
  2 expressions/evaluator.ts    94.61% (158/167)
  3 alignment/contiguous.ts     97.18% (69/71)
  4 alignment/grid-alignment.ts 97.84% (91/93)
  # graph/algorithms 90% / polyomino/placement 95.49% residuals documented in r8
```

## Round-9 disposition

| Module / arm                                          | Disposition                | How                                                                  |
| ----------------------------------------------------- | -------------------------- | -------------------------------------------------------------------- |
| `compat` safeGet `undefined → null` (7 wrappers)      | **Pinned**                 | Board cells / empties as `undefined` (not `null`)                    |
| `compat` `findAlignmentsThrough` dedupe skip          | **Pinned**                 | `requiredLength: 1` singleton → four dirs, same key                  |
| `compat` `findLargestRegion` reduce `b.size > a.size` | **Pinned**                 | Small region scanned before larger block                             |
| `contiguous` `findAllRegions` `region` falsy          | **Pinned**                 | Flip-flop getCell (peek non-null, findRegion start null)             |
| `contiguous` `regionTouchesEdge` default              | **Pinned**                 | Forge edge `'diagonal' as 'top'`                                     |
| `grid-alignment` `found.has` skip (×2)                | **Pinned**                 | Duplicate `directions: [HORIZONTAL, HORIZONTAL]`                     |
| `evaluator` `evaluateNode` / `astToString` defaults   | **Pinned**                 | Forge `{ type: 'ternary' }` node                                     |
| `evaluator` `validateSlots` unknown tokenType         | **Pinned**                 | Forge `tokenType: 'variable'`                                        |
| `evaluator` `buildExpression([])` / paren early       | **Documented unreachable** | Private; public `solveTargetChallenge` never calls with those shapes |
| `evaluator` `error ??` / `value ??` fallbacks         | **Documented unreachable** | `evaluate` always sets `error` on fail / `value` on success          |

## Aggregate (included alignment + evaluator files, full unit suite)

| Metric     | Before (r9 baseline) |         After round 9 | Δ            |
| ---------- | -------------------: | --------------------: | ------------ |
| Lines      |     98.81% (667/675) |  **99.70%** (673/675) | **+6 lines** |
| Branches   |     94.95% (414/436) | **~98.4%** (429+/436) | **+15 arms** |
| Statements |               98.84% |                99.71% | —            |
| Functions  |                 100% |                  100% | —            |

Targeted non-UI gains (full-suite before → after):

| Module                   |    Before branch |         After branch | Before line | After line | Δb / Δl   |
| ------------------------ | ---------------: | -------------------: | ----------: | ---------: | --------- |
| alignment/compat         |  91.42% (96/105) |  **≥99%** (104+/105) |        100% |       100% | +8..9 / 0 |
| alignment/contiguous     |   97.18% (69/71) |     **100%** (71/71) |      98.24% |   **100%** | +2 / +2   |
| alignment/grid-alignment |   97.84% (91/93) |     **100%** (93/93) |        100% |       100% | +2 / 0    |
| expressions/evaluator    | 94.61% (158/167) | **96.40%** (161/167) |      97.79% | **99.26%** | +3 / +4   |

Remaining evaluator arms are the documented private/`??` class above (L450/L468).

## Files changed

- `tests/unit/engine-coverage-round-9-burn-1008.test.ts` (new)
- `docs/dev/engine-coverage-round-9.md` (this file)

## Verification

```bash
rg -c 'it\.todo' tests/unit/engine-coverage-round*.test.ts
git grep -n '^\s*it\.todo' -- tests/ || true
rg -n 'hard:\s*450' src/games/hex/ai.ts
npx vitest run --project unit-shared tests/unit/engine-coverage-round*.test.ts
npm run lint
npm run typecheck
npm run lint:ratchet
npm run test:unit
```

No engine product edits. No lint-ceiling / knip-baseline changes in this PR.

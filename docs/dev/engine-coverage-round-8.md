# Engine coverage round 8 — post-r7 residual characterization (`q-mp-281`)

Task id: `q-mp-281`

Base: `cursor/mp-tip-post748`. **TEST-ONLY** — no `src/` edits. Draft only;
tip owner folds.

## Goal

After round 7 characterized the coldest game `types` / `board` / `game-state`
helpers, add `engine-coverage-round-8-*.test.ts` for residual **non-rules** core
helpers still under branch coverage — prefer `src/core/fractions`,
`src/core/graph`, `src/core/polyomino` (not `*/rules.ts`). No AI / scoring /
difficulty / timing / copy / `rules.ts` logic changes. Hex Hard assert remains
**450ms**. Stars & Bars history cap untouched.

## Overlap check

| PR / topic                        | Action                                                         |
| --------------------------------- | -------------------------------------------------------------- |
| #773 `q-mp-252` (round-7)         | **Already on tip**; leave open with `contained`                |
| #724 / #743 (r5 / r6)             | Already on tip; no shared-file edits                           |
| Open UI / mutation drafts         | UI-only; no core fractions/graph/polyomino overlap             |
| Open post748 drafts `#754`–`#772` | void / knip / UI cov / PWA / canvas — no engine-helper overlap |

## Live tip re-measure (before)

```text
$ git rev-parse HEAD
  1fba62bb…  (cursor/mp-tip-post748)

$ rg -c 'it\.todo' tests/unit/engine-coverage-round*.test.ts
# header comments only; call-sites via git grep '^\s*it\.todo' → (none)

$ npm run test:unit -- --coverage \
    --coverage.reportsDirectory=coverage-engine-r8-baseline \
    --coverage.include='src/core/fractions/arithmetic.ts' \
    --coverage.include='src/core/fractions/types.ts' \
    --coverage.include='src/core/graph/algorithms.ts' \
    --coverage.include='src/core/graph/types.ts' \
    --coverage.include='src/core/polyomino/placement.ts' \
    --coverage.include='src/core/polyomino/transform.ts' \
    --coverage.include='src/core/polyomino/types.ts'

Coldest NON-UI core helpers by branch %:
  1 graph/algorithms.ts      90.00% (117/130)
  2 polyomino/placement.ts   90.09% (100/111)
  3 graph/types.ts           94.11% (32/34)
  4 polyomino/transform.ts   96.42% (54/56)
  5 fractions/arithmetic.ts 100%
  6 fractions/types.ts      100%
  7 polyomino/types.ts      100%
```

## Round-8 disposition

| Module / arm                                        | Disposition                | How                                                                |
| --------------------------------------------------- | -------------------------- | ------------------------------------------------------------------ |
| `placement` `occupied ?? true`                      | **Pinned**                 | Forge GridCell with `occupied: undefined`                          |
| `placement` `isOccupied` short-row `?? true`        | **Pinned**                 | Empty row array                                                    |
| `placement` Grid `placePolyomino` punched row       | **Pinned**                 | `delete grid.cells[row]` before place (Grid path skips validation) |
| `placement` `removeLastPolyomino` punched / shrunk  | **Pinned**                 | Delete row / set `rows:0` after place                              |
| `placement` `solvePlacement` `maxSolutions=0`       | **Pinned**                 | Early `solutions.length >= maxSolutions` return                    |
| `placement` blocked OOB coords                      | **Pinned**                 | `createBoardWithBlockedCells` ignores OOB                          |
| `placement` `reason \|\| 'Invalid placement'`       | **Documented unreachable** | `validatePlacement` always sets `reason`                           |
| `placement` `removePolyomino` rowCells falsy        | **Documented unreachable** | Resolving `newCells[r][c]` implies row exists                      |
| `transform` `rotateCells` default                   | **Pinned**                 | Forge rotation `45 as 0`                                           |
| `transform` `getAllOrientations` seen.has skip      | **Pinned**                 | `canRotate:false` monomino + flip dedupe                           |
| `graph/types` hex id `q/r === undefined`            | **Documented unreachable** | Ids always `${q},${r}`                                             |
| `graph/types` complete-graph index holes            | **Documented unreachable** | `Array.from(Map.keys())` dense                                     |
| `graph/algorithms` queue.shift / Map-miss continues | **Documented unreachable** | Same defensive class as r7; no `Map.prototype` spy                 |
| `graph/algorithms` dijkstra absent-end stub         | **Pinned**                 | Edge to node missing from `nodes` Map                              |
| `fractions/*`                                       | **Hot (100%)**             | Catalog smoke only                                                 |

## Aggregate (included core non-UI files, full unit suite)

| Metric     | Before (r8 baseline) | After round 8 | Δ   |
| ---------- | -------------------: | ------------: | --- |
| Lines      |     98.17% (915/932) | _(remeasure)_ | —   |
| Branches   |     93.67% (415/443) | _(remeasure)_ | —   |
| Statements |               98.31% | _(remeasure)_ | —   |
| Functions  |                 100% |          100% | —   |

_(After table filled once `coverage-engine-r8-after` is collected.)_

## Files changed

- `tests/unit/engine-coverage-round-8-burn-1008.test.ts` (new)
- `docs/dev/engine-coverage-round-8.md` (this file)

## Verification

```bash
rg -c 'it\.todo' tests/unit/engine-coverage-round*.test.ts
git grep -n '^\s*it\.todo' -- tests/ || true
npx vitest run --project unit-shared tests/unit/engine-coverage-round*.test.ts
npm run lint
npm run typecheck
npm run test:unit
```

No engine product edits. No lint-ceiling / knip-baseline changes in this PR.

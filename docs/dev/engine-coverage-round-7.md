# Engine coverage round 7 — post-r6 residual characterization (`q-mp-252`)

Task id: `q-mp-252`

Base: `cursor/mp-tip-post748`. **TEST-ONLY** — no `src/` edits. Draft only;
tip owner folds.

## Goal

After round 6 cleared every `it.todo` call-site in
`tests/unit/engine-coverage-round*.test.ts`, add a new
`engine-coverage-round-7-*.test.ts` characterization pack for the coldest
**non-rules** helpers (`types.ts` / `board.ts` / `game-state.ts`) still under
branch coverage. No AI / scoring / difficulty / timing / copy / `rules.ts`
logic changes. Hex Hard assert remains **450ms**. Stars & Bars history cap
untouched.

## Overlap check

| PR / topic                              | Action                                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------------------------- |
| #743 `q-mp-223` (round-6)               | **Already on tip** via fold `#748`; `it.todo` call-sites = 0. Leave open with `contained` |
| #724 `q-mp-201` (round-5)               | Already on tip; no shared-file edits in this PR                                           |
| #744 / #745 (juggle UI / mutation UI-6) | UI-only; no engine-helper overlap                                                         |
| Open post748 drafts `#754`–`#757`       | void board-ui / tip fold / bundle docs / board3d inventory — no engine-cov overlap        |

## Live tip re-measure (before)

```text
$ git rev-parse HEAD
  23926935…  (cursor/mp-tip-post748)

$ rg -c 'it\.todo' tests/unit/engine-coverage-round*.test.ts
tests/unit/engine-coverage-round-2-burn-1008.test.ts:1   # header comment only
tests/unit/engine-coverage-round-3-burn-1008.test.ts:1   # header comment only
tests/unit/engine-coverage-round-burn-1008.test.ts:2     # header comments only

$ git grep -n '^\s*it\.todo' -- tests/
(none)   # call-sites already 0 after r6 fold

$ npm run lint:ratchet
  ok   curly: 538 / ceiling 538
  ok   @typescript-eslint/no-non-null-assertion: 254 / ceiling 254
  ok   @typescript-eslint/no-confusing-void-expression: 118 / ceiling 118
  ok   no-duplicate-imports: 99 / ceiling 99
  ok   @typescript-eslint/prefer-nullish-coalescing: 65 / ceiling 65
  # (live tip ceilings already absorb folded void/dup drafts; this PR does not touch JSON)

$ node scripts/engine-coverage-rank.mjs coverage-engine-r7-baseline/coverage-summary.json
  # coldest NON-RULES helpers by branch %:
  # 1 ramrod/types            66.66% (4/6)
  # 2 kings/board             75.00% (15/20)
  # 3 sum-dominoes/types      75.00% (3/4)
  # 4 star-track/types        83.33% (5/6)
  # 5 queens-guards/types     85.71% (36/42)
  # 6 kings/game-state        90.90% (60/66)
  # 7 contig-60/types         92.50% (37/40)
```

## Round-7 disposition

| Module                                       | Prior cold arm                         | Disposition                | How                                                            |
| -------------------------------------------- | -------------------------------------- | -------------------------- | -------------------------------------------------------------- |
| `ramrod/types.ts` shuffle hole-guard         | `a===undefined \|\| b===undefined`     | **Pinned**                 | Dense array with `undefined` slot (same pattern as r3 fab/par) |
| `ramrod/types.ts` `count===undefined`        | createRodSet continue                  | **Documented unreachable** | Local `counts` Record covers lengths 1–10                      |
| `sum-dominoes/types.ts` shuffle hole-guard   | same                                   | **Pinned**                 | Hole array + catalog helpers (pips/doubles/dice)               |
| `kings/board.ts` sparse row/cell             | `row===undefined` / `cell===undefined` | **Pinned**                 | Forge deleted row + empty row array; OOB + hasSupply/coords    |
| `kings/game-state.ts` `boardRow===undefined` | getKingPosition continue               | **Pinned**                 | Delete non-king / king rows on live state                      |
| `queens-guards/types.ts` `cell===undefined`  | createBoard outer-ring continue        | **Pinned**                 | Spy `Map.prototype.get` for two guard seats during createBoard |
| `contig-60/types.ts` short/jagged board      | `numberRow` / `value` undefined        | **Pinned**                 | Short + jagged `boardNumbers`; expression/placement smoke      |
| `contig-60/types.ts` `evaluate` default      | `never` arm                            | **Documented unreachable** | Private `evaluate` only called with `OPERATORS` union          |
| `star-track/types.ts` private shuffle        | hole-guard                             | **Documented unreachable** | Module-private; dense `createChainBucket` only (r3–r5)         |
| `fiar/types.ts` `prevId===undefined`         | getNodesInDirection break              | **Pinned**                 | Forged `undefined` startId + east neighbor + edge              |
| `prime-gold/types.ts` vals hole continues    | generateExpressions                    | **Documented unreachable** | Built then `.filter()`'d to dense arrays                       |
| `prime-gold/types.ts` Goldbach exhaust       | `return false`                         | **Documented unreachable** | Invariant: every even `n` in 4..60 is `true`                   |

## Aggregate (included engine files, full unit suite)

| Metric     | Before (r7 baseline) |          After round 7 | Δ             |
| ---------- | -------------------: | ---------------------: | ------------- |
| Lines      |   99.27% (2726/2746) | **99.67%** (2737/2746) | **+11 lines** |
| Branches   |   97.51% (1885/1933) | **98.08%** (1896/1933) | **+11 arms**  |
| Statements |               99.01% |                 99.36% | —             |
| Functions  |                 100% |                   100% | —             |

Targeted non-rules gains (full-suite before → after):

| Module              |  Before branch |       After branch | Before line | After line | Δb / Δl        |
| ------------------- | -------------: | -----------------: | ----------: | ---------: | -------------- |
| ramrod/types        |   66.66% (4/6) |   **83.33%** (5/6) |      92.30% | **96.15%** | +1 / +1        |
| kings/board         | 75.00% (15/20) | **90.00%** (18/20) |      90.90% |   **100%** | +3 / +3        |
| sum-dominoes/types  |   75.00% (3/4) |     **100%** (4/4) |      95.65% |   **100%** | +1 / +1        |
| queens-guards/types | 85.71% (36/42) | **90.47%** (38/42) |      97.14% |   **100%** | +2 / +2        |
| contig-60/types     | 92.50% (37/40) | **97.50%** (39/40) |      93.84% | **96.92%** | +2 / +2        |
| kings/game-state    | 90.90% (60/66) | **92.42%** (61/66) |      98.98% |   **100%** | +1 / +1        |
| fiar/types          | 97.43% (38/39) |   **100%** (39/39) |      98.21% |   **100%** | +1 / +1        |
| star-track/types    |   83.33% (5/6) |       83.33% (5/6) |      95.00% |     95.00% | 0 (private)    |
| prime-gold/types    | 97.01% (65/67) |     97.01% (65/67) |      96.05% |     96.05% | 0 (documented) |

## Files changed

- `tests/unit/engine-coverage-round-7-burn-1008.test.ts` (new)
- `docs/dev/engine-coverage-round-7.md` (this file)

## Verification

```bash
rg -c 'it\.todo' tests/unit/engine-coverage-round*.test.ts
git grep -n '^\s*it\.todo' -- tests/ || true
npx vitest run --project unit-shared tests/unit/engine-coverage-round*.test.ts
npm run lint
npm run typecheck
npm run verify
npm run lint:ratchet
```

No engine product edits. No lint-ceiling / knip-baseline changes in this PR.

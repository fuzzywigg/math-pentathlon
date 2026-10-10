# Engine coverage round 11 — post-r10 residual characterization (`q-mp-349`)

Task id: `q-mp-349`

Base: `cursor/mp-tip-post830` @ `97487de6`. **TEST-ONLY** — no `src/` edits. Draft
only; tip owner folds.

## Goal

After round 10 characterized residual `timer-scoring` / `dom-security` /
`url-flags` / `sanitize` / placement empty-flip, add
`engine-coverage-round-11-*.test.ts` for the next-coldest **non-rules** core
helpers — prefer `src/core/fractions/**` / `src/core/polyomino/**` leftovers
(**not** `*/rules.ts`, **not** `polyomino/transform` — open `#847` / `q-mp-354`).
Parallel `q-mp-372` (engine r12) owns `attributes/**` / `dice/**` / `graph/**`
leftovers. No AI / scoring / difficulty / timing / copy / `rules.ts` logic
changes. Hex Hard assert remains **450ms**. Stars & Bars history cap untouched.

## Overlap check

| PR / topic                                           | Action                                                                   |
| ---------------------------------------------------- | ------------------------------------------------------------------------ |
| #833 `q-mp-324` (round-10)                           | **Already on tip** (fold through #851 / post830); leave open `contained` |
| #824 `q-mp-297` (round-9)                            | Already on tip; no shared-file edits                                     |
| #847 `q-mp-354` (polyomino/transform edges)          | Orthogonal — r11 skips `transform.ts`                                    |
| Open drafts into `cursor/mp-tip-post830` (#853/#854) | Bundle / CI audit — no engine-helper overlap                             |
| #852 `q-mp-359` (queens-guards harness)              | Test-harness only; no core helper overlap                                |
| Parallel `q-mp-372` (r12)                            | Disjoint hosts: attributes / dice / graph                                |

## Live tip re-measure (before)

```text
$ git rev-parse HEAD
  97487de6…  (cursor/mp-tip-post830)

$ git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts
(none)

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  21:  hard: 450,

$ npm run test:unit -- --project unit-shared --project unit-node \
    --exclude='**/ai*.test.ts' --exclude='**/*ai-*.test.ts' \
    --exclude='**/ai-move-time*.test.ts' --exclude='**/*bench*.test.ts' \
    --coverage --coverage.reportsDirectory=coverage-engine-r11-baseline \
    --coverage.include='src/core/timer-scoring.ts' \
    --coverage.include='src/core/{fractions,graph,polyomino,alignment,attributes,dice,expressions,storage}/**' \
    --coverage.include='src/core/{dom-security,url-flags,feature-flags,settings-flags,security-headers,game-registry,seats,route-generation}.ts'

Coldest NON-UI core helpers by branch % (post-r10 tip):
  1 fraction-bar-ui.ts     85.71% (96/112)   ← r11 primary
  2 storage/storage.ts     90.00% (63/70)    ← r10 residual; skip
  3 graph/algorithms.ts    90.00% (117/130)  ← r12 / documented
  4 dom-security.ts        90.90% (20/22)    ← r10 documented
  5 polyomino-ui.ts        90.90% (50/55)    ← r11 primary
  6 attribute-ui.ts        92.85% (65/70)    ← r12
  7 graph/types.ts         94.11% (32/34)    ← r12
  8 dice-ui.ts             94.82% (55/58)    ← r12
  9 polyomino/placement.ts 96.39% (107/111)  ← residual docs
  # fractions/arithmetic + polyomino/transform at 100%
```

## Round-11 disposition

| Module / arm                                                    | Disposition                | How                                                      |
| --------------------------------------------------------------- | -------------------------- | -------------------------------------------------------- |
| `fraction-bar-ui` horizontal/vertical/circle `colors.* ??`      | **Pinned**                 | Deep-merge `colors` with explicit `undefined` keys       |
| `fraction-bar-ui` interactive `colors?.filled/empty/border ??`  | **Pinned**                 | Shallow-merge `{ colors: {} }`; wrapper border → `#333`  |
| `fraction-bar-ui` interactive `if (seg)` false on mouseenter    | **Documented unreachable** | `segments` densely pushed; no public hole                |
| `fraction-bar-ui` `renderFractionBar` default style arm         | **Pinned**                 | Forged non-union `style` → horizontal                    |
| `polyomino-ui` `renderBoard` OOB cell skip                      | **Pinned**                 | Forged placement with domino overhang                    |
| `polyomino-ui` `getCellFromMouseEvent` attr / rect / `\|\| 1`   | **Pinned**                 | Zero viewBox + attr; missing attr + rect; zero rect      |
| `placement` `reason \|\|` / `rowCells` falsy / blocked rowCells | **Documented unreachable** | Carry-forward from r8; same-module `createBoard` binding |
| `graph/*` / `attribute-ui` / `dice-ui`                          | **Deferred to r12**        | Parallel `q-mp-372` ownership                            |

## Aggregate (included non-UI core files, unit suite excl. AI/bench)

| Metric     | Before (r11 baseline) |         After round 11 | Δ            |
| ---------- | --------------------: | ---------------------: | ------------ |
| Lines      |    99.18% (3763/3794) |     99.18% (3763/3794) | 0            |
| Branches   |    96.56% (1858/1924) | **97.60%** (1878/1924) | **+20 arms** |
| Statements |                99.21% |                 99.21% | —            |
| Functions  |                99.71% |                 99.71% | —            |

Targeted non-UI gains (same suite before → after):

| Module              |    Before branch |         After branch | Before line | After line | Δb / Δl |
| ------------------- | ---------------: | -------------------: | ----------: | ---------: | ------- |
| fraction-bar-ui     |  85.71% (96/112) | **99.10%** (111/112) |        100% |       100% | +15 / 0 |
| polyomino-ui        |   90.90% (50/55) |     **100%** (55/55) |        100% |       100% | +5 / 0  |
| polyomino/placement | 96.39% (107/111) |     96.39% (107/111) |        100% |       100% | 0 (doc) |
| attribute-ui        |   92.85% (65/70) |       92.85% (65/70) |      99.14% |     99.14% | 0 (r12) |
| dice-ui             |   94.82% (55/58) |       94.82% (55/58) |      98.63% |     98.63% | 0 (r12) |
| graph/algorithms    | 90.00% (117/130) |     90.00% (117/130) |      94.90% |     94.90% | 0 (r12) |

## Files changed

- `tests/unit/engine-coverage-round-11-burn-1008.test.ts` (new)
- `docs/dev/engine-coverage-round-11.md` (this file)

## Verification

```bash
rg -c 'it\.todo' tests/unit/engine-coverage-round*.test.ts
git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts || true
rg -n 'hard:\s*450' src/games/hex/ai.ts
npx vitest run --project unit-shared tests/unit/engine-coverage-round*.test.ts
npm run verify
npm run test:unit
```

No engine product edits. No lint-ceiling / knip-baseline changes in this PR.

# Engine coverage round 10 — post-r9 residual characterization (`q-mp-324`)

Task id: `q-mp-324`

Base: `cursor/mp-tip-post785`. **TEST-ONLY** — no `src/` edits. Draft only;
tip owner folds.

## Goal

After round 9 characterized residual `alignment` / `evaluator` helpers, add
`engine-coverage-round-10-*.test.ts` for the next-coldest **non-rules** core
helpers — prefer `timer-scoring` (+ `dom-security` / `url-flags` / storage
sanitize / polyomino leftovers). No AI / scoring / difficulty / timing / copy /
`rules.ts` logic changes. Hex Hard assert remains **450ms**. Stars & Bars
history cap untouched.

## Overlap check

| PR / topic                                | Action                                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| #824 `q-mp-297` (round-9)                 | **Already on tip/alpha** (fold #785 tree); leave open with `contained` |
| #779 `q-mp-281` (round-8)                 | Already on tip; no shared-file edits                                   |
| #813 UI cov r16 owl / #822 no-shadow ctrl | Orthogonal (UI / lint renames); no engine-helper overlap               |
| Open drafts into `cursor/mp-tip-post785`  | **None** at start                                                      |

## Live tip re-measure (before)

```text
$ git rev-parse HEAD
  217190621fc55835bf82f5a4d3b8bd7666a25d9b  (cursor/mp-tip-post785)

$ git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts
(none)

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  21:  hard: 450,

$ npm run test:unit -- --project unit-shared --project unit-node \
    --exclude='**/ai*.test.ts' --exclude='**/*ai-*.test.ts' \
    --exclude='**/ai-move-time*.test.ts' --exclude='**/*bench*.test.ts' \
    --coverage --coverage.reportsDirectory=coverage-engine-r10-baseline \
    --coverage.include='src/core/timer-scoring.ts' \
    --coverage.include='src/core/{fractions,graph,polyomino,alignment,attributes,dice,expressions,storage}/**' \
    --coverage.include='src/core/{dom-security,url-flags,feature-flags,settings-flags,security-headers,game-registry,seats,route-generation}.ts'

Coldest NON-UI core helpers by branch % (post-r9 tip):
  1 dom-security.ts          86.36% (19/22)
  2 storage/storage.ts       90.00% (63/70)
  3 graph/algorithms.ts      90.00% (117/130)  ← r8 documented unreachable
  4 graph/types.ts           94.11% (32/34)    ← r8 documented unreachable
  5 url-flags.ts             94.44% (17/18)
  6 polyomino/placement.ts   95.49% (106/111)
  7 expressions/evaluator.ts 96.40% (161/167)  ← r9 documented unreachable
  8 storage/sanitize.ts      97.22% (70/72)
  9 timer-scoring.ts         97.84% (91/93)
  # fractions/* + alignment/* at 100%
```

## Round-10 disposition

| Module / arm                                               | Disposition                | How                                                              |
| ---------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------- |
| `timer-scoring` `getPointValue` `pv[key] ?? 0`             | **Pinned**                 | `pointValues` entry present with `undefined` value               |
| `timer-scoring` `getLeader` `find ?? null`                 | **Pinned**                 | Proxy `players.find` → `undefined`                               |
| `dom-security` comment / non-text non-element → null       | **Pinned**                 | `<!-- -->` in `setTrustedMarkup`                                 |
| `dom-security` `safeHtml` missing `data-mp-safe` slot      | **Pinned**                 | Spy `DocumentFragment.querySelector` → null                      |
| `dom-security` `HTML_ESCAPE[ch] ?? ch` / textContent `??`  | **Documented unreachable** | Regex keys ⊆ map; TEXT_NODE textContent never null               |
| `url-flags` hash junk → storage / getItem throw / bare `?` | **Pinned**                 | Non-allowlisted hash token; throwing storage; `board3d=1` search |
| `sanitize` `idFromValue ?? gameId`                         | **Pinned**                 | `value.gameId` control-only → null → map key                     |
| `sanitize` avatar `?? ''` after typeof string              | **Documented unreachable** | AllowEmpty null only for non-strings                             |
| `placement` `solvePlacement` `empty.length === 0`          | **Pinned**                 | `cells` getter flips empty→occupied between fill / empty scans   |
| `graph/algorithms` queue.shift / Map-miss                  | **Documented unreachable** | Carry-forward from r8; no Array/Map spy                          |
| `evaluator` private / `??` fallbacks                       | **Documented unreachable** | Carry-forward from r9                                            |
| `storage/storage` load non-plain / catch                   | **Residual**               | Needs isolated remount; left for a later remount-friendly round  |
| `fractions/*` / `alignment/*`                              | **Hot (100%)**             | Catalog / compat smoke only                                      |

## Aggregate (included non-UI core files, unit suite excl. AI/bench)

| Metric     | Before (r10 baseline) |         After round 10 | Δ            |
| ---------- | --------------------: | ---------------------: | ------------ |
| Lines      |    98.87% (2550/2579) | **98.95%** (2552/2579) | **+2 lines** |
| Branches   |    96.06% (1441/1500) | **96.46%** (1447/1500) | **+6 arms**  |
| Statements |                98.93% |                 99.00% | —            |
| Functions  |                99.64% |                 99.64% | —            |

Targeted non-UI gains (same suite before → after):

| Module              |    Before branch |         After branch | Before line | After line | Δb / Δl |
| ------------------- | ---------------: | -------------------: | ----------: | ---------: | ------- |
| timer-scoring       |   97.84% (91/93) |     **100%** (93/93) |        100% |       100% | +2 / 0  |
| url-flags           |   94.44% (17/18) |     **100%** (18/18) |        100% |       100% | +1 / 0  |
| dom-security        |   86.36% (19/22) |   **90.90%** (20/22) |      97.91% |   **100%** | +1 / +1 |
| storage/sanitize    |   97.22% (70/72) |   **98.61%** (71/72) |        100% |       100% | +1 / 0  |
| polyomino/placement | 95.49% (106/111) | **96.39%** (107/111) |      99.49% |   **100%** | +1 / +1 |
| storage/storage     |   90.00% (63/70) |       90.00% (63/70) |      93.37% |     93.37% | 0 (res) |
| graph/algorithms    | 90.00% (117/130) |     90.00% (117/130) |      94.90% |     94.90% | 0 (doc) |

## Files changed

- `tests/unit/engine-coverage-round-10-burn-1008.test.ts` (new)
- `docs/dev/engine-coverage-round-10.md` (this file)

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

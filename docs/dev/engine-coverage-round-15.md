# Engine coverage round 15 — post-r14 residual characterization (`q-mp-456`)

Task id: `q-mp-456`

Base: `cursor/mp-tip-post898` (remeasured @ `b7e518b4`; rebased onto tip head
before PR). **TEST-ONLY** — no `src/` edits. Draft only; tip owner folds.

## Goal

After tip-folded r14 (`#911` / `q-mp-428`) pinned tutorial non-HTMLElement focus /
ghost highlight / preferVertical top / flip / click-cell cueBelow, add
`engine-coverage-round-15-*.test.ts` for the next-coldest **non-rules** core
helpers — prefer `src/core/tutorial.ts` post-r14 leftovers / `src/core/graph/**`
carry-forward / `src/core/fractions/**` / `src/core/attributes/**` (**not**
`*/rules.ts`, **not** scoring; **not** storage — `#909` / `q-mp-420`; **not**
dice-ui — `#920` / `q-mp-432`; **not** attribute-ui soft-fail — `#893` /
`q-mp-403`; **not** dom-security / security-headers — mutation w15 `q-mp-457`).
No AI / scoring / difficulty / timing / copy / `rules.ts` logic changes. Hex Hard
assert remains **450ms**. Stars & Bars history cap untouched.

## Overlap check

| PR / topic                                      | Action                                                                  |
| ----------------------------------------------- | ----------------------------------------------------------------------- |
| `#911` `q-mp-428` (engine r14)                  | Already on tip — **do not duplicate** r14 cases; leave open `contained` |
| `#899` `q-mp-401` (engine r13)                  | Already on tip; leave open `contained`                                  |
| `#920` `q-mp-432` (dice-ui/roller)              | Orthogonal host — r15 skips `dice-ui` / `roller`                        |
| `#909` `q-mp-420` (storage soft-fail)           | Orthogonal — skip `storage.ts`                                          |
| `#893` `q-mp-403` (attribute-ui)                | Orthogonal UI residual — skip `attribute-ui.ts`                         |
| `#912` / undrafted `q-mp-457` (mutation w14/15) | Orthogonal — skip dom-security / security-headers                       |
| Open drafts into `cursor/mp-tip-post898`        | No other draft owns engine coverage round 15                            |

## Live tip re-measure (before)

```text
$ git rev-parse HEAD
  b7e518b4afe04556fa7e87ecba7ce97229b05bc7  (cursor/mp-tip-post898)

$ find tests/unit -name '*.test.ts' | wc -l
  3231   # tip later 3236 after unrelated folds; r15 adds +1

$ git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts
(none)

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  21:  hard: 450,

$ npm run test:unit -- --project unit-shared --project unit-node \
    --exclude='**/ai-determinism*.test.ts' \
    --exclude='**/ai-worker*.test.ts' \
    --exclude='**/ai-calibration*.test.ts' \
    --exclude='**/ai-move-time*.test.ts' \
    --exclude='**/*bench*.test.ts' \
    --coverage --coverage.reportsDirectory=coverage-engine-r15-baseline \
    --coverage.include='src/core/{alignment,graph,fractions,polyomino,attributes,dice,expressions,storage}/**' \
    --coverage.include='src/core/{dom-security,url-flags,timer-scoring,feature-flags,settings-flags,security-headers,game-registry,seats,route-generation,tutorial}.ts'

Coldest preferred non-rules helpers by branch % (post-r14 tip):
  1 tutorial.ts                 87.15% (156/179)  ← r15 primary (post-r14 leftovers)
  2 graph/algorithms.ts         90.00% (117/130)  ← r8 documented unreachable
  3 storage/storage.ts          90.00% (63/70)    ← #909 owns soft-fail
  4 dom-security.ts             90.91% (20/22)    ← r10 + mutation w15
  5 graph/types.ts              94.12% (32/34)    ← r8 documented unreachable
  6 polyomino/placement.ts      96.40% (107/111)  ← r8/r11 documented
  7 expressions/evaluator.ts    96.41% (161/167)  ← r9 documented
  8 dice-ui.ts                  96.55% (56/58)    ← #920
  9 fraction-bar-ui.ts          99.11% (111/112)  ← r11 L407 doc
  # attributes/** / alignment/* / graph-ui at 100%
```

## Round-15 disposition

| Module / arm                                                      | Disposition                | How                                                         |
| ----------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------- |
| `tutorial` Next listener with `requiredAction` (L331 else)        | **Pinned**                 | Re-enable disabled Next then click (jsdom skips disabled)   |
| `tutorial` non-Escape keydown (L385 else)                         | **Pinned**                 | `ArrowRight` while active                                   |
| `tutorial` missing chrome nodes (L538/541/545/550/556)            | **Pinned**                 | Remove title/message/counter/prev/next → `refreshHighlight` |
| `tutorial` missing highlight ring + absent target (L644 else)     | **Pinned**                 | Remove `.tutorial-highlight-ring` then refresh              |
| `tutorial` bottom→top flip (L756–758 `'top'` arm)                 | **Pinned**                 | Overlapping `position: 'bottom'`                            |
| `tutorial` preferVerticalSide upper-band ternary (L796 `'top'`)   | **Pinned**                 | Cramped left with more room above                           |
| `tutorial` flip preferVertical when side is left/right (L758)     | **Documented unreachable** | Flip only runs after tryPlace fails; left/right already     |
|                                                                   |                            | rewrote `side` via preferVertical before tryPlace           |
| `tutorial` L383 / L700 / L725–726 ?? / L937 cache / private nulls | **Documented unreachable** | Carry-forward + sole-call-site / invalidate-before-measure  |
| `graph/algorithms` queue.shift / Map-miss                         | **Documented unreachable** | Carry-forward from r8–r14; no Array/Map spy                 |
| `graph/types` hex id / complete index holes                       | **Documented unreachable** | Carry-forward from r8                                       |
| `fraction-bar-ui` interactive `if (seg)` (L407)                   | **Documented unreachable** | Carry-forward from r11                                      |
| `attributes/**`                                                   | **Hot (100%)**             | Smoke only (`isPrime` / `createMathPiece`)                  |
| `storage` / `dice-ui` / `dom-security` / `attribute-ui`           | **Deferred**               | `#909` / `#920` / `457` / `#893` ownership                  |

## Aggregate (preferred hosts)

Full unit suite excl. AI/bench (same include set as baseline):

| Module           |    Before branch |         After branch |      Before line |           After line | Δb / Δl |
| ---------------- | ---------------: | -------------------: | ---------------: | -------------------: | ------- |
| tutorial.ts      | 87.15% (156/179) | **92.18%** (165/179) | 98.03% (399/407) | **98.03%** (399/407) | +9 / 0  |
| graph/algorithms |           90.00% |               90.00% |           94.90% |               94.90% | 0 (doc) |
| graph/types      |           94.12% |               94.12% |           98.66% |               98.66% | 0 (doc) |
| fraction-bar-ui  |           99.11% |               99.11% |             100% |                 100% | 0 (doc) |
| attributes/**    |             100% |                 100% |             100% |                 100% | 0 (hot) |

## Files changed

- `tests/unit/engine-coverage-round-15-burn-1008.test.ts` (new)
- `docs/dev/engine-coverage-round-15.md` (this file)

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

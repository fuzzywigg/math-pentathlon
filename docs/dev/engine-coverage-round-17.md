# Engine coverage round 17 — post-r16 residual characterization (`q-mp-506`)

Task id: `q-mp-506`

Base: `cursor/mp-tip-post914` @ `f5d3d04a` (remeasured live; post-r16 residual
view overlays unfolded `#954` / `q-mp-477`). **TEST-ONLY** — no `src/` edits.
Draft only; tip owner folds.

## Goal

After open r16 (`#954` / `q-mp-477`) pinned tutorial contentRect height-only /
both-zero / missing borderBox / click-cell top smoke, add
`engine-coverage-round-17-*.test.ts` for the next-coldest **non-rules** core
helpers — prefer `src/core/graph/**` defensive arms that r8–r16 only documented,
plus post-r16 tutorial / fractions / attributes / alignment / migrate smoke
(**not** `*/rules.ts`, **not** scoring; **not** storage.ts — `#909`; **not**
sanitize — `#504` / mutation w17; **not** dice-ui — `#920`; **not** attribute-ui
— `#893`; **not** highlight-ui / compat soft-fail — `#503`/`#505`; **not**
dom-security — `#933`; **not** graph-ui — mutation w16 `#957`). No AI /
scoring / difficulty / timing / copy / `rules.ts` logic changes. Hex Hard
assert remains **450ms**. Stars & Bars history cap untouched.

## Overlap check

| PR / topic                               | Action                                                               |
| ---------------------------------------- | -------------------------------------------------------------------- |
| `#954` `q-mp-477` (engine r16)           | Unfolded into post914 — **do not duplicate**; leave open `contained` |
| `#935` `q-mp-456` (engine r15)           | Tip-folded via `#949` — leave open `contained`                       |
| `#909` `q-mp-420` (storage soft-fail)    | Orthogonal — skip `storage.ts`                                       |
| `#920` `q-mp-432` (dice-ui/roller)       | Orthogonal — skip                                                    |
| `#933` `q-mp-457` (mutation w15)         | Orthogonal — skip dom-security                                       |
| `#957` `q-mp-478` (mutation w16)         | Orthogonal — skip graph-ui                                           |
| Undrafted `503`/`504`/`505` chars        | Orthogonal hosts — skip highlight-ui / sanitize / compat soft-fail   |
| Open drafts into `cursor/mp-tip-post914` | No other draft owns engine coverage round 17                         |

## Live tip re-measure (before)

```text
$ git rev-parse HEAD
  f5d3d04a65c8569ffa66db54ddae1cc683578c78  (cursor/mp-tip-post914)

$ find tests/unit -name '*.test.ts' | wc -l
  3245

$ git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts
(none)

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  21:  hard: 450,

$ # post-r16 residual view: tip suite + #954 test overlay (not committed here)
$ npm run test:unit -- --project unit-shared --project unit-node \
    --exclude='**/ai-determinism*.test.ts' \
    --exclude='**/ai-worker*.test.ts' \
    --exclude='**/ai-calibration*.test.ts' \
    --exclude='**/ai-move-time*.test.ts' \
    --exclude='**/*bench*.test.ts' \
    --coverage --coverage.reportsDirectory=coverage-engine-r17-baseline \
    --coverage.include='src/core/{alignment,graph,fractions,polyomino,attributes,dice,expressions,storage}/**' \
    --coverage.include='src/core/{dom-security,url-flags,timer-scoring,feature-flags,settings-flags,security-headers,game-registry,seats,route-generation,tutorial}.ts'

Coldest preferred non-rules helpers by branch % (post-r16 residual view):
  1 storage/storage.ts          90.00% (63/70)    ← #909 owns soft-fail
  2 graph/algorithms.ts         90.00% (117/130)  ← r17 primary (spy pins)
  3 dom-security.ts             90.90% (20/22)    ← mutation w15
  4 tutorial.ts                 93.29% (167/179)  ← r16 closed pinable arms
  5 graph/types.ts              94.11% (32/34)    ← r17 primary (spy pins)
  6 polyomino/placement.ts      96.39% (107/111)  ← r8/r11 documented
  7 expressions/evaluator.ts    96.40% (161/167)  ← r9 documented private
  8 dice-ui.ts                  98.27% (57/58)    ← #920
  9 sanitize.ts                 98.61%            ← #504
  # attributes/** / alignment/* / graph-ui at 100%
```

## Round-17 disposition

| Module / arm                                                       | Disposition                | How                                                        |
| ------------------------------------------------------------------ | -------------------------- | ---------------------------------------------------------- |
| `graph/algorithms` queue.shift undefined (bfs/isConnected/…)       | **Pinned**                 | unit-isolated `Array.prototype.shift` patch                |
| `graph/algorithms` distances.get Map-miss continues                | **Pinned**                 | unit-isolated `Map.prototype.get` patch                    |
| `graph/types` hex id `q/r === undefined`                           | **Pinned**                 | unit-isolated `String.prototype.split` patch               |
| `graph/types` complete-graph index holes                           | **Pinned**                 | unit-isolated `Array.from` sparse hole                     |
| `tutorial` center / right placement smoke                          | **Pinned**                 | Structural; disjoint from r15/r16 cases                    |
| `tutorial` L383 / L700 / L725–726 ?? / L758 / L937 / private nulls | **Documented unreachable** | Carry-forward from r13–r16                                 |
| `evaluator` buildExpression([]) / paren early                      | **Documented unreachable** | Carry-forward from r9                                      |
| `placement` reason\|\| / rowCells falsy                            | **Documented unreachable** | Carry-forward from r8/r11                                  |
| `fraction-bar-ui` interactive `if (seg)` (L407)                    | **Documented unreachable** | Carry-forward from r11                                     |
| `attributes/**` / `alignment/**` / migrate `isPlainProgressObject` | **Hot smoke**              | Soft-fail chars `#503`/`#505` / sanitize `#504` left alone |
| `storage.ts` / `dice-ui` / `dom-security` / `sanitize`             | **Deferred**               | `#909` / `#920` / `#933` / `#504` ownership                |

## Aggregate (preferred hosts)

Full unit suite excl. AI/bench, with `#954` r16 suite overlaid for post-r16 view
(r16 file not committed on this branch):

| Module           |    Before branch |         After branch |      Before line |           After line | Δb / Δl       |
| ---------------- | ---------------: | -------------------: | ---------------: | -------------------: | ------------- |
| graph/algorithms | 90.00% (117/130) | **97.69%** (127/130) | 94.90% (243/256) | **98.82%** (253/256) | **+10 / +10** |
| graph/types      |   94.11% (32/34) |             **100%** |           98.66% |             **100%** | **+2 / +1**   |
| tutorial.ts      | 93.29% (167/179) |               93.29% |           98.02% |               98.02% | 0 (smoke)     |
| fraction-bar-ui  |           99.10% |               99.10% |             100% |                 100% | 0 (doc)       |
| attributes/      |             100% |                 100% |             100% |                 100% | 0 (hot)       |
| alignment/       |             100% |                 100% |             100% |                 100% | 0 (hot)       |

Remaining algorithms holes after spies: dijkstra `distances.get` miss (L110/L131)
and `isConnected` empty-iterator `.done` (L184) — still defensive / empty-graph class.

## Files changed

- `tests/unit/engine-coverage-round-17-burn-1008.test.ts` (new)
- `tests/unit/engine-coverage-round-17-graph-defensive-spies.test.ts` (new, unit-isolated)
- `vitest.config.ts` (list isolated spies file)
- `docs/dev/engine-coverage-round-17.md` (this file)

## Verification

```bash
rg -c 'it\.todo' tests/unit/engine-coverage-round*.test.ts
git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts || true
rg -n 'hard:\s*450' src/games/hex/ai.ts
npx vitest run --project unit-shared --project unit-isolated \
  tests/unit/engine-coverage-round-17*.test.ts
npx vitest run --project unit-shared tests/unit/engine-coverage-round*.test.ts
npm run verify
npm run test:unit
```

No engine product edits. No lint-ceiling / knip-baseline changes in this PR.

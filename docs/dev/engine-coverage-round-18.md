# Engine coverage round 18 — post-r17 residual characterization (`q-mp-526`)

Task id: `q-mp-526`

Base: `cursor/mp-tip-post949` @ `a2626787` (remeasured live at `8698fffb`; tip
then folded docs-only `#983` / `q-mp-511` radix inventory — coverage-neutral.
Post-r17 residual view includes tip-folded r16/r17 + unit-isolated graph spies).
**TEST-ONLY** — no `src/` edits. Draft only; tip owner folds.

## Goal

After tip-folded r17 (`#976` / `q-mp-506`) pinned graph defensive spies +
tutorial/evaluator/placement docs, add `engine-coverage-round-18-*.test.ts` for
the next-coldest **non-rules** core helpers — prefer leftovers **not** claimed
by open tip soft-fail chars `521`–`525` / mutation w18 `#987` / `#909` / `#920`
/ `#504` / `#933`. No AI / scoring / difficulty / timing / copy / `rules.ts`
logic changes. Hex Hard assert remains **450ms**. Stars & Bars history cap
untouched.

## Overlap check

| PR / topic                                        | Action                                                                    |
| ------------------------------------------------- | ------------------------------------------------------------------------- |
| `#976` `q-mp-506` (engine r17)                    | Tip-folded via post949 cut — **do not duplicate**; leave open `contained` |
| `#954` `q-mp-477` (engine r16)                    | Tip-folded — leave open `contained`                                       |
| `#981` `q-mp-521` (dice-selector soft-fail)       | Orthogonal — r18 hot-smoke only; soft-fail stays with 521                 |
| `#986` `q-mp-522` (board-a11y soft-fail)          | Orthogonal — **skip** board-a11y residual pins                            |
| `#984` `q-mp-523` (pointer-hygiene soft-fail)     | Orthogonal — r18 constant smoke only                                      |
| Undrafted `q-mp-524` (graph/algorithms soft-fail) | **Deferred** — remaining L110/L131/L184 left for 524                      |
| Undrafted `q-mp-525` (polyomino/transform)        | **Deferred** — no transform pins                                          |
| `#987` `q-mp-527` (mutation w18)                  | Orthogonal mutation scores on dice/board-a11y/pointer                     |
| `#909` `q-mp-420` (storage soft-fail)             | Orthogonal — r18 pins createProfile `??` only, not load/save catches      |
| Open drafts into `cursor/mp-tip-post949`          | No other draft owns engine coverage round 18                              |

## Live tip re-measure (before)

```text
$ git rev-parse HEAD
  a2626787b56864307095bede78020930b51d9bd7  (cursor/mp-tip-post949)
  # coverage remeasure @ 8698fffb (docs-only tip move to a2626787 after)

$ find tests/unit -name '*.test.ts' | wc -l
  3268

$ git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts
(none)

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  21:  hard: 450,

$ npm run test:unit -- --project unit-shared --project unit-node --project unit-isolated \
    --exclude='**/ai-determinism*.test.ts' \
    --exclude='**/ai-worker*.test.ts' \
    --exclude='**/ai-calibration*.test.ts' \
    --exclude='**/ai-move-time*.test.ts' \
    --exclude='**/*bench*.test.ts' \
    --coverage --coverage.reportsDirectory=coverage-engine-r18-postr17 \
    --coverage.include='src/core/{alignment,graph,fractions,polyomino,attributes,dice,expressions,storage}/**' \
    --coverage.include='src/core/{dom-security,url-flags,timer-scoring,feature-flags,settings-flags,security-headers,game-registry,seats,route-generation,tutorial}.ts' \
    --coverage.include='src/ui/{board-a11y,pointer-hygiene}.ts'
```

Coldest preferred non-rules helpers by branch % (post-r17 residual view):

```text
  1 dom-security.ts             90.90% (20/22)    ← mutation w15
  2 tutorial.ts                 93.29% (167/179)  ← documented unreachable
  3 board-a11y.ts               94.47% (154/163)  ← #986 / 522
  4 storage/storage.ts          94.28% branch     ← r18 primary (createProfile ??)
  5 polyomino/placement.ts      96.39% (107/111)  ← r8/r11 documented
  6 expressions/evaluator.ts    96.40% (161/167)  ← r9 documented
  7 graph/algorithms.ts         97.69% (127/130)  ← r17 spies; L110/131/184 → 524
  8 dice-ui.ts                  98.27% (57/58)    ← #920
  9 sanitize.ts                 98.61%            ← #504
  # fraction-bar-ui 99.10%; dice-selector / transform / pointer-hygiene / attributes / alignment 100%
```

## Round-18 disposition

| Module / arm                                                       | Disposition                | How                                               |
| ------------------------------------------------------------------ | -------------------------- | ------------------------------------------------- |
| `storage` createProfile non-string → `?? ''` (L188–191)            | **Pinned**                 | Cast non-string name/avatar through public API    |
| `storage` getTodayString / getYesterdayString `?? ''` (L291/L297)  | **Documented unreachable** | `split('T')[0]` always defined for any string     |
| `tutorial` bottom placement + live target smoke                    | **Pinned**                 | Structural; disjoint from r15–r17 cases           |
| `tutorial` L383 / L700 / L725–726 ?? / L758 / L937 / private nulls | **Documented unreachable** | Carry-forward from r13–r17                        |
| `graph/algorithms` L110 / L131 / L184                              | **Deferred**               | Soft-fail char owned by `q-mp-524` — no new spies |
| `polyomino/transform`                                              | **Deferred**               | Soft-fail char owned by `q-mp-525`                |
| `evaluator` buildExpression([]) / paren early                      | **Documented unreachable** | Carry-forward from r9                             |
| `placement` reason\|\| / rowCells falsy                            | **Documented unreachable** | Carry-forward from r8/r11                         |
| `fraction-bar-ui` interactive `if (seg)` (L407)                    | **Documented unreachable** | Carry-forward from r11                            |
| `attributes/**` / `alignment/**` / migrate `isPlainProgressObject` | **Hot smoke**              | Soft-fail chars left alone                        |
| `dice-selector` / `pointer-hygiene`                                | **Hot smoke**              | Soft-fail → `#981`/`#984`; mutation → `#987`      |
| `board-a11y` / `dice-ui` / `dom-security` / `sanitize`             | **Deferred**               | `#986` / `#920` / `#933` / `#504` ownership       |

## Aggregate (preferred hosts)

Full unit suite excl. AI/bench, tip-native post-r17 (unit-isolated spies included):

| Module           |    Before branch |      After branch | Before line | After line | Δb / Δl            |
| ---------------- | ---------------: | ----------------: | ----------: | ---------: | ------------------ |
| storage/storage  |    94.28% branch | **see after run** |        100% |       100% | createProfile pins |
| tutorial.ts      | 93.29% (167/179) |            93.29% |      98.02% |     98.02% | 0 (smoke)          |
| graph/algorithms | 97.69% (127/130) |            97.69% |      98.82% |     98.82% | 0 (deferred 524)   |
| fraction-bar-ui  |           99.10% |            99.10% |        100% |       100% | 0 (doc)            |
| attributes/      |             100% |              100% |        100% |       100% | 0 (hot)            |
| alignment/       |             100% |              100% |        100% |       100% | 0 (hot)            |
| dice-selector    |             100% |              100% |        100% |       100% | 0 (hot)            |

## Files changed

- `tests/unit/engine-coverage-round-18-burn-1008.test.ts` (new)
- `docs/dev/engine-coverage-round-18.md` (this file)

## Verification

```bash
rg -c 'it\.todo' tests/unit/engine-coverage-round*.test.ts
git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts || true
rg -n 'hard:\s*450' src/games/hex/ai.ts
npx vitest run --project unit-shared tests/unit/engine-coverage-round-18*.test.ts
npx vitest run --project unit-shared tests/unit/engine-coverage-round*.test.ts
npm run verify
npm run test:unit
```

No engine product edits. No lint-ceiling / knip-baseline changes in this PR.

**Next action: fold into tip by the tip owner.**

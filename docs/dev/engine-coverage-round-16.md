# Engine coverage round 16 — post-r15 residual characterization (`q-mp-477`)

Task id: `q-mp-477`

Base: `cursor/mp-tip-post914` @ `753052a6` (remeasured live; post-r15 residual
view overlays unfolded `#935` / `q-mp-456`). **TEST-ONLY** — no `src/` edits.
Draft only; tip owner folds.

## Goal

After unfolded r15 (`#935` / `q-mp-456`) pinned tutorial Next-gate / non-Escape /
missing chrome / ghost ring / bottom→top flip / preferVertical upper-band, add
`engine-coverage-round-16-*.test.ts` for the next-coldest **non-rules** core
helpers — prefer `src/core/tutorial.ts` post-r15 leftovers / `src/core/graph/**`
/ `src/core/alignment/**` / `src/core/attributes/**` / `src/core/fractions/**`
(**not** `*/rules.ts`, **not** scoring; **not** storage — `#909` / `q-mp-420`;
**not** dice-ui — `#920` / `q-mp-432`; **not** attribute-ui soft-fail — `#893` /
`q-mp-403`; **not** dom-security / security-headers — `#933` / `q-mp-457`;
**not** safe-web-storage / feature-flags — `#925` / `q-mp-455`). No AI /
scoring / difficulty / timing / copy / `rules.ts` logic changes. Hex Hard
assert remains **450ms**. Stars & Bars history cap untouched.

## Overlap check

| PR / topic                                   | Action                                                               |
| -------------------------------------------- | -------------------------------------------------------------------- |
| `#935` `q-mp-456` (engine r15)               | Unfolded into post898 — **do not duplicate**; leave open `contained` |
| `#911` `q-mp-428` (engine r14)               | Already on tip — leave open `contained`                              |
| `#899` `q-mp-401` (engine r13)               | Already on tip; leave open `contained`                               |
| `#920` `q-mp-432` (dice-ui/roller)           | Orthogonal — r16 skips `dice-ui` / `roller`                          |
| `#909` `q-mp-420` (storage soft-fail)        | Orthogonal — skip `storage.ts`                                       |
| `#925` `q-mp-455` (safe-web-storage / flags) | Orthogonal — skip                                                    |
| `#933` `q-mp-457` (mutation w15)             | Orthogonal — skip dom-security / security-headers                    |
| `#893` `q-mp-403` (attribute-ui)             | Orthogonal UI residual — skip `attribute-ui.ts`                      |
| Open drafts into `cursor/mp-tip-post914`     | **None** at start — sole engine-coverage round 16 draft              |

## Live tip re-measure (before)

```text
$ git rev-parse HEAD
  753052a6844e80c6264d1d2480deafa5a9e7b59c  (cursor/mp-tip-post914)

$ find tests/unit -name '*.test.ts' | wc -l
  3241

$ git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts
(none)

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  21:  hard: 450,

$ # post-r15 residual view: tip suite + #935 test overlay (not committed here)
$ npm run test:unit -- --project unit-shared --project unit-node \
    --exclude='**/ai-determinism*.test.ts' \
    --exclude='**/ai-worker*.test.ts' \
    --exclude='**/ai-calibration*.test.ts' \
    --exclude='**/ai-move-time*.test.ts' \
    --exclude='**/*bench*.test.ts' \
    --coverage --coverage.reportsDirectory=coverage-engine-r16-baseline \
    --coverage.include='src/core/{alignment,graph,fractions,polyomino,attributes,dice,expressions,storage}/**' \
    --coverage.include='src/core/{dom-security,url-flags,timer-scoring,feature-flags,settings-flags,security-headers,game-registry,seats,route-generation,tutorial}.ts'

Coldest preferred non-rules helpers by branch % (post-r15 residual view):
  1 storage/storage.ts          90.00% (63/70)    ← #909 owns soft-fail
  2 graph/algorithms.ts         90.00% (117/130)  ← r8 documented unreachable
  3 dom-security.ts             90.90% (20/22)    ← mutation w15
  4 tutorial.ts                 92.17% (165/179)  ← r16 primary (post-r15 leftovers)
  5 graph/types.ts              94.11% (32/34)    ← r8 documented unreachable
  6 polyomino/placement.ts      96.39% (107/111)  ← r8/r11 documented
  7 expressions/evaluator.ts    96.40% (161/167)  ← r9 documented
  8 dice-ui.ts                  98.27% (57/58)    ← #920
  9 fraction-bar-ui.ts          99.10% (111/112)  ← r11 L407 doc
  # attributes/** / alignment/* / graph-ui / expression-ui at 100%
```

Tip-native tutorial (without r15 overlay) remains ~87.15% branch after tip-folded
r14; r16 cases are disjoint from `#935` and apply on tip alone.

## Round-16 disposition

| Module / arm                                                        | Disposition                | How                                                       |
| ------------------------------------------------------------------- | -------------------------- | --------------------------------------------------------- |
| `tutorial` contentRect height-only after zero borderBox (L366 \|\|) | **Pinned**                 | FakeRO: width=0, height>0                                 |
| `tutorial` contentRect both-zero no-op (L366 else)                  | **Pinned**                 | FakeRO: width=0, height=0 after empty borderBox           |
| `tutorial` missing borderBoxSize → contentRect width-only           | **Pinned**                 | `borderBoxSize: []` + width>0                             |
| `tutorial` click-cell + `position: 'top'` cue/ring smoke            | **Pinned**                 | Structural; does not claim `buildAvoidRect` cueAbove=true |
| `tutorial` L383 / L700 / L725–726 ?? / L758 / L937 / private nulls  | **Documented unreachable** | Carry-forward from r13–r15                                |
| `graph/algorithms` queue.shift / Map-miss                           | **Documented unreachable** | Carry-forward from r8–r15; no Array/Map spy               |
| `graph/types` hex id / complete index holes                         | **Documented unreachable** | Carry-forward from r8                                     |
| `fraction-bar-ui` interactive `if (seg)` (L407)                     | **Documented unreachable** | Carry-forward from r11                                    |
| `attributes/**` / `alignment/**`                                    | **Hot (100%)**             | Smoke only                                                |
| `storage` / `dice-ui` / `dom-security` / `attribute-ui`             | **Deferred**               | `#909` / `#920` / `#933` / `#893` ownership               |

## Aggregate (preferred hosts)

Full unit suite excl. AI/bench, with `#935` r15 suite overlaid for post-r15 view
(r15 file not committed on this branch):

| Module           |    Before branch |         After branch |      Before line |           After line | Δb / Δl    |
| ---------------- | ---------------: | -------------------: | ---------------: | -------------------: | ---------- |
| tutorial.ts      | 92.17% (165/179) | **93.29%** (167/179) | 98.02% (398/406) | **98.02%** (398/406) | **+2 / 0** |
| graph/algorithms |           90.00% |               90.00% |           94.90% |               94.90% | 0 (doc)    |
| graph/types      |           94.11% |               94.11% |           98.66% |               98.66% | 0 (doc)    |
| fraction-bar-ui  |           99.10% |               99.10% |             100% |                 100% | 0 (doc)    |
| attributes/**    |             100% |                 100% |             100% |                 100% | 0 (hot)    |
| alignment/**     |             100% |                 100% |             100% |                 100% | 0 (hot)    |

## Files changed

- `tests/unit/engine-coverage-round-16-burn-1008.test.ts` (new)
- `docs/dev/engine-coverage-round-16.md` (this file)

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

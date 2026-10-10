# Engine coverage round 14 — post-r13 residual characterization (`q-mp-428`)

Task id: `q-mp-428`

Base: `cursor/mp-tip-post865` @ `7f8a7147`. **TEST-ONLY** — no `src/` edits. Draft
only; tip owner folds.

## Goal

After unfolded r13 (`#899` / `q-mp-401`) pinned tutorial ResizeObserver / chrome /
highlight-ui residuals, add `engine-coverage-round-14-*.test.ts` for the
next-coldest **non-rules** core helpers — prefer `src/core/tutorial.ts`
post-r13 leftovers / `src/core/graph/**` carry-forward / `src/core/fractions/**`
hot + L407 doc (**not** `*/rules.ts`, **not** scoring; **not** storage —
`#909` / `q-mp-420`; **not** attribute-ui — `#893` / `q-mp-403`; **not**
highlight-ui / r13 chrome cases). No AI / scoring / difficulty / timing / copy /
`rules.ts` logic changes. Hex Hard assert remains **450ms**. Stars & Bars
history cap untouched.

## Overlap check

| PR / topic                            | Action                                                                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `#899` `q-mp-401` (engine r13)        | Unfolded — **do not duplicate** ResizeObserver / Escape / Next-gated / forged position / cramped both-short / highlight-ui className |
| `#909` `q-mp-420` (storage soft-fail) | Orthogonal host — r14 skips `storage.ts`                                                                                             |
| `#893` `q-mp-403` (attribute-ui)      | Orthogonal — skip                                                                                                                    |
| `#876` / `#874` (r12 / r11)           | Already on tip; leave open `contained`                                                                                               |
| `#897` (backlog 10d)                  | Inventory only; leave open                                                                                                           |
| Undrafted `q-mp-407` (contiguous)     | Disjoint — skip                                                                                                                      |
| Undrafted `q-mp-432` (dice-ui/roller) | Disjoint — skip                                                                                                                      |

## Live tip re-measure (before)

```text
$ git rev-parse HEAD
  7f8a71471306af2143c6de0b43564d6c146e2719  (cursor/mp-tip-post865)

$ find tests/unit -name '*.test.ts' | wc -l
  3212

$ git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts
(none)

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  21:  hard: 450,

$ # post-r13 residual view: tip suite + #899 test overlay (not committed here)
$ npm run test:unit -- --project unit-shared --project unit-node \
    --exclude='**/ai-determinism*.test.ts' \
    --exclude='**/ai-worker*.test.ts' \
    --exclude='**/ai-calibration*.test.ts' \
    --exclude='**/ai-move-time*.test.ts' \
    --exclude='**/*bench*.test.ts' \
    --coverage --coverage.reportsDirectory=coverage-engine-r14-baseline \
    --coverage.include='src/core/{alignment,graph,fractions,polyomino,attributes,dice,expressions,storage}/**' \
    --coverage.include='src/core/{dom-security,url-flags,timer-scoring,feature-flags,settings-flags,security-headers,game-registry,seats,route-generation,tutorial}.ts'

Coldest preferred non-rules helpers by branch % (post-r13 residual view):
  1 tutorial.ts                 86.03% (154/179)  ← r14 primary (post-r13 leftovers)
  2 graph/algorithms.ts         90.00% (117/130)  ← r8 documented unreachable
  3 storage/storage.ts          90.00% (63/70)    ← #909 owns soft-fail
  4 graph/types.ts              94.11% (32/34)    ← r8 documented unreachable
  5 fraction-bar-ui.ts          99.11% (111/112)  ← r11 L407 doc
  # graph-ui / arithmetic / alignment/* / highlight-ui at 100% (highlight via r13)
```

Tip-native tutorial (without r13 overlay) remains ~76% branch; r14 cases are
disjoint from `#899` and apply on tip alone.

## Round-14 disposition

| Module / arm                                                  | Disposition                | How                                                       |
| ------------------------------------------------------------- | -------------------------- | --------------------------------------------------------- |
| `tutorial` non-HTMLElement `activeElement` (L97)              | **Pinned**                 | Focus SVG before `start`                                  |
| `tutorial` missing highlight target (L644)                    | **Pinned**                 | Selector with no DOM node → `clearHighlight`              |
| `tutorial` no-highlight → `positionTooltipCenter` (L876 `??`) | **Pinned**                 | Step omits `highlightSelector`                            |
| `tutorial` `preferVerticalSide` → `'top'` (L793)              | **Pinned**                 | Lower target + tall tip; left forces vertical             |
| `tutorial` top→bottom flip (L752–760)                         | **Pinned**                 | Top placement overlaps → flip band                        |
| `tutorial` click-cell avoid-rect cueBelow (L701)              | **Pinned**                 | `requiredAction: click-cell`                              |
| `tutorial` L383 / L700 / private null guards                  | **Documented unreachable** | Carry-forward from r13 + detached-tooltip private returns |
| `graph/algorithms` queue.shift / Map-miss                     | **Documented unreachable** | Carry-forward from r8–r13; no Array/Map spy               |
| `graph/types` hex id / complete index holes                   | **Documented unreachable** | Carry-forward from r8                                     |
| `fraction-bar-ui` interactive `if (seg)` (L407)               | **Documented unreachable** | Carry-forward from r11                                    |
| `storage` / `attribute-ui` / `highlight-ui`                   | **Deferred**               | `#909` / `#893` / `#899` ownership                        |

## Aggregate (preferred hosts)

Full unit suite excl. AI/bench, with `#899` r13 suite overlaid for post-r13 view
(r13 file not committed on this branch):

| Module           |    Before branch |         After branch |      Before line |           After line | Δb / Δl |
| ---------------- | ---------------: | -------------------: | ---------------: | -------------------: | ------- |
| tutorial.ts      | 86.03% (154/179) | **87.15%** (156/179) | 97.78% (397/406) | **98.03%** (398/406) | +2 / +1 |
| graph/algorithms |           90.00% |               90.00% |           94.90% |               94.90% | 0 (doc) |
| graph/types      |           94.11% |               94.11% |           98.66% |               98.66% | 0 (doc) |
| fraction-bar-ui  |           99.11% |               99.11% |             100% |                 100% | 0 (doc) |

## Files changed

- `tests/unit/engine-coverage-round-14-burn-1008.test.ts` (new)
- `docs/dev/engine-coverage-round-14.md` (this file)

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

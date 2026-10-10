# Engine coverage round 13 — post-r12 residual characterization (`q-mp-401`)

Task id: `q-mp-401`

Base: `cursor/mp-tip-post865` @ `3908809d`. **TEST-ONLY** — no `src/` edits. Draft
only; tip owner folds.

## Goal

After round 12 characterized residual `attributes` / `dice` (+ tutorial
`exitTutorialIfActive` leftover), add `engine-coverage-round-13-*.test.ts` for the
next-coldest **non-rules** core helpers — prefer `src/core/tutorial.ts` edges /
`src/core/alignment/highlight-ui` leftovers / `src/core/graph/**` carry-forward
docs (**not** `*/rules.ts`, **not** scoring logic; **not** `contiguous.ts` —
undrafted `q-mp-407`; **not** `grid-alignment.ts` — open `#858` / `q-mp-374`).
No AI / scoring / difficulty / timing / copy / `rules.ts` logic changes. Hex Hard
assert remains **450ms**. Stars & Bars history cap untouched.

## Overlap check

| PR / topic                               | Action                                                               |
| ---------------------------------------- | -------------------------------------------------------------------- |
| Open drafts into `cursor/mp-tip-post865` | **None** at start                                                    |
| `#876` `q-mp-372` (engine r12)           | Already on tip (r12 test+doc present); leave open `contained` by tip |
| `#874` `q-mp-349` (engine r11)           | Already on tip; leave open `contained`                               |
| `#858` `q-mp-374` (grid-alignment edges) | Orthogonal host; r13 skips `grid-alignment.ts`                       |
| `#877` / `#878` (owl void / hex UI r25)  | Orthogonal series; leave open                                        |
| `#879` (backlog 10c)                     | Inventory only; leave open                                           |
| Undrafted `q-mp-407` (contiguous edges)  | Disjoint — r13 skips `contiguous.ts`                                 |
| Undrafted `q-mp-403` (attribute-ui char) | Orthogonal (UI residual after r12)                                   |

## Live tip re-measure (before)

```text
$ git rev-parse HEAD
  3908809d672ed70eede7b9c0ad63a6fa475e28e5  (cursor/mp-tip-post865)

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
    --coverage --coverage.reportsDirectory=coverage-engine-r13-baseline \
    --coverage.include='src/core/alignment/**' \
    --coverage.include='src/core/graph/**' \
    --coverage.include='src/core/tutorial.ts'

Coldest preferred non-rules helpers by branch % (post865 / post-r12 tip):
  1 tutorial.ts                 75.97% (136/179)  ← r13 primary
  2 graph/algorithms.ts         90.00% (117/130)  ← r8 documented unreachable
  3 graph/types.ts              94.11% (32/34)    ← r8 documented unreachable
  4 alignment/highlight-ui.ts   95.12% (39/41)    ← className ?? '' arms
  # alignment/{compat,contiguous,grid-alignment} + graph-ui at 100%
```

## Round-13 disposition

| Module / arm                                                 | Disposition                | How                                                      |
| ------------------------------------------------------------ | -------------------------- | -------------------------------------------------------- |
| `tutorial` ResizeObserver empty / borderBox / contentRect    | **Pinned**                 | Fake `ResizeObserver` entry matrix                       |
| `tutorial` leftover overlay restart + detached focus restore | **Pinned**                 | Double-`start`; remove trigger before `exit`             |
| `tutorial` Next click under `requiredAction`                 | **Pinned**                 | Click disabled Next; step unchanged                      |
| `tutorial` Escape exit                                       | **Pinned**                 | `keydown` Escape while active                            |
| `tutorial` highlight + `position: 'center'`                  | **Pinned**                 | Live target + center arm in `positionTooltip`            |
| `tutorial` forged non-union `position` default               | **Pinned**                 | `'diagonal'` forge → switch default                      |
| `tutorial` cramped left → preferVerticalSide fallback        | **Pinned**                 | Tiny viewport + large tip box                            |
| `tutorial` `buildAvoidRect` cueAbove=true (L700)             | **Documented unreachable** | Sole call site hardcodes `cueAbove=false`                |
| `tutorial` keydown `!isActive` (L383)                        | **Documented unreachable** | Listener removed in `removeOverlay` before inactive idle |
| `highlight-ui` `className ?? ''` (L216, L280)                | **Pinned**                 | Style without `className`                                |
| `graph/algorithms` queue.shift / Map-miss                    | **Documented unreachable** | Carry-forward from r8; no Array/Map spy                  |
| `graph/types` hex id / complete index holes                  | **Documented unreachable** | Carry-forward from r8                                    |
| `contiguous` / `grid-alignment`                              | **Deferred**               | `#858` / undrafted `407` ownership                       |

## Aggregate (preferred hosts)

| Module           |    Before branch |         After branch |      Before line |           After line | Δb / Δl   |
| ---------------- | ---------------: | -------------------: | ---------------: | -------------------: | --------- |
| tutorial.ts      | 75.97% (136/179) | **86.03%** (154/179) | 91.62% (372/406) | **97.78%** (397/406) | +18 / +25 |
| highlight-ui.ts  |   95.12% (39/41) |     **100%** (41/41) |     100% (74/74) |                 100% | +2 / 0    |
| graph/algorithms | 90.00% (117/130) |               90.00% |           94.90% |               94.90% | 0 (doc)   |
| graph/types      |   94.11% (32/34) |               94.11% |           98.66% |               98.66% | 0 (doc)   |

## Files changed

- `tests/unit/engine-coverage-round-13-burn-1008.test.ts` (new)
- `docs/dev/engine-coverage-round-13.md` (this file)

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

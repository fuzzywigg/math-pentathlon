# UI coverage round 7 (`q-mp-149`)

Characterization tests for the next lowest-covered **non-AI, non-`rules.ts`**
modules after rounds 5–6 (already on tip), stacked on tip
`cursor/mp-tip-post477` @ `655e64a9`. Prioritizes game-controller
**destroy/remount** residuals (3D fail / context-lost / paint-after-destroy /
generation-bump cancels).

**Base:** `cursor/mp-tip-post477`. Draft only — tip owner folds.

## Scope

Included: kwatro-sinko / kings-quadraphages / juggle / pent-em-in / hex-a-gone /
fiar / star-track / sum-dominoes / stars-bars / par-55 / ramrod controller
destroy/remount shells; owl-component coast edge clamp. Also exercised
(sub-1 pp): prime-gold, remainder-islands, fraction-pinball, calla, contig-60.

Excluded: game `rules.ts` / `ai.ts`, heavy `*-board-3d.ts` product edits,
tutorials / help/status **copy** assertions, AI move-choice / timing asserts
(Hex Hard 450ms untouched), modules owned by open #667 (engine todo arms) and
#668 (mutation UI wave 4).

## Overlap with open drafts

| Draft | Action |
|-------|--------|
| #648 UI cov r6 | Already folded into tip — residuals only; did not edit r6 suites |
| #667 engine cov r4 | Orthogonal (engine `it.todo` arms) — not edited |
| #668 mutation UI wave 4 | Orthogonal (game-selector / compat / tutorial) — not edited |
| #647 destroy/remount contract | Did not duplicate contract suite; deeper residual characterization only |

## Per-file before → after

Measured with `npm run test:unit:coverage` on tip `655e64a9` (before) and this
branch (after).

| File | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
|------|-------------:|----------------:|------------:|---------------:|-------------:|----------------:|
| `src/games/fiar/game-controller.ts` | 85.40% | 75.69% | 93.79% | 85.41% | +8.39 | +9.72 |
| `src/games/kings-quadraphages/game-controller.ts` | 76.78% | 71.29% | 83.33% | 76.85% | +6.55 | +5.56 |
| `src/games/star-track/game-controller.ts` | 86.61% | 80.00% | 92.12% | 83.75% | +5.51 | +3.75 |
| `src/games/hex-a-gone/game-controller.ts` | 84.53% | 74.28% | 88.95% | 78.09% | +4.42 | +3.81 |
| `src/games/pent-em-in/game-controller.ts` | 81.40% | 68.33% | 84.92% | 70.00% | +3.52 | +1.67 |
| `src/games/kwatro-sinko/game-controller.ts` | 75.00% | 70.39% | 78.26% | 73.02% | +3.26 | +2.63 |
| `src/ui/owl/owl-component.ts` | 90.67% | 73.15% | 92.92% | 75.83% | +2.25 | +2.68 |
| `src/games/stars-bars/game-controller.ts` | 83.70% | 75.94% | 85.18% | 81.01% | +1.48 | +5.07 |
| `src/games/par-55/game-controller.ts` | 85.81% | 75.94% | 87.16% | 81.01% | +1.35 | +5.07 |
| `src/games/ramrod/game-controller.ts` | 90.54% | 79.74% | 91.89% | 84.81% | +1.35 | +5.07 |
| `src/games/juggle/game-controller.ts` | 79.57% | 70.54% | 80.00% | 71.91% | +0.43 | +1.37 |
| `src/games/sum-dominoes/game-controller.ts` | 86.53% | 78.65% | 87.17% | 79.77% | +0.64 | +1.12 |

**12 files show ≥1 pp lines or branches gains** (acceptance: 8+).

Also exercised (sub-1 pp / 0Δ): prime-gold, remainder-islands, fraction-pinball,
calla, contig-60.

## Overall (repo-wide unit coverage)

| Metric | Before (tip) | After | Δ |
|--------|-------------:|------:|--:|
| **Lines** | **93.86%** (21925/23358) | **94.24%** (22014/23358) | **+0.38 pp** |
| **Branches** | **86.37%** (10743/12438) | **86.88%** (10807/12438) | **+0.51 pp** |
| Statements | 93.49% | 93.85% | +0.36 pp |
| Functions | 94.17% | 94.55% | +0.38 pp |

## Tests added

- `tests/unit/burn-1009-ui-cov-r7-kwatro-kings.test.ts`
- `tests/unit/burn-1009-ui-cov-r7-juggle-pent.test.ts`
- `tests/unit/burn-1009-ui-cov-r7-3d-shells.test.ts`
- `tests/unit/burn-1009-ui-cov-r7-shells-owl.test.ts`

## Verification

```text
npx vitest run --project unit-shared tests/unit/burn-1009-ui-cov-r7-*.test.ts
# Test Files  4 passed; Tests  27 passed

npm run test:unit
# (see PR / CI)

npm run test:unit:coverage
# exit 0; metrics above
# Repo-wide lines 93.86%→94.24%, branches 86.37%→86.88%
```

## Constraints honored

- No non-test product `src/` edits (established test hooks only: `__setStateForTests`, DEV destroy paths)
- No `ai/` or rules/engine behavior changes
- Deterministic (fake timers / stubbed 3D loaders / stubbed canvas; no real network)
- No player-facing copy assertions (structural selectors / phase only)
- Hex Hard 450ms assert untouched
- No AI move-choice asserts (mocked / flushed without choice checks)

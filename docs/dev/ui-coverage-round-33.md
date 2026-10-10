# UI coverage round 33 (`q-mp-427`)

Characterization tests for residual arms under `src/games/fiar`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts. Stub the AI client. Hex Hard 450ms
untouched.

**Base:** `cursor/mp-tip-post898` (remeasured; backlog wrote against tip
post865). Draft only — tip owner folds.

## Scope

Included: AI-seat `player1` announceTargets omission; null yellow-center
skip; diamond unverified / ellipse verified markers; gameOver empty status +
click noop; occupied placement reject; zero-valid-move select noop (graph
neighbors blocked + re-render); AI schedule abort when winner set before
timer (stubbed client; structure only); `setAIDifficulty` retain;
tutorial `step-changed` ignore + `exit` unsubscribe without HvH restart.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits, `bundle-budgets.json`, eqeqeq HOLD in `fiar/rules.ts`,
layout-reads owned by open `#836` (`q-mp-351`).

## Overlap with open drafts

| Draft                                                           | Action                               |
| --------------------------------------------------------------- | ------------------------------------ |
| #772 fiar UI cov r12 (`q-mp-249`, base post748)                 | Already folded onto tip; leave open  |
| #836 fiar board-3d layout reads (`q-mp-351`, base post785)      | Orthogonal src layout — leave open   |
| #900–#913 tip-post865 unfolded drafts                           | Orthogonal hosts / docs — leave open |
| No open draft into `cursor/mp-tip-post898` owns fiar UI cov r33 | —                                    |

## Per-file / directory before → after

Tip directory stamp from live `docs/dev/coverage-map.md` @ post898:
**94.28% lines / 85.28% branches** (`src/games/fiar`, 10 files).

Focused fiar unit suite (`tests/unit/*fiar*` ± this round; not full-repo
map). Remeasured on tip post898:

| File                                | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ----------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/fiar/board-ui.ts`        |      100.00% |          92.31% |    **100%** |     **96.70%** |         0.00 |       **+4.39** |
| `src/games/fiar/game-controller.ts` |       98.54% |          93.06% |  **98.91%** |     **97.22%** |    **+0.37** |       **+4.16** |
| `src/games/fiar` (directory)        |       93.50% |          83.31% |  **93.60%** |     **84.83%** |    **+0.10** |       **+1.52** |

Residual arms left intentional: board-ui short-path filter (`:157`,
`findPaths` only yields ≥ `WIN_LENGTH`); regex `?? '0'` fallbacks
(`:194`/`:195`, unreachable with the `cNrM` capture); controller
`ensureBoard3d` sync early-return (`:87`/`:88`, only called when guards
pass); `bindChipKindPicker` / `renderStatus` null-container returns
(`:187`/`:188`/`:205`/`:206`, dead via `render()` guard); context-lost
without `boardContainer` (`:107`).

Focused directory still includes colder `ai.ts` / `ai-client.ts` /
`board-3d-loader.ts` residuals (out of scope for this UI round).

## Tests added

- `tests/unit/burn-1010-ui-cov-r33-fiar.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r33-fiar.test.ts
# Test Files  1 passed; Tests  6 passed; EXIT 0

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run verify
# EXIT 0 (lint → lint:ratchet → format:check → typecheck →
#         typecheck:ratchet → check:boundaries)

npm run test:unit
# Test Files  3223 passed; Tests  12884 passed | 38 skipped; EXIT 0
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard / product `src/` edits
- Deterministic (fake timers / stubbed AI client; no network)
- No player-facing copy body asserts (classes / roles / phase / state /
  `aria-*` / dataset)
- No lint-ceiling / knip baseline / bundle-budget edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

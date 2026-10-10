# UI coverage round 43 (`q-mp-481`)

Characterization tests for residual arms under `src/games/juggle`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts. Stub AI / rules arms for structure only.
Hex Hard 450ms untouched.

**Base:** `cursor/mp-tip-post914` (remeasured; backlog wrote against tip
post898 @ `788b4558`). Draft only — tip owner folds.

## Scope

Included: board-ui delegated click/keydown/hover non-finite `dataset` coord
guards; sync/shell missing seat board; detached roll listener AI-seat
`fromAI≠true` guard; die listener wrong-phase; forced-cursor cell click
wrong-player / wrong-phase / AI-seat returns; hover wrong-phase + AI-seat;
controller sync with missing `.juggle-board.player2`; stubbed AI place that
keeps AI seat (continue-roll schedule, structure only); `makeAIMove`
winner early-return after armed timer; `__placeSelectedForTests`
empty-orientation false + `!canRotate` skip / `canFlip` loop arms; tutorial
`step-changed` ignore + `exit` unsubscribe without HvH restart.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits, lint-ceiling / knip / bundle-budget JSON.

## Overlap with open drafts

| Draft                                                             | Action                                 |
| ----------------------------------------------------------------- | -------------------------------------- |
| #777 juggle UI cov r14 (`q-mp-269`, base post748)                 | Prior round — leave open (`contained`) |
| #744 juggle UI cov r10 (`q-mp-222`, base post728)                 | Prior round — leave open (`contained`) |
| #745 mutation UI wave 6 (juggle board-ui)                         | Orthogonal separate file — leave open  |
| #935 engine cov r15 (`q-mp-456`, base post898)                    | Orthogonal engine series — leave open  |
| No open draft into `cursor/mp-tip-post914` owns juggle UI cov r43 | —                                      |

## Per-file / directory before → after

Focused juggle unit suite (`tests/unit/*juggle*` ± this round; not
full-repo map). Remeasured on tip post914 @ `753052a6`:

| File                                  | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/juggle/board-ui.ts`        |         100% |          98.26% |    **100%** |       **100%** |         0.00 |       **+1.74** |
| `src/games/juggle/game-controller.ts` |       92.94% |          86.48% |  **97.92%** |     **95.94%** |    **+4.98** |       **+9.46** |
| `src/games/juggle` (directory)        |       96.94% |          92.09% |  **98.41%** |     **95.01%** |    **+1.47** |       **+2.92** |

Residual arms left intentional: `updateStatus` when `statusContainer` null
(`:222` — destroy clears both containers together); exhaustive `default`
phase (`:268`–`:270`, unreachable with typed phase); missing `.player1`
board sync false arm (`:193`, suite drops p2); `placing && selectedShape`
false after AI shape path (`:438`); `spots[0]` hole after non-empty
(`:578`–`:579`); `import.meta.env.DEV` false (`:601`). Focused directory
still includes colder `ai.ts` / `rules.ts` residuals (out of scope).

## Tests added

- `tests/unit/burn-1010-ui-cov-r43-juggle.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r43-juggle.test.ts
# Test Files  1 passed; Tests  7 passed; EXIT 0

npx vitest run --project unit-shared --coverage tests/unit/*juggle*
# directory lines 96.94% → 98.41%; branches 92.09% → 95.01%

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run verify
# EXIT 0 (lint → lint:ratchet → format:check → typecheck →
#         typecheck:ratchet → check:boundaries)

npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard / product `src/` edits
- Deterministic (fake timers / stubbed AI + rules place/roll; no network)
- No player-facing copy body asserts (classes / roles / phase / state /
  `aria-*` / dataset)
- No lint-ceiling / knip baseline / bundle-budget edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

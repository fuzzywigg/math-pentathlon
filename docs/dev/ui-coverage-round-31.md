# UI coverage round 31 (`q-mp-425`)

Characterization tests for residual arms under `src/games/stars-bars`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts. No Stars & Bars history cap.

**Base:** `cursor/mp-tip-post898` @ `946d6f95` (remeasured; backlog wrote
against tip post865). Draft only — tip owner folds.

## Scope

Included: valid placement without `selectedCard` (preview-title skip);
sparse-board empty-path hole continue; empty move-history mount; post-destroy
paint drop; `startTutorial` without mount; tie banner (`winner: null` +
`gameOver`); placing-card status after human select; player2 hand activate;
`newGameVsHuman` export; tutorial `exit` + `complete` remount; `newGame`
difficulty retain when diff omitted; stubbed AI null-seat early return;
empty-hand pass chrome structure.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / `ai.ts` / scoring edits, player-facing copy body
asserts, product `src/` edits, Stars & Bars history cap.

## Overlap with open drafts

| Draft                                                     | Action                                                      |
| --------------------------------------------------------- | ----------------------------------------------------------- |
| #808 stars-bars UI cov r17 (`q-mp-296`, base post755)     | Prior round already on tip; residual-only here — leave open |
| #895 sum-dominoes UI cov r30                              | Orthogonal host — leave open                                |
| #900–#913 tip-post865 drafts                              | Orthogonal / not stars-bars UI r31                          |
| No open draft into `cursor/mp-tip-post898` owns this host | —                                                           |

## Per-file / directory before → after

Focused stars-bars unit suite (existing `*stars*` / r17 suites ± this
round’s suite; not full-repo map). Remeasured on tip post898:

| File                                      | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ----------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/stars-bars/board-ui.ts`        |       99.45% |           97.4% |      99.45% |      **98.7%** |         0.00 |        **+1.3** |
| `src/games/stars-bars/game-controller.ts` |       91.24% |          81.01% |    **100%** |      **96.2%** |    **+8.76** |      **+15.19** |
| `src/games/stars-bars` (directory)        |       97.27% |          92.43% |  **99.45%** |     **96.71%** |    **+2.18** |       **+4.28** |

Residual arms left intentional: board-ui `calculatePreviewScore` undefined-cell
return (`:572`) — renderBoard continues before preview when the cell is
missing; a few compound V8 branches under controller (`newGame` `diff ||`,
placing status else-if, tutorial completed guard).

Focused directory still includes colder `ai.ts` residuals (out of scope for
this UI round; no AI move-choice / timing asserts).

## Tests added

- `tests/unit/burn-1010-ui-cov-r31-stars-bars.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r31-stars-bars.test.ts
# Test Files  1 passed; Tests  5 passed; EXIT 0

npm run verify
# EXIT 0 (lint → lint:ratchet → format:check → typecheck →
#         typecheck:ratchet → check:boundaries)

npm run test:unit
# (report after full suite)

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard / history-cap changes
- Deterministic (fake timers / stubbed `getAIMove`; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline / bundle-budget edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

# UI coverage round 55 (`q-mp-582`)

Characterization tests for residual arms under `src/games/kwatro-sinko`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts; no aria/label string pins. Stub AI / 3D
loaders only. Kwatro AI drift stays on Andrew's return list — AI stubbed for
controller soft-miss wiring only.

**Base:** `cursor/mp-tip-post1012` (remeasured; backlog stamp “post977 / 0
dedicated ui-cov files / board-ui **565** LOC / controller **648** LOC” —
LOC still holds; tip already has r7/r13/r15 + overnight/burn kwatro hosts,
so dedicated `*ui-cov*kwatro*` basename count is **3** before this PR, not
0). Draft only — tip owner folds.

## Scope

Included: board-ui `allowInput: false` chrome + `renderChipInfo` seat hosts;
controller `newGame` HvH + difficulty-keep; selectingDest / gameOver-without-
winner status arms; 2D + 3D clear/pass computer-turn click guards; 3D
mount-time create callbacks; handleChip/Node computer-turn soft-miss;
makeAIMove wrong-seat + stale-controller soft-miss (AI stubbed); winner
without `winningAlignment` 3D chrome; tutorial step-changed + exited;
context-lost after `activeController` cleared; `whenBoard3dReady`
post-destroy `Promise.resolve`.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
aria/label string pins, product `src/` edits, board-3d layout product edits,
tutorial-string / copy pins, ratchet JSON. Leave prior kwatro/UI tickets
open (**contained** — no comments).

## Overlap with open drafts

| Draft                                                            | Action                                            |
| ---------------------------------------------------------------- | ------------------------------------------------- |
| `#1024`–`#1034` into `cursor/mp-tip-post1012` (orthogonal hosts) | Leave open — none own kwatro-sinko UI cov r55     |
| Prior r7/r13/r15 kwatro ui-cov (tip-folded)                      | Orthogonal leftovers closed here — leave open N/A |
| No open draft into `cursor/mp-tip-post1012` owns kwatro UI r55   | —                                                 |

## Spec staleness

Backlog stamp (“**0** dedicated ui-cov files for kwatro-sinko; board-ui
**565** LOC; controller **648** LOC”) — LOC still holds on post1012; tip
already has r7/r13/r15 `*ui-cov*kwatro*` basenames (**3** before this PR).
Live remeasure before this PR (focused `tests/unit/*kwatro*` under
`unit-shared`):

| File                                        | Lines            | Branches        |
| ------------------------------------------- | ---------------- | --------------- |
| `src/games/kwatro-sinko/board-ui.ts`        | 100% (149/149)   | 100% (70/70)    |
| `src/games/kwatro-sinko/game-controller.ts` | 94.94% (263/277) | 87.5% (133/152) |

## Per-file / directory before → after

Focused kwatro board-ui + controller suite (`tests/unit/*kwatro*` under
`unit-shared`). Remeasured on tip `cursor/mp-tip-post1012`:

| File                                        |     Before lines | Before branches |          After lines |       After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------------- | ---------------: | --------------: | -------------------: | -------------------: | -----------: | --------------: |
| `src/games/kwatro-sinko/board-ui.ts`        |             100% |            100% |             **100%** |             **100%** |            0 |               0 |
| `src/games/kwatro-sinko/game-controller.ts` | 94.94% (263/277) | 87.5% (133/152) | **99.63%** (276/277) | **98.68%** (150/152) |    **+4.69** |      **+11.18** |
| focused board-ui + controller               |          ~96.71% |         ~91.44% |          **~99.76%** |          **~98.65%** |   **~+3.05** |      **~+7.21** |

Residual arms left intentional: controller `ensureBoard3d` early-return when
`board3d` already mounted / host disabled (`:116`) — unreachable without
double-invoking the private loader after a successful mount; a few else-if /
ternary branch locations without a mapped public path. No move-choice
asserts. Hex Hard `hard: 450` untouched.

## Tests added

- `tests/unit/burn-1010-ui-cov-r55-kwatro-sinko.test.ts` (7 tests)

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r55-kwatro-sinko.test.ts
# Test Files  1 passed; Tests  7 passed; EXIT 0

npx vitest run --project unit-shared tests/unit/*kwatro*
# (see PR body)

npm run test:unit:coverage
# (focused host set documented above)

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard / product `src/` edits
- No aria/label string pins; no player-facing copy body asserts
- Deterministic (fake timers / stubbed AI / stubbed 3D; no network)
- No lint-ceiling / knip / ratchet JSON edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

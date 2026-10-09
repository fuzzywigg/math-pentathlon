# UI coverage round 18 (`q-mp-322`)

Characterization tests for residual arms under `src/games/prime-gold`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts. Hex Hard 450ms untouched.

**Base:** `cursor/mp-tip-post755` @ `2887ab91`. Draft only — tip owner folds.

## Scope

Included: owner+prime cell classes; `allowInput: false` board lock; Enter /
Space activate on valid cell / expression; dice pending vs rolled faces;
expressions thinking + empty-valids arms; history sparse-hole continue;
human roll→place→pass; winner + tie banners; vsAI null-placement pass +
stubbed place (structure only); mid-timer gameOver early return;
computer-turn roll/place/pass guards; seat-flip mid-timer no-op;
`startTutorial` without `activeContainer`; tutorial completed remount;
`getGameState` / `isUsingBoard3d` / `whenBoard3dReady`; `newGame` difficulty
without `#app`.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / `ai.ts` / scoring edits, player-facing copy body
asserts, product `src/` edits, board-3d WebGL mount paths (owned by mp3d
suites / layout batch `q-mp-329`).

## Overlap with open drafts

| Draft                                              | Action                                  |
| -------------------------------------------------- | --------------------------------------- |
| #795 / #808 / #813 three / stars-bars / owl UI cov | Orthogonal hosts — leave open           |
| #812 backlog `q-mp-322`                            | Spec source; this PR implements         |
| #814 mutation audit UI wave 9                      | Orthogonal (attribute/fraction/dice)    |
| Prior tip overnight/burn prime render suites       | Residual-only; did not edit those files |

## Per-file / directory before → after

Focused prime-gold unit suite (existing `*prime*` secondary/controller/
overnight render suites ± this round’s suite; not full-repo map):

| File                                      | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ----------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/prime-gold/board-ui.ts`        |       99.27% |          95.74% |    **100%** |     **97.87%** |    **+0.73** |       **+2.13** |
| `src/games/prime-gold/game-controller.ts` |        59.9% |          47.65% |  **76.32%** |      **66.4%** |   **+16.42** |      **+18.75** |
| `src/games/prime-gold` (directory)        |       77.62% |          65.08% |  **83.17%** |     **71.61%** |    **+5.55** |       **+6.53** |

Acceptance (≥+2 pp directory lines on focused suite, or documented focused
gains) **met** via directory **+5.55 pp** lines.

## Tests added

- `tests/unit/burn-1009-ui-cov-r18-prime-gold.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1009-ui-cov-r18-prime-gold.test.ts
# Test Files  1 passed; Tests  7 passed; EXIT 0

npm run lint
npm run typecheck
npm run lint:ratchet
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard product changes
- Deterministic (fake timers / stubbed `getAIPlacement`; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline edits (tests-only task)
- Did **not** register a new file in `vitest.config.ts` (shared project default)

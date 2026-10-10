# UI coverage round 32 (`q-mp-426`)

Characterization tests for residual arms under `src/games/pent-em-in`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts; no placement / legal-move asserts.
Hex Hard 450ms untouched.

**Base:** `cursor/mp-tip-post898` (remeasured; backlog wrote against tip
post865). Draft only — tip owner folds.

## Scope

Included: unknown shapeId skip in placed-pieces + piece selector;
`getPlayerName` seats; inject idempotence; `allowInput:false` cursor/preview
suppress; selected option chrome; place-phase rotate/flip/cancel + X
cancel-only; hover preview / same-cell / null-null / wrong-phase arms;
stale human handlers under computer seat; piece-select phase guard;
stubbed AI winner/wrong-player/null-move/consult arms (structure only);
`clearAiTimer` via `newGameVsHuman` during think; post-destroy paint drop +
stale hover; tutorial `complete` → remount; board-3d ensure mid-load race;
3D human preview + computer-seat handler guards; context-lost SVG fallback;
DEV `__mpPentEmInController` surface.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring / legal-move asserts, player-facing copy
body asserts, product `src/` edits. Layout batch stays with open `#838`
(`q-mp-330`). Board-3D host deep paths remain with `mp3d-pent-em-in-*`
(`unit-isolated`).

## Overlap with open drafts

| Draft                                                     | Action                          |
| --------------------------------------------------------- | ------------------------------- |
| #838 pent-em-in board-3d layout reads (`q-mp-330`)        | Orthogonal product — leave open |
| #589 webgl lifecycle pent+star (`q-mp-031`)               | Orthogonal — leave open         |
| #895–#892 UI cov r30/r29/r28 (other hosts)                | Orthogonal hosts — leave open   |
| #900–#913 still-unfolded into post865                     | None owns pent-em-in UI cov r32 |
| No open draft into `cursor/mp-tip-post898` owns this host | —                               |

## Per-file / directory before → after

Focused pent-em-in unit-shared suite (prior overnight/burn/controller hosts
± this round’s suite; excludes `mp3d-*` `unit-isolated`). Remeasured on tip
post898:

| File                                      | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ----------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/pent-em-in/board-ui.ts`        |       98.82% |          95.65% |    **100%** |       **100%** |    **+1.18** |       **+4.35** |
| `src/games/pent-em-in/game-controller.ts` |        80.4% |          63.33% |  **98.99%** |     **94.16%** |   **+18.59** |      **+30.83** |
| `src/games/pent-em-in` (directory)        |       88.16% |          73.79% |  **95.05%** |     **86.41%** |    **+6.89** |      **+12.62** |

Residual arms left intentional: `ensureBoard3d` early-return when
`board3d` already set (`:81`); `renderStatusAndControls` when
`statusContainer` null (`:163` — destroy clears both containers together).
Focused directory still includes colder `ai.ts` / `rules.ts` residuals
(out of scope for this UI round). `board-3d-loader.ts` real import remains
covered by `burn-1008-ui-cov-r3-tablet-gl-loaders` (mocked away in this
suite).

## Tests added

- `tests/unit/burn-1010-ui-cov-r32-pent-em-in.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r32-pent-em-in.test.ts
# Test Files  1 passed; Tests  6 passed; EXIT 0

rg -n 'hard:\s*450' src/games/hex/ai.ts
# hard: 450, (untouched)

npm run verify
# EXIT 0 (lint → lint:ratchet → format:check → typecheck →
#         typecheck:ratchet → check:boundaries)

npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard / placement-assert changes; zero `src/` edits
- Deterministic (fake timers / stubbed AI; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline / bundle-budget edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

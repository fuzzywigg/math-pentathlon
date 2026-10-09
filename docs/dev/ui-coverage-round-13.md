# UI coverage round 13 (`q-mp-250`)

Characterization tests for residual arms under `src/games/kwatro-sinko`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts.

**Base:** `cursor/mp-tip-post748` @ `23926935`. Draft only — tip owner folds.

## Scope

Included: board-ui Enter/Space activate + chip click stopPropagation; winning
gold fill + history list cap; controller chip→dest click wiring; clear/pass
control clicks; winner/`winningAlignment` chrome (2D + 3D); `newGame` reset;
vsAI input guard + AI pass when blocked (seat/phase only); 3D update
callbacks (select / deselect / move / occupied-node→chip); 3D mount race
discard; `startTutorial` no-container + completed remount; gameOver AI
timer no-op + stacked AI timer guard.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits, radix HOLD in kwatro `ai.ts`/`rules.ts`.

## Overlap with open drafts

| Draft                                     | Action                                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------ |
| #745 mutation UI wave 6 (kwatro board-ui) | Orthogonal separate file — did not edit `mutation-ui6-kwatro-board-ui.test.ts` |
| #754 void board-ui                        | Orthogonal (lint brace hygiene) — not edited                                   |
| #727 nullish owl-messages                 | HELD — not touched                                                             |
| Prior UI cov r7 kwatro destroy/remount    | Already on tip; r13 is residual-only                                           |

## Per-file before → after

Tip directory stamp from live `docs/dev/coverage-map.md` @ `23926935`:
**91.96% lines / 85.56% branches** (`src/games/kwatro-sinko`).

Focused kwatro unit suite (all `*kwatro*` tests ± this round’s suite; not
full-repo map):

| File                                        | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/kwatro-sinko/board-ui.ts`        |       98.63% |            100% |    **100%** |           100% |    **+1.37** |               0 |
| `src/games/kwatro-sinko/game-controller.ts` |       71.84% |          62.50% |  **94.22%** |     **84.21%** |   **+22.38** |      **+21.71** |

Acceptance (documented focused gains on board-ui / controller) **met**.

## Tests added

- `tests/unit/burn-1009-ui-cov-r13-kwatro.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1009-ui-cov-r13-kwatro.test.ts
# Test Files  1 passed; Tests  10 passed; EXIT 0

npm run lint
npm run typecheck
npm run verify
npm run lint:ratchet
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes
- Deterministic (fake timers / stubbed 3D; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline edits (tests-only task)

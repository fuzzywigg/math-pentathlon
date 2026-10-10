# UI coverage round 28 (`q-mp-398`)

Characterization tests for residual arms under `src/games/kings-quadraphages`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts.

**Base:** `cursor/mp-tip-post865` (remeasured; backlog evidence of “only 6
dedicated kings unit files” was stale vs tip post830 — live tip already has
broad overnight/burn kings suites; this round targets remaining board-ui /
controller residuals). Draft only — tip owner folds.

## Scope

Included: `handleCellClick` OOB row / empty-supply settle / unknown-phase
fallthrough; `renderBoard` sync holes + interaction guards + remount reuse;
status tie / AI chrome; history `moveKing` missing-`from` arm; AI-seat
announce suppression; controller mode getters/setters; motion invalid-click
class lifecycle; stubbed `getAIMove` null + generation bump (structure only);
game-over owl draw + `game-over-active` button; tutorial click + completed
restart; mid-load 3D abort; AI-thinking / computer-seat click guards.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits. Layout-reads stay with open `#834`.

## Overlap with open drafts

| Draft                                                            | Action                             |
| ---------------------------------------------------------------- | ---------------------------------- |
| `#834` kings board-3d layout reads (`q-mp-331`)                  | Orthogonal src layout — leave open |
| `#878` hex UI cov r25 (`q-mp-371`)                               | Orthogonal host — leave open       |
| `#877` owl void brace (`q-mp-366`)                               | Orthogonal lint — leave open       |
| `#870`/`#868`/`#867` UI cov r26/r23/r22                          | Orthogonal hosts — leave open      |
| `#876`/`#874` engine cov r12/r11                                 | Orthogonal series — leave open     |
| No open draft into `cursor/mp-tip-post865` owns kings UI cov r28 | —                                  |

## Per-file / directory before → after

Focused kings board-ui + controller suite (prior overnight/burn/controller
tests ± this round’s suite; not full-repo map):

| File                                              | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/kings-quadraphages/board-ui.ts`        |       94.85% |          88.65% |  **99.53%** |     **95.74%** |    **+4.68** |       **+7.09** |
| `src/games/kings-quadraphages/game-controller.ts` |       80.54% |          72.32% |  **93.51%** |     **86.60%** |   **+12.97** |      **+14.28** |
| focused board-ui + controller                     |       88.22% |          81.42% |  **96.74%** |     **91.69%** |    **+8.52** |      **+10.27** |

Residual branches/lines left intentional: board-ui short-cell continue
(`:343`, remount rebuilds on count mismatch); controller AI-timer gen-bump
arms after delay (`:271`/`:297`) and `!aiPlayer` / re-entrant thinking
guards (`:250`/`:261`) — require non-exported / uncleared-timer paths; no
move-choice asserts.

## Tests added

- `tests/unit/burn-1010-ui-cov-r28-kings.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r28-kings.test.ts
# Test Files  1 passed; Tests  7 passed; EXIT 0

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard / product `src/` edits
- Deterministic (fake timers / stubbed AI; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline edits (tests-only task)
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

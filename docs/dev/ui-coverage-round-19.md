# UI coverage round 19 (`q-mp-323`)

Characterization tests for residual arms under `src/games/calla`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts.

**Base:** `cursor/mp-tip-post755`. Draft only — tip owner folds.

## Scope

Included: sparse pit `continue` arms; p2 valid click + Enter activate;
locked `onPitClick` (no valid highlights); last-move chrome class; 1-cube
aria + >6 no-dot arm; hvAI winner / tie status chrome (class only); score
active seat; `destroyGame` clear + double-destroy; sync chrome without
`#app`; AI null + empty exported valids → `settleNoValidMoves` soft-lock
arm (stubbed settle return; structure only); chained free-turn
`isGameOver` early return on `triggerAITurn`.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits. Defensive `handlePitClick` thinking/gameOver guards
and `triggerAITurn` wrong-seat return remain (no public `__setState`).

## Overlap with open drafts

| Draft                      | Action                                  |
| -------------------------- | --------------------------------------- |
| #808 stars-bars UI cov r17 | Orthogonal host — leave open            |
| #813 owl UI cov r16        | Orthogonal host — leave open            |
| #795 three UI cov r15      | Orthogonal host — leave open            |
| #796–#814 other tip drafts | No calla board-ui/controller UI cov r19 |

## Per-file / directory before → after

Focused calla unit suite (all `*calla*` tests ± this round’s suite; not
full-repo map):

| File                                 | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------ | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/calla/board-ui.ts`        |       98.55% |          91.42% |    **100%** |       **100%** |    **+1.45** |       **+8.58** |
| `src/games/calla/game-controller.ts` |       84.21% |          76.78% |  **97.36%** |      **87.5%** |   **+13.15** |      **+10.72** |
| `src/games/calla` (directory)        |       95.02% |          89.46% |  **97.73%** |     **92.88%** |    **+2.71** |       **+3.42** |

Acceptance (measured coverage gain on focused suite) **met** via directory
**+2.71 pp** lines.

## Tests added

- `tests/unit/burn-1009-ui-cov-r19-calla.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1009-ui-cov-r19-calla.test.ts
# Test Files  1 passed; Tests  5 passed; EXIT 0

npm run lint
npm run typecheck
npm run lint:ratchet
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes
- Deterministic (fake timers / stubbed AI + settle; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline edits (tests-only task)
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

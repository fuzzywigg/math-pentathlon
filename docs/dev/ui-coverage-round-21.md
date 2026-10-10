# UI coverage round 21 (`q-mp-348`)

Characterization tests for residual arms under `src/games/par-55`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts.

**Base:** `cursor/mp-tip-post785`. Draft only — tip owner folds.

## Scope

Included: delegated SVG base click + keyboard activate; syncBoard early
return / missing-group continue / blockHost remove / hit+keys; default
shape cast arm; hand activate; last-move aria extras; score-preview chrome;
controller hand/base clicks; clear/pass chrome (class only); pass on empty
hand; winner banner presence; defensive empty status phase; newGame reset;
syncChrome board reinsert (insertBefore + appendChild); post-destroy paint
drop; startTutorial without mount; computer-turn input guards; fillChrome
`status-ai-thinking`; stubbed AI null→pass and non-null execute (structure
only).

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits. `par-55/rules.ts` no-shadow HOLD left alone.

## Overlap with open drafts

| Draft                      | Action                                   |
| -------------------------- | ---------------------------------------- |
| #813 owl UI cov r16        | Orthogonal host (post755) — leave open   |
| #822 no-shadow controllers | Orthogonal (lint renames) — leave open   |
| #795 three UI cov r15      | Orthogonal host — leave open             |
| #832 mutation UI wave 10   | Orthogonal hosts — leave open            |
| #833 engine cov r10        | Orthogonal series — leave open           |
| Other post785 tip drafts   | No par-55 board-ui/controller UI cov r21 |

## Per-file / directory before → after

Focused par-55 unit suite (prior UI/handshake/controller tests ± this
round’s suite; not full-repo map):

| File                                    | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| --------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/par-55/board-ui.ts`          |       93.16% |          80.12% |    **100%** |     **93.58%** |    **+6.84** |      **+13.46** |
| `src/games/par-55/game-controller.ts`   |       76.92% |          72.07% |    **100%** |     **95.49%** |   **+23.08** |      **+23.42** |
| `src/games/par-55` (directory, focused) |       84.57% |          67.58% |  **93.35%** |     **78.16%** |    **+8.78** |      **+10.58** |

Focused directory still includes colder `ai.ts` / `rules.ts` residuals
(out of scope for this UI round). Coverage-map tip stamp had directory
lines **93.88%** under the full unit suite; this round documents focused
UI residual gain (no AI/rules product asserts).

## Tests added

- `tests/unit/burn-1010-ui-cov-r21-par-55.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r21-par-55.test.ts
# Test Files  1 passed; Tests  6 passed; EXIT 0

npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes
- Deterministic (fake timers / stubbed AI; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline edits (tests-only task)
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

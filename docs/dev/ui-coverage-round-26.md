# UI coverage round 26 (`q-mp-380`)

Characterization tests for residual arms under `src/games/frac-fact`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts.

**Base:** `cursor/mp-tip-post830`. Draft only — tip owner folds.

## Scope

Included: `renderProblem` empty-problem chrome; inject idempotence; choices
phase-gate + default `allowInput` click wiring; result early-return /
feedback class; scores active seat + progress fill; game-over draw banner
presence; post-destroy paint no-op; stale choice/continue handler guards;
`scheduleAiTurn` coalesce; `isAITurn` stub computer-turn click guard;
stubbed `getAIAnswer` null + non-null auto-continue (structure only);
`aiTurn` phase/problem early returns; `setDifficulty` gate; tutorial
start/exit lifecycle.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits. `frac-fact/rules.ts` default-case HOLD left to
undrafted `q-mp-246`.

## Overlap with open drafts

| Draft                                                                | Action                        |
| -------------------------------------------------------------------- | ----------------------------- |
| #852 queens-guards AI harness (`q-mp-359`)                           | Orthogonal — leave open       |
| #853 CI permissions pin (`q-mp-363`)                                 | Orthogonal docs — leave open  |
| #854 bundle headroom (`q-mp-361`)                                    | Orthogonal docs — leave open  |
| #845 / #848 UI cov r20/r21 (post785)                                 | Orthogonal hosts — leave open |
| No open draft into `cursor/mp-tip-post830` owns frac-fact UI cov r26 | —                             |

## Per-file / directory before → after

Focused frac-fact unit suite (prior overnight/burn/controller tests ± this
round’s suite; not full-repo map):

| File                                                         | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------------------------------ | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/frac-fact/board-ui.ts`                            |       98.64% |          95.00% |    **100%** |     **97.50%** |    **+1.36** |       **+2.50** |
| `src/games/frac-fact/game-controller.ts`                     |       90.65% |          76.59% |    **100%** |     **97.87%** |    **+9.35** |      **+21.28** |
| `src/games/frac-fact` (board-ui+controller+tutorial focused) |       95.31% |          85.05% |    **100%** |     **97.70%** |    **+4.69** |      **+12.65** |

Residual branches left intentional: board-ui progress-fill non-HTMLElement arm (`:304`); controller tutorial listener non-complete/exit event arm (`:252`).

Focused directory still includes colder `ai.ts` / `rules.ts` residuals
(out of scope for this UI round).

## Tests added

- `tests/unit/burn-1010-ui-cov-r26-frac-fact.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r26-frac-fact.test.ts
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

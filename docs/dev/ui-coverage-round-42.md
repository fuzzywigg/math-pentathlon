# UI coverage round 42 (`q-mp-471`)

Characterization tests for residual arms under `src/games/calla`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts. Stub the AI. Hex Hard 450ms untouched.

**Base:** `cursor/mp-tip-post914` (remeasured; backlog wrote against tip
post898 — board-ui already **100%** lines/branches on post914; residual
gain is controller UI gates). Draft only — tip owner folds.

## Scope

Included: p1 sparse pit hole + last-sown + Enter/Space activate; locked
`aria-disabled`; status chrome (hvH phase / thinking / winners) without
copy pins; `isGameOver` click gate after handlers attach; `isAIThinking`
click gate via captured `renderBoard` handler (stubbed AI); `triggerAITurn`
wrong-seat guard on free-turn re-entry (stubbed AI; state mutate only);
owl non-tie end notify; destroy → reset null-container render arms;
tutorial `exit` unsubscribe without practice restart.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits, `bundle-budgets.json`. Leave open `#817` (`q-mp-323`
UI cov r19, base post755; already on tip) — do not comment/close.

## Overlap with open drafts

| Draft                                                              | Action                                      |
| ------------------------------------------------------------------ | ------------------------------------------- |
| `#817` UI cov r19 calla (base post755; already folded onto tip)    | Prior round — leave open (`contained`)      |
| `#935` engine cov r15 into post898                                 | Orthogonal series — leave open              |
| No open draft into `cursor/mp-tip-post914` owns calla UI cov r42   | —                                           |

## Per-file / directory before → after

Focused calla unit suite (`tests/unit/*calla*`; not full-repo map).
Remeasured on tip post914:

| File                                 | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------ | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/calla/board-ui.ts`        |       100.00 |          100.00 |    **100%** |       **100%** |         0.00 |            0.00 |
| `src/games/calla/game-controller.ts` |        97.36 |           87.50 |  **100.00** |     **98.21** |    **+2.64** |      **+10.71** |
| `src/games/calla` (directory)        |        97.73 |           92.87 |   **98.18** |     **94.58** |    **+0.45** |       **+1.71** |

Residual arms left intentional: controller binary-expr OR arm at `:134`
(`currentPlayer === 'player2'` right-hand of free-turn trigger guard) is
dead once the preceding `currentPlayer === 'player2'` conjunct holds.
Focused directory still includes colder `ai.ts` residuals (out of scope
for this UI round).

## Tests added

- `tests/unit/burn-1010-ui-cov-r42-calla.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r42-calla.test.ts
# Test Files  1 passed; Tests  7 passed; EXIT 0

npx vitest run --project unit-shared --coverage tests/unit/*calla*
# (coverage gain documented above)

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run check:copy-pins
# report-only EXIT 0 (no new findings from this round)

npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard / product `src/` edits
- Deterministic (fake timers / stubbed AI; no network)
- No player-facing copy body asserts (classes / roles / phase / state /
  `aria-*` / dataset)
- No lint-ceiling / knip baseline / bundle-budget edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

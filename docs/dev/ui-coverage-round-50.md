# UI coverage round 50 (`q-mp-519`)

Characterization tests for residual arms under `src/games/sum-dominoes`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts. Stub AI only.

**Base:** `cursor/mp-tip-post949` @ `18ee1c96` (remeasured; backlog “tip
post914 / only 1 ui-cov file” restamped — live tip still has r30 + broad
overnight/burn sum suites; this round owns remaining branch residuals). Draft
only — tip owner folds.

## Scope

Included: ghost `selectedDomino` miss arm (no valid-cell paint); selected
hand `aria-pressed` structural pin; stubbed AI placing + `getAIMove` null
(keeps placing / hand / passCount); placing without dice (AI arm skips
consult); tutorial `step-changed` soft-miss on `completed||exited` listener;
live-seat human place + pass wiring; bare-root `syncOpponentChrome` skip +
destroy clear.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits, `bundle-budgets.json`, AI-path file edits. Leave open
`#895`/`400` r30 + `#967`/`488` bundle table (**contained** — no comments).

## Overlap with open drafts

| Draft                                                                   | Action                                     |
| ----------------------------------------------------------------------- | ------------------------------------------ |
| `#895` sum-dominoes UI cov r30 (`q-mp-400`; older tip)                  | Prior round — leave open (`contained`)     |
| `#967` bundle headroom (sum-dominoes −77 B)                             | Orthogonal docs — leave open (`contained`) |
| `#978`–`#988` tip post949 wave (void / docs / soft-fail / mut / engine) | Orthogonal hosts — leave open              |
| No open draft into `cursor/mp-tip-post949` owns sum-dominoes UI cov r50 | —                                          |

## Spec staleness

Backlog stamp (“Only **1** dedicated ui-cov file; board-ui **639** LOC;
sum-dominoes headroom **−77 B**”) still holds for dedicated `*ui-cov*sum*`
basename count before this PR. Live tip already has many overnight/burn
controller suites; lines were already **100%** on the full UI host set —
round 50 targets remaining **branch** residuals.

## Per-file / directory before → after

Focused sum-dominoes board-ui + controller suite (prior overnight/burn/r30
hosts ± this round’s suite; not full-repo map). Remeasured on tip post949:

| File                                        | Before lines |  Before branches | After lines |     After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------------- | -----------: | ---------------: | ----------: | -----------------: | -----------: | --------------: |
| `src/games/sum-dominoes/board-ui.ts`        |         100% |   98.11% (52/53) |    **100%** |   **100%** (53/53) |            0 |       **+1.89** |
| `src/games/sum-dominoes/game-controller.ts` |         100% |   96.63% (86/89) |    **100%** |   **100%** (89/89) |            0 |       **+3.37** |
| focused board-ui + controller               |         100% | 97.18% (138/142) |    **100%** | **100%** (142/142) |            0 |       **+2.82** |

Residual arms left intentional: controller stub `update`/`newGame`
placeholders before assignment (`:109`/`:110`) — unreachable without product
changes. No move-choice asserts. Hex Hard `hard: 450` untouched.

## Tests added

- `tests/unit/burn-1010-ui-cov-r50-sum-dominoes.test.ts` (6 tests)

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r50-sum-dominoes.test.ts
# Test Files  1 passed; Tests  6 passed; EXIT 0

npx vitest run --project unit-shared tests/unit/*sum-dominoes*
# (see PR body)

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run check:copy-pins
npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard / product `src/` edits
- Deterministic (fake timers / stubbed AI; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline / bundle-budget edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

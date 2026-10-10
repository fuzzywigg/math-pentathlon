# UI coverage round 57 (`q-mp-584`)

Characterization tests for residual arms under `src/games/stars-bars`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts; no aria/label string pins. Stub AI only.
No Stars & Bars history cap.

**Base:** `cursor/mp-tip-post1012` @ `3f9c3e4e` (remeasured; backlog wrote
against tip post977 / r31 stamps). Draft only — tip owner folds.

## Scope

Included: `newGame(false)` aiPlayer ternary `: null` (controller L122);
status fallthrough when phase is outside selecting/placing/gameOver
(L166 else); tutorial listener else on `step-changed` (L375); placingCard
human status / selected-card / clear-btn chrome regression.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / `ai.ts` / scoring edits, player-facing copy body
asserts, aria/label string pins, product `src/` edits, Stars & Bars history
cap, board-ui `calculatePreviewScore` undefined-cell return (L572 —
unreachable via public `renderBoard`, which continues before preview).

## Overlap with open drafts

| Draft                                                              | Action                                              |
| ------------------------------------------------------------------ | --------------------------------------------------- |
| `#1030`–`#1034` into `cursor/mp-tip-post1012` (orthogonal hosts)   | Leave open — none own stars-bars UI cov r57         |
| Prior `#808`/`296` r17 + `#915`/`425` r31 (older tips)             | Already on tip / residual-only here — leave open (**contained**) |
| No open draft into `cursor/mp-tip-post1012` owns stars-bars UI r57 | —                                                   |

## Spec staleness

Backlog stamp (“Last dedicated ui-cov **r31**; board-ui **746** LOC;
controller **399** LOC; only **6** dedicated unit-file matches”) — LOC still
holds on tip post1012; dedicated `*stars-bars*` / `*ui-cov*stars-bars*` unit
hosts already include r17 + r31 + rules/ai/wave35. This round targets the
three remaining controller branch arms left intentional after r31.

## Per-file / directory before → after

Focused stars-bars board-ui + controller suite (existing `*stars-bars*` /
r17 / r31 / wave35 ± this round’s suite; not full-repo map). Remeasured on
tip post1012 @ `3f9c3e4e`:

| File                                      |     Before lines | Before branches | After lines |   After branches | Δ lines (pp) | Δ branches (pp) |
| ----------------------------------------- | ---------------: | --------------: | ----------: | ---------------: | -----------: | --------------: |
| `src/games/stars-bars/board-ui.ts`        | 99.45% (181/182) |  98.70% (76/77) | 99.45% (181/182) | 98.70% (76/77) |         0.00 |            0.00 |
| `src/games/stars-bars/game-controller.ts` |      **100%** (137/137) |  96.20% (76/79) | **100%** (137/137) | **100%** (79/79) |         0.00 |       **+3.80** |

Residual arms left intentional: board-ui `calculatePreviewScore` undefined-cell
return (`:572`) — `renderBoard` continues before preview when the cell is
missing; controller placeholder `update`/`newGame` no-ops at init (`:110–111`)
replaced synchronously before return. Focused directory still includes colder
`ai.ts` / `rules.ts` / `types.ts` residuals (out of scope for this UI round).

## Tests added

- `tests/unit/burn-1010-ui-cov-r57-stars-bars.test.ts` (4 tests)

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r57-stars-bars.test.ts
# Test Files  1 passed; Tests  4 passed; EXIT 0

npx vitest run --project unit-shared tests/unit/*stars-bars*
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
- No AI / rules / copy / Hex Hard / history-cap / product `src/` edits
- No aria/label string pins; no player-facing copy body asserts
- Deterministic (fake timers / stubbed `getAIMove`; no network)
- No lint-ceiling / knip / ratchet JSON edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

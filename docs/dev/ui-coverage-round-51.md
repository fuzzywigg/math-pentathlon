# UI coverage round 51 (`q-mp-520`)

Characterization tests for residual arms under `src/games/frac-fact`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts. Stub AI only.

**Base:** `cursor/mp-tip-post949` @ `18ee1c96` (remeasured; backlog “tip
post914 / only 1 dedicated ui-cov file / 12 unit-name matches” is stale —
live tip already has broad overnight/burn/r26 frac suites; this round closes
remaining board-ui + controller residual arms). Draft only — tip owner folds.

## Scope

Included: `renderScores` progress-fill `instanceof` false arm (board-ui
L304); `clearResultTimer` true arm while AI `resultTimer` pending
(controller L55–57) via `destroyGame` and `newGameVsHuman`; tutorial
`step-changed` soft-miss on the outer `completed||exited` compound (L252)
plus exit / complete lifecycle (structure only).

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits, tutorial-string / copy pins, ratchet JSON.

## Overlap with open drafts

| Draft                                                         | Action                                     |
| ------------------------------------------------------------- | ------------------------------------------ |
| `#978`–`#988` into `cursor/mp-tip-post949` (orthogonal hosts) | Leave open — none own frac-fact UI cov r51 |
| Prior `#870` / `q-mp-380` r26                                 | Prior round — leave open (**contained**)   |
| No open draft into post949 owns frac-fact UI cov r51          | —                                          |

## Spec staleness

Backlog stamp (“Only **1** dedicated ui-cov file; board-ui **737** LOC;
controller **266** LOC; **12** unit-name matches”) — LOC still holds; unit
file count is stale (many overnight/burn frac hosts already on tip). Live
remeasure before this PR:

| File                                     | Lines            | Branches       |
| ---------------------------------------- | ---------------- | -------------- |
| `src/games/frac-fact/board-ui.ts`        | 100%             | 97.5% (39/40)  |
| `src/games/frac-fact/game-controller.ts` | 98.13% (105/107) | 95.74% (45/47) |

## Per-file / directory before → after

Focused frac-fact board-ui + controller suite (prior overnight/burn/r26 hosts
± this round’s suite; not full-repo map). Remeasured on tip post949:

| File                                     |     Before lines | Before branches | After lines |   After branches | Δ lines (pp) | Δ branches (pp) |
| ---------------------------------------- | ---------------: | --------------: | ----------: | ---------------: | -----------: | --------------: |
| `src/games/frac-fact/board-ui.ts`        |             100% |   97.5% (39/40) |    **100%** | **100%** (40/40) |            0 |        **+2.5** |
| `src/games/frac-fact/game-controller.ts` | 98.13% (105/107) |  95.74% (45/47) |    **100%** | **100%** (47/47) |    **+1.87** |       **+4.26** |
| focused board-ui + controller            |           ~99.2% |          ~96.6% |    **100%** |         **100%** |    **~+0.8** |       **~+3.4** |

No intentional UI residuals left on board-ui / controller. Colder
`ai.ts` / `rules.ts` branch residuals remain out of scope for this UI round.

## Tests added

- `tests/unit/burn-1010-ui-cov-r51-frac-fact.test.ts` (4 tests)

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r51-frac-fact.test.ts
# Test Files  1 passed; Tests  4 passed; EXIT 0

npx vitest run --project unit-shared --coverage \
  tests/unit/*frac-fact* tests/unit/*frac*
# board-ui + game-controller → 100% lines / 100% branches

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run check:copy-pins
npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes
- Deterministic (fake timers / stubbed AI; no network)
- No player-facing copy body asserts (classes / phase / state fields)
- No lint-ceiling / knip / ratchet JSON edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

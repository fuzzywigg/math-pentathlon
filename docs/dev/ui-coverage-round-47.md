# UI coverage round 47 (`q-mp-502`)

Characterization tests for residual arms under `src/games/kings-quadraphages`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts. Stub AI only.

**Base:** `cursor/mp-tip-post914` @ `e43a25d2` (remeasured; backlog “only 6
dedicated kings unit files” is stale — live tip already has broad
overnight/burn/r15/r28 kings suites; this round targets remaining
controller AI-execute + board-ui residual arms). Draft only — tip owner folds.

## Scope

Included: unknown piece sync arm; game-over missing loser-king (no
`cell-trapped`); status HvH/HvAI winner chrome without copy pins; stubbed AI
full move path (think → king → place → settle); gen-bump during place delay;
`syncModeChrome` without `#app`; reduced-motion invalid-click skip; destroy →
null `boardContainer` invalid arm; captured-handler AI-thinking click gate;
tutorial `handleAction` / `requiredAction` / `exited` arms; 3D update path +
owl non-draw winner; AI-first seat stubbed turn.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits. Leave open `#890`/`398` r28 (already on tip) — do not
comment/close.

## Overlap with open drafts

| Draft                                                            | Action                                 |
| ---------------------------------------------------------------- | -------------------------------------- |
| `#890` kings UI cov r28 (`q-mp-398`; already on tip)             | Prior round — leave open (`contained`) |
| `#952`/`#948`/`#953`/`#951` UI cov r41–r43 (other hosts)         | Orthogonal hosts — leave open          |
| `#955` backlog 10g (`q-mp-090p`)                                 | Docs-only backlog — leave open         |
| No open draft into `cursor/mp-tip-post914` owns kings UI cov r47 | —                                      |

## Per-file / directory before → after

Focused kings board-ui + controller suite (prior overnight/burn/r28 hosts ±
this round’s suite; not full-repo map). Remeasured on tip post914:

| File                                              | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/kings-quadraphages/board-ui.ts`        |       99.53% |          95.74% |  **99.53%** |     **97.16%** |        +0.00 |       **+1.42** |
| `src/games/kings-quadraphages/game-controller.ts` |       87.02% |          83.03% |  **96.75%** |     **91.07%** |    **+9.73** |       **+8.04** |
| focused board-ui + controller                     |       93.73% |          90.11% |  **98.24%** |     **94.46%** |    **+4.51** |       **+4.35** |

Residual arms left intentional: board-ui short-cell continue (`:343`,
`ensureKingsBoard` remounts on count mismatch); controller `ensureBoard3d`
already-mounted early return (`:73`); `checkAndTriggerAITurn` gameOver /
re-entrant thinking / `!aiPlayer` guards (`:247`/`:250`/`:261`); AI gen-bump
after delay (`:271`/`:297`) — `newGame`/`destroyGame` clear the timer so the
post-await gen check is unreachable without product changes. No move-choice
asserts.

## Tests added

- `tests/unit/burn-1010-ui-cov-r47-kings.test.ts` (9 tests)

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r47-kings.test.ts
# Test Files  1 passed; Tests  9 passed; EXIT 0

npx vitest run --project unit-shared tests/unit/*kings*
# (coverage gain documented above)

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run check:copy-pins
npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard / product `src/` edits
- Deterministic (fake timers / stubbed AI / stubbed 3D; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline / bundle-budget edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

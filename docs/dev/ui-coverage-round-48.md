# UI coverage round 48 (`q-mp-517`)

Characterization tests for residual arms under `src/games/par-55`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts. Stub AI only. Do not edit `par-55/ai.ts`
/ `rules.ts`.

**Base:** `cursor/mp-tip-post949` @ `18ee1c96` (remeasured; backlog “only 1
dedicated ui-cov file” still matches live tip — `burn-1010-ui-cov-r21-par-55`;
board-ui **758** LOC / controller **514** LOC). Draft only — tip owner folds.

## Scope

Included: delegated click with empty `data-base-id`; bare-polygon sync
fallback (no `.par55-base-pent`); orphan `selectedBlock` score-preview skip
(render + sync); stubbed zero-point preview skip; keyboard activate id-falsy
arms (render + sync-first bind); shape arms + empty size/thickness label
fallback; hand keyboard activate; scores / history chrome (classes only);
sync `blockKey` rewrite + hit add/remove; `newGame(true)` AI-seat ternary;
tie banner; syncChrome without status / mainLayout; tutorial `exited` +
`completed` remount; `makeAIMove` `!aiPlayer` guard; history
insert-before-controls.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits. Intentional residuals: `seats ?? getPlayerSeatColors()`
(`board-ui` `:543` — `renderBlock` always receives seats when `placedBy` set;
private helper); `updateUI` else-if when `canReuseBoard` but board missing
(`:378` — logically unreachable); tutorial outer-listener else (`:490`).

## Overlap with open drafts

| Draft                                                             | Action                                                                             |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `#848` par-55 UI cov r21 (`q-mp-348`; already on tip as r21 file) | Prior round — leave open (`contained`; no comment per worker prompt)               |
| `#978`–`#988` into `cursor/mp-tip-post949`                        | Orthogonal hosts (idle-warm / docs / dice / a11y / mutation / engine) — leave open |
| No open draft into `cursor/mp-tip-post949` owns par-55 UI cov r48 | —                                                                                  |

## Per-file / directory before → after

Focused par-55 UI suite (`burn-1010-ui-cov-r21` + `par-55-ai-input-guard` ±
this round; not full-repo map). Remeasured on tip post949 @ `18ee1c96`:

| File                                  | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/par-55/board-ui.ts`        |         100% |          94.23% |    **100%** |     **99.35%** |            0 |       **+5.12** |
| `src/games/par-55/game-controller.ts` |         100% |          93.69% |    **100%** |     **98.19%** |            0 |       **+4.50** |
| focused board-ui + controller         |         100% |          94.00% |    **100%** |     **98.87%** |            0 |       **+4.87** |

Acceptance (measured coverage gain on focused suite) **met** via board-ui
**+5.12 pp** branches / controller **+4.50 pp** branches (lines already at
100% on tip). Dedicated ui-cov files: **1 → 2** (`r21` + this `r48`).

## Tests added

- `tests/unit/burn-1010-ui-cov-r48-par-55.test.ts` (9 tests)

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r48-par-55.test.ts
# Test Files  1 passed; Tests  9 passed; EXIT 0

npx vitest run --project unit-shared tests/unit/*par-55*
# Test Files  11 passed; Tests  82 passed; EXIT 0

npx vitest run --project unit-shared --coverage \
  tests/unit/burn-1010-ui-cov-r21-par-55.test.ts \
  tests/unit/par-55-ai-input-guard.test.ts \
  tests/unit/burn-1010-ui-cov-r48-par-55.test.ts
# board-ui 100% lines / 99.35% branches; controller 100% / 98.19%

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
- No lint-ceiling / knip baseline / bundle-budget edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)
- Zero `src/` edits

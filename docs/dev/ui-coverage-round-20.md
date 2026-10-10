# UI coverage round 20 (`q-mp-347`)

Characterization tests for residual arms under `src/games/remainder-islands`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts.

**Base:** `cursor/mp-tip-post785`. Draft only — tip owner folds.

## Scope

Included: `renderGameOver` winner / draw chrome; dice placeholder vs result;
scores active seat; empty `renderDivisionPreview` unknown-island arm; style
inject idempotence; `syncBoard` missing-group continue, chip add/remove, hit
clone refresh, mouseleave unbind, invalid selected sync, interactive drop;
selection visual `polygon` fallback after stripped `island-hex`; controller
hover preview create / replace / remove; controls-missing preview append;
`destroyGame` render no-op; status `insertBefore` dice; controls
`board.before` rebuild; stubbed `selectIsland` → gameOver chrome; click/hover
phase + invalid-id guards; AI timer null choice + stale gameOver early
return; tutorial start / complete / exit lifecycle; bare mount without `#app`.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits, AI-path file edits.

## Overlap with open drafts

| Draft                         | Action                                       |
| ----------------------------- | -------------------------------------------- |
| #813 owl UI cov r16           | Orthogonal host — leave open                 |
| #808 stars-bars UI cov r17    | Orthogonal host — leave open                 |
| #816 prime-gold UI cov r18    | Orthogonal host — leave open                 |
| #817 calla UI cov r19         | Orthogonal host — leave open                 |
| #822 no-shadow controllers    | No remainder-islands UI cov                  |
| #825–#833 post785 tip drafts  | No remainder-islands board-ui/controller r20 |

## Per-file / directory before → after

Focused remainder unit suite (all `*remainder*` tests ± this round’s suite;
not full-repo map):

| File                                             | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------------------ | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/remainder-islands/board-ui.ts`        |       92.23% |          79.06% |  **99.67%** |     **93.79%** |    **+7.44** |      **+14.73** |
| `src/games/remainder-islands/game-controller.ts` |       84.26% |          70.17% |  **94.41%** |     **85.96%** |   **+10.15** |      **+15.79** |
| `src/games/remainder-islands` (directory)        |       90.52% |          80.61% |  **97.31%** |     **91.01%** |    **+6.79** |      **+10.40** |

Acceptance (measured coverage gain on focused suite) **met** via directory
**+6.79 pp** lines / **+10.40 pp** branches.

## Tests added

- `tests/unit/burn-1010-ui-cov-r20-remainder-islands.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r20-remainder-islands.test.ts
# Test Files  1 passed; Tests  6 passed; EXIT 0

npx vitest run --coverage --project unit-shared tests/unit/*remainder*
npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes
- Deterministic (fake timers / stubbed AI + select; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline edits (tests-only task)
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

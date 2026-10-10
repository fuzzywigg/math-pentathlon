# UI coverage round 49 (`q-mp-518`)

Characterization tests for residual arms under `src/games/hex-a-gone`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts. Stub the AI client. Hex Hard 450ms
untouched (different game: `src/games/hex`).

**Base:** `cursor/mp-tip-post949` @ `18ee1c96` (remeasured; backlog “tip
post914 / only 1 dedicated ui-cov file” is stale — live tip already has r29
plus burn-wave / mp3d hosts; this round targets remaining board-ui empty-bank

- controller 3D/settle residual arms). Draft only — tip owner folds.

## Scope

Included: empty-bank `.empty` / disabled bank button; forged
`getShapeIcon` exhaustiveness default via placing chrome; filled cell without
matching `placedBlocks` (skip `BLOCK_COLORS` fill); stubbed 3D loader mount /
selection-host paint / `destroyGame` unmount; mid-load destroy →
`ensureBoard3d` post-await early return; create-throw catch; `fallBackTo2dBoard`
callback → SVG restore; loader reject; `whenBoard3dReady` null →
`Promise.resolve`; empty AI `blocks: []` settle path; `#app` chrome +
`setAIDifficulty` wiring.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits. Leave open `#892`/`399` r29 (already on tip) — do not
comment/close.

## Overlap with open drafts

| Draft                                                             | Action                                 |
| ----------------------------------------------------------------- | -------------------------------------- |
| `#892` hex-a-gone UI cov r29 (`q-mp-399`; already on tip)         | Prior round — leave open (`contained`) |
| `#978`–`#988` tip post949 drafts (other hosts / docs / mutation)  | Orthogonal — leave open                |
| No open draft into `cursor/mp-tip-post949` owns hex-a-gone UI r49 | —                                      |

## Per-file / directory before → after

Focused hex-a-gone unit-shared suite (`tests/unit/*hex-a-gone*` under
`unit-shared`; excludes `mp3d-*` `unit-isolated`). Remeasured on tip
`cursor/mp-tip-post949` @ `18ee1c96`:

| File                                      | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ----------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/hex-a-gone/board-ui.ts`        |       98.94% |          94.94% |    **100%** |     **96.96%** |    **+1.06** |       **+2.02** |
| `src/games/hex-a-gone/game-controller.ts` |       82.05% |          75.23% |  **99.48%** |     **96.19%** |   **+17.43** |      **+20.96** |

Residual arms left intentional: board-ui `placeHandler !== undefined`
defensive (`:149`), `.block-icon` / `.placing-shape` instanceof guards
(`:254`/`:339`); controller `ensureBoard3d` already-mounted early return
(`:107`/`:108` — `initGame` always `unmountBoard3d` first); `fallBackTo2dBoard`
with null `board3d` (`:96`); `handleBlockSelect` non-place phase after
selectBlocks (`:209` — bank not wired in `gameOver`); tutorial listener
non-terminal event filter (`:449`). No move-choice asserts.

## Tests added

- `tests/unit/burn-1010-ui-cov-r49-hex-a-gone.test.ts` (6 tests)

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r49-hex-a-gone.test.ts
# Test Files  1 passed; Tests  6 passed; EXIT 0

npx vitest run --project unit-shared --coverage tests/unit/*hex-a-gone*
# board-ui 100% lines / 96.96% branches; controller 99.48% / 96.19%

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run check:copy-pins
npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes; zero `src/` edits
- Deterministic (fake timers / stubbed AI + 3D loader; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline / bundle-budget / ratchet JSON edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

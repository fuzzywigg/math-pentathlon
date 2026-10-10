# UI coverage round 60 (`q-mp-596`)

Characterization tests for residual arms under `src/games/prime-gold`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts; no aria/label string pins. Stub AI / 3D
loaders only.

**Base:** `cursor/mp-tip-post1012` @ `3f9c3e4e` (remeasured; backlog named tip
post977 / ui-cov **r41** — live tip already has dedicated r18/r34/r41 prime-gold
hosts; board-ui **761** LOC / controller **539** LOC still hold). Draft only —
tip owner folds.

## Scope

Included: board-ui owned/valid/history/scores/dice/thinking chrome matrix
(class presence only); context-lost soft-miss when destroy clears
`activeController` mid-handler; captured context-lost handler re-entry after
destroy (null `boardHostEl`); overlapping 3D remount race; `createPrimeGoldBoard3D`
throw → 2D catch; status fall-through for non-painting phase; tutorial
`step-changed` soft-miss; 3D live update with AI-thinking placement lock;
unmocked `board-3d-loader` import smoke.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
aria/label string pins, product `src/` edits, board-3d layout product edits,
ratchet JSON. Leave prior prime-gold tickets + undrafted void `465` open
(**contained** — no comments).

## Overlap with open drafts

| Draft                                                              | Action                                                   |
| ------------------------------------------------------------------ | -------------------------------------------------------- |
| `#1034`–`#1024` into `cursor/mp-tip-post1012` (orthogonal hosts)   | Leave open — none own prime-gold UI cov r60              |
| `#918` / `#816` prior prime-gold UI r34 / r18 (older tips)         | Prior rounds already on tip — leave open (**contained**) |
| `#567` prime-gold WebGL context-lost product (older tip)           | Product — leave open (**contained**)                     |
| No open draft into `cursor/mp-tip-post1012` owns prime-gold UI r60 | —                                                        |

## Spec staleness

Backlog stamp (“last dedicated ui-cov **r41**; board-ui **761** LOC;
controller **539** LOC”) — LOC still holds; tip already has r18/r34/r41 +
overnight/burn/mp3d prime-gold hosts. Live remeasure before this PR (focused
`tests/unit/*prime-gold*`; not full-repo map):

| File                                      |            Lines |         Branches |
| ----------------------------------------- | ---------------: | ---------------: |
| `src/games/prime-gold/board-ui.ts`        |   100% (138/138) |     100% (47/47) |
| `src/games/prime-gold/game-controller.ts` | 98.55% (204/207) | 90.62% (116/128) |
| `src/games/prime-gold/board-3d-loader.ts` |         0% (0/1) |       100% (0/0) |

## Per-file / directory before → after

Focused prime-gold unit suite (`tests/unit/*prime-gold*`). Remeasured on tip
post1012 @ `3f9c3e4e`:

| File                                      |     Before lines |  Before branches |          After lines |       After branches | Δ lines (pp) | Δ branches (pp) |
| ----------------------------------------- | ---------------: | ---------------: | -------------------: | -------------------: | -----------: | --------------: |
| `src/games/prime-gold/board-ui.ts`        |   100% (138/138) |     100% (47/47) |             **100%** |             **100%** |            0 |               0 |
| `src/games/prime-gold/game-controller.ts` | 98.55% (204/207) | 90.62% (116/128) | **98.55%** (204/207) | **93.75%** (120/128) |            0 |       **+3.13** |
| `src/games/prime-gold/board-3d-loader.ts` |         0% (0/1) |       100% (0/0) |       **100%** (1/1) |       **100%** (0/0) |     **+100** |               0 |

Residual arms left intentional: controller `ensureBoard3d` early returns when
already mounted / host missing (`:112`/`:120`/`:134`) — require non-exported
re-entry or host cleared without destroy (same note as r34). `import.meta.env.DEV`
false arms and `makeAIMove` placing-false after rolling are unreachable under
vitest DEV + typed phases. No move-choice asserts. Hex Hard `hard: 450`
untouched.

## Tests added

- `tests/unit/burn-1010-ui-cov-r60-prime-gold.test.ts` (7 tests)

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r60-prime-gold.test.ts
# Test Files  1 passed; Tests  7 passed; EXIT 0

npx vitest run --project unit-shared tests/unit/*prime-gold*
npm run test:unit:coverage
# (focused host set documented above)

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard / product `src/` edits
- No aria/label string pins; no player-facing copy body asserts
- Deterministic (fake timers / stubbed AI / stubbed 3D; no network)
- No lint-ceiling / knip / ratchet JSON edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

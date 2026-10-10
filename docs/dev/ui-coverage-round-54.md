# UI coverage round 54 (`q-mp-567`)

Characterization tests for residual arms under `src/games/star-track`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts; no aria/label string pins. Stub AI / 3D
loaders only.

**Base:** `cursor/mp-tip-post977` @ `e3279882` (remeasured; backlog stamp
“post949 / 0 dedicated ui-cov files / board-ui **461** LOC / controller
**335** LOC” still holds for dedicated `*ui-cov*star-track*` basename count
before this PR — stars-bars ui-cov must not be counted as star-track). Draft
only — tip owner folds.

## Scope

Included: `fillChainArea` gameOver banner (board-ui L295–301); selectChain
`onPreviewChain` pointer/focus arms (L271–281); `allowInput: false` disabled
chain buttons; `renderStatus` winner matrix + AI-thinking chrome (L409–419);
controller `syncOpponentChrome` without `#app`; `setAIDifficulty` /
`resetGame` both modes; tutorial completed/exit + draw/select
`handleAction`; human/AI owl `onGameEnd`; AI-thinking draw no-op; 3D live
`update` + destroy unmount; 3D-captured draw/select guard arms; mid-load
destroy / create throw / fallback → SVG.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
aria/label string pins, product `src/` edits, board-3d layout product edits,
tutorial-string / copy pins, ratchet JSON. Leave prior star-track tickets
open (**contained** — no comments).

## Overlap with open drafts

| Draft                                                              | Action                                              |
| ------------------------------------------------------------------ | --------------------------------------------------- |
| `#1002`–`#1011` into `cursor/mp-tip-post949` (orthogonal hosts)    | Leave open — none own star-track UI cov r54         |
| Prior `#589` / `#807` / `#687` star-track (older tips / 3D layout) | Orthogonal / tip-held — leave open (**contained**)  |
| No open draft into `cursor/mp-tip-post977` owns star-track UI r54  | —                                                   |

## Spec staleness

Backlog stamp (“**0** dedicated ui-cov files for star-track; board-ui **461**
LOC; controller **335** LOC”) — LOC still holds; tip already has
overnight/burn/mp3d/r7 star-track hosts, but **zero** dedicated
`*ui-cov*star-track*` basename before this PR. Live remeasure before this PR
(focused prior hosts ± r7 3d-shells; not full-repo map):

| File                                       | Lines            | Branches       |
| ------------------------------------------ | ---------------- | -------------- |
| `src/games/star-track/board-ui.ts`         | 91.28% (178/195) | 78.69% (48/61) |
| `src/games/star-track/game-controller.ts`  | 82.86% (116/140) | 62.50% (50/80) |

## Per-file / directory before → after

Focused star-track board-ui + controller suite (prior overnight/burn/mp3d/r7
hosts ± this round’s suite; not full-repo map). Remeasured on tip post977:

| File                                      |     Before lines | Before branches | After lines |   After branches | Δ lines (pp) | Δ branches (pp) |
| ----------------------------------------- | ---------------: | --------------: | ----------: | ---------------: | -----------: | --------------: |
| `src/games/star-track/board-ui.ts`        | 91.28% (178/195) |  78.69% (48/61) |    **100%** | **98.36%** (60/61) |    **+8.72** |      **+19.67** |
| `src/games/star-track/game-controller.ts` | 82.86% (116/140) |  62.50% (50/80) | **99.29%** (139/140) | **96.25%** (77/80) |   **+16.43** |      **+33.75** |
| focused board-ui + controller             |           ~87.2% |          ~70.9% |    **~99.7%** |         **~97.2%** |   **~+12.5** |      **~+26.3** |

Residual arms left intentional: controller `ensureBoard3d` early-return when
`board3d` already mounted (`:90`) — unreachable without double-invoking the
private loader; board-ui one uncovered branch location without a mapped line
(v8 `?`). No move-choice asserts. Hex Hard `hard: 450` untouched.

## Tests added

- `tests/unit/burn-1010-ui-cov-r54-star-track.test.ts` (12 tests)

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r54-star-track.test.ts
# Test Files  1 passed; Tests  12 passed; EXIT 0

npx vitest run --project unit-shared tests/unit/*star-track*
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
- No AI / rules / copy / Hex Hard / product `src/` edits
- No aria/label string pins; no player-facing copy body asserts
- Deterministic (fake timers / stubbed AI / stubbed 3D; no network)
- No lint-ceiling / knip / ratchet JSON edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

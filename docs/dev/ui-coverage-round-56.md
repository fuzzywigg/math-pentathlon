# UI coverage round 56 (`q-mp-583`)

Characterization tests for residual arms under `src/games/pent-em-in`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts; no aria/label string pins; no placement /
legal-move asserts. Stub AI / 3D loaders only. Use `rules.ts` only for state
setup.

**Base:** `cursor/mp-tip-post1012` @ `aa049fc2` (remeasured; backlog named
older tip post977 / r32 baseline — tip already has `burn-1010-ui-cov-r32`
plus overnight/burn pent hosts). Draft only — tip owner folds.

## Scope

Included: board-ui OOB preview `continue` + invalid/valid preview fill chrome;
controller selectPiece / null-selected cell-click guards; gameOver-without-
winner status chrome; occupied-cell click keeps place chrome (state fields
only); stubbed AI consult after human place; board-3d create throw → SVG
fallback; tutorial `exited` unsubscribe (no remount).

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
aria/label string pins, product `src/` edits, board-3d layout product edits,
ratchet JSON. Leave prior pent-em-in tickets open (**contained** — no
comments).

## Overlap with open drafts

| Draft                                                              | Action                                                |
| ------------------------------------------------------------------ | ----------------------------------------------------- |
| `#1024`–`#1034` into `cursor/mp-tip-post1012` (orthogonal hosts)   | Leave open — none own pent-em-in UI cov r56           |
| Prior r32 `burn-1010-ui-cov-r32-pent-em-in` (folded into tip)      | Contained baseline — this round closes soft residuals |
| No open draft into `cursor/mp-tip-post1012` owns pent-em-in UI r56 | —                                                     |

## Spec staleness

Backlog stamp (“Last dedicated ui-cov **r32**; board-ui **526** LOC;
controller **483** LOC; only **8** dedicated unit-file matches”) — LOC still
holds on tip `aa049fc2`; dedicated `tests/unit/*pent-em*` basename count was
**8** before this PR (r32 + rules/ai/wave35/mp3d). Live tip already has broad
overnight/burn pent hosts outside the `*pent-em*` verification glob; focused
before/after below uses that glob (spec verification command).

## Per-file / directory before → after

Focused `tests/unit/*pent-em*.test.ts` under `unit-shared` (+ coverage).
Remeasured on tip `cursor/mp-tip-post1012` @ `aa049fc2`:

| File                                      |     Before lines |  Before branches |          After lines |       After branches | Δ lines (pp) | Δ branches (pp) |
| ----------------------------------------- | ---------------: | ---------------: | -------------------: | -------------------: | -----------: | --------------: |
| `src/games/pent-em-in/board-ui.ts`        | 99.41% (169/170) |   95.65% (44/46) |             **100%** |             **100%** |    **+0.59** |       **+4.35** |
| `src/games/pent-em-in/game-controller.ts` | 97.48% (194/199) | 90.00% (108/120) | **98.99%** (197/199) | **94.16%** (113/120) |    **+1.51** |       **+4.16** |
| `src/games/pent-em-in` (directory)        |           94.34% |           84.14% |           **95.58%** |           **87.37%** |    **+1.24** |       **+3.23** |

Residual arms left intentional: `ensureBoard3d` early-return when `board3d`
already set (`:81`); `renderStatusAndControls` when `statusContainer` null
(`:163` — `render()` guards both containers); mid-load `renderBoardOnly` skip
when 3D enabled but not mounted (`:149`); `onBoard3dContextLost` without
`boardContainer` (`:102`); DEV-false `__mpPentEmInController` arm (`:457`).
Focused directory still includes colder `ai.ts` / `rules.ts` residuals (out of
scope for this UI round). No move-choice asserts. Hex Hard `hard: 450`
untouched.

## Tests added

- `tests/unit/burn-1010-ui-cov-r56-pent-em-in.test.ts` (7 tests)

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r56-pent-em-in.test.ts
# Test Files  1 passed; Tests  7 passed; EXIT 0

npx vitest run --project unit-shared tests/unit/*pent-em*
# Test Files  7 passed; Tests  44 passed; EXIT 0

npx vitest run --project unit-shared --coverage tests/unit/*pent-em*.test.ts
# board-ui → 100% lines / 100% branches
# game-controller → 98.99% lines / 94.16% branches

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run verify
npm run test:unit:coverage
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard / product `src/` edits
- No aria/label string pins; no player-facing copy body asserts
- No placement / legal-move asserts (state fields + chrome only)
- Deterministic (fake timers / stubbed AI / stubbed 3D; no network)
- No lint-ceiling / knip / ratchet JSON edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)

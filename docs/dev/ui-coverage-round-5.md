# UI coverage round 5 (`burn-1008-mp-ui-coverage-round-5`)

Characterization tests for the next lowest-covered **non-engine, non-AI** modules
after round 4 (#577), stacked on tip `cursor/integration-fold-wave5-tip-4af0`.

**Stacks on #577; fold after #577.**

## Scope

Included: UI timer/seat/die helpers, PWA register + bootstrap schedule, feature-flag
SSR defaults, pointer-hygiene residuals, offline/coord leftovers, storage streak /
cross-tab guards, game-shell focus helpers, hex controller shell, contig-60 board-ui
sync/click, dice-demo residual mount.

Excluded: game `rules.ts` / `ai.ts`, heavy `*-board-3d.ts`, tutorials / help/status
**copy** assertions, AI move-choice / timing asserts, modules owned by #579 mutation
audit test files (not edited), #576 type-ratchet tests (not edited), and source files
touched by #567 / #568.

## Overlap with prior drafts

| Draft                     | Action                                                                              |
| ------------------------- | ----------------------------------------------------------------------------------- |
| #510 / #566 / #571 / #577 | Merged #571 then #577 into this branch first; not re-targeted except residual edges |
| #579                      | Did not edit `mutation-ui-*.test.ts`                                                |
| #576                      | Did not edit type-ratchet helper tests                                              |
| #567 / #568               | Avoided their source files                                                          |
| #578 / #574               | Engine coverage — orthogonal                                                        |

## Per-file before → after

Measured with `npm run test:unit:coverage` on tip+#571+#577 (before) and this branch (after).

| File                               | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ---------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/ui/timeout-handle.ts`         |       50.00% |          50.00% |        100% |           100% |       +50.00 |          +50.00 |
| `src/ui/seat-labels.ts`            |       55.55% |          52.63% |      88.88% |         84.21% |       +33.33 |          +31.58 |
| `src/ui/die-faces.ts`              |         100% |          50.00% |        100% |           100% |            0 |          +50.00 |
| `src/games/contig-60/board-ui.ts`  |       80.13% |          58.57% |      97.26% |         88.57% |       +17.13 |          +30.00 |
| `src/core/feature-flags.ts`        |         100% |          71.42% |        100% |           100% |            0 |          +28.58 |
| `src/ui/offline.ts`                |       94.11% |          90.90% |        100% |           100% |        +5.89 |           +9.10 |
| `src/ui/coord-map.ts`              |         100% |          87.09% |        100% |         96.77% |            0 |           +9.68 |
| `src/ui/pointer-hygiene.ts`        |       94.61% |          83.33% |      96.92% |         88.33% |        +2.31 |           +5.00 |
| `src/pwa/register.ts`              |         100% |          91.66% |        100% |         95.83% |            0 |           +4.17 |
| `src/games/hex/game-controller.ts` |       71.76% |          47.61% |      72.94% |         50.00% |        +1.18 |           +2.39 |

**10 files show meaningful % gains** (acceptance: 8+).

Also exercised (suite coverage already at/near prior ceiling for these paths; 0Δ in full merge):
`fraction-pinball/game-controller`, `demos/dice-demo`, `storage`, `game-shell`,
`pwa/bootstrap`, `pwa/idle-warm`, `router`.

## Overall (gainer-file aggregate)

| Metric       | Before               | After                | Δ             |
| ------------ | -------------------- | -------------------- | ------------- |
| **Lines**    | **84.32%** (398/472) | **93.22%** (440/472) | **+8.90 pp**  |
| **Branches** | **69.34%** (190/274) | **85.04%** (233/274) | **+15.70 pp** |

Repo-wide unit coverage (all `src/**`): lines 94.49%→94.69%, branches 85.37%→85.72%,
statements 92.80%→93.01%.

## Bugs pinned (skipped)

| Pin                      | File                                  | Note                                                                                           |
| ------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `destroyGame` no-op stub | `hex/game-controller.ts`              | Tip-held alpha restore left destroy empty; does not clear board/status or cancel AI generation |
| `destroyGame` no-op stub | `fraction-pinball/game-controller.ts` | Same stub pattern                                                                              |

## Stack compatibility note (#577 juggle)

Tip’s Friday AI/copy restore removed `applyJuggleHoverPreview` from
`juggle/board-ui` (pre-restore helper still present on the #577 working tree).
Round-5 briefly `describe.skipIf`-gated the r4 juggle suite when that export
was absent; tip later **deleted** `tests/unit/burn-1008-ui-cov-r4-juggle-board-controller.test.ts`
(`358e75e8`) so tip has neither the helper nor the orphan tests. See
[`post-restore-orphans.md`](./post-restore-orphans.md).

## Tests added

- `tests/unit/burn-1008-ui-cov-r5-timeout-seat-dice.test.ts`
- `tests/unit/burn-1008-ui-cov-r5-pwa-flags-pointer.test.ts`
- `tests/unit/burn-1008-ui-cov-r5-storage-shell.test.ts`
- `tests/unit/burn-1008-ui-cov-r5-hex-pinball-controllers.test.ts`
- `tests/unit/burn-1008-ui-cov-r5-contig-board-dice-demo.test.ts`

## Verification

```text
npm run lint                          # exit 0
npx tsc --noEmit                      # exit 0

npx vitest run --project unit-shared tests/unit/burn-1008-ui-cov-r5-*.test.ts
# Test Files  5 passed; Tests  29 passed | 2 skipped

npm run test:unit
# Test Files  3078 passed | 1 skipped (3079)
# Tests  11688 passed | 27 skipped | 7 todo (11722)

npm run test:unit:coverage
# exit 0; metrics above
# Repo-wide lines 94.49%→94.69%, branches 85.37%→85.72%

git diff --stat origin/cursor/integration-fold-wave5-tip-4af0...HEAD
# merges #571/#577 + r5 tests + this doc; r4 juggle suite later dropped on tip
# no src/, package.json, or lockfile product edits in the r5 commit delta
```

## Constraints honored

- No non-test product source changes
- No `ai/` or rules/engine behavior changes
- Deterministic (fake timers / stubbed APIs; no real network)
- No player-facing copy assertions (structural selectors / distinctness only)
- Hex Hard 450ms assert untouched
- Tip-owner AI/tutorial/status restore work left alone

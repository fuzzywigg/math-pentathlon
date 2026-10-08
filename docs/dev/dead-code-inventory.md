# Dead-code inventory

**Task id:** `burn-1008-mp-dead-code-removal-exec`
**Generated:** 2026-10-08T12:38:43.622Z
**Fold order:** **FOLD LAST** (after every other wave5 tip draft)

## Method

1. `knip@5.88.1` with committed `knip.json` (HTML + `src/main.ts` + game workers + scripts/tests/docs entries so dynamic game mounts stay reachable).
2. `depcheck` for unused `dependencies` / `devDependencies`.
3. CSS class scan across `src/**/*.css` vs TS/HTML corpus (templates checked in ranking).
4. Feature-flag catalog from `feature-flags` / `settings-flags` / `url-flags` / `tablet-gl`.
5. Test-helper module + export reachability (including side-effect imports).
6. Every candidate verified with `rg` plus game-registry / dynamic-import checks (`game-route-mounts`, `game-prefetch`, `main`).

## Executed removals (this PR)

Re-verified on live tip then applied (**8** items). Skipped all safe-to-remove test-helper exports (coordinate with #526).

| Disposition | Kind | Path / symbol | Action |
| --- | --- | --- | --- |
| removed | export | `src/core/dom-security.ts` → `setChildren` | deleted unused export (zero external refs) |
| removed | export | `src/core/storage/sanitize.ts` → `MAX_PROFILE_ID_LENGTH` | demoted to module-private const |
| removed | export | `src/core/storage/sanitize.ts` → `MAX_GAME_ID_LENGTH` | demoted to module-private const |
| removed | export | `src/core/storage/sanitize.ts` → `MAX_ACHIEVEMENT_ID_LENGTH` | demoted to module-private const |
| removed | css-class | `src/style.css` → `game-selector-header` | deleted dead CSS rule (live class is game-selector-hero) |
| removed | css-class | `src/style.css` → `tutorial-action-target` | deleted dead CSS selectors (live class is tutorial-tap-target) |
| removed | export | `src/ui/game-prefetch.ts` → `allowGamePrefetchImportsForTests` | demoted to module-private; used by resetGamePrefetchForTests |
| removed | export | `src/ui/game-route-mounts.ts` → `resetGameMountDepsForTests` | deleted unused test-hook export (zero refs) |

## Defer — do not redo

- PR #518 (UI helper dedupe): Shared seat/die/hex/timeout helpers — not dead-code removal
- PR #520 (lint ratchet): ESLint rule enablement — not unused-symbol inventory
- PR #523 (module boundaries (in tip)): Import-graph / layering ratchet already folded
- PR #526 (test fixture consolidation): Helper moves/merges — inventory lists unused helper *exports* only

## Registry / dynamic imports

- Registered games: 24 (`division-1`, `division-2`, `division-3`, `division-4`, `kings-quadraphages`, `hex`, `star-track`, `hex-a-gone`, `calla`, `sum-dominoes`, `par-55`, `ramrod`, `kwatro-sinko`, `fiar`, `juggle`, `contig-60`, `stars-bars`, `fab-a-diffy`, `queens-guards`, `prime-gold`, `remainder-islands`, `pent-em-in`, `frac-fact`, `fraction-pinball`)
- Dynamic import specs observed: 32

## Dependencies

No unused direct `dependencies` or `devDependencies` (depcheck).

## Ranked removal list (remaining)

Rank 1 = strongest removal candidate; Rank 4 = keep.
**Safe-to-remove** applies to the *symbol/rule* unless `kind=file`.
**Disposition:** `removed` (this PR) / `deferred` (safe test-helper export — leave for #526) / `kept` (do not remove).
This PR does **not** delete games, assets, or tests. File deletion only when `kind=file` and safe-to-remove=yes.

| Rank | Safe? | Disposition | Kind | Path / symbol | Evidence | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | yes | kept | css-class | `src/ui/styles/forced-colors.css` → `kwa-board-svg` | grep: no references outside defining module | CSS class never assigned in TS/HTML (rule-only leftover) |
| 1 | yes | kept | css-class | `src/ui/styles/forced-colors.css` → `tutorial-spotlight` | grep: no references outside defining module | CSS class never assigned in TS/HTML (rule-only leftover) |
| 2 | yes | deferred | test-helper-export | `tests/e2e/fullgame/_helpers.ts` → `installFullgamePrefs` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/e2e/fullgame/_helpers.ts` → `moveFingerprint` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/e2e/helpers/page.ts` → `startHumanFresh` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/e2e/helpers/page.ts` → `installConsoleGuard` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/e2e/helpers/visual-stability.ts` → `disableCssMotion` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/e2e/helpers/visual-stability.ts` → `waitForFonts` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/e2e/helpers/visual-stability.ts` → `neutralizeOwl` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/e2e/helpers/visual-stability.ts` → `VISUAL_RNG_SEED` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/e2e/helpers/visual-stability.ts` → `VISUAL_PROGRESS` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/helpers/ai-calibration/games.ts` → `getAdapter` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/unit/ai-determinism-harness.ts` → `runDeterminism` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/unit/ai-determinism-harness.ts` → `runDefaultQuality` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/unit/fiar-test-helpers.ts` → `placeSequence` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/unit/fiar-test-helpers.ts` → `withEmptyHands` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/unit/helpers/engine-property-invariants.ts` → `extractSeat` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | kept | test-helper-module | `tests/unit/helpers/fake-timers.ts` | grep stem: no import-shaped external references | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/unit/helpers/fake-timers.ts` → `installFakeTimerHooks` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/unit/helpers/fake-timers.ts` → `withFakeTimers` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/unit/helpers/state-roundtrip.ts` → `jsonReplacer` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/unit/helpers/state-roundtrip.ts` → `jsonReviver` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/visual/helpers.ts` → `installVisualDeterminism` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/visual/helpers.ts` → `stabilizeChrome` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/visual/helpers.ts` → `reseedVisualRng` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/visual/helpers.ts` → `startHumanBoard` | grep: no references outside defining module | test helper with zero importers after grep |
| 2 | yes | deferred | test-helper-export | `tests/visual/helpers.ts` → `VISUAL_SEED` | grep: no references outside defining module | test helper with zero importers after grep |
| 3 | review | kept | unused-type | `src/core/ai-worker/client.ts` → `AiWorkerRequestPayload` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/ai-worker/protocol.ts` → `AiWorkerRequestBase` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/alignment/highlight-ui.ts` → `HighlightStyle` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/dice/dice-selector.ts` → `DiceSelectorOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/dice/types.ts` → `RollCallback` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/dice/types.ts` → `DieSelectCallback` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/dom-security.ts` → `SafeHtmlValue` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/expressions/expression-ui.ts` → `InteractiveBuilderOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/expressions/types.ts` → `OrionGame` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/expressions/types.ts` → `CamelGame` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | no | kept | export | `src/core/feature-flags.ts` → `BOARD_3D_PARAM` | grep: 12 file(s) outside defining module (scripts/report-dead-code.mjs, tests/unit/mp3d-queens-guards-restore.test.ts, tests/unit/mp3d-hex-a-gone-board-select.test.ts) | tip-fold keeper after #497 (intentional export surface) |
| 3 | no | kept | feature-flag | `src/core/feature-flags.ts` → `BOARD_3D_PARAM` | grep: 12 file(s) outside defining module (scripts/report-dead-code.mjs, tests/unit/mp3d-queens-guards-restore.test.ts, tests/unit/mp3d-hex-a-gone-board-select.test.ts) | tip-fold keeper after #497 (intentional export surface) |
| 3 | review | kept | unused-type | `src/core/fractions/arithmetic.ts` → `FormatFractionOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/game-registry.ts` → `DivisionInfo` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/graph/graph-ui.ts` → `AnimateMoveCancel` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/graph/graph-ui.ts` → `AnimateMoveHandle` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/graph/types.ts` → `LayoutType` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/hex/hex-ui.ts` → `HexRenderOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/hex/hex-ui.ts` → `HexGridRenderOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/hex/hex-ui.ts` → `InteractiveHexOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/hex/types.ts` → `HexGrid` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/owl/owl-events.ts` → `OwlEventBase` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/owl/owl-events.ts` → `OwlEventHandler` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/safe-web-storage.ts` → `WebStorageKind` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/safe-web-storage.ts` → `SafeJsonParseResult` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/safe-web-storage.ts` → `SafeWriteResult` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/safe-web-storage.ts` → `SafeReadResult` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | no | kept | feature-flag | `src/core/settings-flags.ts` → `resetSettingsFlagsForTests` | grep: 5 file(s) outside defining module (scripts/report-dead-code.mjs, tests/unit/durable-progress-persistence.test.ts, tests/unit/safe-web-storage.test.ts) | tip-fold keeper after #497 (intentional export surface) |
| 3 | review | kept | unused-type | `src/core/timer-scoring.ts` → `FormatTimeOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/timer-scoring.ts` → `ScoreEntry` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/timer-scoring.ts` → `PlayerData` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/timer-scoring.ts` → `Multiplier` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/timer-scoring.ts` → `ScoringState` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/timer-scoring.ts` → `LeaderboardEntry` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/tutorial.ts` → `TutorialEventHandler` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/pwa/bootstrap-owl.ts` → `BootstrapOwlOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/pwa/bootstrap.ts` → `BootstrapPwaOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/pwa/idle-warm.ts` → `IdleWarmOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/pwa/register.ts` → `RegisterPwaOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/pwa/register.ts` → `RegisterPwaResult` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | no | kept | export | `src/ui/board-a11y.ts` → `isBoardActivateKey` | grep: 1 file(s) outside defining module (scripts/report-dead-code.mjs) | tip-fold keeper after #497 (intentional export surface) |
| 3 | review | kept | unused-type | `src/ui/board-a11y.ts` → `FocusedCellCoords` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | no | kept | export | `src/ui/components/game-shell.ts` → `isKeyboardReachable` | grep: 1 file(s) outside defining module (scripts/report-dead-code.mjs) | tip-fold keeper after #497 (intentional export surface) |
| 3 | review | kept | unused-type | `src/ui/coord-map.ts` → `CssRect` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/ui/game-error-boundary.ts` → `GameErrorBoundaryOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/ui/game-route-mounts.ts` → `GameMountDeps` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/ui/hex-svg.ts` → `PixelPoint` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | no | kept | export | `src/ui/owl/index.ts` → `OwlComponent` | grep: 9 file(s) outside defining module (scripts/report-dead-code.mjs, src/ui/owl/owl-component.ts, tests/unit/burn-wave25-owl-component-chrome.test.ts) | tip-fold keeper after #497 (intentional export surface) |
| 3 | review | kept | unused-type | `src/ui/player-colors.ts` → `PlayerSeat` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/ui/player-colors.ts` → `GameModeChrome` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/ui/pointer-hygiene.ts` → `PointerTapPhase` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/ui/pointer-hygiene.ts` → `PointerTapState` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/ui/pointer-hygiene.ts` → `PointerTapControllerOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/ui/pointer-hygiene.ts` → `PointerTapController` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/ui/pointer-hygiene.ts` → `BindCanvasPointerTapOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/ui/reduced-motion.ts` → `ReducedMotionOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/ui/seat-labels.ts` → `GameModeLabel` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | no | kept | export | `src/ui/three/tablet-gl.ts` → `BOARD_3D_LQ_PARAM` | grep: 2 file(s) outside defining module (scripts/report-dead-code.mjs, tests/unit/e2e-3d-timeout-config.test.ts) | tip-fold keeper after #497 (intentional export surface) |
| 3 | no | kept | export | `src/ui/three/tablet-gl.ts` → `BOARD_3D_LQ_STORAGE_KEY` | grep: 1 file(s) outside defining module (scripts/report-dead-code.mjs) | tip-fold keeper after #497 (intentional export surface) |
| 3 | no | kept | export | `src/ui/three/tablet-gl.ts` → `MP3D_READY_ATTR` | grep: 1 file(s) outside defining module (scripts/report-dead-code.mjs) | tip-fold keeper after #497 (intentional export surface) |
| 3 | no | kept | feature-flag | `src/ui/three/tablet-gl.ts` → `BOARD_3D_LQ_PARAM` | grep: 2 file(s) outside defining module (scripts/report-dead-code.mjs, tests/unit/e2e-3d-timeout-config.test.ts) | tip-fold keeper after #497 (intentional export surface) |
| 3 | no | kept | feature-flag | `src/ui/three/tablet-gl.ts` → `BOARD_3D_LQ_STORAGE_KEY` | grep: 1 file(s) outside defining module (scripts/report-dead-code.mjs) | tip-fold keeper after #497 (intentional export surface) |
| 3 | review | kept | unused-type | `src/ui/timeout-handle.ts` → `TimeoutId` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/ui/timeout-handle.ts` → `GenerationTimeoutHandle` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 4 | no | kept | unused-type | `src/core/alignment/compat.ts` → `Dimensions` | grep: 4 file(s) outside defining module (src/core/alignment/index.ts, src/games/kwatro-sinko/board-ui.ts, src/games/par-55/board-ui.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/alignment/compat.ts` → `WrapOptions` | grep: 1 file(s) outside defining module (src/core/alignment/index.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/alignment/compat.ts` → `AlignmentOptions` | grep: 1 file(s) outside defining module (src/core/alignment/index.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/alignment/compat.ts` → `AlignmentCheckResult` | grep: 3 file(s) outside defining module (src/core/alignment/index.ts, src/core/alignment/types.ts, src/core/alignment/grid-alignment.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/alignment/compat.ts` → `LineAlignmentResult` | grep: 1 file(s) outside defining module (src/core/alignment/index.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/alignment/compat.ts` → `ConnectivityOptions` | grep: 1 file(s) outside defining module (src/core/alignment/index.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/alignment/compat.ts` → `RegionStats` | grep: 1 file(s) outside defining module (src/core/alignment/index.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/alignment/index.ts` → `Dimensions` | grep: 4 file(s) outside defining module (src/core/alignment/compat.ts, src/games/kwatro-sinko/board-ui.ts, src/games/par-55/board-ui.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/alignment/index.ts` → `WrapOptions` | grep: 1 file(s) outside defining module (src/core/alignment/compat.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/alignment/index.ts` → `LineAlignmentResult` | grep: 1 file(s) outside defining module (src/core/alignment/compat.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/alignment/index.ts` → `AlignmentOptions` | grep: 1 file(s) outside defining module (src/core/alignment/compat.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/alignment/index.ts` → `AlignmentCheckResult` | grep: 3 file(s) outside defining module (src/core/alignment/types.ts, src/core/alignment/compat.ts, src/core/alignment/grid-alignment.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/alignment/index.ts` → `ConnectivityOptions` | grep: 1 file(s) outside defining module (src/core/alignment/compat.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/alignment/index.ts` → `RegionStats` | grep: 1 file(s) outside defining module (src/core/alignment/compat.ts) | external references found |
| 4 | no | kept | feature-flag | `src/core/feature-flags.ts` → `BOARD_3D_STORAGE_KEY` | grep: 12 file(s) outside defining module (tests/unit/mp3d-queens-guards-restore.test.ts, tests/unit/mp3d-hex-a-gone-board-select.test.ts, tests/unit/mp3d-star-track-board-select.te | flag constant used inside its defining module |
| 4 | no | kept | feature-flag | `src/core/feature-flags.ts` → `isBoard3dEnabled` | grep: 23 file(s) outside defining module (src/games/prime-gold/game-controller.ts, src/games/hex-a-gone/game-controller.ts, src/games/star-track/game-controller.ts) | flag is read at runtime |
| 4 | no | kept | unused-type | `src/core/hex/types.ts` → `HexCell` | grep: 6 file(s) outside defining module (src/games/queens-guards/types.ts, tests/unit/burn-wave26-success-claim-score.test.ts, tests/unit/burn-wave26-success-place-chain.test.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/owl/index.ts` → `OwlStateChangeHandler` | grep: 1 file(s) outside defining module (src/core/owl/owl-system.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/owl/index.ts` → `OwlMessage` | grep: 2 file(s) outside defining module (src/core/owl/owl-messages.ts, src/core/owl/owl-system.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/owl/index.ts` → `MessageContext` | grep: 2 file(s) outside defining module (src/core/owl/owl-messages.ts, src/core/owl/owl-system.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/owl/index.ts` → `OwlPhysicsState` | grep: 2 file(s) outside defining module (src/core/owl/owl-physics.ts, tests/unit/burn-wave38-owl-physics-dampen.test.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/owl/owl-system.ts` → `OwlStateChangeHandler` | grep: 1 file(s) outside defining module (src/core/owl/index.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/polyomino/types.ts` → `BoardCell` | grep: 10 file(s) outside defining module (src/games/prime-gold/rules.ts, src/games/prime-gold/types.ts, src/games/hex-a-gone/types.ts) | external references found |
| 4 | no | kept | feature-flag | `src/core/settings-flags.ts` → `PROGRESS_STORAGE_KEY` | grep: 4 file(s) outside defining module (src/core/storage/index.ts, src/core/storage/storage.ts, tests/unit/safe-web-storage.test.ts) | flag constant used inside its defining module |
| 4 | no | kept | feature-flag | `src/core/settings-flags.ts` → `getUserReducedMotionFlag` | grep: 4 file(s) outside defining module (src/core/dice/dice-ui.ts, src/core/graph/graph-ui.ts, src/ui/reduced-motion.ts) | flag is read at runtime |
| 4 | no | kept | feature-flag | `src/core/settings-flags.ts` → `setUserReducedMotionFlag` | grep: 1 file(s) outside defining module (src/core/storage/storage.ts) | flag is read at runtime |
| 4 | no | kept | export | `src/core/storage/index.ts` → `isPlainProgressObject` | grep: 2 file(s) outside defining module (src/core/storage/migrate.ts, src/core/storage/storage.ts) | external references found |
| 4 | no | kept | export | `src/core/storage/index.ts` → `sanitizeSettings` | grep: 3 file(s) outside defining module (src/core/storage/sanitize.ts, src/core/storage/migrate.ts, src/core/storage/storage.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/timer-scoring.ts` → `GameResult` | grep: 17 file(s) outside defining module (src/core/storage/types.ts, src/core/storage/storage.ts, src/core/owl/owl-system.ts) | external references found |
| 4 | no | kept | feature-flag | `src/core/url-flags.ts` → `parseAllowlistedFlag` | grep: 3 file(s) outside defining module (scripts/report-dead-code.mjs, src/ui/three/tablet-gl.ts, tests/unit/url-flags-security.test.ts) | flag constant used inside its defining module |
| 4 | no | kept | feature-flag | `src/core/url-flags.ts` → `readUrlOrStorageFlag` | grep: 3 file(s) outside defining module (scripts/report-dead-code.mjs, src/core/feature-flags.ts, tests/unit/url-flags-security.test.ts) | flag is read at runtime |
| 4 | no | kept | unused-type | `src/games/calla/ai.ts` → `MoveAnalysis` | grep: no references outside defining module; registry: game id 'calla' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/calla/ai.ts` → `AIMove` | grep: 28 file(s) outside defining module (src/games/pent-em-in/ai.ts, src/games/queens-guards/ai.worker.ts, src/games/queens-guards/ai.ts); registry: game id 'calla' is registered; | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/contig-60/ai.ts` → `AIPlacement` | grep: 1 file(s) outside defining module (src/games/prime-gold/ai.ts); registry: game id 'contig-60' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/fab-a-diffy/ai.ts` → `AISearchResult` | grep: 3 file(s) outside defining module (src/games/queens-guards/ai.ts, src/games/hex/ai.ts, src/games/fiar/ai.ts); registry: game id 'fab-a-diffy' is registered; dynamic-import: r | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/fiar/ai.ts` → `AISearchResult` | grep: 3 file(s) outside defining module (src/games/queens-guards/ai.ts, src/games/hex/ai.ts, src/games/fab-a-diffy/ai.ts); registry: game id 'fiar' is registered; dynamic-import: r | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/fiar/types.ts` → `BoardEdge` | grep: no references outside defining module; registry: game id 'fiar' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/fiar/types.ts` → `CreateInitialStateOptions` | grep: no references outside defining module; registry: game id 'fiar' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/fiar/types.ts` → `BoardLayout` | grep: 1 file(s) outside defining module (src/games/fiar/layout.ts); registry: game id 'fiar' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/fiar/types.ts` → `YellowCenterEllipse` | grep: 1 file(s) outside defining module (src/games/fiar/layout.ts); registry: game id 'fiar' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/fiar/types.ts` → `YellowCenterDiamond` | grep: 1 file(s) outside defining module (src/games/fiar/layout.ts); registry: game id 'fiar' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/fiar/types.ts` → `YellowCenterShape` | grep: 1 file(s) outside defining module (src/games/fiar/layout.ts); registry: game id 'fiar' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/hex-a-gone/ai.ts` → `AISelectionResult` | grep: no references outside defining module; registry: game id 'hex-a-gone' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/hex-a-gone/ai.ts` → `AIPlacementResult` | grep: no references outside defining module; registry: game id 'hex-a-gone' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/hex/ai.ts` → `AISearchResult` | grep: 3 file(s) outside defining module (src/games/queens-guards/ai.ts, src/games/fiar/ai.ts, src/games/fab-a-diffy/ai.ts); registry: game id 'hex' is registered; dynamic-import: r | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/juggle/ai.ts` → `AIDieChoice` | grep: no references outside defining module; registry: game id 'juggle' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/juggle/ai.ts` → `AIShapeChoice` | grep: no references outside defining module; registry: game id 'juggle' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/juggle/ai.ts` → `AIPlacementChoice` | grep: no references outside defining module; registry: game id 'juggle' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/kings-quadraphages/ai.ts` → `AIMove` | grep: 28 file(s) outside defining module (src/games/pent-em-in/ai.ts, src/games/calla/ai.ts, src/games/queens-guards/ai.worker.ts); registry: game id 'kings-quadraphages' is regist | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/kings-quadraphages/board-renderer.ts` → `CellClickHandler` | grep: no references outside defining module; registry: game id 'kings-quadraphages' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/kings-quadraphages/board-renderer.ts` → `BoardRendererOptions` | grep: no references outside defining module; registry: game id 'kings-quadraphages' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/kings-quadraphages/board.ts` → `PieceType` | grep: 2 file(s) outside defining module (src/games/queens-guards/types.ts, src/games/kings-quadraphages/pieces.ts); registry: game id 'kings-quadraphages' is registered; dynamic-im | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/kings-quadraphages/game-state.ts` → `GamePiece` | grep: no references outside defining module; registry: game id 'kings-quadraphages' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/kings-quadraphages/serialization.ts` → `SaveInfo` | grep: no references outside defining module; registry: game id 'kings-quadraphages' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/kwatro-sinko/ai.ts` → `AIMove` | grep: 28 file(s) outside defining module (src/games/pent-em-in/ai.ts, src/games/calla/ai.ts, src/games/queens-guards/ai.worker.ts); registry: game id 'kwatro-sinko' is registered;  | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/par-55/ai.ts` → `AIMove` | grep: 28 file(s) outside defining module (src/games/pent-em-in/ai.ts, src/games/calla/ai.ts, src/games/queens-guards/ai.worker.ts); registry: game id 'par-55' is registered; dynami | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/pent-em-in/ai.ts` → `AIMove` | grep: 28 file(s) outside defining module (src/games/calla/ai.ts, src/games/queens-guards/ai.worker.ts, src/games/queens-guards/ai.ts); registry: game id 'pent-em-in' is registered; | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/prime-gold/ai.ts` → `AIPlacement` | grep: 1 file(s) outside defining module (src/games/contig-60/ai.ts); registry: game id 'prime-gold' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/queens-guards/ai.ts` → `AISearchResult` | grep: 3 file(s) outside defining module (src/games/hex/ai.ts, src/games/fiar/ai.ts, src/games/fab-a-diffy/ai.ts); registry: game id 'queens-guards' is registered; dynamic-import: r | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/ramrod/ai.ts` → `AIMove` | grep: 28 file(s) outside defining module (src/games/pent-em-in/ai.ts, src/games/calla/ai.ts, tests/unit/burn-wave42-fiar-ai-apply-noop-wrong-type.test.ts); registry: game id 'ramro | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/remainder-islands/ai.ts` → `AIIslandChoice` | grep: no references outside defining module; registry: game id 'remainder-islands' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/star-track/ai.ts` → `AIChainChoice` | grep: no references outside defining module; registry: game id 'star-track' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/star-track/types.ts` → `StarTrackPosition` | grep: no references outside defining module; registry: game id 'star-track' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/stars-bars/ai.ts` → `AIMove` | grep: 28 file(s) outside defining module (src/games/pent-em-in/ai.ts, src/games/calla/ai.ts, src/games/queens-guards/ai.worker.ts); registry: game id 'stars-bars' is registered; dy | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/sum-dominoes/ai.ts` → `AIMove` | grep: 28 file(s) outside defining module (src/games/pent-em-in/ai.ts, src/games/calla/ai.ts, src/games/queens-guards/ai.worker.ts); registry: game id 'sum-dominoes' is registered;  | reachable via dynamic import or game registry |
| 4 | no | kept | css-class | `src/style.css` → `difficulty-advanced` | grep: no references outside defining module; note: may be built via template literal — check className patterns | applied via `difficulty-${game.difficulty}` template |
| 4 | no | kept | css-class | `src/style.css` → `difficulty-beginner` | grep: no references outside defining module; note: may be built via template literal — check className patterns | applied via `difficulty-${game.difficulty}` template |
| 4 | no | kept | css-class | `src/style.css` → `difficulty-intermediate` | grep: no references outside defining module; note: may be built via template literal — check className patterns | applied via `difficulty-${game.difficulty}` template |
| 4 | no | kept | unused-type | `src/ui/seat-labels.ts` → `SeatId` | grep: 2 file(s) outside defining module (src/core/seats.ts, tests/unit/engine-ui-boundary-seats-characterization.test.ts) | external references found |
| 4 | no | kept | css-class | `src/ui/styles/forced-colors.css` → `par55-cell` | grep: 2 file(s) outside defining module (scripts/runtime-perf.mjs, scripts/render-perf.mjs) | external references found |
| 4 | no | kept | css-class | `src/ui/styles/game-play.css` → `star-track-path-p1` | grep: no references outside defining module; note: may be built via template literal — check className patterns | applied via `star-track-path-${p1\|p2}` template in board-ui |
| 4 | no | kept | css-class | `src/ui/styles/game-play.css` → `star-track-path-p2` | grep: no references outside defining module; note: may be built via template literal — check className patterns | applied via `star-track-path-${p1\|p2}` template in board-ui |
| 4 | no | kept | feature-flag | `src/ui/three/tablet-gl.ts` → `PRESERVE_PARAM` | grep: no references outside defining module | flag constant used inside its defining module |
| 4 | no | kept | feature-flag | `src/ui/three/tablet-gl.ts` → `PRESERVE_STORAGE_KEY` | grep: no references outside defining module | flag constant used inside its defining module |

## File deletions in this PR

None (symbol/CSS demotions and deletions only). After grep + registry/dynamic-import verification, no non-game / non-asset / non-test *file* was provably unreferenced.

## Reproduce

```bash
npm run report:dead-code
```

Artifacts: `docs/dev/dead-code-inventory.md`, `docs/dev/dead-code-inventory.json`.

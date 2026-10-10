# Dead-code inventory

**Task id:** `burn-1008-mp-dead-code-removal-exec`
**Generated:** 2026-10-09T09:29:59.317Z
**Fold order:** **FOLD LAST** (after every other wave5 tip draft)

> **q-mp-119 (2026-10-09):** Demoted/removed the prior Rank-2 deferred test-helper exports
> (`installFullgamePrefs`, `moveFingerprint`, `startHumanFresh`, `installConsoleGuard`,
> visual-stability helpers, `getAdapter`, `runDeterminism`/`runDefaultQuality`,
> `placeSequence`/`withEmptyHands`, `extractSeat`, fake-timer hooks, `jsonReplacer`/`jsonReviver`,
> visual helpers). Re-run cleared them from the ranked list; remaining Rank-2 deferred is
> `clearDom` only (`fake-timers.ts` module still `kept`).
>
> **q-mp-139 (2026-10-09):** Removed Rank-2 `tests/unit/helpers/fake-timers.ts (absent on tip)` after live-tip
> re-check showed zero importers (`rg 'fake-timers|installFakeTimerHooks|withFakeTimers' tests src`).
>
> **q-mp-155 (2026-10-09):** Demoted Rank-2 `tests/unit/helpers/dom.ts` → `clearDom` to
> module-private (still used by `installDomHooks`). Live tip re-check:
> `rg '\bclearDom\b' tests src` — definitions/calls only inside `dom.ts`. No Rank-2
> deferred test-helper exports remain.
>
> **q-mp-154 (2026-10-09):** Removed Rank-1 dead CSS `.calla-teaching-hint` (including coarse-pointer
> media-query group ref) and `.sd-hands-container` from `src/ui/styles/game-play.css`.
>
> **q-mp-176 (2026-10-09):** Removed Rank-1 dead CSS `.game-card-division` from `src/style.css`.
>
> **q-mp-211 (2026-10-09):** Removed Rank-1 dead CSS `.move-history-panel` selector-list
> entries from `src/ui/styles/zoom-reflow.css` (live history chrome uses `.move-history-list` /
> `.move-history-entry` only).
>
> **q-mp-241 (2026-10-09):** Fresh Rank-1 CSS rescan on tip `cursor/mp-tip-post748`. Removed
> verified-unused `.par55-btn-primary` / `.ramrod-btn-primary` leftovers (in-board New Game
> buttons deleted in #82; live controls use `*-btn-secondary` only). Dated residual inventory:
> `docs/dev/dead-css-rank1-rescan-2026-10-09.md`.
>
> **q-mp-305 (2026-10-09):** Fresh Rank-1 CSS rescan on tip `cursor/mp-tip-post755` @ `89e40ad7`.
> Zero verified-unused selectors after scripts corpus + dynamic exclusions (491 classes defined;
> naive unused 8 → all kept/dynamic or script-referenced). Report-only; contains open `#766`.
> Dated residual inventory: `docs/dev/dead-css-rank1-rescan-post755-2026-10-09.md`.
>
> **q-mp-341 (2026-10-10):** Fresh Rank-1 CSS rescan on tip `cursor/mp-tip-post785` @ `c9b55cff`.
> Metrics unchanged vs `#805` (491 defined / naive unused 8 / zero-ref 0); no `src/**/*.css`
> diffs since post755 scan SHA. Report-only; contains open `#805` / `#766`.
> Dated residual inventory: `docs/dev/dead-css-rank1-rescan-post785-2026-10-10.md`.

## Method

1. `knip@5.88.1` with committed `knip.json` (HTML + `src/main.ts` + game workers + scripts/tests/docs entries so dynamic game mounts stay reachable).
2. `depcheck` for unused `dependencies` / `devDependencies`.
3. CSS class scan across `src/**/*.css` vs TS/HTML corpus (templates checked in ranking).
4. Feature-flag catalog from `feature-flags` / `settings-flags` / `url-flags` / `tablet-gl`.
5. Test-helper module + export reachability (including side-effect imports).
6. Every candidate verified with `rg` plus game-registry / dynamic-import checks (`game-route-mounts`, `game-prefetch`, `main`).

## Executed removals (this PR)

Re-verified on live tip then applied (**8** items initially; **+2** CSS classes confirmed removed in q-mp-101 after q-mp-054 rename). Skipped all safe-to-remove test-helper exports (coordinate with #526).

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
| removed | css-class | `src/ui/styles/forced-colors.css` → `kwa-board-svg` | deleted on tip via q-mp-054 rename to live `.kwa-board` / container / 3d-host; q-mp-101 confirms + inventory sync |
| removed | css-class | `src/ui/styles/forced-colors.css` → `tutorial-spotlight` | deleted on tip via q-mp-054 rename to live `.tutorial-highlight*` ; q-mp-101 confirms + inventory sync |
| removed | test-helper-module | `tests/unit/helpers/fake-timers.ts (absent on tip)` | deleted unused module (zero importers after #658 fold / tip demote); q-mp-139 |
| removed | css-class | `src/ui/styles/game-play.css` → `calla-teaching-hint` | deleted Rank-1 dead CSS rule + coarse-pointer media-query group ref (q-mp-154) |
| removed | css-class | `src/ui/styles/game-play.css` → `sd-hands-container` | deleted Rank-1 dead CSS rule (q-mp-154) |
| removed | css-class | `src/style.css` → `game-card-division` | deleted Rank-1 dead CSS rule (q-mp-176) |
| removed | css-class | `src/ui/styles/zoom-reflow.css` → `move-history-panel` | deleted Rank-1 dead CSS selector-list leftovers (q-mp-211) |
| removed | css-class | `src/games/par-55/par-55.css` → `par55-btn-primary` | deleted Rank-1 dead CSS rule + reduced-motion hover leftover (q-mp-241) |
| removed | css-class | `src/games/ramrod/ramrod.css` → `ramrod-btn-primary` | deleted Rank-1 dead CSS rule + reduced-motion hover leftover (q-mp-241) |

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
| 1 | yes | removed | css-class | `src/style.css` → `game-card-division` | grep: no references outside defining module | CSS class never assigned in TS/HTML (rule-only leftover); removed q-mp-176 |
| 1 | yes | removed | css-class | `src/ui/styles/game-play.css` → `calla-teaching-hint` | grep: no references outside defining module | CSS class never assigned in TS/HTML (rule-only leftover); removed q-mp-154 |
| 1 | yes | removed | css-class | `src/ui/styles/game-play.css` → `sd-hands-container` | grep: no references outside defining module | CSS class never assigned in TS/HTML (rule-only leftover); removed q-mp-154 |
| 1 | yes | removed | css-class | `src/ui/styles/zoom-reflow.css` → `move-history-panel` | grep: no references outside defining module | CSS class never assigned in TS/HTML (rule-only leftover); removed q-mp-211 |
| 1 | yes | removed | css-class | `src/games/par-55/par-55.css` → `par55-btn-primary` | grep: no references outside defining module (incl. scripts/tests) | CSS class never assigned after #82 New Game move to shell; removed q-mp-241 |
| 1 | yes | removed | css-class | `src/games/ramrod/ramrod.css` → `ramrod-btn-primary` | grep: no references outside defining module (incl. scripts/tests) | CSS class never assigned after #82 New Game move to shell; removed q-mp-241 |
| 2 | yes | removed | test-helper-export | `tests/unit/helpers/dom.ts` → `clearDom` | grep: no references outside defining module | demoted in q-mp-155 — module-private; still used by installDomHooks |
| 2 | yes | removed | test-helper-module | `tests/unit/helpers/fake-timers.ts (absent on tip)` | grep stem: no import-shaped external references | removed in q-mp-139 — zero importers on live tip after #658 fold |
| 3 | review | kept | unused-type | `src/core/ai-worker/client.ts` → `AiWorkerRequestPayload` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/ai-worker/protocol.ts` → `AiWorkerRequestBase` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/alignment/compat.ts` → `WrapOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/alignment/compat.ts` → `AlignmentOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/alignment/compat.ts` → `LineAlignmentResult` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/alignment/compat.ts` → `ConnectivityOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/alignment/compat.ts` → `RegionStats` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/dice/dice-selector.ts` → `DiceSelectorOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/dice/types.ts` → `RollCallback` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/dice/types.ts` → `DieSelectCallback` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/dom-security.ts` → `SafeHtmlValue` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/expressions/expression-ui.ts` → `InteractiveBuilderOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/expressions/types.ts` → `OrionGame` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/expressions/types.ts` → `CamelGame` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | no | kept | export | `src/core/feature-flags.ts` → `BOARD_3D_PARAM` | grep: 12 file(s) outside defining module (scripts/report-dead-code.mjs, tests/unit/mp3d-queens-guards-restore.test.ts, tests/unit/mp3d-hex-a-gone-board-select.test.ts) | tip-fold keeper after #497 (intentional export surface) |
| 3 | no | kept | feature-flag | `src/core/feature-flags.ts` → `BOARD_3D_PARAM` | grep: 12 file(s) outside defining module (tests/unit/mp3d-queens-guards-restore.test.ts, scripts/report-dead-code.mjs, tests/unit/mp3d-star-track-board-select.test.ts) | tip-fold keeper after #497 (intentional export surface) |
| 3 | review | kept | unused-type | `src/core/fractions/arithmetic.ts` → `FormatFractionOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/game-registry.ts` → `DivisionInfo` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/graph/graph-ui.ts` → `AnimateMoveCancel` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/graph/graph-ui.ts` → `AnimateMoveHandle` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/graph/types.ts` → `LayoutType` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `tests/helpers/core-hex/hex-ui.ts` → `HexRenderOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API (quarantined from `src/core/hex` under q-mp-133) |
| 3 | review | kept | unused-type | `tests/helpers/core-hex/hex-ui.ts` → `HexGridRenderOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API (quarantined from `src/core/hex` under q-mp-133) |
| 3 | review | kept | unused-type | `tests/helpers/core-hex/hex-ui.ts` → `InteractiveHexOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API (quarantined from `src/core/hex` under q-mp-133) |
| 3 | review | kept | unused-type | `tests/helpers/core-hex/types.ts` → `HexGrid` | grep: no references outside defining module | exported type unused outside module — often intentional public API (quarantined from `src/core/hex` under q-mp-133) |
| 3 | review | kept | unused-type | `src/core/safe-web-storage.ts` → `WebStorageKind` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/safe-web-storage.ts` → `SafeJsonParseResult` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/safe-web-storage.ts` → `SafeWriteResult` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/safe-web-storage.ts` → `SafeReadResult` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | no | kept | feature-flag | `src/core/settings-flags.ts` → `resetSettingsFlagsForTests` | grep: 9 file(s) outside defining module (scripts/report-dead-code.mjs, tests/unit/safe-web-storage.test.ts, tests/unit/durable-progress-persistence.test.ts) | tip-fold keeper after #497 (intentional export surface) |
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
| 3 | review | kept | unused-type | `src/ui/board-a11y.ts` → `FocusedCellCoords` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/ui/coord-map.ts` → `CssRect` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/ui/game-error-boundary.ts` → `GameErrorBoundaryOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/ui/game-route-mounts.ts` → `GameMountDeps` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/ui/hex-svg.ts` → `PixelPoint` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
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
| 4 | no | kept | unused-type | `src/core/alignment/compat.ts` → `Dimensions` | grep: 3 file(s) outside defining module (src/games/kwatro-sinko/board-ui.ts, src/games/par-55/board-ui.ts, src/games/ramrod/board-ui.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/alignment/compat.ts` → `AlignmentCheckResult` | grep: 2 file(s) outside defining module (src/core/alignment/types.ts, src/core/alignment/grid-alignment.ts) | external references found |
| 4 | no | kept | feature-flag | `src/core/feature-flags.ts` → `BOARD_3D_STORAGE_KEY` | grep: 13 file(s) outside defining module (tests/unit/mutation-ui-feature-flags.test.ts, tests/unit/mp3d-queens-guards-restore.test.ts, tests/unit/mp3d-hex-a-gone-board-select.test. | flag constant used inside its defining module |
| 4 | no | kept | feature-flag | `src/core/feature-flags.ts` → `isBoard3dEnabled` | grep: 27 file(s) outside defining module (src/games/prime-gold/game-controller.ts, src/games/hex-a-gone/game-controller.ts, src/games/star-track/game-controller.ts) | flag is read at runtime |
| 4 | no | kept | unused-type | `tests/helpers/core-hex/types.ts` → `HexCell` | grep: 6 file(s) outside defining module (src/games/queens-guards/types.ts, tests/unit/burn-wave26-success-place-chain.test.ts, tests/unit/burn-wave26-success-claim-score.test.ts) | external references found (quarantined from `src/core/hex` under q-mp-133) |
| 4 | no | kept | unused-type | `src/core/polyomino/types.ts` → `BoardCell` | grep: 11 file(s) outside defining module (src/games/prime-gold/rules.ts, src/games/prime-gold/types.ts, src/games/hex-a-gone/types.ts) | external references found |
| 4 | no | kept | feature-flag | `src/core/settings-flags.ts` → `PROGRESS_STORAGE_KEY` | grep: 6 file(s) outside defining module (src/core/storage/index.ts, src/core/storage/storage.ts, tests/unit/burn-1008-ui-cov-r5-storage-shell.test.ts) | flag constant used inside its defining module |
| 4 | no | kept | feature-flag | `src/core/settings-flags.ts` → `getUserReducedMotionFlag` | grep: 6 file(s) outside defining module (src/core/dice/dice-ui.ts, src/core/graph/graph-ui.ts, src/ui/reduced-motion.ts) | flag is read at runtime |
| 4 | no | kept | feature-flag | `src/core/settings-flags.ts` → `setUserReducedMotionFlag` | grep: 5 file(s) outside defining module (src/core/storage/storage.ts, tests/unit/burn-1008-ui-cov-r2-owl-idle.test.ts, tests/unit/mutation-ui-settings-flags.test.ts) | flag is read at runtime |
| 4 | no | kept | export | `src/core/storage/index.ts` → `isPlainProgressObject` | grep: 3 file(s) outside defining module (src/core/storage/migrate.ts, src/core/storage/storage.ts, tests/unit/mutation-ui-storage-migrate.test.ts) | external references found |
| 4 | no | kept | export | `src/core/storage/index.ts` → `sanitizeSettings` | grep: 4 file(s) outside defining module (src/core/storage/sanitize.ts, src/core/storage/migrate.ts, src/core/storage/storage.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/timer-scoring.ts` → `GameResult` | grep: 17 file(s) outside defining module (src/core/storage/types.ts, src/core/storage/storage.ts, src/core/owl/owl-system.ts) | external references found |
| 4 | no | kept | feature-flag | `src/core/url-flags.ts` → `parseAllowlistedFlag` | grep: 4 file(s) outside defining module (src/ui/three/tablet-gl.ts, scripts/report-dead-code.mjs, tests/unit/mutation-ui-url-flags.test.ts) | flag constant used inside its defining module |
| 4 | no | kept | feature-flag | `src/core/url-flags.ts` → `readUrlOrStorageFlag` | grep: 5 file(s) outside defining module (src/core/feature-flags.ts, scripts/report-dead-code.mjs, tests/unit/mutation-ui-url-flags.test.ts) | flag is read at runtime |
| 4 | no | kept | unused-type | `src/games/calla/ai.ts` → `MoveAnalysis` | grep: no references outside defining module; registry: game id 'calla' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/calla/ai.ts` → `AIMove` | grep: 27 file(s) outside defining module (src/games/pent-em-in/ai.ts, src/games/queens-guards/ai.worker.ts, src/games/queens-guards/ai.ts); registry: game id 'calla' is registered; | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/contig-60/ai.ts` → `AIPlacement` | grep: 1 file(s) outside defining module (src/games/prime-gold/ai.ts); registry: game id 'contig-60' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | export | `src/games/fab-a-diffy/ai-client.ts` → `cancelFabAiRequests` | grep: no references outside defining module; registry: game id 'fab-a-diffy' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/fab-a-diffy/ai.ts` → `AISearchResult` | grep: 3 file(s) outside defining module (src/games/queens-guards/ai.ts, src/games/hex/ai.ts, src/games/fiar/ai.ts); registry: game id 'fab-a-diffy' is registered; dynamic-import: r | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/fiar/ai.ts` → `AISearchResult` | grep: 3 file(s) outside defining module (src/games/queens-guards/ai.ts, src/games/fab-a-diffy/ai.ts, src/games/hex/ai.ts); registry: game id 'fiar' is registered; dynamic-import: r | reachable via dynamic import or game registry |
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
| 4 | no | kept | unused-type | `src/games/kings-quadraphages/ai.ts` → `AIMove` | grep: 27 file(s) outside defining module (src/games/pent-em-in/ai.ts, src/games/calla/ai.ts, src/games/queens-guards/ai.worker.ts); registry: game id 'kings-quadraphages' is regist | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/kings-quadraphages/board-renderer.ts` → `CellClickHandler` | grep: no references outside defining module; registry: game id 'kings-quadraphages' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/kings-quadraphages/board-renderer.ts` → `BoardRendererOptions` | grep: no references outside defining module; registry: game id 'kings-quadraphages' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/kings-quadraphages/board.ts` → `PieceType` | grep: 2 file(s) outside defining module (src/games/queens-guards/types.ts, src/games/kings-quadraphages/pieces.ts); registry: game id 'kings-quadraphages' is registered; dynamic-im | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/kings-quadraphages/game-state.ts` → `GamePiece` | grep: no references outside defining module; registry: game id 'kings-quadraphages' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/kings-quadraphages/serialization.ts` → `SaveInfo` | grep: no references outside defining module; registry: game id 'kings-quadraphages' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/kwatro-sinko/ai.ts` → `AIMove` | grep: 27 file(s) outside defining module (src/games/pent-em-in/ai.ts, src/games/calla/ai.ts, src/games/queens-guards/ai.worker.ts); registry: game id 'kwatro-sinko' is registered;  | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/par-55/ai.ts` → `AIMove` | grep: 27 file(s) outside defining module (src/games/pent-em-in/ai.ts, src/games/calla/ai.ts, src/games/queens-guards/ai.worker.ts); registry: game id 'par-55' is registered; dynami | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/pent-em-in/ai.ts` → `AIMove` | grep: 27 file(s) outside defining module (src/games/calla/ai.ts, src/games/queens-guards/ai.worker.ts, src/games/queens-guards/ai.ts); registry: game id 'pent-em-in' is registered; | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/prime-gold/ai.ts` → `AIPlacement` | grep: 1 file(s) outside defining module (src/games/contig-60/ai.ts); registry: game id 'prime-gold' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/queens-guards/ai.ts` → `AISearchResult` | grep: 3 file(s) outside defining module (src/games/hex/ai.ts, src/games/fiar/ai.ts, src/games/fab-a-diffy/ai.ts); registry: game id 'queens-guards' is registered; dynamic-import: r | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/ramrod/ai.ts` → `AIMove` | grep: 27 file(s) outside defining module (src/games/pent-em-in/ai.ts, src/games/calla/ai.ts, src/games/queens-guards/ai.worker.ts); registry: game id 'ramrod' is registered; dynami | reachable via dynamic import or game registry |
| 4 | no | kept | css-class | `src/games/ramrod/ramrod.css` → `ramrod-turn-hint` | grep: 1 file(s) outside defining module (scripts/ramrod-deep-playtest.mjs); registry: game id 'ramrod' is registered; dynamic-import: referenced from mounts/prefetch/main | script/e2e selector refs — keep (q-mp-241 rescan) |
| 4 | no | kept | unused-type | `src/games/remainder-islands/ai.ts` → `AIIslandChoice` | grep: no references outside defining module; registry: game id 'remainder-islands' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/star-track/ai.ts` → `AIChainChoice` | grep: no references outside defining module; registry: game id 'star-track' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/star-track/types.ts` → `StarTrackPosition` | grep: no references outside defining module; registry: game id 'star-track' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/stars-bars/ai.ts` → `AIMove` | grep: 27 file(s) outside defining module (src/games/pent-em-in/ai.ts, src/games/calla/ai.ts, src/games/queens-guards/ai.worker.ts); registry: game id 'stars-bars' is registered; dy | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/sum-dominoes/ai.ts` → `AIMove` | grep: 27 file(s) outside defining module (src/games/pent-em-in/ai.ts, src/games/calla/ai.ts, src/games/queens-guards/ai.worker.ts); registry: game id 'sum-dominoes' is registered;  | reachable via dynamic import or game registry |
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

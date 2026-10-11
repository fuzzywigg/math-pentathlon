# Dead-code inventory

**Task id:** `burn-1008-mp-dead-code-removal-exec`
**Generated:** 2026-10-10T22:20:29.318Z
**Fold order:** **FOLD LAST** (after every other wave5 tip draft)

## Method

1. `knip@5.88.1` with committed `knip.json` (HTML + `src/main.ts` + game workers + scripts/tests/docs entries so dynamic game mounts stay reachable).
2. `depcheck` for unused `dependencies` / `devDependencies`.
3. CSS class scan across `src/**/*.css` vs TS/HTML corpus (templates checked in ranking).
4. Feature-flag catalog from `feature-flags` / `settings-flags` / `url-flags` / `tablet-gl`.
5. Test-helper module + export reachability (including side-effect imports).
6. Every candidate verified with `rg` plus game-registry / dynamic-import checks (`game-route-mounts`, `game-prefetch`, `main`).

## Executed removals (this PR)

Re-verified on live tip then applied (**8** items). Skipped all safe-to-remove test-helper exports (leave for adoption batches such as q-mp-819/820; do not treat merged #526 as an open blocker).

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

No open PRs currently listed as adjacent cleanup blockers.

### Historical (not open blockers)

- PR #518 **MERGED** (UI helper dedupe): Shared seat/die/hex/timeout helpers — not dead-code removal
- PR #520 **CLOSED** (lint ratchet): ESLint rule enablement — not unused-symbol inventory
- PR #523 **MERGED** (module boundaries (in tip)): Import-graph / layering ratchet already folded
- PR #526 **MERGED** (test fixture consolidation): Helper moves/merges — inventory lists unused helper *exports* only

## Registry / dynamic imports

- Registry ids: 24 (20 playable games + 4 division hubs)
- Playable games: 20 (`kings-quadraphages`, `hex`, `star-track`, `hex-a-gone`, `calla`, `sum-dominoes`, `par-55`, `ramrod`, `kwatro-sinko`, `fiar`, `juggle`, `contig-60`, `stars-bars`, `fab-a-diffy`, `queens-guards`, `prime-gold`, `remainder-islands`, `pent-em-in`, `frac-fact`, `fraction-pinball`)
- Division hubs: 4 (`division-1`, `division-2`, `division-3`, `division-4`)
- Dynamic import specs observed: 32

## Dependencies

No unused direct `dependencies` or `devDependencies` (depcheck).

## Ranked removal list (remaining)

Rank 1 = strongest removal candidate; Rank 4 = keep.
**Safe-to-remove** applies to the *symbol/rule* unless `kind=file`.
**Disposition:** `removed` (this PR) / `deferred` (safe test-helper export — leave for adoption batches) / `kept` (do not remove).
This PR does **not** delete games, assets, or tests. File deletion only when `kind=file` and safe-to-remove=yes.

| Rank | Safe? | Disposition | Kind | Path / symbol | Evidence | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| 2 | yes | deferred | test-helper-export | `tests/unit/helpers/router-mock.ts` → `mockRouterNavigateModule` | grep: no references outside defining module | test helper with zero importers after grep |
| 3 | review | kept | unused-type | `src/core/ai-worker/client.ts` → `AiWorkerRequestPayload` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/ai-worker/protocol.ts` → `AiWorkerRequestBase` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/alignment/compat.ts` → `WrapOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/alignment/compat.ts` → `AlignmentOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/alignment/compat.ts` → `LineAlignmentResult` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/alignment/compat.ts` → `ConnectivityOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/alignment/compat.ts` → `RegionStats` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | no | kept | feature-flag | `src/core/feature-flags.ts` → `BOARD_3D_PARAM` | grep: 13 file(s) outside defining module (scripts/report-dead-code.mjs, tests/unit/mp3d-queens-guards-restore.test.ts, tests/unit/mp3d-hex-a-gone-board-select.test.ts) | tip-fold keeper after #497 (intentional export surface) |
| 3 | no | kept | feature-flag | `src/core/settings-flags.ts` → `resetSettingsFlagsForTests` | grep: 22 file(s) outside defining module (scripts/report-dead-code.mjs, tests/unit/mutation-ui21-reduced-motion.test.ts, tests/unit/q-mp-432-dice-ui-roller-residuals.test.ts) | tip-fold keeper after #497 (intentional export surface) |
| 3 | review | kept | unused-type | `src/core/timer-scoring.ts` → `FormatTimeOptions` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/timer-scoring.ts` → `ScoreEntry` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | review | kept | unused-type | `src/core/timer-scoring.ts` → `LeaderboardEntry` | grep: no references outside defining module | exported type unused outside module — often intentional public API |
| 3 | no | kept | feature-flag | `src/ui/three/tablet-gl.ts` → `BOARD_3D_LQ_PARAM` | grep: 2 file(s) outside defining module (scripts/report-dead-code.mjs, tests/unit/e2e-3d-timeout-config.test.ts) | tip-fold keeper after #497 (intentional export surface) |
| 3 | no | kept | feature-flag | `src/ui/three/tablet-gl.ts` → `BOARD_3D_LQ_STORAGE_KEY` | grep: 1 file(s) outside defining module (scripts/report-dead-code.mjs) | tip-fold keeper after #497 (intentional export surface) |
| 4 | no | kept | unused-type | `src/core/alignment/compat.ts` → `Dimensions` | grep: 3 file(s) outside defining module (src/games/par-55/board-ui.ts, src/games/kwatro-sinko/board-ui.ts, src/games/ramrod/board-ui.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/alignment/compat.ts` → `AlignmentCheckResult` | grep: 2 file(s) outside defining module (src/core/alignment/types.ts, src/core/alignment/grid-alignment.ts) | external references found |
| 4 | no | kept | feature-flag | `src/core/feature-flags.ts` → `BOARD_3D_STORAGE_KEY` | grep: 18 file(s) outside defining module (tests/unit/mutation-ui-feature-flags.test.ts, tests/unit/mp3d-queens-guards-restore.test.ts, tests/unit/mp3d-hex-a-gone-board-select.test. | flag constant used inside its defining module |
| 4 | no | kept | feature-flag | `src/core/feature-flags.ts` → `isBoard3dEnabled` | grep: 43 file(s) outside defining module (src/games/prime-gold/game-controller.ts, src/games/hex-a-gone/game-controller.ts, src/games/star-track/game-controller.ts) | flag is read at runtime |
| 4 | no | kept | unused-type | `src/core/safe-web-storage.ts` → `SafeJsonParseResult` | grep: 1 file(s) outside defining module (src/games/kings-quadraphages/serialization.ts) | external references found |
| 4 | no | kept | feature-flag | `src/core/settings-flags.ts` → `PROGRESS_STORAGE_KEY` | grep: 9 file(s) outside defining module (src/core/storage/index.ts, src/core/storage/storage.ts, tests/unit/storage-save-migration-fixtures.test.ts) | flag constant used inside its defining module |
| 4 | no | kept | feature-flag | `src/core/settings-flags.ts` → `getUserReducedMotionFlag` | grep: 11 file(s) outside defining module (src/core/dice/dice-ui.ts, src/core/graph/graph-ui.ts, src/ui/reduced-motion.ts) | flag is read at runtime |
| 4 | no | kept | feature-flag | `src/core/settings-flags.ts` → `setUserReducedMotionFlag` | grep: 19 file(s) outside defining module (src/core/storage/storage.ts, tests/unit/q-mp-197-owl-layout-reads.test.ts, tests/unit/q-mp-432-dice-ui-roller-residuals.test.ts) | flag is read at runtime |
| 4 | no | kept | export | `src/core/storage/index.ts` → `isPlainProgressObject` | grep: 5 file(s) outside defining module (src/core/storage/migrate.ts, src/core/storage/storage.ts, tests/unit/engine-coverage-round-18-burn-1008.test.ts) | external references found |
| 4 | no | kept | export | `src/core/storage/index.ts` → `sanitizeSettings` | grep: 5 file(s) outside defining module (src/core/storage/sanitize.ts, src/core/storage/migrate.ts, src/core/storage/storage.ts) | external references found |
| 4 | no | kept | unused-type | `src/core/timer-scoring.ts` → `GameResult` | grep: 17 file(s) outside defining module (src/core/storage/types.ts, src/core/storage/storage.ts, src/core/owl/owl-system.ts) | external references found |
| 4 | no | kept | feature-flag | `src/core/url-flags.ts` → `parseAllowlistedFlag` | grep: 5 file(s) outside defining module (src/ui/three/tablet-gl.ts, scripts/report-dead-code.mjs, tests/unit/mutation-ui-url-flags.test.ts) | flag constant used inside its defining module |
| 4 | no | kept | feature-flag | `src/core/url-flags.ts` → `readUrlOrStorageFlag` | grep: 7 file(s) outside defining module (src/core/feature-flags.ts, tests/unit/engine-coverage-round-10-burn-1008.test.ts, scripts/report-dead-code.mjs) | flag is read at runtime |
| 4 | no | kept | unused-type | `src/games/calla/ai.ts` → `MoveAnalysis` | grep: no references outside defining module; registry: game id 'calla' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/calla/ai.ts` → `AIMove` | grep: 30 file(s) outside defining module (src/games/pent-em-in/ai.ts, src/games/queens-guards/ai.worker.ts, src/games/queens-guards/ai.ts); registry: game id 'calla' is registered; | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/contig-60/ai.ts` → `AIPlacement` | grep: 1 file(s) outside defining module (src/games/prime-gold/ai.ts); registry: game id 'contig-60' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | export | `src/games/fab-a-diffy/ai-client.ts` → `cancelFabAiRequests` | grep: 1 file(s) outside defining module (tests/unit/burn-1010-ui-cov-r22-fab-a-diffy.test.ts); registry: game id 'fab-a-diffy' is registered; dynamic-import: referenced from mounts | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/fab-a-diffy/ai.ts` → `AISearchResult` | grep: 3 file(s) outside defining module (src/games/queens-guards/ai.ts, src/games/hex/ai.ts, src/games/fiar/ai.ts); registry: game id 'fab-a-diffy' is registered; dynamic-import: r | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/fiar/ai.ts` → `AISearchResult` | grep: 3 file(s) outside defining module (src/games/queens-guards/ai.ts, src/games/hex/ai.ts, src/games/fab-a-diffy/ai.ts); registry: game id 'fiar' is registered; dynamic-import: r | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/hex-a-gone/ai.ts` → `AISelectionResult` | grep: no references outside defining module; registry: game id 'hex-a-gone' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/hex-a-gone/ai.ts` → `AIPlacementResult` | grep: no references outside defining module; registry: game id 'hex-a-gone' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/hex/ai.ts` → `AISearchResult` | grep: 3 file(s) outside defining module (src/games/queens-guards/ai.ts, src/games/fab-a-diffy/ai.ts, src/games/fiar/ai.ts); registry: game id 'hex' is registered; dynamic-import: r | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/juggle/ai.ts` → `AIDieChoice` | grep: no references outside defining module; registry: game id 'juggle' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/juggle/ai.ts` → `AIShapeChoice` | grep: no references outside defining module; registry: game id 'juggle' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/juggle/ai.ts` → `AIPlacementChoice` | grep: no references outside defining module; registry: game id 'juggle' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/par-55/ai.ts` → `AIMove` | grep: 30 file(s) outside defining module (tests/unit/burn-wave42-fiar-ai-apply-noop-wrong-type.test.ts, tests/unit/ai-worker-parity-fab.test.ts, tests/unit/fiar-ai-null-draw-recove | reachable via dynamic import or game registry |
| 4 | no | kept | css-class | `src/games/par-55/par-55.css` → `par55-turn-hint` | grep: 1 file(s) outside defining module (scripts/par-55-deep-playtest.mjs); registry: game id 'par-55' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/prime-gold/ai.ts` → `AIPlacement` | grep: 1 file(s) outside defining module (src/games/contig-60/ai.ts); registry: game id 'prime-gold' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/queens-guards/ai.ts` → `AISearchResult` | grep: 3 file(s) outside defining module (src/games/hex/ai.ts, src/games/fiar/ai.ts, src/games/fab-a-diffy/ai.ts); registry: game id 'queens-guards' is registered; dynamic-import: r | reachable via dynamic import or game registry |
| 4 | no | kept | css-class | `src/games/ramrod/ramrod.css` → `ramrod-turn-hint` | grep: 1 file(s) outside defining module (scripts/ramrod-deep-playtest.mjs); registry: game id 'ramrod' is registered; dynamic-import: referenced from mounts/prefetch/main | reachable via dynamic import or game registry |
| 4 | no | kept | unused-type | `src/games/stars-bars/ai.ts` → `AIMove` | grep: 30 file(s) outside defining module (src/games/pent-em-in/ai.ts, src/games/calla/ai.ts, src/games/queens-guards/ai.worker.ts); registry: game id 'stars-bars' is registered; dy | reachable via dynamic import or game registry |
| 4 | no | kept | css-class | `src/style.css` → `difficulty-advanced` | grep: no references outside defining module; note: may be built via template literal — check className patterns | applied via `difficulty-${game.difficulty}` template |
| 4 | no | kept | css-class | `src/style.css` → `difficulty-beginner` | grep: no references outside defining module; note: may be built via template literal — check className patterns | applied via `difficulty-${game.difficulty}` template |
| 4 | no | kept | css-class | `src/style.css` → `difficulty-intermediate` | grep: no references outside defining module; note: may be built via template literal — check className patterns | applied via `difficulty-${game.difficulty}` template |
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

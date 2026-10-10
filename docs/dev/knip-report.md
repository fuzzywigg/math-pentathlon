# Knip unused-export drift (report-only)

**Task id:** `q-mp-118` (CI job) · triage `q-mp-170` (baseline + inventory)  
**Posture:** report-only CI job + local npm scripts. Never fails required lint/unit/build/e2e jobs.  
**Config:** committed [`knip.json`](../../knip.json)  
**Baseline:** [`knip-baseline.json`](./knip-baseline.json) (`enforce: false` until tip-owner approval)

## Commands

```bash
npm run report:knip              # knip vs baseline; exit 0; CI annotations on growth
npm run report:knip -- --json    # machine-readable metrics + diff
npm run report:knip -- --write-baseline  # refresh knip-baseline.json from current tip
npm run report:dead-code         # fuller inventory (knip + CSS + helpers → docs/dev/dead-code-inventory.*)
```

`report:knip` invokes pinned `knip@5.88.1` via `npx` (not a lockfile/`devDependencies` entry — knip’s transitive tree currently fails `npm audit`; keep the app lockfile at 0 vulnerabilities). No apt. No network inside unit/e2e tests.

## CI

Job `knip` in [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml):

- `permissions: contents: read` (workflow top-level)
- checkout `persist-credentials: false`
- `continue-on-error: true` on the job
- runs `npm run report:knip`
- emits `::warning::` when any tracked metric grows vs `knip-baseline.json`
- emits `::notice::` when within baseline or when a metric shrinks

Tracked metrics: `unusedFiles`, `unusedExports`, `unusedTypes`, `unusedDependencies`, `unusedDevDependencies`, `unlisted`, `duplicates`.

## q-mp-557 live metrics drift inventory (2026-10-10)

Report-only metrics-drift stamp on tip `cursor/mp-tip-post977` @ `f0d0a162`: live `unusedTypes` **32** vs committed baseline **36** (NOTICE shrink −4). Spec backlog (`q-mp-557` / draft `#1009` `q-mp-090s`) said tip post949 @ **32**/36 — **counts flat**; tip name remasured to post977 after `#977` fold. Prior post914 inventory (`#947` / `q-mp-463`) also **32**/36. Chart + tables + machine JSON: [`knip-live-metrics-drift-inventory-post977-2026-10-10.md`](./knip-live-metrics-drift-inventory-post977-2026-10-10.md) (+ [`.svg`](./knip-live-metrics-drift-inventory-post977-2026-10-10.svg) / [`.json`](./knip-live-metrics-drift-inventory-post977-2026-10-10.json)). Disposition: EXCLUDED_AI **20** · EXCLUDED_SCORING **4** · keeper **1** · Rank-3 alignment `compat.ts` ×**7** (no batch-14 demote headroom). **No baseline / knip config edit in that ticket.** Leave `#947`/`463`, `#888`/`394`, `#985`/`513`, `#971` open with **contained**.

## q-mp-513 unusedExports inventory (2026-10-10)

Report-only **unusedExports** stamp on tip `cursor/mp-tip-post949` @ `8698fffb`: live `report:knip` unusedExports **3** = committed baseline **3**. Spec backlog (`q-mp-513` / `backlog-2026-10-10h.md`) said tip post914 — **re-measured on post949**; counts unchanged. Chart + disposition + machine JSON: [`knip-unused-exports-inventory-post949-2026-10-10.md`](./knip-unused-exports-inventory-post949-2026-10-10.md) (+ [`.svg`](./knip-unused-exports-inventory-post949-2026-10-10.svg) / [`.json`](./knip-unused-exports-inventory-post949-2026-10-10.json)). Named exports under pinned knip@5.88.1: `isPlainProgressObject` + `sanitizeSettings` (`src/core/storage/index.ts`, LEAVE barrel) + `cancelFabAiRequests` (`src/games/fab-a-diffy/ai-client.ts`, EXCLUDED `q-mp-253`). Count delta: report:knip **3** · knip 5.88.1 compact file groups **2** · unpinned knip 6.x text **1** (storage pair dropped). **No baseline edit; no AI export deletes.** Leave `#947`/`463` unusedTypes drift + `#955`/`508` demotes open with **contained**.

## q-mp-463 live metrics drift inventory (2026-10-10)

Report-only metrics-drift stamp on tip `cursor/mp-tip-post914` @ `753052a6`: live `unusedTypes` **32** vs committed baseline **36** (NOTICE shrink −4). Spec backlog (`q-mp-463` / `backlog-2026-10-10f.md`) said **33** vs **36** on post898 — **stale by −1**. Prior post865 inventory (`#888` / `q-mp-394`) stamped **35**/36. Chart + tables + machine JSON: [`knip-live-metrics-drift-inventory-post914-2026-10-10.md`](./knip-live-metrics-drift-inventory-post914-2026-10-10.md) (+ [`.svg`](./knip-live-metrics-drift-inventory-post914-2026-10-10.svg) / [`.json`](./knip-live-metrics-drift-inventory-post914-2026-10-10.json)). Disposition: EXCLUDED_AI **20** · EXCLUDED_SCORING **4** · keeper **1** · Rank-3 alignment `compat.ts` ×**7**. Kings / pent-em-in / sum-dominoes `AIMove` left the unusedTypes listing vs `#888` (still exported; AI HOLD). **No baseline edit in that ticket** — demotes stay with `#921`/`458` + refill `479`. Superseded as tip truth by `q-mp-557` post977 stamp (leave `#947` open with **contained**).

## q-mp-394 live metrics drift inventory (2026-10-10)

Report-only metrics-drift stamp on tip `cursor/mp-tip-post865` @ `3908809d`: live `unusedTypes` **35** vs committed baseline **36** (NOTICE shrink −1). Spec backlog (`q-mp-394` / `#879`) said **43** vs **47** on post830 — **stale**; tip already carries `#869` batch-6 floor (baseline **36**). Chart + tables + machine JSON: [`knip-live-metrics-drift-inventory-post865-2026-10-10.md`](./knip-live-metrics-drift-inventory-post865-2026-10-10.md) (+ [`.svg`](./knip-live-metrics-drift-inventory-post865-2026-10-10.svg) / [`.json`](./knip-live-metrics-drift-inventory-post865-2026-10-10.json)). Residual Rank-3 candidates: alignment `compat.ts` ×**7**. AI / scoring / `SafeJsonParseResult` / `cancelFabAiRequests` marked out-of-scope. **No baseline edit in that ticket** — demotes stay with `q-mp-381` / `q-mp-408`. Superseded as tip truth by `q-mp-463` post914 stamp (leave `#888` open with **contained**).

## q-mp-356 unusedTypes demote batch 6 (2026-10-10)

Re-measured on tip `cursor/mp-tip-post830` @ `97487de6` after Rank-3-only demotes (skip AI / `rules.ts` / scoring / legal-move / intentional keepers): module-privated UI `GameMountDeps` / `PlayerSeat` / `GameModeChrome` / `PointerTapControllerOptions` / `PointerTapController` / `BindCanvasPointerTapOptions` / `GameModeLabel`. Baseline `unusedTypes` **47 → 36** (−7 demotes; tip live was already 43 vs baseline 47 before this batch). Spec backlog candidates (`GamePhase` aliases / hex-a-gone `PlacedBlock`/`TurnSelection`/`MoveRecord` / star-track `ChainLength`/`StarTrackMove` / fractions `FractionBarStyle`/`FractionBarColors`) are **stale** — still exported but not in live knip unusedTypes (internal importers). Skipped AI protocol / `*/ai.ts`, `timer-scoring`, `SafeJsonParseResult`, `SeatId` (test importers), and alignment/compat types. No AI/rules edits. Tip owner: take **min** with any pending knip-baseline draft (`#829` batch 5 already on tip tree) at fold.

## q-mp-365 Rank-3 unusedTypes candidate inventory (2026-10-10)

Report-only inventory on tip `cursor/mp-tip-post830` @ `97487de6`: live `unusedTypes` **43** (baseline still **47**, NOTICE shrink −4). Disposition chart + candidate tables (AI/scoring/`cancelFabAiRequests` excluded) live in [`knip-rank3-unused-types-inventory-2026-10-10.md`](./knip-rank3-unused-types-inventory-2026-10-10.md) (+ [`.svg`](./knip-rank3-unused-types-inventory-2026-10-10.svg) / [`.json`](./knip-rank3-unused-types-inventory-2026-10-10.json)). **No baseline edit in that ticket** — demotes stay with `q-mp-356` / `q-mp-381`. After `#869` fold, baseline is **36**.

## q-mp-332 unusedTypes demote batch 5 (2026-10-10)

Re-measured on tip `cursor/mp-tip-post785` after Rank-3-only demotes (skip AI / `rules.ts` / scoring / intentional keepers): module-privated PWA `BootstrapOwlOptions` / `BootstrapPwaOptions` / `IdleWarmOptions` / `RegisterPwaOptions` / `RegisterPwaResult`; UI `PixelPoint` / `TimeoutId` / `GenerationTimeoutHandle` / `ReducedMotionOptions` / `GameErrorBoundaryOptions` / `FocusedCellCoords`; kings `SaveInfo` / `GameStateFromJsonResult`; dropped unused `PieceType` re-export from `kings-quadraphages/board.ts` (canonical remains on `pieces.ts`). Baseline `unusedTypes` **61 → 47** (−14). No AI/rules edits. Tip owner: take **min** with any pending knip-baseline draft at fold. Skipped batch-4 symbols already on tip (`#823` / `#793`); skipped AI exports, `SafeJsonParseResult`, `timer-scoring`, and `SeatId` (test importers).

## q-mp-304 unusedTypes demote batch 4 (2026-10-09)

Re-measured on tip `cursor/mp-tip-post755` after Rank-3-only demotes (skip AI / `rules.ts` / scoring / intentional keepers): deleted unused `OrionGame` / `CamelGame` / graph `LayoutType` / polyomino `BoardCell` / `AnimateMoveHandle`; module-privated `AnimateMoveCancel`, `FormatFractionOptions`, `InteractiveBuilderOptions`, `SafeHtmlValue`, `DivisionInfo`, `TutorialEventHandler`, kings `CellClickHandler` / `BoardRendererOptions` / `GamePiece`. Baseline `unusedTypes` **75 → 61** (−14; tip had already shrunk 76→75 vs batch-3 floor). No AI/rules edits. Tip owner: take **min** with any pending knip-baseline draft at fold. Skipped batch-3 symbols already on tip (`#793`).

## q-mp-274 unusedTypes demote batch 3 (2026-10-09)

Re-measured on tip `cursor/mp-tip-post755` after Rank-3-only demotes (skip AI / `rules.ts` / scoring): module-privated FIAR `BoardEdge` / `CreateInitialStateOptions`; dropped unused type re-exports `BoardLayout` / `YellowCenterEllipse` / `YellowCenterDiamond` / `YellowCenterShape` from `fiar/types.ts` (canonical exports remain on `fiar/layout.ts`); deleted unused `StarTrackPosition`. Baseline `unusedTypes` **83 → 76** (−7). No AI/rules edits. Tip owner: take **min** with any pending knip-baseline draft at fold.

## q-mp-254 unusedTypes demote batch 2 (2026-10-09)

Re-measured on tip `cursor/mp-tip-post748` after Rank-3-only demotes (skip AI / `rules.ts`): deleted unused `RollCallback` / `DieSelectCallback`; module-privated `DiceSelectorOptions`, `WebStorageKind`, `SafeWriteResult`, `SafeReadResult`. Kept `SafeJsonParseResult` exported (documented mirror surface). Baseline `unusedTypes` **89 → 83** (−6). No AI/rules edits. Tip owner: take **min** with any pending knip-baseline draft (`#752` duplicates already on tip) at fold.

## q-mp-170 tip re-measure (2026-10-09)

Re-ran on live tip `cursor/mp-tip-post598` @ `7922f9af` (post-#598). Ticket evidence expected `unusedTypes` **95→96 (+1)**; live knip reported **91** (shrink vs prior baseline 95). No growth WARNING on tip. No AI public-surface type deleted (screening: report/hygiene only).

| Metric          | Prior baseline | Live tip | Action                                                                             |
| --------------- | -------------- | -------- | ---------------------------------------------------------------------------------- |
| `unusedTypes`   | 95             | 91       | baseline reconciled **downward** to 91                                             |
| `unusedExports` | 7              | 3        | `q-mp-188` rng alias + `q-mp-187` tablet-gl demote (BOARD_3D_LQ_*/MP3D_READY_ATTR) |
| `unlisted`      | 3              | 3        | documented below (owners)                                                          |
| `duplicates`    | 3              | 2        | `withSeededRandom` pair cleared in `q-mp-188`                                      |
| `enforce`       | `false`        | `false`  | **stays false**                                                                    |

## Unlisted script dependencies (owners)

Knip flags packages imported by entry scripts that are not declared in `package.json` `dependencies` / `devDependencies`. Counts are stable at **3**; do not raise the baseline. Re-measured on tip `cursor/mp-tip-post728` @ `a8a87187` (`q-mp-229`): still **3** (`esbuild` ×1 + `playwright` ×2). Left intentional — no `knip.json` allowlist / `ignoreDependencies` change (avoids fighting baseline editors; enforce stays `false`).

| Package      | Script(s)                                                                                                                                                                          | Owner / disposition                                                                                                                                                                                                                                                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `esbuild`    | [`scripts/check-emit-identity.mjs`](../../scripts/check-emit-identity.mjs) via `npm run check:emit-identity`                                                                       | **Emit-identity / type-ratchet tooling** (`docs/dev/ai-typeonly-option.md`). Present only as a Vite transitive (`vite` → `esbuild`); resolved from `node_modules` without a direct `devDependency`. Optional later: declare `esbuild` as a `devDependency`, or add to `knip.json` `ignoreDependencies` if tip owner prefers transitive-only. |
| `playwright` | [`scripts/probe-offline-resilience.mjs`](../../scripts/probe-offline-resilience.mjs), [`scripts/probe-offline-resilience-dev.mjs`](../../scripts/probe-offline-resilience-dev.mjs) | **Offline-resilience probe** (`docs/offline-resilience-2026-10-07.md`). Repo ships `@playwright/test` / `@axe-core/playwright`, not the bare `playwright` package name. Optional later: import from `@playwright/test`, or add `playwright` as a `devDependency`.                                                                            |

## Duplicate export pairs (owners)

Knip reports **0** alias pairs (same binding under two export names). Floor reached after `q-mp-273`.

Cleared in `q-mp-273`: `createCustomGameState` / `createRulesState` in [`tests/unit/helpers/kings-board.ts`](../../tests/unit/helpers/kings-board.ts) — callers migrated to canonical `createCustomGameState` (`duplicates` **1 → 0**).

Cleared in `q-mp-228`: `dismissOwl` / `dismissOwlIfNeeded` in [`tests/e2e/helpers/page.ts`](../../tests/e2e/helpers/page.ts) — callers migrated to canonical `dismissOwl` (narrows unfinished residue of `q-mp-166` / #691).

Cleared in `q-mp-188`: `withSeededRandom` / `withSeededMathRandom` in [`tests/helpers/rng.ts`](../../tests/helpers/rng.ts) — callers migrated to canonical `withSeededRandom`.

## Future ratchet (tip-owner only)

1. Lower counts in `knip-baseline.json` when tip unused surface shrinks (ratchets only go down).
2. Set `"enforce": true` (or run `npm run report:knip -- --fail`) only after tip-owner approval — then growth exits 1.
3. Do **not** promote this job to a required check until enforce is intentional.

## Related

- Full dead-code inventory (not a CI gate): `npm run report:dead-code` → [`dead-code-inventory.md`](./dead-code-inventory.md)
- Open draft `#591` orphan inventory is a one-shot tip cleanup, not this continuous knip report.
- Complementary CI job: `q-mp-118` / draft `#646` (does not replace this triage).

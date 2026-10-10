# q-mp-557 — Knip live metrics drift inventory (tip post977, 2026-10-10)

**Task id:** `q-mp-557`  
**Role:** worker (docs / data / chart only)  
**Tip audited:** `cursor/mp-tip-post977` @ `f0d0a162` (full `f0d0a162620f324bfa8cef244a665555113d9f44`)  
**Measured at:** `2026-10-10T14:53:09Z` (UTC)  
**Machine summary:** [`knip-live-metrics-drift-inventory-post977-2026-10-10.json`](./knip-live-metrics-drift-inventory-post977-2026-10-10.json)  
**Chart:** [`knip-live-metrics-drift-inventory-post977-2026-10-10.svg`](./knip-live-metrics-drift-inventory-post977-2026-10-10.svg)  
**Scope:** Dated **metrics-drift** stamp of live `npm run report:knip` vs committed [`knip-baseline.json`](./knip-baseline.json). **No `src/` edits. No `knip-baseline.json` edits. No type demotes. No knip config changes.**

## Purpose

Backlog `q-mp-557` (round 19 / draft `#1009` `q-mp-090s`, not yet on tip) was written against tip `cursor/mp-tip-post949` evidence: live `unusedTypes` **32** vs baseline **36** (NOTICE −4). Worker base is now `cursor/mp-tip-post977` (post949 folded via tip `#977`) — **re-measure on the live tip**. This PR is the tip-stamped drift inventory; it does **not** replace Rank-3 candidate planning ([`q-mp-365` / `#866`](./knip-rank3-unused-types-inventory-2026-10-10.md)) and does **not** lower the baseline (demotes stay out of this docs PR; conflict notes: **no** batch-14 demote — no new Rank-3 headroom beyond owned `compat.ts` ×7).

Prior stamps:

- [`q-mp-463` / `#947`](./knip-live-metrics-drift-inventory-post914-2026-10-10.md) on post914 (live **32** / baseline **36**)
- [`q-mp-394` / `#888`](./knip-live-metrics-drift-inventory-post865-2026-10-10.md) on post865 (live **35** / baseline **36**)

Leave `#947` / `#888` / `#985` / `#971` open with **contained**.

## Hard-rule HOLD (explicit)

- Do **not** demote AI protocol / `src/games/*/ai.ts` types
- Do **not** edit `*/rules.ts`, legal-move, or scoring (`src/core/timer-scoring.ts`)
- Do **not** change AI search, scoring, difficulty, or move timing; Hex Hard stays **450ms**
- Do **not** edit unused export `cancelFabAiRequests` (owned by undrafted `q-mp-253`)
- Do **not** edit `knip-baseline.json` from this docs PR (ratchets / demotes only go down in their own tickets)
- No `memory/` files

## Duplicate check (open drafts)

| Related draft / prior                                                                            | Overlap                                                                                                                    | Action                    |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| [#947](https://github.com/fuzzywigg/math-pentathlon/pull/947) `q-mp-463` post914 drift           | Prior tip stamp (32/36); superseded as tip truth by this post977 inventory                                                 | Leave open; **contained** |
| [#888](https://github.com/fuzzywigg/math-pentathlon/pull/888) `q-mp-394` post865 drift           | Older tip stamp (35/36)                                                                                                    | Leave open; **contained** |
| [#985](https://github.com/fuzzywigg/math-pentathlon/pull/985) `q-mp-513` unusedExports inv.      | Complementary (exports focus)                                                                                              | Leave open; **contained** |
| [#971](https://github.com/fuzzywigg/math-pentathlon/pull/971) `q-mp-090q` / backlog demotes note | Defines related demote owners; does not ship this inventory                                                                | Leave open; **contained** |
| [#1009](https://github.com/fuzzywigg/math-pentathlon/pull/1009) `q-mp-090s` backlog 10s          | Defines this task; does not ship the inventory                                                                             | Leave open                |
| [#866](https://github.com/fuzzywigg/math-pentathlon/pull/866) `q-mp-365` Rank-3 inv.             | Candidate **planning** @ post830                                                                                           | Leave open; complementary |
| Open `#1002`–`#1011` into post949                                                                | Engine / copy-pins / wiki / HOLD / soft-fail / lint / triage / backlog / mutation / wall — **none** own knip metrics-drift | Leave open                |
| Open drafts into `cursor/mp-tip-post977`                                                         | **None** at open time                                                                                                      | Full task proceeds        |

No open draft into `cursor/mp-tip-post977` already owns a post977 (or post949) knip **metrics-drift** inventory → full task proceeds.

## Method (live tip)

```text
$ git rev-parse HEAD
  f0d0a162620f324bfa8cef244a665555113d9f44

$ npm run report:knip -- --json
  unusedFiles: 0
  unusedExports: 3
  unusedTypes: 32
  unusedDependencies: 0
  unusedDevDependencies: 0
  unlisted: 3
  duplicates: 0
  [NOTICE] knip unused surface within baseline (exports=3, types=32, files=0)
  [NOTICE] knip unused shrink: unusedTypes 36→32 (-4)

$ npx knip@5.88.1 --include types --reporter compact
  # 32 exported types listed (see JSON + tables)

$ npx knip@5.88.1 --include exports --reporter compact
  src/core/storage/index.ts: isPlainProgressObject, sanitizeSettings
  src/games/fab-a-diffy/ai-client.ts: cancelFabAiRequests

$ npx knip@5.88.1 --include unlisted --reporter compact
  scripts/check-emit-identity.mjs: esbuild
  scripts/probe-offline-resilience-dev.mjs: playwright
  scripts/probe-offline-resilience.mjs: playwright

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  21:  hard: 450,
```

Listing captured with pinned `knip@5.88.1` / committed [`knip.json`](../../knip.json).

## Before → after metrics (report-only stamp)

| Metric          | Spec backlog (`q-mp-557` @ post949) | Prior inventory (`#947` post914) | Committed baseline on tip | Live tip `f0d0a162` / post977 | This PR                          |
| --------------- | ----------------------------------: | -------------------------------: | ------------------------: | ----------------------------: | -------------------------------- |
| `unusedTypes`   |                    **32** / 36 (−4) |                 **32** / 36 (−4) |                    **36** |            **32** (−4 NOTICE) | Docs only; **no** baseline write |
| `unusedExports` |                                   3 |                                3 |                         3 |                             3 | unchanged                        |
| `unlisted`      |                                   3 |                                3 |                         3 |                             3 | unchanged                        |
| `duplicates`    |                                   0 |                                0 |                         0 |                             0 | unchanged                        |
| Tip SHA stamp   |                 `d7a3989a` evidence |                       `753052a6` |           post977 payload |                **`f0d0a162`** | inventory + SVG + JSON           |

**Spec vs live tip:** backlog stamp (post949 @ `d7a3989a`) already said live **32** vs baseline **36**. Live knip on post977 is **identical** (flat vs `#947` post914 and vs backlog). Tip SHA / branch stamp only — no metric drift since post914.

### Drift story (flat since post914)

| Comparison                    | Prior live `unusedTypes` | Live post977 |                                                                                                                                      Δ |
| ----------------------------- | -----------------------: | -----------: | -------------------------------------------------------------------------------------------------------------------------------------: |
| vs `#947` post914             |                       32 |       **32** |                                                                                                                           **0 (flat)** |
| vs backlog `q-mp-557` post949 |                       32 |       **32** |                                                                                                                           **0 (flat)** |
| vs committed baseline         |                       36 |       **32** |                                                                                                              **−4 NOTICE** (unchanged) |
| vs `#888` post865             |                       35 |       **32** | **−3** (already explained in `#947`: kings / pent-em-in / sum-dominoes `AIMove` left unusedTypes listing; still exported; **AI HOLD**) |

No new types entered or left the unusedTypes listing between post914 (`753052a6`) and post977 (`f0d0a162`). Disposition buckets unchanged.

## Disposition overview (live 32)

![q-mp-557 Knip live metrics drift disposition](./knip-live-metrics-drift-inventory-post977-2026-10-10.svg)

| Disposition           |  Count | Meaning                                                              |
| --------------------- | -----: | -------------------------------------------------------------------- |
| `EXCLUDED_AI`         | **20** | Hard-rule HOLD — AI worker + per-game `ai.ts` result types           |
| `EXCLUDED_SCORING`    |  **4** | Hard-rule HOLD — `timer-scoring.ts`                                  |
| `INTENTIONAL_KEEPER`  |  **1** | `SafeJsonParseResult` (documented mirror surface)                    |
| **Rank-3 candidates** |  **7** | Alignment `compat.ts` only — **no** new headroom for batch-14 demote |
| Total live            | **32** | Matches `report:knip`                                                |

## Residual Rank-3 candidates (planning pointer — no demotes here)

### Alignment compat (`src/core/alignment/compat.ts`) — 7

| Type                   | Disposition      |
| ---------------------- | ---------------- |
| `Dimensions`           | Rank-3 candidate |
| `WrapOptions`          | Rank-3 candidate |
| `AlignmentOptions`     | Rank-3 candidate |
| `AlignmentCheckResult` | Rank-3 candidate |
| `LineAlignmentResult`  | Rank-3 candidate |
| `ConnectivityOptions`  | Rank-3 candidate |
| `RegionStats`          | Rank-3 candidate |

Demotes belong to a dedicated Rank-3 demote ticket (not this PR). Conflict note from backlog: **no** batch-14 demote — no Rank-3 headroom beyond these seven owned `compat.ts` symbols. Re-`rg` and re-run knip before demoting.

## Out-of-scope (do not touch from this inventory)

| Item                                                                   | Kind          | Owner / reason                                                       |
| ---------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------- |
| All `EXCLUDED_AI` types (20)                                           | unusedTypes   | Hard-rule HOLD                                                       |
| `FormatTimeOptions` / `ScoreEntry` / `LeaderboardEntry` / `GameResult` | unusedTypes   | Scoring HOLD                                                         |
| `SafeJsonParseResult`                                                  | unusedTypes   | Intentional keeper                                                   |
| `cancelFabAiRequests`                                                  | unusedExports | Undrafted `q-mp-253`                                                 |
| `isPlainProgressObject` / `sanitizeSettings`                           | unusedExports | Storage surface — leave for dedicated export triage (`#985` / `513`) |
| `esbuild` + `playwright` ×2                                            | unlisted      | Documented intentional (`knip-report.md`)                            |
| kings / pent-em-in / sum-dominoes `AIMove` (no longer in unusedTypes)  | —             | Still AI HOLD; not demote candidates                                 |

## Unused exports (live 3 — unchanged)

| Export                  | File                                 | Disposition               |
| ----------------------- | ------------------------------------ | ------------------------- |
| `isPlainProgressObject` | `src/core/storage/index.ts`          | Leave — not this ticket   |
| `sanitizeSettings`      | `src/core/storage/index.ts`          | Leave — not this ticket   |
| `cancelFabAiRequests`   | `src/games/fab-a-diffy/ai-client.ts` | **EXCLUDED** — `q-mp-253` |

## Cross-links

- Baseline file: [`knip-baseline.json`](./knip-baseline.json) (untouched here; `unusedTypes: 36`)
- Narrative + unlisted owners: [`knip-report.md`](./knip-report.md)
- Prior drift inventory (post914): [`knip-live-metrics-drift-inventory-post914-2026-10-10.md`](./knip-live-metrics-drift-inventory-post914-2026-10-10.md)
- Prior drift inventory (post865): [`knip-live-metrics-drift-inventory-post865-2026-10-10.md`](./knip-live-metrics-drift-inventory-post865-2026-10-10.md)
- UnusedExports inventory (post949): [`knip-unused-exports-inventory-post949-2026-10-10.md`](./knip-unused-exports-inventory-post949-2026-10-10.md)
- Prior Rank-3 candidate inventory: [`knip-rank3-unused-types-inventory-2026-10-10.md`](./knip-rank3-unused-types-inventory-2026-10-10.md)

## Acceptance

- [x] Tip SHA + metrics table for live post977 re-measure (spec was post949)
- [x] Visual chart + machine JSON
- [x] AI keepers + scoring + `cancelFabAiRequests` marked out-of-scope
- [x] Residual Rank-3 table (alignment compat ×7; no batch-14 demote)
- [x] Flat vs `#947` post914 and vs backlog `q-mp-557` stamp called out
- [x] No `knip-baseline.json` / `src/` / knip config / test behavior edits
- [x] `check:dev-docs` clean (verified in PR body)

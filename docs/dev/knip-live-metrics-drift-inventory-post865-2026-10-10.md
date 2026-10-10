# q-mp-394 — Knip live metrics drift inventory (tip post865, 2026-10-10)

**Task id:** `q-mp-394`  
**Role:** worker (docs / data / chart only)  
**Tip audited:** `cursor/mp-tip-post865` @ `3908809d` (full `3908809d672ed70eede7b9c0ad63a6fa475e28e5`)  
**Measured at:** `2026-10-10T05:54:50Z` (UTC)  
**Machine summary:** [`knip-live-metrics-drift-inventory-post865-2026-10-10.json`](./knip-live-metrics-drift-inventory-post865-2026-10-10.json)  
**Chart:** [`knip-live-metrics-drift-inventory-post865-2026-10-10.svg`](./knip-live-metrics-drift-inventory-post865-2026-10-10.svg)  
**Scope:** Dated **metrics-drift** stamp of live `npm run report:knip` vs committed [`knip-baseline.json`](./knip-baseline.json). **No `src/` edits. No `knip-baseline.json` edits. No type demotes.**

## Purpose

Backlog `q-mp-394` (round 12 / `#879`) was written against tip `cursor/mp-tip-post830` evidence: live `unusedTypes` **43** vs baseline **47**. User note for this worker: after `#869` / `q-mp-356` batch 6, baseline is **36** — **re-measure on live post865**. This PR is the tip-stamped drift inventory; it does **not** replace Rank-3 candidate planning ([`q-mp-365` / `#866`](./knip-rank3-unused-types-inventory-2026-10-10.md)) and does **not** lower the baseline (demotes stay with `q-mp-381` / `q-mp-408`).

## Hard-rule HOLD (explicit)

- Do **not** demote AI protocol / `src/games/*/ai.ts` types
- Do **not** edit `*/rules.ts`, legal-move, or scoring (`src/core/timer-scoring.ts`)
- Do **not** change AI search, scoring, difficulty, or move timing; Hex Hard stays **450ms**
- Do **not** edit unused export `cancelFabAiRequests` (owned by undrafted `q-mp-253`)
- Do **not** edit `knip-baseline.json` from this docs PR (ratchets / demotes only go down in their own tickets)
- No `memory/` files

## Duplicate check (open drafts)

| Related draft / prior                                                                 | Overlap                                                         | Action                                      |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------- |
| [#879](https://github.com/fuzzywigg/math-pentathlon/pull/879) `q-mp-090l` backlog 10c | Defines this task; does not ship the inventory                  | Leave open                                  |
| [#866](https://github.com/fuzzywigg/math-pentathlon/pull/866) `q-mp-365` Rank-3 inv.  | Candidate **planning** @ post830 (live 43 / baseline 47)        | Leave open; complementary (not drift stamp) |
| [#869](https://github.com/fuzzywigg/math-pentathlon/pull/869) `q-mp-356` batch 6      | **Code demotes** + baseline **47→36** (folded into tip payload) | Leave open; **contained** by tip tree       |
| [#877](https://github.com/fuzzywigg/math-pentathlon/pull/877) / `#878`                | Void brace / hex UI cov                                         | Orthogonal                                  |
| [#880](https://github.com/fuzzywigg/math-pentathlon/pull/880) `q-mp-395`              | Void clear in `reduced-motion`                                  | Orthogonal                                  |
| Undrafted `q-mp-381` / refill `q-mp-408`                                              | Future Rank-3 demotes / baseline writes                         | Complementary; this PR is report-only       |

No open draft into `cursor/mp-tip-post865` already owns a post865 knip **metrics-drift** inventory → full task proceeds.

## Method (live tip)

```text
$ git rev-parse HEAD
  3908809d672ed70eede7b9c0ad63a6fa475e28e5

$ npm run report:knip -- --json
  unusedFiles: 0
  unusedExports: 3
  unusedTypes: 35
  unusedDependencies: 0
  unusedDevDependencies: 0
  unlisted: 3
  duplicates: 0
  [NOTICE] knip unused surface within baseline (exports=3, types=35, files=0)
  [NOTICE] knip unused shrink: unusedTypes 36→35 (-1)

$ npx knip@5.88.1 --include types --reporter compact
  # 35 exported types listed (see JSON + tables)

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

| Metric          | Spec backlog (`q-mp-394` @ post830) | Committed baseline on tip | Live tip `3908809d` / post865 | This PR                          |
| --------------- | ----------------------------------: | ------------------------: | ----------------------------: | -------------------------------- |
| `unusedTypes`   |                         **43** / 47 |                    **36** |            **35** (−1 NOTICE) | Docs only; **no** baseline write |
| `unusedExports` |                                   3 |                         3 |                             3 | unchanged                        |
| `unlisted`      |                                   3 |                         3 |                             3 | unchanged                        |
| `duplicates`    |                                   0 |                         0 |                             0 | unchanged                        |
| Tip SHA stamp   |                 `bcf6f825` evidence |           post865 payload |                **`3908809d`** | inventory + SVG + JSON           |

**Spec staleness:** backlog said live **43** vs baseline **47**. Tip already carries `#869` batch-6 floor (baseline **36**). Live knip on post865 is **35** (NOTICE shrink **−1** vs baseline).

### Drift story (why −1)

After `#869` demoted the **7** UI Rank-3 types from the `#866` list, the arithmetic expectation was live **36** (= prior live 43 − 7). Live post865 is **35**. The missing name vs the post-`#869` projection of the `#866` inventory is:

| Gone from live `unusedTypes` | Canonical file      | Note                                                                                                                                                                    |
| ---------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SeatId`                     | `src/core/seats.ts` | `#866` also listed a seat-labels re-export under unusedTypes. That re-export remains in source; knip on post865 no longer lists it. **Not** a baseline edit in this PR. |

## Disposition overview (live 35)

![q-mp-394 Knip live metrics drift disposition](./knip-live-metrics-drift-inventory-post865-2026-10-10.svg)

| Disposition           |  Count | Meaning                                                             |
| --------------------- | -----: | ------------------------------------------------------------------- |
| `EXCLUDED_AI`         | **23** | Hard-rule HOLD — AI worker + per-game `ai.ts` result types          |
| `EXCLUDED_SCORING`    |  **4** | Hard-rule HOLD — `timer-scoring.ts`                                 |
| `INTENTIONAL_KEEPER`  |  **1** | `SafeJsonParseResult` (documented mirror surface)                   |
| **Rank-3 candidates** |  **7** | Alignment `compat.ts` only — fodder for `381` / `408` after re-`rg` |
| Total live            | **35** | Matches `report:knip`                                               |

UI Rank-3 helpers from `#866` (`GameMountDeps` / `PlayerSeat` / `GameModeChrome` / pointer-hygiene trio / `GameModeLabel`) are **gone** from live unusedTypes after `#869` — do not re-queue them.

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

Demotes belong to `q-mp-381` / `q-mp-408`, not this PR. Re-`rg` and re-run knip before demoting.

## Out-of-scope (do not touch from this inventory)

| Item                                                                                   | Kind          | Owner / reason                                          |
| -------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------- |
| All `EXCLUDED_AI` types (23)                                                           | unusedTypes   | Hard-rule HOLD                                          |
| `FormatTimeOptions` / `ScoreEntry` / `LeaderboardEntry` / `GameResult`                 | unusedTypes   | Scoring HOLD                                            |
| `SafeJsonParseResult`                                                                  | unusedTypes   | Intentional keeper                                      |
| `cancelFabAiRequests`                                                                  | unusedExports | Undrafted `q-mp-253`                                    |
| `isPlainProgressObject` / `sanitizeSettings`                                           | unusedExports | Storage surface — leave for dedicated export triage     |
| `esbuild` + `playwright` ×2                                                            | unlisted      | Documented intentional (`knip-report.md`)               |
| Stale backlog GamePhase / hex-a-gone / FractionBar / LayoutNode / WinCondition cluster | —             | Still **not** in live knip unusedTypes (same as `#866`) |

## Unused exports (live 3 — unchanged)

| Export                  | File                                 | Disposition               |
| ----------------------- | ------------------------------------ | ------------------------- |
| `isPlainProgressObject` | `src/core/storage/index.ts`          | Leave — not this ticket   |
| `sanitizeSettings`      | `src/core/storage/index.ts`          | Leave — not this ticket   |
| `cancelFabAiRequests`   | `src/games/fab-a-diffy/ai-client.ts` | **EXCLUDED** — `q-mp-253` |

## Cross-links

- Baseline file: [`knip-baseline.json`](./knip-baseline.json) (untouched here; `unusedTypes: 36`)
- Narrative + unlisted owners: [`knip-report.md`](./knip-report.md)
- Prior Rank-3 candidate inventory: [`knip-rank3-unused-types-inventory-2026-10-10.md`](./knip-rank3-unused-types-inventory-2026-10-10.md)

## Acceptance

- [x] Tip SHA + metrics table for live post865 re-measure
- [x] Visual chart + machine JSON
- [x] AI keepers + scoring + `cancelFabAiRequests` marked out-of-scope
- [x] Residual Rank-3 table (alignment compat ×7)
- [x] Spec staleness called out (43/47 → live 35 / baseline 36)
- [x] No `knip-baseline.json` / `src/` / test behavior edits
- [x] `check:dev-docs` clean (verified in PR body)

# q-mp-463 — Knip live metrics drift inventory (tip post914, 2026-10-10)

**Task id:** `q-mp-463`  
**Role:** worker (docs / data / chart only)  
**Tip audited:** `cursor/mp-tip-post914` @ `753052a6` (full `753052a6844e80c6264d1d2480deafa5a9e7b59c`)  
**Measured at:** `2026-10-10T09:22:35Z` (UTC)  
**Machine summary:** [`knip-live-metrics-drift-inventory-post914-2026-10-10.json`](./knip-live-metrics-drift-inventory-post914-2026-10-10.json)  
**Chart:** [`knip-live-metrics-drift-inventory-post914-2026-10-10.svg`](./knip-live-metrics-drift-inventory-post914-2026-10-10.svg)  
**Scope:** Dated **metrics-drift** stamp of live `npm run report:knip` vs committed [`knip-baseline.json`](./knip-baseline.json). **No `src/` edits. No `knip-baseline.json` edits. No type demotes.**

## Purpose

Backlog `q-mp-463` (round 15 / `docs/dev/backlog-2026-10-10f.md`) was written against tip `cursor/mp-tip-post898` evidence: live `unusedTypes` **33** vs baseline **36** (NOTICE −3). Worker base is now `cursor/mp-tip-post914` — **re-measure on the live tip**. This PR is the tip-stamped drift inventory; it does **not** replace Rank-3 candidate planning ([`q-mp-365` / `#866`](./knip-rank3-unused-types-inventory-2026-10-10.md)) and does **not** lower the baseline (demotes stay with open `#921` / `q-mp-458` + refill `q-mp-479`).

Prior stamp: [`q-mp-394` / `#888`](./knip-live-metrics-drift-inventory-post865-2026-10-10.md) on post865 (live **35** / baseline **36**). Leave `#888` open with **contained**.

## Hard-rule HOLD (explicit)

- Do **not** demote AI protocol / `src/games/*/ai.ts` types
- Do **not** edit `*/rules.ts`, legal-move, or scoring (`src/core/timer-scoring.ts`)
- Do **not** change AI search, scoring, difficulty, or move timing; Hex Hard stays **450ms**
- Do **not** edit unused export `cancelFabAiRequests` (owned by undrafted `q-mp-253`)
- Do **not** edit `knip-baseline.json` from this docs PR (ratchets / demotes only go down in their own tickets)
- No `memory/` files

## Duplicate check (open drafts)

| Related draft / prior | Overlap | Action |
| --- | --- | --- |
| [#888](https://github.com/fuzzywigg/math-pentathlon/pull/888) `q-mp-394` post865 drift | Prior tip stamp (35/36); superseded as tip truth by this post914 inventory | Leave open; **contained** |
| [#921](https://github.com/fuzzywigg/math-pentathlon/pull/921) `q-mp-090n` / `458` knip batch 10 | Demotes + baseline write | Leave open; complementary |
| [#934](https://github.com/fuzzywigg/math-pentathlon/pull/934) `q-mp-090o` backlog 10f | Defines this task; does not ship the inventory | Leave open |
| [#866](https://github.com/fuzzywigg/math-pentathlon/pull/866) `q-mp-365` Rank-3 inv. | Candidate **planning** @ post830 | Leave open; complementary |
| [#869](https://github.com/fuzzywigg/math-pentathlon/pull/869) `q-mp-356` batch 6 | Code demotes + baseline **47→36** (tip-contained) | Leave open; **contained** |
| [#935](https://github.com/fuzzywigg/math-pentathlon/pull/935) `q-mp-456` engine cov r15 | Tests-only | Orthogonal; leave open |
| Undrafted `q-mp-479` (+ `433`/`408`/`381`) | Future Rank-3 demotes / baseline writes | Complementary; this PR is report-only |

No open draft into `cursor/mp-tip-post914` already owns a post914 knip **metrics-drift** inventory → full task proceeds.

## Method (live tip)

```text
$ git rev-parse HEAD
  753052a6844e80c6264d1d2480deafa5a9e7b59c

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

| Metric | Spec backlog (`q-mp-463` @ post898) | Prior inventory (`#888` post865) | Committed baseline on tip | Live tip `753052a6` / post914 | This PR |
| --- | ---: | ---: | ---: | ---: | --- |
| `unusedTypes` | **33** / 36 (−3) | **35** / 36 (−1) | **36** | **32** (−4 NOTICE) | Docs only; **no** baseline write |
| `unusedExports` | 3 | 3 | 3 | 3 | unchanged |
| `unlisted` | 3 | 3 | 3 | 3 | unchanged |
| `duplicates` | 0 | 0 | 0 | 0 | unchanged |
| Tip SHA stamp | `788b4558` evidence | `3908809d` | post914 payload | **`753052a6`** | inventory + SVG + JSON |

**Spec staleness:** backlog said live **33** vs baseline **36** on post898. Live knip on post914 is **32** (NOTICE shrink **−4** vs baseline; **−1** vs backlog stamp).

### Drift story (why −4 vs baseline / −3 vs post865)

| Gone from live `unusedTypes` vs `#888` post865 list | Canonical file | Note |
| --- | --- | --- |
| `AIMove` | `src/games/kings-quadraphages/ai.ts` | Still exported; knip no longer lists it. **AI HOLD** — not a demote. |
| `AIMove` | `src/games/pent-em-in/ai.ts` | Still exported; knip no longer lists it. **AI HOLD** — not a demote. |
| `AIMove` | `src/games/sum-dominoes/ai.ts` | Still exported; knip no longer lists it. **AI HOLD** — not a demote. |

These three AI result types dropped from the unusedTypes listing between post865 (`35`) and post914 (`32`). They remain exported interfaces — analysis / consumer drift only. Do **not** treat as Rank-3 fodder and do **not** edit AI files from this ticket.

## Disposition overview (live 32)

![q-mp-463 Knip live metrics drift disposition](./knip-live-metrics-drift-inventory-post914-2026-10-10.svg)

| Disposition | Count | Meaning |
| --- | ---: | --- |
| `EXCLUDED_AI` | **20** | Hard-rule HOLD — AI worker + per-game `ai.ts` result types |
| `EXCLUDED_SCORING` | **4** | Hard-rule HOLD — `timer-scoring.ts` |
| `INTENTIONAL_KEEPER` | **1** | `SafeJsonParseResult` (documented mirror surface) |
| **Rank-3 candidates** | **7** | Alignment `compat.ts` only — fodder for `458` / `479` after re-`rg` |
| Total live | **32** | Matches `report:knip` |

## Residual Rank-3 candidates (planning pointer — no demotes here)

### Alignment compat (`src/core/alignment/compat.ts`) — 7

| Type | Disposition |
| --- | --- |
| `Dimensions` | Rank-3 candidate |
| `WrapOptions` | Rank-3 candidate |
| `AlignmentOptions` | Rank-3 candidate |
| `AlignmentCheckResult` | Rank-3 candidate |
| `LineAlignmentResult` | Rank-3 candidate |
| `ConnectivityOptions` | Rank-3 candidate |
| `RegionStats` | Rank-3 candidate |

Demotes belong to `#921` / `q-mp-458` and refill `q-mp-479`, not this PR. Re-`rg` and re-run knip before demoting.

## Out-of-scope (do not touch from this inventory)

| Item | Kind | Owner / reason |
| --- | --- | --- |
| All `EXCLUDED_AI` types (20) | unusedTypes | Hard-rule HOLD |
| `FormatTimeOptions` / `ScoreEntry` / `LeaderboardEntry` / `GameResult` | unusedTypes | Scoring HOLD |
| `SafeJsonParseResult` | unusedTypes | Intentional keeper |
| `cancelFabAiRequests` | unusedExports | Undrafted `q-mp-253` |
| `isPlainProgressObject` / `sanitizeSettings` | unusedExports | Storage surface — leave for dedicated export triage |
| `esbuild` + `playwright` ×2 | unlisted | Documented intentional (`knip-report.md`) |
| kings / pent-em-in / sum-dominoes `AIMove` (no longer in unusedTypes) | — | Still AI HOLD; not demote candidates |

## Unused exports (live 3 — unchanged)

| Export | File | Disposition |
| --- | --- | --- |
| `isPlainProgressObject` | `src/core/storage/index.ts` | Leave — not this ticket |
| `sanitizeSettings` | `src/core/storage/index.ts` | Leave — not this ticket |
| `cancelFabAiRequests` | `src/games/fab-a-diffy/ai-client.ts` | **EXCLUDED** — `q-mp-253` |

## Cross-links

- Baseline file: [`knip-baseline.json`](./knip-baseline.json) (untouched here; `unusedTypes: 36`)
- Narrative + unlisted owners: [`knip-report.md`](./knip-report.md)
- Prior drift inventory (post865): [`knip-live-metrics-drift-inventory-post865-2026-10-10.md`](./knip-live-metrics-drift-inventory-post865-2026-10-10.md)
- Prior Rank-3 candidate inventory: [`knip-rank3-unused-types-inventory-2026-10-10.md`](./knip-rank3-unused-types-inventory-2026-10-10.md)

## Acceptance

- [x] Tip SHA + metrics table for live post914 re-measure
- [x] Visual chart + machine JSON
- [x] AI keepers + scoring + `cancelFabAiRequests` marked out-of-scope
- [x] Residual Rank-3 table (alignment compat ×7)
- [x] Spec staleness called out (backlog 33/36 → live **32** / baseline **36**)
- [x] No `knip-baseline.json` / `src/` / test behavior edits
- [x] `check:dev-docs` clean (verified in PR body)

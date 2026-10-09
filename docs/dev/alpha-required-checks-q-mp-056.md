# q-mp-056 — Alpha required checks recommendation (report-only)

**Task id:** `q-mp-056`  
**Audience:** Andrew (owner decides; this doc changes nothing)  
**Repo:** `fuzzywigg/math-pentathlon`  
**Workflow:** `.github/workflows/ci.yml` (`name: CI`)  
**Tip context at authoring:** `cursor/integration-fold-wave5-tip-4af0` @ `9748c908` (PR #477)  
**`alpha` HEAD at authoring:** `eec2b327` (`protected: false` — no required status checks)

## Goal

`alpha` currently has **no required checks**. From recent `ci.yml` runs on `alpha` pushes and `cursor/**` PRs, summarize **per-job pass rate and duration**, then recommend a **required set** for alpha branch protection. Alpha push deploys production (see #587); required checks are the main merge/deploy gate if/when protection is enabled.

**This is report-only.** No branch protection, workflow, or code changes are proposed here for automatic application.

## Methodology

| Item | Definition |
| --- | --- |
| Source | GitHub Actions `ci.yml` runs via `gh run list` / `gh api …/jobs` (read-only) |
| Pass rate | `success / (success + failure)` — cancelled and skipped excluded from the denominator |
| Duration | Job wall time `completed_at − started_at` for `success`/`failure` only (seconds) |
| Cohorts | (A) last 50 `ci.yml` runs (any conclusion; recent tip churn is nearly all `cursor/**`); (B) last 50 **completed** (`success`/`failure`) `cursor/**` runs; (C) last 30 **`alpha` push** runs |
| Check names | Status check names match job `name` values (`lint`, `audit`, `build`, `unit`, `e2e`, …) as shown by `gh pr checks` |

**Interpretation notes**

- Tip fold concurrency (`cancel-in-progress: true`) cancels many superseded `cursor/**` runs; cohort (A) has a high cancel rate and understates “finished” pass rates.
- Many open draft PRs fail `lint` / `unit` intentionally while WIP; cohort (B) pass rates are **not** flake rates for green tips.
- Cohort (C) is the best proxy for “what lands on production-bound `alpha`,” but those runs predate several report-only jobs now present on the tip workflow (fullgame, mobile, zoom-reflow, forced-colors, cross-browser, visual-baseline).
- Jobs marked `continue-on-error: true` in `ci.yml` are **report-only**. Several also soft-succeed the job after step failure (`exit 0`), so job-level “success” ≠ underlying audit clean. `e2e-cross-browser` is the exception: job conclusion tracks real failures while the workflow stays green.

## Workflow job inventory (live `ci.yml`)

| Job | Role today | Depends on |
| --- | --- | --- |
| `lint` | Blocking — ESLint, format, typecheck, ratchets, boundaries | — |
| `audit` | Blocking — `npm audit --audit-level=high` | — |
| `build` | Blocking — production build + dist + JS chunk budget | `audit` |
| `unit` | Blocking — unit suite | — |
| `e2e` | Blocking — Chromium smoke / bug-guards / mp3d | `build` |
| `e2e-fullgame` | Report-only (`continue-on-error`) | `build` |
| `mobile-touch` | Report-only | `build` |
| `zoom-reflow` | Report-only | `build` |
| `forced-colors` | Report-only | `build` |
| `e2e-cross-browser` | Report-only (Firefox + WebKit; job fails, workflow continues) | `build` |
| `visual-baseline` | Report-only | — |

## Per-job tables

### A — Last 50 `ci.yml` runs (any conclusion)

Snapshot window: **2026-10-09T02:04:21Z → 2026-10-08T13:17:56Z** (all `cursor/**` at sample time; no fresh `alpha` pushes in that window).

Run-level (workflow conclusion): success **10**, failure **13**, cancelled **26**, in-progress/empty **1**.

| Job | N | Success | Failure | Cancel | Pass % (decided) | Median | Mean | p95 | Min | Max |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| audit | 43 | 40 | 0 | 3 | 100.0% | 20s | 20s | 23s | 14s | 29s |
| build | 43 | 37 | 0 | 6 | 100.0% | 29s | 31s | 39s | 22s | 52s |
| e2e | 43 | 25 | 3 | 15 | 89.3% | 255s | 314s | 771s | 205s | 776s |
| e2e-cross-browser | 43 | 7 | 16 | 20 | 30.4% | 1412s | 1212s | 2282s | 400s | 2306s |
| e2e-fullgame | 43 | 34 | 0 | 9 | 100.0%* | 130s | 151s | 245s | 116s | 256s |
| forced-colors | 43 | 36 | 0 | 7 | 100.0%* | 55s | 67s | 73s | 43s | 439s |
| lint | 43 | 12 | 26 | 5 | 31.6% | 43s | 45s | 58s | 31s | 61s |
| mobile-touch | 43 | 36 | 0 | 7 | 100.0%* | 75s | 90s | 156s | 54s | 355s |
| unit | 43 | 24 | 7 | 12 | 77.4% | 399s | 370s | 423s | 244s | 425s |
| visual-baseline | 43 | 35 | 0 | 8 | 100.0%* | 170s | 167s | 186s | 125s | 194s |
| zoom-reflow | 43 | 36 | 0 | 7 | 100.0%* | 63s | 92s | 98s | 47s | 868s |

\*Job-level success includes report-only soft-pass paths; do not treat as “audit clean.”

### B — Last 50 completed (`success`/`failure`) `cursor/**` runs

Window: **2026-10-08T23:27:15Z → 2026-10-08T08:56:12Z**.  
Run-level: success **13**, failure **37** (mostly WIP draft failures, especially `lint`).

| Job | N | Success | Failure | Cancel | Pass % (decided) | Median | Mean | p95 | Min | Max |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| audit | 50 | 50 | 0 | 0 | 100.0% | 20s | 20s | 24s | 14s | 31s |
| build | 50 | 50 | 0 | 0 | 100.0% | 29s | 30s | 37s | 22s | 52s |
| e2e | 50 | 41 | 7 | 2 | 85.4% | 328s | 327s | 737s | 205s | 776s |
| e2e-cross-browser | 50 | 7 | 42 | 1 | 14.3% | 1440s | 1412s | 2306s | 400s | 3462s |
| e2e-fullgame | 50 | 50 | 0 | 0 | 100.0%* | 229s | 211s | 493s | 116s | 509s |
| forced-colors | 50 | 50 | 0 | 0 | 100.0%* | 54s | 63s | 73s | 42s | 439s |
| lint | 50 | 14 | 36 | 0 | 28.0% | 43s | 44s | 58s | 26s | 59s |
| mobile-touch | 50 | 50 | 0 | 0 | 100.0%* | 74s | 83s | 142s | 54s | 393s |
| unit | 50 | 43 | 7 | 0 | 86.0% | 401s | 369s | 424s | 244s | 432s |
| visual-baseline | 50 | 50 | 0 | 0 | 100.0%* | 170s | 166s | 185s | 125s | 200s |
| zoom-reflow | 50 | 50 | 0 | 0 | 100.0%* | 66s | 93s | 263s | 47s | 868s |

### C — Last 30 `alpha` push runs

Window: **2026-10-07T21:16:53Z → 2026-09-26T10:20:03Z**.  
Run-level: success **29**, failure **1**.  
Job set on these historical runs: **`lint`, `audit`, `build`, `unit`, `e2e` only** (report-only jobs not yet in that alpha-era graph).

| Job | N | Success | Failure | Cancel | Pass % (decided) | Median | Mean | p95 | Min | Max |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| audit | 30 | 30 | 0 | 0 | 100.0% | 15s | 15s | 19s | 10s | 19s |
| build | 30 | 30 | 0 | 0 | 100.0% | 23s | 23s | 28s | 15s | 28s |
| e2e | 30 | 30 | 0 | 0 | 100.0% | 235s | 225s | 410s | 132s | 544s |
| lint | 30 | 30 | 0 | 0 | 100.0% | 29s | 28s | 32s | 22s | 33s |
| unit | 30 | 29 | 1 | 0 | 96.7% | 140s | 752s† | 1756s | 81s | 1791s |

†Mean inflated by older TOKENMAXX-era long unit jobs; current tip `unit` median is ~6–7 minutes.

## Recommended required set for `alpha` (Andrew decides)

### Require (blocking jobs only)

| Required check name | Why |
| --- | --- |
| `lint` | Fast static gate (types, format, ratchets, boundaries). 100% on recent alpha pushes; failures on drafts are real WIP signal, not flake. |
| `audit` | Keeps high-severity dependency holes off the production branch. 100% pass; ~15–20s; also unlocks `build`. |
| `build` | Direct production-artifact gate (alpha push deploys). 100% pass; enforces `dist/` + JS chunk budget. |
| `unit` | Engine/UI logic safety net. 96.7% on last 30 alpha pushes (single historical failure); current duration ~6–7 min median on tip. |
| `e2e` | Chromium smoke + regression guards for player-facing shell/boards. 100% on last 30 alpha pushes; ~4–6 min typical. |

**Suggested GitHub branch protection settings (manual, owner-only):**

1. Protect `alpha`.
2. Require status checks to pass before merging: **`lint`, `audit`, `build`, `unit`, `e2e`**.
3. Require branches to be up to date before merging (optional but recommended once tip→alpha land cadence is calm).
4. Do **not** require the report-only jobs below.
5. Keep workflow least-privilege as-is (`permissions: contents: read`, `persist-credentials: false`) — out of scope to change here.

### Do not require (report-only / unstable as gates)

| Check | Why exclude from required set |
| --- | --- |
| `e2e-cross-browser` | Explicitly report-only; decided pass rate ~14–30%; wall time often 20–40+ minutes; would block alpha for Firefox/WebKit triage noise. |
| `e2e-fullgame` | Report-only with soft-success; job “green” does not mean fullgame clean; long-tail timeouts. |
| `mobile-touch` | Report-only soft-success; useful signal, not a merge gate yet. |
| `zoom-reflow` | Report-only soft-success; a11y findings should not block deploy until ratified. |
| `forced-colors` | Report-only soft-success. |
| `visual-baseline` | Report-only soft-success; baseline churn is expected during UI folds. |

### Optional later (not recommended now)

- Promote **one** report-only suite to required only after ≥2 weeks of tip runs with decided pass rate ≥98% **and** soft-pass removed (so job conclusion matches findings).
- First candidate after hardening: `mobile-touch` or a narrowed `e2e-cross-browser` smoke — **not** full cross-browser or fullgame.

## Risk callouts for Andrew

1. **Alpha deploys production** (#587). Required checks on `alpha` protect merges *into* alpha; they do not by themselves stop direct pushes unless “restrict who can push” / rulesets also apply. Confirm whether alpha allows direct pushes today (`protected: false` at authoring).
2. **Tip PR #477** is green (22/22 checks) but still based on wave4 tip, not `alpha`. Enabling required checks on `alpha` before the tip land does not block tip fold work; it gates the eventual tip→alpha / stack-promotion merge.
3. **Do not require soft-success jobs** — that would create a false sense of protection.
4. Worker agents must not apply protection settings; owner (or Grok Bot process) only.

## Verification commands (read-only)

Exact commands run for this report (results summarized; re-run anytime):

```bash
# Last 50 CI runs (ci.yml)
gh run list --repo fuzzywigg/math-pentathlon --workflow=ci.yml --limit 50 \
  --json databaseId,conclusion,status,event,headBranch,displayTitle,createdAt,url
```

Result (2026-10-09 sample): `count=50`; conclusions ≈ success 10 / failure 13 / cancelled 26 / in-progress 1; all sampled head branches were `cursor/**` (no alpha push in that window).

```bash
# Last 30 alpha push CI runs
gh run list --repo fuzzywigg/math-pentathlon --workflow=ci.yml --branch alpha --limit 30 \
  --json databaseId,conclusion,event,headBranch,displayTitle,createdAt,url
```

Result: `count=30`; success 29 / failure 1; newest `2026-10-07T21:16:53Z`, oldest `2026-09-26T10:20:03Z`.

```bash
# Per-job names + conclusions + timestamps (example successful PR run)
gh api repos/fuzzywigg/math-pentathlon/actions/runs/37859517785/jobs \
  --jq '.jobs[] | [.name,.conclusion,.started_at,.completed_at] | @tsv'
```

Result: jobs `unit`, `visual-baseline`, `lint`, `audit`, `build`, `e2e-fullgame`, `mobile-touch`, `forced-colors`, `zoom-reflow`, `e2e-cross-browser`, `e2e` — all `success` on that run.

```bash
# Confirm alpha protection state
gh api repos/fuzzywigg/math-pentathlon/branches/alpha --jq '{name,protected}'
```

Result: `{"name":"alpha","protected":false}` (protection details API returns 403 to this token; `protected:false` is sufficient to confirm no required checks).

```bash
# Check names as they appear for branch protection (tip PR)
gh pr checks 477 --repo fuzzywigg/math-pentathlon
```

Result: check names are bare job names (`lint`, `audit`, `build`, `unit`, `e2e`, …).

## Out of scope / non-actions

- No edits to `.github/workflows/*`, branch rules, labels, or other PRs.
- No AI / scoring / rules-text / player-facing changes.
- Next action after fold: Andrew enables the recommended required set on `alpha` if he agrees.

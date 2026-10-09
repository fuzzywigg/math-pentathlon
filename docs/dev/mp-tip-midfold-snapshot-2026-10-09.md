# Midfold tip snapshot — Fri Oct 9 2026 (q-mp-028)

**Task id:** `q-mp-028`  
**Role:** worker (report-only)  
**Audience:** tip owner (`q-mp-026`) + Fri 1:31 PM ET lander (`q-mp-031b` / [#628](https://github.com/fuzzywigg/math-pentathlon/pull/628))  
**Tip vehicle:** [#598](https://github.com/fuzzywigg/math-pentathlon/pull/598) `cursor/mp-tip-post477` → `alpha` (draft)  
**This deliverable:** one new doc only. No fold / merge / comment / close of other PRs.

## Snapshot identity (API, not agent claims)

| Field | Value |
| --- | --- |
| Observed at (UTC) | `2026-10-09T05:23:22Z` |
| Observed at (ET) | `2026-10-09 01:23:22 EDT` |
| Live tip head SHA | `c1e531c39fea06283a0b5b0f3efb4884fae1e244` |
| Tip PR | [#598](https://github.com/fuzzywigg/math-pentathlon/pull/598) (draft; CI incomplete → `mergeStateStatus` may show `UNSTABLE`) |
| Base | `alpha` |
| Source | `gh pr view 598` + `GET /repos/fuzzywigg/math-pentathlon/commits/{sha}/check-runs` |

### Tip head moved past ticket SHAs

| SHA (short) | Commit subject | Role |
| --- | --- | --- |
| `6dc4afa0` | q-mp-002 M-MP-1 GO/NO-GO | **Last tip suite with all 11 GitHub Actions check-runs = success** (run [37882920306](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37882920306)) |
| `c5927c13` | burn-1008 index (q-mp-009 / #607 content) | Ticket “may have moved past”; suite cancelled when tip advanced |
| `4df77d75` | Oct 9 backlog (q-mp-090 / #614 content) | Fold under tip-owner |
| `9bc278f8` | compliance review 10a (q-mp-025 / #616 content) | Fold under tip-owner |
| `7d3531cd` | check:copy-pins (q-mp-064 / #619 content) | Fold under tip-owner |
| `f21949b8` | visual-baseline triage (q-mp-055 / #624 content) | Suite mostly green; `e2e-cross-browser` + `unit` cancelled by next push |
| `c1e531c3` | agent-task template (q-mp-083 / #602 content) | **Live tip head @ snapshot** |

Pattern: while tip-owner folds, each new tip push cancels the previous Actions run (`e2e-cross-browser` / leftover jobs → `cancelled`). Do **not** treat cancelled mid-SHA suites as red failures for land.

## Check-run table — live tip `c1e531c3`

Workflow run: [37888151503](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37888151503)  
API query: `gh api repos/fuzzywigg/math-pentathlon/commits/c1e531c39fea06283a0b5b0f3efb4884fae1e244/check-runs`

| Check | Status | Conclusion | Completed (UTC) | Job URL |
| --- | --- | --- | --- | --- |
| audit | completed | success | 2026-10-09T05:21:54Z | [job](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37888151503/job/113682856539) |
| build | completed | success | 2026-10-09T05:23:06Z | [job](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37888151503/job/113682949857) |
| e2e | in_progress | — | — | [job](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37888151503/job/113683246416) |
| e2e-cross-browser | in_progress | — | — | [job](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37888151503/job/113683246457) |
| e2e-fullgame | queued | — | — | [job](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37888151503/job/113683246464) |
| forced-colors | in_progress | — | — | [job](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37888151503/job/113683246466) |
| lint | completed | success | 2026-10-09T05:22:32Z | [job](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37888151503/job/113682856342) |
| mobile-touch | in_progress | — | — | [job](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37888151503/job/113683246454) |
| unit | in_progress | — | — | [job](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37888151503/job/113682856648) |
| visual-baseline | in_progress | — | — | [job](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37888151503/job/113682856568) |
| zoom-reflow | in_progress | — | — | [job](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37888151503/job/113683246502) |

**At snapshot:** 3/11 completed success (`audit`, `build`, `lint`); remaining jobs still starting/running. Re-query the same endpoint before land if tip head is still `c1e531c3`.

### Prior tip SHA `f21949b8` (cancelled by tip move)

| Check | Final conclusion |
| --- | --- |
| audit, build, e2e, e2e-fullgame, forced-colors, lint, mobile-touch, visual-baseline, zoom-reflow | success |
| e2e-cross-browser, unit | cancelled (tip advanced to `c1e531c3`) |

### Last fully-green tip suite (lander anchor) — `6dc4afa0`

Run [37882920306](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37882920306) — all 11 success:

| Check | Conclusion |
| --- | --- |
| audit | success |
| build | success |
| e2e | success |
| e2e-cross-browser | success |
| e2e-fullgame | success |
| forced-colors | success |
| lint | success |
| mobile-touch | success |
| unit | success |
| visual-baseline | success |
| zoom-reflow | success |

Tip commits after `6dc4afa0` through `c1e531c3` are docs/tooling/template only (no AI/scoring/rules product paths). Lander still needs a **full green suite on the exact tip SHA that merges**.

## Remaining open drafts targeting `cursor/mp-tip-post477`

`gh pr list --base cursor/mp-tip-post477 --state open` @ snapshot → **29** drafts (plus tip #598 itself into `alpha`).  
Disposition borrows preferred/dup notes from compliance 10b [#626](https://github.com/fuzzywigg/math-pentathlon/pull/626) (`prefer #620 / #604 / #609`).  
**Contained** = tip already has the deliverable content; PR still open — tip owner may comment **contained** (this worker does not close).

| PR | Task | Disposition | Notes |
| ---: | --- | --- | --- |
| [#601](https://github.com/fuzzywigg/math-pentathlon/pull/601) | q-mp-061 | **fold** | `npm run verify` chain |
| [#602](https://github.com/fuzzywigg/math-pentathlon/pull/602) | q-mp-083 | **contained** | `.github/ISSUE_TEMPLATE/agent-task.yml` on tip @ `c1e531c3` |
| [#603](https://github.com/fuzzywigg/math-pentathlon/pull/603) | q-mp-080 | **dup / skip docs** | DUP of [#620](https://github.com/fuzzywigg/math-pentathlon/pull/620); optional keep only `.github/copilot-instructions.md` |
| [#604](https://github.com/fuzzywigg/math-pentathlon/pull/604) | q-mp-074 | **fold (prefer)** | Preferred over #621 (`ratchet-ceiling-history.*` + `package.json` script) |
| [#605](https://github.com/fuzzywigg/math-pentathlon/pull/605) | q-mp-045 | **fold** | `no-non-null-assertion` ceiling; stack before #608 |
| [#606](https://github.com/fuzzywigg/math-pentathlon/pull/606) | q-mp-062 | **fold** | Vite chunk / warn-limit |
| [#607](https://github.com/fuzzywigg/math-pentathlon/pull/607) | q-mp-009 | **contained** | `docs/dev/burn-1008-index.md` on tip @ `c5927c13` |
| [#608](https://github.com/fuzzywigg/math-pentathlon/pull/608) | q-mp-043 | **fold** | curly braces; minify emit-identical per 10b |
| [#609](https://github.com/fuzzywigg/math-pentathlon/pull/609) | q-mp-071 | **fold (prefer)** | Preferred over #612 |
| [#610](https://github.com/fuzzywigg/math-pentathlon/pull/610) | q-mp-054 | **fold** | forced-colors; coordinate Ramrod RM with #625 |
| [#612](https://github.com/fuzzywigg/math-pentathlon/pull/612) | q-mp-071 | **dup / skip** | DUP of #609 — do not double-fold |
| [#613](https://github.com/fuzzywigg/math-pentathlon/pull/613) | q-mp-053 | **fold** | zoom-reflow CSS |
| [#614](https://github.com/fuzzywigg/math-pentathlon/pull/614) | q-mp-090 | **contained** | `docs/dev/backlog-2026-10-09.md` on tip @ `4df77d75` |
| [#615](https://github.com/fuzzywigg/math-pentathlon/pull/615) | q-mp-051 | **fold** | e2e-fullgame harness; after #623 preferred |
| [#616](https://github.com/fuzzywigg/math-pentathlon/pull/616) | q-mp-025 | **contained** | `docs/dev/compliance-review-10a.md` on tip @ `9bc278f8` |
| [#617](https://github.com/fuzzywigg/math-pentathlon/pull/617) | q-mp-033 | **fold** | cross-browser WebGL / CSP noise |
| [#618](https://github.com/fuzzywigg/math-pentathlon/pull/618) | q-mp-052 | **fold** | mobile-touch triage |
| [#619](https://github.com/fuzzywigg/math-pentathlon/pull/619) | q-mp-064 | **contained** | `check:copy-pins` on tip @ `7d3531cd` |
| [#620](https://github.com/fuzzywigg/math-pentathlon/pull/620) | q-mp-080 | **fold (prefer)** | Preferred over #603 (adds `readme-npm-scripts` test) |
| [#621](https://github.com/fuzzywigg/math-pentathlon/pull/621) | q-mp-074 | **dup / skip** | DUP of #604 — do not double-fold |
| [#622](https://github.com/fuzzywigg/math-pentathlon/pull/622) | q-mp-059 | **fold** | PWA / offline probes |
| [#623](https://github.com/fuzzywigg/math-pentathlon/pull/623) | q-mp-057 | **fold** | a11y re-sweep |
| [#624](https://github.com/fuzzywigg/math-pentathlon/pull/624) | q-mp-055 | **contained** | visual-baseline triage doc on tip @ `f21949b8` |
| [#625](https://github.com/fuzzywigg/math-pentathlon/pull/625) | q-mp-058 | **fold** | perf/memory/bundle + Ramrod CSS; stack with #610 carefully |
| [#626](https://github.com/fuzzywigg/math-pentathlon/pull/626) | q-mp-027 | **fold** | compliance review 10b (meta; fold order source) |
| [#627](https://github.com/fuzzywigg/math-pentathlon/pull/627) | q-mp-010 | **fold** | landing preflight v4 (authored @ tip `6dc4afa0` — re-read before land) |
| [#628](https://github.com/fuzzywigg/math-pentathlon/pull/628) | q-mp-031b | **fold** | Fri 1:31 PM ET deploy land checklist |
| [#629](https://github.com/fuzzywigg/math-pentathlon/pull/629) | q-mp-029 | **fold** | AI/copy/rules recheck (authored @ `c5927c13`) |
| [#630](https://github.com/fuzzywigg/math-pentathlon/pull/630) | q-mp-030b | **fold** | Hex Hard 450 + Stars & Bars uncapped recheck |

**Missing remote PR:** #611 (noted by 10b; still absent).

### Duplicate pairs (do not double-fold)

| Task | Pair | Prefer | Skip |
| --- | --- | --- | --- |
| q-mp-080 | [#603](https://github.com/fuzzywigg/math-pentathlon/pull/603) / [#620](https://github.com/fuzzywigg/math-pentathlon/pull/620) | **#620** | #603 overlapping docs (optional copilot-only cherry) |
| q-mp-074 | [#604](https://github.com/fuzzywigg/math-pentathlon/pull/604) / [#621](https://github.com/fuzzywigg/math-pentathlon/pull/621) | **#604** | **#621** entire |
| q-mp-071 | [#609](https://github.com/fuzzywigg/math-pentathlon/pull/609) / [#612](https://github.com/fuzzywigg/math-pentathlon/pull/612) | **#609** | **#612** entire |

### Counts @ snapshot

| Disposition | Count |
| --- | ---: |
| contained (content already on tip) | 6 (#602 #607 #614 #616 #619 #624) |
| dup / skip | 3 (#603 docs / #612 / #621) |
| fold remaining (product + reports) | 20 |
| open tip-base drafts total | 29 |

## Tip-owner fold cheat-sheet (remaining)

From 10b order, minus already-contained:

1. Meta reports: #626 → #627 → #628 → #629 → #630  
2. Tooling: #601 → **#620** (+ optional #603 copilot) → **#604** → #605  
3. Build: #606  
4. Curly: #608 (then re-measure lint ratchet)  
5. CSS/a11y: #613 → #623 → #610 → #625 (Ramrod RM re-home)  
6. Visuals: **#609** only  
7. Probes/e2e: #618 → #622 → #617 → #615  
8. Explicit non-folds: #612, #621; #603 docs overlap; #611 N/A  
9. After folds: pause tip pushes long enough for a **full green** Actions suite on the land SHA; then lander uses [#628](https://github.com/fuzzywigg/math-pentathlon/pull/628).

## Hard-assert spot check on live tip tree

| Assert | Result on `c1e531c3` |
| --- | --- |
| Hex Hard `450` | `src/games/hex/ai.ts` still `hard: 450` |
| Stars & Bars history uncapped | tip commits after `6dc4afa0` are docs/tooling/template only |
| CI least-privilege | tip `ci.yml` still `permissions: contents: read` + `persist-credentials: false` |

## Method

1. `gh pr view 598 --json headRefOid,…` — live tip SHA (moved past `6dc4afa0` / `c5927c13` during observation).  
2. `gh api …/commits/{sha}/check-runs` for live + prior tip SHAs (never trust chat claims alone).  
3. `gh pr list --base cursor/mp-tip-post477 --state open` — remaining WIP.  
4. Tip tree `git ls-tree` / `git log` — mark contained vs still-to-fold.  
5. Dup prefer/skip from open [#626](https://github.com/fuzzywigg/math-pentathlon/pull/626) compliance review 10b.  
6. Confirmed no open PR already delivers `docs/dev/mp-tip-midfold-snapshot-2026-10-09.md`.

## Overlap

- [#626](https://github.com/fuzzywigg/math-pentathlon/pull/626) — verdicts/fold order for #601–#625 (not a tip SHA + check-run midfold table).  
- [#627](https://github.com/fuzzywigg/math-pentathlon/pull/627) / [#628](https://github.com/fuzzywigg/math-pentathlon/pull/628) — land preflight/checklist at earlier tip SHAs.  
This snapshot uniquely freezes **live tip SHA + check-runs + remaining-WIP with dups** for the midfold / lander window.

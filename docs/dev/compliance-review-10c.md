# Compliance review 10c — burn-1009 drafts #632–#638 (+ q-mp-113)

**Task id:** `q-mp-027c`  
**Role:** worker (report-only)  
**Reviewer tip base (this draft PR):** `cursor/mp-tip-post477` @ `b290d9e7`  
**Tip owner PR into alpha:** [#598](https://github.com/fuzzywigg/math-pentathlon/pull/598) — actively folding; **not** pushed/folded/merged here  
**Prior passes (not re-audited):** [#616](https://github.com/fuzzywigg/math-pentathlon/pull/616) 10a (#589–#600); [#626](https://github.com/fuzzywigg/math-pentathlon/pull/626) 10b (#601–#625)  
**This deliverable:** report only — one new doc; no comments, labels, edits, closes, or folds of other PRs. Never merge.

## Scope

Hunk-level verdicts (`COMPLIANT` / `COMPLIANT-WITH-DROPS` / `VIOLATION` / `DUPLICATE`) vs hard rules (Oct 8 6:04 PM ET block) for burn-1009 drafts **#632–#638**, plus any open **q-mp-113** (layout-forcing DOM reads in remainder-islands/juggle).

| PR | Task | Title (short) |
| ---: | --- | --- |
| [#632](https://github.com/fuzzywigg/math-pentathlon/pull/632) | q-mp-106 | unit coverage for `src/ui/inject-styles.ts` |
| [#633](https://github.com/fuzzywigg/math-pentathlon/pull/633) | q-mp-104 | delete eight dead re-export barrels (`dead_barrels` 8→0) |
| [#634](https://github.com/fuzzywigg/math-pentathlon/pull/634) | q-mp-100 | fix engine-doc missing test paths (`check:dev-docs`) |
| [#635](https://github.com/fuzzywigg/math-pentathlon/pull/635) | q-mp-108 | soft-fail missing `#app` boot (R-SHELL-01) |
| [#636](https://github.com/fuzzywigg/math-pentathlon/pull/636) | q-mp-110 | trim `game-ramrod` gzip OVER (CSS extract) |
| [#637](https://github.com/fuzzywigg/math-pentathlon/pull/637) | q-mp-107 | home/menu error boundary (R-SHELL-04) |
| [#638](https://github.com/fuzzywigg/math-pentathlon/pull/638) | q-mp-102 | `destroyGame` cleanup for juggle / fab-a-diffy / sum-dominoes |
| *(none)* | q-mp-113 | **no open draft** at review time |

**Comparison context (not re-scoped as a new verdict band):** [#625](https://github.com/fuzzywigg/math-pentathlon/pull/625) `q-mp-058` — same ramrod CSS move as #636 among a larger perf audit (already covered in 10b).

**Method:** live `gh pr view` / `git fetch` + `git diff <merge-base>...<head>` (unique commits only) / path + topic greps on tip @ `b290d9e7` / `gh api …/commits/<sha>/check-runs` (not PR bodies) / tip pins (Hex Hard 450, Stars & Bars uncapped history, CI `permissions`).

## Overlap check (open drafts)

- No open draft already delivers `compliance-review-10c` or `q-mp-027c`.
- **q-mp-113:** `gh pr list --state open --search "q-mp-113"` → empty; `gh issue list --search "q-mp-113"` → empty; body scan of 177 open PRs for `q-mp-113` / layout-forcing remainder-islands+juggle → **no open draft**.
- **#636 vs #625:** duplicate ramrod CSS extraction (see below).
- **#635 vs #637:** both edit `src/main.ts`, `tests/unit/runtime-error-path-audit.test.ts`, `tests/unit/burn-1007-main-shell-routes.test.ts` — conflict-aware fold order required.

## Reviewed heads (recorded)

| PR | Branch | Head SHA reviewed | Merge-base vs tip | Tip ahead | Draft |
| ---: | --- | --- | --- | ---: | --- |
| [#632](https://github.com/fuzzywigg/math-pentathlon/pull/632) | `cursor/q-mp-106-inject-styles-coverage-7c45` | `feaa2414a239e9c773a900fb9a4ea35f56ba2110` | `7e448b4f` | 3 | yes |
| [#633](https://github.com/fuzzywigg/math-pentathlon/pull/633) | `cursor/q-mp-104-dead-barrels-ec16` | `f1264e11311167ab20bf98281b1c013cefb54ed7` | `7e448b4f` | 3 | yes |
| [#634](https://github.com/fuzzywigg/math-pentathlon/pull/634) | `cursor/q-mp-100-engine-doc-test-paths-64fb` | `a042ff3e77dba95e0bafbbc4c0ed90f518536c28` | `4448b4ae` | 4 | yes |
| [#635](https://github.com/fuzzywigg/math-pentathlon/pull/635) | `cursor/q-mp-108-soft-fail-app-boot-6ad4` | `13c3df50e22ccff3175df1e034d111a2158edeb2` | `4448b4ae` | 4 | yes |
| [#636](https://github.com/fuzzywigg/math-pentathlon/pull/636) | `cursor/q-mp-110-size-trim-d511` | `613bd19737e5dd0306ff736608090e6aa3b4e33a` | `4448b4ae` | 4 | yes |
| [#637](https://github.com/fuzzywigg/math-pentathlon/pull/637) | `cursor/q-mp-107-home-error-boundary-cec7` | `eaabf334d0b41f315de8bbb009ca53cf80c6639c` | `7e448b4f` | 3 | yes |
| [#638](https://github.com/fuzzywigg/math-pentathlon/pull/638) | `cursor/q-mp-102-destroy-stubs-8364` | `fcb7ecad60a1b5276fe2081e5714a44496da64bd` | `7e448b4f` | 3 | yes |
| [#625](https://github.com/fuzzywigg/math-pentathlon/pull/625) *(overlap)* | `cursor/q-mp-058-perf-memory-bundle-032f` | `95fae03bf5f89828577be9b3b74e7ab8a33fd645` | `91a6be7e` | 27 | yes |

Tip at review: `b290d9e7` (`chore(lint): lower curly ceiling to measured count after #608 fold`). Tip curly ceiling file: **839**. Tip still has inline ramrod styles (no `ramrod.css` yet). Tip still hard-throws on missing `#app`.

## Summary table

| PR | Verdict | Drops | Check runs @ head SHA |
| ---: | --- | --- | --- |
| [#632](https://github.com/fuzzywigg/math-pentathlon/pull/632) | **COMPLIANT** | none | 11/11 **success** |
| [#633](https://github.com/fuzzywigg/math-pentathlon/pull/633) | **COMPLIANT** | none (fold **last**) | 11/11 **success** |
| [#634](https://github.com/fuzzywigg/math-pentathlon/pull/634) | **COMPLIANT** | none | 11/11 **success** |
| [#635](https://github.com/fuzzywigg/math-pentathlon/pull/635) | **COMPLIANT** | none | 11/11 **success** |
| [#636](https://github.com/fuzzywigg/math-pentathlon/pull/636) | **COMPLIANT** (prefer over #625 ramrod) | none on #636; see #625 drop | 11/11 **success** |
| [#637](https://github.com/fuzzywigg/math-pentathlon/pull/637) | **COMPLIANT** | none | 11/11 **success** |
| [#638](https://github.com/fuzzywigg/math-pentathlon/pull/638) | **COMPLIANT-WITH-DROPS** | brace 2 unbraced early-returns (curly) | 10/11 success; **`lint` failure** |
| #625 ramrod slice | **DUPLICATE** of #636 | **DROP** `board-ui.ts` + `ramrod.css` when folding after #636 | 11/11 **success** @ `95fae03b` |
| q-mp-113 | **N/A** | no open draft | — |

**Counts:** COMPLIANT **6** · COMPLIANT-WITH-DROPS **1** · DUPLICATE **1** (ramrod slice of #625) · VIOLATION **0** · missing topic **q-mp-113**

## Check runs (live API, per head SHA)

Source: `gh api repos/fuzzywigg/math-pentathlon/commits/<sha>/check-runs`. Names observed: `lint`, `audit`, `build`, `unit`, `e2e`, `e2e-fullgame`, `e2e-cross-browser`, `mobile-touch`, `zoom-reflow`, `forced-colors`, `visual-baseline`.

| PR | Head SHA | lint | audit | build | unit | e2e | e2e-fullgame | e2e-cross-browser | mobile-touch | zoom-reflow | forced-colors | visual-baseline |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| #632 | `feaa2414` | success | success | success | success | success | success | success | success | success | success | success |
| #633 | `f1264e11` | success | success | success | success | success | success | success | success | success | success | success |
| #634 | `a042ff3e` | success | success | success | success | success | success | success | success | success | success | success |
| #635 | `13c3df50` | success | success | success | success | success | success | success | success | success | success | success |
| #636 | `613bd197` | success | success | success | success | success | success | success | success | success | success | success |
| #637 | `eaabf334` | success | success | success | success | success | success | success | success | success | success | success |
| #638 | `fcb7ecad` | **failure** | success | success | success | success | success | success | success | success | success | success |
| #625 | `95fae03b` | success | success | success | success | success | success | success | success | success | success | success |

**#638 `lint` failure detail** (run `37891073273`): `npm run lint:ratchet` → `FAIL curly: 898 / ceiling 896`. Cause: two new single-line unbraced early-returns under `curly:all` (see #638 drops). Tip ceiling has since moved to **839** after #608 fold — rebase onto tip still needs those braces.

## Hard rules (global)

| Rule | Global result | Evidence |
| --- | --- | --- |
| Worker draft-only; tip owner folds; Grok Bot merges tip | **PASS** (this PR) | Report-only doc; no merge / ready / alpha / tip push |
| No AI search / scoring / difficulty / timing product edits | **PASS** | No `*/ai.ts` / `ai-worker/**` edits in #632–#638. #638 keeps delay literals **300/500/600/800** — only wraps existing `setTimeout` via `scheduleGenerationGated` + destroy cancel. |
| No new player-facing copy / rules-text | **PASS** | #635 reuses diagnostic substring `App container not found` in `console.error` (not UI). #637 reuses `installGameErrorBoundary` → existing strings (`Something went wrong in ${gameName}.`, `Try again`, `Back to games`). #638 / #632 / #633 / #634 / #636: no player copy. |
| No logic edits in `*/rules.ts` / legal-move / scoring paths | **PASS** | Zero `rules.ts` product edits in #632–#638 unique diffs. |
| Stars & Bars history uncapped | **PASS** | Tip `stars-bars/board-ui.ts` still walks full `moveHistory` (no `slice(-N)`). No stars-bars product edits in band. |
| Hex Hard **450ms** | **PASS** | Tip `src/games/hex/ai.ts` `hard: 450,` untouched; no hex AI files in band. |
| CI `permissions: contents: read` + `persist-credentials: false` | **PASS** | No `.github/workflows` edits in band. |
| No apt / pip allowlist widen / network in tests | **PASS** | No CI install surface edits. |
| Ratchets only go down | **PASS** (fold note) | #633 lowers `dead_barrels` 8→0 (and `mixed_ui_barrels` 9→1). #638 must not raise curly — brace the 2 early-returns on fold. Tip curly ceiling already **839**. |
| Forbidden topics (Merom / Sullivan / DC / grants / nonprofit / openclaw never-touch) | **PASS** | No product hits in band diffs. |

---

## Per-PR findings

### #632 — q-mp-106 inject-styles unit coverage

**Verdict:** COMPLIANT

**Files vs merge-base:** `tests/unit/inject-styles-once.test.ts` (+59) only.

**Hunks:** characterization tests for `injectStylesOnce` (id collision no-op + style text insert). No `src/` edits.

**Drops:** none.

**Checks @ `feaa2414`:** all 11 success.

---

### #633 — q-mp-104 dead barrels 8→0

**Verdict:** COMPLIANT — **fold last**

**Files vs merge-base:** deletes 8 barrels (`src/core/{alignment,attributes,expressions,fractions,graph,hex,polyomino}/index.ts`, `src/games/calla/index.ts`); `docs/dev/module-boundaries-ceilings.json` (`dead_barrels` 8→0, `mixed_ui_barrels` 9→1); ~347 `tests/unit/*` import rewrites to deep module paths. **356 files**, +678/−3004.

**Non-src importer check (live tip + #633 head):**

| Surface | Barrel package-root imports? |
| --- | --- |
| `src/**` | **none** on tip (barrels already zero-importer from `src/`) |
| `scripts/**` | **none** (`check-copy-pins.mjs` imports `games/calla/rules`, not `games/calla`) |
| `tests/e2e/**` / probe scripts | **none** (route mocks use `games/calla/game-controller*`, not the barrel) |
| `docs/**` | path mentions only; not import resolvers |
| `tests/unit/**` | tip still imports barrels; #633 rewrites **all** of them (head grep of remaining package-root barrel imports outside `tests/unit` → empty; inside `tests/unit` on head → empty) |

**Conclusion:** deleting the barrels does **not** break scripts/e2e/docs importers. Risk is **merge conflict mass** against any concurrent `tests/unit` edits — fold last after other burn-1009 product/test pins land.

**Drops:** none for compliance. Tip-owner note in ceiling JSON about hex package body removal stays deferred (this PR only deletes the re-export `index.ts`).

**Checks @ `f1264e11`:** all 11 success.

---

### #634 — q-mp-100 engine-doc missing test paths

**Verdict:** COMPLIANT

**Files:** `docs/dev/engines/{fab-a-diffy,ramrod,stars-bars}.md` only. Rewrites stale backtick paths to files that exist on tip (shards / removes deleted `*-ai-timer-race` / `playability-polish` / `ai-determinism-2026-10-07` refs). Confirmed missing on tip; replacements present.

**No `src/` / AI / copy / rules.** Drops: none.

**Checks @ `a042ff3e`:** all 11 success.

---

### #635 — q-mp-108 soft-fail missing `#app` (R-SHELL-01)

**Verdict:** COMPLIANT

**Files:** `src/main.ts`; `tests/unit/runtime-error-path-audit.test.ts`; `tests/unit/burn-1007-main-shell-routes.test.ts`.

**Product hunks (`main.ts`):**

| Hunk | OK? | Notes |
| --- | --- | --- |
| `throw new Error('App container not found')` → `console.error('[main] App container not found')` | yes | Diagnostic only; **not** player-facing UI. Reuses existing message text. |
| Gate `addRoute` / `initRouter` / `bootstrapPwa` / owl+warm behind `if (appContainer)` | yes | Boot soft-fail; no AI/timing/rules. |

**Tests:** remove CURRENT throw pin + `it.skip` R-SHELL-01; add fixed P3 soft-fail pin; burn-1007 expects resolve + console diagnostic.

**Hard-rule confirm:** no new player-facing strings; no AI behavior/timing/delay; no `rules.ts` / legal-move / scoring.

**Drops:** none.

**Conflict:** overlaps #637 on the three files above — fold **before** #637 (see fold order).

**Checks @ `13c3df50`:** all 11 success.

---

### #636 vs #625 — ramrod CSS gzip trim

**#636 verdict:** COMPLIANT (preferred fold for the gzip fix)  
**#625 ramrod slice verdict:** DUPLICATE of #636

**Live compare:** `board-ui.ts` post-change on #636 (`613bd197`) and #625 (`95fae03b`) are **byte-identical** for the extract pattern; `ramrod.css` is **CSS_IDENTICAL** (`diff` clean). Tip @ `b290d9e7` still has inline `injectStylesOnce` string + `BOX_WIDTH` (fix still needed).

| Prefer | Fold | Drop |
| --- | --- | --- |
| **Fold #636** | narrow q-mp-110 size trim only (`board-ui.ts` + new `ramrod.css`); budgets unchanged | When later folding **#625**, **DROP** `src/games/ramrod/board-ui.ts` + `src/games/ramrod/ramrod.css` (already contained). Keep #625's unique docs/scripts/perf JSON harness hunks. |
| Alt | If tip owner folds **#625 first** | Treat **entire #636** as contained/DUPLICATE — do not double-apply the CSS move. |

**Hard-rule confirm (#636):** no AI/rules/scoring/copy; CSS location only (Vite CSS chunk). Visual selectors preserved in the extracted file.

**Checks @ `613bd197`:** all 11 success. (#625 @ `95fae03b`: all 11 success.)

---

### #637 — q-mp-107 home/menu error boundary (R-SHELL-04)

**Verdict:** COMPLIANT

**Files:** `src/main.ts`; `tests/unit/runtime-error-path-audit.test.ts`; `tests/unit/burn-1007-main-shell-routes.test.ts`; `docs/dev/runtime-error-path-audit.md`.

**Product hunks (`main.ts`):**

| Hunk | OK? | Notes |
| --- | --- | --- |
| Rename/generalize `bindGameErrorBoundary` → `bindRouteErrorBoundary(displayName, onReset)` | yes | Same `installGameErrorBoundary` path |
| `renderHome` calls `bindRouteErrorBoundary('Math Pentathlon', () => renderHome())` before selector | yes | Display name already used as `document.title`; crash UI strings unchanged in `game-error-boundary.ts` |

**Hard-rule confirm:** reuse existing crash strings only (`Something went wrong in …`, `Try again`, `Back to games` — tip `src/ui/game-error-boundary.ts`); no AI timing/delay; no `rules.ts` / scoring.

**Drops:** none.

**Conflict:** fold **after** #635 so soft-fail wrap and home-boundary edits compose cleanly on `main.ts` + shared audit tests.

**Checks @ `eaabf334`:** all 11 success.

---

### #638 — q-mp-102 destroyGame cleanup (juggle / fab-a-diffy / sum-dominoes)

**Verdict:** COMPLIANT-WITH-DROPS

**Files:** `src/games/{juggle,fab-a-diffy,sum-dominoes}/game-controller.ts`; `tests/unit/q-mp-102-destroy-cleanup.test.ts` (+202).

**Product hunks:**

| Hunk | OK? | Notes |
| --- | --- | --- |
| Track `aiGeneration` + single `aiTimer`; `scheduleAI` via existing `scheduleGenerationGated` | yes | Delay literals unchanged (juggle 300/500; fab 800; sum-dominoes 600/800) |
| `destroyGame`: bump generation, clear timer, `clearElement` mounts, null refs; fab also `disposeFabAiWorker` | yes | Matches neighboring hex/controller pattern; no `ai.ts` / `rules.ts` |
| Early-return in `updateUI` after destroy nulls mount | yes (behavior) / **drop form** | See curly drops |

**Hard-rule confirm:** no new player-facing strings; no AI search/scoring/difficulty; **no delay value changes**; no `rules.ts` / legal-move / scoring edits.

**Drops (required for curly ratchet):**

1. `src/games/fab-a-diffy/game-controller.ts` — brace  
   `if (!activeContainer || controller.container !== activeContainer) return;`  
   → block form with `{ return; }`.
2. `src/games/sum-dominoes/game-controller.ts` — same brace fix for the identical early-return.

These two unbraced single-line `if`s are why head `lint` failed (`curly: 898 / ceiling 896`). Tip ceiling is now **839**; folding without braces would still fail ratchet.

**Checks @ `fcb7ecad`:** lint **failure**; other 10 **success**.

---

### q-mp-113 — layout-forcing reads (remainder-islands / juggle)

**Verdict:** N/A — **no open draft** exists at review time (`gh pr list` / issue search / open-PR body scan). Nothing to fold; nothing to judge for DOM read/write ordering vs visuals/AI/copy.

---

## Conflict-aware fold order (for tip owner of #598)

Recommended order onto `cursor/mp-tip-post477` (do **not** push from this worker):

| Step | PR | Why |
| ---: | --- | --- |
| 1 | **#634** | Docs-only; clears `check:dev-docs` missing-path noise; zero product conflict. |
| 2 | **#632** | Tests-only; independent. |
| 3 | **#636** | Narrow ramrod gzip fix. If #625 folds later → **DROP** its `ramrod/board-ui.ts` + `ramrod.css`. If #625 already folded → skip #636 (DUPLICATE). |
| 4 | **#638** | Independent controllers; **apply curly braces drops** on the two early-returns before/during fold; re-measure curly (must not raise ceiling above measured). |
| 5 | **#635** | Soft-fail `#app` — structural wrap of bootstrap in `main.ts` + R-SHELL-01 audit pins. |
| 6 | **#637** | Home boundary — same `main.ts` / `runtime-error-path-audit.test.ts` / `burn-1007-main-shell-routes.test.ts` as #635; apply **after** soft-fail so route bootstrap gate and `bindRouteErrorBoundary` compose. Manual merge of audit header comments + skip inventory expected. |
| 7 | **#633** | **Last** — 356-file barrel delete + ~347 test import rewrites; highest conflict surface with any unit-test churn from steps 2–6. No non-src importer breakage found. |

**Explicit #635 / #637 note:** both touch `src/main.ts` and `tests/unit/runtime-error-path-audit.test.ts`. Do not interleave; **#635 then #637**. Prefer a single tip commit message stack that records both R-SHELL-01 and R-SHELL-04 recovered.

**Out of band for this review's fold queue:** #625 non-ramrod hunks (perf docs/scripts) — fold when ready with ramrod files dropped if #636 already landed; #598 tip→alpha remains tip-owner / Grok Bot only.

## Next action

Next action: fold into tip by the tip owner

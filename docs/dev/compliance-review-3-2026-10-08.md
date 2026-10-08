# burn-1008 compliance review 3 (independent hard-rule pass)

**Task id:** `burn-1008-mp-compliance-review-3`  
**Reviewer tip base (verification):** `cursor/integration-fold-wave5-tip-4af0` @ `db46702fb867fbfab4bf9325411e959162b3e5a1`  
**Tip at report publish:** `e90a7b8612076775c93180a4e3f78162fd18dd12` (tip owner folded #544–#552 / #541 during this review — see §Tip-owner fold outcome)  
**Prior passes:** [#538](https://github.com/fuzzywigg/math-pentathlon/pull/538) → `docs/dev/burn-1008-compliance-review.md` (#503–#537); [#543](https://github.com/fuzzywigg/math-pentathlon/pull/543) → `docs/dev/burn-1008-compliance-review-2.md` (#539–#542).  
**Scope (live at review start):** tip drafts **#544–#552** (not covered by #538/#543).  
**Method:** `gh pr diff` hunk-by-hunk; hard-rule greps; string-literal scan on `src/`; pairwise `git merge` conflict probes on tip+A+B; **re-run** each PR’s stated gates on scratch `tip@db46702f` + PR head (not trusted from PR bodies).  
**This deliverable:** report only — this file. No edits/comments/pushes to other PR branches.

## Hard rules checked

| Rule | Signal |
| --- | --- |
| AI search / scoring / difficulty / think-time | `ai.ts`, deadlines, evaluate/search |
| Legal-move / outcome / scoring | `rules.ts` apply/validate/score; scoring helpers |
| Player-facing copy / tutorial / rules-text | string-literal diffs in UI; tutorials; How-to |
| Stars & Bars history cap | `moveHistory` trim / `slice(-15)` |
| Hex Hard 450ms assert | `AI_PLAY_DEADLINE_MS.hard` / `toBe(450)` |
| Workflow least-privilege | `contents: read`, `persist-credentials: false` |
| CI install surface | no `apt`; pip allowlist not widened |
| Forbidden topics | openclaw / Merom / Sullivan / meromhouse / pappas-infrastructure |
| Type-ratchet semantics | `!`, `??`, `?.`, optional-spread, early `continue`/`return` outside pure UI |

**Global tip spot-check @ `db46702f` (and still on `e90a7b86`):** Hex `hard: 450` (`src/games/hex/ai.ts:21`) + `toBe(450)` (`tests/unit/hex-deep-playability.test.ts:58`); Stars & Bars uncapped (`board-ui.ts` “do not cap” loop); CI `permissions: contents: read` + `persist-credentials: false`. No openclaw / Merom / pip-allowlist / apt hits in any of the nine diffs.

## Summary table

| PR | Title (short) | Head (reviewed) | Verdict | Fold position (independent) |
| ---: | --- | --- | --- | --- |
| [#544](https://github.com/fuzzywigg/math-pentathlon/pull/544) | Type-ratchet Batch 3 UI/shell | `82617c09` | **COMPLIANT-WITH-NOTES** | After #546; before #551; union ratchet bookkeeping |
| [#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) | Open draft triage | `e1c9e720` | **COMPLIANT-WITH-NOTES** | Docs anytime; inventory stale vs later drafts |
| [#546](https://github.com/fuzzywigg/math-pentathlon/pull/546) | Batch-2 compliant recut (≠ #537) | `cfc475fa` | **COMPLIANT** | First among type-ratchet trio (ceiling 433) |
| [#547](https://github.com/fuzzywigg/math-pentathlon/pull/547) | Alpha landing preflight | `e2336dc9` | **COMPLIANT-WITH-NOTES** | Docs; tip SHA stale at authoring |
| [#548](https://github.com/fuzzywigg/math-pentathlon/pull/548) | Flake-rate game-prefetch isolation | `f3052f2f` | **COMPLIANT-WITH-NOTES** | Early (test infra); resolve burn-1007 with tip |
| [#549](https://github.com/fuzzywigg/math-pentathlon/pull/549) | Merge-window decision sheet | `a314f0b2` | **COMPLIANT-WITH-NOTES** | Docs; incomplete vs #550–#552 |
| [#550](https://github.com/fuzzywigg/math-pentathlon/pull/550) | Violation salvage | `c18cec48` | **VIOLATION** | Fold only after dropping `R=` always-on hints |
| [#551](https://github.com/fuzzywigg/math-pentathlon/pull/551) | Type-ratchet Batch 4 prime-gold UI | `fb04acf1` | **COMPLIANT** | After #544/#546; re-baseline combined ceiling |
| [#552](https://github.com/fuzzywigg/math-pentathlon/pull/552) | Tip-vs-alpha hard-rule audit | `d8d0438c` | **COMPLIANT-WITH-NOTES** | Docs; tip SHA stale at authoring |

**Counts:** COMPLIANT **2** · COMPLIANT-WITH-NOTES **6** · VIOLATION **1**  
**Dead-code #541:** remains **FOLD LAST** (tip owner already folded it last among product drafts — see §Tip-owner fold outcome).

---

## Verification reproduced (scratch tip @ `db46702f` + PR head)

Environment note: tip @ `db46702f` had a **pre-existing** lint error in `src/core/storage/storage.ts:22` (`@typescript-eslint/consistent-type-imports` after merge #528) — **LINT=1 on tip alone**. Later tip commit `b63afd24` fixed it. Unit/build on tip alone: **UNIT=0 BUILD=0 RATCHET=0**.

Merge note: #544/#546/#548/#551 conflicted only on `tests/unit/burn-1007-pwa-shell-ui.test.ts` (tip already had the same `beforeEach(resetGamePrefetchForTests)`). Verification kept **tip’s** file (`RESOLVED=burn-1007-kept-tip`).

| Tree | MERGE | LINT | TSC | RATCHET | UNIT | BUILD | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| tip @ `db46702f` | — | **1** | 0 | 0 (520≤520) | 0 (3097 files / 11651 tests) | 0 | tip baseline |
| tip+#544 | 0* | **1** | 0 | 0 (**443**≤443) | 0 (3097 / 11652) | 0 | *burn-1007 kept tip |
| tip+#545 | 0 | **1** | 0 | na | na | 0 | docs-only gates |
| tip+#546 | 0* | **1** | 0 | 0 (**433**≤433) | 0 (3098 / 11671) | 0 | *burn-1007 kept tip |
| tip+#547 | 0 | **1** | 0 | na | 0 (3097 / 11652) | 0 | e2e not re-run (author-only) |
| tip+#548 | 0* | **1** | 0 | na | 0 (3097 / 11652) | 0 | *burn-1007 kept tip |
| tip+#549 | 0 | **1** | 0 | na | na | 0 | docs-only gates |
| tip+#550 | 0 | **1** | 0 | 0 (520≤520) | 0 (3100 / 11670) | 0 | clean merge |
| tip+#551 | 0* | **1** | 0 | 0 (**450**≤450) | 0 (3097 / 11652) | 0 | *burn-1007 kept tip |
| tip+#552 | 0 | **1** | 0 | na | na | 0 | docs-only gates |

Logs: `/opt/cursor/artifacts/verify-pr-{tip,544–552}.log` and `.summary`.

Parallel first-pass unit runs (3× concurrent) produced load flakes (ui-helper timeouts, AI bench hard-flags, queens-guards determinism timeout) — **discarded**. Sequential re-runs above are the recorded results.

---

## Pairwise conflicts (#544 / #546 / #550 / #551 / tip)

Probed with real `git merge --no-commit` on tip @ `db46702f`, auto-resolving only the identical burn-1007 beforeEach conflict when it was the sole blocker.

| Stack | Result | Conflict files |
| --- | --- | --- |
| tip+#544 | conflict → resolvable | `tests/unit/burn-1007-pwa-shell-ui.test.ts` |
| tip+#546 | conflict → resolvable | same burn-1007 |
| tip+#550 | **clean** | — |
| tip+#551 | conflict → resolvable | same burn-1007 |
| tip+#548 | conflict → resolvable | same burn-1007 (+ #548 also edits `setup.ts`) |
| tip+#544+#546 | **hard conflict** | `ci.yml` step label; `type-ratchet-phase2-baseline.json`; `type-ratchet-phase2-export.mjs`; `type-ratchet-phase2-plan.md`; `scripts/check-type-ratchet.mjs` (+ burn-1007) |
| tip+#544+#551 | **hard conflict** | same ratchet bookkeeping set (no `ci.yml` on #551) |
| tip+#546+#551 | **hard conflict** | same ratchet bookkeeping set |
| tip+#544+#550 / tip+#546+#550 / tip+#550+#551 | **clean** after burn-1007 resolve | product files do not overlap |
| tip+#548+{544,546,551,550} | **clean** after burn-1007 resolve | #548 product files are tests/scripts/docs only |

**Product file overlap among #544/#546/#551:** **none** (distinct games). Conflicts are **bookkeeping-only** (ceiling JSON, IN_SCOPE regex, plan, CI step name). Tip owner must fold one ratchet PR, then re-export/re-baseline before the next (observed fold order: #546 → #544 → #551 → combined ceiling **286**).

Tip drift since PR bases (pre-fold): #544 overlapped tip edits in `contig-60/board-ui.ts`, `juggle/board-ui.ts`, `ci.yml` (auto-merged); #550 overlapped `remainder-islands/board-ui.ts` + `game-play.css` (auto-merged).

---

## Per-PR findings

### #544 — fix(types): Phase-2 type-ratchet Batch 3 UI/shell only

**Verdict:** COMPLIANT-WITH-NOTES

**Files:** seven games’ `board-ui.ts` (+ kings `board-renderer.ts`, contig/pent `types.ts`); ratchet scripts/docs; `ci.yml` step **label only**; burn-1007 beforeEach (suite isolation).

**Hex Hard / Stars & Bars:** head keeps `hard: 450` and Stars & Bars `do not cap` at `board-ui.ts:751`. History loop **not** capped by this PR.

**Hunks of interest (runtime-value analysis):**

| File:line (head) | Change | Can change runtime value? |
| --- | --- | --- |
| `contig-60/types.ts:112–114` | `createBoard` uses `boardNumbers[row]!` / `[col]!` | **No** on tip-legal dense `BOARD_NUMBERS` (assert only). Engine-adjacent init — noted. |
| `contig-60/board-ui.ts:141,145` | `continue` if `numberRow`/`value` undefined | **Yes only if** board row sparse — tip boards are dense; else skip cell (was throw/undefined access). |
| `hex/board-ui.ts:320–321` | early `return` if no row; `rowCells[col] ?? null` | **Yes if** cell was `undefined`: `empty: cellState === null` flips false→true. Dense hex board: equivalent. |
| `hex/board-ui.ts:335–338` | guard `lastMove !== undefined` before last-move class | **No** on tip (length check); avoids throw if history hole. |
| `hex/board-ui.ts:362` + peers | EOPT omit-spread for `owner`/`piece`/`extras` | **No** — `buildCellAriaLabel` uses `filter(Boolean)` (`src/ui/board-a11y.ts:47`); omit ≡ `undefined`. |
| `juggle/board-ui.ts:226,354` | `continue` on undefined row/die | Malformed-only; dense board/dice: **No**. |
| `kings-quadraphages/board-ui.ts:119,169` | early `return { state, isInvalidClick: false }` if row missing | **Yes** vs throw on OOB row — UI click path, not rules/AI. |
| `kings-quadraphages/board-ui.ts:210` | `boardRow?.[col-1] ?? null` | Same class as hex `?? null`. |
| `kwatro-sinko/board-ui.ts:112–113` | `match?.[1] ?? '0'` vs `match ? match[1] : '0'` | **No** for this regex (groups always present when match). |
| `stars-bars/board-ui.ts:505–508` | skip undefined row/cell in render | Malformed-only. |
| `stars-bars/board-ui.ts:586` | `calculatePreviewScore` → `return 0` if cell undefined | **Yes** vs throw on OOB preview coords; valid board: **No**. |
| `stars-bars/board-ui.ts:610–611` | `adjCell?.card` | **No** when adj cell exists; avoids throw on hole. |

**Player-facing strings:** only aria `Blue`/`Red` / extras relocated (same values). No tutorial/rules-text edits.

**CI:** step rename only — permissions untouched.

**Notes:** Not purely UI — `contig-60/types.ts` `createBoard` and UI undefined-guards can alter throw→skip on malformed boards. No AI/rules scoring path rewrites. **Do not fold without resolving ratchet bookkeeping vs #546/#551.**

---

### #545 — docs(dev): open draft PR triage

**Verdict:** COMPLIANT-WITH-NOTES

**Files:** `docs/dev/open-draft-triage-2026-10-08.{md,json}` only.

**Evidence:** No `src/`, workflows, AI, copy, timing. Correctly marks #535/#537 as (e) close; folds #540/#546; keeps #541 FOLD LAST.

**Notes:** Tip SHA / inventory stop at ~#546 — **#547–#552 absent**. Advisory only until refreshed.

---

### #546 — fix(types): Batch-2 compliant recut (supersedes #537)

**Verdict:** COMPLIANT

**Files:** frac-fact / fraction-pinball / queens-guards / ramrod / sum-dominoes / calla `rules`/`types`/`board-ui` (+ sum-dominoes `game-controller`); ratchet bookkeeping; characterization tests; owner-decisions doc; burn-1007 isolation.

**vs #537 (prior VIOLATION):** **Zero** `??` defaults / early `continue`/`return` semantic rewrites in `src/`. Only non-null assertions and EOPT omit-spreads. Deferred #537 semantics listed in `docs/dev/type-ratchet-batch2-owner-decisions.md` (TR-B2-01…16).

**Rules/engine `!` evidence (runtime unchanged on tip-legal inputs):**

| File:line (head) | Change | Can change runtime value? |
| --- | --- | --- |
| `calla/rules.ts:24,59,83–106,133–135,318` | `pits[i]!`, `x = x! + 1` (≡ tip `x++` when defined), capture `!` | **No** when pits dense length `PITS_PER_SIDE` (tip invariant). |
| `frac-fact/rules.ts:68,121,169–172,186` | random pick / shuffle `!` | **No** — empty table still yields `undefined` at runtime (same as tip). |
| `fraction-pinball/rules.ts:83,151,188–191,204,268,276` | same pattern + `weights[i]!` / `targets[i]!` | **No** on tip call sites. |
| `queens-guards/rules.ts:101–102` | `adjacent[i]!` | **No** in-loop. |
| `queens-guards/types.ts:73–74` | `parseKey` uses `!` **without** `?? 0` | **No** — preserves tip `undefined` on malformed keys (explicit comment). |
| `ramrod/rules.ts:36,67–68` + `types.ts` | `!` on literal tables / rod set | **No** on tip constructors. |
| `sum-dominoes/rules.ts:71–72,131,177–179,231–232,250,398–417` | board `![ ]` + `match!.myFace` | **No** after tip `isValidPlacement` / dense board; `match!` only after validation path. |
| `sum-dominoes/game-controller.ts:365` | `placements[0]!` after `length > 0` | **No**. |
| board-ui EOPT spreads (queens/ramrod/calla) | omit undefined optionals | **No** (aria `filter(Boolean)`). |

**Player-facing strings:** none changed (ramrod `` `${rod.length}cm rod` `` only relocated).  
**Hex / Stars & Bars:** untouched on head (`hard: 450`; uncapped history).  
**CI:** step label only.

---

### #547 — docs(dev): alpha landing preflight

**Verdict:** COMPLIANT-WITH-NOTES

**Files:** `docs/dev/alpha-landing-preflight-2026-10-08.md` only.

**Evidence:** Report-only; records Hex 450 + Stars & Bars uncapped; CONDITIONAL GO; no product code. Mentions openclaw/Merom only as “did not touch”.

**Notes:** Authored against tip `e1692696` (+1 note to `7b99c2bb`); tip later advanced far beyond — gates not re-run by author on later SHAs. Our tip+#547 unit/build @ `db46702f`: green (lint tip-baseline fail only).

---

### #548 — fix(test): wave5 flake-rate — game-prefetch isolation

**Verdict:** COMPLIANT-WITH-NOTES

**Files (head `f3052f2f`):** `tests/unit/setup.ts` (afterEach `resetGamePrefetchForTests`); `burn-1007-pwa-shell-ui.test.ts` / `game-prefetch.test.ts` isolation; `ai-move-time-midgame.bench.test.ts` (**test-only** soft hard-flag under parallel suite — no AI deadline/budget change); docs + measurement scripts.

**Evidence:** No `src/games/**` product edits. No AI timing constants. Hex 450 / Stars history untouched. Author PR body still had verification checkboxes unchecked (“in progress”) at review — **we re-ran** tip+#548: UNIT=0 BUILD=0.

**Notes:** Conflicts with tip on burn-1007 beforeEach (tip already had it); valuable unique hunk is **setup.ts global afterEach**. Bench `strictHardFlags` relaxes assert under full-suite contention only — not an AI behavior change.

---

### #549 — docs(dev): Oct 9 merge-window decision sheet

**Verdict:** COMPLIANT-WITH-NOTES

**Files:** `docs/dev/merge-window-decision-sheet-2026-10-09.md` only.

**Evidence:** Docs-only; cites Hex 450 + Stars uncapped with tip file:line; recommends close (e) violations; prefer #540/#546 over #535/#537.

**Notes:** Mentions through #548; **#550–#552 absent**. Tip SHA at authoring `6b5a2270`.

---

### #550 — test: salvage compliant hunks from (e) violation drafts

**Verdict:** VIOLATION

**Files:** remainder-islands `board-ui.ts` + `game-controller.ts`; hex-a-gone `board-ui.ts`; `game-play.css`; salvage tests + report doc.

**Compliant hunks (keep):**

| File:line (head) | Change |
| --- | --- |
| `hex-a-gone/board-ui.ts:216,224–255,285–300` | `type=button`; bank `disabled` + `aria-disabled` for non-selectable / AI seat; Confirm gated on `interactive` + `scrollIntoView` — a11y/UX, no copy/AI |
| `game-play.css:2560–2564,2792–2803` | disabled cursor + coarse sticky confirm |
| `remainder-islands/game-controller.ts:102–124,190–192` | lazy division-preview mount when `selectedIsland` — tip instruction string `"Select an island to land on"` **unchanged** |
| Characterization tests | pin tip AI delays / HEX_SIZE / no Easy lookahead cap |

**Violating hunk (player-facing string):**

| File:line (head) | Evidence | Why |
| --- | --- | --- |
| `remainder-islands/board-ui.ts:228–251` | `hint.textContent = \`R=${preview.remainder}\`` on always-on `.island-r-hint` for valid unselected islands | **New player-visible copy** during selection. Tip already shows `R=` only on **selected** preview (`board-ui.ts:83` @ tip). Hard rule: no player-facing copy changes. |

Related CSS/helpers for `.island-r-hint` (lines ~67–68, 100, 506–512, coarse floors) are tied to that overlay.

**Minimal fix:** Drop always-on `R=` hint block + `.island-r-hint` CSS/visibility toggles + touch-hints salvage test; keep hex-a-gone a11y + lazy preview. (**Tip owner applied exactly this when folding — `528b6f95` “minus R= touch hints”.**)

**Hex Hard / AI:** no `ai.ts` edits; tip assert 450 held. Stars & Bars untouched.

---

### #551 — fix(types): Phase-2 type-ratchet Batch 4 prime-gold UI/types

**Verdict:** COMPLIANT

**Files:** `prime-gold/{types,board-ui}.ts`; ratchet bookkeeping; deferred doc; burn-1007 isolation. **No** `rules.ts` / `ai.ts` / copy.

| File:line (head) | Change | Can change runtime value? |
| --- | --- | --- |
| `prime-gold/types.ts:128–129,151–153` | `generateExpressions` loop `vals[i]!` / `basicVals[i]!` | **No** under loop bounds (length 3 / dense vals). |
| `prime-gold/board-ui.ts:510–512` | EOPT omit-spread owner/extras | **No** (aria equivalence). |
| `prime-gold/board-ui.ts:717` | `moveHistory[i]!` in existing last-10 history UI | **No** — tip already caps display with `length - 10` (not Stars & Bars; no new cap). |

**Deferred** (doc only): `prime-gold/rules.ts`, `prime-gold/ai.ts`, kings engine files — correctly left alone.

**Conflicts:** ratchet bookkeeping vs #544/#546 — fold after both and re-baseline (tip did: 356→286).

---

### #552 — docs(dev): tip-vs-alpha hard-rule audit

**Verdict:** COMPLIANT-WITH-NOTES

**Files:** `docs/dev/tip-vs-alpha-audit-2026-10-08.{md,json}` only.

**Evidence:** Report-only classification of tip vs `alpha`; Hex 450 PASS; Stars uncapped PASS; workflows not loosened. Flags tip-vs-alpha AI/copy deltas for owner eyeball (already on tip — not introduced by this PR).

**Notes:** Authored at tip `36a1340d`; tip later advanced. No product code.

---

## Tip-owner fold outcome (observed after verification)

While this independent review ran against tip @ `db46702f`, the tip advanced to `e90a7b86` and folded the tranche. Observed product/docs fold order (excerpt):

1. `#546` → `#544` → `#551` (ratchet; combined ceiling **286**)  
2. `#550` **minus R= touch hints** (`528b6f95`) — matches this review’s VIOLATION surgical fix  
3. Docs: `#538` `#542` `#543` `#545` `#547` `#549` `#552` (+ this `#558` report)  
4. `#548` flake-rate  
5. `#541` dead-code among removals (`cc4120d2`) — then **re-checked LAST** after `#553`/`#556`/`#557` (see below)

This report’s verdicts are the independent hard-rule audit of the **PR heads as reviewed**; fold column above is the pre-fold recommendation (now largely historical).

### Post-`#553` / `#556` / `#557` — `#541` dead-code recheck (new LAST)

Tip owner re-ran `npm run report:dead-code` (knip + depcheck + CSS/helpers) after late folds `#553` (UI recut over `#544`), `#556` (flake docs), `#557` (Batch-6 rules/engine). Inventory refreshed `2026-10-08T12:38:43Z` — **165** candidates; safe-yes **27** (CSS leftovers + deferred test helpers only; **no** bulk delete).

| `#541` removal | Status after recheck |
| --- | --- |
| `setChildren` export | **still absent** from `src/` |
| `resetGameMountDepsForTests` | **still absent** from `src/` |
| `allowGamePrefetchImportsForTests` | **still module-private** (not re-exported) |
| `MAX_*_ID_LENGTH` sanitize exports | **still module-private** |
| `.tutorial-action-target` / `.game-selector-header` CSS | **still absent** |

Nothing `#541` removed came back. Remaining safe-yes items are forced-colors CSS leftovers + test-helper exports deferred to `#526` — not re-executed here.

Storage lint note from this review (`consistent-type-imports` on `storage.ts`) was fixed on tip at `b63afd24` (`import type` for ProgressData types); `npm run lint` exits **0**.

---

## Owner fold hints (independent; pre-fold)

1. Fold **#546** first among type ratchets (compliant; ceiling 433).  
2. Fold **#544** next; re-union IN_SCOPE + re-baseline (notes: UI undefined-guards / contig `createBoard` `!`).  
3. Fold **#551** third; re-baseline again.  
4. Fold **#550** only **after dropping** always-on `R=` hints; keep hex-a-gone a11y + lazy preview.  
5. Fold **#548** early for suite isolation (`setup.ts`).  
6. Docs `#545` `#547` `#549` `#552` anytime (refresh tip SHAs if still used as living checklists).  
7. Keep **#541 FOLD LAST**.  
8. Do **not** fold #535 / #537 (still violations; use #540 / #546).

---

## Acceptance checklist

- [x] All 9 PRs (#544–#552) reviewed hunk by hunk  
- [x] Every verdict backed by file:line evidence  
- [x] Type-ratchet `!` / `??` / `?.` / optional-spread / narrowing flagged with runtime-value assessment  
- [x] Player-facing string-literal diffs checked  
- [x] Hex Hard 450ms + Stars & Bars no history cap verified on tip and heads  
- [x] Pairwise conflicts among #544/#546/#550/#551 (+ #548) recorded  
- [x] Verification **re-run** (not trusted) with exit codes  
- [x] Deliverable only this doc; draft PR against tip; #541 stays LAST in guidance  

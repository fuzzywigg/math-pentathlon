# Compliance review 10b — tip-base drafts #601–#625

**Task id:** `q-mp-027`  
**Role:** worker (report-only)  
**Reviewer tip base (this draft PR):** `cursor/mp-tip-post477` @ `6dc4afa0`  
**Worker PR bases observed:** most heads on `91a6be7e`; later heads (#623/#625) on `a3205a32` (tip advanced under them)  
**Prior pass (not re-audited):** [#616](https://github.com/fuzzywigg/math-pentathlon/pull/616) compliance review 10a of evening drafts #589–#600  
**Tip owner PR into alpha:** [#598](https://github.com/fuzzywigg/math-pentathlon/pull/598) — not folded or merged here  
**This deliverable:** report only — one new doc; no comments, labels, edits, closes, or folds of other PRs. Never merge.

## Scope

Hunk-level verdicts vs hard rules (verbatim Oct 8 6:04 PM ET block in task) for open tip-base drafts **#601–#625** (base `cursor/mp-tip-post477`). **#611 does not exist** on the remote.

| Band | PRs |
| --- | --- |
| Tooling / docs | #601 #602 #603 #604 #605 #607 #614 #616 #619 #620 #621 #624 |
| Build / lint product-adjacent | #606 #608 |
| Visuals / a11y / CSS | #609 #610 #612 #613 #623 #625 |
| E2E / probes | #615 #617 #618 #622 |
| Duplicate task pairs | **#603/#620** (`q-mp-080`), **#604/#621** (`q-mp-074`), **#609/#612** (`q-mp-071`) |

**Method:** `gh pr list` / `gh pr diff` / path + topic greps / tip pins (Hex Hard 450, Stars & Bars uncapped history, CI `permissions`) / minify emit-identity for curly #608 / check-runs on recorded head SHAs.

## Overlap check (open drafts)

No open draft already delivers `compliance-review-10b` or a verdict band for #601–#625. Adjacent:

- **#616** — compliance review 10a (#589–#600); included here only as a reviewed tip-base draft (docs-only)
- Earlier burn-1008 reviews (#558–#588) — different scopes

## Duplicate flags (must not double-fold)

| Task | Pair | Prefer | Drop / narrow |
| --- | --- | --- | --- |
| `q-mp-080` | [#603](https://github.com/fuzzywigg/math-pentathlon/pull/603) / [#620](https://github.com/fuzzywigg/math-pentathlon/pull/620) | **#620** (adds `tests/unit/readme-npm-scripts.test.ts`) | Do **not** fold both doc edits of `CONTRIBUTING.md` / `README.md` / `docs/wiki/development.md`. From #603, optional cherry: `.github/copilot-instructions.md` only. |
| `q-mp-074` | [#604](https://github.com/fuzzywigg/math-pentathlon/pull/604) / [#621](https://github.com/fuzzywigg/math-pentathlon/pull/621) | **#604** (`ratchet-ceiling-history.{md,svg}` + `package.json` `report:ratchet-history`) | Drop #621 entirely (parallel script + `ratchet-history.*` names + `vitest.config.ts` include). Same task, divergent APIs — picking both would duplicate the reporter. |
| `q-mp-071` | [#609](https://github.com/fuzzywigg/math-pentathlon/pull/609) / [#612](https://github.com/fuzzywigg/math-pentathlon/pull/612) | **#609** (richer README index table; `/?board3d=0` captures) | Drop #612 (same 43 paths, different capture config / DSF / SwiftShader args / thinner README). |

## Reviewed heads (recorded)

| PR | Branch | Head SHA | Draft | Checks @ head |
| ---: | --- | --- | --- | --- |
| [#601](https://github.com/fuzzywigg/math-pentathlon/pull/601) | `cursor/q-mp-061-verify-script-9e68` | `b470cb14` | yes | 11/11 success |
| [#602](https://github.com/fuzzywigg/math-pentathlon/pull/602) | `cursor/q-mp-083-agent-task-template-832d` | `144261c0` | yes | 11/11 success |
| [#603](https://github.com/fuzzywigg/math-pentathlon/pull/603) | `cursor/q-mp-080-dev-commands-4f47` | `351d9f46` | yes | 11/11 success |
| [#604](https://github.com/fuzzywigg/math-pentathlon/pull/604) | `cursor/q-mp-074-ratchet-history-chart-6140` | `89b84d2e` | yes | 11/11 success |
| [#605](https://github.com/fuzzywigg/math-pentathlon/pull/605) | `cursor/q-mp-045-nnnull-ratchet-2ddd` | `9ec0b667` | yes | 11/11 success |
| [#606](https://github.com/fuzzywigg/math-pentathlon/pull/606) | `cursor/q-mp-062-build-warnings-cb4a` | `d2083214` | yes | 11/11 success |
| [#607](https://github.com/fuzzywigg/math-pentathlon/pull/607) | `cursor/q-mp-009-burn-1008-index-5619` | `5004e008` | yes | 11/11 success |
| [#608](https://github.com/fuzzywigg/math-pentathlon/pull/608) | `cursor/q-mp-043-curly-board-ui-2230` | `97013964` | yes | 11/11 success |
| [#609](https://github.com/fuzzywigg/math-pentathlon/pull/609) | `cursor/q-mp-071-ipad-visuals-101f` | `c4de1eae` | yes | 11/11 success |
| [#610](https://github.com/fuzzywigg/math-pentathlon/pull/610) | `cursor/q-mp-054-forced-colors-triage-a88d` | `befafa43` | yes | 11/11 success |
| [#612](https://github.com/fuzzywigg/math-pentathlon/pull/612) | `cursor/q-mp-071-visuals-2026-10-6b95` | `a470b1e1` | yes | 11/11 success |
| [#613](https://github.com/fuzzywigg/math-pentathlon/pull/613) | `cursor/q-mp-053-zoom-reflow-triage-e22e` | `9140b009` | yes | 11/11 success |
| [#614](https://github.com/fuzzywigg/math-pentathlon/pull/614) | `cursor/q-mp-090-oct9-backlog-8978` | `90039fb6` | yes | 11/11 success |
| [#615](https://github.com/fuzzywigg/math-pentathlon/pull/615) | `cursor/q-mp-051-e2e-fullgame-triage-011a` | `46a158ab` | yes | 10/11 success; `e2e-fullgame` still **in_progress** at review time |
| [#616](https://github.com/fuzzywigg/math-pentathlon/pull/616) | `cursor/q-mp-025-compliance-review-10a-0572` | `b1d95c8f` | yes | 11/11 success |
| [#617](https://github.com/fuzzywigg/math-pentathlon/pull/617) | `cursor/q-mp-033-cross-browser-webgl-csp-f537` | `34442844` | yes | 11/11 success |
| [#618](https://github.com/fuzzywigg/math-pentathlon/pull/618) | `cursor/q-mp-052-mobile-touch-triage-fd24` | `4b972f6b` | yes | 11/11 success |
| [#619](https://github.com/fuzzywigg/math-pentathlon/pull/619) | `cursor/q-mp-064-copy-pin-check-03e6` | `93743ea0` | yes | 11/11 success |
| [#620](https://github.com/fuzzywigg/math-pentathlon/pull/620) | `cursor/q-mp-080-dev-setup-scripts-d4c4` | `53076753` | yes | 11/11 success |
| [#621](https://github.com/fuzzywigg/math-pentathlon/pull/621) | `cursor/q-mp-074-ratchet-history-0340` | `a06cac53` | yes | 11/11 success |
| [#622](https://github.com/fuzzywigg/math-pentathlon/pull/622) | `cursor/q-mp-059-pwa-offline-probes-ae48` | `3beb0dd2` | yes | 11/11 success |
| [#623](https://github.com/fuzzywigg/math-pentathlon/pull/623) | `cursor/q-mp-057-a11y-regressions-ce79` | `bf88c3ca` | yes | 11/11 success |
| [#624](https://github.com/fuzzywigg/math-pentathlon/pull/624) | `cursor/q-mp-055-visual-baseline-triage-d64c` | `c9780821` | yes | 11/11 success |
| [#625](https://github.com/fuzzywigg/math-pentathlon/pull/625) | `cursor/q-mp-058-perf-memory-bundle-032f` | `95fae03b` | yes | 11/11 success |

## Summary table

| PR | Task | Verdict | Exact drops |
| ---: | --- | --- | --- |
| [#601](https://github.com/fuzzywigg/math-pentathlon/pull/601) | q-mp-061 | **COMPLIANT** | none |
| [#602](https://github.com/fuzzywigg/math-pentathlon/pull/602) | q-mp-083 | **COMPLIANT** | none |
| [#603](https://github.com/fuzzywigg/math-pentathlon/pull/603) | q-mp-080 | **COMPLIANT-WITH-NOTES** | **DROP** overlapping docs vs #620; optional keep only `.github/copilot-instructions.md` |
| [#604](https://github.com/fuzzywigg/math-pentathlon/pull/604) | q-mp-074 | **COMPLIANT** | none (preferred of pair) |
| [#605](https://github.com/fuzzywigg/math-pentathlon/pull/605) | q-mp-045 | **COMPLIANT-WITH-NOTES** | none; stack ceiling JSON with #608 |
| [#606](https://github.com/fuzzywigg/math-pentathlon/pull/606) | q-mp-062 | **COMPLIANT-WITH-NOTES** | none; Rollup warn limit ≠ CI budget ratchet |
| [#607](https://github.com/fuzzywigg/math-pentathlon/pull/607) | q-mp-009 | **COMPLIANT** | none |
| [#608](https://github.com/fuzzywigg/math-pentathlon/pull/608) | q-mp-043 | **COMPLIANT-WITH-NOTES** | none; minify emit-identical **16/16**; re-measure curly after stack |
| [#609](https://github.com/fuzzywigg/math-pentathlon/pull/609) | q-mp-071 | **COMPLIANT** | none (preferred of pair) |
| [#610](https://github.com/fuzzywigg/math-pentathlon/pull/610) | q-mp-054 | **COMPLIANT-WITH-NOTES** | **DROP** `src/games/ramrod/board-ui.ts` inject hunk if folding **after** #625 (re-home RM rules into `ramrod.css`) |
| [#612](https://github.com/fuzzywigg/math-pentathlon/pull/612) | q-mp-071 | **COMPLIANT-WITH-NOTES** | **DROP entire PR** (duplicate of #609) |
| [#613](https://github.com/fuzzywigg/math-pentathlon/pull/613) | q-mp-053 | **COMPLIANT** | none |
| [#614](https://github.com/fuzzywigg/math-pentathlon/pull/614) | q-mp-090 | **COMPLIANT** | none |
| [#615](https://github.com/fuzzywigg/math-pentathlon/pull/615) | q-mp-051 | **COMPLIANT-WITH-NOTES** | none; harness-only; wait for `e2e-fullgame` green before fold |
| [#616](https://github.com/fuzzywigg/math-pentathlon/pull/616) | q-mp-025 | **COMPLIANT** | none (meta review doc; fold optional) |
| [#617](https://github.com/fuzzywigg/math-pentathlon/pull/617) | q-mp-033 | **COMPLIANT** | none |
| [#618](https://github.com/fuzzywigg/math-pentathlon/pull/618) | q-mp-052 | **COMPLIANT** | none |
| [#619](https://github.com/fuzzywigg/math-pentathlon/pull/619) | q-mp-064 | **COMPLIANT** | none |
| [#620](https://github.com/fuzzywigg/math-pentathlon/pull/620) | q-mp-080 | **COMPLIANT** | none (preferred of pair) |
| [#621](https://github.com/fuzzywigg/math-pentathlon/pull/621) | q-mp-074 | **COMPLIANT-WITH-NOTES** | **DROP entire PR** (duplicate of #604) |
| [#622](https://github.com/fuzzywigg/math-pentathlon/pull/622) | q-mp-059 | **COMPLIANT** | none |
| [#623](https://github.com/fuzzywigg/math-pentathlon/pull/623) | q-mp-057 | **COMPLIANT** | none |
| [#624](https://github.com/fuzzywigg/math-pentathlon/pull/624) | q-mp-055 | **COMPLIANT** | none |
| [#625](https://github.com/fuzzywigg/math-pentathlon/pull/625) | q-mp-058 | **COMPLIANT-WITH-NOTES** | When stacking with #610: carry Ramrod RM selectors into `ramrod.css`; do not leave them only in deleted inject string |

**Counts:** COMPLIANT **15** · COMPLIANT-WITH-NOTES **9** · VIOLATION **0** · missing PR **#611**

---

## Hard rules (global)

| Rule | Global result | Evidence |
| --- | --- | --- |
| Worker draft-only; tip owner folds; Grok Bot merges tip | **PASS** (this PR) | Report-only doc; no merge / ready / alpha push |
| No AI search / scoring / difficulty / timing product edits | **PASS** | No `*/ai.ts` / `ai-client` / `ai.worker` / `ai-worker/**` in any #601–#625 diff |
| No player-facing copy / rules-text product edits | **PASS** | No tutorial / owl-messages / How-to / status string product edits. #623 ARIA/CSS only. #619 is a report-only pin detector. |
| No logic edits in `*/rules.ts` / legal-move / scoring paths | **PASS** | Zero `rules.ts` paths in band |
| Stars & Bars history uncapped | **PASS** | Tip `stars-bars/board-ui.ts` still walks full `moveHistory` (no `slice(-N)`). #608 brace-only; #610 adds RM CSS only. |
| Hex Hard **450ms** | **PASS** | Tip `src/games/hex/ai.ts` `hard: 450,` untouched; no hex AI files in band |
| CI `permissions: contents: read` + `persist-credentials: false` | **PASS** | No `.github/workflows` edits in band. Tip `ci.yml` still `permissions: contents: read`. |
| No apt / pip allowlist widen / network in tests | **PASS** | No workflow CI install surface edits |
| Ratchets only go down | **PASS** (fold note) | #608 curly **1320→1263**. #605 **adds** `@typescript-eslint/no-non-null-assertion: 387` (= measured count; new key, not a raise). Stack #605 then #608 and re-measure. |
| Forbidden topics (Merom / Sullivan / DC / grants / nonprofit / openclaw never-touch) | **PASS** | No product hits. #616 mentions Merom/openclaw only inside its hard-rules table (meta). |

---

## Emit-identical notes (curly / type hunks)

### Curly — #608 (`q-mp-043`)

**Scope:** 16× `src/games/*/board-ui.ts` brace wraps + ceiling JSON `curly: 1320→1263`.

**Rebuild vs tip `6dc4afa0` (this pass):**

```text
$ node scripts/check-emit-identity.mjs --base 6dc4afa0 --head 97013964 --minify --files-from <16 board-ui.ts>
All 16 file(s) emit-identical.
EXIT:0
```

Raw (non-minify) emit differs as expected for brace-only wraps (control: FAIL 16 files).

**Type-ratchet product hunks in #601–#625:** **none.** #605 is ratchet ceiling / probe-config only (no `src/` type edits). No emit-identity obligation beyond curly minify above.

---

## Fold order recommendation (tip owner)

Goal: avoid double application of duplicate tasks, keep curly emit-identical, and preserve forced-colors RM rules across the Ramrod CSS extract.

1. **Meta / docs (any order among themselves):** #616 (optional), #607, #614, #624, #602  
2. **Verify + preferred doc/script tooling:** #601 → **#620** (+ optional #603 `.github/copilot-instructions.md` only) → **#604** → #619 → #605  
3. **Build chunk policy:** #606  
4. **Curly board-ui (emit-identical):** #608 — then `npm run lint:ratchet` and write tip curly ceiling  
5. **CSS / a11y (non-Ramrod-conflict first):** #613 → #623  
6. **Forced-colors #610 then Ramrod extract #625** (preferred):  
   - Fold #610 (includes Ramrod inject RM)  
   - Fold #625; **when extracting**, copy the #610 Ramrod `html[data-reduced-motion]` selectors into `src/games/ramrod/ramrod.css` so they are not lost with the deleted inject string  
   - Alternate: fold #625 first, then #610 with **DROP** of `src/games/ramrod/board-ui.ts` hunk and the same CSS re-home  
7. **Preferred visuals:** **#609** only (**DROP #612**)  
8. **Probes / e2e:** #618 → #622 → #617 → #615 (after #623 so `.kings-board` exists; #615 mount already accepts `#board .board .cell`)  
9. **Explicit non-folds:** #612, #621; #603 docs overlap; #611 N/A  

**Do not fold** tip→alpha #598 from this review.

---

## Per-PR findings

### #601 — q-mp-061 `npm run verify`

**Verdict:** COMPLIANT  
**Files:** `package.json` (`verify` script), `AGENTS.md`, `CONTRIBUTING.md`  
**Hunks to drop:** none. Chains existing lint/type/boundary scripts only.

### #602 — q-mp-083 agent-task issue template

**Verdict:** COMPLIANT  
**Files:** `.github/ISSUE_TEMPLATE/agent-task.yml` only (`config.yml` untouched).  
**Hunks to drop:** none.

### #603 — q-mp-080 setup/test command docs (DUP)

**Verdict:** COMPLIANT-WITH-NOTES  
**Files:** `.github/copilot-instructions.md`, `CONTRIBUTING.md`, `README.md`, `docs/wiki/development.md`  
**Drops:** all three overlapping markdown files vs preferred #620. Optional keep: copilot instructions.

### #604 — q-mp-074 ratchet ceiling history (preferred)

**Verdict:** COMPLIANT  
**Files:** `scripts/report-ratchet-history.mjs`, tests, `docs/dev/ratchet-ceiling-history.{md,svg}`, `package.json` script  
**Hunks to drop:** none. Report-only git walk; no network in unit helpers.

### #605 — q-mp-045 `no-non-null-assertion` ratchet

**Verdict:** COMPLIANT-WITH-NOTES  
**Files:** `docs/dev/lint-ratchet-ceilings.json` (+387 key), `scripts/check-lint-ratchet.mjs` probe, inventory doc, comment in `eslint.config.js`  
**Notes:** Live ESLint does **not** hard-enable the rule (count-down only). Fold before #608 so ceiling JSON merge keeps both `curly` and `no-non-null-assertion`.  
**Hunks to drop:** none.

### #606 — q-mp-062 Vite circular-chunk / size warnings

**Verdict:** COMPLIANT-WITH-NOTES  
**Files:** `vite.shell-chunks.ts` (mp3d shared-only), `vite.config.ts` (`chunkSizeWarningLimit: 800`), unit test  
**Notes:** Raises Rollup **warning** threshold for the known three.js vendor chunk; does **not** touch `bundle-budgets.json` / CI 250 kB app budget. Narrowing `mp3d` manual chunk avoids circular graph — not AI/scoring.  
**Hunks to drop:** none.

### #607 — q-mp-009 burn-1008 index

**Verdict:** COMPLIANT  
**Files:** `docs/dev/burn-1008-index.md` only.  
**Hunks to drop:** none.

### #608 — q-mp-043 curly:all `board-ui.ts` (−57)

**Verdict:** COMPLIANT-WITH-NOTES  
**Files:** 16 board-ui modules + ceiling JSON  
**Emit-identical:** minify **16/16 OK** (see above).  
**Notes:** Independent tip-relative ceiling 1263; re-measure after stacking with any other curly work. Overlaps path set with #610/#623/#625 — fold curly first.  
**Excluded:** no `rules.ts` / `ai.ts`.  
**Hunks to drop:** none.

### #609 — q-mp-071 iPad visuals (preferred)

**Verdict:** COMPLIANT  
**Files:** `docs/visuals/2026-10/*` + capture config/spec (docs assets; not CI).  
**Hunks to drop:** none.

### #610 — q-mp-054 forced-colors / RM triage

**Verdict:** COMPLIANT-WITH-NOTES  
**Product hunks:** CSS/ARIA only — inject `html[data-reduced-motion]` mirrors in several `board-ui` style injectors + `forced-colors.css` / `style.css`. No rules/scoring/copy.  
**Conflict:** Ramrod inject RM vs #625 CSS extract — see fold order / drops.  
**Hunks to drop:** `src/games/ramrod/board-ui.ts` if #625 already landed without re-homing; otherwise none when #610 precedes #625 with CSS carry-forward.

### #612 — q-mp-071 visuals DUP

**Verdict:** COMPLIANT-WITH-NOTES  
**Drop entire PR** in favor of #609 (same paths, weaker README / different capture settings).

### #613 — q-mp-053 zoom-reflow re-triage

**Verdict:** COMPLIANT  
**Files:** `src/ui/styles/zoom-reflow.css` (wrap/overflow under zoom scopes), doc, unit test. CSS-only; no copy.  
**Hunks to drop:** none.

### #614 — q-mp-090 Oct 9 backlog

**Verdict:** COMPLIANT  
**Files:** `docs/dev/backlog-2026-10-09.md` only.  
**Hunks to drop:** none.

### #615 — q-mp-051 e2e-fullgame triage

**Verdict:** COMPLIANT-WITH-NOTES  
**Files:** `tests/e2e/fullgame/_drivers.ts`, `_harness.ts`, `juggle.spec.ts` only.  
**Class:** harness resilience (mount selectors, turn budgets, softlock reshuffles) — **not** product AI timing/scoring.  
**Notes:** At review time `e2e-fullgame` check still **in_progress** on `46a158ab`; tip owner should confirm green before fold. Mount selector already compatible with post-#623 `.kings-board`.  
**Hunks to drop:** none.

### #616 — q-mp-025 compliance review 10a

**Verdict:** COMPLIANT  
**Files:** `docs/dev/compliance-review-10a.md` only. Meta; fold optional.  
**Hunks to drop:** none.

### #617 — q-mp-033 cross-browser WebGL / CSP / flake

**Verdict:** COMPLIANT  
**Files:** e2e helpers/specs + unit keepers only (2D fallback assert, shared CSP noise filter, sum-dominoes flake). No `src/` product.  
**Hunks to drop:** none.

### #618 — q-mp-052 mobile-touch triage

**Verdict:** COMPLIANT  
**Files:** docs + report-only smoke/config tweaks; tip already green 60/60 per PR body. No product copy.  
**Hunks to drop:** none.

### #619 — q-mp-064 `check:copy-pins`

**Verdict:** COMPLIANT  
**Files:** `scripts/check-copy-pins.mjs`, docs, `package.json` script (report-only; not CI).  
**Hunks to drop:** none.

### #620 — q-mp-080 setup docs + test (preferred)

**Verdict:** COMPLIANT  
**Files:** overlapping docs + `tests/unit/readme-npm-scripts.test.ts`. Prefer over #603.  
**Hunks to drop:** none.

### #621 — q-mp-074 ratchet history DUP

**Verdict:** COMPLIANT-WITH-NOTES  
**Drop entire PR** in favor of #604 (parallel reporter under different output names).

### #622 — q-mp-059 PWA / offline probes

**Verdict:** COMPLIANT  
**Files:** probe scripts + docs only (regex / scenario fixes; not SW product / scoring).  
**Hunks to drop:** none.

### #623 — q-mp-057 a11y ≤5 fixes

**Verdict:** COMPLIANT  
**Hunks:**

| Path | Change | Class |
| --- | --- | --- |
| `src/ui/game-selector.ts` | remove duplicate section `aria-labelledby` | ARIA landmark — not copy |
| `src/games/kings-quadraphages/board-ui.ts` | query `.cell` under rows; add `kings-board` class | focus stability / sizing hook |
| `game-play.css` / `mobile-play-shell.css` | 420px kings board; 52px owl hit; focus-visible | CSS 44px / focus |
| unit SR test | assert no section labelledby | keeper |

No player-facing strings. **Hunks to drop:** none.

### #624 — q-mp-055 visual-baseline triage

**Verdict:** COMPLIANT  
**Files:** `docs/dev/q-mp-055-visual-baseline-triage.md` only (no `--update-snapshots`).  
**Hunks to drop:** none.

### #625 — q-mp-058 perf re-audit + Ramrod gzip

**Verdict:** COMPLIANT-WITH-NOTES  
**Product hunks:** move Ramrod board CSS from inject string → `src/games/ramrod/ramrod.css` + Vite import; `injectRamrodStyles()` becomes marker no-op. Scripts/docs date-stem only.  
**Hard-rule class:** styling/budget packaging — not AI search/score/difficulty/timing; no `rules.ts`.  
**Notes / drops:** stack with #610 carefully (carry RM selectors into CSS). Budgets file unchanged per PR.  
**Hunks to drop:** none if RM re-homed; otherwise do not fold #610’s Ramrod inject after a bare #625 extract.

---

## Flagged tests — player-facing text / AI move choice / timing

| PR | Notes | Action |
| ---: | --- | --- |
| #619 | Detector for copy pins (report-only) | fold as-is |
| #615 | Juggle/pent harness strategies; no product AI pins | fold as-is after checks green |
| #608 / #605 | curly / lint ratchet — no copy/AI asserts | n/a |
| Others in band | no new player-facing `toBe('…')` product pins observed in diffs | n/a |

**AI move choice / timing:** no product asserts pinning AI move selection, think delays, or Hex Hard ≠ 450.

---

## Acceptance checklist (this deliverable)

- [x] Verdict per PR #601–#625 (skip missing #611) with drops  
- [x] Duplicate pairs flagged (#603/#620, #604/#621, #609/#612)  
- [x] Emit-identical notes for curly (#608 minify 16/16); no type product hunks in band  
- [x] Fold order recommendation for tip owner  
- [x] Doc-only file changed: `docs/dev/compliance-review-10b.md`

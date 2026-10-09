# Compliance review 10a — evening worker drafts #589–#600

**Task id:** `q-mp-025`  
**Role:** worker (report-only)  
**Reviewer tip base (this draft PR):** `cursor/mp-tip-post477` @ `91a6be7e`  
**Worker PR base (all nine reviewed heads):** `cursor/integration-fold-wave5-tip-4af0` @ `9748c908`  
**Tip owner PR into alpha:** [#598](https://github.com/fuzzywigg/math-pentathlon/pull/598) — not folded or merged here  
**Prior compliance passes (different scopes; not re-audited):** #558–#588 reviews 3–9  
**This deliverable:** report only — one new doc; no comments, labels, edits, closes, or folds of other PRs.

## Scope

Review evening worker drafts with no compliance verdict yet:

| PR | Task | Title (short) |
| ---: | --- | --- |
| [#589](https://github.com/fuzzywigg/math-pentathlon/pull/589) | q-mp-031 | webglcontextlost lifecycle tests (pent-em-in + star-track) |
| [#590](https://github.com/fuzzywigg/math-pentathlon/pull/590) | q-mp-040 | curly:all braces in core/pwa/demos (−197) |
| [#591](https://github.com/fuzzywigg/math-pentathlon/pull/591) | q-mp-032 | post-restore orphan symbol inventory + tip docs |
| [#592](https://github.com/fuzzywigg/math-pentathlon/pull/592) | q-mp-041 | curly:all braces in `src/ui/**` excl. three (−60) |
| [#594](https://github.com/fuzzywigg/math-pentathlon/pull/594) | q-mp-030 | hex / fraction-pinball `destroyGame` mount cleanup |
| [#596](https://github.com/fuzzywigg/math-pentathlon/pull/596) | q-mp-042 | curly:all braces in `src/ui/three/**` (−167) |
| [#597](https://github.com/fuzzywigg/math-pentathlon/pull/597) | q-mp-073 | Mermaid map of `ci.yml` blocking vs report-only gates |
| [#599](https://github.com/fuzzywigg/math-pentathlon/pull/599) | q-mp-070 | game route lifecycle sequence + per-game map |
| [#600](https://github.com/fuzzywigg/math-pentathlon/pull/600) | q-mp-072 | board3d WebGL lifecycle docs + SwiftShader shots |

**Method:** `gh pr list` / `git diff 9748c908...<head>` (unique commits only) / hard-rule path + topic greps / minify emit-identity rebuild of curly touched files / `gh api …/commits/<sha>/check-runs` / tip tree pins (Hex Hard 450, Stars & Bars uncapped history, CI `permissions`).

## Overlap check (open drafts)

No open draft already delivers `compliance-review-10a` or a verdict on #589–#600. Adjacent:

- **#588** — compliance review 9 of #581/#582/#584/#585 (different set)
- **#583 / #580 / #572 / …** — earlier burn-1008 reviews
- **#598** — tip owner tip→alpha (out of scope; do not fold)

## Reviewed heads (recorded)

| PR | Branch | Head SHA reviewed | Draft | Base |
| ---: | --- | --- | --- | --- |
| [#589](https://github.com/fuzzywigg/math-pentathlon/pull/589) | `cursor/q-mp-031-webgl-fallback-lifecycle-1bef` | `2f04ef24efae0befa5700275572b6946dee3ca5c` | yes | wave5 tip `9748c908` |
| [#590](https://github.com/fuzzywigg/math-pentathlon/pull/590) | `cursor/q-mp-040-curly-core-pwa-demos-0530` | `375acdc129c9d935e6516e38dadc65ab6a45cf9a` | yes | wave5 tip `9748c908` |
| [#591](https://github.com/fuzzywigg/math-pentathlon/pull/591) | `cursor/q-mp-032-post-restore-orphans-8d0b` | `9401c4eed73d513b4bc4f9f57ba78217fcd0a345` | yes | wave5 tip `9748c908` |
| [#592](https://github.com/fuzzywigg/math-pentathlon/pull/592) | `cursor/q-mp-041-curly-ui-99d5` | `bbb07b508acd628f0c183c891244e941a07ca5a4` | yes | wave5 tip `9748c908` |
| [#594](https://github.com/fuzzywigg/math-pentathlon/pull/594) | `cursor/q-mp-030-destroy-cleanup-5ee1` | `1b85c0a63699b1bb3d8f0271c3416ba8a098fe61` | yes | wave5 tip `9748c908` |
| [#596](https://github.com/fuzzywigg/math-pentathlon/pull/596) | `cursor/q-mp-042-curly-ui-three-d426` | `a5c101862bfe7cbf1b7bb9ec496df83646f30096` | yes | wave5 tip `9748c908` |
| [#597](https://github.com/fuzzywigg/math-pentathlon/pull/597) | `cursor/q-mp-073-ci-gates-mermaid-a72f` | `ff5cc842f4827198be0f60e486df94e51390f51d` | yes | wave5 tip `9748c908` |
| [#599](https://github.com/fuzzywigg/math-pentathlon/pull/599) | `cursor/q-mp-070-game-lifecycle-docs-a58f` | `37cb0259521a2646d1f6c00677efe7970cf5b2b6` | yes | wave5 tip `9748c908` |
| [#600](https://github.com/fuzzywigg/math-pentathlon/pull/600) | `cursor/q-mp-072-board3d-webgl-lifecycle-c81e` | `0d368fdf7a320d438e2d9906f04cdaad5a46d323` | yes | wave5 tip `9748c908` |

All nine merge-bases equal tip `9748c908` (no divergent unique history beyond the listed commits).

## Summary table

| PR | Verdict | Check runs (head SHA) |
| ---: | --- | --- |
| [#589](https://github.com/fuzzywigg/math-pentathlon/pull/589) | **COMPLIANT** | all 11 **success** |
| [#590](https://github.com/fuzzywigg/math-pentathlon/pull/590) | **COMPLIANT-WITH-NOTES** | all 11 **success** |
| [#591](https://github.com/fuzzywigg/math-pentathlon/pull/591) | **COMPLIANT** | all 11 **success** |
| [#592](https://github.com/fuzzywigg/math-pentathlon/pull/592) | **COMPLIANT-WITH-NOTES** | all 11 **success** |
| [#594](https://github.com/fuzzywigg/math-pentathlon/pull/594) | **COMPLIANT** | all 11 **success** |
| [#596](https://github.com/fuzzywigg/math-pentathlon/pull/596) | **COMPLIANT-WITH-NOTES** | all 11 **success** |
| [#597](https://github.com/fuzzywigg/math-pentathlon/pull/597) | **COMPLIANT** | all 11 **success** |
| [#599](https://github.com/fuzzywigg/math-pentathlon/pull/599) | **COMPLIANT** | all 11 **success** |
| [#600](https://github.com/fuzzywigg/math-pentathlon/pull/600) | **COMPLIANT** | all 11 **success** |

**Counts:** COMPLIANT **6** · COMPLIANT-WITH-NOTES **3** · VIOLATION **0**

**q-mp-034 unblock:** [#594](https://github.com/fuzzywigg/math-pentathlon/pull/594) is **COMPLIANT** (mount `clearElement` cleanup only; AI emit-identical; no rules/scoring/copy/timing).

## Hard rules (global)

| Rule | Global result | Evidence |
| --- | --- | --- |
| No AI search / scoring / difficulty / timing | **PASS** | No `*/ai.ts` / `ai-worker/**` in any of the nine diffs. #594 AI files emit-identical vs tip (4/4). |
| No player-facing copy / rules-text | **PASS** | No tutorial / owl-messages / How-to edits. Curly batches are brace-only (minify emit-identical). #594 JSDoc-only comment tweaks on `destroyGame`. |
| No `*/rules.ts` / legal-move / scoring path edits | **PASS** | Zero `rules.ts` paths in any diff. |
| Hex Hard assert stays **450ms** | **PASS** | Tip + #594 tree: `src/games/hex/ai.ts` `hard: 450,` unchanged; `ai.ts` not in #594 file list. |
| Stars & Bars history uncapped | **PASS** | No `stars-bars/**` in any of the nine diffs; tip `board-ui.ts` still walks full `moveHistory` (no `slice(-N)`). |
| CI: `permissions: contents: read`, `persist-credentials: false` | **PASS** | No `.github/workflows` edits in any of the nine diffs. Tip `ci.yml` still has `permissions: contents: read` and `persist-credentials: false` on checkouts. |
| No apt / pip allowlist widen / network in tests | **PASS** | No workflow or CI install surface edits. |
| Ratchets only go down | **PASS** (fold note) | Each curly PR lowers ceiling from tip **1320**; see stack notes on #590/#592/#596. |
| Forbidden topics (Merom / openclaw / …) | **PASS** | No hits in any of the nine diffs. |

Check-run names observed on every head: `lint`, `audit`, `build`, `unit`, `e2e`, `e2e-fullgame`, `e2e-cross-browser`, `mobile-touch`, `zoom-reflow`, `forced-colors`, `visual-baseline` — all `conclusion: success`.

---

## Per-PR findings

### #589 — q-mp-031 webglcontextlost lifecycle tests

**Verdict:** COMPLIANT

**Unique commit:** `2f04ef24`  
**Files vs tip:** `tests/unit/mp3d-pent-em-in-board-3d-lifecycle.test.ts` (+23), `tests/unit/mp3d-star-track-board-3d-lifecycle.test.ts` (+25)

**Zero `src/` / workflow / AI / copy edits.** Pins existing fallback behavior (`mp3d-context-lost` / `onContextLost` + `preventDefault`); no production string or rules changes.

**Hunks to drop:** none.

**Check runs @ `2f04ef24`:** all 11 success.

---

### #590 — q-mp-040 curly:all braces in core/pwa/demos

**Verdict:** COMPLIANT-WITH-NOTES

**Unique commit:** `375acdc1`  
**Files vs tip:** 34 `src/core|pwa|demos` brace-only modules + `docs/dev/lint-ratchet-ceilings.json` (1320→1123) + `scripts/check-emit-identity.mjs` (`--minify`) + `tests/unit/check-emit-identity.test.ts`

**Excluded paths (confirmed absent):** `*/rules.ts`, `*/ai.ts`, `src/core/ai-worker/**`, `tutorial.ts`, `timer-scoring.ts`, `owl-messages.ts`.

**Emit-identity (this pass, minify on, vs tip `9748c908`):** **34/34 OK** — exit 0.  
Raw (non-minify) emit differs as expected for brace wraps (control: FAIL 34 files).

**Notes (not violations):**

1. **Ceiling stack:** Independent tip-relative ceiling 1123. Must fold with #592/#596 in order and **re-measure** tip curly count (expected after #590+#592+#596: **896**). Do not take any single PR’s ceiling JSON as the final tip value after stacking.
2. Adds `--minify` to `scripts/check-emit-identity.mjs` — tooling only; fold before relying on tip script for sibling curly proofs (#592/#596 used a local copy).

**Hunks to drop:** none.

**Check runs @ `375acdc1`:** all 11 success.

---

### #591 — q-mp-032 post-restore orphan inventory

**Verdict:** COMPLIANT

**Unique commit:** `9401c4ee`  
**Files vs tip:** docs only (`post-restore-orphans.md` new; render-perf md/json; ui-coverage-round-5; playtest star-track deep)

**Zero `src/` edits.** Annotates tip docs after Friday AI/copy restore; publishes fold drop lists for other drafts.

**Fold note (not a violation):** overlaps `docs/dev/ui-coverage-round-5.md` with #594 — tip owner should sequence doc merges (either PR’s table edits are documentation only).

**Hunks to drop:** none.

**Check runs @ `9401c4ee`:** all 11 success.

---

### #592 — q-mp-041 curly:all braces in `src/ui/**` excl. three

**Verdict:** COMPLIANT-WITH-NOTES

**Unique commit:** `bbb07b50`  
**Files vs tip:** 9 UI modules + ceiling JSON (1320→1260). Tip `scripts/check-emit-identity.mjs` untouched.

**No overlap** with #590 `src/` paths. Leaves `src/ui/three/**` for #596.

**Emit-identity (this pass, minify via #590 script copy, vs tip `9748c908`):** **9/9 OK** — exit 0.

**Notes:** Ceiling stack with #590/#596 (same as #590 note 1). Tip owner re-measure after fold.

**Hunks to drop:** none.

**Check runs @ `bbb07b50`:** all 11 success.

---

### #594 — q-mp-030 hex / pinball destroyGame mount cleanup

**Verdict:** COMPLIANT

**Unique commits:** `8fcdffaa` (failing test) → `1b85c0a6` (fix)  
**Files vs tip:**

| Path | Role |
| --- | --- |
| `src/games/hex/game-controller.ts` | `clearElement` on board/status mounts in `destroyGame` |
| `src/games/fraction-pinball/game-controller.ts` | `clearElement` on game mount in `destroyGame` |
| `tests/unit/q-mp-030-hex-pinball-destroy-cleanup.test.ts` | new TDD pins |
| `tests/unit/destroy-game-cleanup.test.ts` | expect cleared pinball host |
| `tests/unit/burn-1008-ui-cov-r5-hex-pinball-controllers.test.ts` | unskip / assert teardown |
| `docs/dev/ui-coverage-round-5.md` | mark pins fixed |

**Hard-rule classification of product hunks:**

| Hunk | Class |
| --- | --- |
| `import { clearElement } from '../../core/dom-security'` | lifecycle utility import |
| `clearElement(boardContainer|statusContainer|gameContainer)` before nulling refs | DOM teardown only — not AI search/score/difficulty/timing |
| JSDoc “and drop mount DOM/listeners” | code comment, not player-facing copy |
| Timer/worker cancel path | unchanged (`clearAiTimer` / `cancelHexAiRequests` / `disposeHexAiWorker` / `clearAiTimers` retained) |

**AI emit-identity (this pass, tip script, vs tip `9748c908`):**  
`hex/ai.ts`, `hex/ai-client.ts`, `hex/ai.worker.ts`, `fraction-pinball/ai.ts` — **4/4 OK**, exit 0.

**Hunks to drop:** none.

**Check runs @ `1b85c0a6`:** all 11 success.

**Unblocks:** `q-mp-034` (requires #594 COMPLIANT).

---

### #596 — q-mp-042 curly:all braces in `src/ui/three/**`

**Verdict:** COMPLIANT-WITH-NOTES

**Unique commit:** `a5c10186`  
**Files vs tip:** 8 `src/ui/three/*-board-3d.ts` + ceiling JSON (1320→1153)

**No overlap** with #590/#592 `src/` paths. No rules/ai/copy.

**Emit-identity (this pass, minify via #590 script copy, vs tip `9748c908`):** **8/8 OK** — exit 0.

**Notes:** Ceiling stack with #590/#592. Tip owner re-measure after fold (expected tip curly **896**).

**Hunks to drop:** none.

**Check runs @ `a5c10186`:** all 11 success.

---

### #597 — q-mp-073 CI gates Mermaid map

**Verdict:** COMPLIANT

**Unique commit:** `ff5cc842`  
**Files vs tip:** `docs/dev/ci-gates-mermaid-q-mp-073.md` only (+94)

**Docs only — no workflow edits.** Live `ci.yml` job inventory (11 jobs) all named in the doc. Aligns merge-gate set with #593 / q-mp-056 recommendation; does not change `permissions`, pip allowlist, apt, or branch protection.

**Hunks to drop:** none.

**Check runs @ `ff5cc842`:** all 11 success.

---

### #599 — q-mp-070 game route lifecycle docs

**Verdict:** COMPLIANT

**Unique commit:** `37cb0259`  
**Files vs tip:** `docs/dev/engines/game-lifecycle.md` (new), `docs/dev/engines/README.md` (+1 index), `docs/wiki/architecture.md` (+1 link)

**Docs only.** Documents cleanup contract including tip-held #594 mount `clearElement` as a draft dependency — does not implement product changes.

**Fold note:** `docs/dev/engines/README.md` also touched by #600 — trivial index-row merge.

**Hunks to drop:** none.

**Check runs @ `37cb0259`:** all 11 success.

---

### #600 — q-mp-072 board3d WebGL lifecycle + SwiftShader shots

**Verdict:** COMPLIANT

**Unique commit:** `0d368fdf`  
**Files vs tip:** `docs/dev/engines/board3d-webgl-lifecycle.md` (new), README index row, eight `docs/screenshots/mp3d/lifecycle-swiftshader-*.png`

**Docs/visuals only — no `src/` / visual-baseline / gallery / AI / copy / rules edits.** Depends on #589 for test coverage context; does not modify production fallback code.

**Hunks to drop:** none.

**Check runs @ `0d368fdf`:** all 11 success.

---

## Fold-order hints (tip owner; non-binding)

Suggested mechanical order on wave5 tip (then tip owner lands into `cursor/mp-tip-post477` / #598 as they choose):

1. **Docs/tests first (any order among themselves):** #589 → #591 → #597 → #599 → #600  
2. **#594** destroy cleanup (product lifecycle; unblocks q-mp-034 consumers)  
3. **Curly stack:** #590 (script + core) → #592 (ui) → #596 (ui/three), then **re-run `npm run lint:ratchet`** and commit the measured ceiling once

No VIOLATION hunks require drops before fold.

## Artifacts (this review)

| Artifact | Path |
| --- | --- |
| PR overview / unique commits | `/opt/cursor/artifacts/q-mp-025/pr-overview.txt` |
| Check runs JSON | `/opt/cursor/artifacts/q-mp-025/check-runs.txt` |
| Hard-rule path/topic scan | `/opt/cursor/artifacts/q-mp-025/hard-rule-scan.txt` |
| Emit #590 / #592 / #596 | `/opt/cursor/artifacts/q-mp-025/emit-590.log` etc. |
| Emit #594 AI | `/opt/cursor/artifacts/q-mp-025/emit-594-ai.log` |

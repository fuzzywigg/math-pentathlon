# burn-1008 compliance review 6 (independent pass)

**Task id:** `burn-1008-mp-compliance-review-6`  
**Reviewer base (tip):** `cursor/integration-fold-wave5-tip-4af0` @ `7466528b`  
**Tip owner PR:** [#477](https://github.com/fuzzywigg/math-pentathlon/pull/477)  
**Prior passes (not re-audited here):** [#538](https://github.com/fuzzywigg/math-pentathlon/pull/538) review-1 · [#543](https://github.com/fuzzywigg/math-pentathlon/pull/543)/docs review-2 · open drafts [#558](https://github.com/fuzzywigg/math-pentathlon/pull/558) review-3 · [#561](https://github.com/fuzzywigg/math-pentathlon/pull/561) review-4 · [#564](https://github.com/fuzzywigg/math-pentathlon/pull/564) review-5  
**Scope (live open tip drafts):** `#562` `#563` `#565` `#566` `#567` `#568`  
**Method:** `gh pr list` / full `git diff tip...PR` / hard-rule greps / tip tree cross-check (Hex Hard 450, Stars & Bars history, `markBoard3dWebGlFallback`) / per-branch re-verify (`lint`, `tsc --noEmit`, `test:unit`, `build`) / scratch conflict fold in proposed order  
**This deliverable:** report only — no edits, comments, or pushes to other PR branches.

## Hard rules checked

| Rule | Signal |
| --- | --- |
| AI search / scoring / difficulty / think-time | `ai.ts` logic, deadlines, evaluate/search |
| Legal-move generation / outcome / scoring | `rules.ts` apply/validate/score paths (characterization only OK) |
| Player-facing copy / tutorial / rules-text | status strings, tutorials, How-to, new UI text |
| Stars & Bars history cap | `moveHistory` trim / cap |
| Hex Hard 450ms assert | `AI_PLAY_DEADLINE_MS.hard` / `toBe(450)` |
| Workflow least-privilege | `contents: read`, `persist-credentials: false` |
| CI install surface | no `apt` / no pip allowlist widen |
| Forbidden topics | openclaw / Merom / Sullivan / meromhouse / pappas-infrastructure / `cron_state_reconcile` WRITE_RE |
| #567 notice reuse | `markBoard3dWebGlFallback(..., 'context-lost')` verbatim |
| #568 scope | try/finally + log-only catches (no happy-path / copy) |
| Tests-only PRs | touch only `tests/` + `docs/` (flag any extra) |

**Global scan result (PRs #562–#568):** no hits for Stars & Bars history cap, Hex Hard `450` mutation, workflow permission/apt/pip widening, openclaw/Merom/pappas paths, or `cron_state_reconcile`. Tip still has Hex Hard `hard: 450` + `toBe(450)`. No `.github/workflows` files in any of these six diffs.

**Tip drift note:** PR merge-bases sit 1–2 tip commits behind `7466528b` (`84f7d032` lint ratchet restore; `7466528b` prettier). Merges of the tests/docs PRs onto current tip still clean.

## Summary table

| PR | Title (short) | Verdict |
| ---: | --- | --- |
| [#562](https://github.com/fuzzywigg/math-pentathlon/pull/562) | Engine coverage round (characterization) | **COMPLIANT-WITH-NOTES** |
| [#563](https://github.com/fuzzywigg/math-pentathlon/pull/563) | Runtime error-path audit + pins | **COMPLIANT** |
| [#565](https://github.com/fuzzywigg/math-pentathlon/pull/565) | npm advisory audit (docs) | **COMPLIANT** |
| [#566](https://github.com/fuzzywigg/math-pentathlon/pull/566) | UI coverage round 2 | **COMPLIANT-WITH-NOTES** |
| [#567](https://github.com/fuzzywigg/math-pentathlon/pull/567) | Prime Gold WebGL context-lost fallback | **COMPLIANT** |
| [#568](https://github.com/fuzzywigg/math-pentathlon/pull/568) | shell.cleanup try/finally + owl/SW catch | **COMPLIANT** |

**Counts:** COMPLIANT **4** · COMPLIANT-WITH-NOTES **2** · VIOLATION **0**

---

## Per-PR findings

### #562 — test(engines): engine coverage round

**Verdict:** COMPLIANT-WITH-NOTES

**Branch:** `cursor/engine-coverage-round-7aa8` @ `53dc763a`  
**Files vs tip:**

| Path | Δ |
| --- | --- |
| `docs/dev/engine-coverage-round.md` | +159 (new) |
| `scripts/engine-coverage-rank.mjs` | +92 (new) |
| `tests/unit/engine-coverage-round-burn-1008.test.ts` | +825 (new) |

**Zero `src/` / workflow / AI / player-copy edits.**

**Hunks at issue:** none that breach hard rules.

**Notes (not violations):**

1. **Tests-only rule is slightly wider than tests+docs** — adds `scripts/engine-coverage-rank.mjs` (offline rank helper over `coverage-summary.json`). Dev tooling only; not product runtime.
2. Characterization imports engines (`rules` / `types` / serialization) and pins CURRENT scoring/legal-move/win arms; unreachable arms are `it.todo` — **no source fixes**. `moveHistory.length` equality asserts are round-trip pins, not a Stars & Bars history cap.
3. Hex Hard 450 untouched on tip and branch.

**Re-verify (this pass, PR head worktree):**

| Command | Result |
| --- | --- |
| `npm run lint` | exit 0 |
| `npx tsc --noEmit` | exit 0 |
| `npm run test:unit` | **3105** files / **11754** passed / **13** skipped / **7** todo (exit 0) |
| `npm run build` | exit 0 |

Artifacts: `/opt/cursor/artifacts/burn-1008-review6/pr-562-*.log`

**Minimal fix:** n/a for fold. Optional: tip owner may relocate the rank helper under `docs/dev/` scripts if preferring strict tests+docs-only.

---

### #563 — test(docs): runtime error-path audit + behavior pins

**Verdict:** COMPLIANT

**Branch:** `cursor/runtime-error-path-audit-d110` @ `ff1d1799`  
**Files vs tip:**

| Path | Δ |
| --- | --- |
| `docs/dev/runtime-error-path-audit.md` | +134 (new) |
| `tests/unit/runtime-error-path-audit.test.ts` | +304 (new) |
| `tests/unit/mp3d-prime-gold-board-3d-lifecycle.test.ts` | +34 (CURRENT pin + skip) |
| `tests/unit/mp3d-queens-guards-board-3d-lifecycle.test.ts` | +25 (recovered pin) |

**Zero `src/` edits** — confirmed. Patch-id of the audit commit is identical to the cherry-picks embedded in #567/#568 (`c260c87a…`).

**Hunks at issue:** none.

**Evidence:**

1. Pins CURRENT unrecovered behavior; expected fixes are `it.skip` with `TODO(runtime-error-path …)`:
   - **P0** R-GL-08 (Prime Gold context-lost)
   - **P1** R-SHELL-07, R-SHELL-08
   - **P2** R-IMP-04, R-SW-01, R-SHELL-04
   - **P3** R-SW-03, R-SHELL-01, R-JSON-04
2. No AI / scoring / copy / Hex 450 / workflow changes.
3. Lifecycle adds CURRENT “no `mp3d-context-lost`” pin + matching skip for the P0 fix (consumed by #567).

**Re-verify:**

| Command | Result |
| --- | --- |
| `npm run lint` | exit 0 |
| `npx tsc --noEmit` | exit 0 |
| `npm run test:unit` | **3105** files / **11742** passed / **23** skipped (exit 0) |
| `npm run build` | exit 0 |

Artifacts: `/opt/cursor/artifacts/burn-1008-review6/pr-563-*.log`

**Minimal fix:** n/a. Fold first in the audit trio.

---

### #565 — docs(dev): dependency security-advisory audit

**Verdict:** COMPLIANT

**Branch:** `cursor/dependency-advisory-audit-81c5` @ `7cbc4220`  
**Files vs tip:** `docs/dev/dependency-advisory-audit.md` only (+166).

**Zero `package.json` / lockfile / `src/` / workflow edits.** Report records `npm audit` total **0**; majors deferred as owner decisions.

**Hunks at issue:** none.

**Re-verify:**

| Command | Result |
| --- | --- |
| `npm run lint` | exit 0 |
| `npx tsc --noEmit` | exit 0 |
| `npm run test:unit` | **3104** files / **11722** passed / **13** skipped (exit 0) |
| `npm run build` | exit 0 |

Artifacts: `/opt/cursor/artifacts/burn-1008-review6/pr-565-*.log`

**Minimal fix:** n/a. Safe to fold last (docs-only; no conflict surface with the others).

---

### #566 — test(ui): non-engine UI coverage round 2

**Verdict:** COMPLIANT-WITH-NOTES

**Branch:** `cursor/burn-1008-mp-ui-coverage-round-2-12a0` @ `25a8d8f2`  
**Files vs tip:**

| Path | Δ |
| --- | --- |
| `docs/dev/ui-coverage-round-2.md` | +89 (new) |
| `tests/unit/burn-1007-main-shell-routes.test.ts` | +92 |
| `tests/unit/burn-1008-ui-cov-r2-*.test.ts` (4 new) | +920 |

**Zero `src/` edits.** Characterization of shell/UI/PWA helpers only; no `ai/` / rules / player-copy production changes. Test harness `innerHTML` / `textContent` checks assert existing highlight chrome (`x`/`5`/`ok`), not new player strings.

**Hunks at issue:** none.

**Notes:**

1. **Re-verify counts differ slightly from PR body** (body: 11761 passed / 11 skipped; this pass: **11759** passed / **13** skipped). Suite still green and stable; tip drift / env skip variance only — not a hard-rule breach.
2. Parallel to #562 (engines); no file overlap.

**Re-verify:**

| Command | Result |
| --- | --- |
| `npm run lint` | exit 0 |
| `npx tsc --noEmit` | exit 0 |
| `npm run test:unit` | **3108** files / **11759** passed / **13** skipped (exit 0) |
| `npm run build` | exit 0 |

Artifacts: `/opt/cursor/artifacts/burn-1008-review6/pr-566-*.log`

**Minimal fix:** n/a.

---

### #567 — fix(prime-gold): WebGL context-lost 2D fallback (R-GL-08)

**Verdict:** COMPLIANT

**Branch:** `cursor/prime-gold-webgl-context-lost-251f` @ `c561a32d`  
**Commits tip…HEAD:** cherry-pick of #563 audit (`1857bd7a`, same patch-id) + fix (`c561a32d`).

**Product `src/` hunks (unique vs tip):**

```diff
# src/ui/three/prime-gold-board-3d.ts — onContextLost
+    if (disposed) return;
+    unmount();
+    container.dispatchEvent(new CustomEvent('mp3d-context-lost'));

# src/games/prime-gold/game-controller.ts — kings/kwatro pattern
+function onBoard3dContextLost(): void {
+  …
+  markBoard3dWebGlFallback(boardHostEl, 'context-lost');
+  board3dEnabled = false;
+  …
+  activeController.update();
+}
+ liveHost.addEventListener('mp3d-context-lost', onBoard3dContextLost);
```

**Player-facing strings:** **none new**. Reuses existing tip helper `markBoard3dWebGlFallback(host, 'context-lost')` (DOM attr only in `src/ui/three/tablet-gl.ts`; same reason token already used by kings / queens / hex-a-gone / etc.). No status / tutorial / rules-text edits in the diff.

**#563 pin handling:** un-skips **only** P0 R-GL-08 (audit + lifecycle); leaves P1/P2/P3 skips alone. Adds controller state-preservation test in `mp3d-prime-gold-board-select.test.ts`.

**Hard rules:** no AI/search/scoring/difficulty/timing; Hex Hard 450 untouched; no workflows.

**Re-verify:**

| Command | Result |
| --- | --- |
| `npm run lint` | exit 0 |
| `npx tsc --noEmit` | exit 0 |
| `npm run test:unit` | **3105** files / **11743** passed / **21** skipped (exit 0) |
| `npm run build` | exit 0 |

(Skipped Δ vs #563: 23 → 21 = two R-GL-08 skips un-skipped.)

Artifacts: `/opt/cursor/artifacts/burn-1008-review6/pr-567-*.log`

**Minimal fix:** n/a. Fold after #563; prefer fix-only cherry-pick `c561a32d` once #563 is on tip (full merge conflicts on shared audit test/lifecycle — see matrix).

---

### #568 — fix(shell): try/finally cleanup + soft-fail owl/SW bootstrap

**Verdict:** COMPLIANT

**Branch:** `cursor/cleanup-finally-bootstrap-catch-6af5` @ `d23ff22c`  
**Commits tip…HEAD:** cherry-pick of #563 audit (`ff5e316f`, same patch-id) + fix (`d23ff22c`).

**Product `src/` scope:**

| File | Change |
| --- | --- |
| `src/ui/game-route-mounts.ts` | `setGameRouteCleanup` try/finally; new `initGameWithRouteCleanup` (cleanup registered before `init`; on throw: best-effort destroy + `shell.cleanup` + rethrow) |
| `src/pwa/bootstrap-owl.ts` | try/catch + `console.error('[bootstrap-owl] init failed', err)`; optional test injectors `importOwl` / `importOwlUi` |
| `src/pwa/register.ts` | try/catch around `registerSW` + `console.error('[pwa] service worker registration failed', err)`; soft-fail returns `{}` |

**Confirmations:**

1. **No player-facing copy** — only developer `console.error` log prefixes (not UI).
2. **Happy-path mount order preserved** — `init*Game(...)` still called with the same args; cleanup registration moves earlier solely for error recovery (R-SHELL-08).
3. **#563 pins:** un-skips P1 R-SHELL-07/08 + P2 R-IMP-04/R-SW-01; **leaves Prime Gold P0 skipped**; remaining P2 R-SHELL-04 + P3 skips stay skipped.
4. No AI / rules / scoring / Hex 450 / workflows / Prime Gold 3D render edits.

**Hunks at issue:** none.

**Re-verify:**

| Command | Result |
| --- | --- |
| `npm run lint` | exit 0 |
| `npx tsc --noEmit` | exit 0 |
| `npm run test:unit` | **3105** files / **11744** passed / **19** skipped (exit 0) |
| `npm run build` | exit 0 |

(Skipped Δ vs #563: 23 → 19 = four P1/P2 pins un-skipped.)

Artifacts: `/opt/cursor/artifacts/burn-1008-review6/pr-568-*.log`

**Minimal fix:** n/a. Fold after #563; use fix-only cherry-pick `d23ff22c` when #563 already landed. If #567 already landed, **do not** take #568’s audit-test “R-GL-08 CURRENT (no notify)” block — see conflict matrix.

---

## Conflict matrix (scratch fold on tip `7466528b`)

Scratch branch (local only, not pushed): apply order **#563 → #567 → #568 → #562 → #566 → #565**.

| Step | PR | Full-branch merge | Smart fold (unique commits) | Notes |
| ---: | ---: | --- | --- | --- |
| 1 | #563 | **CLEAN** | n/a | Lands all CURRENT pins + skips |
| 2 | #567 | **CONFLICT** — `tests/unit/runtime-error-path-audit.test.ts`, `tests/unit/mp3d-prime-gold-board-3d-lifecycle.test.ts` | **CLEAN** cherry-pick `c561a32d` | Duplicate #563 cherry-pick fights already-merged audit |
| 3 | #568 | **CONFLICT** — `docs/dev/runtime-error-path-audit.md`, lifecycle + audit tests | **CONFLICT** on fix cherry-pick `d23ff22c` → `runtime-error-path-audit.test.ts` | #568 rewrites pin sections; naive `--theirs` **re-introduces** `R-GL-08 CURRENT: … without mp3d-context-lost` and **re-skips** P0 while source already dispatches — **focused test FAIL** observed |
| 4 | #562 | **CLEAN** | n/a | tests/docs/script only |
| 5 | #566 | **CLEAN** | n/a | tests/docs only |
| 6 | #565 | **CLEAN** | n/a | docs only |

**Failure reproduced after naive #567-then-#568:**

```text
FAIL runtime-error-path-audit.test.ts
  R-GL-08 CURRENT: prime-gold context-lost unmounts without mp3d-context-lost
AssertionError: expected source not to contain CustomEvent('mp3d-context-lost')
```

**After manual pin union** (#568 P1/P2 fixed pins **plus** #567 R-GL-08 positive pin / recovered-list include / remove negative CURRENT):

| Command | Result |
| --- | --- |
| Focused audit + prime-gold lifecycle/select | 18 passed / 4 skipped |
| `npm run test:unit` (full fold) | **3110** files / **11814** passed / **17** skipped / **7** todo (exit 0) |
| Hex Hard on folded tree | `src/games/hex/ai.ts` still `hard: 450` |

Artifacts: `/opt/cursor/artifacts/burn-1008-review6/conflict-fold.log`, `fold-focused-test.log`, `fold-focused-fixed.log`, `fold-full-test.log`

### Un-skipped #563 pins after proper union

| Pin | Owner PR | Status on folded tip |
| --- | --- | --- |
| P0 R-GL-08 | #567 | **un-skipped / green** |
| P1 R-SHELL-07 | #568 | **un-skipped / green** |
| P1 R-SHELL-08 | #568 | **un-skipped / green** |
| P2 R-IMP-04 | #568 | **un-skipped / green** |
| P2 R-SW-01 | #568 | **un-skipped / green** |
| P2 R-SHELL-04 | — | still `it.skip` |
| P3 R-SW-03 / R-SHELL-01 / R-JSON-04 | — | still `it.skip` |

---

## Recommended fold order

**Preferred (minimizes audit-test surgery):**

1. **#563** — audit pins (full merge)
2. **#568** — fix-only `d23ff22c` (P1/P2); leave P0 skipped
3. **#567** — fix-only `c561a32d` (P0); its audit-test pin updates land last and stay consistent
4. **#562** — engine coverage
5. **#566** — UI coverage round 2
6. **#565** — advisory audit doc

**If keeping the task’s proposed order (#563 → #567 → #568 → …):** full merges of #567/#568 will conflict; use fix-only cherry-picks, then **manually union** `tests/unit/runtime-error-path-audit.test.ts` so both R-GL-08 positive pins and P1/P2 fixed pins remain (never keep #568’s negative R-GL-08 CURRENT pin after #567’s source fix).

**Do not** full-merge #567 or #568 onto a tip that already contains #563 without expecting conflicts on the shared audit files.

---

## Overlap / duplication check

| Topic | Open drafts | Action |
| --- | --- | --- |
| Compliance review of #562/#563/#565–#568 | none prior to this pass | this PR is the report |
| Runtime error-path audit | #563 (+ cherry-picks inside #567/#568) | fold #563 once; then fix-only from #567/#568 |
| Engine coverage | #562 only | fold |
| UI coverage round 2 | #566 only | fold |
| Advisory audit | #565 only (licenses/SBOM are other drafts) | fold |
| OWNER OPTION AI/copy (#559/#560) | covered by review-5 #564 | out of scope here |

---

## Next action

**Next action: fold into tip by the tip owner**

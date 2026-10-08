# burn-1008 compliance review 7 (independent pass)

**Task id:** `burn-1008-mp-compliance-review-7`  
**Reviewer base (tip):** `cursor/integration-fold-wave5-tip-4af0` @ `7fedc748`  
**Tip owner PR:** [#477](https://github.com/fuzzywigg/math-pentathlon/pull/477)  
**Prior passes (not re-audited here):** #538 review-1 · docs review-2 · [#558](https://github.com/fuzzywigg/math-pentathlon/pull/558) review-3 · [#561](https://github.com/fuzzywigg/math-pentathlon/pull/561) review-4 · [#564](https://github.com/fuzzywigg/math-pentathlon/pull/564) review-5 · [#572](https://github.com/fuzzywigg/math-pentathlon/pull/572) review-6 (already folded @ `da909c40`)  
**Scope (live open tip drafts):** `#571` `#573` `#574` `#575`  
**Method:** `gh pr list` / full three-dot `git diff tip...PR` + two-dot tip-vs-head uniqueness after tip advanced / hard-rule greps / tip tree cross-check (Hex Hard 450, Stars & Bars history uncapped) / per-branch re-verify (`lint`, `tsc --noEmit`, `test:unit`, `build`) / emit-identity for #573 / fold rehearsal on restored tip / targeted post-restore pin checks  
**This deliverable:** report only — no edits, comments, labels, or pushes to other PR branches.

## Tip state at review close

| Item | SHA / status |
| --- | --- |
| Tip HEAD | `7fedc748` — `restore alpha AI/copy surfaces per owner decision (pre-Friday)` |
| Already folded before this review closed | `#557` (allowed hunks) · `#562` · `#563` · `#565` · `#566` · `#567` · `#568` · `#572` |
| Hex Hard | `src/games/hex/ai.ts:21` `hard: 450,` + tip pin `toBe(450)` |
| Stars & Bars history | `src/games/stars-bars/board-ui.ts:682–683` full reverse loop over `moveHistory` (no `slice(-N)` / no cap) |

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
| Type-only / tests-only runtime drift | emit-identical JS; no silent product behavior changes |
| Tests locking restore surfaces | player-facing text / AI move choice / AI timing asserts |

**Global scan result (PRs #571/#573/#574/#575):** no workflow edits; no Hex Hard mutation; no Stars & Bars history cap; no openclaw/Merom/pappas paths; no apt/pip widening. All four PR heads keep Hex Hard `hard: 450` and uncapped Stars & Bars history identical to tip.

## Overlap check (open drafts)

No open draft already delivers compliance review 7. Adjacent:

- **#572** — review 6 of `#562–#568` (folded into tip; not covering #571/#573/#574/#575)
- **#566** — UI coverage round 2 (folded; #571 supersedes remaining r3 work)
- **#562** — engine coverage round 1 (folded; #574 stacks round 2)
- **#557** — Batch 6 type ratchet (allowed hunks folded; #573 is Batch 7)
- **#560** — AI type-only OWNER OPTION (Batch 7 correctly skips `ai.ts`)
- **#575** — open-draft triage v2 (docs; tip SHA `69a53b16` is behind current tip)

## Summary table

| PR | Title (short) | Verdict |
| ---: | --- | --- |
| [#571](https://github.com/fuzzywigg/math-pentathlon/pull/571) | UI coverage round 3 | **COMPLIANT-WITH-NOTES** |
| [#573](https://github.com/fuzzywigg/math-pentathlon/pull/573) | Type ratchet Batch 7 | **COMPLIANT-WITH-NOTES** |
| [#574](https://github.com/fuzzywigg/math-pentathlon/pull/574) | Engine coverage round 2 | **VIOLATION** |
| [#575](https://github.com/fuzzywigg/math-pentathlon/pull/575) | Open-draft triage v2 | **COMPLIANT-WITH-NOTES** |

**Counts:** COMPLIANT **0** · COMPLIANT-WITH-NOTES **3** · VIOLATION **1**

---

## Per-PR findings

### #571 — test(ui): non-engine UI coverage round 3

**Verdict:** COMPLIANT-WITH-NOTES

**Branch:** `cursor/burn-1008-mp-ui-coverage-round-3-36db` @ `baaaa1cc`  
**Merge-base (three-dot):** `7466528b`  
**vs current tip `7fedc748`:** #566 already folded — r2 paths are **IDENT** on tip; unique fold surface is r3 + doc + vitest isolate entry.

#### File / hunk classification (three-dot vs merge-base)

| Path | Class | Notes |
| --- | --- | --- |
| `docs/dev/ui-coverage-round-2.md` | OK (docs) | Already **IDENT** on tip after #566 fold |
| `docs/dev/ui-coverage-round-3.md` | OK (docs) | Round-3 report |
| `tests/unit/burn-1007-main-shell-routes.test.ts` | OK / NOTE | Already on tip via #566; includes `document.title` `/Hex/` pin + `resolveAIDifficulty` shell mapping (not AI move/timing) |
| `tests/unit/burn-1008-ui-cov-r2-*.test.ts` (4 files) | OK / NOTE | Already on tip via #566; see copy flags below |
| `tests/unit/burn-1008-ui-cov-r3-a11y-render-helpers.test.ts` | OK / NOTE | Structure/a11y; soft pin `seatIcon(...) === '🟣'` |
| `tests/unit/burn-1008-ui-cov-r3-game-selector.test.ts` | **FLAG** | Exact player-facing badge text `Coming Soon` |
| `tests/unit/burn-1008-ui-cov-r3-shell-menu.test.ts` | OK / NOTE | Help modal visibility only (synthetic `helpContentHtml`); soft pin `formatLastPlayed(0) === '—'` |
| `tests/unit/burn-1008-ui-cov-r3-storage-settings.test.ts` | OK | Storage/settings/router helpers; no copy/AI |
| `tests/unit/burn-1008-ui-cov-r3-tablet-gl-loaders.test.ts` | OK | Loader import smoke; no AI timing |
| `tests/unit/burn-1008-ui-cov-r3-tutorial-demos.test.ts` | OK | Synthetic tutorial steps (`title: 'One'`); asserts `getIsActive()` only — **no product tutorial copy** |
| `vitest.config.ts` | OK | Isolate `burn-1008-ui-cov-r3-game-selector.test.ts` |
| `src/**`, `.github/**`, `ai/**` | none | Zero product/AI edits |

#### Player-facing / AI assert flags (restore window)

| Location | Assert | Severity | Recommendation |
| --- | --- | --- | --- |
| `burn-1008-ui-cov-r3-game-selector.test.ts:57` | `expect(badge?.textContent).toBe('Coming Soon')` | **FLAG** — locks menu chrome copy | **Drop** exact string; keep `.game-card-badge` presence / disabled tabindex / accordion behavior |
| `burn-1008-ui-cov-r2-shell-helpers.test.ts:98,104` | `gameLoadErrorHint()` `/offline/i` + `/connection/i` | **FLAG** — locks offline error copy (already on tip via #566) | Tip-owner option: loosen on tip later; not introduced uniquely by r3 |
| `burn-1007-main-shell-routes.test.ts:122` | `document.title` `/Hex/` | soft NOTE | Already on tip via #566 |
| `burn-1008-ui-cov-r3-shell-menu.test.ts:143,149` | `formatLastPlayed(...) === '—'` | soft NOTE | Placeholder glyph; low restore risk |
| `burn-1008-ui-cov-r3-a11y-render-helpers.test.ts:139` | `seatIcon(...) === '🟣'` | soft NOTE | AI-seat chrome glyph; not Queens/Kings/Contig AI search |
| AI move choice / think-time / deadlines | — | **none** | No `chooseMove` / `AI_PLAY_DEADLINE` / think-delay asserts in unique r3 surface |

Post-restore tip merge of #571: targeted copy-pin suite (`Coming Soon` / offline helpers / formatLastPlayed / seatIcon) **passed**. No hard break against restored alpha copy, but exact `Coming Soon` pin still locks a player-facing string — drop before fold preferred.

#### Hard rules

| Rule | Result |
| --- | --- |
| AI behavior | PASS |
| Player-facing product edits | PASS (tests/docs only) |
| Stars & Bars history cap | PASS |
| Hex Hard 450 | PASS |
| Workflows / forbidden topics | PASS |

#### Re-verify (serial; PR head worktree)

| Command | Result |
| --- | --- |
| `npm run lint` | exit **0** |
| `npx tsc --noEmit` | exit **0** |
| `npm run test:unit` | exit **0** — **3114** files / **11811** passed / **13** skipped |
| `npm run build` | exit **0** (requires `rollup-plugin-visualizer` present in env) |

Note: first parallel run hit AI timing flakes under CPU contention; serial re-run green. One intermittent `burn-1008-ui-cov-r2-owl-idle` idle-warm flake observed once; isolated retry 9/9 passed.

**Merge onto restored tip:** clean (only r3 + doc + vitest).

---

### #573 — fix(types): Phase-2 type-ratchet Batch 7 shell/helper floor

**Verdict:** COMPLIANT-WITH-NOTES

**Branch:** `cursor/type-ratchet-batch-7-76e5` @ `caad3eb7`  
**Merge-base:** `6e75e5d9` (post-#557 baseline refresh)

#### File / hunk classification

| Path | Class | Notes |
| --- | --- | --- |
| `src/core/ai-worker/client.ts` | OK (type-only) | `seed?` / `deadlineMs?` → `number \| undefined` + JSDoc; **emit-identical** |
| `src/core/ai-worker/protocol.ts` | OK (type-only) | same EOPT widen; **emit-identical** |
| `scripts/check-emit-identity.mjs` | OK / IDENT on tip | Already landed via #560 tooling; blob-identical to tip |
| `scripts/check-type-ratchet.mjs` | OK | Expand `IN_SCOPE` for Batch-7 shells + helper tests; no AI modules |
| `tsconfig.ratchet.json` | OK | Include five helper-test files |
| `docs/dev/type-ratchet-batch-7.md` | OK (docs) | Batch report |
| `docs/dev/type-ratchet-phase2-{baseline.json,export.mjs,plan.md}` | OK / NOTE | Ceiling **220 → 216**; fold conflicts on baseline metadata `tipSha` / `taskId` / `generatedAt` only |
| `tests/unit/burn-wave14-types-helpers.test.ts` | OK | Dense `!` after known lengths |
| `tests/unit/burn-wave35-fab-a-diffy-format-helpers.test.ts` | OK | `!` on bar ids |
| `tests/unit/burn-wave35-ramrod-box-format-helpers.test.ts` | OK / NOTE | `!` + call arity fix `getValidPlacements(state, rodId)` matching product 2-arg API; assert still `length >= 0` |
| `tests/unit/burn-wave41-fab-pass-winner-helpers.test.ts` | OK | Map-key `!` |
| `tests/unit/overnight-dice-selector-reset-helpers.test.ts` | OK | `COMMON_DICE_SETS.standard!` |
| `tests/unit/check-emit-identity.test.ts` | OK | Checker unit coverage |
| `vitest.config.ts` | OK | `nodePureFiles` entry for emit checker |
| `ai.ts` / `rules.ts` scoring / tutorials / copy | untouched | Explicitly deferred to #560 / hard rules |

#### Emit-identical proof (touched `src/` modules)

Commands:

```bash
# vs PR merge-base (PR claim)
node scripts/check-emit-identity.mjs \
  --base 6e75e5d934bb46efd63d962367562011150b2c45 \
  --head caad3eb73225f44a89c932f34b4d9beb214ce476 \
  src/core/ai-worker/client.ts src/core/ai-worker/protocol.ts

# vs current restored tip
node scripts/check-emit-identity.mjs \
  --base 7fedc748bce8af7ec6c13534e18efbcdcfc2469d \
  --head caad3eb73225f44a89c932f34b4d9beb214ce476 \
  src/core/ai-worker/client.ts src/core/ai-worker/protocol.ts
```

| Module | vs merge-base | vs tip `7fedc748` |
| --- | --- | --- |
| `src/core/ai-worker/client.ts` | **identical** | **identical** |
| `src/core/ai-worker/protocol.ts` | **identical** | **identical** |

**Non-identical modules:** none (0).

`npm run typecheck:ratchet` on PR head: in-scope **0**; out-of-scope **216** ≤ baseline **216**.

#### Notes (not violations)

1. Fold onto tip conflicts **only** in `docs/dev/type-ratchet-phase2-baseline.json` header fields (`taskId` / `generatedAt` / `tipSha`). Tip owner should take Batch-7 ceiling numbers and refresh `tipSha` to the fold commit.
2. Ramrod helper arity change is test-only alignment to existing `getValidPlacements(state, rodId)` signature — not a product runtime edit.
3. Does not duplicate #560 AI surface.

#### Hard rules

| Rule | Result |
| --- | --- |
| AI behavior / timing | PASS (types only; emit-identical) |
| Player-facing copy | PASS |
| Stars & Bars / Hex 450 | PASS |
| Runtime drift in “type-only” PR | PASS (emit-identical 2/2) |

#### Re-verify (serial; PR head worktree)

| Command | Result |
| --- | --- |
| `npm run lint` | exit **0** |
| `npx tsc --noEmit` | exit **0** |
| `npm run test:unit` | exit **0** — **3105** files / **11727** passed / **13** skipped |
| `npm run build` | exit **0** |

---

### #574 — test(engines): coverage round 2 — next lowest non-AI rules

**Verdict:** VIOLATION

**Branch:** `cursor/engine-coverage-round-2-f0ea` @ `8a607e3d`  
**Merge-base:** `7466528b`  
**vs current tip:** round-1 paths (`docs/dev/engine-coverage-round.md`, `scripts/engine-coverage-rank.mjs`, `tests/unit/engine-coverage-round-burn-1008.test.ts`) are **IDENT** after #562 fold. Unique fold surface:

- `docs/dev/engine-coverage-round-2.md` (new)
- `tests/unit/engine-coverage-round-2-burn-1008.test.ts` (new)

#### File / hunk classification

| Path | Class | Notes |
| --- | --- | --- |
| `docs/dev/engine-coverage-round-2.md` | OK (docs) | Round-2 report |
| `docs/dev/engine-coverage-round.md` | IDENT on tip | Duplicate of #562 |
| `scripts/engine-coverage-rank.mjs` | IDENT on tip | Duplicate of #562 |
| `tests/unit/engine-coverage-round-burn-1008.test.ts` | IDENT on tip | Duplicate of #562 |
| `tests/unit/engine-coverage-round-2-burn-1008.test.ts` (most describes) | OK | Characterization of non-AI `rules` / types for sum-dominoes, fab-a-diffy, pent-em-in, hex-a-gone, contig-60, queens-guards, juggle, fraction-pinball, stars-bars, frac-fact, fiar, undo helpers — **no `ai.ts` imports** |
| `…round-2…test.ts` calla `getPhaseMessage` it | **VIOLATION** | Locks player-facing status text; **fails on restored tip** |
| `src/**` / workflows | none | Zero product edits |

#### Exact hunk to drop (required before fold)

**File:** `tests/unit/engine-coverage-round-2-burn-1008.test.ts`  
**Block:** `describe('engine-coverage-round-2 — calla')` →  
`it('getPhaseMessage returns empty string when gameOver and winner is null', …)`  
**Lines on PR head `8a607e3d`:** **452–462** (import alias `getPhaseMessage as callaPhase` at line **59** may stay if other calla tests remain; if this is the only `callaPhase` use, drop the import alias too).

```ts
it('getPhaseMessage returns empty string when gameOver and winner is null', () => {
  const weird: CallaGameState = {
    ...createCalla(),
    phase: 'gameOver',
    winner: null,
  };
  expect(callaPhase(weird)).toBe('');  // LOCKS player-facing status
  expect(callaOver(weird)).toBe(true);
});
```

**Proof on restored tip `7fedc748` + merged #574:**

```text
AssertionError: expected 'Red wins!' to be ''
 ❯ tests/unit/engine-coverage-round-2-burn-1008.test.ts:460:31
```

Restored `src/games/calla/rules.ts` `getPhaseMessage` treats `gameOver` + non-`tie` winner as `"${Blue|Red} wins!"` (null falls through to `'Red'`), so the empty-string pin is both a player-facing-copy lock and currently red against tip.

**Keep** the other calla its (legal pits / settleNoValidMoves / makeMove phase union) — those are engine characterization, not status copy.

#### Other AI / copy flags in round-2

| Check | Result |
| --- | --- |
| AI move choice / timing asserts | **none** |
| Tutorial / help text asserts | **none** (only the calla phase-message pin) |
| Stars & Bars history cap | PASS — `moveHistory.length` equality pins are round-trip, not a display cap |
| Hex Hard 450 | untouched |

#### Hard rules

| Rule | Result |
| --- | --- |
| AI behavior product edits | PASS |
| Player-facing copy asserts | **FAIL** — getPhaseMessage pin |
| Stars & Bars / Hex 450 | PASS |
| Tests-only claim | PASS with notes (includes `scripts/` from #562 stack; already on tip) |

#### Re-verify (serial; PR head worktree — pre-restore tip content on branch)

| Command | Result |
| --- | --- |
| `npm run lint` | exit **0** |
| `npx tsc --noEmit` | exit **0** |
| `npm run test:unit` | exit **0** — **3106** files / **11795** passed / **13** skipped / **16** todo |
| `npm run build` | exit **0** |

**Merge onto restored tip:** clean (2 new files), but **suite not fold-safe** until the getPhaseMessage it is dropped.

---

### #575 — docs(dev): open draft PR triage v2 for Oct 14 bulk-close

**Verdict:** COMPLIANT-WITH-NOTES

**Branch:** `cursor/open-draft-triage-v2-6c50` @ `b5ff3c50`  
**Files:** `docs/dev/open-draft-triage-v2.md` only (+400).

#### File / hunk classification

| Path | Class | Notes |
| --- | --- | --- |
| `docs/dev/open-draft-triage-v2.md` | OK (docs) | Report-only triage; close-comment templates; no product code |

#### Notes

1. **Tip SHA stale:** document checked tip `69a53b16`; current tip is `7fedc748`. Since then tip folded `#561/#563/#564/#565/#562/#567/#568/#566/#572` and landed the alpha AI/copy restore. Several rows still list `#562` as RESIDUAL and miss FOLDED updates for those PRs.
2. `#566` SUPERSEDED-by-`#571` guidance remains directionally right for Oct 14 close, and #566 is now also FOLDED on tip.
3. No forbidden-topic hits; no workflow/AI/copy product edits.
4. Merge onto restored tip: clean.

#### Re-verify (serial; PR head worktree)

| Command | Result |
| --- | --- |
| `npm run lint` | exit **0** |
| `npx tsc --noEmit` | exit **0** |
| `npm run test:unit` | exit **0** — **3104** files / **11722** passed / **13** skipped |
| `npm run build` | exit **0** |

---

## Recommended fold order

After the alpha AI/copy restore (**done** @ `7fedc748`) and #572’s folds (**done** @ `da909c40`):

| Order | PR | Precondition | Fold action |
| ---: | ---: | --- | --- |
| 1 | **#573** | after #557’s allowed hunks (**done**) | Fold type-only Batch 7; resolve baseline.json by taking Batch-7 ceiling (**216**) + refresh `tipSha` |
| 2 | **#571** | after #566 (**done**) | Fold r3-only surface; **prefer drop** `Coming Soon` exact text assert (`…r3-game-selector.test.ts:57`) before fold |
| 3 | **#574** | after #562 (**done**) | **Must drop** calla `getPhaseMessage` it (lines 452–462) first — proven red on restored tip — then fold round-2 files only |
| 4 | **#575** | anytime (docs) | Optional refresh of tip SHA / FOLDED rows, or fold as-is with staleness note |

Do **not** re-fold #562/#566/#572 content from these PRs (already on tip).

---

## Verification commands (exact) and results

Environment note: `npm run build` needs `rollup-plugin-visualizer` resolvable (installed in this agent env with `npm install --no-save rollup-plugin-visualizer`). Unit suites were re-run **serially** after an initial parallel run produced AI-timing flakes under contention.

| PR | Head | `npm run lint` | `npx tsc --noEmit` | `npm run test:unit` | `npm run build` |
| ---: | --- | --- | --- | --- | --- |
| #571 | `baaaa1cc` | 0 | 0 | **3114** files / **11811** passed / 13 skipped | 0 |
| #573 | `caad3eb7` | 0 | 0 | **3105** files / **11727** passed / 13 skipped | 0 |
| #574 | `8a607e3d` | 0 | 0 | **3106** files / **11795** passed / 13 skipped / 16 todo | 0 |
| #575 | `b5ff3c50` | 0 | 0 | **3104** files / **11722** passed / 13 skipped | 0 |

Artifacts: `/opt/cursor/artifacts/burn-1008-review7/` (`pr-*-verify-serial*.log`, `pr-573-emit-*.log`, `pr-574-phase-message-on-restored-tip.log`, diffs).

### Extra proof commands

```bash
# #573 emit-identical (both modules)
node scripts/check-emit-identity.mjs --base 7fedc748bce8af7ec6c13534e18efbcdcfc2469d \
  --head caad3eb73225f44a89c932f34b4d9beb214ce476 \
  src/core/ai-worker/client.ts src/core/ai-worker/protocol.ts
# → All 2 file(s) emit-identical.

# #574 getPhaseMessage pin vs restored tip
git checkout -B scratch origin/cursor/integration-fold-wave5-tip-4af0
git merge --no-ff origin/cursor/engine-coverage-round-2-f0ea
npx vitest run tests/unit/engine-coverage-round-2-burn-1008.test.ts -t 'getPhaseMessage'
# → FAIL expected 'Red wins!' to be ''
```

---

## Acceptance checklist

- [x] Every hunk of #571 / #573 / #574 / #575 classified vs tip
- [x] Hard rules checked (AI / copy / Stars & Bars / Hex 450 / workflows / forbidden topics)
- [x] #573 before/after emit-identical proven; non-identical modules listed (**none**)
- [x] #571 / #574 player-facing or AI move/timing asserts flagged; #574 violation hunk named with proof
- [x] Verdicts + recommended fold order after restore + #572 / #566 / #562 / #557
- [x] Per-PR `lint` / `tsc --noEmit` / `test:unit` / `build` recorded with counts
- [x] Docs-only deliverable; no edits/comments/labels on other PRs

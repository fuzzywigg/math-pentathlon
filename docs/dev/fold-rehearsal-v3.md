# Fold rehearsal v3 — post-Friday held drafts onto restored tip

**Task id:** `burn-1008-mp-fold-rehearsal-v3`  
**Tip branch (base):** `cursor/integration-fold-wave5-tip-4af0`  
**Tip SHA:** `dff8c0136f67242e942a9c49aff48295a7e361cf`  
(`dff8c013` — *docs(dev): sync post-restore audit tip SHA to HEAD*)  
**Tip owner PR:** [#477](https://github.com/fuzzywigg/math-pentathlon/pull/477)  
**AI/copy restore (frozen GO):** `0cdab37f` / product restore `5aa092d4` (Queens/Kings/Contig AI, delays, tutorials, status text)  
**Compliance drops source:** [#580](https://github.com/fuzzywigg/math-pentathlon/pull/580) `docs/dev/compliance-review-7.md` @ `bc2578d9`  
**Scratch merges:** local only (`/tmp/fold-rehearsal-v3/scratch`, branch `scratch/fold-rehearsal-v3-cumul` @ `55e7edce`) — **not pushed**  
**This deliverable:** report only — `docs/dev/fold-rehearsal-v3.md`. Do not treat the scratch fold as the PR diff.

**Out of scope / do not redo:** fold rehearsal v2 from triage [#545](https://github.com/fuzzywigg/math-pentathlon/pull/545) (older draft set; wave5 rehearsal lives in `docs/dev/wave5-fold-rehearsal-2026-10-08.md`).

---

## Scope (held drafts folded in rehearsal)

| Order | PR | Head branch | Head SHA | Title (short) |
| ---: | ---: | --- | --- | --- |
| 1 | [#573](https://github.com/fuzzywigg/math-pentathlon/pull/573) | `cursor/type-ratchet-batch-7-76e5` | `caad3eb7` | Type-ratchet Batch 7 |
| 2 | [#571](https://github.com/fuzzywigg/math-pentathlon/pull/571) | `cursor/burn-1008-mp-ui-coverage-round-3-36db` | `baaaa1cc` | UI coverage round 3 |
| 3 | [#577](https://github.com/fuzzywigg/math-pentathlon/pull/577) | `cursor/burn-1008-mp-ui-coverage-round-4-c3d9` | `1de745e9` | UI coverage round 4 |
| 4 | [#574](https://github.com/fuzzywigg/math-pentathlon/pull/574) | `cursor/engine-coverage-round-2-f0ea` | `8a607e3d` | Engine coverage round 2 |
| 5 | [#575](https://github.com/fuzzywigg/math-pentathlon/pull/575) | `cursor/open-draft-triage-v2-6c50` | `b5ff3c50` | Open-draft triage v2 |
| 6 | [#576](https://github.com/fuzzywigg/math-pentathlon/pull/576) | `cursor/type-ratchet-batch-8-d17f` | `82bfaad2` | Type-ratchet Batch 8 |
| 7 | [#578](https://github.com/fuzzywigg/math-pentathlon/pull/578) | `cursor/engine-coverage-round-3-0f02` | `54d670d7` | Engine coverage round 3 |
| 8 | [#579](https://github.com/fuzzywigg/math-pentathlon/pull/579) | `cursor/burn-1008-mp-mutation-audit-ui-cec5` | `04726069` | Mutation audit UI |

**Drops applied (from CR7 + restore-window findings):**

| PR | Drop | Reason |
| ---: | --- | --- |
| #571 | Exact `expect(badge?.textContent).toBe('Coming Soon')` in `tests/unit/burn-1008-ui-cov-r3-game-selector.test.ts` | CR7 FLAG — locks menu chrome copy |
| #574 | `it('getPhaseMessage returns empty string…')` (~L452–462) + unused `getPhaseMessage as callaPhase` import in `tests/unit/engine-coverage-round-2-burn-1008.test.ts` | CR7 VIOLATION — fails on restored tip (`'Red wins!'` ≠ `''`) |
| #577 | Entire `tests/unit/burn-1008-ui-cov-r4-juggle-board-controller.test.ts` | Semantic: `applyJuggleHoverPreview` removed by alpha juggle `board-ui` restore (`5aa092d4`); do **not** reintroduce helper into restored UI |
| #578 | Inherited calla `getPhaseMessage` pin in round-2 file | Same CR7 drop; already absent when #578 lands after #574 with drop |

---

## Tip baseline (before any fold)

| Command | Exit | Counts |
| --- | ---: | --- |
| `npm run lint` | **0** | eslint `src` clean |
| `npx tsc --noEmit` | **0** | no diagnostics |
| `npm run test:unit` | **0** | **3063** files / **11578** passed / **17** skipped / **7** todo |

Restored AI/copy `src/` surfaces watched (47 paths from restore commit `5aa092d4`): must remain **untouched** by the fold.

Hex Hard deadline pin: `src/games/hex/ai.ts` `hard: 450` — still present at final scratch tip.

---

## Per-step sequential fold (scratch)

Legend: **clean** = merge succeeded with no conflict markers; **conflict** = textual resolve required; **semantic** = green merge but `test:unit` red until a drop/patch.

| Step | PR | Merge | Conflict file(s) | Resolution | Restored AI/copy touched | lint | tsc | test:unit |
| ---: | ---: | --- | --- | --- | --- | ---: | ---: | --- |
| 1 | #573 | conflict | `docs/dev/type-ratchet-phase2-baseline.json` | Take Batch-7 ceiling (`outOfScopeErrors` **216**, Batch-7 `byKind`/`byCode`); refresh `tipSha` to fold commit | **none** | 0 | 0 | **3064** / **11583** p / 17 sk / 7 todo |
| 2 | #571 | clean | — | Post-merge: drop `Coming Soon` exact assert (keep `.game-card-badge` presence + disabled tabindex / accordion) | **none** | 0 | 0 | **3070** / **11633** p / 19 sk / 7 todo |
| 3 | #577 | clean + **semantic** | none textual; 5 failing tests in `burn-1008-ui-cov-r4-juggle-board-controller.test.ts` (`applyJuggleHoverPreview is not a function`) | **Drop** that test file; do not edit `src/games/juggle/board-ui.ts`. Coming Soon drop retained | **none** | 0 | 0 | **3074** / **11664** p / 20 sk / 7 todo |
| 4 | #574 | conflict | `tests/unit/engine-coverage-round-burn-1008.test.ts` (add/add) | Keep **tip** (round-1 already folded via #562). Post-merge: drop calla `getPhaseMessage` it + unused import | **none** | 0 | 0 | **3075** / **11704** p / 20 sk / 16 todo |
| 5 | #575 | clean | — | Docs-only; tip SHA inside doc may be stale — optional refresh by tip owner | **none** | 0 | 0 | **3075** / **11704** p / 20 sk / 16 todo |
| 6 | #576 | conflict | `docs/dev/type-ratchet-phase2-baseline.json` | Take Batch-8 metadata/ceiling (still **216** out-of-scope); refresh `tipSha` | **none** | 0 | 0 | **3075** / **11704** p / 20 sk / 16 todo |
| 7 | #578 | clean | — | Only round-3 files added (round-2 inherited pin already dropped at #574). Round-3 `typeof callaPhase(state) === 'string'` kept | **none** | 0 | 0 | **3076** / **11741** p / 20 sk / 22 todo |
| 8 | #579 | clean | — | Mutation UI tests/docs only | **none** | 0 | 0 | **3091** / **11852** p / 21 sk / 22 todo |

### Final scratch tip verification

| Command | Exit | Counts |
| --- | ---: | --- |
| `npm run lint` | **0** | eslint `src` clean |
| `npx tsc --noEmit` | **0** | no diagnostics |
| `npm run test:unit` | **0** | **3091** files / **11852** passed / **21** skipped / **22** todo |

Restored AI/tutorial/status `src/` files touched across entire cumulative fold: **none**.

---

## Conflict matrix

### A. Sequential conflicts / semantic breaks (this rehearsal)

| After → fold | Textual conflict | Semantic break | Resolution used |
| --- | --- | --- | --- |
| tip → #573 | `type-ratchet-phase2-baseline.json` | — | Batch-7 ceiling 216 + refresh `tipSha` |
| … → #571 | — | — | Drop Coming Soon pin |
| … → #577 | — | juggle r4 tests vs restored board-ui | Drop juggle r4 test file |
| … → #574 | round-1 `engine-coverage-round-burn-1008.test.ts` add/add | calla getPhaseMessage pin (would fail if kept) | Keep tip round-1; drop getPhaseMessage it |
| … → #575 | — | — | n/a |
| … → #576 | `type-ratchet-phase2-baseline.json` | — | Batch-8 ceiling + refresh `tipSha` |
| … → #578 | — | — | Inherited calla pin already gone |
| … → #579 | — | — | n/a |

### B. Pairwise file-overlap matrix (three-dot `tip...PR`)

Cells list overlapping paths. Soft `vitest.config.ts`-only overlaps resolve by **union** isolate/`nodePureFiles` entries.

|  | 573 | 571 | 577 | 574 | 575 | 576 | 578 | 579 |
|---|---|---|---|---|---|---|---|---|
| **573** | — | vitest.config | vitest.config | | | **baseline.json + plan/export + ratchet scripts + ai-worker types + helper tests + tsconfig.ratchet + vitest** | | |
| **571** | (sym) | — | **r2/r3 docs+tests + vitest** (r2 IDENT on tip) | | | vitest.config | | |
| **577** | (sym) | (sym) | — | | | vitest.config | | |
| **574** | | | | — | | | **round-2.md + round-2 test** | |
| **575** | | | | | — | | | |
| **576** | (sym) | (sym) | (sym) | | | — | | |
| **578** | | | | (sym) | | | — | |
| **579** | | | | | | | | — |

**Hard pairs that need care:**

1. **#573 × #576** — always fold #573 before #576; each time resolve baseline by taking the newer batch ceiling and refreshing `tipSha`.
2. **#571 × #577** — fold #571 first (with Coming Soon drop); #577 then adds r4-only files cleanly; retain the Coming Soon drop if #577 rewrites the r3 selector file.
3. **#574 × #578** — fold #574 first with calla pin dropped; #578 then lands round-3 only. If folding #578 without prior #574 drop, delete the inherited getPhaseMessage it from round-2.

### C. Notes / soft flags (not dropped in this rehearsal)

| Location | Note |
| --- | --- |
| #578 kings `getCurrentPhaseMessage` `/green square/`, `/Place a Quadraphage/`, `/Player 1 wins/`, `/Tie/` | Player-facing regex pins; **passed** on restored tip in this run. Tip-owner option to loosen later; not in CR7 required drops. |
| #575 triage doc tip SHA | Stale relative to `dff8c013`; fold as-is or refresh FOLDED rows. |
| #573/`#576` `src/core/ai-worker/{client,protocol}.ts` | Type-only EOPT widen; emit-identical per CR7 — **not** in restored Queens/Kings/Contig/product AI list. |

---

## Recommended final fold order

Matches the rehearsal order (also CR7’s order for #573/#571/#574/#575, extended for #577/#576/#578/#579):

| Step | PR | Why here |
| ---: | ---: | --- |
| 1 | **#573** | Batch-7 type floor; establishes baseline ceiling 216 before Batch 8 |
| 2 | **#571** | UI r3; **drop Coming Soon** pin before any r4 stack |
| 3 | **#577** | UI r4 on top of r3; **drop juggle-board-controller** tests (restore-incompatible) |
| 4 | **#574** | Engine r2; keep tip round-1; **drop calla getPhaseMessage** it |
| 5 | **#575** | Docs-only triage; anytime after tip freeze (placed here to keep code folds contiguous) |
| 6 | **#576** | Batch 8 after Batch 7; baseline take Batch-8 + refresh `tipSha` |
| 7 | **#578** | Engine r3 after r2 drop; confirm inherited calla pin stays out |
| 8 | **#579** | Mutation audit tests last (isolated; clean on tip alone) |

**Do not re-fold** content already on tip from #557 (allowed hunks), #562, #566, #572.

---

## Exact git commands for a clean fold (tip owner)

Run on a tip-tracking branch (not this report PR). Assumes remotes fetched.

```bash
# 0) Start from frozen tip
git fetch origin \
  cursor/integration-fold-wave5-tip-4af0 \
  cursor/type-ratchet-batch-7-76e5 \
  cursor/burn-1008-mp-ui-coverage-round-3-36db \
  cursor/burn-1008-mp-ui-coverage-round-4-c3d9 \
  cursor/engine-coverage-round-2-f0ea \
  cursor/open-draft-triage-v2-6c50 \
  cursor/type-ratchet-batch-8-d17f \
  cursor/engine-coverage-round-3-0f02 \
  cursor/burn-1008-mp-mutation-audit-ui-cec5

git checkout cursor/integration-fold-wave5-tip-4af0
git reset --hard dff8c0136f67242e942a9c49aff48295a7e361cf
# tip owner: fold on tip branch itself (or a tip-owned integration branch)

# 1) #573 — Batch 7
git merge --no-ff origin/cursor/type-ratchet-batch-7-76e5
# CONFLICT: docs/dev/type-ratchet-phase2-baseline.json
git checkout --theirs docs/dev/type-ratchet-phase2-baseline.json
git add docs/dev/type-ratchet-phase2-baseline.json
git commit  # merge commit
# refresh tipSha in baseline.json to $(git rev-parse HEAD); commit

# 2) #571 — UI r3 + drop Coming Soon
git merge --no-ff origin/cursor/burn-1008-mp-ui-coverage-round-3-36db
# Edit tests/unit/burn-1008-ui-cov-r3-game-selector.test.ts:
#   delete: expect(badge?.textContent).toBe('Coming Soon');
# keep badge presence / disabled tabindex / accordion asserts
git add tests/unit/burn-1008-ui-cov-r3-game-selector.test.ts
git commit -m "test(ui): drop Coming Soon copy pin for #571 fold (CR7)"

# 3) #577 — UI r4 + drop restore-incompatible juggle tests
git merge --no-ff origin/cursor/burn-1008-mp-ui-coverage-round-4-c3d9
git rm -f tests/unit/burn-1008-ui-cov-r4-juggle-board-controller.test.ts
git commit -m "test(ui): drop r4 juggle hover tests (applyJuggleHoverPreview gone after restore)"

# 4) #574 — engine r2 + drop calla getPhaseMessage
git merge --no-ff origin/cursor/engine-coverage-round-2-f0ea
# CONFLICT add/add: tests/unit/engine-coverage-round-burn-1008.test.ts → keep ours (tip)
git checkout --ours tests/unit/engine-coverage-round-burn-1008.test.ts
git add tests/unit/engine-coverage-round-burn-1008.test.ts
# In tests/unit/engine-coverage-round-2-burn-1008.test.ts:
#   delete it('getPhaseMessage returns empty string when gameOver and winner is null', …)
#   delete unused `getPhaseMessage as callaPhase` import
git add tests/unit/engine-coverage-round-2-burn-1008.test.ts
git commit  # merge + drops

# 5) #575 — triage docs
git merge --no-ff origin/cursor/open-draft-triage-v2-6c50

# 6) #576 — Batch 8
git merge --no-ff origin/cursor/type-ratchet-batch-8-d17f
# CONFLICT: docs/dev/type-ratchet-phase2-baseline.json → take Batch-8; refresh tipSha
git checkout --theirs docs/dev/type-ratchet-phase2-baseline.json
git add docs/dev/type-ratchet-phase2-baseline.json
git commit
# refresh tipSha; commit

# 7) #578 — engine r3 (confirm round-2 calla pin still absent)
git merge --no-ff origin/cursor/engine-coverage-round-3-0f02
# If round-2 getPhaseMessage it reappears, delete it again before commit

# 8) #579 — mutation audit
git merge --no-ff origin/cursor/burn-1008-mp-mutation-audit-ui-cec5

# Gate
npm run lint
npx tsc --noEmit
npm run test:unit
```

**Sanity after fold (must hold):**

```bash
# No restored product AI/copy paths in tip...HEAD for the fold commits
# Hex Hard still 450:
rg -n "hard:\\s*450" src/games/hex/ai.ts
```

---

## Owner cheat-sheet

1. Fold **#573** → resolve baseline to ceiling **216** → refresh `tipSha`.
2. Fold **#571** → **drop Coming Soon** string assert.
3. Fold **#577** → **delete** `burn-1008-ui-cov-r4-juggle-board-controller.test.ts` (restore removed `applyJuggleHoverPreview`).
4. Fold **#574** → keep tip round-1 test; **drop calla getPhaseMessage** it (~L452–462).
5. Fold **#575** (docs).
6. Fold **#576** → baseline take Batch-8 → refresh `tipSha`.
7. Fold **#578** → ensure inherited calla pin stays out.
8. Fold **#579**.
9. Gate: `npm run lint && npx tsc --noEmit && npm run test:unit`  
   Expected ballpark after this stack: **~3091** files / **~11852** passed (env-dependent).

---

## Method notes

- Sequential merges: real `git merge --no-ff` onto scratch from `dff8c013` in `/tmp/fold-rehearsal-v3/scratch`.
- After each step: `npm run lint`, `npx tsc --noEmit`, `VITEST_MAX_WORKERS=4 npm run test:unit`.
- Restored-surface check: `git diff --name-only dff8c013...HEAD` ∩ restore `src/` list from `5aa092d4` → always empty.
- Pairwise overlap matrix from `git diff --name-only tip...origin/<pr-branch>`.
- Artifacts: `/opt/cursor/artifacts/fold-rehearsal-v3/` (`0N-*-merge.log`, `*-lint.log`, `*-tsc.log`, `*-unit.log`, `*-verify-summary.txt`).
- No player-facing copy, scoring, AI search/timing, Stars & Bars history cap, or Hex Hard 450 changes in this deliverable (report only). Scratch fold was never pushed.

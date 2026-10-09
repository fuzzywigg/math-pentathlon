# burn-1008 compliance review 9 — drafts after review 8 (#581 / #582 / #584 / #585)

**Task id:** `q-mp-004`  
**Reviewer tip base:** `cursor/integration-fold-wave5-tip-4af0` @ `9748c908`  
**Prior pass (not re-audited):** [#583](https://github.com/fuzzywigg/math-pentathlon/pull/583) compliance review 8 of tip drafts #576–#579  
**Tip owner PR:** [#477](https://github.com/fuzzywigg/math-pentathlon/pull/477) (base still wave4 `cursor/integration-fold-wave4-tip-36e4` @ `367d291e`; head = this tip)  
**q-mp-001 reference (tip owner Batch-9 floor):** tip commit `bcb7cf93` — `fix(ci): type-ratchet Batch-9 floor, destroyGame restore, e2e harness` (`#582-minimal`)  
**This deliverable:** report only — one new doc; no edits/comments/labels/closes on other PRs.

## Reviewed heads (recorded)

| PR | Branch | Head SHA reviewed | State at review | Base OID |
| ---: | --- | --- | --- | --- |
| [#581](https://github.com/fuzzywigg/math-pentathlon/pull/581) | `cursor/burn-1008-mp-ui-coverage-round-5-abcb` | `8b5fb64e` | **MERGED** into tip (`5928c746`) | `dff8c013` |
| [#582](https://github.com/fuzzywigg/math-pentathlon/pull/582) | `cursor/type-ratchet-batch-9-fda1` | `0bc7cb4c` | **MERGED** into tip (`ec1392da`, docs/baseline only) | `dff8c013` |
| [#584](https://github.com/fuzzywigg/math-pentathlon/pull/584) | `cursor/burn-1008-mp-mutation-audit-ui-2-09ef` | `0bf14ac2` | **MERGED** into tip (`ed3dfe0c`) | `dff8c013` |
| [#585](https://github.com/fuzzywigg/math-pentathlon/pull/585) | `cursor/fold-rehearsal-v3-56d0` | `49f150c9` | **OPEN** draft (docs only; not yet folded) | `dff8c013` |

## Overlap check (open drafts)

No open draft already delivers an independent post-review-8 verdict for #581/#582/#584 plus #585 drop confirmation. Adjacent:

- **#583** — compliance review 8 of #576–#579 (predecessor; does not cover #581+)
- **#585** — fold rehearsal v3 drop list (source confirmed here; still open)
- Tip #477 already folded #573–#584 including the three MERGED targets above

## Summary table

| PR | Title (short) | Verdict | Exact drops (fold / remaining) |
| ---: | --- | --- | --- |
| [#581](https://github.com/fuzzywigg/math-pentathlon/pull/581) | UI coverage round 5 | **COMPLIANT-WITH-NOTES** | **DROP** `tests/unit/burn-1008-ui-cov-r4-juggle-board-controller.test.ts (absent on tip)` (tip kept full delete from `358e75e8`; do **not** fold #581’s `describe.skipIf` reintroduction). Inherited #571 `Coming Soon` exact assert already dropped on tip (`636608e3`). |
| [#582](https://github.com/fuzzywigg/math-pentathlon/pull/582) | type-ratchet Batch 9 | **COMPLIANT-WITH-NOTES** | Product `src/` floor **already applied** by tip owner q-mp-001 (`bcb7cf93`). Fold remainder: Batch-9 **docs + baseline tipSha only** (`ec1392da`). Drop stack baggage (#573/#576 merges) and prettier-only import wrap diffs. |
| [#584](https://github.com/fuzzywigg/math-pentathlon/pull/584) | mutation audit UI wave 2 | **COMPLIANT** | **No drops.** Tests + `docs/dev/mutation-audit-ui-2.md` only. |
| [#585](https://github.com/fuzzywigg/math-pentathlon/pull/585) | fold rehearsal v3 (drop list) | **COMPLIANT** (list confirmed) | Docs-only; drop list **matches tip**. Tip also applied an extra soft-flag drop (#578 kings copy pins, `f99d85c9`) beyond #585’s required set. |

**Counts:** COMPLIANT **2** · COMPLIANT-WITH-NOTES **2** · VIOLATION **0**

---

## Hard rules (all four)

| Rule | #581 | #582 | #584 | #585 | Evidence |
| --- | --- | --- | --- | --- | --- |
| No AI search/scoring/difficulty/timing product edits | PASS | PASS | PASS | PASS | #581/#584/#585 tests/docs; #582 type-only / emit-identical |
| No player-facing copy / rules-text product edits | PASS | PASS | PASS | PASS | no tutorial/status/product copy in diffs |
| No logic edits in `*/rules.ts` / legal-move / scoring | PASS | PASS\* | PASS | PASS | \*#582 touches `calla/rules.ts` **type-only** (`!` / index); tip owner proved emit-identical; folded via q-mp-001 |
| Stars & Bars history uncapped | PASS | PASS | PASS | PASS | tip `stars-bars/board-ui` history loop uncapped; Batch-9 only adds `!` / import wrap |
| Hex Hard **450ms** | PASS | PASS | PASS | PASS | tip `src/games/hex/ai.ts:21` `hard: 450,` |
| Workflow least-privilege / CI pip / apt | PASS | PASS | PASS | PASS | no `.github/workflows` in any of these PRs |
| Forbidden topics | PASS | PASS | PASS | PASS | no openclaw / Merom / … hits |

---

## Flagged tests — player-facing text / AI move choice / timing

Scope: unique content of #581 / #582 / #584 (and #581’s stacked r3/r4 files as they arrive on the PR head). Structural `toBe('player1')` / aria `role` / phase enums are **not** player-facing copy.

| PR | File | Lines / assert | Class | Action |
| ---: | --- | --- | --- | --- |
| #581 (stack / #571) | `tests/unit/burn-1008-ui-cov-r3-game-selector.test.ts` | `expect(badge?.textContent).toBe('Coming Soon')` | **FLAG — player-facing menu chrome** | **DROP** (already on tip via `636608e3`; keep badge presence + tabindex) |
| #581 | `tests/unit/burn-1008-ui-cov-r4-juggle-board-controller.test.ts (absent on tip)` | whole file + `describe.skipIf(!JUGGLE_HOVER_HELPER_PRESENT)` | **FLAG — restore-incompatible** (not copy/AI; helper removed) | **DROP file** (tip `358e75e8` / merge `5928c746`); do not prefer skipIf |
| #581 r5-only (`burn-1008-ui-cov-r5-*.test.ts`) | — | — | **none** for copy / AI choice / timing | fold as-is |
| #582 | helper / emit-identity tests only | — | **none** for copy / AI choice / timing | n/a |
| #584 | `mutation-ui2-*.test.ts` | seat-labels explicitly avoid Blue/Red/You/Computer strings | **none** for copy / AI choice / timing | fold as-is |
| #585 soft note → tip | `engine-coverage-round-3-burn-1008.test.ts` kings `/green square/`, `/Place a Quadraphage/`, `/Player 1 wins/`, `/Tie/` | **FLAG — player-facing** (soft in #585; not in #585 required drops) | Tip **already dropped** (`f99d85c9`) |

**AI move choice / timing:** no asserts in #581 r5, #582, or #584 that pin AI move selection, think delays, or deadlines. Hex Hard `450` untouched.

---

## #581 — UI coverage round 5

**Verdict:** COMPLIANT-WITH-NOTES  
**Head:** `8b5fb64e` · **Tip fold:** `5928c746` `merge(#581): UI coverage round 5; keep r4 juggle tests dropped`

### What it is

Tests-only characterization for 10 non-engine UI modules (+ report). Stacks #571+#577 then adds r5 suites. Includes tip-compat `skipIf` on the r4 juggle hover file when `applyJuggleHoverPreview` is absent.

### Exact drops

| Drop | Why |
| --- | --- |
| Entire `burn-1008-ui-cov-r4-juggle-board-controller.test.ts` (including skipIf hunk) | Alpha restore removed `applyJuggleHoverPreview`; tip already deleted the file at `358e75e8`. Folding #581’s skipIf would **reintroduce** a dead suite. |
| Inherited `toBe('Coming Soon')` (if still present on stack) | CR7 / #585 / tip `636608e3` |

### Folded cleanly onto tip

`docs/dev/ui-coverage-round-5.md` + five `burn-1008-ui-cov-r5-*.test.ts` files only (juggle file excluded).

---

## #582 — type-ratchet Batch 9: already applied (q-mp-001) vs remaining

**Verdict:** COMPLIANT-WITH-NOTES  
**PR head:** `0bc7cb4c` · **Batch-9 product commit:** `bc5062d6` · **q-mp-001 floor:** `bcb7cf93` · **Tip fold:** `ec1392da` `merge(#582): type-ratchet Batch 9 docs/baseline (src floor already on tip)`

### Already applied by tip owner q-mp-001 (`bcb7cf93` / `#582-minimal`)

Byte-compare `bc5062d6` ↔ `bcb7cf93` on Batch-9 product paths:

| Hunk / path | Batch-9 change | q-mp-001 status |
| --- | --- | --- |
| `src/ui/board-a11y.ts` | `CellLabelParts` optionals → `T \| undefined` (EOPT) | **APPLIED identical** |
| `src/ui/three/star-track-board-3d.ts` | `StarTrackBoard3DCallbacks` optionals → `T \| undefined` | **APPLIED identical** |
| `src/games/calla/board-ui.ts` | dense-grid / pits `!` | **APPLIED identical** |
| `src/games/calla/rules.ts` | Batch-2 lock re-clear (`!` / index; emit-identical) | **APPLIED identical** |
| `src/games/hex/board-ui.ts` | dense board / lastMove `!` | **APPLIED identical** |
| `src/games/juggle/board-ui.ts` | grid / dice tuple `!` | **APPLIED** (type hunks); **prettier import wrap differs only** — tip kept multi-line `import type { PolyominoShape, Rotation, Cell }` |
| `src/games/kings-quadraphages/board-ui.ts` | dense `!` + local `BoardClickBinding` EOPT | **APPLIED** (type hunks); **prettier import wrap differs only** |
| `src/games/stars-bars/board-ui.ts` | dense `!` / `as const` directions / history `!` | **APPLIED** (type hunks); **prettier import wrap differs only** |

q-mp-001 also carried **non-#582** tip CI work in the same commit (destroyGame restore for hex/fraction-pinball, e2e WebGL/CSP harness) — out of Batch-9 scope; not listed as remaining #582 work.

### Remaining at fold time (what merge #582 still needed)

| Remaining | Disposition on tip |
| --- | --- |
| `docs/dev/type-ratchet-batch-9.md` | **FOLDED** (`ec1392da`) |
| `docs/dev/type-ratchet-phase2-baseline.json` tipSha / metadata | **FOLDED** then tipSha refreshed to `ec1392da` (`d1cbc58d`) — do **not** keep PR’s stale `tipSha=bc5062d6` |
| `docs/dev/type-ratchet-phase2-plan.md` Batch-9 pointer | **FOLDED** |

### Not remaining (stack baggage already on tip via #573 / #576)

Three-dot `dff8c013...0bc7cb4c` also lists Batch-7/8 docs, `scripts/check-*.d.mts`, `check-type-ratchet.mjs` / export helpers, `src/core/ai-worker/{client,protocol}.ts`, helper-test floors, `tsconfig.ratchet.json`, `tests/unit/check-emit-identity.test.ts`, etc. Those landed via `merge(#573)` / `merge(#576)` **before** #582 fold — **do not re-apply**.

### Exact drops / do-not-take from #582

| Drop | Why |
| --- | --- |
| Re-apply product `src/` floor | Already on tip via q-mp-001 |
| Prettier-only import wrapping on juggle / kings / stars-bars | Tip prettier wins; emit-identical either way |
| Baseline `tipSha: bc5062d6` | Stale after fold; tip uses post-merge SHA |
| Re-merge #573/#576 stack commits | Already folded |

---

## #584 — mutation audit UI wave 2 (base / cherry-pick note)

**Verdict:** COMPLIANT  
**Head:** `0bf14ac2` · **Tip fold:** `ed3dfe0c`

### Base / cherry-pick note

| Ref | SHA | Meaning |
| --- | --- | --- |
| **#477 base** (wave4 tip) | `367d291e` on `cursor/integration-fold-wave4-tip-36e4` | Still the GitHub base of tip PR #477 |
| **#584 base** | `dff8c013` on `cursor/integration-fold-wave5-tip-4af0` | Post-Friday AI/copy restore tip (**301 commits** ahead of #477’s wave4 base) |
| **#584 commits** | `f6ec54fa`, `0bf14ac2` | Tests + `docs/dev/mutation-audit-ui-2.md` only; direct children of `dff8c013` |

**Cherry-pick guidance:** Prefer merge/cherry onto **wave5 tip ≥ `dff8c013`** (as tip owner did). Do **not** treat #584 as based on wave4/#477-base — a naive cherry onto `367d291e` skips the restore-window tip surface these tests were measured against (idle-warm / prefetch globals, seat-label restore semantics, etc.). Tip fold `ed3dfe0c` took the PR cleanly with **no drops**.

### Exact drops

**None.**

---

## #585 — drop list confirmation

**Verdict:** COMPLIANT (list confirmed against live tip `9748c908`)  
**Head:** `49f150c9` · **Doc:** `docs/dev/fold-rehearsal-v3.md (absent on tip)` (not yet on tip)

### Required drops in #585 — tip status

| #585 drop | Tip evidence | Status |
| --- | --- | --- |
| #571 `toBe('Coming Soon')` | `636608e3` merge(#571)…drop Coming Soon; assert absent on tip | **CONFIRMED applied** |
| #574 calla `getPhaseMessage returns empty…` + unused import | `208b8854` merge(#574)…drop calla pin; assert absent | **CONFIRMED applied** |
| #577 entire juggle r4 test file | `358e75e8` delete file; `5928c746` keep dropped on #581 fold | **CONFIRMED applied** |
| #578 inherited calla pin | Absent after #574 drop before #578 fold | **CONFIRMED applied** |

### Soft flags in #585 (not required drops) — tip went further

| Soft flag | Tip action |
| --- | --- |
| #578 kings `getCurrentPhaseMessage` regex pins | **Dropped** on tip (`f99d85c9`) — stronger than #585 rehearsal |

**Conclusion:** #585’s required drop list is accurate and fully reflected on tip. Tip owner additionally dropped the #585 soft-flag kings copy pins. Folding #585 itself remains a docs-only tip-owner action (rehearsal record).

---

## Recommended tip-owner fold order (historical; mostly done)

Actual tip order around these PRs (already executed):

1. … #573 → #571 (Coming Soon drop) → #577 (juggle file drop) → #574 (calla pin drop) → #575 → #576 → #578 (kings copy pins drop) → #579  
2. q-mp-001 `bcb7cf93` Batch-9 **src** floor  
3. #581 (r5 only; keep juggle dropped) → #582 (docs/baseline only) → #584  
4. Remaining open docs: **#585** (and this review)

---

## Method

- `gh pr view` / `gh pr list` for #581/#582/#584/#585/#477/#583  
- `git diff` / `git show` pairwise: `bc5062d6` vs `bcb7cf93`; merge commits `5928c746` / `ec1392da` / `ed3dfe0c`  
- Tip tree greps for Coming Soon, juggle helper, calla empty pin, Hex `hard: 450`  
- Test scans of PR heads for player-facing / AI timing asserts  

**No product source edits in this PR.**

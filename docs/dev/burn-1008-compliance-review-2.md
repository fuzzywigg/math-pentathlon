# burn-1008 compliance review 2 (independent pass)

**Task id:** `burn-1008-mp-compliance-review-2`  
**Reviewer branch tip (base):** `cursor/integration-fold-wave5-tip-4af0` @ `7b99c2bb`  
**Prior pass:** [#538](https://github.com/fuzzywigg/math-pentathlon/pull/538) → `docs/dev/burn-1008-compliance-review.md` (drafts #503–#537).  
**Scope (live):** every **new** open tip draft opened after #538 — `#539` `#540` `#541` `#542` — plus any re-cut of #537 or Batch-3 type-ratchet if present.  
**Not present at review time:** no PR `> #542`; no #537 safe-recut; no Batch-3 type-ratchet draft.  
**Method:** `gh pr list` / `gh pr diff <n>` / hard-rule greps on saved diffs / live tip tree cross-check for dynamic refs (registry, lazy imports, tests, CSS templates).  
**This deliverable:** report only — no edits, comments, or pushes to other PR branches.

## Hard rules checked

| Rule | Signal |
| --- | --- |
| AI search / scoring / difficulty / think-time | `ai.ts` logic, deadlines, evaluate/search |
| Legal-move generation / outcome / scoring | `rules.ts` apply/validate/score paths; scoring helpers |
| Player-facing copy / tutorial / rules-text | status strings, tutorials, How-to |
| Stars & Bars history cap | `moveHistory` trim / cap |
| Hex Hard 450ms assert | `AI_PLAY_DEADLINE_MS.hard` / `toBe(450)` |
| Workflow least-privilege | `contents: read`, `persist-credentials: false`; no `contents: write` |
| CI install surface | no `apt` / no pip allowlist widen |
| Forbidden topics | openclaw / Merom / Sullivan / meromhouse / pappas-infrastructure |
| Dynamic reachability (esp. #541) | registry, lazy imports, tests, CSS class templates |

**Global scan result (PRs #539–#542):** no hits for Stars & Bars history cap, Hex Hard `450` mutation, `persist-credentials: true`, `contents: write`, `apt-get` / `pip install`, openclaw/Merom/pappas paths. Tip still has Hex Hard `hard: 450` + `toBe(450)` and Stars & Bars “do not cap” history loop.

## Summary table

| PR | Title (short) | Verdict |
| ---: | --- | --- |
| [#539](https://github.com/fuzzywigg/math-pentathlon/pull/539) | Engine→UI boundary enforcement | **compliant** |
| [#540](https://github.com/fuzzywigg/math-pentathlon/pull/540) | Math precision safe re-cut of #535 | **compliant** |
| [#541](https://github.com/fuzzywigg/math-pentathlon/pull/541) | Dead-code removals (FOLD LAST) | **compliant** |
| [#542](https://github.com/fuzzywigg/math-pentathlon/pull/542) | Wave5 fold rehearsal report | **needs owner decision** |
| #537 re-cut | *(not opened)* | **n/a — absent** |
| Batch-3 type ratchet | *(not opened)* | **n/a — absent** |

**Counts:** compliant **3** · needs-owner-decision **1** · violation **0** · absent **2**

---

## Per-PR findings

### #539 — test: restore/enforce engine→UI boundary

**Verdict:** compliant

**Files:**

| Path | Δ |
| --- | --- |
| `.github/workflows/ci.yml` | +2 (one step) |
| `tests/unit/engine-ui-boundary-seats-characterization.test.ts` | +149 (new) |
| `tests/unit/ui-helper-dedupe-characterization.test.ts` | import path flip |
| `vitest.config.ts` | +2 (node-pure allowlist) |

**Hunks at issue:** none (no hard-rule breach).

**Evidence:**

1. **CI least-privilege preserved.** Diff only inserts under the existing `lint` job:

```diff
+      - name: Module-boundary import-graph ceilings (engine_imports_ui must stay 0)
+        run: npm run check:boundaries
```

   Tip workflow still has top-level `permissions: contents: read` and every `actions/checkout` uses `persist-credentials: false`. No permission block, apt, or pip changes.

2. **No `src/` product edits.** Characterization tests import tip’s post-#518 layout: `getOpponentSeat` from `src/core/seats` (engine-safe) and UI re-export from `src/ui/seat-labels`. Pins `auditBoundaries().counts.engine_imports_ui === 0` and greps engine `rules.ts`/`types.ts`/… for `from '…/ui/…'`.

3. **Seat semantics unchanged.** `legacyGetOpponent` ternary vs `core/seats` vs 18 game `getOpponent` exports — equality only; no AI / scoring / copy.

**Minimal fix:** n/a. Fold after tip already has `core/seats` (it does @ `7b99c2bb`).

---

### #540 — test(math): safe precision recut (supersedes #535)

**Verdict:** compliant

**Files:**

| Path | Δ |
| --- | --- |
| `docs/dev/math-precision-owner-decisions.md` | +132 (new) |
| `tests/unit/math-precision-audit-burn-1008.test.ts` | +581 (new) |

**Zero `src/` changes** — confirmed via `gh pr diff 540 --name-only` (docs + tests only). This is the required safe re-cut of violation [#535](https://github.com/fuzzywigg/math-pentathlon/pull/535).

**Hunks at issue:** none.

**Evidence:**

1. **Characterization of CURRENT tip behavior** (not proposed fixes):
   - `isPrime CURRENT: non-integers / NaN can return true` → `expect(primeGoldIsPrime(2.5)).toBe(true)`
   - `negate CURRENT: flips numerator only…` → flag-negative stays negative-valued
   - `isWholeNumber CURRENT` → float `%` coincidence `6.1/3.05 → true`
2. **Proposed #535 fixes are `it.skip` only** (`TODO(math-precision owner MP-PRIME-01/02|MP-NEGATE-01|MP-WHOLE-01|MP-SQUARE-01|MP-LCM-01)`), gated on owner checklist in `math-precision-owner-decisions.md`.
3. Contig-60 `evaluate` coverage is dice-expression exactness characterization — not AI search/scoring/difficulty/timing edits.
4. No workflow / AI / rules / player-copy files.

**Minimal fix:** n/a. Prefer folding **#540** and **closing #535** (do not fold #535’s `src/core/attributes/logic.ts` / `src/core/fractions/arithmetic.ts` / `src/games/prime-gold/types.ts` scoring-helper hunks).

---

### #541 — chore: execute safe dead-code removals (FOLD LAST)

**Verdict:** compliant

**Files:** inventory/report (`docs/dev/dead-code-inventory.{md,json}`, `knip.json`, `scripts/report-dead-code.mjs`, `package.json` script) **plus** these `src/` removals/demotions:

| Path | Change |
| --- | --- |
| `src/core/dom-security.ts` | delete unused export `setChildren` |
| `src/core/storage/sanitize.ts` | demote `MAX_PROFILE_ID_LENGTH` / `MAX_GAME_ID_LENGTH` / `MAX_ACHIEVEMENT_ID_LENGTH` to module-private |
| `src/style.css` | delete dead `.game-selector-header h1` media rule; delete `.tutorial-action-target` reduced-motion selectors |
| `src/ui/game-prefetch.ts` | demote `allowGamePrefetchImportsForTests` to non-export (still used by `resetGamePrefetchForTests`) |
| `src/ui/game-route-mounts.ts` | delete unused `resetGameMountDepsForTests` |

**Hunks at issue:** none that breach hard rules. Removals verified against live tip @ `7b99c2bb`.

**Dynamic / registry / test / CSS verification (required):**

| Removed symbol | Tip external refs (tests, other modules, templates) | Notes |
| --- | --- | --- |
| `setChildren` | **none** outside defining file | Safe delete |
| `MAX_*_ID_LENGTH` (3) | **none** outside `sanitize.ts` | Demote OK; values still used internally |
| `.tutorial-action-target` | **none** in TS/HTML; live class is `tutorial-tap-target` (`src/core/tutorial.ts`, `game-play.css`) | Dead CSS only |
| `.game-selector-header h1` | **none**; live markup uses `game-selector-hero` (`src/ui/game-selector.ts:224`) | Dead CSS only — not player copy |
| `allowGamePrefetchImportsForTests` | **no tip test imports**; tip tests use `resetGamePrefetchForTests` only | Demote OK on tip. Open #510 still *adds* call sites, but tip already folded `#509+#510` port without those import-path tests; #542 marks #510 SKIP |
| `resetGameMountDepsForTests` | **no tip test imports**; tip route-mount tests call `initGameMountDeps(…)` / `initGameMountDeps(null)` | Safe delete on tip |

**Kept intentionally (inventory):** `difficulty-*` CSS classes (template `difficulty-${game.difficulty}`), all `src/games/*/ai.ts` symbols (registry + dynamic import), game mounts/prefetch entries — disposition `kept`.

**Other hard rules:**

- No `ai/` behavior edits; no search/scoring/difficulty/timing; no rules-text/player copy.
- No Stars & Bars history / Hex 450 changes.
- No `.github/workflows` edits.
- `knip` invoked via `npx --yes knip@5.88.1` inside report-only script (not a lockfile / runtime dep; not a CI job; does not widen pip allowlist or add apt).

**Minimal fix:** n/a for compliance. Operational note for tip owner: keep **FOLD LAST** (after #536 twin / package.json script unions); if anyone still intends to land remaining #510 import-path coverage, restore the two test-hook exports first or drop those #510 hunks.

---

### #542 — docs(dev): wave5 fold rehearsal report

**Verdict:** needs owner decision

**Files:** `docs/dev/wave5-fold-rehearsal-2026-10-08.md` only (+218). No `src/`, no workflows, no AI/scoring/copy.

**Hunks at issue (advisory / fold-order, not code):**

1. **Recommended fold order step 1 still lands #535** (`## Recommended fold order` / Owner cheat-sheet):

   > `| 1 | **#535** math precision | Isolated core math + tests… |`

   Compliance pass #538 classified #535 as a **violation** (outcome-adjacent `isPrime` / `negate` / `isWholeNumber` / `lcm` source edits). Safe path is **#540**, not #535.

2. **Stale tip base.** Rehearsal started at `ac327bb5`. Live tip @ review is `7b99c2bb` and already includes (among others) merge(#518) seats fix, merge(#520) lint ratchet, and `7b99c2bb` fold of #505 fullgame over #507. Several “conflict / fold” rows are outdated.

3. **Inventory stops at #536.** Does not account for #537 (type-ratchet Batch 2 — prior **violation**), #538–#542, or the #540 re-cut. Following the cheat-sheet blindly would miss those constraints.

**Minimal fix:** Amend the rehearsal doc (or a tip-owner note) to: (a) **SKIP/close #535**; fold **#540** instead for math precision; (b) **SKIP/close #537** until a rules-safe re-cut exists; (c) refresh inventory against tip `7b99c2bb` and open drafts through #542; (d) keep #541 / #536 as fold-last. No product-code change required for this PR itself.

---

### Absent while reviewing (checked live)

| Expected follow-up | Status |
| --- | --- |
| Re-cut of #537 (rules nullish / type-ratchet Batch 2) | **Not opened** — #537 still the original violation draft |
| Batch-3 type ratchet | **Not opened** |

No additional tip drafts `> #542` at review time (`gh pr list` → `[]`).

---

## Specific checklist (task acceptance)

| Check | Result |
| --- | --- |
| #540 has zero `src/` changes | **PASS** — only `docs/dev/math-precision-owner-decisions.md` + `tests/unit/math-precision-audit-burn-1008.test.ts` |
| #541 removes nothing referenced dynamically (registry / lazy imports / tests / CSS templates) | **PASS** — see per-symbol table above; `difficulty-*` and all game `ai.ts` kept |
| Nothing touches `ai/` search/scoring/difficulty/timing | **PASS** for #539–#542 |
| No player-facing copy or rules-text changes | **PASS** |
| Hex Hard assert still 450ms on tip | **PASS** — `src/games/hex/ai.ts` `hard: 450`; `tests/unit/ai-hard-midgame-identity.test.ts` (`HEX_MS.hard` ≤ 450); untouched by #539–#542 |
| No Stars & Bars history cap | **PASS** — tip still “Full history display (do not cap…)”; untouched |
| CI workflows keep least-privilege | **PASS** — tip `contents: read` + `persist-credentials: false`; #539 only adds `npm run check:boundaries` step |

---

## Verification commands and output summaries

```bash
git rev-parse HEAD
# → 7b99c2bbd63b4634a5fef9703c9aa76b6d61c343
```

```bash
gh pr list --repo fuzzywigg/math-pentathlon \
  --base cursor/integration-fold-wave5-tip-4af0 --state open --draft --limit 100 \
  --json number,title --jq '.[] | select(.number >= 539) | "#\(.number) \(.title)"'
```

**Result:** `#542` `#541` `#540` `#539` only (no newer tip drafts).

```bash
gh pr list --repo fuzzywigg/math-pentathlon --state open --json number,title \
  --jq '[.[] | select(.number > 542)]'
# → []
```

```bash
for n in 539 540 541 542; do
  gh pr diff "$n" --repo fuzzywigg/math-pentathlon > "/tmp/pr-diffs-review2/${n}.diff"
done
gh pr diff 540 --repo fuzzywigg/math-pentathlon --name-only
# → docs/dev/math-precision-owner-decisions.md
#    tests/unit/math-precision-audit-burn-1008.test.ts
```

```bash
rg -n 'toBeLessThan\(450\)|toBe\(450\)|AI_PLAY_DEADLINE_MS|historyCap|MAX_HISTORY|moveHistory\.slice|persist-credentials:\s*true|contents:\s*write|apt-get|pip install|openclaw|meromhouse|pappas-infrastructure' \
  /tmp/pr-diffs-review2/{539,540,541,542}.diff
# → (no hits)
```

```bash
rg -n 'hard: 450|toBe\(450\)' src/games/hex/ai.ts tests/unit/hex-deep-playability.test.ts
# → src/games/hex/ai.ts:21:  hard: 450,
#    tests/unit/hex-deep-playability.test.ts:58:    expect(ai.AI_PLAY_DEADLINE_MS.hard).toBe(450);

rg -n 'do not cap|moveHistory' src/games/stars-bars/board-ui.ts | head -5
# → Full history display (do not cap — #501 fold …)
```

```bash
# #541 removal external-ref check on tip (defining sites only → safe)
for sym in setChildren MAX_PROFILE_ID_LENGTH tutorial-action-target \
  game-selector-header allowGamePrefetchImportsForTests resetGameMountDepsForTests; do
  rg -n "$sym" --glob '!**/node_modules/**' --glob '!**/dead-code*'
done
# → only defining files under src/core/dom-security.ts, sanitize.ts, style.css,
#    game-prefetch.ts, game-route-mounts.ts (no tests / registry / template users)

rg -n 'tutorial-tap-target|game-selector-hero' src/core/tutorial.ts src/ui/game-selector.ts | head
# → live classes confirm dead-name removals

rg -n 'permissions:|contents:|persist-credentials' .github/workflows/ci.yml | head -20
# → permissions: contents: read; persist-credentials: false throughout
```

Raw capture: `/opt/cursor/artifacts/burn-1008-compliance-review-2-verify.log`.

---

## Owner fold hints (from this pass only)

1. Fold **#539** (boundary CI + characterization) — compliant.  
2. Fold **#540**; **do not fold #535**.  
3. Do **not** fold **#537** until a rules-safe re-cut appears.  
4. Treat **#542** as advisory only until fold order is amended (#535→#540, tip refresh).  
5. Fold **#541** last (with #536 inventory twin / package.json unions).  
)

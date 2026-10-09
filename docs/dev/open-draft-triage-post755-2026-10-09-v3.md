# Open draft triage — tip post755 refresh v3 (2026-10-09)

**Task id:** `q-mp-259`  
**Live tip branch:** `cursor/mp-tip-post755`  
**Tip SHA checked:** `74a1596f71aab5d6616ff486b2a4eb2a70b5123b` (`74a1596f`) — tip cut from `alpha` after tip PR **#755** (`q-mp-026h`) squash-merged  
**Prior triage (stale for this tip):** [`open-draft-triage-post748-2026-10-09-v2.md`](./open-draft-triage-post748-2026-10-09-v2.md) (`q-mp-234` / open draft **#758** — leave open; comment `contained`)  
**Machine-readable twin:** [`open-draft-triage-post755-2026-10-09-v3.json`](./open-draft-triage-post755-2026-10-09-v3.json)  
**Generated (UTC):** 2026-10-09T21:51:31Z  
**Scope:** report only — **do not close PRs**. Workers may comment `contained` / `superseded` only; tip owner folds into `cursor/mp-tip-post755`.  
**Self note:** this triage lands as a new draft into **post755** — listed for completeness.  
**Spec note:** backlog `q-mp-259` text still says tip post748 / basename `open-draft-triage-post748-*-v3`; live tip cut is **post755** after #755, so this deliverable uses the post755 basename.

## Hard rule (this doc)

> **Do not close PRs.** Prefer comments `contained` or `superseded` (with keeper / tip SHA). Closing remains a tip-owner / Andrew bulk-close action, not a worker action.

## Tip context

Tip PR **#755** (`q-mp-026h`) folded the post748 worker queue (batch through `#775`, plus tip-owner ceiling/knip re-measures) onto `cursor/mp-tip-post748` and squash-merged to `alpha` @ `74a1596f`. The new integration tip is **`cursor/mp-tip-post755`** (same SHA). Remaining open drafts still declare base `cursor/mp-tip-post748` (or older) and need **retarget → `cursor/mp-tip-post755`** before fold unless marked CONTAINED / HOLD / WAIT_CI.

`AGENTS.md` / wiki tip pointers on this SHA still cite `cursor/mp-tip-post748` — tip-owner tip-pointer refresh is outside this docs-only triage.

## Live tip ratchet ceilings (re-measured)

Commands on tip `74a1596f`:

```text
$ git rev-parse HEAD
  74a1596f71aab5d6616ff486b2a4eb2a70b5123b

$ npm run lint:ratchet   # exit 0
  ok   curly: 538 / ceiling 538
  ok   @typescript-eslint/no-non-null-assertion: 246 / ceiling 246
  ok   @typescript-eslint/no-confusing-void-expression: 86 / ceiling 86
  ok   radix: 6 / ceiling 6
  ok   default-case: 5 / ceiling 5
  ok   no-duplicate-imports: 78 / ceiling 78
  ok   @typescript-eslint/prefer-nullish-coalescing: 65 / ceiling 65
  ok   @typescript-eslint/prefer-optional-chain: 21 / ceiling 21
  ok   @typescript-eslint/switch-exhaustiveness-check: 8 / ceiling 8
  ok   @typescript-eslint/no-shadow: 13 / ceiling 13

$ npm run check:dev-docs   # exit 0 — problems: 0
  docs scanned: 127; path/symbol/md checks clean

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3156

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  hard: 450   ← HOLD untouched
```

| Rule / metric | Live / ceiling |
| --- | ---: |
| `curly` | 538 / 538 |
| `@typescript-eslint/no-non-null-assertion` | 246 / 246 |
| `@typescript-eslint/no-confusing-void-expression` | 86 / 86 |
| `radix` | 6 / 6 |
| `default-case` | 5 / 5 |
| `no-duplicate-imports` | 78 / 78 |
| `@typescript-eslint/prefer-nullish-coalescing` | 65 / 65 |
| `@typescript-eslint/prefer-optional-chain` | 21 / 21 |
| `@typescript-eslint/switch-exhaustiveness-check` | 8 / 8 |
| `@typescript-eslint/no-shadow` | 13 / 13 |
| Knip `unusedTypes` (baseline) | 83 |
| Knip `unusedExports` (baseline) | 3 |
| Knip `duplicates` (baseline) | 1 |
| Knip `unlisted` (baseline) | 3 |
| Unit `*.test.ts`/`*.spec.ts` under `tests/unit` (excl. archive) | **3156** |

## Enumeration

| Bucket | Count | Notes |
| --- | ---: | --- |
| Open drafts **base** `cursor/mp-tip-post755` | **0** | Tip cut is new; no drafts retargeted yet at snapshot time (except this v3 when opened) |
| Open drafts still **base** `cursor/mp-tip-post748` | **24** | #754–#778 (gap #755 tip PR merged) |
| Open draft **on hold** (base `post709`) | **1** | #727 (`q-mp-186`) — tip-owner HOLD; **do not touch nullish** |
| **Primary list (this v3)** | **25** | #727 + post748 open set above |
| Legacy open stacks (`post728` / `post709` / `post700` / `post598` / `post477` / …) | many | Outside fold queue — leave open; do not close |

Source: `gh pr list --base cursor/mp-tip-post755 --state open` (empty at snapshot); `gh pr list --base cursor/mp-tip-post748 --state open` → 24; explicit `gh pr view 727`. Fold evidence: tip PR #755 body fold table + tip-tree file presence @ `74a1596f`.

## Classification legend

| Status | Meaning |
| --- | --- |
| **CONTAINED** | Payload already on tip `74a1596f` via #755 squash; leave PR open; comment `contained` |
| **CONTAINED_BY_V3** | Prior triage #758 superseded for navigation by this v3; tip already has #758 blobs |
| **HOLD** | Tip-owner hold — do not fold / do not edit nullish |
| **FOLD_READY_RETARGET** | Review-clean for fold after base retarget `post748` → `post755` |
| **WAIT_CI** | Payload not on tip; fold only after GitHub checks are 12/12 green |

## Conflict / shared-file clusters (unfolded only)

| Cluster | PRs | Files | Fold note |
| --- | --- | --- | --- |
| Lint ceilings JSON | HOLD #727 only among unfolded | `docs/dev/lint-ratchet-ceilings.json` | Do **not** fold #727. No other unfolded draft touches ceilings at snapshot. |
| Ratchet history SVG | #763 | `docs/dev/ratchet-ceiling-history.{md,svg}`, `scripts/report-ratchet-history.mjs`, unit test | Tip has **older** blobs (pre-#763 refresh). Fold when unit CI green; re-measure SVG against live ceilings (void **86**, dup **78**, nnnull **246**). |
| Mutation / UI cov tests | #776, #777, #778 | disjoint PR paths (not on tip yet) | Serialize only if tip-owner batches; no shared ceiling JSON. |
| Triage narrative | #758 vs this v3 | `docs/dev/open-draft-triage-*` | Leave #758 open with `contained`; fold this v3 for post755 queue. |

## Suggested fold order (tip owner) — unfolded only

Retarget each keeper to `cursor/mp-tip-post755` before folding. Skip all CONTAINED / HOLD rows. Do not fold WAIT_CI until 12/12 green.

| Order | PR | Task | Readiness | Why here |
| ---: | ---: | --- | --- | --- |
| 1 | #776 | `q-mp-277` | FOLD_READY_RETARGET | Tests-only game-shell soft-fail; unique file; 12/12 SUCCESS |
| 2 | #777 | `q-mp-269` | FOLD_READY_RETARGET | UI cov r14 juggle docs+test; unique paths; 12/12 SUCCESS |
| 3 | #778 | `q-mp-272` | **WAIT_CI** | Mutation UI wave 8; unit FAILURE (and e2e-cross-browser incomplete at snapshot) |
| 4 | #763 | `q-mp-236` | **WAIT_CI** | Ratchet history SVG refresh; unit FAILURE (flaky AI-calibration noted in #755 remaining table) |
| — | #727 | `q-mp-186` | **HOLD** | Nullish owl-messages — tip-owner HOLD; do not retarget / do not fold |
| — | #754–#762, #764–#775, #758 | (folded) | **CONTAINED** | Already on tip via #755; leave open |

## Per-PR cards — unfolded keepers + HOLD

### #727 — `q-mp-186` — HOLD

| Field | Value |
| --- | --- |
| Title | clear prefer-nullish-coalescing in owl-messages (−9) |
| Base / head | `cursor/mp-tip-post709` / `cursor/q-mp-186-nullish-owl-messages-0a20` @ `54532ce5` |
| Mergeable (declared base) | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | `src/core/owl/owl-messages.ts`, `docs/dev/lint-ratchet-ceilings.json`, `docs/dev/eslint-off-rules-inventory.md` |
| Ratchet ceilings touched | `prefer-nullish-coalescing` **65 → 56** (−9) |
| Fold-readiness | **HOLD** — tip-owner instruction; skip on post755. Do not retarget / do not fold / do not edit nullish from other agents. |
| Conflicts / ordering | Would share ceilings JSON if ever unheld — min-wins then. |

### #763 — `q-mp-236` — WAIT_CI

| Field | Value |
| --- | --- |
| Title | refresh ratchet-ceiling-history SVG for tip post748 |
| Base / head | `cursor/mp-tip-post748` / `cursor/q-mp-236-ratchet-history-svg-3d12` @ `8787f001` |
| Mergeable | MERGEABLE / UNSTABLE · CI 11 SUCCESS + **unit FAILURE** |
| Files | `docs/dev/ratchet-ceiling-history.md`, `.svg`, `scripts/report-ratchet-history.mjs`, `tests/unit/report-ratchet-history.test.ts` |
| Tip blob check | Tip has same paths but **different** blobs (older history from prior folds) — **not contained** |
| Fold-readiness | Wait for 12/12 green, then retarget post748→post755; tip owner should regenerate against live ceilings if needed. |
| Conflicts / ordering | Named in #755 “Remaining unfolded”; skipped at tip fold due to unit flake. |

### #776 — `q-mp-277` — FOLD_READY_RETARGET

| Field | Value |
| --- | --- |
| Title | characterize game-shell soft-fail / chrome residuals (tests-only) |
| Base / head | `cursor/mp-tip-post748` / `cursor/q-mp-277-game-shell-soft-fail-a0c6` @ `83321ac5` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | PR #776 only — game-shell soft-fail chrome unit test (absent on tip) |
| Tip blob check | **MISSING** on `74a1596f` |
| Fold-readiness | Ready after retarget to post755; tests-only; no ceiling JSON. |
| Conflicts / ordering | None with other unfolded keepers. |

### #777 — `q-mp-269` — FOLD_READY_RETARGET

| Field | Value |
| --- | --- |
| Title | UI coverage round 14 — juggle board-ui + controller residuals |
| Base / head | `cursor/mp-tip-post748` / `cursor/q-mp-269-juggle-ui-cov-r14-5e38` @ `8aad9e6a` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | PR #777 only — ui-coverage-round-14 note + burn-1009 juggle r14 unit test (absent on tip) |
| Tip blob check | **MISSING** on `74a1596f` |
| Fold-readiness | Ready after retarget; tests+docs only. |
| Conflicts / ordering | None with #776/#778 paths. |

### #778 — `q-mp-272` — WAIT_CI

| Field | Value |
| --- | --- |
| Title | mutation audit UI wave 8 — expression/polyomino/graph (tests-only) |
| Base / head | `cursor/mp-tip-post748` / `cursor/q-mp-272-mutation-audit-ui-8-5d95` @ `32fb68e7` |
| Mergeable | MERGEABLE / UNSTABLE · CI **unit FAILURE** (other jobs green / e2e-cross-browser incomplete at snapshot) |
| Files | PR #778 only — mutation-audit-ui-8 docs/json + three mutation-ui8 unit tests (absent on tip) |
| Tip blob check | **MISSING** on `74a1596f` |
| Fold-readiness | Wait for 12/12 green, then retarget; tests-only when green. |
| Conflicts / ordering | After #776/#777 if tip owner batches UI characterization. |

## Per-PR cards — CONTAINED (folded via #755; leave open)

Evidence: tip PR #755 fold table + tip-tree presence of deliverable paths @ `74a1596f`. **Do not close.**

| PR | Task | Classification | Tip evidence (on `74a1596f`) |
| ---: | --- | --- | --- |
| #749 | `q-mp-229` emit-identity script | CONTAINED | `package.json` `check:emit-identity` |
| #750 | `q-mp-227` demos dup-imports → 99 | CONTAINED | dup-imports ceiling path via later re-measure → **78** |
| #751 | `q-mp-218` demos void → 118 | CONTAINED | void ceiling path via later re-measure → **86** |
| #752 | `q-mp-228` dismissOwl knip | CONTAINED | knip `duplicates: 1` |
| #753 | `q-mp-090f` backlog round 6 | CONTAINED | `docs/dev/backlog-2026-10-09f.md` |
| #754 | `q-mp-221` board-ui void (−32) | CONTAINED | void ceiling **86**; board-ui sources on tip |
| #756 | `q-mp-237` bundle headroom | CONTAINED | `docs/dev/bundle-headroom-2026-10-09.md` |
| #757 | `q-mp-239` board-3d layout reads | CONTAINED | `docs/dev/board3d-layout-reads-inventory-2026-10-09.md` |
| #758 | `q-mp-234` triage v2 | **CONTAINED_BY_V3** | `open-draft-triage-post748-2026-10-09-v2.{md,json}` on tip; superseded for navigation by this v3 |
| #759 | `q-mp-240` eslint non-ceiling addendum | CONTAINED | `docs/dev/eslint-non-ceilinged-residuals-2026-10-09.md` |
| #760 | `q-mp-244` core/three dup-imports (−21) | CONTAINED | dup-imports **78** |
| #761 | `q-mp-243` polyomino nnnull (−7) | CONTAINED | `tests/unit/q-mp-243-polyomino-demo-nnnull-guards.test.ts`; nnnull **246** |
| #762 | `q-mp-254` knip unusedTypes (−6) | CONTAINED | knip baseline `unusedTypes: 83` |
| #764 | `q-mp-258` canvas DPR/resize tests | CONTAINED | `tests/unit/canvas-dpr-resize-regression.test.ts` |
| #765 | `q-mp-256` PWA soft-fail tests | CONTAINED | `tests/unit/q-mp-256-pwa-soft-fail.test.ts` |
| #766 | `q-mp-241` Rank-1 dead CSS | CONTAINED | `docs/dev/dead-css-rank1-rescan-2026-10-09.md` |
| #767 | `q-mp-235` testing-layers counts | CONTAINED | `docs/dev/testing-layers-2026-10-09.md` |
| #768 | `q-mp-257` error-boundary soft-fail | CONTAINED | `tests/unit/game-error-boundary-soft-fail.test.ts` |
| #769 | `q-mp-255` tutorial layout reads | CONTAINED | `docs/dev/q-mp-255-tutorial-layout-reads.md` + `src/core/tutorial.ts` |
| #770 | `q-mp-248` UI cov r11 contig | CONTAINED | `tests/unit/burn-1009-ui-cov-r11-contig.test.ts` |
| #771 | `q-mp-250` UI cov r13 kwatro | CONTAINED | `tests/unit/burn-1009-ui-cov-r13-kwatro.test.ts` |
| #772 | `q-mp-249` UI cov r12 fiar | CONTAINED | `tests/unit/burn-1009-ui-cov-r12-fiar.test.ts` |
| #773 | `q-mp-252` engine cov r7 | CONTAINED | `docs/dev/engine-coverage-round-7.md` + test |
| #774 | `q-mp-251` mutation UI wave 7 | CONTAINED | `docs/dev/mutation-audit-ui-7.md` + tests |
| #775 | `q-mp-090g` backlog round 7 | CONTAINED | `docs/dev/backlog-2026-10-09h.md` |

Also still CONTAINED from earlier tip folds (leave open; not re-listed as fold queue): **#731–#747** (via #748) and older pre-post748 stacks when tip already has equivalent blobs.

## Legacy stacks (leave open; not in fold order)

Open drafts still based on `cursor/mp-tip-post728` (22), `post709` (10, includes HOLD #727), `post700`, `post598`, `post477`, etc. remain outside the post755 fold queue. Do **not** close them from this task. Comment `contained` only when tip already has equivalent blobs with a clear keeper SHA; otherwise leave for tip-owner bulk triage.

## Method

1. `git rev-parse HEAD` on `cursor/mp-tip-post755` → tip `74a1596f`.
2. Read tip PR #755 fold table (PRs through #775 except HOLD #727 / skipped #763).
3. `gh pr list --base cursor/mp-tip-post755 --state open` → **0**; `gh pr list --base cursor/mp-tip-post748 --state open` → #754–#778 (24).
4. Explicit `gh pr view 727` (HOLD; base `post709`).
5. Per unfolded PR: files, mergeability, statusCheckRollup, tip path presence / blob identity.
6. Tip re-measure: `npm run lint:ratchet` (ceilings match table); unit file formula → **3156**; `npm run check:dev-docs` → problems **0**.
7. Leave #758 open; worker comments `contained` (this v3 is the post755 keeper).
8. **No PR closes, merges, or ready-for-review flips** performed by this task. No `lint-ratchet-ceilings.json` / knip baseline edits in this PR.

## Explicitly do **not** fold next

- **#727** — HOLD; nullish untouched.
- Any CONTAINED #749–#762 / #764–#775 / #758 drafts — already on tip; leave open.
- **#763** / **#778** — WAIT_CI until 12/12 green.
- Legacy pre-post755 tip stacks without retarget + tip-owner review.
- Hard-rule HOLD AI/copy/rules/scoring work.

Next action: fold into tip by the tip owner

# Open draft triage — tip post748 refresh v2 (2026-10-09)

**Task id:** `q-mp-234`  
**Live tip branch:** `cursor/mp-tip-post748`  
**Tip SHA checked:** `ce673656202db8a9eae4e3c404c55a680bb40cd0` (`ce673656`) — tip cut from alpha after tip PR #748 (`q-mp-026g`) squash-merged  
**Prior triage (stale for this tip):** [`open-draft-triage-post728-2026-10-09.md`](./open-draft-triage-post728-2026-10-09.md) (`q-mp-212` / open draft **#747** — leave open; comment `contained`)  
**Machine-readable twin:** [`open-draft-triage-post748-2026-10-09-v2.json`](./open-draft-triage-post748-2026-10-09-v2.json)  
**Generated (UTC):** 2026-10-09T20:24:35Z  
**Scope:** report only — **do not close PRs**. Workers may comment `contained` / `superseded` only; tip owner folds into `cursor/mp-tip-post748`.  
**Self note:** this triage lands as a new draft into **post748** — listed for completeness.

## Hard rule (this doc)

> **Do not close PRs.** Prefer comments `contained` or `superseded` (with keeper / tip SHA). Closing remains a tip-owner / Andrew bulk-close action, not a worker action.

## Tip context

Tip PR **#748** (`q-mp-026g`) folded the post728 worker queue onto `cursor/mp-tip-post728` and squash-merged to `alpha` @ `ce673656`. The new integration tip is **`cursor/mp-tip-post748`** (same SHA). Remaining open drafts still declare base `cursor/mp-tip-post728` (or older) and need **retarget → `cursor/mp-tip-post748`** before fold unless marked CONTAINED / HOLD.

## Live tip ratchet ceilings (re-measured)

Commands on tip `ce673656`:

```text
$ git rev-parse HEAD
  ce673656202db8a9eae4e3c404c55a680bb40cd0

$ npm run lint:ratchet   # exit 0
  ok   curly: 538 / ceiling 538
  ok   @typescript-eslint/no-non-null-assertion: 254 / ceiling 254
  ok   @typescript-eslint/no-confusing-void-expression: 132 / ceiling 132
  ok   radix: 6 / ceiling 6
  ok   default-case: 5 / ceiling 5
  ok   no-duplicate-imports: 105 / ceiling 105
  ok   @typescript-eslint/prefer-nullish-coalescing: 65 / ceiling 65
  ok   @typescript-eslint/prefer-optional-chain: 21 / ceiling 21
  ok   @typescript-eslint/switch-exhaustiveness-check: 8 / ceiling 8
  ok   @typescript-eslint/no-shadow: 13 / ceiling 13

$ npm run check:dev-docs   # exit 0 — problems: 0
```

| Rule / metric | Live / ceiling |
| --- | ---: |
| `curly` | 538 / 538 |
| `@typescript-eslint/no-non-null-assertion` | 254 / 254 |
| `@typescript-eslint/no-confusing-void-expression` | 132 / 132 |
| `radix` | 6 / 6 |
| `default-case` | 5 / 5 |
| `no-duplicate-imports` | 105 / 105 |
| `@typescript-eslint/prefer-nullish-coalescing` | 65 / 65 |
| `@typescript-eslint/prefer-optional-chain` | 21 / 21 |
| `@typescript-eslint/switch-exhaustiveness-check` | 8 / 8 |
| `@typescript-eslint/no-shadow` | 13 / 13 |
| Knip `unusedTypes` (baseline) | 89 |
| Knip `unusedExports` (baseline) | 3 |
| Knip `duplicates` (baseline) | 2 |
| Unit `*.test.ts`/`*.spec.ts` under `tests/unit` (excl. archive) | **3145** |

## Enumeration

| Bucket | Count | Notes |
| --- | ---: | --- |
| Open drafts **base** `cursor/mp-tip-post748` | **0** | Tip cut is new; no drafts retargeted yet at snapshot time |
| Open drafts still **base** `cursor/mp-tip-post728` | **22** | #731–#747 + #749–#753 (includes folded-but-open queue) |
| Open draft **on hold** (base `post709`) | **1** | #727 (`q-mp-186`) — tip-owner HOLD; **do not touch nullish** |
| **Primary list (this v2)** | **23** | #727 + post728 open set above |
| Legacy open stacks (`post709` / `post700` / `post598` / `post477` / …) | many | Outside fold queue — leave open; do not close |

Source: `gh pr list --base cursor/mp-tip-post748 --state open` (empty); `gh pr list --base cursor/mp-tip-post728 --state open`; explicit `gh pr view 727`. Fold evidence: tip PR #748 body fold table + tip-tree file presence.

## Classification legend

| Status | Meaning |
| --- | --- |
| **CONTAINED** | Payload already on tip `ce673656` via #748 fold; leave PR open; comment `contained` |
| **CONTAINED_BY_V2** | Prior triage #747 superseded for navigation by this v2; tip already has #747 blobs |
| **HOLD** | Tip-owner hold — do not fold / do not edit nullish |
| **FOLD_READY_RETARGET** | Review-clean for fold after base retarget `post728` → `post748` |
| **FOLD_READY_RECONCILE** | Same, plus tip owner must take **min** on shared ceiling / knip baseline keys |

## Conflict / shared-file clusters (unfolded only)

| Cluster | PRs | Files | Fold note |
| --- | --- | --- | --- |
| Lint ceilings JSON | #750, #751 (+ HOLD #727) | `docs/dev/lint-ratchet-ceilings.json` | Keys: dup-imports (#750 **105→99**), void (#751 **132→118**). Tip owner takes **min** per key after re-measure. **Do not fold #727.** |
| Knip baseline | #752 (+ future `q-mp-253`/`254`) | `docs/dev/knip-baseline.json` | #752 lowers `duplicates` **2→1**. Tip owner min-wins vs later knip drafts. |
| Demos sources | #750, #751 | `src/demos/*-demo.ts` | Both touch attribute/expression/fraction/graph/polyomino demos — serialize or combine carefully. |
| AGENTS / wiki tip pointers | #749 | `AGENTS.md`, `docs/wiki/development.md` | #749 wires emit-identity script; tip pointers on live tip still say `post728` — round-6 `q-mp-235` / tip-pointer tasks own the post748 re-anchor. |
| Triage narrative | #747 vs this v2 | `docs/dev/open-draft-triage-*` | Leave #747 open with `contained`; fold this v2 for post748 queue. |

## Suggested fold order (tip owner) — unfolded only

Retarget each keeper to `cursor/mp-tip-post748` before folding. Skip all CONTAINED / HOLD rows.

| Order | PR | Task | Readiness | Why here |
| ---: | ---: | --- | --- | --- |
| 1 | #753 | `q-mp-090f` | FOLD_READY_RETARGET | Docs-only round-6 backlog; unique file |
| 2 | #749 | `q-mp-229` | FOLD_READY_RETARGET | emit-identity npm script + knip unlisted docs; no ceiling JSON |
| 3 | #752 | `q-mp-228` | FOLD_READY_RECONCILE | dismissOwl e2e alias collapse; knip `duplicates` **2→1** |
| 4 | #750 | `q-mp-227` | FOLD_READY_RECONCILE | demos dup-imports **105→99**; reconcile ceilings JSON |
| 5 | #751 | `q-mp-218` | FOLD_READY_RECONCILE | demos void **132→118**; reconcile ceilings JSON; after or carefully with #750 on shared demos |
| — | #727 | `q-mp-186` | **HOLD** | Nullish owl-messages — tip-owner HOLD; do not touch |
| — | #731–#747 | (folded) | **CONTAINED** | Already on tip via #748; leave open |

## Per-PR cards — unfolded keepers + HOLD

### #727 — `q-mp-186` — HOLD

| Field | Value |
| --- | --- |
| Title | clear prefer-nullish-coalescing in owl-messages (−9) |
| Base / head | `cursor/mp-tip-post709` / `cursor/q-mp-186-nullish-owl-messages-0a20` @ `54532ce5` |
| Mergeable (declared base) | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | `src/core/owl/owl-messages.ts`, `docs/dev/lint-ratchet-ceilings.json`, `docs/dev/eslint-off-rules-inventory.md` |
| Ratchet ceilings touched | `prefer-nullish-coalescing` **65 → 56** (−9) |
| Fold-readiness | **HOLD** — tip-owner instruction; skip on post748. Do not retarget / do not fold / do not edit nullish from other agents. |
| Conflicts / ordering | Would share ceilings JSON with #750/#751 if ever unheld — min-wins then. |

### #749 — `q-mp-229` — FOLD_READY_RETARGET

| Field | Value |
| --- | --- |
| Title | wire check:emit-identity npm script + document knip esbuild unlisted |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-229-emit-identity-script-e4b1` @ `4a06c0c4` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | `package.json`, `AGENTS.md`, `.github/copilot-instructions.md`, `docs/dev/ai-typeonly-option.md`, `docs/dev/knip-report.md`, `docs/wiki/development.md` |
| Ratchet ceilings touched | None (knip baseline metrics unchanged on head) |
| Fold-readiness | Ready after retarget to post748; docs/script wiring only. |
| Conflicts / ordering | Touches AGENTS/wiki tip-pointer files — reconcile with any post748 tip-pointer draft at fold. |

### #750 — `q-mp-227` — FOLD_READY_RECONCILE

| Field | Value |
| --- | --- |
| Title | clear no-duplicate-imports in src/demos/\*\* (−6 → ceiling 99) |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-227-demos-dup-imports-9be6` @ `410e83f7` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | 5× `src/demos/*-demo.ts` + `docs/dev/lint-ratchet-ceilings.json` |
| Ratchet ceilings touched | `no-duplicate-imports` **105 → 99** (−6) |
| Fold-readiness | Ready after retarget; tip owner re-measures and takes **min** on dup-imports key. |
| Conflicts / ordering | Ceilings JSON + demos overlap with #751. |

### #751 — `q-mp-218` — FOLD_READY_RECONCILE

| Field | Value |
| --- | --- |
| Title | clear no-confusing-void-expression in src/demos/\*\* (−14 → ceiling 118) |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-218-void-demos-60f0` @ `6a364fae` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | 6× `src/demos/*-demo.ts` + `docs/dev/lint-ratchet-ceilings.json` |
| Ratchet ceilings touched | `no-confusing-void-expression` **132 → 118** (−14) |
| Fold-readiness | Ready after retarget; tip owner re-measures and takes **min** on void key. |
| Conflicts / ordering | Ceilings JSON + demos overlap with #750. |

### #752 — `q-mp-228` — FOLD_READY_RECONCILE

| Field | Value |
| --- | --- |
| Title | collapse knip e2e dismissOwl alias pair (duplicates 2→1) |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-228-dismiss-owl-alias-d8c4` @ `fcb7ed8d` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | `tests/e2e/helpers/page.ts` + e2e consumers + `docs/dev/knip-baseline.json` + `docs/dev/knip-report.md` |
| Ratchet ceilings touched | Knip baseline `duplicates` **2 → 1** (report-only); lint ceilings unchanged |
| Fold-readiness | Ready after retarget; tip owner min-wins knip baseline vs later knip drafts (`q-mp-253`/`254`). |
| Conflicts / ordering | Knip baseline cluster; e2e helper paths unique vs other unfolded drafts. |

### #753 — `q-mp-090f` — FOLD_READY_RETARGET

| Field | Value |
| --- | --- |
| Title | Oct 9f engineering backlog round 6 (25 tasks q-mp-234..258) |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-090f-backlog-round6-09bb` @ `b8c53d86` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | `docs/dev/backlog-2026-10-09f.md` |
| Ratchet ceilings touched | None |
| Fold-readiness | Ready after retarget (docs-only). Task text still says tip post728 — tip owner may note post748 cut in fold commit message; content remains the round-6 queue. |
| Conflicts / ordering | None. |

## Per-PR cards — CONTAINED (folded via #748; leave open)

Evidence: tip PR #748 fold table + tip-tree presence of deliverable paths @ `ce673656`. CI on declared base was 12/12 SUCCESS at fold time. **Do not close.**

| PR | Task | Classification | Tip evidence (on `ce673656`) |
| ---: | --- | --- | --- |
| #731 | `q-mp-204` knip unusedTypes → 89 | CONTAINED | `docs/dev/knip-baseline.json` `unusedTypes: 89` |
| #732 | `q-mp-199` testing-layers counts | CONTAINED | `docs/dev/testing-layers-2026-10-09.md` on tip |
| #733 | `q-mp-180` void controllers → 132 | CONTAINED | void ceiling **132** live |
| #734 | `q-mp-090e` backlog round 5 | CONTAINED | `docs/dev/backlog-2026-10-09e.md` |
| #735 | `q-mp-171` coverage-map wiki | CONTAINED | `docs/dev/coverage-map.{md,svg}` |
| #736 | `q-mp-211` dead CSS move-history | CONTAINED | zoom-reflow + dead-code inventory |
| #737 | `q-mp-210` tip pointers → post728 | CONTAINED | AGENTS/wiki still cite post728 (pre post748 cut) |
| #738 | `q-mp-225` graph nnnull → 254 | CONTAINED | `tests/unit/q-mp-225-graph-algorithms-nnnull-guards.test.ts`; nnnull **254** |
| #739 | `q-mp-213` bundle clearance | CONTAINED | `docs/dev/bundle-over-2026-10-09.md` |
| #740 | `q-mp-230` eslint inventory | CONTAINED | inventory rewritten at fold for 132/254/105 |
| #741 | `q-mp-232` copy-pins residual | CONTAINED | `docs/dev/copy-pins-residual-inventory-2026-10-09.md` |
| #742 | `q-mp-226` board-ui dup-imports → 105 | CONTAINED | dup-imports **105** live |
| #743 | `q-mp-223` engine cov r6 | CONTAINED | `docs/dev/engine-coverage-round-6.md` |
| #744 | `q-mp-222` juggle UI cov r10 | CONTAINED | `tests/unit/burn-1009-ui-cov-r10-juggle.test.ts` |
| #745 | `q-mp-231` mutation UI wave 6 | CONTAINED | `docs/dev/mutation-audit-ui-6.md` + tests |
| #746 | `q-mp-233` wiki CI unit-budget | CONTAINED | `docs/wiki/ci-unit-budget.md` |
| #747 | `q-mp-212` post728 triage | CONTAINED_BY_V2 | `open-draft-triage-post728-2026-10-09.{md,json}` on tip; superseded for navigation by this v2 |

## Legacy stacks (leave open; not in fold order)

Open drafts still based on `cursor/mp-tip-post709`, `post700`, `post598`, `post477`, etc. remain outside the post748 fold queue. Do **not** close them from this task. Comment `contained` only when tip already has equivalent blobs with a clear keeper SHA; otherwise leave for tip-owner bulk triage.

Notable HOLD-adjacent leftovers (not folded here): #727 (above); older nullish/optional-chain/default-case stacks on pre-post748 tips stay untouched.

## Method

1. `git fetch origin cursor/mp-tip-post748` → tip `ce673656`.
2. Read tip PR #748 fold table (PRs #731–#747 except HOLD #727).
3. `gh pr list --base cursor/mp-tip-post748 --state open` → **0**; `gh pr list --base cursor/mp-tip-post728 --state open` → #731–#753 (gap #748 tip PR merged).
4. Explicit `gh pr view 727` (HOLD; base `post709`).
5. Per unfolded PR: files, mergeability, statusCheckRollup (12 SUCCESS), claimed ceilings via `git show origin/<head>:docs/dev/lint-ratchet-ceilings.json` / knip baseline.
6. Tip re-measure: `npm run lint:ratchet` (ceilings match table); unit file formula → **3145**; `npm run check:dev-docs` → problems **0**.
7. Leave #747 open; worker comments `contained` (this v2 is the post748 keeper).
8. **No PR closes, merges, or ready-for-review flips** performed by this task. No `lint-ratchet-ceilings.json` / knip baseline edits in this PR.

## Explicitly do **not** fold next

- **#727** — HOLD; nullish untouched.
- Any CONTAINED #731–#747 drafts — already on tip; leave open.
- Legacy pre-post748 tip stacks without retarget + tip-owner review.
- Hard-rule HOLD AI/copy/rules/scoring work (none among #749–#753).

Next action: fold into tip by the tip owner

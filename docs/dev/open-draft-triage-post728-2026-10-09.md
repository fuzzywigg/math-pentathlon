# Open draft triage — tip post728 snapshot (2026-10-09)

**Task id:** `q-mp-212`  
**Live tip branch:** `cursor/mp-tip-post728`  
**Tip SHA checked:** `b5884207c41d10fa3fa7aa1ee01ec80c9bb61b4d` (`b5884207`) — tip fold `q-mp-026f` / PR #728 onto post709  
**Prior triage (stale for this tip):** [`open-draft-triage-post700-2026-10-09.md`](./open-draft-triage-post700-2026-10-09.md) (`q-mp-209`, tip `post709`)  
**Machine-readable twin:** [`open-draft-triage-post728-2026-10-09.json`](./open-draft-triage-post728-2026-10-09.json)  
**Generated (UTC):** 2026-10-09T19:34:13Z (refresh +#746 at 19:37Z)  
**Scope:** report only — **do not close PRs**. Workers may comment `contained` / `superseded` only; tip owner folds into `cursor/mp-tip-post728`. Context note: tip-owner task `q-mp-026g` is folding this queue now.  
**Self note:** this triage lands as draft **#747** (`q-mp-212`) — listed for completeness; tip owner folds it with the docs batch.

## Hard rule (this doc)

> **Do not close PRs.** Prefer comments `contained` or `superseded` (with keeper / tip SHA). Closing remains a tip-owner / Andrew bulk-close action, not a worker action.

## Live tip ratchet ceilings (re-measured)

Commands on tip `b5884207`:

```text
$ npm run lint:ratchet   # exit 0
$ npm run typecheck:ratchet   # exit 0 — in-scope 0; out-of-scope 216 ≤ baseline 216
$ npm run check:boundaries   # exit 0 — all zeros at ceilings
```

| Rule / metric | Live / ceiling |
| --- | ---: |
| `curly` | 538 / 538 |
| `@typescript-eslint/no-non-null-assertion` | 268 / 268 |
| `@typescript-eslint/no-confusing-void-expression` | 183 / 183 |
| `radix` | 6 / 6 |
| `default-case` | 5 / 5 |
| `no-duplicate-imports` | 122 / 122 |
| `@typescript-eslint/prefer-nullish-coalescing` | 65 / 65 |
| `@typescript-eslint/prefer-optional-chain` | 21 / 21 |
| `@typescript-eslint/switch-exhaustiveness-check` | 8 / 8 |
| `@typescript-eslint/no-shadow` | 13 / 13 |
| Type ratchet out-of-scope | 216 ≤ 216 |
| Boundaries (all keys) | 0 / 0 |
| Knip `unusedTypes` (baseline, report-only) | 91 |
| Knip `unusedExports` (baseline) | 3 |
| Unit `*.test.ts`/`*.spec.ts` under `tests/unit` (excl. archive) | **3140** |

## Enumeration

| Bucket | Count | Notes |
| --- | ---: | --- |
| Open drafts **base** `cursor/mp-tip-post728` | **17** | #731–#747 (includes this triage #747 + #746) |
| Open draft **on hold** (base still `post709`) | **1** | #727 (`q-mp-186`) — ticket HOLD; retarget before fold |
| **Total listed** | **18** | |

Source: `gh pr list --base cursor/mp-tip-post728 --state open` plus explicit `gh pr view 727`. Queue drafts report **12/12 SUCCESS** (or still rolling) and GitHub `MERGEABLE`/`CLEAN` against their **declared** base (not necessarily against live post728 for #727).

## Conflict / shared-file clusters

| Cluster | PRs | Files | Fold note |
| --- | --- | --- | --- |
| Lint ceilings JSON | #727, #733, #738, #742 | `docs/dev/lint-ratchet-ceilings.json` | **Different rule keys** (nullish / void / nnnull / dup-imports). Tip owner takes **min** per key after re-measure. |
| ESLint inventory md | #727, #733, #740 | `docs/dev/eslint-off-rules-inventory.md` | Fold #740 **after** ceiling-changing PRs, or re-refresh inventory post-batch. |
| Wiki development | #732, #735, #737 | `docs/wiki/development.md` | Small textual overlaps (counts vs tip pointer vs coverage links). Prefer order #737 → #732 → #735. |
| Wiki README | #735, #746 | `docs/wiki/README.md` | Coverage-map index vs CI unit-budget pointer — reconcile on fold. |
| Juggle surface (no shared paths) | #733, #742, #744, #745 | controller / board-ui / tests | No path collision; safe in any order relative to each other. |

Prior `q-mp-209` is post700/`post709` only; this `q-mp-212` snapshot is the post728 triage (draft #747).

## Suggested fold order (tip owner)

Prefer docs-only / independent files first, then independent lint keys, then inventory refresh, then test waves. Skip #727 until HOLD lifts and base is retargeted to `cursor/mp-tip-post728`.

| Order | PR | Task | Readiness | Why here |
| ---: | ---: | --- | --- | --- |
| 1 | #734 | `q-mp-090e` | FOLD_READY | Docs-only backlog; unique file |
| 2 | #739 | `q-mp-213` | FOLD_READY | Docs-only bundle clearance; unique file |
| 3 | #741 | `q-mp-232` | FOLD_READY | Docs-only copy-pins residual inventory |
| 4 | #736 | `q-mp-211` | FOLD_READY | Dead CSS delete + inventory sync; no lint ceilings |
| 5 | #737 | `q-mp-210` | FOLD_READY | Tip pointer re-anchor (`AGENTS.md` + wiki) |
| 6 | #732 | `q-mp-199` | FOLD_AFTER_WIKI | Testing-layers counts; shares wiki with #737/#735 |
| 7 | #746 | `q-mp-233` | FOLD_AFTER_WIKI | Wiki CI unit-budget refresh; narrow vs #732; shares wiki README with #735 |
| 8 | #735 | `q-mp-171` | FOLD_AFTER_WIKI | Coverage-map + wiki heat visual |
| 9 | #747 | `q-mp-212` | FOLD_READY | This triage snapshot (docs-only) |
| 10 | #731 | `q-mp-204` | FOLD_READY | Knip unusedTypes demote; unique `knip-baseline.json` |
| 11 | #738 | `q-mp-225` | FOLD_READY_RECONCILE | nnnull **268 → 254**; reconcile ceilings JSON |
| 12 | #742 | `q-mp-226` | FOLD_READY_RECONCILE | `no-duplicate-imports` **122 → 105**; reconcile ceilings JSON |
| 13 | #733 | `q-mp-180` | FOLD_READY_RECONCILE | void **183 → 132**; reconcile ceilings + eslint inventory |
| 14 | #740 | `q-mp-230` | FOLD_AFTER_RATCHETS | Inventory refresh vs tip ceilings — fold last among lint docs |
| 15 | #743 | `q-mp-223` | FOLD_READY | Engine coverage round 6 tests + report |
| 16 | #744 | `q-mp-222` | FOLD_READY | UI coverage round 10 (juggle) tests + report |
| 17 | #745 | `q-mp-231` | FOLD_READY | Mutation audit UI wave 6 tests + reports |
| — | #727 | `q-mp-186` | **HOLD_RETARGET** | Base still `post709`; tip-owner HOLD; retarget + remeasure nullish vs post728 before fold |

## Per-PR cards

### #727 — `q-mp-186` — HOLD_RETARGET

| Field | Value |
| --- | --- |
| Title | clear prefer-nullish-coalescing in owl-messages (−9) |
| Base / head | `cursor/mp-tip-post709` / `cursor/q-mp-186-nullish-owl-messages-0a20` @ `54532ce5` |
| Mergeable (declared base) | MERGEABLE / CLEAN |
| CI | 12/12 SUCCESS |
| Files | `src/core/owl/owl-messages.ts`, `docs/dev/lint-ratchet-ceilings.json`, `docs/dev/eslint-off-rules-inventory.md` |
| Ratchet ceilings touched | `prefer-nullish-coalescing` **65 → 56** (−9) |
| Fold-readiness | **HOLD** — ticket says on hold; base is pre-post728 tip. Compare vs post728 is **diverged** (ahead/behind). Retarget to `cursor/mp-tip-post728`, re-measure nullish live count, then fold with min ceiling. |
| Conflicts / ordering | Shares ceilings JSON + eslint inventory with #733/#738/#742/#740. Fold after post728 ratchets or as its own nullish-only reconcile. |

### #731 — `q-mp-204` — FOLD_READY

| Field | Value |
| --- | --- |
| Title | demote unused PointerTapPhase / PointerTapState / GameMode (knip unusedTypes) |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-204-demote-unused-types-d4ff` @ `e4dc93d0` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | `src/ui/pointer-hygiene.ts`, `docs/dev/knip-baseline.json` |
| Ratchet ceilings touched | Knip baseline `unusedTypes` **91 → 89** (report-only; sole knip-baseline editor in this queue). Title mentions −3 types; baseline delta claimed −2 — tip owner should re-run knip after fold. |
| Fold-readiness | Ready; no lint/type/boundaries ceiling edits. |
| Conflicts / ordering | Independent of lint-ceiling cluster. |

### #732 — `q-mp-199` — FOLD_AFTER_WIKI

| Field | Value |
| --- | --- |
| Title | refresh testing-layers + wiki unit counts for tip post728 |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-199-testing-layers-counts-fc28` @ `32d519b2` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | `docs/dev/testing-layers-2026-10-09.md`, `docs/wiki/development.md` |
| Ratchet ceilings touched | None |
| Remeasure (this snapshot) | Unit test/spec files excl. archive still **3140** on tip `b5884207` (same formula as PR). |
| Fold-readiness | Ready after wiki ordering vs #737/#735. |
| Conflicts / ordering | Shares `docs/wiki/development.md` with #735/#737. |

### #733 — `q-mp-180` — FOLD_READY_RECONCILE

| Field | Value |
| --- | --- |
| Title | clear no-confusing-void-expression in game-controller.ts (−51 → ceiling 132) |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-180-void-game-controllers-577c` @ `3125a0ba` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | 9× `src/games/*/game-controller.ts` (contig-60, fab-a-diffy, juggle, kwatro-sinko, par-55, prime-gold, ramrod, stars-bars, sum-dominoes) + `docs/dev/lint-ratchet-ceilings.json` + `docs/dev/eslint-off-rules-inventory.md` |
| Ratchet ceilings touched | `no-confusing-void-expression` **183 → 132** (−51) |
| Fold-readiness | Ready; reconcile ceilings JSON (void key only) + inventory. |
| Conflicts / ordering | Ceilings/inventory cluster with #727/#738/#742/#740. Source paths unique vs other open drafts. |

### #734 — `q-mp-090e` — FOLD_READY

| Field | Value |
| --- | --- |
| Title | Oct 9e engineering backlog round 5 (≥20 tasks) for tip post728 |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-090e-backlog-round5-0f5a` @ `d9bcbce6` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | `docs/dev/backlog-2026-10-09e.md` |
| Ratchet ceilings touched | None |
| Fold-readiness | Ready (docs-only). |
| Conflicts / ordering | None. |

### #735 — `q-mp-171` — FOLD_AFTER_WIKI

| Field | Value |
| --- | --- |
| Title | refresh coverage-map SVG + wiki coldest-directory heat visual |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-171-coverage-map-wiki-0e57` @ `57d50703` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | `docs/dev/coverage-map.md`, `docs/dev/coverage-map.svg`, `docs/wiki/{README,architecture,coverage-map,development}.md`, `scripts/report-coverage-map.mjs`, `tests/unit/report-coverage-map.test.ts` |
| Ratchet ceilings touched | None |
| Fold-readiness | Ready after wiki reconcile with #732/#737. |
| Conflicts / ordering | Shares wiki `development.md`; also adds generator/test (unique). |

### #736 — `q-mp-211` — FOLD_READY

| Field | Value |
| --- | --- |
| Title | delete dead CSS `.move-history-panel` from zoom-reflow |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-211-dead-css-move-history-panel-06b3` @ `58fa6e95` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | `src/ui/styles/zoom-reflow.css`, `docs/dev/dead-code-inventory.md`, `docs/dev/dead-code-inventory.json` |
| Ratchet ceilings touched | None (type ratchet / boundaries unchanged) |
| Fold-readiness | Ready. |
| Conflicts / ordering | None with other post728 drafts. |

### #737 — `q-mp-210` — FOLD_READY

| Field | Value |
| --- | --- |
| Title | re-anchor AGENTS.md + wiki tip pointers to cursor/mp-tip-post728 |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-210-tip-pointers-d4bf` @ `acffc08f` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | `AGENTS.md`, `docs/wiki/development.md` |
| Ratchet ceilings touched | None |
| Fold-readiness | Ready; high value for agent routing — fold early in docs batch. |
| Conflicts / ordering | Shares wiki with #732/#735. |

### #738 — `q-mp-225` — FOLD_READY_RECONCILE

| Field | Value |
| --- | --- |
| Title | clear graph/algorithms no-non-null-assertion (−14 → ceiling 254) |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-225-graph-nnnull-9bc7` @ `32ab0bd0` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | `src/core/graph/algorithms.ts`, `docs/dev/lint-ratchet-ceilings.json`, `tests/unit/q-mp-225-graph-algorithms-nnnull-guards.test.ts` |
| Ratchet ceilings touched | `no-non-null-assertion` **268 → 254** (−14) |
| Fold-readiness | Ready; sole nnnull editor in this queue. |
| Conflicts / ordering | Ceilings JSON shared; key is independent of void/dup/nullish. |

### #739 — `q-mp-213` — FOLD_READY

| Field | Value |
| --- | --- |
| Title | document post-#728 bundle-budget clearance (all 21 OK) |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-213-bundle-budget-clearance-0527` @ `2d5ec9f6` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | `docs/dev/bundle-over-2026-10-09.md` |
| Ratchet ceilings touched | None (report-only size docs; hard 250 kB budget unchanged) |
| Fold-readiness | Ready. |
| Conflicts / ordering | None. |

### #740 — `q-mp-230` — FOLD_AFTER_RATCHETS

| Field | Value |
| --- | --- |
| Title | refresh eslint-off-rules inventory for tip post728 |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-230-eslint-inventory-refresh-50c7` @ `36336c04` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | `docs/dev/eslint-off-rules-inventory.md` |
| Ratchet ceilings touched | **Docs only** — mirrors live tip ceilings (nullish 65, void 183, nnnull 268, dup-imports 122, …). Does **not** edit `lint-ratchet-ceilings.json`. |
| Fold-readiness | Fold **after** #733/#738/#742 (and #727 if unheld) so inventory matches post-fold ceilings; else tip owner must re-refresh. |
| Conflicts / ordering | Inventory md cluster with #727/#733. |

### #741 — `q-mp-232` — FOLD_READY

| Field | Value |
| --- | --- |
| Title | residual check:copy-pins inventory on tip post728 |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-232-copy-pins-residual-9d98` @ `68541a40` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | `docs/dev/copy-pins-residual-inventory-2026-10-09.md` |
| Ratchet ceilings touched | None |
| Fold-readiness | Ready (docs-only; no new copy pins claimed). |
| Conflicts / ordering | None. |

### #742 — `q-mp-226` — FOLD_READY_RECONCILE

| Field | Value |
| --- | --- |
| Title | clear no-duplicate-imports in \*/board-ui.ts (−17 → ceiling 105) |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-226-board-ui-dup-imports-a2b1` @ `08d504c7` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | 16× `src/games/*/board-ui.ts` + `docs/dev/lint-ratchet-ceilings.json` |
| Ratchet ceilings touched | `no-duplicate-imports` **122 → 105** (−17) |
| Fold-readiness | Ready; sole dup-imports editor in this queue. |
| Conflicts / ordering | Ceilings JSON shared; board-ui paths unique vs open drafts (tests in #744/#745 do not edit board-ui sources). |

### #743 — `q-mp-223` — FOLD_READY

| Field | Value |
| --- | --- |
| Title | engine coverage round 6 — clear residual it.todo |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-223-engine-cov-r6-2758` @ `a152b990` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | `tests/unit/engine-coverage-round-burn-1008.test.ts`, `docs/dev/engine-coverage-round-6.md` |
| Ratchet ceilings touched | None |
| Fold-readiness | Ready (tests + report). |
| Conflicts / ordering | Extends existing engine-coverage test file — no other open draft edits that path. |

### #744 — `q-mp-222` — FOLD_READY

| Field | Value |
| --- | --- |
| Title | UI coverage round 10 — juggle board-ui + controller residuals |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-222-juggle-ui-cov-r10-e0c5` @ `c7d9dfd2` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | `tests/unit/burn-1009-ui-cov-r10-juggle.test.ts`, `docs/dev/ui-coverage-round-10.md` |
| Ratchet ceilings touched | None (void ceiling unchanged) |
| Fold-readiness | Ready (tests-only). |
| Conflicts / ordering | Juggle-related but no path overlap with #733/#742/#745 sources. |

### #745 — `q-mp-231` — FOLD_READY

| Field | Value |
| --- | --- |
| Title | mutation audit UI wave 6 — juggle/fiar/kwatro board-ui (tests-only) |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-231-mutation-audit-ui-6-c09a` @ `83542710` |
| Mergeable | MERGEABLE / CLEAN · CI 12/12 SUCCESS |
| Files | 3× `tests/unit/mutation-ui6-*-board-ui.test.ts` + `docs/dev/mutation-audit-ui-6{,.md,-baseline.json,-after.json}` |
| Ratchet ceilings touched | None |
| Fold-readiness | Ready (tests-only). |
| Conflicts / ordering | No shared paths with #742 board-ui edits. |

### #746 — `q-mp-233` — FOLD_AFTER_WIKI

| Field | Value |
| --- | --- |
| Title | refresh wiki CI unit-budget page for tip post728 |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-233-ci-unit-budget-refresh-4046` @ `636d6b07` |
| Mergeable | UNKNOWN at first poll (draft just opened); CI rolling toward 12 checks |
| Files | `docs/wiki/ci-unit-budget.md`, `docs/dev/ci-unit-budget-q-mp-175.md`, `docs/wiki/README.md`, `docs/screenshots/ci/local-CI1-ai-benches-skip-smoke.txt`, `docs/screenshots/ci/tip-unit-ai-benches-skipped-37972882883.txt` |
| Ratchet ceilings touched | None (docs only; no workflow / AI timing / ratchet edits) |
| Fold-readiness | Ready after wiki README reconcile with #735; intentionally narrow vs #732 (wall budget + AI-bench skip evidence only). |
| Conflicts / ordering | Shares `docs/wiki/README.md` with #735; unit **count** tables remain #732’s lane. |

### #747 — `q-mp-212` — FOLD_READY (this PR)

| Field | Value |
| --- | --- |
| Title | tip post728 open-draft triage snapshot |
| Base / head | `cursor/mp-tip-post728` / `cursor/q-mp-212-open-draft-triage-post728-e403` |
| Files | `docs/dev/open-draft-triage-post728-2026-10-09.md`, `docs/dev/open-draft-triage-post728-2026-10-09.json` |
| Ratchet ceilings touched | None |
| Fold-readiness | Ready (docs-only report). |
| Conflicts / ordering | None with product paths; fold with docs batch. |

## Method

1. `git fetch origin cursor/mp-tip-post728` → tip `b5884207`.
2. `gh pr list --base cursor/mp-tip-post728 --state open` → initially #731–#745; refresh saw #746/#747.
3. Explicit `gh pr view 727` (HOLD; base `post709`).
4. Search for existing `q-mp-212` / post728 triage drafts → none before this PR.
5. Per PR: GH files, mergeability, statusCheckRollup (12 expected), body ceiling claims; verified ceiling **keys** via `git show origin/<head>:docs/dev/lint-ratchet-ceilings.json` vs tip.
6. Tip re-measure: `npm run lint:ratchet`, `typecheck:ratchet`, `check:boundaries`; unit file formula from #732 → **3140**.
7. **No PR closes, merges, or ready-for-review flips** performed by this task.

## Explicitly do **not** fold next

- **#727** until HOLD lifts, base retargeted to `cursor/mp-tip-post728`, and nullish count re-measured.
- Any legacy drafts still based on `post709` / `post700` / `post598` / `post477` / wave5 (outside this enumeration) — comment `contained` only when tip already has the blobs; do not close.
- Hard-rule HOLD AI/copy/rules/scoring drafts (none in the #731–#745 set).

Next action: fold into tip by the tip owner

# burn-1008 compliance review 5 — OWNER OPTION drafts #559 / #560

**Task id:** `burn-1008-mp-compliance-review-5`  
**Reviewer tip base:** `cursor/integration-fold-wave5-tip-4af0`  
**Tip SHA used for mechanical merges / pairwise (primary):** `0dc1e9537f9f2877270a9b0e66510f8d609921c8`  
**Tip tip during authoring (advanced mid-review):** `84f7d0327ec255528733447c23c72b7114a42f89` (`fix(lint): restore curly:all ratchet after fold growth`) — not re-merged for this report  
**Alpha:** `eec2b327c1e65586537cbe03b1c29b93065dee03`  
**Audit source:** #552 `docs/dev/tip-vs-alpha-audit-2026-10-08.{md,json}`  
**Decision sheet:** #549 **D07**  
**This deliverable:** report only — no edits, comments, or pushes to other PR branches.

## Reviewed heads (recorded)

| PR | Branch | Head SHA reviewed | Draft | Base |
| ---: | --- | --- | --- | --- |
| [#559](https://github.com/fuzzywigg/math-pentathlon/pull/559) | `cursor/alpha-delta-isolation-bb75` | `8d930739e2be8bc31d58495f87226e042458a2ef` | yes | tip |
| [#560](https://github.com/fuzzywigg/math-pentathlon/pull/560) | `cursor/ai-typeonly-emit-identical-71ad` | `13812c593f7b28d0814a1c4ac00ff690420e4c71` | yes | tip |

Re-fetched at end of review: both heads **unchanged** (no further pushes observed).

## Overlap check (open drafts)

No open draft already delivers an independent compliance review of #559/#560. Adjacent:

- **#558** — compliance review 3 of tip drafts #544–#552 (does not cover #559/#560)
- **#552** — tip-vs-alpha audit (source for #559 grouping)
- **#549** — merge-window decision sheet (D07 eyeball)
- **#553 / #557** — type-ratchet Batch 5/6 (pairwise with #560; tip already folded #553)

## Summary table

| PR | Title (short) | Verdict |
| ---: | --- | --- |
| [#559](https://github.com/fuzzywigg/math-pentathlon/pull/559) | OPTION: isolate alpha AI/copy deltas (D07) | **COMPLIANT-WITH-NOTES** |
| [#560](https://github.com/fuzzywigg/math-pentathlon/pull/560) | OWNER OPTION: AI type-only emit-identical | **COMPLIANT-WITH-NOTES** |

**Counts:** COMPLIANT **0** · COMPLIANT-WITH-NOTES **2** · VIOLATION **0**

## Hard rules (both PRs)

| Rule | #559 | #560 | Evidence |
| --- | --- | --- | --- |
| Hex Hard assert stays **450ms** | PASS | PASS | #559 `src/games/hex/ai.ts:18` `hard: 450,`; #560 / tip `:21` `hard: 450,` |
| Stars & Bars history **uncapped** | PASS | PASS | #559 loop `board-ui.ts:682` full `moveHistory` (no `slice(-N)`); #560 / tip `:751–752` “do not cap” + full loop |
| No new AI search/scoring/difficulty/timing on fold intent | N/A (OPTION restores alpha AI/copy) | PASS (emit-identical) | See per-PR sections |
| Workflow least-privilege / CI pip / apt | PASS (no workflow edits) | PASS (no workflow edits) | `gh pr diff` file lists |
| Forbidden topics (openclaw / Merom / …) | PASS | PASS | no hits in PR trees |

---

## #559 — OPTION: isolate alpha AI/copy deltas for merge-window D07

**Verdict:** COMPLIANT-WITH-NOTES

**Purpose:** Independent revertible commits restore `origin/alpha` for the **48** #552-flagged `AI_BEHAVIOR_CHANGE` / `PLAYER_FACING_COPY` files so D07 keep/restore is cheap. Not fold-by-default.

### Mechanical checks

#### 1) Grouping vs #552 (nothing missed / extra)

| Check | Result |
| --- | --- |
| All 48 #552 flagged paths appear in isolation sheet + product restores | **PASS** — none missing |
| Extra `src/` vs #552 set | **NOTE** — `src/games/juggle/game-controller.ts` (#552 class `OK`) restored under `status-copy`; `src/core/storage/storage.ts` type-only imports for tip lint |
| Companion test deletions / docs sheet | Expected companions (tip pins for restored AI/copy) |

#### 2) Byte-identical to alpha after restore

Strict `git diff origin/alpha <PR559> -- <48 files>`: **0/48 empty**. Aggregate residual: **48 files, +165 / −87** (matches PR claim).

Residual classes (file:line samples on `8d930739`):

| Residual | Examples |
| --- | --- |
| Hex Hard **450** hold | `src/games/hex/ai.ts:18` `hard: 450,` (alpha had `2500`) |
| `import type` lint splits | e.g. tutorials `import type { TutorialConfig }` |
| `destroyGame()` tip-compat stubs | e.g. `calla/game-controller.ts` stub after alpha restore |
| Star Track tip mode types | `star-track/board-ui.ts` `StarTrackGameMode` / `gameMode?` |
| Lint form only | `Boolean(x)` vs `!!x`, `{return;}` vs `return;` |

Content-body compare (imports + destroyGame stubs + Hex-450 hold stripped): **34/48** exact; remaining **14** are lint-form / blank-line only (`{return;}`, `!!(x)`). Tutorial HTML text extracts equal alpha for sampled games (calla, contig-60, hex, juggle, kwatro-sinko, stars-bars).

**Strict acceptance “diff empty”:** FAIL. **Documented tip-compat exceptions:** PASS as stated in PR / sheet.

#### 3) Each restore commit reverts cleanly alone

Scratch: `git checkout -B scratch <PR559>` then `git revert --no-edit <restore-sha>`.

| Group | Restore SHA | Alone | Notes |
| --- | --- | --- | --- |
| ai-hex | `0aec5dfc` | **OK** | |
| ai-queens | `b94d6068` | **OK** | |
| ai-kings | `a1b2495e` | **OK** | lint/tsc green after revert (`eef51679`) |
| ai-kwatro | `75518dac` | **FAIL** | conflict in `src/games/kwatro-sinko/ai.ts` — only `import type { … BoardNode}` vs `BoardNode }` whitespace from later tip-compat on same file; still fails after reverting companion `e5c7de39` first |
| ai-contig | `63baef8d` | **OK** | Full `test:unit` after revert: **0** (3042 files / 11221 passed) |
| ai-think-delays | `7dbf46fe` | **OK** | |
| tutorial-div1 | `6b36f336` | **FAIL** alone | modify/delete on handshake tests deleted by companion `fc9a1076`; **OK** if companion reverted first then restore |
| tutorial-div2 | `3af2a597` | **OK** | |
| tutorial-div3 | `e7ea8186` | **OK** | |
| tutorial-div4 | `3c06c8ad` | **OK** | |
| status-copy | `b464f8df` | **OK** | |

Sample post-revert suite: after clean `git revert 63baef8d` on PR559 HEAD, `npm run test:unit` → exit **0**. After clean `git revert a1b2495e` (ai-kings), `npm run lint` + `npx tsc --noEmit` → exit **0** / **0**.

#### 4) Scope outside AI/copy

Product extras: `storage.ts` (lint unblock), `juggle/game-controller.ts` (not in #552 flagged 48). Large tip-only test deletions are companions to restores (expected for suite green), not silent product scoring changes.

#### 5) Tip merge (current tip `0dc1e953`)

`git merge --no-ff origin/cursor/alpha-delta-isolation-bb75` → **MERGE_EXIT=1**. PR559 base tip was `c9c54a94` (**76** tip commits behind `0dc1e953`). Conflicts include storage, several board-ui/controllers, and modify/delete on tip-advanced timer-race tests. **Suite on tip+#559: not run** (unresolved conflicts). Tip owner must rebase/recut before fold.

### Suite on PR559 HEAD `8d930739` (branch alone)

| Command | Exit |
| --- | --- |
| `npm run lint` | **0** |
| `npx tsc --noEmit` | **0** |
| `npm run test:unit` | **0** — 3042 files passed (fewer than tip: tip pins deleted) |
| `npm run build` | **0** (after env `npm install --no-save rollup-plugin-visualizer`) |

Logs: `/opt/cursor/artifacts/pr559-suite.log`, revert notes `/opt/cursor/artifacts/pr559-revert-tests.log`, post-revert unit `/opt/cursor/artifacts/pr559-revert-contig-unit.log`, tip merge `/opt/cursor/artifacts/tip-plus-559-merge.log`.

### Pairwise conflicts

| Other PR | Overlap | Conflict nature |
| --- | --- | --- |
| #553 | 6 files (`storage.ts`, hex/juggle/kings/pent/stars-bars `board-ui.ts`) | Tip already folded #553; #559 restore rewinds board-ui toward alpha → content conflict on tip merge (seen) |
| #557 | 0 files | none |
| #560 | 5 `ai.ts` (contig, hex, kings, kwatro, queens) | Mutually exclusive product intent on those files if both folded without sequencing |

### Fold-order fit

- **OWNER OPTION** for D07 — not fold-by-default.
- **#541 dead-code LAST** already on tip (`cc4120d2`).
- Rebase onto current tip **before** any fold; resolve #553-touched board-ui / storage first.
- If #560 is also chosen: fold **#557 → #560** first (type-only on tip AI), then treat #559 restores as a separate D07 decision (or rebase #559 restores onto post-#560 AI).

---

## #560 — OWNER OPTION: AI type-only emit-identical ratchet

**Verdict:** COMPLIANT-WITH-NOTES

**Purpose:** Clear Phase-2 AI-module type-ratchet (220 → 0) with erased-only constructs; prove emit-identical JS via `scripts/check-emit-identity.mjs`. Fold only with Andrew approval, after #557 and after D07.

**Claimed emit base:** `c383a5de747a88c081b2622d051f203301343340` (#557 Batch 6 on this branch).

### Emit-identity (independent)

Touched AI set: **27** edited + **1** unchanged transitive `queens-guards/ai.worker.ts` = **28** files.

| Method | Result | Exit |
| --- | --- | --- |
| Official `node scripts/check-emit-identity.mjs --base c383a5de… --head 13812c59 --files-from <28>` | All 28 OK | **0** |
| Independent esbuild (different settings: `format:cjs`, `target:es2019`, `keepNames:true`) | All 28 IDENTICAL | **0** |
| Independent `typescript.transpileModule` (ES2020, `useDefineForClassFields`) | Differs only where `removeComments:false` keeps new `// ratchet:` comments; with `removeComments:true` identical | **0** (after strip) |

Logs: `/opt/cursor/artifacts/pr560-emit-identity.log`, `pr560-esbuild-alt.log`, `pr560-tsc-emit-compare.log`.

### Checker review + negative demonstration

`scripts/check-emit-identity.mjs` on `13812c59`:

| Behavior | Assessment |
| --- | --- |
| Compiles both refs | **Yes** — `git show` each side → `esbuild.transform` |
| Compares provided / discovered `ai*` files | **Yes** — fails if any `status !== 'identical'` (`process.exit(ok ? 0 : 1)`) |
| Unit suite includes runtime-diff detection | **Yes** — `tests/unit/check-emit-identity.test.ts` `??` case expects `differ` |
| **Blind spot:** `--files-from` empty falls back to `defaultAiTouchedFiles` (still exits 0 with 27 files) | Empty list ≠ hard fail |
| **Blind spot:** default discovery regex misses unchanged `queens-guards/ai.worker.ts` | Transitive worker not auto-listed when unmodified (explicit `--files-from` needed for 28) |
| **Blind spot:** esbuild `legalComments:'none'` — comment-only TS edits do not affect emit (by design); `tsc` without `removeComments` would show comment deltas | Documented; alt esbuild still identical |
| No AI files between refs → exits 0 with message | Soft pass |

**Negative demonstration (this review):** mutate `src/games/hex/ai.ts` `hard: 450` → `451` vs base `c383a5de`:

- PR head vs base: `identical`
- Mutated vs base: `differ` (emit shows `hard: 451`)

Log: `/opt/cursor/artifacts/pr560-negative-test.log`.

### Hard-rule / AI behavior scan

AI diffs are `!` / `as` / `deadlineMs?: number | undefined` / ratchet comments only — no deadline/depth/score/budget numeric changes. Hex Hard remains `hard: 450` at `src/games/hex/ai.ts:21`. Stars & Bars history uncapped at `board-ui.ts:751–752`.

### Tip merge (`0dc1e953` + #560)

Automatic merge **conflicts** in:

- `docs/dev/type-ratchet-batch5.md` (add/add; tip already has #553 fold)
- `docs/dev/type-ratchet-phase2-baseline.json`

Scratch resolve for verify: keep tip batch5.md; take PR560 baseline (`outOfScopeErrors: 0`) and set `tipSha` → `0dc1e953…` → commit `84f5864d`.

### Suites

**PR560 HEAD `13812c59`:**

| Command | Exit |
| --- | --- |
| `npm run lint` | **0** |
| `npx tsc --noEmit` | **0** |
| `npm run test:unit` | **0** — 3105 files / 11727 passed, 13 skipped |
| `npm run build` | **0** after `rollup-plugin-visualizer` install (env gap; same as PR body) |
| `npm run typecheck:ratchet` | **0** — in-scope 0; out-of-scope 0 ≤ baseline 0 |
| `npm run lint:ratchet` | **1** — `curly: 1497 / ceiling 1437` (**NOTE**) |

**tip+#560 resolved `84f5864d`:** lint 0, tsc 0, unit 0 (3105/11727), build 0 (after visualizer). `lint:ratchet` on that merge matched tip-at-`0dc1e953` failure (`1484/1437`); tip later fixed ceilings at `84f7d032` (1344/1344) — **#560 branch itself was not rebased onto that fix** at review time.

CI on #560 (observed): `lint` failed (curly ratchet), `unit`/`build` passed, `e2e` failed (unrelated to this report’s hard rules).

Logs: `/opt/cursor/artifacts/pr560-suite.log`, `tip-plus-560-suite.log`, `pr560-lint-ratchet.log`.

### Pairwise conflicts

| Other PR | Overlap | Conflict nature |
| --- | --- | --- |
| #553 | 5 docs/scripts (batch5, baseline, export, plan, check-type-ratchet) | Tip already folded #553 product; docs/baseline conflict on merge (seen) |
| #557 | **16** files including all Batch-6 `rules.ts` / kings engine paths + ratchet docs | #560 **cherry-picks #557** as prerequisite — expected overlap; fold #557 (or equivalent) before #560 |
| #559 | 5 `ai.ts` | Type-only (#560) vs alpha restore (#559) — do not stack blindly |

### Fold-order fit

- **OWNER OPTION** — after **#557** and after **D07** decision.
- **#541** already folded LAST on tip.
- Rebase onto tip (resolve baseline/batch5 with post-#553 tip) and re-measure `lint:ratchet` against tip’s new curly ceiling before fold.
- Do not fold in parallel with #559 restores on the same `ai.ts` files without an explicit D07 ordering.

---

## Verification command summary (this review)

### Tip + PR merges

| Scratch | Merge | lint | tsc | test:unit | build |
| --- | --- | ---: | ---: | ---: | ---: |
| tip `0dc1e953` + #559 | **FAIL** (conflicts) | — | — | — | — |
| tip `0dc1e953` + #560 (docs conflicts resolved) `84f5864d` | OK | 0 | 0 | 0 | 0* |

\*build required one-time `npm install --no-save rollup-plugin-visualizer` in this environment.

### Branch-alone suites

| Branch HEAD | lint | tsc | test:unit | build |
| --- | ---: | ---: | ---: | ---: |
| #559 `8d930739` | 0 | 0 | 0 | 0* |
| #560 `13812c59` | 0 | 0 | 0 | 0* |

### #559 post-revert sample

| Command | Exit |
| --- | ---: |
| `git revert 63baef8d` then `npm run test:unit` | 0 |
| `git revert a1b2495e` then `npm run lint` / `npx tsc --noEmit` | 0 / 0 |

### #560 emit-identity

| Command | Exit |
| --- | ---: |
| Official checker 28 files vs `c383a5de` | 0 |
| Alt esbuild 28 files | 0 |
| Negative hard 450→451 | differ (exit 0 for demo harness) |

---

## Next action

**Next action: fold into tip by the tip owner**

Both remain **owner options**. Suggested sequencing:

1. Rebase/recut **#559** onto current tip if D07 restore groups are desired (required — tip merge currently conflicts).
2. Land **#557** (if not already equivalent on tip) then rebase **#560**; re-check `lint:ratchet` vs tip ceiling.
3. Do not treat either as fold-by-default; **#541** dead-code LAST is already done on tip.

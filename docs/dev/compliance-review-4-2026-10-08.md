# burn-1008 compliance review 4 (independent hard-rule pass)

**Task id:** `burn-1008-mp-compliance-review-4`  
**Reviewer tip base:** `cursor/integration-fold-wave5-tip-4af0` @ `e90a7b8612076775c93180a4e3f78162fd18dd12`  
**Prior passes:** [#538](https://github.com/fuzzywigg/math-pentathlon/pull/538) → `docs/dev/burn-1008-compliance-review.md`; [#543](https://github.com/fuzzywigg/math-pentathlon/pull/543) → `docs/dev/burn-1008-compliance-review-2.md`; [#558](https://github.com/fuzzywigg/math-pentathlon/pull/558) → `docs/dev/compliance-review-3-2026-10-08.md` (#544–#552).  
**Scope (live at review start):** tip drafts **#553–#557** (not covered by #558). Also re-check tip fold of **#548** (AI move-time Hard-flag assert report-only in full suite) vs Hex Hard **450ms**.  
**Method:** `gh pr diff` hunk-by-hunk; hard-rule greps; string-literal scan on `src/`; **esbuild emit-diff** of touched modules (comments stripped) for type-ratchet PRs; pairwise `git merge` conflict probes; **re-run** each PR’s stated gates on scratch tip+PR merges.  
**This deliverable:** report only — this file. No edits/comments/pushes to other PR branches.

## Hard rules checked

| Rule | Signal |
| --- | --- |
| AI search / scoring / difficulty / think-time | `ai.ts`, deadlines, evaluate/search |
| Legal-move / outcome / scoring | `rules.ts` apply/validate/score; scoring helpers |
| Player-facing copy / tutorial / rules-text | string-literal diffs in UI; tutorials; How-to |
| Stars & Bars history cap | `moveHistory` trim / `slice(-15)` |
| Hex Hard 450ms assert | `AI_PLAY_DEADLINE_MS.hard` / `toBe(450)` |
| Workflow least-privilege | `contents: read`, `persist-credentials: false` |
| CI install surface | no `apt`; pip allowlist not widened |
| Forbidden topics | openclaw / Merom / Sullivan / meromhouse / pappas-infrastructure |
| Type-ratchet semantics | emit-identical JS preferred; any non-identical emit explained for outcomes / save / hash / AI inputs |

**Global tip spot-check @ `e90a7b86`:**

| Check | Evidence |
| --- | --- |
| Hex Hard 450ms | `src/games/hex/ai.ts:21` `hard: 450`; `tests/unit/hex-deep-playability.test.ts:58` `toBe(450)` |
| #548 Hard-flag report-only (full suite) | `tests/unit/ai-move-time-midgame.bench.test.ts:10–14,133–134,624–629` — `strictHardFlags` only when invoked directly or `AI_BENCH_STRICT=1`; else `console.warn` report-only. **Does not change** Hex `AI_PLAY_DEADLINE_MS.hard` |
| Stars & Bars uncapped | `src/games/stars-bars/board-ui.ts:751–752` “do not cap” full-history loop |
| CI / forbidden | No workflow edits in #553–#557; no openclaw / Merom / apt / pip-allowlist hits in any of the five diffs |

---

## Summary table

| PR | Title (short) | Head (reviewed) | Verdict | Fold position |
| ---: | --- | --- | --- | --- |
| [#553](https://github.com/fuzzywigg/math-pentathlon/pull/553) | Type-ratchet Batch 5 UI/shell re-cut | `24242ca6` | **COMPLIANT-WITH-NOTES** | Prefer **close / skip product fold** — tip already has #544+#551 UI clearance (ceiling **286**); #553 baseline **373** would regress ceiling; hard conflicts on every product file |
| [#554](https://github.com/fuzzywigg/math-pentathlon/pull/554) | Licenses owner notes | `d97966f9` | **COMPLIANT** | **Already on tip** (identical `docs/dev/LICENSES.md` via tip `0e07c39c`); close as duplicate |
| [#555](https://github.com/fuzzywigg/math-pentathlon/pull/555) | Storage `import type` lint | `e555bbf1` | **COMPLIANT** | **Already on tip** (identical `storage.ts` via tip `b63afd24`); close as duplicate |
| [#556](https://github.com/fuzzywigg/math-pentathlon/pull/556) | Flake-rate after-fix doc | `5d6a68ba` | **COMPLIANT-WITH-NOTES** | Docs anytime; resolve conflict by **keeping tip §3 ui-helper table** + PR “After” results |
| [#557](https://github.com/fuzzywigg/math-pentathlon/pull/557) | Type-ratchet Batch 6 rules/engine | `62a9173b` | **COMPLIANT** | Fold next among remaining product drafts; ceiling **286 → 220**; clean tip merge |

**Counts:** COMPLIANT **3** · COMPLIANT-WITH-NOTES **2** · VIOLATION **0**  
**Dead-code #541:** already folded **LAST** among tip removals (`cc4120d2`). Remains the standing rule for any future dead-code PRs.

---

## Emit-diff method (type-ratchet #553 / #557)

**Commands** (esbuild 0.28.1 from repo `node_modules`; comments stripped):

```bash
# /tmp/cr4/emit-one.mjs — esbuild.transform(loader:'ts', format:'esm', target:'es2022', legalComments:'none')
# then drop // lines and blank lines; write .js
node /tmp/cr4/emit-one.mjs <before>/<module>.ts /tmp/.../before/<module>.ts.js
node /tmp/cr4/emit-one.mjs <after>/<module>.ts  /tmp/.../after/<module>.ts.js
cmp -s before.js after.js && echo IDENTICAL || diff -u before.js after.js
```

**Comparisons recorded:**

| Label | Before | After |
| --- | --- | --- |
| `553-base-to-head` | tip @ PR base `e6b3bcba` | #553 head `24242ca6` |
| `553-tip-to-head` | tip @ `e90a7b86` | #553 head |
| `557-base-to-head` | tip @ PR base `7890fac2` | #557 head `62a9173b` |
| `557-tip-to-head` | tip @ `e90a7b86` | #557 head |

Artifacts: `/opt/cursor/artifacts/emit-diff-cr4/`.

### #553 emit summary (`553-base-to-head`)

| Module | Emit |
| --- | --- |
| `src/core/storage/storage.ts` | **IDENTICAL** |
| `src/games/contig-60/types.ts` | **IDENTICAL** |
| `src/games/pent-em-in/types.ts` | **IDENTICAL** |
| `src/games/prime-gold/board-ui.ts` | **IDENTICAL** |
| `src/games/prime-gold/types.ts` | **IDENTICAL** |
| `src/games/contig-60/board-ui.ts` | **DIFFERS** |
| `src/games/hex/board-ui.ts` | **DIFFERS** |
| `src/games/juggle/board-ui.ts` | **DIFFERS** |
| `src/games/kings-quadraphages/board-renderer.ts` | **DIFFERS** |
| `src/games/kings-quadraphages/board-ui.ts` | **DIFFERS** |
| `src/games/kwatro-sinko/board-ui.ts` | **DIFFERS** |
| `src/games/pent-em-in/board-ui.ts` | **DIFFERS** |
| `src/games/stars-bars/board-ui.ts` | **DIFFERS** |

(`553-tip-to-head` matches the above except `storage.ts` emit differs only by import formatting — tip already has the lint split.)

### #557 emit summary (`557-base-to-head` ≡ `557-tip-to-head`)

| Module | Emit |
| --- | --- |
| `src/games/contig-60/rules.ts` | **IDENTICAL** |
| `src/games/hex/rules.ts` | **IDENTICAL** |
| `src/games/juggle/rules.ts` | **IDENTICAL** |
| `src/games/kings-quadraphages/board.ts` | **IDENTICAL** |
| `src/games/kings-quadraphages/game-state.ts` | **IDENTICAL** |
| `src/games/kings-quadraphages/rules.ts` | **IDENTICAL** |
| `src/games/kwatro-sinko/rules.ts` | **IDENTICAL** |
| `src/games/prime-gold/rules.ts` | **IDENTICAL** |
| `src/games/pent-em-in/rules.ts` | **DIFFERS** (BoardCell rebuild) |
| `src/games/stars-bars/rules.ts` | **DIFFERS** (shuffle swap locals) |

---

## Verification reproduced (scratch tip @ `e90a7b86` + PR head)

Environment: tip build initially failed (`BUILD=1`) missing `rollup-plugin-visualizer` (listed in `package.json`); one-time `npm install rollup-plugin-visualizer --no-save` → `BUILD=0`. Same env used for all merges.

| Tree | MERGE | LINT | TSC | RATCHET | UNIT | BUILD | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| tip @ `e90a7b86` | — | **0** | **0** | **0** (286≤286) | **0** (3104 files / 11722 tests) | **0*** | *first build 1 → 0 after visualizer install |
| tip+#553 | **1** → resolved (theirs) | **0** | **0** | **0** (**286 ≤ 373**) | **0** (3104 / 11722) | **0** | 15 conflict files; actual OOS still **286** — baseline **raises** tip ceiling |
| tip+#554 | **0** | **0** | **0** | na | na | **0** | empty tree vs tip (already landed) |
| tip+#555 | **0** | **0** | **0** | na | na | **0** | empty tree vs tip (already landed) |
| tip+#556 | **1** → resolved (theirs) | **0** | **0** | na | na | **0** | conflict: `docs/flake-rate-wave5-2026-10-08.md` |
| tip+#557 | **0** | **0** | **0** | **0** (**220 ≤ 220**) | **0** (3104 / 11722) | **0** | clean merge |

Logs: `/opt/cursor/artifacts/verify-cr4/verify-{tip,553–557}.log` + `.summary`.

---

## Pairwise conflicts (#553 / #556 / #557 / tip)

| Stack | Result | Conflict files |
| --- | --- | --- |
| tip+#554 / tip+#555 | **clean** (empty) | — |
| tip+#557 | **clean** | — |
| tip+#556 | conflict → resolvable | `docs/flake-rate-wave5-2026-10-08.md` |
| tip+#553 | **hard conflict** | ratchet bookkeeping + all Batch-5 UI product files + `storage.ts` + burn-1007 test |
| tip+#557+#556 | conflict → resolvable | flake-rate doc only |
| tip+#553+#556 | conflict → resolvable | flake-rate doc only |
| tip+#557+#553 | **hard conflict** | same set as tip+#553 (UI product + ratchet baseline 220 vs 373) |
| tip+#557+#554 | **clean** | — |

**Product overlap #553 vs tip:** tip already carries #544 soft-guards + #551 prime-gold UI. #553 rewrites the same UI surface to throw-guards / dense `!` and ships a stale ceiling **373**.

---

## Per-PR findings

### #553 — fix(types): Phase-2 type-ratchet Batch 5 UI/shell compliant re-cut

**Verdict:** COMPLIANT-WITH-NOTES

**Files:** seven games’ `board-ui` (+ kings `board-renderer`, contig/pent/prime-gold `types`); `storage.ts` lint; ratchet scripts/docs; burn-1007 beforeEach. **No** `ai.ts` / `rules.ts` / workflows / copy.

**Hex Hard / Stars & Bars:** head keeps Hex `hard: 450`. Stars & Bars history loop still “do not cap” (`board-ui.ts:749–751` on head). No timing-constant edits.

**Stale vs tip (primary note):** Tip @ `e90a7b86` already folded #544+#546+#551 → ceiling **286**. #553 was authored for ceiling **450 → 373** and still conflicts on every overlapping UI file. Scratch tip+#553 (taking PR): actual OOS **286**, baseline **373** — **ratchet ceiling regression** if baseline folded as-is. Product fold does **not** clear additional OOS errors vs tip.

**Non-identical emit modules (base→head) — runtime analysis:**

| File (emit delta) | What changed at runtime | Outcomes / save / hash / AI? |
| --- | --- | --- |
| `contig-60/board-ui.ts` | Removes tip/#544 `continue` when `BOARD_NUMBERS` row/value undefined; uses direct index | Dense `BOARD_NUMBERS`: **equivalent**. Sparse hole: tip skips cell; #553 throws — UI render only |
| `hex/board-ui.ts` | Soft `return` / `?? null` → `throw` on missing row/cell; drops `lastMove !== undefined` guard (`!`) | Dense hex board: **equivalent**. If `cell` were `undefined`: tip paints empty (`?? null`); #553 throws. Aria owner EOPT spread unchanged vs tip |
| `juggle/board-ui.ts` | Removes `continue` on undefined row/die; direct `board.cells[row][col]` / `dice[i]` | Dense board + 2 dice: **equivalent**. Hole: tip skips; #553 may throw/undefined face |
| `kings-quadraphages/board-renderer.ts` | Removes `continue` on undefined row/cell in render loops | Dense `BOARD_SIZE`: **equivalent** |
| `kings-quadraphages/board-ui.ts` | Soft `return { state, isInvalidClick: false }` / `?? null` → `throw` on missing row/cell; last-move `!` | Legal board clicks: **equivalent**. OOB row: tip no-ops click; #553 throws — UI path, not rules/AI |
| `kwatro-sinko/board-ui.ts` | `match?.[n] ?? '0'` → `match ? match[n]! : '0'` | Emit differs; for `/^n(\d+)-(\d+)$/` when match truthy groups present: **same strings** |
| `pent-em-in/board-ui.ts` | Removes `continue` if split coords undefined | Well-formed preview keys: **equivalent** |
| `stars-bars/board-ui.ts` | Removes row/cell `continue`; preview `?.[col]`/`?.card` → direct access | Dense board: **equivalent**. OOB preview: tip returned `0`; #553 throws — preview UI only. History uncapped |

**Identical-emit modules:** `storage.ts` (base→head), contig/pent/prime-gold `types`, prime-gold `board-ui` — type-only / already tip-equivalent.

**Player-facing strings:** no tutorial/rules-text edits; aria `Blue`/`Red` relocated only (same values).

**Notes for tip owner:** Treat product hunks as **superseded** by tip’s #544+#551 fold. Keep tip soft-guards or optionally adopt throw-guards in a **fresh tip-based** PR with re-export baseline ≤286. Do **not** land #553’s baseline JSON as-is. `docs/dev/type-ratchet-batch5.md` trail is still useful if #557’s copy of it is kept.

---

### #554 — docs(licenses): record #532 owner acceptances on final tip

**Verdict:** COMPLIANT

**Files:** `docs/dev/LICENSES.md` only (+31 lines).

**Evidence:** Tip commit `0e07c39c` already contains **byte-identical** content. Scratch tip+#554 merge is empty-tree. No `src/`, AI, copy, timing, workflows.

**Fold:** Close as already folded / duplicate.

---

### #555 — fix(lint): use import type for storage ProgressData types

**Verdict:** COMPLIANT

**Files:** `src/core/storage/storage.ts` only (`import type` for type-only symbols; value imports kept for `createDefaultProgress` / `createDefaultGameStats`).

**Evidence:** Tip commit `b63afd24` is **byte-identical**. Emit tip→#553 storage differs only in import formatting (tip already correct). No runtime behavior change (types erased). Scratch tip+#555 empty-tree.

**Fold:** Close as already folded / duplicate.

---

### #556 — docs(test): flake-rate after-fix verification table

**Verdict:** COMPLIANT-WITH-NOTES

**Files:** `docs/flake-rate-wave5-2026-10-08.md` only.

**Evidence:** Docs-only “After” table (unit 10/10, shuffle seeds, e2e 3/3, lint/tsc/build). Explicitly states Hard-flag change is **not** an AI deadline / Hex 450ms change. No `src/`, workflows, AI, copy.

**Conflict note:** Tip advanced §3 “UI-helper generation-gate timeouts” (`edcff8bf` track) after #556’s base. Naïve “theirs” resolve **drops tip §3**. Tip owner must **union**: keep tip §3 + append PR “After (fixes landed)” block.

**Fold:** Docs; resolve as above.

---

### #557 — fix(types): Phase-2 type-ratchet Batch 6 non-AI rules/engine

**Verdict:** COMPLIANT

**Files:** `rules.ts` for stars-bars, hex, prime-gold, kwatro-sinko, pent-em-in, contig-60, juggle, kings-quadraphages; kings `game-state.ts` / `board.ts`; ratchet bookkeeping; batch5/batch6 docs. **No** `ai.ts`. **No** help/tutorial/copy. **No** workflows.

**Hex Hard / Stars & Bars:** Hex `ai.ts` untouched — tip `hard: 450` remains. Stars & Bars `rules.ts` has no history-cap; UI “do not cap” loop untouched.

**Emit-identical modules (8/10) — provably runtime-neutral:**  
`contig-60/rules.ts`, `hex/rules.ts`, `juggle/rules.ts`, `kings-quadraphages/{board,game-state,rules}.ts`, `kwatro-sinko/rules.ts`, `prime-gold/rules.ts`.  
These are pure `!` after dense-board / literal-tuple / regex / length gates (kings “BoardCell”/cell indexing is in this set — emit **IDENTICAL**; the named EOPT rebuild is in pent-em-in below).

**Non-identical emit modules:**

#### 1) `pent-em-in/rules.ts` — EOPT-safe `BoardCell` rebuild (`:196–208` head)

**Before (emit):** `{ ...newBoard[row][col], occupied: true, owner, pieceId }`  
**After (emit):** `{ row: prev.row, col: prev.col, occupied: true, owner, pieceId }` with `prev = newBoard[row][col]`.

**`BoardCell` fields** (`types.ts:20–26`): exactly `row`, `col`, `occupied`, `owner`, `pieceId`. Rebuild assigns every field; placement overwrites `occupied`/`owner`/`pieceId` identically; `row`/`col` copied from `prev`.

| Concern | Effect |
| --- | --- |
| Game outcomes / legal moves | **None** — same cell values after place |
| Save / serialization shape | **None** — same keys/values |
| Hashes / equality | **None** |
| AI inputs | **None** — board cell shape unchanged |

#### 2) `stars-bars/rules.ts` — shuffle swap via temps (`:54–61` head)

**Before:** `[result[i], result[j]] = [result[j], result[i]]`  
**After:** `a = result[i]!; b = result[j]!; result[i] = b; result[j] = a`

Same pairwise swap; same `Math.random()` call pattern. **No** change to RNG stream, deck distribution, scoring, or history. Emit differs only in swap lowering.

**Player-facing strings:** none in `src/` diffs (comments/`!` only).

**Verification:** tip+#557 clean merge — LINT/TSC/RATCHET/UNIT/BUILD all **0**; ratchet **220 ≤ 220**.

---

## #548 tip fold re-check (Hex Hard 450ms)

Tip merge `25162466` (“merge(#548)”) made AI move-time **Hard-flag assert** report-only under parallel full suite (`strictHardFlags` / `AI_BENCH_STRICT`). Confirmed:

1. **Hex play deadline unchanged:** `src/games/hex/ai.ts:21` still `hard: 450`.
2. **Unit assert unchanged:** `tests/unit/hex-deep-playability.test.ts:58` still `expect(...hard).toBe(450)`.
3. Bench still flags at `HARD_FLAG_MS = 500` (wall p95); only the **suite fail** path is softened — not the engine deadline.

None of #553–#557 edit these constants.

---

## Recommended fold order (remaining tip drafts)

1. **Close #554 / #555** as already on tip (identical content).  
2. **#556** docs — union tip §3 + After table.  
3. **Skip / close #553 product** (superseded; baseline would regress). Optionally keep batch5.md via #557.  
4. **#557** Batch 6 — fold; ceiling **286 → 220**.  
5. **#541** already **LAST** on tip — standing rule for any future dead-code PRs.

---

## Acceptance checklist

- [x] Every listed PR (#553–#557) has a verdict with file:line evidence  
- [x] Emit-diff commands + per-module IDENTICAL/DIFFERS recorded for #553 and #557  
- [x] Every non-identical emitted module explained (outcomes / save / hash / AI)  
- [x] Hex Hard 450ms confirmed unchanged; #548 report-only bench path confirmed  
- [x] Stars & Bars history uncapped on tip and PR heads  
- [x] Verification exit codes recorded for tip and tip+PR merges  
- [x] Pairwise conflicts + fold order; #541 LAST guidance retained  
- [x] Report-only deliverable (no characterization tests required — emit + `BoardCell` field audit sufficed)  

---

## Tip-owner application (post-review)

Applied to tip `#477` per this report:

1. **`#553`:** no additional product fold. Comment posted: `superseded by tip #477 (#544+#551); see #561`. Left open as draft (not closed). Tip already carried a prior Batch-5 recut at ceiling **286** (never raised to 373).
2. **`#554` / `#555`:** already byte-identical on tip. Comments: `contained in tip #477; see #561`. Left open as drafts.
3. **`#556`:** union-folded earlier (`9370a30f`); tip §3 ui-helper / `#505` table kept.
4. **`#557`:** emit-identical 8/10 modules folded; held out non-identical:
   - `src/games/pent-em-in/rules.ts:200–207` BoardCell EOPT rebuild
   - `src/games/stars-bars/rules.ts:57–61` shuffle temp-swap
   Tip `#557` surface re-checked **10/10 emit-identical** vs pre-`#557` (`9370a30f`). Ceiling **286 → 220** (DOWN only).
5. This report folded onto tip with the docs batch.
6. Remaining queue still tracked on tip: docs `#549`/`#552`/`#556`/`#558`, storage `import type`, `rollup-plugin-visualizer`, `#552` 48-file provenance, `#541` dead-code recheck as FINAL.

# Type ratchet Phase 2 plan (AI / rules / games)

**Task (plan):** `burn-1007-mp-typeratchet-plan`  
**Task (Batch 0+1 implement):** `burn-1008-mp-type-ratchet-p2`  
**Task (Batch 2 compliant recut):** `burn-1008-mp-type-ratchet-batch2-compliant-recut` (supersedes #537 for folding)  
**Tip / base:** `cursor/integration-fold-wave5-tip-4af0`  
**Status:** Batches **0–4** + tip folds (#546/#544/#551/#553 surface) cleared non-AI UI/shell/types; Batch **6** (`#557`, after `#561`) folded emit-identical / pure `!` rules/engine (ceiling **286 → 220**); Batch **7** core EOPT widen + helper-test gate (ceiling **220 → 216**); Batch **8** locks remaining `*helpers*.test.ts` + script `.d.mts` ambients (product-safe pool exhausted; Phase-2 out-of-scope stays **216** AI-only) — see [`type-ratchet-batch-8.md`](./type-ratchet-batch-8.md). pent-em-in BoardCell EOPT rebuild held for Andrew. True eligible floor: AI modules (#560 option) + held rebuild. Deferred #537 nullish rewrites: [`type-ratchet-batch2-owner-decisions.md`](./type-ratchet-batch2-owner-decisions.md). Batch notes: [`type-ratchet-batch5.md`](./type-ratchet-batch5.md), [`type-ratchet-batch6.md`](./type-ratchet-batch6.md), [`type-ratchet-batch-7.md`](./type-ratchet-batch-7.md), [`type-ratchet-batch-8.md`](./type-ratchet-batch-8.md).
**Export / check script:** [`type-ratchet-phase2-export.mjs`](./type-ratchet-phase2-export.mjs) (`node docs/dev/type-ratchet-phase2-export.mjs` writes baseline; `--check` / `npm run typecheck:ratchet` fail if out-of-scope count rises).  
**Next batch:** Batch **A** — AI modules (Andrew gate / [#560](https://github.com/fuzzywigg/math-pentathlon/pull/560); Hex Hard 450ms assert stays).

**Companion:** [`type-ratchet-phase2-baseline.json`](./type-ratchet-phase2-baseline.json)

## Context

Phase 1 ([#498](https://github.com/fuzzywigg/math-pentathlon/pull/498)) added `tsconfig.ratchet.json` + `npm run typecheck:ratchet`. That check **fails only** on `src/ui`, `src/core`, and listed test helpers (now **0** in-scope errors). Game AI, rules engines, most `src/games/**`, demos, and `src/main.ts` stay **out of scope**.

Under the same ratchet flags (`noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`, plus the free strict flags), tip currently reports **564** out-of-scope errors (Phase 1 noted ~570; delta is from later folds on tip).

This document proposes how to clear those 564 without changing student-facing AI behavior or rules scoring — and how to keep a **report-only ceiling** so counts can only go down.

## Single reproduce command

```bash
npx tsc --noEmit -p tsconfig.ratchet.json --pretty false 2>&1 | tee /tmp/type-ratchet-phase2-raw.txt | rg -c "error TS"
```

**Expected:** `433` out-of-scope after Batch 2 compliant recut (must match `outOfScopeErrors` in the baseline JSON). Plan snapshot was **564**; after Batch 0+1 / tip folds **520**; Batch 2 clears **87** non-AI errors (type-only).

Verify against the committed baseline:

```bash
node --input-type=module -e 'import fs from "node:fs"; const b=JSON.parse(fs.readFileSync("docs/dev/type-ratchet-phase2-baseline.json","utf8")); const n=fs.readFileSync("/tmp/type-ratchet-phase2-raw.txt","utf8").split("\n").filter(l=>/error TS\d+:/.test(l)).length; if(n!==b.outOfScopeErrors){console.error("MISMATCH raw="+n+" baseline="+b.outOfScopeErrors); process.exit(1);} console.log("OK outOfScopeErrors="+n);'
```

Sanity (Phase 1 + Batch 0/1 in-scope still green):

```bash
npm run typecheck:ratchet
# in-scope errors: 0 ; out-of-scope errors: 433 ; Phase-2 ceiling holds
```

Plan capture on tip `b0d71db6`: **564** / **0** in-scope. After Batch 0+1 (`burn-1008-mp-type-ratchet-p2`): **518** / **0** in-scope (later tip folds → **520**). After Batch 2 compliant recut (`burn-1008-mp-type-ratchet-batch2-compliant-recut`): **433** / **0** in-scope.

## Totals snapshot

| Slice | Count |
| --- | ---: |
| Out-of-scope (Phase 2 surface, after Batch 2) | **433** |
| After Batch 0+1 / tip folds | 520 |
| Plan snapshot (pre Batch 0+1) | 564 |
| In-scope under ratchet (must stay 0) | **0** |
| `noUncheckedIndexedAccess` (NUI) | 526 |
| `exactOptionalPropertyTypes` (EOPT) | 37 |
| Other | 1 |

### By error code

| Code | Count | Typical meaning under ratchet |
| --- | ---: | --- |
| TS18048 | 199 | Named value possibly `undefined` |
| TS2532 | 183 | Object possibly `undefined` (index/access) |
| TS2322 | 88 | Assignability (`T \| undefined` or EOPT) |
| TS2345 | 47 | Arg not assignable (`undefined` → `T`) |
| TS2379 | 34 | EOPT argument optionality mismatch |
| TS2339 | 4 | Property on `T \| undefined` |
| TS2375 | 3 | EOPT object-literal optionality |
| TS2722 | 3 | Invoke possibly `undefined` |
| TS2538 | 2 | `undefined` as index type |
| TS2488 | 1 | Possibly-undefined not iterable |

### By file kind

| Kind | Count | Notes |
| --- | ---: | --- |
| `ai` | **219** | `ai.ts` / `ai-client.ts` / `ai.worker.ts` — **behavior-sensitive** |
| `rules` | 131 | Rules engines — escalate if scoring/end conditions could change |
| `types` | 94 | Mostly `prime-gold/types.ts` (65) + small game type files |
| `board-ui` | 80 | Game board UI (not Phase 1 `src/ui`) |
| `demo` | 23 | `src/demos/*` |
| `engine-support` | 11 | e.g. kings `game-state` / `board` |
| `ui` | 4 | game-controller / layout |
| `entry` | 2 | `src/main.ts` |

### Root-cause buckets (fix patterns)

| Bucket | Count | Safe fix pattern (preferred) |
| --- | ---: | --- |
| **NUI** | 526 | Local guards (`if (x === undefined) continue/return`), non-null after length checks, `?.` + early exit, typed helpers that preserve runtime |
| **EOPT** | 37 | Build optionals with conditional spread (`...(x !== undefined ? { x } : {})`); widen optional props to `T \| undefined` only when runtime already allows missing-or-undefined |
| **OTHER** | 1 | One-off assignability — inspect before touching |

**Hard rule for implementers:** annotation / narrowing / construction only. No heuristic, difficulty, search-depth, move-ordering, or scoring changes. If a fix would change which move the AI picks or how points are awarded → **stop and ask Andrew**.

## Per-game error counts

Sorted ascending by total (smallest first). Full per-file / per-code / per-error detail is in [`type-ratchet-phase2-baseline.json`](./type-ratchet-phase2-baseline.json).

| Game | Total | AI | Rules | Types | Board-UI | Other | NUI | EOPT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| remainder-islands | 6 | 4 | 0 | 1 | 1 | 0 | 5 | 1 |
| star-track | 9 | 6 | 0 | 2 | 0 | 1 | 7 | 2 |
| frac-fact | 11 | 4 | 7 | 0 | 0 | 0 | 11 | 0 |
| hex-a-gone | 11 | 9 | 1 | 0 | 1 | 0 | 10 | 1 |
| par-55 | 14 | 8 | 1 | 2 | 3 | 0 | 13 | 1 |
| fraction-pinball | 15 | 2 | 13 | 0 | 0 | 0 | 15 | 0 |
| fiar | 16 | 12 | 1 | 2 | 1 | 0 | 11 | 5 |
| ramrod | 20 | 8 | 6 | 4 | 2 | 0 | 19 | 1 |
| pent-em-in | 23 | 12 | 7 | 1 | 3 | 0 | 21 | 1 |
| queens-guards | 23 | 6 | 14 | 2 | 1 | 0 | 19 | 4 |
| fab-a-diffy | 24 | 20 | 1 | 2 | 1 | 0 | 20 | 4 |
| juggle | 25 | 18 | 2 | 0 | 4 | 1 | 23 | 2 |
| kwatro-sinko | 27 | 15 | 9 | 0 | 3 | 0 | 26 | 1 |
| sum-dominoes | 27 | 8 | 14 | 2 | 1 | 2 | 27 | 0 |
| hex | 32 | 17 | 11 | 0 | 4 | 0 | 27 | 5 |
| calla | 34 | 15 | 17 | 0 | 2 | 0 | 33 | 1 |
| kings-quadraphages | 40 | 11 | 1 | 0 | 17 | 11 | 38 | 2 |
| contig-60 | 42 | 19 | 4 | 11 | 8 | 0 | 41 | 1 |
| stars-bars | 53 | 18 | 12 | 0 | 23 | 0 | 52 | 1 |
| prime-gold | 87 | 7 | 10 | 65 | 5 | 0 | 86 | 1 |
| *(non-game)* demos + `main.ts` | 25 | 0 | 0 | 0 | 0 | 25 | 22 | 3 |

Notes: `pent-em-in` also has 1 `OTHER` (not NUI/EOPT). `kings-quadraphages` / `star-track` / `juggle` / `sum-dominoes` “Other” includes engine-support or controller files (`byKind` in the baseline JSON).

## Proposed batch order

Principle: **smallest / safest first**; **AI search & scoring files last**, each flagged **`needs Andrew: behavior-sensitive`**.

Estimates are engineering size (files touched + error volume + review risk), not calendar time. Prefer annotation-only PRs that keep `npm run typecheck` green and do not expand the Phase 1 fail-scope until a batch is fully clean.

### Batch 0 — Demos + entry (warm-up)

| Item | Errors | Risk |
| --- | ---: | --- |
| `src/demos/*`, `src/main.ts` | 25 | Low — not student game logic |

**Estimate:** XS (~25 errors, 4 files).  
**Exit:** those paths at 0 under ratchet flags; baseline totals updated downward.

### Batch 1 — Tiny non-AI game shells (types / board-ui / controller only)

Fix **non-AI** files only, smallest games first:

| Game | Non-AI errors | Notes |
| --- | ---: | --- |
| remainder-islands | 2 | types + board-ui |
| hex-a-gone | 2 | rules(1) + board-ui |
| star-track | 3 | types + controller |
| fab-a-diffy | 4 | types/board-ui/rules (leave `ai*`) |
| fiar | 4 | types/board-ui/rules (leave `ai*`) |
| par-55 | 6 | types/board-ui/rules |

**Estimate:** S (~21 errors).  
**Defer:** all `ai*` in these games.

### Batch 2 — Rules-heavy / low-AI games (rules + types + board-ui; still no AI) — **DONE (compliant recut)**

| Game | Non-AI | AI deferred |
| --- | ---: | ---: |
| frac-fact | 7 → 0 | 4 |
| fraction-pinball | 13 → 0 | 2 |
| queens-guards | 17 → 0 | 6 |
| ramrod | 12 → 0 | 8 |
| sum-dominoes | 19 → 0 | 8 |
| calla | 19 → 0 | 15 |

**Estimate:** M (~87 non-AI errors). **Cleared** under `burn-1008-mp-type-ratchet-batch2-compliant-recut` via non-null assertions / EOPT omit-spreads only (supersedes #537). Deferred `#537` `??` / early-return rewrites: [`type-ratchet-batch2-owner-decisions.md`](./type-ratchet-batch2-owner-decisions.md).  
**Escalate:** any `rules.ts` change that is not a pure type annotation — AGENTS.md flags scoring/end-condition edits for humans.

### Batch 3 — Medium games non-AI remainder

| Game | Non-AI | AI deferred |
| --- | ---: | ---: |
| juggle | 7 | 18 |
| pent-em-in | 11 | 12 |
| kwatro-sinko | 12 | 15 |
| hex | 15 | 17 |
| contig-60 | 23 | 19 |
| kings-quadraphages | 29 | 11 |
| stars-bars | 35 | 18 |

**Estimate:** L (~132 non-AI errors). Stars-bars board-ui (23) and contig types/board-ui are the volume.

### Batch 4 — `prime-gold` types mountain (still no AI)

| Path | Errors | Notes |
| --- | ---: | --- |
| `src/games/prime-gold/types.ts` | 65 | Dominant file; mostly NUI on optional/indexed shapes |
| other prime-gold non-AI | 15 | rules + board-ui |
| prime-gold `ai.ts` | 7 | **defer to Batch A** |

**Estimate:** L (~80 non-AI). Types changes can cascade — keep PR to types+call-site construction only; run unit suite for prime-gold.

### Batch A — AI search / scoring (**LAST**, needs Andrew)

**Flag every file:** `needs Andrew: behavior-sensitive`

| Game | AI errors | Primary files |
| --- | ---: | --- |
| fraction-pinball | 2 | `ai.ts` |
| frac-fact | 4 | `ai.ts` |
| remainder-islands | 4 | `ai.ts` |
| queens-guards | 6 | `ai.ts` + client/worker |
| star-track | 6 | `ai.ts` |
| prime-gold | 7 | `ai.ts` |
| par-55 | 8 | `ai.ts` |
| ramrod | 8 | `ai.ts` |
| sum-dominoes | 8 | `ai.ts` |
| hex-a-gone | 9 | `ai.ts` |
| kings-quadraphages | 11 | `ai.ts` |
| fiar | 12 | `ai.ts` + client/worker |
| pent-em-in | 12 | `ai.ts` |
| calla | 15 | `ai.ts` |
| kwatro-sinko | 15 | `ai.ts` |
| hex | 17 | `ai.ts` + client/worker |
| juggle | 18 | `ai.ts` |
| stars-bars | 18 | `ai.ts` |
| contig-60 | 19 | `ai.ts` |
| fab-a-diffy | 20 | `ai.ts` + client/worker |
| **AI total** | **219** | see baseline `behaviorSensitiveAiFiles` |

**Estimate:** XL (219 errors across ~28 AI modules). Split into sub-PRs of 1–3 games if needed, still AI-only, smallest AI count first.

**Required before merge of any Batch A PR:**

1. Andrew yes/no on starting AI files at all (see Open questions).
2. Seeded AI determinism / Hard≥Easy guards still pass (`npm run test:unit` filters for ai-determinism / calibration as applicable).
3. No heuristic / depth / weight edits — guards and types only.

### Suggested PR cadence

| Order | Batch | ~Errors | Ceiling update |
| --- | --- | ---: | --- |
| 1 | 0 demos/main | 25 | lower baseline totals + drop those files |
| 2 | 1 tiny non-AI | ~21 | same |
| 3 | 2 rules-heavy non-AI | ~87 | same |
| 4 | 3 medium non-AI | ~132 | same |
| 5 | 4 prime-gold non-AI | ~80 | same |
| 6+ | A AI (Andrew gate) | 219 | same; last |

After each merged batch: regenerate the reproduce command output and commit a **lower** `type-ratchet-phase2-baseline.json` (report-only). Never raise counts.

## Proposed report-only ratchet baseline

File: [`type-ratchet-phase2-baseline.json`](./type-ratchet-phase2-baseline.json)

| Field | Role |
| --- | --- |
| `totals.outOfScopeErrors` | Global ceiling (564) |
| `totals.byCode` / `byKind` / `byRootCause*` | Dimensional ceilings |
| `perGame.*.total` | Per-game ceiling |
| `perFile` | Per-file ceiling |
| `errors[]` | Full export (file, line, code, message, kind, root cause) |
| `behaviorSensitiveAiFiles` | AI list with Andrew flag |

**Policy (proposed, not wired to CI yet):**

1. Keep Phase 1 `npm run typecheck:ratchet` fail-scope unchanged until Andrew expands it.
2. Treat this JSON as a **report-only** ceiling: any Phase 2 fix PR must leave every count ≤ baseline.
3. Optionally later: a script that diffs raw `tsc` output vs this JSON and fails on regressions (still non-blocking in CI until promoted).

Do **not** promote `noUncheckedIndexedAccess` / `exactOptionalPropertyTypes` into main `tsconfig.json` until Phase 2 surface is near zero.

## What this plan deliberately does not do

- No edits under `src/`
- No AI heuristic / difficulty / search changes
- No rules scoring / end-condition changes
- No player-facing copy / tutorial / rules-text edits
- No visual baseline or gallery PNG regeneration
- No gzip/bundle budget bumps
- No CI job drops/renames; no Phase 1 ratchet scope expansion in this PR

## Open questions for Andrew (yes/no + recommendation)

1. **Approve Phase 2 batch order (0 → 4 non-AI, then A AI last)?**  
   **Recommendation: YES.** Matches “smallest/safest first” and keeps behavior-sensitive AI isolated.

2. **Allow annotation-only PRs into `rules.ts` without a separate rules review, as long as unit engine tests pass and runtime is unchanged?**  
   **Recommendation: YES** for guard/narrowing-only; **NO** if any scoring/end-condition expression changes.

3. **Gate all `ai.ts` / `ai-client.ts` / `ai.worker.ts` fixes on explicit per-PR Andrew approval (`needs Andrew: behavior-sensitive`)?**  
   **Recommendation: YES.**

4. **Wire the Phase 2 baseline JSON into CI as report-only (`continue-on-error`) after Batch 0, or wait until Batches 0–2 land?**  
   **Recommendation: WAIT until Batches 0–1 land** so the first CI signal is not a giant red report; then add report-only.

5. **Eventually expand `scripts/check-type-ratchet.mjs` IN_SCOPE to include cleaned games path-by-path?**  
   **Recommendation: YES, path-by-path after each game’s non-AI (and later AI) hits zero** — do not flip all of `src/games` at once.

6. **Promote ratchet flags into main `tsconfig.json` after Phase 2?**  
   **Recommendation: NO until out-of-scope is ~0 and a full unit+e2e pass is green on tip.**

## Tip fold note (wave5 `#477`)

After stacking `#514` (XSS/CSP) and other burn folds onto Batch 0+1, tip measured **520** out-of-scope (not AI edits). Baseline ceiling raised **518 → 520** to match the real post-fold count; counts may only go down from here. Batch 2 compliant recut lowered the ceiling **520 → 433** (type-only; fold this instead of #537).
